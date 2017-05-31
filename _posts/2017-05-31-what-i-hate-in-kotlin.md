---
layout: post
title:  "What do I hate in Kotlin"
date:   2017-05-31
desc: "After years of romance."
keywords: "Kotlin"
categories: [Kotlin]
tags: [Kotlin]
icon: fa-ban
---

#### What do I hate in Kotlin

I love Kotlin. It is the best language I ever learned, and I really enjoy writing applications in it since over 2 years.
After all, like in even the best old marriage, I have a bunch of stuff that I hate and I know that most of them won't change.
Most of them are not a big problems and they are it is hard to fall into them.
Still, they are there, and they are Kotlins fly in the ointment.

# The legacy of Java

Do you know what is the result of: (compiled to JVM)

```kotlin
println(4.64F - 2.64F)
println(4.64 - 2.64)
```

answer is:

```
1.9999998
1.9999999999999996
```

This is not a Kotlin problem, but result of JVM bytecode operation and it comes from why how Float and Double are preserved.
It is just one way how Java legacy is influancing Kotlin excecution. But there are bigger problems. For example, that
[extensions are resolved statically](https://kotlinlang.org/docs/reference/extensions.html#extensions-are-resolved-statically).
This is a big problem, and I hope to write whole article just about it. For now- it is just problematic and unintuitive.
But it was designed this way because then extension functions are simply compiled to static functions with receiver on first
parameter. But now it needs to be implemented the same way in Kotlin\JavaScipt and Kotlin\Native. Just great.

# Minus operator problems and other unintuitive operation results

Let's look at this operation:

println(listOf(2,2,2) - 2) // [2, 2]

Result is intuitive- we are removing element from list so we get list without it. Now let's look at this operation:

println(listOf(2,2,2) - listOf(2))

What is the result? Empty list! Pretty unintuitive, and I [report it over a year ago](https://youtrack.jetbrains.com/issue/KT-11453).
But the answer was "As Designed". It is true, while function description is following:

```
/*
// Returns a list containing all elements of the original collection except the elements contained in the given [elements] collection.
*/
```

But it doesn't make it's behavior better. Let's look at some more unintuitive results:

```
"1".toInt() // 1
'1'.toInt() // 49 - its ASCII code
```

Or this, which is the most complex to understand: (thanks to (Maciej Górski)[https://github.com/mg6maciej] for showing it to me)

```
1.inc() // 2
1.dec() // 0
-1.inc() // -2
-1.dec() // 0
```

Two last results are strange, aren't they? The reason is that minus is not a part of the number, but unary extension function
to Int. This is why this two last lines are the same as:

```
1.inc().unaryMinus()
1.dec().unaryMinus()
```

This is also as designed, and it wont change. Also, some will argue that it is how is how is should act. Lest suppose that we made space behind Int:

```
- 1.inc() // -2
- 1.dec() // 0
```

Now it looks rational. How it should be used? Number should be in bracket together with minus.

```
(-1).inc() // 0
(-1).dec() // -2
```

From rational point of view it is ok, but I think that everyone feels that `-2` should be a number, not `2.unaryMinus()`.

# Tuples vs SAM

Kotlin resigned from tuples and left just Pair and Triple. The reason was that there should be data classes used instead.
What is the difference? Data class contains name, and all properties are named too. Except that, it can be used like tuple:

```
data class Student(
        val name: String,
        val surname: String,
        val passing: Boolean,
        val grade: Double
)

val (name, surname, passing, grade) = getSomeStudent()
```

It the same time, Kotlin added support to Java SAM (Simple Abstract Method) by generation of lambda constructor and methods
that containing lambda methods instead of Java SAM:

```
view.setOnClickListener { toast("Foo") }
```

But it is not working for SAM defined in Kotlin, because it is suggested to use functional types instead. What is the difference
between SAM and functional type? SAM have also name and its parameters are named. Sure, from Kotlin 1.1 it can be replaced with typealias:

```
typealias OnClick = (view: View)->Unit
```

But I still feel that there is lack of symmetry. If it is strongly suggested to use named data classes and tuples are prohibited, then
why it is suggested to use functional types instead of SAM and Kotlin SAM are not supported? Possible answer is that tuples are making more
problems then good in real-life projects. JetBrains have a lot of data about languages usage and they know how to analyze it.
And that thet are right. I just base on feeling that it would be better if programmer could decide if he want to use them or data class.
And it is not isolationism, because tuples are implemented in most modern languages.

# Isolationism

There are multiple Kotlin extensions to any object and I see lot's of creativity in their usege. In Kotlin, you can
replace this definition:

val list = if(student != null) {
    getListForStudent(student)
} else {
    getStandardList()
}

With this:

```
val list = student?.let { getListForStudent(student) } ?: getStandardList()
```

Ok, is is shorter and looks good. Also, when there are some other conditions added then we can still use it:

```
val list = student?.takeIf { it.passing }?.let { getListForStudent(student) } ?: getStandardList()
```

But it is really better then simple, old if condition?

```
val list = if(student != null &&  student.passing) {
    getListForStudent(student)
} else {
    getStandardList()
}
```

I do not judge, but the fact is that implementation that is stronglu using all Kotlin extensions are hard and unintuitive
who are not Kotlin developers. This kind of features are making Kotlin harder and harder for beginners. The big change comes with
Kotlin Coroutines. It is great feature. When I started learning it then through whole day I was repeating "incretable" and "wow".
It is awesome how Kotlin Coroutines are making multithreading so simple, I feel that is this should be designed this way from the beginning.
Still, it is complex to understand Kotlin Coroutines, and it is far away from how it is implemented in other technologies.
It community will start strongly using Coroutines, then it will be another barber for programmers from other languages to jump in. This
leads to isolationism. And I feel that it is too early for that. Right now Kotlin is becoming more and more popular in Android and Web, and it just
started to be used in JavaScript and compiled to Native. And I think that this diversification is now much more important, and introduction
of Kotlin specific features should start later. Right now there is still a lot of work to od in Kotlin\JavaScript and Kotlin\Native.

# Summary

This are, in fact, just a small things. It is nothing comparing to what can be found in JavaScript, PHP or Ruby.
Kotlin was well designed from the beginning, and it is a solution to a lot of problems.  Just some small stuff that didn't go well enough.
Still it is and it will be for at least few years my most favourite language.