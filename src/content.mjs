// Single source of truth for the site. Text that differs by language is t(en, pl).
// Talks are in talks.json (language-neutral; places and labels are translated in strings.mjs).
export const t = (en, pl) => ({ en, pl });

export const site = {
  name: "Marcin Moskała",
  linkedin: "https://www.linkedin.com/in/marcin-moskala/",
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
  js: { name: "JavaScript od podstaw", url: "https://kt.academy/pl/book/js", cover: "/static/img/books/js.jpg", lang: "pl" },
  py: { name: "Python od podstaw", url: "https://kt.academy/pl/book/py", cover: "/static/img/books/py.jpg", lang: "pl" },
  pyua: { name: "Python з нуля", url: "https://kt.academy/ua/book/py", cover: "/static/img/books/pyua.jpg", lang: "uk" },
  awdk: { name: "Android Development with Kotlin", url: "https://www.oreilly.com/library/view/-/9781787123687/", cover: "/static/img/books/awdk.jpg" },
};

// Books shown on the home page shelf, per language.
export const shelf = { en: ["ek", "kc", "ke", "fk", "ak"], pl: ["py", "js", "ek", "kc", "ke"] };

export const about = {
  subtitle: t("Software architect, teacher and author of popular books.",
              "Architekt oprogramowania, nauczyciel i autor popularnych książek."),
  bio: t(
    [
      `I am a practising programmer, currently a software architect at Bank Pekao. Building real systems is what everything else I do grows out of.`,
      `I write books. Developers around the world learn from <a href="https://kt.academy/book/effectivekotlin"><cite>Effective Kotlin</cite></a> and <a href="https://kt.academy/book/coroutines"><cite>Kotlin Coroutines: Deep Dive</cite></a>, my books on Kotlin, the main language for building Android apps. For complete beginners, I wrote <a href="https://kt.academy/pl/book/js" lang="pl"><cite>JavaScript od podstaw</cite></a> and <a href="https://kt.academy/pl/book/py" lang="pl"><cite>Python od podstaw</cite></a> in Polish. I also write beyond programming, about critical thinking and stoicism.`,
      `I teach. I run workshops for developer teams at companies around the world and have spoken over 100 times, at conferences such as KotlinConf and droidcon. That work grew into <a href="https://kt.academy">kt.academy</a>, the training company I founded, today an official training partner of JetBrains, the creators of Kotlin.`,
      `I believe knowledge should be passed on. Through <a href="/projects/#podaj-dalej" lang="pl">Podaj Dalej Programowanie</a> I have given away over 3,000 books to people who want to start programming, and I make free games and cheat sheets for developers.`,
    ],
    [
      `Jestem aktywnym programistą, obecnie architektem oprogramowania w Banku Pekao. Z budowania prawdziwych systemów wyrasta wszystko inne, czym się zajmuję.`,
      `Piszę książki. Z <a href="https://kt.academy/book/effectivekotlin"><cite>Effective Kotlin</cite></a> i <a href="https://kt.academy/book/coroutines"><cite>Kotlin Coroutines: Deep Dive</cite></a> uczą się programiści na całym świecie. To moje książki o Kotlinie, głównym języku do tworzenia aplikacji na Androida. Dla osób, które zaczynają od zera, napisałem <a href="https://kt.academy/pl/book/js"><cite>JavaScript od podstaw</cite></a> i <a href="https://kt.academy/pl/book/py"><cite>Python od podstaw</cite></a>. Piszę też nie tylko o programowaniu, ale także o krytycznym myśleniu i stoicyzmie.`,
      `Uczę. Prowadzę warsztaty dla zespołów programistów w firmach na całym świecie i wystąpiłem ponad 100 razy, m.in. na KotlinConf i droidconach. Z tej pracy wyrosła <a href="https://kt.academy">kt.academy</a>, firma szkoleniowa, którą założyłem, dziś oficjalny partner szkoleniowy JetBrains, twórców Kotlina.`,
      `Wierzę, że wiedzę trzeba podawać dalej. W akcji <a href="/projects/#podaj-dalej">Podaj Dalej Programowanie</a> rozdałem ponad 3000 książek osobom, które chcą zacząć programować, a za darmo udostępniam gry i ściągawki dla programistów.`,
    ],
  ),
  contact: t(
    `Looking for a workshop for your team? See <a href="https://kt.academy">kt.academy</a>. Want to invite me to a conference or a podcast? Message me on <a href="{linkedin}">LinkedIn</a>.`,
    `Szukasz warsztatów dla zespołu? Zajrzyj na <a href="https://kt.academy">kt.academy</a>. Chcesz zaprosić mnie na konferencję albo do podcastu? Napisz do mnie na <a href="{linkedin}">LinkedInie</a>.`,
  ),
};

