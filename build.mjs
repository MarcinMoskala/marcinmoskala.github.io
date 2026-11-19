// Builds the static site. No dependencies: `node build.mjs`.
// English -> repository root (served at marcinmoskala.com by GitHub Pages).
// Polish  -> _pl/ (published to the marcinmoskala.pl repository by scripts/publish-pl.sh).
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { site, books, shelf, about, projects, offeredTalks } from "./src/content.mjs";
import { strings, confText } from "./src/strings.mjs";

const talks = JSON.parse(readFileSync("src/talks.json", "utf8"));
const OUT = { en: ".", pl: "_pl" };
const PAGES = ["/", "/projects/", "/talks/", "/conf/"];

// ---------- helpers ----------
const esc = (s = "") => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const L = (v, lang) => (v && typeof v === "object" && !Array.isArray(v) && "en" in v ? v[lang] : v);
const fill = (s) => s.replaceAll("{linkedin}", site.linkedin);
const isVideo = (url = "") => /youtube\.com|youtu\.be|vimeo\.com/.test(url);
const validate = () => {
  const types = new Set(Object.keys(strings.en.types));
  const seen = new Set();
  for (const x of talks) {
    if (!/^\d{4}(-\d{2}(-\d{2})?)?$/.test(x.date)) throw new Error(`Bad date: ${JSON.stringify(x)}`);
    if (!types.has(x.type)) throw new Error(`Unknown type: ${JSON.stringify(x)}`);
    if (!x.event) throw new Error(`Missing event: ${JSON.stringify(x)}`);
    const key = `${x.date}|${x.title}|${x.event}`;
    if (seen.has(key)) throw new Error(`Duplicate talk: ${key}`);
    seen.add(key);
  }
};

function shortDate(date, locale) {
  const [y, m, d] = date.split("-").map(Number);
  if (!m) return "";
  const opts = d ? { month: "short", day: "numeric" } : { month: "short" };
  return new Date(Date.UTC(y, m - 1, d || 1)).toLocaleDateString(locale, { ...opts, timeZone: "UTC" });
}

function monthYear(date, locale) {
  const [y, m] = date.split("-").map(Number);
  if (!m) return String(y);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString(locale, { month: "short", year: "numeric", timeZone: "UTC" });
}

function talkTitle(x, s) {
  let title = x.title;
  for (const [a, b] of s.titleFixes) title = title.replace(a, b);
  return title;
}

function talkRow(x, s, { withYear = false } = {}) {
  // A talk whose title we don't know is listed under the event name.
  const title = esc(x.title ? talkTitle(x, s) : x.event);
  const place = x.place && !x.event.includes(x.place) ? s.places[x.place] || x.place : null;
  const where = [x.title ? x.event : null, place].filter(Boolean).map(esc).join(", ");
  const kind = [s.types[x.type], x.lang === "PL" && s.lang !== "pl" ? s.inPolish : null].filter(Boolean).join(" · ");
  const marker = x.url ? `<span class="marker" aria-hidden="true">${isVideo(x.url) ? "▶" : "↗"}</span>` : "";
  const label = withYear ? monthYear(x.date, s.locale) : shortDate(x.date, s.locale);
  const langAttr = x.lang === "PL" && s.lang !== "pl" ? ` lang="pl"` : "";
  return `<li data-type="${x.type}">
      <time datetime="${x.date}">${esc(label)}</time>
      <div><${x.url ? `a href="${esc(x.url)}"` : "span"} class="title"${langAttr}>${title}${marker}</${x.url ? "a" : "span"}>
        <div class="where">${where} <span class="kind">${esc(kind)}</span></div></div>
    </li>`;
}

// lang attribute for names that are not in the page language
const langOf = (text, lang, explicit) => {
  const l = explicit || (/od podstaw|Podaj Dalej/.test(text) ? "pl" : null);
  return l && l !== lang ? ` lang="${l}"` : "";
};

function fan(keys) {
  const n = keys.length;
  return `<div class="fan" style="--n:${n}">${keys.map((k, i) => {
    const b = books[k];
    return `<a href="${esc(b.url)}" style="--i:${i - (n - 1) / 2};z-index:${n - Math.abs(Math.round(i - (n - 1) / 2))}" title="${esc(b.name)}"><img src="${b.cover}" alt="${esc(b.name)}" width="300" height="450" loading="lazy"></a>`;
  }).join("")}</div>`;
}

