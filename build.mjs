// Builds the static site. No dependencies: `node build.mjs`.
// English -> repository root (served at marcinmoskala.com by GitHub Pages).
// Polish  -> _pl/ (published to the marcinmoskala.pl repository by scripts/publish-pl.sh).
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { site, books, shelf, about, projectGroups, featuredTalks, offeredTalks } from "./src/content.mjs";
import { strings, confText } from "./src/strings.mjs";

const talks = JSON.parse(readFileSync("src/talks.json", "utf8"));
const OUT = { en: ".", pl: "_pl" };
const PAGES = ["/", "/projects/", "/talks/", "/conf/"];

// ---------- helpers ----------
const esc = (s = "") => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const L = (v, lang) => (v && typeof v === "object" && !Array.isArray(v) && "en" in v ? v[lang] : v);
const fill = (s) => s.replaceAll("{email}", site.email);
const ytId = (url = "") => (url.match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/) || [])[1];
const isVideo = (url = "") => /youtube\.com|youtu\.be|vimeo\.com/.test(url);
const validate = () => {
  const types = new Set(Object.keys(strings.en.types));
  const seen = new Set();
  for (const x of talks) {
    if (!/^\d{4}(-\d{2}(-\d{2})?)?$/.test(x.date)) throw new Error(`Bad date: ${JSON.stringify(x)}`);
    if (!types.has(x.type)) throw new Error(`Unknown type: ${JSON.stringify(x)}`);
    if (!x.title || !x.event) throw new Error(`Missing title/event: ${JSON.stringify(x)}`);
    const key = `${x.date}|${x.title}|${x.event}`;
    if (seen.has(key)) throw new Error(`Duplicate talk: ${key}`);
    seen.add(key);
  }
  for (const id of featuredTalks) if (!talks.some((x) => ytId(x.url) === id)) throw new Error(`Featured talk not found: ${id}`);
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
  const title = esc(talkTitle(x, s));
  const place = x.place && !x.event.includes(x.place) ? s.places[x.place] || x.place : null;
  const where = [x.event, place].filter(Boolean).map(esc).join(", ");
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

function projectItem(p, lang) {
  const b = p.book ? books[p.book] : null;
  const name = esc(L(p.name, lang) || b?.name);
  const url = p.url || b?.url;
  const polish = lang === "en" && /od podstaw|krytyczne|Czwartki|Podaj Dalej/.test(name) ? ` lang="pl"` : "";
  return `<li${b ? ` class="with-cover"` : ""}>
      ${b ? `<img class="mini-cover" src="${b.cover}" alt="" width="48" height="72" loading="lazy">` : ""}
      <div>
        <div class="head">${url ? `<a href="${esc(url)}"${polish}>${name}</a>` : `<b${polish}>${name}</b>`}${p.meta ? `<span class="meta">${esc(L(p.meta, lang))}</span>` : ""}</div>
        <p>${esc(L(p.desc, lang))}</p>
      </div>
    </li>`;
}

function tile(p, lang) {
  return `<a class="tile" href="${esc(p.url)}">
      <span class="thumb"><img src="${p.image}" alt="" width="640" height="400" loading="lazy"></span>
      <b>${esc(L(p.name, lang))}</b>
      <span class="desc">${esc(L(p.desc, lang))}</span>
    </a>`;
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
      <span>© ${new Date().getFullYear()} ${site.name} · <a href="mailto:${site.email}">${site.email}</a></span>
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
        <p class="ctas"><a href="https://kt.academy/courses">${esc(s.workshops)}</a> <a href="/conf/">${esc(s.forOrganizers)}</a></p>
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
        image: site.domains[lang] + site.portrait, jobTitle: s.jobTitle, email: `mailto:${site.email}`,
        worksFor: { "@type": "Organization", name: "kt.academy", url: "https://kt.academy" },
        sameAs: site.social.map((x) => x.url) },
      ...["ek", "kc", "ke", "fk", "ak"].map((k) => ({ "@type": "Book", name: books[k].name, url: books[k].url,
        image: site.domains[lang] + books[k].cover, author: { "@id": `${site.domains.en}/#person` } })),
    ],
  };
  return layout({ lang, path: "/", body, active: "about", jsonLd });
}

function projectsPage(lang) {
  const s = strings[lang];
  const groups = projectGroups.map((g) => `
      <section id="${g.id}" aria-labelledby="${g.id}-h">
        <h2 id="${g.id}-h">${esc(L(g.name, lang))}</h2>
        ${g.desc ? `<p class="group-desc">${esc(L(g.desc, lang))}</p>` : ""}
        ${g.layout === "gallery"
          ? `<div class="gallery">${g.items.map((p) => tile(p, lang)).join("")}</div>`
          : `<ul class="items">${g.items.map((p) => projectItem(p, lang)).join("")}</ul>`}
      </section>`).join("");
  const body = `
      <h1>${esc(s.titles.projects)}</h1>
      <p class="subtitle">${esc(s.projectsSubtitle)}</p>
${groups}`;
  return layout({ lang, path: "/projects/", title: s.titles.projects, body, active: "projects" });
}

function talksPage(lang) {
  const s = strings[lang];
  const featured = featuredTalks.map((id) => talks.find((x) => ytId(x.url) === id)).map((x) => `
        <a class="tile" href="${esc(x.url)}">
          <span class="thumb video"><img src="/static/img/talks/${ytId(x.url)}.jpg" alt="" width="720" height="405" loading="lazy"></span>
          <b>${esc(talkTitle(x, s))}</b>
          <span class="meta">${esc(x.event)} · ${x.date.slice(0, 4)}</span>
        </a>`).join("");
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
      <p class="subtitle">${esc(s.talksSubtitle)} <a href="/conf/">${esc(s.forOrganizers)}</a></p>

      <h2>${esc(s.worthWatching)}</h2>
      <div class="gallery">${featured}
      </div>

      <h2>${esc(s.allTalksHeading)}</h2>
      <div class="filters" role="group" aria-label="${esc(s.filterLabel)}">${filters}</div>
      <p class="count" aria-live="polite"></p>
      <div id="talk-list">${years}
      </div>`;
  const countJs = `const countLabel = ${s.countLabel.toString()};`;
  return layout({ lang, path: "/talks/", title: s.titles.talks, body, active: "talks",
    scripts: `<script>${countJs}</script>\n  <script src="/talks.js?v=${VERSION}"></script>` });
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
    for (const d of ["static/img/books", "static/img/games", "static/img/talks"]) cpSync(d, join(out, d), { recursive: true });
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

console.log(`Built ${talks.length} talks, ${projectGroups.length} project groups → ./ (en) and ${OUT.pl}/ (pl)`);
