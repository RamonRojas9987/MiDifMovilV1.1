//imports
importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static-v4';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/iconos app-02.png',
    'img/avatars/iconos app-03.png',
    'img/avatars/iconos app-04.png',
    'img/avatars/iconos app-05.png',
    'img/avatars/iconos app-06.png',
    'img/avatars/iconos app-07.png',
    'js/app.js',
    'js/sw-utils.js'

];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'

];

self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE).then(cache => 
        cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => 
            cache.addAll(APP_SHELL_INMUTABLE));

    
            
    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});

self.addEventListener('activate', e =>{

        const respuesta = caches.keys().then(keys => {
    
            keys.forEach( key => {
    
                //static v4
                if( key !== STATIC_CACHE && key.includes('static')){
                    return caches.delete(key);
                }

                if( key !== DYNAMIC_CACHE && key.includes('dynamic')){
                    return caches.delete(key);
                }
    
            });
    
        });
    
        e.waitUntil( respuesta );
    
    });

self.addEventListener('fetch', e=>{

    const respuesta = caches.match(e.request).then(res => {

        if(res) {
            return res;
        }else {
            console.log(e.request.url);
        }

        return fetch(e.request).then(newRes => {

            return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );


        });

    });

    e.respondWith(respuesta);


});