function card(p, lang) {
  const name = esc(L(p.name, lang));
  const media = p.fan
    ? fan(p.fan)
    : p.url
      ? `<a class="shot" href="${esc(p.url)}" tabindex="-1" aria-hidden="true"><img src="${p.image}" alt="" width="800" height="500" loading="lazy"></a>`
      : `<div class="shot"><img src="${p.image}" alt="" width="800" height="500" loading="lazy"></div>`;
  const links = [
    ...(p.bookLinks ? p.fan.map((k) => ({ name: books[k].name, url: books[k].url, lang: books[k].lang })) : []),
    ...(p.links || []).map((x) => ({ name: L(x.name, lang), url: x.url })),
  ];
  return `
      <article class="card" id="${p.id}">
        ${media}
        <h3>${p.url ? `<a href="${esc(p.url)}"${langOf(name, lang)}>${name}</a>` : `<span${langOf(name, lang)}>${name}</span>`}</h3>
        ${p.meta ? `<p class="meta">${esc(L(p.meta, lang))}</p>` : ""}
        <p class="desc">${esc(L(p.desc, lang)).replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')}</p>
        ${links.length ? `<p class="card-links">${links.map((x) => `<a href="${esc(x.url)}"${langOf(x.name, lang, x.lang)}>${esc(x.name)}</a>`).join("")}</p>` : ""}
      </article>`;
}

// ---------- layout ----------
function layout({ lang, path, title, description, body, active, jsonLd, scripts = "", noindex = false }) {
  const s = strings[lang];
  const other = s.otherLang;
  const url = site.domains[lang] + path;
  const fullTitle = title ? `${title} — ${site.name}` : site.name;
  const nav = ["about", "projects", "talks"].map((k) => {
    const href = k === "about" ? "/" : `/${k}/`;
    return `<a href="${href}"${active === k ? ` aria-current="page"` : ""}>${s.nav[k]}</a>`;
  }).join("");
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description || s.metaDescription)}">
  ${noindex ? `<meta name="robots" content="noindex">` : `<link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="${lang}" href="${url}">
  <link rel="alternate" hreflang="${other}" href="${site.domains[other] + path}">
  <link rel="alternate" hreflang="x-default" href="${site.domains.en + path}">`}
  <meta property="og:type" content="${path === "/" ? "profile" : "website"}">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(description || s.metaDescription)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${site.domains[lang]}${site.portrait}">
  <meta property="og:locale" content="${s.locale.replace("-", "_")}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:site" content="@marcinmoskala">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400..600;1,7..72,400&family=JetBrains+Mono:wght@400;500&display=swap&subset=latin-ext" rel="stylesheet">
  <link rel="stylesheet" href="/style.css?v=${VERSION}">
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
</head>
<body>
  <div class="wrap">
    <header class="top">
      <a class="name" href="/">${site.name}</a>
      <nav aria-label="${lang === "pl" ? "Główna" : "Main"}">${nav}<a class="lang" href="${site.domains[other] + path}" hreflang="${other}" lang="${other}">${s.otherLabel}</a></nav>
    </header>
    <main id="main">
${body}
    </main>
    <footer>
      <span>© ${new Date().getFullYear()} ${site.name}</span>
      <a href="/conf/">${esc(s.titles.conf)}</a>
    </footer>
  </div>
  ${scripts}
</body>
</html>
`;
}

// ---------- pages ----------
function homePage(lang) {
  const s = strings[lang];
  const recent = talks.filter((x) => x.url).slice(0, 5);
  const body = `
      <section class="intro">
        <img class="portrait" src="${site.portrait}" alt="${site.name}" width="112" height="112" fetchpriority="high">
        <div>
          <h1>${site.name}</h1>
          <p class="subtitle">${esc(L(about.subtitle, lang))}</p>
        </div>
      </section>
      <div class="prose">
        ${L(about.bio, lang).map((p) => `<p>${p}</p>`).join("\n        ")}
        <p class="contact">${fill(L(about.contact, lang))}</p>
        <p class="elsewhere">${site.social.map((x) => `<a href="${x.url}">${x.name}</a>`).join(" · ")}</p>
        <p class="ctas"><a href="/conf/">${esc(s.forOrganizers)}</a></p>
      </div>

      <h2>${esc(s.books)}</h2>
      <div class="shelf">
        ${shelf[lang].map((k) => {
          const b = books[k];
          return `<a class="book" href="${b.url}"><img src="${b.cover}" alt="" width="300" height="450"><span${/od podstaw/.test(b.name) && lang === "en" ? ` lang="pl"` : ""}>${esc(b.name)}</span></a>`;
        }).join("\n        ")}
      </div>

      <h2>${esc(s.recentTalks)}</h2>
      <ol class="talks">
        ${recent.map((x) => talkRow(x, s, { withYear: true })).join("\n        ")}
      </ol>
      <p><a href="/talks/">${esc(s.allTalks)}</a></p>`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Person", "@id": `${site.domains.en}/#person`, name: site.name, url: site.domains[lang] + "/",
        image: site.domains[lang] + site.portrait, jobTitle: s.jobTitle,
        worksFor: [{ "@type": "Organization", name: "Bank Pekao", url: "https://www.pekao.com.pl" }],
        founder: { "@type": "Organization", name: "kt.academy", url: "https://kt.academy" },
        sameAs: site.social.map((x) => x.url) },
      ...["ek", "kc", "ke", "fk", "ak"].map((k) => ({ "@type": "Book", name: books[k].name, url: books[k].url,
        image: site.domains[lang] + books[k].cover, author: { "@id": `${site.domains.en}/#person` } })),
    ],
  };
  return layout({ lang, path: "/", body, active: "about", jsonLd });
}

