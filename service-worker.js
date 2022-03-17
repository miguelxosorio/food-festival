const FILES_TO_CACHE = [
    "./index.html",
    "./events.html",
    "./tickets.html",
    "./schedule.html",
    "./assets/css/style.css",
    "./assets/css/bootstrap.css",
    "./assets/css/tickets.css",
    "./dist/app.bundle.js",
    "./dist/events.bundle.js",
    "./dist/tickets.bundle.js",
    "./dist/schedule.bundle.js"
] // collection of files to cache

const APP_PREFIX = 'FoodFest-'; // app name
const VERSION = 'version_01';   // version iteration - when changing version numbers, the cache name will be a reference to that new version number
const CACHE_NAME = APP_PREFIX + VERSION;

// service workers run before the window object has even been created - self instead of window.addEventListener
// The context of self here refers to the service worker object
self.addEventListener('install', function(e) {
    e.waitUntil(    // waitUntil() - tell the browser to wait until the work is complete before terminating the service worker
                    // This ensures that the service worker doesn't move on from the installing phase until it's finished executing all of its code.
    caches.open(CACHE_NAME).then(function(cache) { // open() - to find the specific cache by name
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE) // then add every file in the FILES_TO_CACHE array to the cache.
        })
    )
})

// activation step - clears out any old data from the cache and tell the service worker how to manage caches
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {                  // .keys() returns an array of all cache names, which we're calling keyList
            let cacheKeepList = keyList.filter( function(key) { // keyList is a param that contains all cache names under <username>github.io
                return key.indexOf(APP_PREFIX);                 // we may host many sites from the same URL, should filter out caches that have the app prefix
            })                                                  // capture the ones that have that prefix, stored in APP_PREFIX and save to an anrray called cacheKeepList using .filter() method
            cacheKeepList.push(CACHE_NAME)                      // add the current cache to the keeplist in the activate event listener
            
            return Promise.all(
                keyList.map(function(key, i) {                  // key and index
                    if(cacheKeepList.indexOf(key) === - 1) {    // return a value of - 1 if item is not found in keepList    
                        console.log('deleting cache : ' + keyList[i]);
                        return caches.delete(keyList[i])        // if key isn't found in keeplist, delete in the cache
                    }
                })
            );
        })
    );
});

// offline
self.addEventListener('fetch', function(e) {                //  listen for the fetch event, log the URL of the requested resource
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function(request) {    // we use .match() to determine if the resource already exists in caches. If it does, we'll log the URL to the console with a message and then return the cached resource
            if(request) {                                   // if cache is available respond with cache 
                console.log('responding with cache : ' + e.request.url)
                return request
            } else {                                        // if no cache, try fetching request
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }
            // You can omit if/else for console.log & put one line below like this too.
            // return request || fetch(e.request)

        })
    )
})