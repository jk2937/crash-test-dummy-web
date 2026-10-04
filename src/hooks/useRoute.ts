import { useSyncExternalStore } from 'react';

// The site's pages, kept in the address after '#' -- #/lab -- so they work on
// GitHub Pages without any server setup, and the back button works.
export type Route = 'home' | 'lab';

function read(): Route {
  return window.location.hash === '#/lab' ? 'lab' : 'home';
}
function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

export function useRoute(): Route {
  return useSyncExternalStore(subscribe, read);
}

export function go(route: Route) {
  window.location.hash = route === 'lab' ? '#/lab' : '#/';
}
