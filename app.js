/* GameHub library — renders cards + detail modal from games.json. No deps. */
(function () {
  "use strict";

  var grid = document.getElementById("game-grid");
  var modal = document.getElementById("modal");
  var lastFocus = null;
  var games = [];

  fetch("games.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      games = data.games || [];
      if (!games.length) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#b3a688">' +
          "The hall is being stocked — first games arriving shortly.</p>";
        return;
      }
      games.forEach(function (g, i) { grid.appendChild(card(g, i)); });
    })
    .catch(function () {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#b3a688">' +
        "Could not load the game list. Refresh to try again.</p>";
    });

  function card(g, i) {
    var b = document.createElement("button");
    b.className = "card";
    b.setAttribute("aria-haspopup", "dialog");
    var badges = "";
    if (g.web) badges += '<span class="badge play">Play in browser</span>';
    if (g.downloads && g.downloads.length) badges += '<span class="badge dl">Download</span>';
    if (g.genre) badges += '<span class="badge">' + esc(g.genre) + "</span>";
    b.innerHTML =
      '<img class="card-cover" loading="lazy" src="' + esc(g.cover) + '" alt="">' +
      '<div class="card-body"><h3>' + esc(g.title) + "</h3>" +
      '<p class="tagline">' + esc(g.tagline || "") + "</p>" +
      '<div class="badges">' + badges + "</div></div>";
    b.addEventListener("click", function () { open(i); });
    return b;
  }

  function open(i) {
    var g = games[i];
    lastFocus = document.activeElement;
    document.getElementById("m-title").textContent = g.title;
    document.getElementById("m-tagline").textContent = g.tagline || "";

    // actions
    var acts = document.getElementById("m-actions");
    acts.innerHTML = "";
    if (g.web) {
      acts.appendChild(btn("Play in browser", g.web, "btn btn-gold", false));
    }
    (g.downloads || []).forEach(function (d) {
      var label = d.label + (d.size ? " (" + d.size + ")" : "");
      acts.appendChild(btn(label, d.url, g.web ? "btn btn-ghost" : "btn btn-gold", true));
    });
    if (g.download_note) {
      var n = document.createElement("p");
      n.className = "note";
      n.textContent = g.download_note;
      acts.appendChild(n);
    }

    // description (trusted: authored in this repo's games.json)
    document.getElementById("m-desc").innerHTML = g.description_html || "";

    // meta
    var meta = document.getElementById("m-meta");
    meta.innerHTML = "";
    var dl = document.createElement("dl");
    (g.meta || []).forEach(function (row) {
      var dt = document.createElement("dt"); dt.textContent = row[0];
      var dd = document.createElement("dd"); dd.textContent = row[1];
      dl.appendChild(dt); dl.appendChild(dd);
    });
    meta.appendChild(dl);

    // gallery
    var shot = document.getElementById("m-shot");
    var thumbs = document.getElementById("m-thumbs");
    thumbs.innerHTML = "";
    var shots = g.screenshots && g.screenshots.length ? g.screenshots : [g.cover];
    shots.forEach(function (s, si) {
      var t = document.createElement("img");
      t.src = s; t.alt = ""; t.loading = "lazy";
      if (si === 0) t.className = "on";
      t.addEventListener("click", function () {
        shot.src = s;
        Array.prototype.forEach.call(thumbs.children, function (c) { c.className = ""; });
        t.className = "on";
      });
      thumbs.appendChild(t);
    });
    shot.src = shots[0];
    shot.alt = g.title + " screenshot";

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-x").focus();
  }

  function btn(label, href, cls, isDownload) {
    var a = document.createElement("a");
    a.className = cls;
    a.href = href;
    a.textContent = label;
    if (isDownload) a.setAttribute("rel", "noopener");
    else { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }

  function close() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  modal.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-close")) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) close();
  });

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
