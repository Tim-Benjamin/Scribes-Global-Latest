/**
 * "Page ready" signal. The preloader and the route curtain cover
 * the screen; intro animations should start only once the new
 * page is actually visible. Components call onPageReady(cb) and
 * get called immediately if the page is already uncovered.
 */
type Listener = () => void;

let ready = false;
const listeners = new Set<Listener>();

export function setPageReady(value: boolean) {
  ready = value;
  if (!value) return;
  const pending = Array.from(listeners);
  listeners.clear();
  pending.forEach((fn) => fn());
}

export function isPageReady() {
  return ready;
}

export function onPageReady(fn: Listener) {
  if (ready) {
    fn();
    return () => undefined;
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
