---
layout: post
title:  "FindMyPhone in 2 days?"
date:   2017-05-04
desc: "How I made FindMyPhone in 2 days using Firebase."
keywords: "Android, Kotlin, Firebase"
categories: [Android, Kotlin]
tags: [Firebase, Kotlin, Android]
icon: fa-mobile
---

#### FindMyPhone in 2 days?

I was surprised how easy to use Firebase is. I wanted to test its abilities like login, a database with authentication, hosting and notifications.  So I invented a project that would use more them all. The idea was simple: User starts app and login using Google Authentication. If he lost his phone then he just needs to go to findmyphone.fun website, login into the same account and then click "FindMyPhone" so start alarm even if the phone is muted. It took me 2 days to write it. 


{% include youtubePlayer.html id="qWi_ElqcooI" %}


App was released and can be found on [google play](https://play.google.com/store/apps/details?id=com.marcinmoskala.findmyphone).


Code od Android application can be found here: 
[https://github.com/MarcinMoskala/FindMyPhone](https://github.com/MarcinMoskala/FindMyPhone)


It is written in Kotlin. The hardest part was Google Authentication part. It all can be found [here](https://github.com/MarcinMoskala/FindMyPhone/blob/master/app/src/main/java/com/marcinmoskala/findmyphone/presentation/main/GoogleLoginController.kt). This authentication is pretty complex comparing to Facebook or VK login. I was doing it in the past without Firebase and I remember it as a big pain. But this time it took about 15 minutes to make it work thanks to Firebase support. Firebase project created in 3 clicks, JSON and Gradle plugin with all data added automatically.  Still pretty magical, which I don't really like, but it is 
working.


{% include img.html name="firebase_support.PNG" %}


Notifications also were simple with Firebase. I just needed to define service and that's it. There is magic there I don't like: If you define notification fields in sent notification and app is in the background, then it is shown as notification no matter what service is saying. Not only wired to me, but also pretty insecure. If somebody would steal the Token, then he could be able to send whatever notification he likes. Again: magic but it is working in no time.


```kotlin
class RefreshTokenService : FirebaseInstanceIdService() {

    override fun onTokenRefresh() {
        val refreshedToken = FirebaseInstanceId.getInstance().token ?: return
        saveToken(refreshedToken)
    }
}
```


The database from Android perspective is also really simple. Firebase database looks like a big map from String to String or another map. Sound scary for the bigger project, but perfect for small projects made for fun. The tricky part is how to secure it. The easiest way is to identify used by his UID and allow read and write only to branch with that UID:


```kotlin
{
  "rules": {
    "$uid": {
      ".write": "$uid === auth.uid",
      ".read": "$uid === auth.uid"
    }
  }
}
```


Here is the code used to save token.:


```kotlin
FirebaseDatabase
        .getInstance()
        .getReference(uid)
        .setValue(token) 
```


It is just setting branch to one equal to user UID (getReference(uid)) and then setting it's value to token (setValue(token)).


This are most tricky parts on the Android side. Time to make some hosting. Again: few clicks and it is alive. To make files locally all I needed is:


```
firebase init
```

then I can make changes and deploy it on 

```
firebase deploy
```

or run locally by

```
firebase serve
```


Making Google Authentication is not so simple, but there are libraries that are making it easy. I used firebaseui. It took few hours to make it work, but when I did then the project was nearly ready. Notification sending is pretty easy because it is only one request to Google. Although I don't like lack of support for that in all these firebase libraries. And weak documentation. Finally, I made it work in 2 days. Like in hackathons, but alone.


As a conclusion, I feel that Firebase is designed to be perfect tools for Hackathons. It is simple and fast. Perfect for small projects. Really magical. I would be really careful before using it in an app designed for millions of users.