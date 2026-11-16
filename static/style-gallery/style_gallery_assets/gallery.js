// 视觉风格画廊：分组筛选 + 页内搜索（纯客户端，无依赖）
(function () {
  "use strict";

  var activeFilter = {};

  function applyView(secId) {
    var grid = document.querySelector('.grid[data-sec="' + secId + '"]');
    if (!grid) return;
    var g = activeFilter[secId] || "";
    var q = (window.__galleryQuery || "").toLowerCase();
    var visible = 0;
    grid.querySelectorAll(".card").forEach(function (card) {
      var okG = !g || card.dataset.group === g;
      var okQ = !q || (card.dataset.search || "").indexOf(q) !== -1;
      var show = okG && okQ;
      card.classList.toggle("hidden", !show);
      if (show) visible++;
    });
    var note = document.querySelector('.empty-note[data-sec="' + secId + '"]');
    if (note) note.classList.toggle("hidden", visible > 0);
  }

  document.querySelectorAll(".filters .chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var sec = chip.parentElement.dataset.sec;
      chip.parentElement.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("on"); });
      chip.classList.add("on");
      activeFilter[sec] = chip.dataset.g;
      applyView(sec);
    });
  });

  var searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      window.__galleryQuery = e.target.value.trim();
      document.querySelectorAll("section").forEach(function (sec) { applyView(sec.id); });
      // 总览页：直接筛选 hub 卡片
      var hubQuery = window.__galleryQuery.toLowerCase();
      document.querySelectorAll(".hub-card").forEach(function (card) {
        var hay = (card.dataset.search || "");
        card.classList.toggle("hidden", hubQuery !== "" && hay.indexOf(hubQuery) === -1);
      });
    });
  }
})();