function projectsPage(lang) {
  const s = strings[lang];
  const body = `
      <h1>${esc(s.titles.projects)}</h1>
      <p class="subtitle">${esc(s.projectsSubtitle)}</p>
      <div class="cards">${projects.featured.map((p) => card(p, lang)).join("")}
      </div>`;
  return layout({ lang, path: "/projects/", title: s.titles.projects, body, active: "projects" });
}

function talksPage(lang) {
  const s = strings[lang];
  const counts = {};
  talks.forEach((x) => (counts[x.type] = (counts[x.type] || 0) + 1));
  const types = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  const filters = [["all", talks.length], ...types.map((tp) => [tp, counts[tp]])]
    .map(([f, n]) => `<button type="button" data-f="${f}" aria-pressed="${f === "all"}">${esc(f === "all" ? (lang === "pl" ? "wszystkie" : "all") : s.types[f])} <span class="n">${n}</span></button>`).join("");
  const byYear = {};
  talks.forEach((x) => (byYear[x.date.slice(0, 4)] ??= []).push(x));
  const years = Object.keys(byYear).sort().reverse().map((y) => `
        <section class="year" data-year="${y}">
          <h3>${y}</h3>
          <ol class="talks">
            ${byYear[y].map((x) => talkRow(x, s)).join("\n            ")}
          </ol>
        </section>`).join("");
  const body = `
      <h1>${esc(s.titles.talks)}</h1>

      <div class="filters" role="group" aria-label="${esc(s.filterLabel)}">${filters}</div>
      <div id="talk-list">${years}
      </div>`;
  return layout({ lang, path: "/talks/", title: s.titles.talks, body, active: "talks",
    scripts: `<script src="/talks.js?v=${VERSION}"></script>` });
}

function confPage(lang) {
  const s = strings[lang];
  const c = confText[lang];
  const body = `
      <h1>${esc(s.titles.conf)}</h1>
      <div class="prose">
        <p>${c.intro}</p>
        <h2>${esc(c.termsHeading)}</h2>
        <ul>${c.terms.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <h2>${esc(c.talksHeading)}</h2>
        <ul class="items">${offeredTalks.map((x) => `<li><div class="head"><b>${esc(x.title)}</b>${x.video ? `<a class="meta" href="${x.video}">▶ ${esc(c.video)}</a>` : ""}</div><p>${esc(L(x.desc, lang))}</p></li>`).join("")}</ul>
        <h2>${esc(c.workshopsHeading)}</h2>
        <p>${c.workshops}</p>
        <h2>${esc(c.contactHeading)}</h2>
        <p>${fill(c.contact)}</p>
      </div>`;
  return layout({ lang, path: "/conf/", title: s.titles.conf, body });
}

function notFoundPage(lang) {
  const s = strings[lang];
  return layout({ lang, path: "/404.html", title: s.titles.notFound, body: `
      <h1>404</h1>
      <p class="subtitle">${s.notFound}</p>`, noindex: true });
}

const redirectPage = (to) => `<!doctype html>
<html><head><meta charset="utf-8"><title>Redirecting…</title>
<link rel="canonical" href="${to}"><meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${to}"></head>
<body><a href="${to}">${to}</a></body></html>
`;

// ---------- write ----------
const VERSION = Date.now().toString(36);
const write = (path, content) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, content); };

validate();
rmSync(OUT.pl, { recursive: true, force: true });
for (const lang of ["en", "pl"]) {
  const out = OUT[lang];
  write(join(out, "index.html"), homePage(lang));
  write(join(out, "projects/index.html"), projectsPage(lang));
  write(join(out, "talks/index.html"), talksPage(lang));
  write(join(out, "conf/index.html"), confPage(lang));
  write(join(out, "404.html"), notFoundPage(lang));
  write(join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map((p) => `  <url><loc>${site.domains[lang]}${p}</loc></url>`).join("\n")}
</urlset>
`);
  write(join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.domains[lang]}/sitemap.xml\n`);
  if (lang === "pl") {
    for (const f of ["style.css", "talks.js", "favicon.svg", ".nojekyll"]) cpSync(f, join(out, f));
    for (const d of ["static/img/books", "static/img/games", "static/img/projects"]) cpSync(d, join(out, d), { recursive: true });
    cpSync("static/img/portrait.jpg", join(out, "static/img/portrait.jpg"));
    write(join(out, "CNAME"), "marcinmoskala.pl\n");
  }
}

// Old URLs from the previous Jekyll site that may still be linked from elsewhere.
write("conf.html", redirectPage("/conf/"));
write("skills.html", redirectPage("/"));
write("delegates/index.html", redirectPage("https://kt.academy/article/ak-property-delegation"));
write("blog/index.html", redirectPage("https://kt.academy/article"));
write("blog-pl/index.html", redirectPage("https://kt.academy/article"));

console.log(`Built ${talks.length} talks, ${projects.featured.length} project cards → ./ (en) and ${OUT.pl}/ (pl)`);
