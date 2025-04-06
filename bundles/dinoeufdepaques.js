var M = [
  255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
  255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
  255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 62, 255, 255,
  255, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 255, 255, 255, 0, 255, 255,
  255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 255, 255, 255, 255, 255, 255, 26, 27, 28, 29, 30, 31, 32,
  33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
];
function L(t) {
  if (t >= M.length) throw new Error("Unable to parse base64 string.");
  let e = M[t];
  if (e === 255) throw new Error("Unable to parse base64 string.");
  return e;
}
function G(t) {
  let e = t.length % 4,
    n = t;
  e !== 0 && (n += e === 3 ? "=" : e === 2 ? "==" : "===");
  let i = n.indexOf("=");
  if (i !== -1 && i < n.length - 2)
    throw new Error("Unable to parse base64 string.");
  let c = n.endsWith("==") ? 2 : n.endsWith("=") ? 1 : 0,
    E = n.length,
    p = new Uint8Array((E / 4) * 3),
    D;
  for (let g = 0, S = 0; g < E; g += 4, S += 3)
    (D =
      (L(n.charCodeAt(g)) << 18) |
      (L(n.charCodeAt(g + 1)) << 12) |
      (L(n.charCodeAt(g + 2)) << 6) |
      L(n.charCodeAt(g + 3))),
      (p[S] = D >> 16),
      (p[S + 1] = (D >> 8) & 255),
      (p[S + 2] = D & 255);
  return p.subarray(0, p.length - c);
}
var U = O(
    "UklGRuwAAABXRUJQVlA4WAoAAAAQAAAAVwAAVAAAQUxQSE0AAAABDzD/ERGCUdtIkiItgOLPZiE1g3rMXXu8I/o/AbRlW6S43VFR7Q8Qwwg7QkDZkHI7xuA2RNVUSJ/3qSNaIqsaUrCtnDK+csQ4gSgdAgBWUDggeAAAAFAJAJ0BKlgAVQA+bSiRRaQiIZjuzABABsS0gAtqXwB/IPf97/CNxcHcc2w/unx9sLS9x6k8GLk0kRXF7wka9obb/mK8UuRZ9K/WzCHrJnw7ofAAAP77nVn5i39pMNLzvCdWDa9Bheh14NumBGnRsEDNUK+pEAAAAA==",
    "image/webp",
  ),
  N = O(
    "UklGRuYAAABXRUJQVlA4WAoAAAAQAAAAVwAAVAAAQUxQSEkAAAABDzD/ERGCTSNJjprB8mfzkIZBB+/nTRzR/wlgHXVocX1FqtY/YNit0IoBotCyWCO4LpmsUrLN++SWOUVXVrSgTk8mRUgTZd4CAFZQOCB2AAAA8AgAnQEqWABVAD5tKJJFpCIhmH8kAEAGxLSAC2pfAH8l9/3v8IyJGmsC/PZUxXKIF9DFBJAYuoiRFcXvCMBregvJVb4Xj+uuCzecZbL5XwAA/vudWieLf2kw3ie36lL47jU36HXg26YEac9949i5P//piwAAAA==",
    "image/webp",
  ),
  a = O(
    "UklGRsgAAABXRUJQVlA4WAoAAAAQAAAAMQAAaAAAQUxQSEcAAAABDzD/ERGCURtJjlpaAENlGQz1gXThO9LmHN4R/Z8AQAlpwfHphOoeLmmDM5eWUoMpaYLS45zjCnGOUQHcm635HaOmXRrWBgBWUDggWgAAAFAGAJ0BKjIAaQA+ZSaPRaQiIRrfJABABkS0gABFY1QPcemKs+XBlVsTKxrD+ICRG5uaseo2YNyxxnwAAP78Xjf+Ur//KqkMgAAMn8fWz8X7X4CKZ/OwAAAAAA==",
    "image/webp",
  );
function O(t, e) {
  let n = G(t),
    i = new Blob([n.buffer], { type: e }),
    c = URL.createObjectURL(i),
    E = new Image();
  return (E.src = c), E;
}
var m = 500,
  l = 1e3,
  z = 30,
  T = 30,
  b = 200,
  X = 15,
  y = 5,
  K = 250,
  x = 18,
  B = m - (T + 30),
  u = document.createElement("div");
u.style.position = "fixed";
u.style.top = "0px";
u.style.left = "0px";
u.style.width = "100%";
u.style.textAlign = "center";
u.style.zIndex = String(Math.pow(2, 32));
var d = document.createElement("canvas"),
  o = d.getContext("2d");
d.height = m;
d.width = l;
d.style.backgroundColor = "#ffffffcc";
d.style.border = "1px dashed black";
u.appendChild(d);
document.body.appendChild(u);
var Q = !1,
  I,
  R,
  h = !0,
  C = !0,
  s = null,
  f = b,
  w = X,
  P = y,
  r = [],
  A = [];
