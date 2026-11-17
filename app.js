const $ = (s) => document.querySelector(s);
const esc = (s = "") => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const link = (url, text) => url ? `<a href="${esc(url)}">${text}</a>` : `<b>${text}</b>`;

const TYPE_LABELS = {
  conference: "conference", workshop: "workshop", meetup: "meetup", podcast: "podcast",
  tv: "tv", article: "article", webinar: "webinar", interview: "interview",
};

function item(p) {
  return `<li>
    <div class="head">${link(p.url, esc(p.name))}${p.meta ? `<span class="meta">${esc(p.meta)}</span>` : ""}</div>
    <p>${esc(p.desc)}</p>
  </li>`;
}

function talkRow(t) {
  const title = t.url ? `<a class="title" href="${esc(t.url)}">${esc(t.title)}</a>` : `<span class="title">${esc(t.title)}</span>`;
  const where = [t.event, t.place].filter(Boolean).join(", ");
  return `<li>
    <span class="date">${esc(t.date)}</span>
    <div>${title}<div class="where">${esc(where)}<span class="kind">${esc(TYPE_LABELS[t.type] || t.type)}${t.lang === "PL" ? " · in Polish" : ""}</span></div></div>
  </li>`;
}

const talksSorted = [...DATA.talks].sort((a, b) => b.date.localeCompare(a.date));
const allItems = DATA.projectGroups.flatMap((g) => g.items);

// About
$("#social").innerHTML = DATA.social.map((s) => `<a href="${esc(s.url)}">${esc(s.name)}</a>`).join(" · ");
$("#shelf").innerHTML = allItems.filter((i) => i.cover).map((b) =>
  `<a class="book" href="${esc(b.url)}"><img src="${esc(b.cover)}" alt="${esc(b.name)}" loading="lazy" title="${esc(b.name)}"></a>`).join("");
$("#recent-talks").innerHTML = talksSorted.slice(0, 5).map(talkRow).join("");

// Projects
$("#project-groups").innerHTML = DATA.projectGroups.map((g) => `
  <h2>${esc(g.name)}</h2>
  ${g.desc ? `<p class="group-desc">${esc(g.desc)}</p>` : ""}
  <ul class="items">${g.items.map(item).join("")}</ul>`).join("");

// Talks
let filter = "all";
function renderTalks() {
  const list = talksSorted.filter((t) => filter === "all" || t.type === filter);
  const byYear = {};
  list.forEach((t) => (byYear[t.date.slice(0, 4)] ??= []).push(t));
  $("#talk-list").innerHTML = Object.keys(byYear).sort().reverse()
    .map((y) => `<h2 class="year">${y}</h2><ol class="talks">${byYear[y].map(talkRow).join("")}</ol>`).join("");
  document.querySelectorAll("#filters button").forEach((b) => b.classList.toggle("active", b.dataset.f === filter));
}
const types = [...new Set(DATA.talks.map((t) => t.type))];
$("#filters").innerHTML = [["all", "all"], ...types.map((t) => [t, TYPE_LABELS[t] || t])]
  .map(([f, l]) => `<button data-f="${f}">${l} (${f === "all" ? DATA.talks.length : DATA.talks.filter((t) => t.type === f).length})</button>`).join("");
$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (b) { filter = b.dataset.f; renderTalks(); }
});
renderTalks();

// tabs
function route() {
  const id = location.hash.slice(1) || "about";
  const valid = document.getElementById("tab-" + id) ? id : "about";
  document.querySelectorAll(".tab").forEach((s) => (s.hidden = s.id !== "tab-" + valid));
  document.querySelectorAll("nav a").forEach((a) => a.classList.toggle("active", a.dataset.tab === valid));
  window.scrollTo(0, 0);
}
addEventListener("hashchange", route);
route();
$("#year").textContent = new Date().getFullYear();
