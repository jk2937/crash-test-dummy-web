import { useSyncExternalStore } from 'react';

// The site's pages, kept in the address after '#' -- #/lab -- so they work on
// GitHub Pages without any server setup, and the back button works. Every
// page but home is named for the HUD tile that opens it.
export const ROUTES = [
  'home', 'lab', 'facility', 'certs',
  'rebirth', 'contracts', 'setup', 'fx', 'vehicles', 'collection', 'store',
] as const;
export type Route = (typeof ROUTES)[number];

function read(): Route {
  const name = window.location.hash.replace(/^#\/?/, '');
  return (ROUTES as readonly string[]).includes(name) ? (name as Route) : 'home';
}
function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

export function useRoute(): Route {
  return useSyncExternalStore(subscribe, read);
}

export function go(route: Route) {
  window.location.hash = route === 'home' ? '#/' : `#/${route}`;
}

export function isRoute(name: string): name is Route {
  return (ROUTES as readonly string[]).includes(name);
}
