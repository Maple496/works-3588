var canvas = null, g = null, raf = 0, keyHandler = null;
var interacted = false;
function loop() {
  if (canvas && g) {
    UI.draw(g, canvas.width, canvas.height, Engine.state());
    if (!interacted) UI.drawHint(g, canvas.width, canvas.height);
  }
  raf = requestAnimationFrame(loop);
}
function onAction(act) {
  interacted = true;
  if (act === 'restart') Engine.reset();
  else Engine.move(act);
}
function mount(ctx) {
  canvas = document.createElement('canvas');
  canvas.width = ctx.bounds.w;
  canvas.height = ctx.bounds.h;
  canvas.style.position = 'absolute';
  canvas.style.left = '0';
  canvas.style.top = '0';
  canvas.style.width = ctx.bounds.w + 'px';
  canvas.style.height = ctx.bounds.h + 'px';
  canvas.style.touchAction = 'none';
  ctx.stage.appendChild(canvas);
  g = canvas.getContext('2d');
  interacted = false;
  Engine.reset();
  ctx.onBounds(function (b) {
    canvas.width = b.w;
    canvas.height = b.h;
    canvas.style.width = b.w + 'px';
    canvas.style.height = b.h + 'px';
  });
  keyHandler = function (e) {
    var map = { ArrowLeft: 'left', ArrowUp: 'up', ArrowRight: 'right', ArrowDown: 'down' };
    if (map[e.key]) { e.preventDefault(); onAction(map[e.key]); }
    if (e.key === 'r' || e.key === 'R') onAction('restart');
  };
  document.addEventListener('keydown', keyHandler);
  UI.bindTouch(canvas, onAction);
  canvas.addEventListener('mousedown', function () { interacted = true; });
  raf = requestAnimationFrame(loop);
}
function destroy() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  if (keyHandler) document.removeEventListener('keydown', keyHandler);
  keyHandler = null;
  if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
  canvas = null;
  g = null;
}
Work.register({ name: '2048滑动合成', mount: mount, destroy: destroy });
