var Engine = (function () {
  var SIZE = 4;
  var grid = [], score = 0, best = 0, won = false, over = false;
  function reset() {
    grid = [];
    for (var r = 0; r < SIZE; r++) {
      var row = [];
      for (var c = 0; c < SIZE; c++) row.push(0);
      grid.push(row);
    }
    score = 0; won = false; over = false;
    spawn(); spawn();
  }
  function spawn() {
    var empty = [];
    for (var r = 0; r < SIZE; r++) for (var c = 0; c < SIZE; c++) if (grid[r][c] === 0) empty.push([r, c]);
    if (!empty.length) return false;
    var p = empty[Math.floor(Math.random() * empty.length)];
    grid[p[0]][p[1]] = Math.random() < 0.9 ? 2 : 4;
    return true;
  }
  function slideRow(row) {
    var arr = row.filter(function (v) { return v !== 0; });
    var out = [], gained = 0;
    for (var i = 0; i < arr.length; i++) {
      if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
        var merged = arr[i] * 2;
        out.push(merged); gained += merged; i++;
        if (merged === 2048) won = true;
      } else out.push(arr[i]);
    }
    while (out.length < SIZE) out.push(0);
    return { row: out, gained: gained };
  }
  function rotate(g, times) {
    var res = g;
    for (var t = 0; t < times; t++) {
      var next = [];
      for (var r = 0; r < SIZE; r++) {
        var row = [];
        for (var c = 0; c < SIZE; c++) row.push(res[SIZE - 1 - c][r]);
        next.push(row);
      }
      res = next;
    }
    return res;
  }
  function canMove() {
    for (var r = 0; r < SIZE; r++) for (var c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c + 1 < SIZE && grid[r][c] === grid[r][c + 1]) return true;
      if (r + 1 < SIZE && grid[r][c] === grid[r + 1][c]) return true;
    }
    return false;
  }
  function move(dir) {
    if (over) return false;
    var k = { left: 0, up: 1, right: 2, down: 3 }[dir];
    if (k === undefined) return false;
    var rot = rotate(grid, k);
    var gained = 0, moved = false;
    for (var r = 0; r < SIZE; r++) {
      var res = slideRow(rot[r]);
      if (res.row.join(',') !== rot[r].join(',')) moved = true;
      rot[r] = res.row;
      gained += res.gained;
    }
    if (!moved) return false;
    grid = rotate(rot, (4 - k) % 4);
    score += gained;
    if (score > best) best = score;
    spawn();
    if (!canMove()) over = true;
    return true;
  }
  function state() {
    return { grid: grid, score: score, best: best, won: won, over: over, size: SIZE };
  }
  return { reset: reset, move: move, state: state };
})();
