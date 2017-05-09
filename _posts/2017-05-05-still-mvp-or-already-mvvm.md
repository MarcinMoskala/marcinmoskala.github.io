Everyone who applied clean MVP in the Android project knows, that it is not so simple. MVP is great because it allows us to unit-test presentation logic and separates it from view logic. Remember, that is nearly impossible to test Activity by unit-tests, while Presenter should be designed to allow that. This is why Presenter cannot contain any view elements (like Button, EditText etc.). The Presenter should apply changes on the View by invoking methods that are specified by an interface, which is in standard approach implemented by Activity or mocked by unit tests. Example

```kotlin
interface MainView: PresenterBaseView {
    fun showToast(text: String)
}
```

```kotlin
class MainActivity : BaseActivity(), MainView {

    override fun showToast(text: String) {
        toast(text)
    }
}
```

```kotlin
class MainPresenter(val view: MainView) {

    fun onStart() {
        view.showToast("I am working")
    }
}
```

Also, clean guidelines are saying, that Activity should not depend on Data Model, so View methods should have just language basic types (Int, String) or mapper designed to pass bundle of data
(like in [Android-CleanArchitecture](https://github.com/android10/Android-CleanArchitecture/blob/master/presentation/src/main/java/com/fernandocejas/android10/sample/presentation/mapper/UserModelDataMapper.java))
The result is that Activity is often full of 3-line methods, that are just setting something on layout or checking some properties:

```kotlin
override fun getEmail() {
    return emailView.text.toString()
}

override fun setEmail(email: String) {
    emailView.text = email
}

override fun getEail() {
    return passwordView.text.toString()
}

override fun setPassword(password: String) {
    passwordView.text = name
}
```

This is problematic, because:
* Someone needs to write it all
* Maintenance of such an amount of code is problematic. Any change needs a lot of other changes
* Boilerplate generates information noise
* It makes classes looks big and complex while they are doing nearly nothing

Solution to this MVP problem was first implemented in C# by Microsoft, who made direct bindings from View 
to Presenter (called then ViewModel). This solution is minimalistic and elegant, but sadly still poorly supported in Android.
Lot's of passionates were really excited when Android added support for ViewBindings. It was some time ago and it is still weak. 
I tried it myself and I agree with other opinions from the community that it is still pretty disappointing. 

I feel, that there is no need for magic. While Kotlin introduced Property Delegation, view bindings can be simply implemented
without any annotation processing or any magic proxy. And this idea stands behind KotlinAndroidViewBindings library. 

Think about it this way: TextView is element of view, but from the presenter perspective, it is just field that contains some text. It is because it is the only important property for Presenter. Unless it also wants to change or read something else. Then it looks at View as text and some other property.

For example, TextView in XML looks following:
```
<TextView
    android:id="@+id/registerButton"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:gravity="center"
    android:padding="10dp"
    android:text="@string/action_go_to_register"
    android:textColor="@android:color/white" />
```

But from Presenter perspective is looks following:
```kotlin
interface MainView {
    var text: String
}
```

Do we need to set some onClickListener? Then it looks as follow:
```kotlin
interface MainView {
    var text: String
    var onTextClicked: ()->Unit
}
```

It would be problematic to implement all this setters and getters, but with KotlinAndroidViewBindings we can use Property Delegation to make bindings between properties and view element properties as simply as possible:

var text by bindToText(R.id.emailView)
var onTextClicked by bindToRequestFocus(R.id.emailView)

Time to some bigger example. For the need of presentation, I implemented login functionality. It is showing different errors and 
requesting focus if field is incorrect according to validation. It is also showing loading when using repository. All logic is placed on Presenter, which is well unit-tested. View definition is following:

```kotlin
interface LoginView {
    var progressVisible: Boolean
    var email: String
    val emailRequestFocus: ()->Unit
    var emailErrorId: Int?
    var password: String
    val passwordRequestFocus: ()->Unit
    var passwordErrorId: Int?
    var loginButtonClickedCallback: ()->Unit
    fun informAboutLoginSuccess(token: String)
    fun informAboutError(error: Throwable)
}
```

Pretty big, but note that these are minimal capabilities. We just defined quite a complex functionality (we can split it into multiple presenters or views with presenters, but I decided to skip it to keep example more typical). 

```kotlin
class LoginActivity : AppCompatActivity(), LoginView {

    override var progressVisible by bindToLoading(R.id.progressView, R.id.loginFormView)

    override var email by bindToTextView(R.id.emailView)
    override val emailRequestFocus by bindToRequestFocus(R.id.emailView)
    override var emailErrorId by bindToErrorId(R.id.emailView)

    override var password by bindToTextView(R.id.passwordView)
    override val passwordRequestFocus by bindToRequestFocus(R.id.passwordView)
    override var passwordErrorId by bindToErrorId(R.id.passwordView)

    override var loginButtonClickedCallback by bindToClick(R.id.loginButton)

    val presenter by lazy { LoginPresenter(this) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        presenter.onCreate()
    }

    override fun onDestroy() {
        super.onDestroy()
        presenter.onDestroy()
    }

    override fun informAboutLoginSuccess(token: String) {
        toast("Login succeed. Token: $token")
    }

    override fun informAboutError(error: Throwable) {
        toast("Error: " + error.message)
    }
}
```

And Presenter:

```kotlin
class LoginPresenter(val view: LoginView) {

    val loginUseCase by lazy { LoginUseCase() }
    val validateLoginFieldsUseCase by lazy { ValidateLoginFieldsUseCase() }
    var subscriptions: List<Subscription> = emptyList()

    fun onCreate() {
        view.loginButtonClickedCallback = { attemptLogin() }
    }

    fun onDestroy() {
        subscriptions.forEach { it.unsubscribe() }
    }

    fun attemptLogin() {
        val (email, password) = view.email to view.password
        subscriptions += validateLoginFieldsUseCase.validateLogin(email, password)
                .smartSubscribe(
                        onSuccess = { (emailErrorId, passwordErrorId) ->
                            view.passwordErrorId = passwordErrorId
                            view.emailErrorId = emailErrorId
                            when {
                                emailErrorId != null -> view.emailRequestFocus()
                                passwordErrorId != null -> view.passwordRequestFocus()
                                else -> sendLoginRequest(email, password)
                            }
                        },
                        onError = view::informAboutError
                )
    }

    private fun sendLoginRequest(email: String, password: String) {
        loginUseCase.sendLoginRequest(email, password)
                .applySchedulers()
                .smartSubscribe(
                        onStart = { view.progressVisible = true },
                        onSuccess = { (token) -> view.informAboutLoginSuccess(token) },
                        onError = view::informAboutError,
                        onFinish = { view.progressVisible = false }
                )
    }
}
```

And it is all easy to unit-test with mocked View: (full tests [here](https://github.com/MarcinMoskala/SimpleKotlinMvpBoilerplate/blob/master/app/src/test/java/com/marcinmoskala/simplekotlinmvpboilerplate/LoginPresenterTest.kt))
```kotlin
@Test
fun checkBothLoginFieldsEmpty() {
    val mockedView = MockedLoginView()
    val presenter = LoginPresenter(mockedView)
    presenter.onStart()
    mockedView.loginButtonClickedCallback.invoke()
    checkVaildity(mockedView,
            expectedEmailError = R.string.error_field_required,
            expectedPasswordError = R.string.error_field_required
    )
}
```

But what about initial question? Still MVP or already MVVM? Well, I am not sure. Too much philosophy. I prefer programming. And it is definitely useful. 