function Y() {
  (Q = !0),
    (I = void 0),
    (R = void 0),
    (h = !0),
    (C = !0),
    (s = null),
    (f = b),
    (w = X),
    (P = y),
    (r.length = 0),
    (A.length = 0),
    F(300),
    j(0),
    window.requestAnimationFrame(k);
}
Promise.all([_(U), _(N), _(a)]).then(() => {
  let t = [13, 32, 38];
  document.addEventListener("keydown", (e) => {
    t.includes(e.keyCode) &&
      (e.preventDefault(),
      e.stopPropagation(),
      e.stopImmediatePropagation(),
      W());
  }),
    H(0),
    V(),
    v(),
    d.addEventListener("click", () => W()),
    (o.font = "24px monospace"),
    (o.fillStyle = "#000000"),
    o.fillText('Press "jump" to start', 10, 100);
});
function k(t) {
  I === void 0 && (I = t);
  let e = R === void 0 ? 0 : t - R;
  if (
    ((R = t),
    (P -= e),
    P <= 0 && (P += y),
    s !== null &&
      ((w -= e),
      w <= 0 &&
        (s >= K
          ? ((C = !1), (s -= x))
          : C
            ? (s += x)
            : s - x <= 0
              ? ((C = !0), (s = null), (f = b), (h = !h))
              : (s -= x),
        (w += X))),
    f !== null && ((f -= e), f <= 0 && ((h = !h), (f += b))),
    ee(),
    ne(),
    Z(),
    H(t - I),
    V(),
    oe(),
    te(),
    v(),
    q())
  ) {
    $(), (Q = !1);
    return;
  }
  window.requestAnimationFrame(k);
}
function V() {
  o.beginPath(), o.moveTo(0, B), o.lineTo(l, B), (o.lineWidth = 2), o.stroke();
}
function Z() {
  o.clearRect(0, 0, l, m);
}
function W() {
  if (!Q) {
    Y();
    return;
  }
  s === null && ((s = 0), (f = null));
}
function q() {
  let [t, e] = J();
  for (let n of r)
    if (
      !(n < 10) &&
      !(e > 65 && C) &&
      n + 20 - (t + U.naturalWidth) <= 0 &&
      e - (T + (a.naturalHeight - 30)) <= 0
    )
      return !0;
  return !1;
}
function H(t) {
  (o.font = "24px monospace"),
    o.fillText("Score: " + String(Math.floor(t / 200)), 10, 30);
}
function $() {
  (o.font = "35px monospace"),
    (o.fillStyle = "#990000"),
    o.fillText("GAME OVER", 10, 70),
    (o.font = "24px monospace"),
    (o.fillStyle = "#000000"),
    o.fillText('Press "jump" to restart', 10, 100);
}
function J() {
  let t = z,
    e = T + (s != null ? s : 0);
  return [t, e];
}
function v() {
  let t = h ? U : N,
    [e, n] = J();
  o.drawImage(t, e, m - t.naturalHeight - n, t.naturalWidth, t.naturalHeight);
}
function ee() {
  for (let e = 0; e < r.length; e++) {
    let i = r[e] - 10;
    if (i < -a.naturalWidth) {
      r.splice(e, 1), e--;
      continue;
    }
    r[e] = i;
  }
  let t = r[r.length - 1];
  (t === void 0 || t <= l) && F(l);
}
function te() {
  for (let t = 0; t < r.length; t++) {
    let e = r[t];
    if (e >= l) return;
    let n = T;
    o.drawImage(a, e, m - a.naturalHeight - n, a.naturalWidth, a.naturalHeight);
  }
}
function ne() {
  for (let e = 0; e < A.length; e++) {
    let { x: n } = A[e],
      i = n - 10;
    if (i < -5) {
      A.splice(e, 1), e--;
      continue;
    }
    A[e].x = i;
  }
  let t = A[A.length - 1];
  (t === void 0 || t <= l) && j(l);
}
function oe() {
  for (let t = 0; t < r.length; t++) {
    let { x: e, y: n, longueur: i } = A[t];
    if (e >= l) return;
    o.beginPath(),
      o.moveTo(e, n),
      o.lineTo(e + i, n),
      (o.lineWidth = 1),
      o.stroke();
  }
}
function _(t) {
  return new Promise((e, n) => {
    t.addEventListener("load", e), t.addEventListener("error", n);
  });
}
function F(t) {
  let e = (Math.random() * 2 - 1) * 0.3,
    n = t + 500 * (1 + e);
  r.push(n);
  for (let i = 2; i <= 10; i++) {
    let c;
    do (e = (Math.random() * 2 - 1) * 0.8), (c = n + 300 * (1 + e));
    while (c - n < a.naturalWidth + 250);
    r.push(c), (n = c);
  }
}
function j(t) {
  let e = (Math.random() * 2 - 1) * 0.3;
  for (let n = 1; n <= 1e3; n++)
    (e = (Math.random() * 2 - 1) * 0.6),
      A.push({
        x: t + n * 100 * (1 + e),
        y: Math.random() * (m - (B + 5) + 1) + (B + 5),
        longueur: Math.random() * 20 + 1,
      });
}
