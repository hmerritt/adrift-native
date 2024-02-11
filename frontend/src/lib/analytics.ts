import Plausible, { type EventOptions, type PlausibleOptions } from "plausible-tracker";

// Add all custom events/goals here.
export type PlausibleEvents = "pageview";

/**
 * Plausible Analytics - https://plausible.io.
 *
 * Enable and configure env in `/bootstrap.cjs`.
 */
export const plausible = Plausible({
	domain: env.plausible.domain || location.hostname,
	apiHost: env.plausible.apiHost || "https://plausible.io",
	hashMode: false,
	trackLocalhost: true
});

export const trackEvent = (
	eventName: PlausibleEvents,
	options?: EventOptions,
	eventData?: PlausibleOptions
) => {
	if (!env.plausible.enable) return;
	plausible.trackEvent(eventName, options, eventData);
};

export const enableAutoPageviews = () => {
	if (!env.plausible.enable) return;
	plausible.enableAutoPageviews();
};

export const enableAutoOutboundTracking = (
	targetNode?: (Node & ParentNode) | undefined,
	observerInit?: MutationObserverInit | undefined
) => {
	if (!env.plausible.enable) return;
	plausible.enableAutoOutboundTracking(targetNode, observerInit);
};

export const plausibleBootstrap = () => {
	enableAutoPageviews();
	enableAutoOutboundTracking();
};