// Projects page: big cards first, then smaller books and code.
// A card has either an image or a fan of book covers; links are optional extra links under the text.
export const projects = {
  featured: [
    { id: "kt-academy", name: "kt.academy", url: "https://kt.academy", image: "/static/img/projects/ktacademy.jpg", meta: t("since 2017", "od 2017"),
      desc: t("My Kotlin training company and an official JetBrains training partner: workshops for teams, books, articles and a newsletter.",
              "Moja firma szkoleniowa z Kotlina, oficjalny partner szkoleniowy JetBrains: warsztaty dla zespołów, książki, artykuły i newsletter."),
      links: [
        { name: t("Workshops", "Warsztaty"), url: "https://kt.academy/workshop/coroutines" },
        { name: t("Articles", "Artykuły"), url: "https://kt.academy/article" },
      ] },
    { id: "kotlin-books", name: t("Kotlin for Developers books", "Książki z serii Kotlin for Developers"), url: "https://kt.academy/book", fan: ["ek", "kc", "ke", "fk", "ak"],
      meta: t("5 books", "5 książek"),
      desc: t("A series that takes you from the basics to advanced Kotlin. Effective Kotlin is also published in Polish by Helion, and Kotlin Coroutines in Turkish.",
              "Seria od podstaw do zaawansowanego Kotlina. Effective Kotlin wydał też po polsku Helion, a Kotlin Coroutines ukazało się po turecku."),
      bookLinks: true },
    { id: "od-podstaw", name: t("Programming from scratch", "Programowanie od podstaw"), fan: ["js", "py", "pyua"],
      meta: t("in Polish and Ukrainian", "po polsku i ukraińsku"),
      desc: t("Books for people who have never programmed: JavaScript and Python from zero. The Ukrainian edition was made to support Ukraine.",
              "Książki dla osób, które nigdy nie programowały: JavaScript i Python od zera. Wydanie ukraińskie powstało, by wesprzeć Ukrainę."),
      bookLinks: true },
    { id: "podaj-dalej", name: "Podaj Dalej Programowanie", image: "/static/img/projects/podajdalej.jpg", meta: "2021–2024",
      desc: t("“Pass on programming”: we gave away over 3,000 books for learning to program, to people starting out and to hospitals, libraries, schools and job centres. Every reader passes their copy on. Alongside it ran “Czwartki z programowaniem”, a lecture series with the student councils of SGH and the University of Warsaw.",
              "Rozdaliśmy ponad 3000 książek do nauki programowania osobom, które zaczynają, oraz szpitalom, bibliotekom, szkołom i urzędom pracy. Każdy czytelnik przekazuje swój egzemplarz dalej. Równolegle prowadziliśmy „Czwartki z programowaniem”, cykl wykładów z samorządami studentów SGH i Uniwersytetu Warszawskiego."),
      links: [
        { name: t("1st edition: JavaScript (2021)", "Edycja 1: JavaScript (2021)"), url: "https://kt.academy/podajdalej" },
        { name: t("2nd edition: Python (2023)", "Edycja 2: Python (2023)"), url: "https://kt.academy/podajdalej2" },
      ] },
    { id: "games", name: t("Kotlin games", "Gry Kotlinowe"), url: "https://game.kt.academy/?game=coroutines", image: "/static/img/games/coroutines.jpg", meta: t("free, in the browser", "za darmo, w przeglądarce"),
      desc: t("Short games that train you to read Kotlin: guess what the code will do before it runs.",
              "Krótkie gry, które uczą czytać kod w Kotlinie: zgadnij, co zrobi kod, zanim się wykona."),
      links: [
        { name: "Coroutines", url: "https://game.kt.academy/?game=coroutines" },
        { name: "Collections", url: "https://game.kt.academy/?game=collection-processing" },
        { name: "Modifiers", url: "https://game.kt.academy/?game=modifiers" },
        { name: "Flow", url: "https://game.kt.academy/?game=flow" },
      ] },
    { id: "cheat-sheets", name: "Kotlin Cheat Sheets", url: "https://cheat-sheet.kt.academy", image: "/static/img/projects/cheatsheets.jpg", meta: t("free PDFs", "darmowe PDF-y"),
      desc: t("One-page references for Kotlin Coroutines, Flow and Jetpack Compose.", "Jednostronicowe ściągawki z Kotlin Coroutines, Flow i Jetpack Compose."),
      links: [
        { name: "Coroutines", url: "https://cheat-sheet.kt.academy/coroutines" },
        { name: "Flow", url: "https://cheat-sheet.kt.academy/flow" },
        { name: t("Adopting Coroutines", "Wdrażanie Coroutines"), url: "https://cheat-sheet.kt.academy/adopting-kotlin-coroutines-a-practical-guide-for-managers" },
        { name: "Compose Essential", url: "https://cheat-sheet.kt.academy/compose8" },
        { name: "Compose Advanced", url: "https://cheat-sheet.kt.academy/advanced-compose09" },
      ] },
    { id: "android-development-with-kotlin", name: "Android Development with Kotlin", url: "https://www.oreilly.com/library/view/-/9781787123687/", fan: ["awdk"], meta: "2017 · Packt",
      desc: t("My first book, written with Igor Wojda when Kotlin was just arriving on Android.",
              "Moja pierwsza książka, napisana z Igorem Wojdą, gdy Kotlin dopiero wchodził na Androida.") },
    { id: "open-source", name: "Open source", url: "https://github.com/MarcinMoskala", image: "/static/img/projects/github.jpg", meta: "GitHub",
      desc: t("Libraries from the days when Kotlin was arriving on Android, such as ArcSeekBar, ActivityStarter and PreferenceHolder; KtAcademyPortal, one of the first Kotlin Multiplatform showcase apps; Kotlin Coroutines Recipes; and contributions to the JetBrains KotlinConf app.",
              "Biblioteki z czasów, gdy Kotlin wchodził na Androida, m.in. ArcSeekBar, ActivityStarter i PreferenceHolder; KtAcademyPortal, jedna z pierwszych pokazowych aplikacji Kotlin Multiplatform; Kotlin Coroutines Recipes oraz kontrybucje do aplikacji KotlinConf od JetBrains."),
      links: [{ name: "github.com/MarcinMoskala", url: "https://github.com/MarcinMoskala" }] },
  ],
};

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
