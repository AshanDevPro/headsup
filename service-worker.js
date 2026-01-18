const CACHE_NAME = "adivina-patrimonio-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./assets/bg-main.png",
  "./assets/bg-howto.png",
  "./assets/bg-draw.png",
  "./assets/bg-game.png",
  "./assets/title.png",
  "./assets/play-button.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
