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

export const isFunction = fn => typeof fn === 'function';

export const isDef = val => typeof val !== 'undefined';

export const getPointerEvent = ev => (ev.touches && ev.touches[0]) || ev;
