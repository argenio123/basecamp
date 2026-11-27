/**
 * Honest labelling for pictures that aren't photographs. BaseCamp hasn't opened yet, so:
 * - "ai": AI-generated pictures of people and scenes are illustrations, not real members, staff or events. Anything
 *   under a `/generated/` folder, plus the class-page step photos (`/images/programs/steps/`, generated to the
 *   brand-book photography brief).
 * - "render": every file in `/images/facilities/` is an architectural render of the building under construction
 *   (interiors "1st floor- …" / "2F …", the floor-plan "top view", and the exterior, aerial, front, detail and
 *   landscape views). Real site photos, once there are any, go in `/images/facilities/photos/` and stay unlabelled.
 * The rule is path-based so editors don't have to remember. FacilityShowcase carries its own "Concept render" tag.
 *
 * Localised (src/i18n/ui.ts imageLabel): the pills (./AiImageLabelPill, a Client Component) read the page's language
 * themselves; the alt-text helpers take an optional locale (default English): pass getLocale() on the server or
 * useLocale() on the client.
 */
export { aiImageAlt, imageKind, isAiGeneratedImage, isConceptRender, labelledImageAlt, renderImageAlt, type ImageKind } from "./ai-image";
export { default, ImageLabel } from "./AiImageLabelPill";
