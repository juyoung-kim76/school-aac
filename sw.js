'use strict';
const CACHE='school-aac-shell-v2-0-1';
const SHELL=['./','./index.html','./manifest.webmanifest','./AAC.ico','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('school-aac-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const url=new URL(e.request.url);if(e.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL('./',self.location).pathname)||url.pathname.endsWith('/common.json'))return;e.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(e.request);if(response.ok)await cache.put(e.request,response.clone());return response}catch(err){const saved=await cache.match(e.request);if(saved)return saved;if(e.request.mode==='navigate'){const home=await cache.match('./index.html');if(home)return home}throw err}})())});
