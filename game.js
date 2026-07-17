/* GameHub — individual game page. Renders from games.json via ?id=<game-id>.
   If the game has a `web` build path, the game is embedded playable at the top. */
(function () {
  "use strict";

  var id = new URLSearchParams(location.search).get("id");

  fetch("games.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var g = (data.games || []).find(function (x) { return x.id === id; });
      if (!g) { document.getElementById("g-missing").hidden = false; return; }
      render(g);
    })
    .catch(function () { document.getElementById("g-missing").hidden = false; });

  function render(g) {
    document.title = g.title + " — GameHub";
    document.getElementById("g-title").textContent = g.title;
    document.getElementById("g-tagline").textContent = g.tagline || "";

    // playable embed
    if (g.web) {
      var frame = document.getElementById("g-frame");
      frame.src = g.web;
      document.getElementById("g-embed").hidden = false;
      document.getElementById("g-fs").addEventListener("click", function () {
        if (frame.requestFullscreen) frame.requestFullscreen();
      });
    }

    // actions
    var acts = document.getElementById("g-actions");
    (g.downloads || []).forEach(function (d) {
      var a = document.createElement("a");
      a.className = g.web ? "btn btn-ghost" : "btn btn-gold";
      a.href = d.url;
      a.rel = "noopener";
      a.textContent = d.label + (d.size ? " (" + d.size + ")" : "");
      acts.appendChild(a);
    });
    if (g.download_note) {
      var n = document.createElement("p");
      n.className = "note";
      n.textContent = g.download_note;
      acts.appendChild(n);
    }

    // gallery
    var shot = document.getElementById("g-shot");
    var thumbs = document.getElementById("g-thumbs");
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

    // description (authored in this repo's games.json — trusted content)
    document.getElementById("g-desc").innerHTML = g.description_html || "";

    // meta
    var dl = document.createElement("dl");
    (g.meta || []).forEach(function (row) {
      var dt = document.createElement("dt"); dt.textContent = row[0];
      var dd = document.createElement("dd"); dd.textContent = row[1];
      dl.appendChild(dt); dl.appendChild(dd);
    });
    document.getElementById("g-meta").appendChild(dl);

    document.getElementById("g-main").hidden = false;
  }
})();
