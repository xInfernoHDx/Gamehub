/* GameHub library — renders game cards from games.json; each card links to its
   own page (game.html?id=<id>). No deps. */
(function () {
  "use strict";

  var grid = document.getElementById("game-grid");

  fetch("games.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var games = data.games || [];
      if (!games.length) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#b3a688">' +
          "The hall is being stocked — first games arriving shortly.</p>";
        return;
      }
      games.forEach(function (g) { grid.appendChild(card(g)); });
    })
    .catch(function () {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#b3a688">' +
        "Could not load the game list. Refresh to try again.</p>";
    });

  function card(g) {
    var a = document.createElement("a");
    a.className = "card";
    a.href = "game.html?id=" + encodeURIComponent(g.id);
    var badges = "";
    if (g.web) badges += '<span class="badge play">Play in browser</span>';
    if (g.downloads && g.downloads.length) badges += '<span class="badge dl">Download</span>';
    if (g.genre) badges += '<span class="badge">' + esc(g.genre) + "</span>";
    a.innerHTML =
      '<img class="card-cover" loading="lazy" src="' + esc(g.cover) + '" alt="">' +
      '<div class="card-body"><h3>' + esc(g.title) + "</h3>" +
      '<p class="tagline">' + esc(g.tagline || "") + "</p>" +
      '<div class="badges">' + badges + "</div></div>";
    return a;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
