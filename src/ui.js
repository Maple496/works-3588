var UI = (function () {
  var COLORS = {
    0: '#cdc1b4', 2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563',
    32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61', 512: '#edc850',
    1024: '#edc53f', 2048: '#edc22e'
  };
  function draw(g, w, h, st) {
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#faf8ef';
    g.fillRect(0, 0, w, h);
    var pad = Math.max(8, Math.min(w, h) * 0.02);
    var headH = Math.max(48, h * 0.12);
    g.fillStyle = '#776e65';
    g.font = 'bold ' + Math.floor(headH * 0.4) + 'px sans-serif';
    g.textBaseline = 'middle';
    g.textAlign = 'left';
    g.fillText('2048', pad, headH / 2);
    g.textAlign = 'right';
    g.font = Math.floor(headH * 0.26) + 'px sans-serif';
    g.fillText('分数 ' + st.score + '  最高 ' + st.best, w - pad, headH * 0.36);
    var bs = Math.min(w - pad * 2, h - headH - pad);
    var ox = (w - bs) / 2, oy = headH + pad;
    var cell = (bs - pad * (st.size + 1)) / st.size;
    for (var r = 0; r < st.size; r++) {
      for (var c = 0; c < st.size; c++) {
        var x = ox + pad + c * (cell + pad), y = oy + pad + r * (cell + pad);
        var v = st.grid[r][c];
        g.fillStyle = COLORS[v] || '#3c3a32';
        roundRect(g, x, y, cell, cell, 6);
        g.fill();
        if (v !== 0) {
          g.fillStyle = v <= 4 ? '#776e65' : '#f9f6f2';
          g.font = 'bold ' + Math.floor(cell * (v < 100 ? 0.42 : v < 1000 ? 0.34 : 0.26)) + 'px sans-serif';
          g.textAlign = 'center';
          g.fillText(String(v), x + cell / 2, y + cell / 2);
        }
      }
    }
    if (st.won || st.over) {
      g.fillStyle = 'rgba(238, 228, 218, 0.75)';
      g.fillRect(ox, oy, bs, bs);
      g.fillStyle = '#776e65';
      g.font = 'bold ' + Math.floor(bs * 0.12) + 'px sans-serif';
      g.textAlign = 'center';
      g.fillText(st.won ? '获胜！合成 2048' : '游戏结束', w / 2, oy + bs / 2);
      g.font = Math.floor(bs * 0.06) + 'px sans-serif';
      g.fillText(st.won ? '可继续滑动' : '按 R 重新开始', w / 2, oy + bs / 2 + bs * 0.1);
    }
  }
  function drawHint(g, w, h) {
    g.fillStyle = 'rgba(119, 110, 101, 0.85)';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = 'bold ' + Math.max(14, Math.floor(w * 0.035)) + 'px sans-serif';
    g.fillText('点击 / 触摸 或方向键滑动开始', w / 2, h - 16);
  }
  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }
  function bindKeys(onAction) {
    document.addEventListener('keydown', function (e) {
      var map = { ArrowLeft: 'left', ArrowUp: 'up', ArrowRight: 'right', ArrowDown: 'down' };
      if (map[e.key]) { e.preventDefault(); onAction(map[e.key]); }
      if (e.key === 'r' || e.key === 'R') onAction('restart');
    });
  }
  function bindTouch(el, onAction) {
    var sx = 0, sy = 0, active = false;
    el.addEventListener('touchstart', function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; active = true;
    }, { passive: true });
    el.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
    el.addEventListener('touchend', function (e) {
      if (!active) return;
      active = false;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      if (Math.abs(dx) > Math.abs(dy)) onAction(dx > 0 ? 'right' : 'left');
      else onAction(dy > 0 ? 'down' : 'up');
    });
  }
  return { draw: draw, drawHint: drawHint, bindKeys: bindKeys, bindTouch: bindTouch };
})();
