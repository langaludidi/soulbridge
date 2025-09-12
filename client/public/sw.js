// Service Worker for SoulBridge
const CACHE_NAME = 'soulbridge-v1';
const STATIC_CACHE = 'soulbridge-static-v1';
const API_CACHE = 'soulbridge-api-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  // Core CSS and JS files will be cached automatically by Workbox
];

// API routes to cache with network-first strategy
const API_ROUTES = [
  '/api/memorials',
  '/api/profile',
  '/api/partners',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim all clients immediately
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // Handle static assets with cache-first strategy
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.includes('/assets/')
  ) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // Handle navigation requests with network-first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(request, STATIC_CACHE));
    return;
  }
});

// Network-first strategy with cache fallback
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // For navigation requests, return offline page
    if (request.mode === 'navigate') {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <title>SoulBridge - Offline</title>
            <style>
              body { 
                font-family: system-ui, sans-serif; 
                text-align: center; 
                padding: 2rem; 
                background: #f9fafb;
              }
              .container { 
                max-width: 400px; 
                margin: 0 auto; 
                background: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              .icon { font-size: 3rem; margin-bottom: 1rem; }
              h1 { color: #374151; margin-bottom: 1rem; }
              p { color: #6b7280; margin-bottom: 2rem; }
              button { 
                background: #3b82f6; 
                color: white; 
                border: none; 
                padding: 0.75rem 1.5rem; 
                border-radius: 6px;
                cursor: pointer;
                font-size: 1rem;
              }
              button:hover { background: #2563eb; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">💭</div>
              <h1>You're offline</h1>
              <p>Check your internet connection and try again. Some features may still be available from cache.</p>
              <button onclick="window.location.reload()">Try Again</button>
            </div>
          </body>
        </html>
        `,
        {
          headers: { 'Content-Type': 'text/html' },
          status: 200,
        }
      );
    }
    
    // For other requests, return a basic error response
    return new Response('Network error', { status: 503 });
  }
}

// Cache-first strategy with network fallback
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Asset not available offline', { status: 503 });
  }
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Handle any queued actions when back online
  try {
    const cache = await caches.open('offline-actions');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        await fetch(request);
        await cache.delete(request);
      } catch (error) {
        // Keep in cache for next sync
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}