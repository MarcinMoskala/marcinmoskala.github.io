const $ = (s) => document.querySelector(s);
const esc = (s = "") => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const TYPE_LABELS = {
  conference: "Konferencja",
  workshop: "Warsztat",
  meetup: "Meetup",
  podcast: "Podcast",
  tv: "TV",
  article: "Artykuł",
  webinar: "Webinar",
  interview: "Wywiad",
};

function card(p) {
  const tag = p.url ? "a" : "div";
  const href = p.url ? ` href="${esc(p.url)}" target="_blank" rel="noopener"` : "";
  return `<${tag} class="card"${href}>
    ${p.meta ? `<span class="meta">${esc(p.meta)}</span>` : ""}
    <h3>${esc(p.name)}</h3>
    <p>${esc(p.desc)}</p>
    ${p.tags?.length ? `<div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
  </${tag}>`;
}

function talkRow(t) {
  const title = t.url
    ? `<a class="title" href="${esc(t.url)}" target="_blank" rel="noopener">${esc(t.title)}</a>`
    : `<span class="title">${esc(t.title)}</span>`;
  const where = [t.event, t.place].filter(Boolean).join(" · ");
  return `<li>
    <span class="date">${esc(t.date)}</span>
    <div>${title}<div class="where">${esc(where)}${t.lang ? ` · ${esc(t.lang)}` : ""}</div></div>
    <span class="badge">${esc(TYPE_LABELS[t.type] || t.type)}</span>
  </li>`;
}

const talksSorted = [...DATA.talks].sort((a, b) => b.date.localeCompare(a.date));

// O mnie
$("#social").innerHTML = DATA.social.map((s) => `<a class="chip" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>`).join("");
$("#stats").innerHTML = DATA.stats.map((s) => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("");
$("#featured").innerHTML = DATA.projectGroups.flatMap((g) => g.items.filter((i) => i.featured)).map(card).join("");
$("#recent-talks").innerHTML = talksSorted.slice(0, 5).map(talkRow).join("");

// Projekty
$("#project-groups").innerHTML = DATA.projectGroups.map((g) => `
  <h2>${esc(g.name)}</h2>
  ${g.desc ? `<p class="group-desc">${esc(g.desc)}</p>` : ""}
  <div class="grid">${g.items.map(card).join("")}</div>`).join("");

// Wystąpienia
let filter = "all";
function renderTalks() {
  const list = talksSorted.filter((t) => filter === "all" || t.type === filter);
  const byYear = {};
  list.forEach((t) => (byYear[t.date.slice(0, 4)] ??= []).push(t));
  $("#talks").innerHTML = Object.keys(byYear).sort().reverse()
    .map((y) => `<div class="year">${y}</div><ol class="timeline">${byYear[y].map(talkRow).join("")}</ol>`).join("");
  document.querySelectorAll("#filters button").forEach((b) => b.classList.toggle("active", b.dataset.f === filter));
}
const types = [...new Set(DATA.talks.map((t) => t.type))];
$("#filters").innerHTML = [["all", "Wszystkie"], ...types.map((t) => [t, TYPE_LABELS[t] || t])]
  .map(([f, l]) => `<button data-f="${f}">${l} <small>${f === "all" ? DATA.talks.length : DATA.talks.filter((t) => t.type === f).length}</small></button>`).join("");
$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (b) { filter = b.dataset.f; renderTalks(); }
});
renderTalks();

// zakładki
function route() {
  const id = location.hash.slice(1) || "o-mnie";
  const valid = document.getElementById("tab-" + id) ? id : "o-mnie";
  document.querySelectorAll(".tab").forEach((s) => (s.hidden = s.id !== "tab-" + valid));
  document.querySelectorAll("nav a").forEach((a) => a.classList.toggle("active", a.dataset.tab === valid));
  window.scrollTo(0, 0);
}
addEventListener("hashchange", route);
route();
$("#year").textContent = new Date().getFullYear();
