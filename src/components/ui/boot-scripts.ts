// Inline <head> scripts for the root layout. They run before first paint, so they must stay tiny and
// dependency-free. Kept in a plain module (not "use client") so the server layout imports the strings themselves.

/** <html data-route="home|page|admin" data-section="facilities|…">; RouteScope keeps both in sync on navigation. */
export const ROUTE_SCOPE_SCRIPT = `(function(){var p=location.pathname,d=document.documentElement.dataset;d.route=p==="/"?"home":p==="/login"||p.indexOf("/admin")===0?"admin":"page";d.section=p.split("/")[1]||"home";})();`;

/**
 * Starts the scroll-reveal hidden pose before first paint, so content already on screen after a refresh plays its
 * entrance once SiteReveal takes over (instead of painting visible, hiding and re-showing in one flicker).
 * Skipped for the admin and under prefers-reduced-motion. If SiteReveal never claims the page
 * (data-reveal-owner), the classes are removed after 6s so content can never stay hidden.
 */
export const REVEAL_BOOT_SCRIPT = `(function(){var r=document.documentElement,p=location.pathname;if(p==="/login"||p.indexOf("/admin")===0)return;if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;r.classList.add("home-reveal-ready","reveal-ready");setTimeout(function(){if(!r.dataset.revealOwner)r.classList.remove("home-reveal-ready","reveal-ready");},6000);})();`;

/**
 * On a page refresh only, start at the top (the header) instead of the browser's restored scroll position.
 * Back/forward keep their native restoration: scrollRestoration is switched back to "auto" once the page has loaded.
 */
export const RELOAD_TO_TOP_SCRIPT = `(function(){var n=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];if(!n||n.type!=="reload")return;if("scrollRestoration" in history)history.scrollRestoration="manual";window.scrollTo(0,0);addEventListener("load",function(){window.scrollTo(0,0);setTimeout(function(){if("scrollRestoration" in history)history.scrollRestoration="auto";},0);});})();`;
