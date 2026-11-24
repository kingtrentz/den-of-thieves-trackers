/* Network-first service worker: always fresh when online, offline fallback, auto-update */
const CACHE = "dot-shell-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  if (r.mode !== "navigate") return;
  e.respondWith((async () => {
    try {
      const res = await fetch(u.href, {cache: "no-cache", credentials: "same-origin"});
      if (res.ok) { const c = res.clone(); caches.open(CACHE).then(cc => cc.put(u.origin + u.pathname, c)).catch(() => {}); }
      return res;
    } catch (err) {
      const hit = await caches.match(u.origin + u.pathname) || await caches.match(new URL("index.html", self.registration.scope).href);
      if (hit) return hit;
      throw err;
    }
  })());
});
