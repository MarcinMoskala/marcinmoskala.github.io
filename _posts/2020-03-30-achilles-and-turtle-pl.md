---
layout: post
title:  "Achilles i żółw"
date:   30-03-2020
desc: "Dwa słowa o znanej zagadce"
keywords: 
categories: []
tags: []
icon: 
lang: pl
---

W piątym wieku przed naszą erą znany filozof Zenona z Elei usilnie próbował pokazać niemożność istnienia wielości rzeczy i ruchu. Zamiast tego przyczynił się do rozwinięcia nauki która zaczęła się interesować ciągami nieskończonymi. Zobaczmy czego dziś może nas nauczyć, oraz czy Achilles zdoła przegonić żółwia. 

Zacznijmy popularnego paradoksu Zenona (Zenka) o Achillesie i Żółwiu:

> Achilles i żółw stają na linii startu wyścigu na dowolny, skończony dystans. Achilles potrafi biegać 2 razy szybciej od żółwia i dlatego na starcie pozwala oddalić się żółwiowi o 1/2 całego dystansu. Achilles, jako biegnący 2 razy szybciej od żółwia, dobiegnie do 1/2 dystansu w momencie, gdy żółw dobiegnie do 3/4 dystansu. W momencie gdy Achilles przebiegnie 3/4 dystansu, żółw znowu mu „ucieknie”, pokonując 7/8 dystansu. Gdy Achilles dotrze w to miejsce, żółw znowu będzie od niego o 1/16 dystansu dalej, i tak w nieskończoność. Wniosek: Achilles nigdy nie dogoni żółwia, mimo że biegnie od niego dwa razy szybciej, gdyż zawsze będzie dzieliła ich zmniejszająca się odległość. [[Wikipedia]](https://pl.wikipedia.org/wiki/Paradoksy_Zenona_z_Elei)

Z matematycznego punktu widzenia nie jest to trudny problem. Jeśli dystans nazwiemy d, a prędkość żółwia v, lokalizację Achillesa możemy określić następującym wzorem:

<p>
$$x = v*2 * t$$
</p>

Gdzie t to czas. Tymczasem lokalizację żółwia:

<p>
$$x = d/2 + v * t$$
</p>

W momencie w którym Achilles dogoni żółwia to ich x będą równe. Oznacza to więc że wtedy:

<p>
$$v*2*t = d/2 + v * t$$
</p>

<p>
$$t = 2d/v$$
</p>

<p>
$$x = d$$
</p>

Wynika z tego że Achilles dogoni jednak żółwia. Takie podejście może być jednak traktowane jak małe oszustwo. Nie tak Zenon sformułował problem. Przeanalizujmy więc problem jego sposobem. Za pierwszym razem Achilles przebiegł dystans d/2. Następnie d/4, potem d/8, d/16 itd. Widać że kolejne dystanse są wyraźnie coraz mniejsze i opisane są równaniem (dla n = 0, 1, 2, ...):

<p>
$$\frac{d}{2^{n}}$$
</p>

Cały dystans to suma tych dystansów cząstkowych. Ile ich jest? Jak już ustaliliśmy nieskończoność. Łączny dystans opisany jest więc następującym równaniem:

<p>
$$\frac{d}{2} + \frac{d}{4} + \frac{d}{8} + \frac{d}{16} + \frac{d}{2^n} + ... = \sum_{n=1}^{\infty} \frac{d}{2^{n}}$$
</p>

Nieskończona liczba fragmentów składa się na tę sumę, wynik jednak nie jest nieskończony. Kolejne części maleją szybciej niż wnoszą one do sumy. Pomyślmy o wyniku relatywnie do d. Jak szybko się do niego przybliżamy? Po pierwszym etapie Achilles przebył 0.5 dystansu. Po drugim 0.75. Po trzecim 0.875, następnie 0.9375, 0.96875, 0.984375 i 0.9921875. Po dziesiątym 0.9990234375. Wyraźnie zbliżamy się do długości dystansu ale nie możemy jej przekroczyć. Po 100 etapie jest to już 30 dziewiątek po zerze. Jak dużo etapów potrzebujemy bo osiągnąć cały dystans? Odpowiedź to dokładnie nieskończoność. 

Sumę tego ciągu można określić wizualnie. Wystarczy że narysujesz kwadrat. Następnie przedzielisz go na dwie równe części. Następnie jedną z tych części podzielisz na 2 równe części i tak dalej. Mógłbyś dzielić tak w nieskończoność i na koniec uzyskałbyś kwadrat a w nim kolejne prostokąty z czego każdy 2 razy mniejszy.

Poprzez taki prosty wizualny dowód wiemy że ta suma wynosi 1 a więc Achilles dogoni żółwia po dystansie d.

<p>
$$\sum_{n=1}^{\infty} \frac{d}{2^{n}} = d$$
</p>

Ten przykład jest mało realistyczny. Zakładałbym że Achilles będzie więcej niż 2 razy szybszy od żółwia. Dla ustalenia uwagi załóżmy że jest on 10 razy szybszy a żółw ma przewagę proporcjonalnie taką samą czyli d/10. W jakim miejscu Achilles go dogoni? Za pierwszym razem przebiegnie on 0.1d, potem 0.01d, potem 0.001d, następnie 0.0001d, 0.00001d etc. Łatwo się domyślić że przebiegnięty dystans będzie stanowił 0.11111... d, o czym mówimy 0 i 1 w okresie d, a zapisujemy jako 0.1(1)d.

Wiemy więc w jakim czasie Achilles dogoni żółwia w przypadku kiedy jest od niego 2 razy oraz 10 razy szybszy. Co jednak w innych przypadkach?

Wiemy że wzór na odległość po jakiej Achilles dogoni żółwia jest następujący: 

<p>
$$\sum_{n=1}^{\infty} \frac{d}{p^{n}} = \frac{d}{p} + \frac{d}{p^2} + \frac{d}{p^3} + ...$$
</p>

Gdzie p to o ile razy Achilles jest szybszy od żółwia. Ile wyniesie ta suma? Obliczenie sumy ciągu nieskończonego potrafi być skomplikowane. Zazwyczaj jednak pomaga jedna prosta sztuczka. Nazwijmy wynik tego sumowania R. 

<p>
$$Z = \frac{d}{p} + (\frac{d}{p^2} + \frac{d}{p^3} + ...) = \frac{d}{p} + \frac{1}{p}(\frac{d}{p} + \frac{d}{p^2} + \frac{d}{p^3}) + ... = \frac{d}{p} + \frac{1}{p}Z$$

$$Z = \frac{d}{p} + \frac{1}{p}Z$$

$$Z - \frac{1}{p}Z = \frac{d}{p}$$

$$\frac{p - 1}{p}Z = \frac{d}{p}$$

$$Z = \frac{d}{p - 1}$$
</p>

Czy ta formuła jest poprawna? Sprawdźmy. W pierwszym przypadku p wynosiło 2, więc Achilles powinien dogonić żółwia w d. Zgadza się to z poprzednimi wyliczeniami. W drugim przypadku p wynosiło 10. Achilles powinien więc dogonić żółwia po 1/9 d, a więc po 0.1(1)d. Znów formuła się zgadza.

Okazuje się że zawsze jak tylko Achilles będzie szybszy od żółwia to będzie go w stanie dogonić. Intuicja się więc zgadza, a Zenon z Elei się mylił. Aby rozwiązać jego zagadkę musieliśmy jednak sięgnąć po ciągi nieskończone i dzięki temu nauczyliśmy się czegoś nowego.