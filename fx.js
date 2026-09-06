/* Фон первого экрана: облако частиц сферой с лучами. Только десктоп, реагирует на курсор. */
(function () {
  const hero = document.querySelector('.hero');
  const cv = document.getElementById('herofx');
  if (!hero || !cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 961) return;

  const ctx = cv.getContext('2d', { alpha: true });
  const N = 9000, GA = Math.PI * (3 - Math.sqrt(5));
  const PX = new Float32Array(N), PY = new Float32Array(N), PZ = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(Math.max(0, 1 - y * y)), th = i * GA;
    PX[i] = Math.cos(th) * r; PY[i] = y; PZ[i] = Math.sin(th) * r;
  }

  // палитра: сталь, медь, светлая пыль
  const COL = [[127, 166, 208], [196, 113, 47], [214, 224, 236], [127, 166, 208]];
  const AL = 6, STYLE = [], BX = [], BY = [], BS = [], BN = new Int32Array(COL.length * AL);
  for (let c = 0; c < COL.length; c++) {
    for (let a = 0; a < AL; a++) {
      STYLE.push('rgba(' + COL[c][0] + ',' + COL[c][1] + ',' + COL[c][2] + ',' + ((a + 1) / AL * 0.85).toFixed(3) + ')');
      BX.push(new Float32Array(N)); BY.push(new Float32Array(N)); BS.push(new Float32Array(N));
    }
  }

  let w = 0, h = 0, dpr = 1, cx = 0, cy = 0, R = 0;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = hero.clientWidth; h = hero.clientHeight;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    cv.style.width = w + 'px'; cv.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w * 0.59; cy = h * 0.47; R = Math.min(w, h) * 0.44;
  };
  resize();
  window.addEventListener('resize', resize);

  let mx = -9999, my = -9999, tx = -9999, ty = -9999, force = 0, tForce = 0, lastMove = 0;
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    tx = e.clientX - r.left; ty = e.clientY - r.top;
    tForce = 1; lastMove = performance.now();
    if (mx < -9000) { mx = tx; my = ty; }
  });
  hero.addEventListener('mouseleave', () => { tForce = 0; });

  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; }, { threshold: 0.02 }).observe(hero);
  }

  let t = 0;
  const frame = (now) => {
    requestAnimationFrame(frame);
    if (!visible) return;
    t += 0.0038;
    mx += (tx - mx) * 0.12; my += (ty - my) * 0.12;
    if (now - lastMove > 240) tForce = Math.max(0, tForce - 0.028);
    force += (tForce - force) * 0.08;

    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    BN.fill(0);

    const ca = Math.cos(t), sa = Math.sin(t);
    const ct = Math.cos(0.42), st = Math.sin(0.42);
    const f = 1000, Rm = 220, Rm2 = Rm * Rm;

    for (let i = 0; i < N; i++) {
      const bx = PX[i], by = PY[i], bz = PZ[i];
      const n = Math.sin(bx * 3.1 + t * 2.0) * Math.sin(by * 2.6 - t * 1.6) * Math.sin(bz * 3.3 + t * 1.2);
      const sp = Math.abs(Math.sin(by * 5.0 + bx * 3.4 + t * 0.8));
      const spike = sp * sp * sp * sp * sp * sp;
      const rr = R * (0.80 + 0.15 * n + 0.42 * spike);
      const x = bx * rr, y = by * rr, z = bz * rr;
      let X = x * ca + z * sa, Z = -x * sa + z * ca;
      const Y = y * ct - Z * st; Z = y * st + Z * ct;
      const s = f / (f + Z + R * 1.5);
      let sx = cx + X * s, sy = cy + Y * s;

      if (force > 0.01) {
        const dx = sx - mx, dy = sy - my, d2 = dx * dx + dy * dy;
        if (d2 < Rm2) {
          const d = Math.sqrt(d2) || 1, k = 1 - d / Rm;
          const push = k * k * 92 * force;
          sx += (dx / d) * push; sy += (dy / d) * push;
        }
      }
      if (sx < -30 || sx > w + 30 || sy < -30 || sy > h + 30) continue;

      let depth = (s - 0.66) / 0.42; depth = depth < 0 ? 0 : depth > 1 ? 1 : depth;
      let a = (0.24 + 0.90 * depth) * (0.34 + 0.66 * spike);
      if (a > 1) a = 1;
      const ai = (a * AL) | 0, ab = ai > AL - 1 ? AL - 1 : ai;
      const b = (i & 3) * AL + ab, k = BN[b]++;
      BX[b][k] = sx; BY[b][k] = sy; BS[b][k] = depth > 0.72 ? 2 : 1;
    }

    for (let b = 0; b < STYLE.length; b++) {
      const cnt = BN[b];
      if (!cnt) continue;
      ctx.fillStyle = STYLE[b];
      const xs = BX[b], ys = BY[b], ss = BS[b];
      for (let k = 0; k < cnt; k++) ctx.fillRect(xs[k], ys[k], ss[k], ss[k]);
    }
    ctx.globalCompositeOperation = 'source-over';
  };
  requestAnimationFrame(frame);
})();
