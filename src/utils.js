export function on(el, ev, fn) {
  ev = ev.split(/\s+/);

  for (let i = 0; i < ev.length; ++i) {
    el.addEventListener(ev[i], fn);
  }
}

export function off(el, ev, fn) {
  ev = ev.split(/\s+/);

  for (let i = 0; i < ev.length; ++i) {
    el.removeEventListener(ev[i], fn);
  }
}
