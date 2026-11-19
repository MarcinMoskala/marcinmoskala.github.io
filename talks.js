// Talk filter on /talks/. The full list is in the HTML; this only hides rows.
(() => {
  const group = document.querySelector(".filters");
  if (!group) return;
  const rows = [...document.querySelectorAll("#talk-list li")];
  const years = [...document.querySelectorAll("#talk-list .year")];

  function apply(filter) {
    rows.forEach((li) => {
      const on = filter === "all" || li.dataset.type === filter;
      li.hidden = !on;
    });
    years.forEach((y) => (y.hidden = !y.querySelector("li:not([hidden])")));
    group.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.f === filter)));
  }

  group.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) apply(b.dataset.f);
  });
  apply("all");
})();
