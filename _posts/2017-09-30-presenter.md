---
layout: post
title:  "Path of automatic Presenter lifecycle implementation"
date:   2017-09-30
desc: "Evolution of MVP Presenter implementation for Android"
keywords: "Kotlin, Android, Lazy, Property delegation, MVP, Design Patterns, Presenter, View"
categories: [Android, Kotlin]
tags: [Kotlin, MVP]
icon: fa-code
---

I am using MVP pattern in nearly all my Android projects. One of most discussive element of MVP is how we are implementing
its inner lifecycle. Purists would argue that we should specify concrete methods each time, 
and explicitly call them in View:

```kotlin
interface MainView {
}

class MainPresenter(val view: MainView) {
    fun onCreateActivity() {
        // Do sth.
    }
}

class MainActivity : Activity(), MainView {

    private val presenter = MainPresenter(this)
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        presenter.onCreateActivity()
    }
}
```

Advantage of this approach is that we are explicitly defining what functions should be called. The problems are:
 * We need to define lifecycle every time we need it.
 * We need to call lifecycle methods explicitly in all Activities, Fragments etc.
Simpler approach is when we define lifecycle in `Presenter` interface:

```kotlin
interface Presenter {

    fun onCreate() {}

    fun onStart() {}

    fun onDestroy() {}

    fun onStop() {}

    fun onResume() {}
}
```

And its methods calls in `BaseActivityWithPresenter`:

```kotlin
abstract class BaseActivityWithPresenter : BaseActivity(), PresenterView {

    abstract val presenter: Presenter
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        presenter.onCreate()
    }

    override fun onStart() {
        super.onStart()
        presenter.onStart()
    }

    override fun onResume() {
        super.onResume()
        presenter.onResume()
    }

    override fun onStop() {
        super.onStop()
        presenter.onStop()
    }

    override fun onDestroy() {
        super.onDestroy()
        presenter.onDestroy()
    }
}
```

Big advantage is that we can now easily extract common Presenter behaviors in separate classes. For example, here is 
`RxPresenter` which is composing all `Disposable` and disposing them in `onDestroy`:

```kotlin
abstract class RxPresenter: Presenter {

    operator fun CompositeDisposable.plusAssign(disposable: Disposable) {
        add(disposable)
    }

    var subscriptions = CompositeDisposable()

    override fun onDestroy() {
        subscriptions.dispose()
    }
}
```

Using it, we can simply use RxJava in presenter while being sure that all subscriptions will be disposed when Activity is destroyed:

```kotlin
interface MainView {
    fun showUserData(user: User)
}

class MainPresenter(private val view: MainView) : RxPresenter() {

    private val userRepository by UserRepository.lazyGet()

    override fun onCreate() {
        subscriptions += userRepository.getUser()
                .applySchedulers()
                .subscribe(view::showUserData)
    }
}
```

Also, if we have some common behaviors, like error handling, we can implement it in `BaseActivity`, define in `BaseView` and extend it by all views needs its methods:

```kotlin
interface BaseView {
    fun showError(e: Throwable)
}

abstract class BaseActivityWithPresenter : BaseActivity(), PresenterView {
    
    fun showError(e: Throwable) {
        e.message?.let(this::toast)
        e.printStackTrace()
    }
    
    // ...
}

interface MainView: BaseView {
    fun showUserData(user: User)
}

class MainPresenter(private val view: MainView) : RxPresenter() {

    private val userRepository by UserRepository.lazyGet()

    override fun onCreate() {
        subscriptions += userRepository.getUser()
                .applySchedulers()
                .smartSubscribe(view::showUserData, view::showError)
    }
}
```

This is already big step forward - we have Presenter lifecycle defined, we can easily add common View methods and add 
common Presenters functionalities. Last problem is that we can define this way only single presenter per Activity. 
Presenter could be replaced with list of presenters, but it is making its usage harder:

```kotlin
abstract class BaseActivityWithPresenter : BaseActivity(), PresenterView {

    protected var presenters: List<Presenter> = emptyList()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        presenters.forEach { it.onCreate() }
    }

    override fun onStart() {
        super.onStart()
        presenters.forEach { it.onStart() }
    }

    override fun onResume() {
        super.onResume()
        presenters.forEach { it.onResume() }
    }

    override fun onStop() {
        super.onStop()
        presenters.forEach { it.onStop() }
    }

    override fun onDestroy() {
        super.onDestroy()
        presenters.forEach { it.onDestroy() }
    }
}

class MainActivity : Activity(), MainView, LoginView {

    private val mainPresenter = MainPresenter(this)
    private val loginPresenter = LoginPresenter(this)
    
    override fun onCreate(savedInstanceState: Bundle?) {
        presenters += mainPresenter
        presenters += loginPresenter
        super.onCreate(savedInstanceState)
        loginButton.setOnClickListener { loginPresenter.onLoginClicked() }
    }
}
```

Instead, we might define property delegate to create presenter and add it to list of presenters. To make Activity 
creation more efficient, we might want o make presenter creation lazy:

```kotlin
abstract class BaseActivityWithPresenter : BaseActivity(), PresenterView {

    fun presenter(init: ()->Presenter) = lazy(init).also { lazyPresenters += it }
    
    private var lazyPresenters: List<Lazy<Presenter>> = emptyList()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        lazyPresenters.forEach { it.value.onCreate() }
    }

    override fun onStart() {
        super.onStart()
        lazyPresenters.forEach { it.value.onStart() }
    }

    override fun onResume() {
        super.onResume()
        lazyPresenters.forEach { it.value.onResume() }
    }

    override fun onStop() {
        super.onStop()
        lazyPresenters.forEach { it.value.onStop() }
    }

    override fun onDestroy() {
        super.onDestroy()
        lazyPresenters.forEach { it.value.onDestroy() }
    }
}

class MainActivity : Activity(), MainView, LoginView {

    private val mainPresenter by presenter { MainPresenter(this) }
    private val loginPresenter by presenter { LoginPresenter(this) }
        
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        loginButton.setOnClickListener { loginPresenter.onLoginClicked() }
    }
}
```

Last approach is finally connecting functionality and simplicity. This is also an approach that I am using currently in
my projects. I hope that this article inspired to make MVP simpler to use. 