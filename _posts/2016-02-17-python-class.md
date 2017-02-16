---
layout: post
title:  "Python Title"
date:   2016-02-17
desc: "Python Desc"
keywords: "Python,metaclass"
categories: [Android, Kotlin, Life, Productivity]
tags: [metaclass]
icon: icon-python
---

#### KOKO

Jako


``` python
class Hello(object):
    def hello(self, name='world'):
        print('Hello, %s.' % name)
```

Tako

```
>>> from hello import Hello
>>> h = Hello()
>>> h.hello()
Hello, world.
>>> print(type(Hello))
<type 'type'>
>>> print(type(h))
<class 'hello.Hello'>
```
