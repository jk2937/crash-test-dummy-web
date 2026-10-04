import { useSyncExternalStore } from 'react';

// The site's pages, kept in the address after '#' -- #/lab -- so they work on
// GitHub Pages without any server setup, and the back button works.
export type Route = 'home' | 'lab' | 'facility';

const PATHS: Record<Route, string> = { home: '#/', lab: '#/lab', facility: '#/facility' };

function read(): Route {
  const hash = window.location.hash;
  return (Object.keys(PATHS) as Route[]).find((r) => r !== 'home' && PATHS[r] === hash) ?? 'home';
}
function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

export function useRoute(): Route {
  return useSyncExternalStore(subscribe, read);
}

export function go(route: Route) {
  window.location.hash = PATHS[route];
}
