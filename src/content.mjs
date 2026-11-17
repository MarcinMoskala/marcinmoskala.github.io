// Single source of truth for the site. Text that differs by language is t(en, pl).
// Talks are in talks.json (language-neutral; places and labels are translated in strings.mjs).
export const t = (en, pl) => ({ en, pl });

export const site = {
  name: "Marcin Moskała",
  email: "marcinmoskala@gmail.com",
  domains: { en: "https://marcinmoskala.com", pl: "https://marcinmoskala.pl" },
  portrait: "/static/img/portrait.jpg",
  social: [
    { name: "kt.academy", url: "https://kt.academy" },
    { name: "GitHub", url: "https://github.com/MarcinMoskala" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/marcin-moskala/" },
    { name: "X", url: "https://x.com/marcinmoskala" },
  ],
};

export const books = {
  ek: { name: "Effective Kotlin", url: "https://kt.academy/book/effectivekotlin", cover: "/static/img/books/ek.jpg" },
  kc: { name: "Kotlin Coroutines: Deep Dive", url: "https://kt.academy/book/coroutines", cover: "/static/img/books/kc.jpg" },
  ke: { name: "Kotlin Essentials", url: "https://kt.academy/book/kotlin_essentials", cover: "/static/img/books/ke.jpg" },
  fk: { name: "Functional Kotlin", url: "https://kt.academy/book/functional_kotlin", cover: "/static/img/books/fk.jpg" },
  ak: { name: "Advanced Kotlin", url: "https://kt.academy/book/advanced_kotlin", cover: "/static/img/books/ak.jpg" },
  js: { name: "JavaScript od podstaw", url: "https://kt.academy/pl/book/js", cover: "/static/img/books/js.jpg" },
  py: { name: "Python od podstaw", url: "https://kt.academy/pl/book/py", cover: "/static/img/books/py.jpg" },
};

// Books shown on the home page shelf, per language.
export const shelf = { en: ["ek", "kc", "ke", "fk", "ak"], pl: ["py", "js", "ek", "kc", "ke"] };

export const about = {
  subtitle: t("I teach Kotlin and write books about it.", "Uczę Kotlina i piszę o nim książki."),
  bio: t(
    [
      `I founded <a href="https://kt.academy">kt.academy</a>, an official JetBrains training partner, and since 2017 I have been teaching Kotlin to developer teams at companies around the world. My books grew out of those workshops; the best known are <a href="https://kt.academy/book/effectivekotlin"><cite>Effective Kotlin</cite></a> and <a href="https://kt.academy/book/coroutines"><cite>Kotlin Coroutines: Deep Dive</cite></a>.`,
      `I have given over 70 talks, at conferences such as KotlinConf, droidcon, JavaZone and GeeCON. I also build small games that train you to read Kotlin code, and through <a href="/projects/#podaj-dalej">Podaj Dalej Programowanie</a> I have given away over 3,000 books to people who want to start programming.`,
    ],
    [
      `Założyłem <a href="https://kt.academy">kt.academy</a>, oficjalnego partnera szkoleniowego JetBrains, i od 2017 roku uczę Kotlina zespoły programistów w firmach na całym świecie. Z tych warsztatów wyrosły moje książki, z których najbardziej znane to <a href="https://kt.academy/book/effectivekotlin"><cite>Effective Kotlin</cite></a> i <a href="https://kt.academy/book/coroutines"><cite>Kotlin Coroutines: Deep Dive</cite></a>.`,
      `Wystąpiłem ponad 70 razy, m.in. na KotlinConf, droidconach, JavaZone i GeeCON. Robię też małe gry, które uczą czytania kodu w Kotlinie, a w akcji <a href="/projects/#podaj-dalej">Podaj Dalej Programowanie</a> rozdałem ponad 3000 książek osobom, które chcą zacząć programować. Napisałem też po polsku <cite>JavaScript od podstaw</cite> i <cite>Python od podstaw</cite>.`,
    ],
  ),
  contact: t(
    `Want me to speak at your event, run a workshop for your team, or join your podcast? Write to <a href="mailto:{email}">{email}</a>.`,
    `Chcesz zaprosić mnie na konferencję, zamówić warsztaty dla zespołu albo porozmawiać w podcaście? Napisz na <a href="mailto:{email}">{email}</a>.`,
  ),
};

export const projectGroups = [
  {
    id: "teaching",
    name: t("Teaching", "Edukacja"),
    items: [
      { name: "kt.academy", url: "https://kt.academy", meta: t("since 2017", "od 2017"),
        desc: t("Kotlin training company and official JetBrains training partner: corporate workshops, cohort courses, books, articles and a newsletter.",
                "Firma szkoleniowa z Kotlina, oficjalny partner szkoleniowy JetBrains: warsztaty dla firm, kursy kohortowe, książki, artykuły i newsletter.") },
      { name: t("Workshops for teams", "Warsztaty dla zespołów"), url: "https://kt.academy/courses", meta: t("on-site or remote", "stacjonarnie lub zdalnie"),
        desc: t("Kotlin for Developers, Kotlin Coroutines, Coroutines Intensive, Advanced Compose, Kotlin Mastery and more.",
                "Kotlin for Developers, Kotlin Coroutines, Coroutines Intensive, Advanced Compose, Kotlin Mastery i inne.") },
      { name: "Kotlin Cheat Sheets", url: "https://cheat-sheet.kt.academy", meta: t("free", "za darmo"),
        desc: t("Cheat sheets for Kotlin, Coroutines, Flow and Compose.", "Ściągawki z Kotlina, Coroutines, Flow i Compose.") },
      { name: t("Articles and newsletter", "Artykuły i newsletter"), url: "https://kt.academy/article", meta: "blog",
        desc: t("Hundreds of articles about Kotlin, continuing what used to be the largest Kotlin publication on Medium.",
                "Setki artykułów o Kotlinie — kontynuacja największej niegdyś publikacji o Kotlinie na Medium.") },
    ],
  },
  {
    id: "books",
    name: t("Books on Kotlin", "Książki o Kotlinie"),
    desc: t("The Kotlin for Developers series and more, on Leanpub, in print and in translation.",
            "Seria Kotlin for Developers i nie tylko — na Leanpub, w druku i w tłumaczeniach."),
    items: [
      { book: "ek", meta: t("best practices", "dobre praktyki"),
        desc: t("Best practices for Kotlin, as rules with the reasoning behind them. Also in Polish as “Efektywny Kotlin” (Helion).",
                "Dobre praktyki w Kotlinie w formie reguł z uzasadnieniem. Po polsku jako „Efektywny Kotlin” (Helion).") },
      { book: "kc", meta: "coroutines",
        desc: t("How coroutines and Flow work, and how to use them well. Also translated into Turkish.",
                "Jak działają coroutines i Flow i jak dobrze ich używać. Przetłumaczona także na turecki.") },
      { book: "ke", meta: t("fundamentals", "podstawy"),
        desc: t("The Kotlin language from the ground up, for developers who already code.",
                "Język Kotlin od podstaw, dla osób, które już programują.") },
      { book: "fk", meta: "FP",
        desc: t("Lambdas, collection processing, function types and Arrow.", "Lambdy, przetwarzanie kolekcji, typy funkcyjne i Arrow.") },
      { book: "ak", meta: t("advanced", "zaawansowane"),
        desc: t("Generics and variance, delegation, DSLs, reflection, KSP and compiler plugins.",
                "Generyki i wariancja, delegacja, DSL-e, refleksja, KSP i pluginy kompilatora.") },
      { name: "Kotlin Exercises", url: "https://leanpub.com/kotlin_exercises", meta: t("exercises", "ćwiczenia"),
        desc: t("Exercises and solutions from the books and workshops.", "Ćwiczenia i rozwiązania z książek i warsztatów.") },
      { name: "Android Development with Kotlin", url: "https://www.oreilly.com/library/view/-/9781787123687/", meta: "2017 · Packt",
        desc: t("My first book, co-written with Igor Wojda: an introduction to Kotlin on Android.",
                "Moja pierwsza książka, napisana z Igorem Wojdą: wprowadzenie do Kotlina na Androidzie.") },
    ],
  },
  {
    id: "other-books",
    name: t("Books in Polish", "Inne książki"),
    items: [
      { book: "py", name: "Python od podstaw / Python з нуля", meta: t("Polish · Ukrainian", "PL · UA"),
        desc: t("Learning to program in Python from zero. The Ukrainian edition was made to support Ukraine.",
                "Nauka programowania w Pythonie od zera. Wydanie ukraińskie powstało w ramach pomocy dla Ukrainy.") },
      { book: "js", meta: t("Polish", "PL"),
        desc: t("Programming from scratch, for complete beginners.", "Programowanie od zera, dla zupełnie początkujących.") },
      { name: "Myślenie krytyczne w praktyce", url: "https://leanpub.com/mylenie_krytyczne", meta: t("Polish", "PL"),
        desc: t("A book about critical thinking and judging arguments, with a companion game, Gra krytyczna.",
                "Książka o krytycznym myśleniu i ocenianiu argumentów, z towarzyszącą jej grą „Gra krytyczna”.") },
    ],
  },
  {
    id: "podaj-dalej",
    name: "Podaj Dalej Programowanie",
    desc: t("“Pass on programming”: we give away books for learning to program, and every reader passes their copy on to the next person.",
            "Rozdajemy książki do nauki programowania, a każdy czytelnik po lekturze przekazuje swój egzemplarz kolejnej osobie."),
    items: [
      { name: "Podaj Dalej: JavaScript od podstaw", url: "https://kt.academy/podajdalej", meta: t("2021 · 1st edition", "2021 · edycja 1"),
        desc: t("About 2,500 copies (1,500 of them funded by Allegro) for people who want to start programming.",
                "Ok. 2500 egzemplarzy (1500 z nich ufundowało Allegro) dla osób, które chcą zacząć programować.") },
      { name: "Podaj Dalej: Python od podstaw", url: "https://kt.academy/podajdalej2", meta: t("2023 · 2nd edition", "2023 · edycja 2"),
        desc: t("Books for children's hospitals, libraries, schools, job centres, social care centres and a prison.",
                "Książki dla szpitali dziecięcych, bibliotek, szkół, urzędów pracy, ośrodków pomocy społecznej i zakładu karnego.") },
      { name: "Podaj Dalej: Python з нуля", meta: t("2024 · Ukraine", "2024 · Ukraina"),
        desc: t("500 copies in Ukrainian, including for students of Kharkiv University.",
                "500 egzemplarzy po ukraińsku, m.in. dla studentów Uniwersytetu Charkowskiego.") },
      { name: "Czwartki z programowaniem", meta: "2022",
        desc: t("“Programming Thursdays”, a lecture series run with the student councils of SGH and the University of Warsaw.",
                "Cykl wykładów prowadzony z samorządami studentów SGH i Uniwersytetu Warszawskiego.") },
    ],
  },
  {
    id: "games",
    name: t("Kotlin games", "Gry Kotlinowe"),
    layout: "gallery",
    desc: t("Short browser games: guess what the code will do.", "Krótkie gry w przeglądarce: zgadnij, co zrobi kod."),
    items: [
      { name: "Coroutines Race Guesser", url: "https://game.kt.academy/?game=coroutines", image: "/static/img/games/coroutines.jpg",
        desc: t("In what order will the coroutines finish?", "W jakiej kolejności zakończą się coroutines?") },
      { name: "Collection Processing Guesser", url: "https://game.kt.academy/?game=collection-processing", image: "/static/img/games/collections.jpg",
        desc: t("What will this collection processing return?", "Jaki będzie wynik operacji na kolekcjach?") },
      { name: "Modifier Order Guesser", url: "https://game.kt.academy/?game=modifiers", image: "/static/img/games/modifiers.jpg",
        desc: t("How does modifier order change what Compose draws?", "Jak kolejność modyfikatorów zmienia to, co rysuje Compose?") },
      { name: "Flow Guesser", url: "https://game.kt.academy/?game=flow", image: "/static/img/games/flow.jpg",
        desc: t("What will this Flow emit?", "Co wyemituje ten Flow?") },
    ],
  },
  {
    id: "open-source",
    name: "Open source",
    desc: t("Mostly from the days when Kotlin was just arriving on Android.", "Głównie z czasów, gdy Kotlin dopiero wchodził na Androida."),
    items: [
      { name: "ArcSeekBar", url: "https://github.com/MarcinMoskala/ArcSeekBar", meta: "Android",
        desc: t("A curved SeekBar for Android, my most-starred library.", "Zakrzywiony SeekBar dla Androida, moja najpopularniejsza biblioteka.") },
      { name: "Kt. Academy Portal", url: "https://github.com/MarcinMoskala/KtAcademyPortal", meta: "Kotlin Multiplatform",
        desc: t("One of the first Kotlin Multiplatform showcase apps: Android, web and backend sharing code.",
                "Jedna z pierwszych pokazowych aplikacji Kotlin Multiplatform: Android, web i backend ze wspólnym kodem.") },
      { name: "Kotlin Coroutines Recipes", url: "https://github.com/MarcinMoskala/kotlin-coroutines-recipes", meta: "coroutines",
        desc: t("Ready-made recipes for common coroutine problems.", "Gotowe przepisy na typowe problemy z coroutines.") },
      { name: "KotlinDiscreteMathToolkit", url: "https://github.com/MarcinMoskala/KotlinDiscreteMathToolkit", meta: "math",
        desc: t("Permutations, combinations, subsets and other discrete math tools.", "Permutacje, kombinacje, podzbiory i inne narzędzia matematyki dyskretnej.") },
      { name: t("Older Android libraries", "Starsze biblioteki na Androida"), url: "https://github.com/MarcinMoskala?tab=repositories", meta: "2017–2018",
        desc: t("ActivityStarter, PreferenceHolder, KotlinAndroidViewBindings, VideoPlayView and more.",
                "ActivityStarter, PreferenceHolder, KotlinAndroidViewBindings, VideoPlayView i inne.") },
    ],
  },
  {
    id: "contributions",
    name: t("Contributions", "Kontrybucje"),
    items: [
      { name: "KotlinConf App (JetBrains)", url: "https://github.com/JetBrains/kotlinconf-app/pulls?q=is%3Apr+author%3AMarcinMoskala", meta: "2018",
        desc: t("Shared presenters in Kotlin Multiplatform, structured concurrency, and a backend syncing with Sessionize.",
                "Współdzielone prezentery w Kotlin Multiplatform, structured concurrency i backend synchronizujący się z Sessionize.") },
      { name: "Kotlin Coding Conventions", url: "https://kotlinlang.org/docs/coding-conventions.html", meta: "2017",
        desc: t("Contributed the class header formatting rules to the official Kotlin coding conventions.",
                "Dodałem do oficjalnych konwencji kodowania Kotlina zasady formatowania nagłówków klas.") },
    ],
  },
];

// Recordings shown as thumbnails at the top of the talks page.
export const featuredTalks = ["Sj0ooKlwmDo", "QTX5_JV4TVU", "fsvfv_CNY2w", "UyTBXEZ983g"];

// Talks offered to conference organizers (conf page).
export const offeredTalks = [
  { title: "Structured Concurrency: The Paradigm Shift", video: "https://www.youtube.com/watch?v=Sj0ooKlwmDo",
    desc: t("Why structured concurrency changes how we write concurrent code, and what it means in practice for Kotlin developers.",
            "Dlaczego structured concurrency zmienia sposób pisania kodu współbieżnego i co to oznacza w praktyce dla programistów Kotlina.") },
  { title: "Taming Asynchronous Beasts: Debugging and Performance Tuning in a Coroutine World", video: "https://www.youtube.com/watch?v=QTX5_JV4TVU",
    desc: t("How to debug, profile and speed up code built on Kotlin Coroutines.", "Jak debugować, profilować i przyspieszać kod oparty na Kotlin Coroutines.") },
  { title: "Mistakes You Make Using Kotlin Coroutines", video: "https://www.youtube.com/watch?v=fsvfv_CNY2w",
    desc: t("Common coroutine mistakes I see in real projects, and how to avoid them.", "Typowe błędy z coroutines, które widzę w prawdziwych projektach, i jak ich unikać.") },
  { title: "Kotlin Variance Modifiers", video: "https://vimeo.com/1115480340",
    desc: t("What in and out really mean, and the Covariant Nothing Object pattern.", "Co naprawdę znaczą in i out oraz wzorzec Covariant Nothing Object.") },
  { title: "Mastering Recomposition: Optimizing State Changes for Efficient UI",
    desc: t("How Compose decides what to recompose, and how to keep your UI fast.", "Jak Compose decyduje, co rekomponować, i jak utrzymać szybki interfejs.") },
];
