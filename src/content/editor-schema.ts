// Admin editor schema (spec §D.6). Client-safe: drives the SectionEditor UI and server validation (validate.ts).
// Every key of every section type is covered by a group (validate.ts asserts this at compile time), and
// FieldsFor<T> makes nested objects and list items cover every key of their own types as well.
import { FACILITY_ANCHOR_LABEL, INTEREST_OPTIONS, type FacilityAnchor } from "./constants";
import { IMAGE_LIBRARY } from "./images";
import { AUDIENCE_LABEL, AVAILABILITY_LABEL } from "./labels";
import type {
  Audience, Availability, LaunchPhase, LinkRef, Price, ProgrammeGoalId, SectionKey, SiteContent, SocialPlatform,
} from "./types";

// ---------- field kinds (loose runtime shapes) ----------
type Base = { label: string; help?: string };
export type Option<V extends string = string> = { value: V; label: string };
/** format: extra pattern checks for single-line text. */
export type TextFormat = "slug" | "email" | "phone" | "e164" | "position";
export type TextField = Base & { kind: "text"; max?: number; required?: boolean; format?: TextFormat };
/** Unique within its list; ^[a-z0-9-]{1,60}$ */
export type IdField = Base & { kind: "id" };
export type TextareaField = Base & { kind: "textarea"; max?: number; rows?: number; required?: boolean };
export type NumberField = Base & { kind: "number"; min?: number; max?: number; integer?: boolean; nullable?: boolean };
export type BooleanField = Base & { kind: "boolean" };
export type SelectField<V extends string = string> = Base & { kind: "select"; options: readonly Option<V>[] };
export type MultiSelectField<V extends string = string> = Base & { kind: "multiSelect"; options: readonly Option<V>[] };
export type DateField = Base & { kind: "date" };
export type ImageField = Base & { kind: "image" };
/** "/path#hash" (not "//") or "https://…"; optional allows "". */
export type HrefField = Base & { kind: "href"; optional?: boolean };
/** "" or https:// */
export type UrlField = Base & { kind: "url" };
/** "" or https:// */
export type VideoField = Base & { kind: "video" };
export type PriceField = Base & { kind: "price" };
export type StringListField = Base & { kind: "stringList"; maxItems: number; max?: number };
export type RefSource = "pricingItems" | "recoveryModalities";
export type RefsField = Base & { kind: "refs"; source: RefSource; maxItems?: number };
export type ObjectField = Base & { kind: "object"; fields: Record<string, Field> };
export type ListField = Base & { kind: "list"; itemTitleKey: string; maxItems: number; fields: Record<string, Field>; newItem: () => unknown };

export type Field =
  | TextField | IdField | TextareaField | NumberField | BooleanField | SelectField | MultiSelectField | DateField
  | ImageField | HrefField | UrlField | VideoField | PriceField | StringListField | RefsField | ObjectField | ListField;
export type FieldKind = Field["kind"];

// ---------- typed fields (compile-time coverage of every key) ----------
type TypedObjectField<V> = Base & { kind: "object"; fields: FieldsFor<V> };
type TypedListField<I> = Base & { kind: "list"; itemTitleKey: keyof I & string; maxItems: number; fields: FieldsFor<I>; newItem: () => I };
type StringFieldFor<V extends string> = string extends V
  ? TextField | IdField | TextareaField | DateField | ImageField | HrefField | UrlField | VideoField
  : SelectField<V>;
type FieldFor<V> =
  [V] extends [boolean] ? BooleanField :
  [V] extends [number] ? NumberField :
  [V] extends [number | null] ? NumberField & { nullable: true } :
  [V] extends [Price | null] ? PriceField :
  [V] extends [string] ? StringFieldFor<V> :
  [V] extends [readonly (infer I)[]]
    ? [I] extends [string] ? (string extends I ? StringListField | RefsField : MultiSelectField<I>) : TypedListField<I>
    : [V] extends [object] ? TypedObjectField<V> : never;
export type FieldsFor<T> = { [K in keyof T]-?: FieldFor<T[K]> };

export type EditorGroup<T> = { title: string; anchor?: string; help?: string; fields: Partial<FieldsFor<T>> };
export type SectionSchema<T> = { label: string; description: string; previewPath: string; groups: readonly EditorGroup<T>[] };
export type EditorSchema = { [K in SectionKey]: SectionSchema<SiteContent[K]> };

// ---------- option lists ----------
const opts = <V extends string>(labels: Record<V, string>): Option<V>[] =>
  (Object.keys(labels) as V[]).map((value) => ({ value, label: labels[value] }));
const same = <V extends string>(values: readonly V[]): Option<V>[] => values.map((value) => ({ value, label: value }));

export const AVAILABILITY_OPTIONS = opts<Availability>(AVAILABILITY_LABEL);
const LAUNCH_PHASE_OPTIONS = opts<LaunchPhase>({ "pre-launch": "Pre-launch", "soft-opening": "Soft opening", live: "Live (open)" });
const PLATFORM_OPTIONS = same<SocialPlatform>(["Instagram", "Facebook", "TikTok", "YouTube", "X"]);
const AUDIENCE_OPTIONS = opts<Audience>(AUDIENCE_LABEL);
const ANCHOR_OPTIONS = opts<FacilityAnchor>(FACILITY_ANCHOR_LABEL);
const PROGRAMME_GOAL_OPTIONS = opts<ProgrammeGoalId>({
  strength: "Get stronger",
  movement: "Move better",
  engine: "Build my engine",
  fitness: "Get fit",
  recover: "Recover & reset",
  new: "I'm new",
});
export const IMAGE_OPTIONS: Option[] = IMAGE_LIBRARY.map((src) => ({ value: src, label: src.replace("/images/", "") }));

/** Short random id for new list items (called from click handlers only). */
export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 7)}`;
}

// ---------- field builders ----------
const text = (label: string, o: Omit<TextField, "kind" | "label"> = {}): TextField => ({ kind: "text", label, ...o });
const title = (label = "Title"): TextField => text(label, { required: true, max: 160 });
const area = (label: string, o: Omit<TextareaField, "kind" | "label"> = {}): TextareaField => ({ kind: "textarea", label, rows: 3, ...o });
const id = (label = "ID"): IdField => ({ kind: "id", label, help: "Lowercase letters, numbers and hyphens; unique in this list." });
const bool = (label: string, help?: string): BooleanField => ({ kind: "boolean", label, help });
const image = (label = "Image"): ImageField => ({ kind: "image", label });
const href = (label = "Link"): HrefField => ({ kind: "href", label });
const url = (label: string, help?: string): UrlField => ({ kind: "url", label, help });
const date = (label: string, help?: string): DateField => ({ kind: "date", label, help });
const lines = (label: string, maxItems: number, max = 300): StringListField => ({ kind: "stringList", label, maxItems, max });
const availability = (): SelectField<Availability> => ({ kind: "select", label: "Availability", options: AVAILABILITY_OPTIONS });
const select = <V extends string>(label: string, options: readonly Option<V>[], help?: string): SelectField<V> => ({ kind: "select", label, options, help });
const int = (label: string, min: number, max: number, help?: string): NumberField => ({ kind: "number", label, min, max, integer: true, help });
const link = (label = "Link"): TypedObjectField<LinkRef> => ({ kind: "object", label, fields: { label: text("Link label", { required: true, max: 80 }), href: href("Link URL") } });
const enabled = (where = "on the homepage") => bool(`Show this section ${where}`);
type BodyItem = { id: string; title: string; body: string };
type DescItem = { id: string; title: string; description: string };
const bodyItems = (label: string, maxItems: number, prefix: string): TypedListField<BodyItem> => ({
  kind: "list", label, itemTitleKey: "title", maxItems,
  fields: { id: id(), title: title(), body: area("Body", { max: 600 }) },
  newItem: () => ({ id: newId(prefix), title: "New item", body: "" }),
});
const descItems = (label: string, maxItems: number, prefix: string): TypedListField<DescItem> => ({
  kind: "list", label, itemTitleKey: "title", maxItems,
  fields: { id: id(), title: title(), description: area("Description", { max: 600 }) },
  newItem: () => ({ id: newId(prefix), title: "New item", description: "" }),
});

const PRICE_ITEM_FIELDS = {
  id: id(), name: title("Name"), price: { kind: "price", label: "Price (₱)", help: "Tick “On request” to hide the number." } as PriceField,
  unit: text("Unit", { max: 60, help: "e.g. /month, per session" }), usd: text("USD text", { max: 60, help: "Leave empty to auto-calculate from the exchange rate." }),
  perUnit: text("Per-unit text", { max: 60, help: "e.g. ₱380 per class" }), validity: text("Validity", { max: 60 }),
  description: area("Description", { max: 600 }), features: lines("Features", 10, 200), featured: bool("Featured (highlighted card)"),
  badge: text("Badge", { max: 60 }), availability: availability(), visible: bool("Visible on the site"),
};

// ---------- the schema ----------
export const EDITOR_SCHEMA = {
  settings: {
    label: "Site settings & founding offer",
    description: "Launch phase, opening date, contact details, social links and the founding member offer. Used on every page.",
    previewPath: "/contact",
    groups: [
      {
        title: "Launch",
        fields: {
          launchPhase: select("Launch phase", LAUNCH_PHASE_OPTIONS, "Launch phase changes CTAs and schedule notices site-wide."),
          openingDate: date("Opening date", "Opening date drives the homepage countdown."),
        },
      },
      {
        title: "Contact & location",
        fields: {
          contact: {
            kind: "object", label: "",
            fields: {
              addressLines: lines("Address lines", 5, 120),
              phoneDisplay: text("Phone (as displayed)", { max: 30, format: "phone" }),
              phoneE164: text("Phone (international format)", { max: 20, format: "e164", help: "Used for tap-to-call, e.g. +639189051234." }),
              email: text("Email", { max: 254, format: "email", required: true }),
              hours: text("Opening hours", { max: 160 }),
              mapsQuery: text("Google Maps search", { max: 160, required: true, help: "Used for the map embed and the Get directions link." }),
              googleReviewsUrl: url("Google reviews URL"),
            },
          },
        },
      },
      {
        title: "Social links",
        help: "Social links with an empty URL are hidden.",
        fields: {
          socials: {
            kind: "list", label: "Social profiles", itemTitleKey: "platform", maxItems: 5,
            fields: { platform: select("Platform", PLATFORM_OPTIONS), url: url("Profile URL", "Leave empty to hide this profile."), handle: text("Handle", { max: 60 }) },
            newItem: () => ({ platform: "Instagram" as SocialPlatform, url: "", handle: "" }),
          },
        },
      },
      {
        title: "Founding member offer",
        anchor: "/membership#founding",
        help: "Confirm the founding discount wording (₱3,200 vs ₱4,500 is about 29%) with the owner.",
        fields: {
          founding: {
            kind: "object", label: "",
            fields: {
              enabled: bool("Show the founding offer"),
              title: title(),
              summary: area("Summary", { max: 400 }),
              example: text("Example", { max: 200 }),
              benefits: lines("Benefits", 8, 200),
              cap: int("Member cap", 1, 100000),
              claimed: int("Spots claimed", 0, 100000, "Founding 'claimed' must reflect real sign-ups: the counter is shown publicly when enabled."),
              showCounter: bool("Show the public spots counter"),
              expiresOn: date("Offer expires on"),
              ctaLabel: text("Button label", { required: true, max: 60 }),
            },
          },
        },
      },
      {
        title: "Pricing & booking",
        fields: {
          exchangeRate: { kind: "number", label: "Exchange rate (₱ per US$1)", min: 1, max: 1000, help: "Used for auto-calculated USD prices." },
          bookingWidgetUrl: url("Booking widget URL", "Optional third-party booking link (https)."),
        },
      },
    ],
  },

  home: {
    label: "Homepage",
    description: "Every section below the hero. Groups marked with another page now render on that page, from the same content. Turn sections off to hide them.",
    previewPath: "/",
    groups: [
      {
        title: "Find your training rhythm", anchor: "ways-to-move",
        fields: {
          rhythm: {
            kind: "object", label: "",
            fields: {
              eyebrow: text("Eyebrow", { max: 60 }),
              title: area("Heading", { rows: 2, max: 120, required: true, help: "A line break splits the heading over two lines." }),
              intro: area("Intro", { max: 400 }),
              paths: {
                kind: "list", label: "Persona paths (tabs)", itemTitleKey: "title", maxItems: 6,
                fields: {
                  id: id(), title: title(), who: text("Who", { max: 80 }), cadence: text("Cadence", { max: 120 }),
                  offer: text("Offer", { max: 120 }), body: area("Body", { max: 400 }), link: link(),
                },
                newItem: () => ({ id: newId("path"), title: "New path", who: "", cadence: "", offer: "", body: "", link: { label: "Learn more", href: "/programs" } }),
              },
              dayRhythm: bodyItems("Day rhythm", 8, "rhythm"),
              linkLabel: text("Section link label", { max: 60 }),
            },
          },
        },
      },
      {
        title: "Complete system (About page)", anchor: "complete-system",
        help: "Shown on the About page.",
        fields: {
          completeSystem: {
            kind: "object", label: "",
            fields: {
              enabled: enabled("on the About page"), eyebrow: text("Eyebrow", { max: 60 }), title: title("Heading"), intro: area("Intro", { max: 400 }),
              pillars: {
                kind: "list", label: "Pillars", itemTitleKey: "name", maxItems: 3,
                fields: {
                  id: id(), name: title("Name"), theme: text("Theme", { max: 60 }), subtitle: text("Subtitle", { max: 80 }),
                  bullets: lines("Bullets", 8, 120), link: link(),
                },
                newItem: () => ({ id: newId("pillar"), name: "NEW", theme: "", subtitle: "", bullets: [], link: { label: "Learn more", href: "/programs" } }),
              },
              closing: area("Closing line", { max: 400 }),
            },
          },
        },
      },
      {
        title: "Stats", anchor: "training-ground",
        help: "The first three stats also appear on the Facilities page.",
        fields: {
          stats: {
            kind: "object", label: "",
            fields: {
              enabled: enabled(), title: title("Heading"), intro: area("Intro", { max: 400 }), image: image("Background image"),
              items: {
                kind: "list", label: "Stats", itemTitleKey: "label", maxItems: 6,
                fields: { id: id(), value: text("Value", { required: true, max: 20 }), label: text("Label", { required: true, max: 60 }), detail: text("Detail", { max: 160 }) },
                newItem: () => ({ id: newId("stat"), value: "0", label: "New stat", detail: "" }),
              },
              cta: link("Button"),
            },
          },
        },
      },
      {
        title: "Differentiators (About page)", anchor: "differentiators",
        help: "Shown on the About page.",
        fields: {
          differentiators: {
            kind: "object", label: "",
            fields: {
              enabled: enabled("on the About page"), eyebrow: text("Eyebrow", { max: 60 }), title: title("Heading"), intro: area("Intro", { max: 400 }),
              items: {
                kind: "list", label: "Cards", itemTitleKey: "title", maxItems: 9,
                fields: { id: id(), title: title(), body: area("Body", { max: 400 }), link: link(), availability: availability() },
                newItem: () => ({ id: newId("card"), title: "New card", body: "", link: { label: "Learn more", href: "/programs" }, availability: "planned" as Availability }),
              },
            },
          },
        },
      },
      {
        title: "After dark", anchor: "after-dark",
        fields: {
          afterDark: {
            kind: "object", label: "",
            fields: {
              enabled: enabled(), eyebrow: text("Eyebrow", { max: 60 }), title: title("Heading"), body: area("Body", { max: 600 }),
              highlights: lines("Highlights", 6, 120), image: image("Background image"), cta: link("Button"),
            },
          },
        },
      },
      {
        title: "Recovery teaser", anchor: "recovery-teaser",
        help: "Modalities are edited in the Recovery modalities tab.",
        fields: {
          recoveryTeaser: {
            kind: "object", label: "",
            fields: {
              enabled: enabled(), eyebrow: text("Eyebrow", { max: 60 }), title: title("Heading"), body: area("Body", { max: 600 }),
              modalityIds: { kind: "refs", label: "Modalities shown", source: "recoveryModalities", maxItems: 8 },
              image: image(), cta: link("Button"),
            },
          },
        },
      },
      {
        title: "Day at BaseCamp (Programs page)", anchor: "day-at-basecamp",
        help: "Shown on the Programs overview.",
        fields: {
          dayFlow: {
            kind: "object", label: "",
            fields: { enabled: enabled("on the Programs page"), title: title("Heading"), steps: bodyItems("Steps", 6, "step"), quote: area("Quote", { max: 600 }) },
          },
        },
      },
      {
        title: "Membership", anchor: "programmes-pricing",
        help: "Prices are edited in the Pricing tab. The three “from” prices are worked out automatically: the cheapest visible monthly membership, day pass and class pack.",
        fields: {
          pricingTeaser: {
            kind: "object", label: "",
            fields: {
              enabled: enabled(), eyebrow: text("Eyebrow", { max: 60 }), title: title("Heading"), intro: area("Intro", { max: 400 }),
              itemIds: { kind: "refs", label: "Price items (not used)", source: "pricingItems", maxItems: 12, help: "No longer shown on the homepage; kept so no data is lost." }, cta: link("Button"),
            },
          },
        },
      },
      {
        title: "Who it's for", anchor: "who-its-for",
        help: "No longer shown as its own section. The Corporate persona's text is used on Programs › Corporate.",
        fields: {
          personas: {
            kind: "object", label: "",
            fields: {
              enabled: enabled("for the Corporate persona text"), eyebrow: text("Eyebrow", { max: 60 }), title: title("Heading"),
              items: {
                kind: "list", label: "Personas", itemTitleKey: "title", maxItems: 6,
                fields: { id: id(), title: title(), body: area("Body", { max: 400 }), link: link() },
                newItem: () => ({ id: newId("persona"), title: "New persona", body: "", link: { label: "Learn more", href: "/membership" } }),
              },
            },
          },
        },
      },
      {
        title: "Why CamSur", anchor: "why-camsur",
        help: "Reasons and the story line are edited in the Why CamSur tab.",
        fields: { whyCamsur: { kind: "object", label: "", fields: { enabled: enabled(), eyebrow: text("Eyebrow", { max: 60 }), cta: link("Button") } } },
      },
      {
        title: "Founders' vision (About page)", anchor: "founders-vision",
        help: "Shown on the About page once the founders' story has text. Founders' text, image and brand pillars are edited in the Brand, founders & build journal tab.",
        fields: { founders: { kind: "object", label: "", fields: { enabled: enabled("on the About page"), eyebrow: text("Eyebrow", { max: 60 }), cta: link("Button") } } },
      },
      {
        title: "Build & countdown (About › The build)", anchor: "build",
        help: "Shown on About › The build. The countdown uses the opening date in Site settings. That page lists every build journal update.",
        fields: {
          build: {
            kind: "object", label: "",
            fields: {
              enabled: enabled("on About › The build"), eyebrow: text("Eyebrow", { max: 60 }), title: title("Heading"), intro: area("Intro", { max: 400 }),
              launchVideoUrl: { kind: "video", label: "Launch video URL", help: "Optional https link to an MP4 file." },
              liveTitle: text("Heading once live", { max: 120 }), liveBody: area("Body once live", { max: 400 }),
              updatesShown: int("Build updates shown (not used)", 0, 12, "The build page shows every update; kept so no data is lost."),
            },
          },
        },
      },
      {
        title: "Events teaser", anchor: "whats-on",
        help: "Events are edited in the Schedule & events tab.",
        fields: {
          events: {
            kind: "object", label: "",
            fields: {
              enabled: enabled(), eyebrow: text("Eyebrow", { max: 60 }), title: title("Heading"), intro: area("Intro", { max: 400 }),
              count: int("Events shown", 1, 12), cta: link("Button"),
            },
          },
        },
      },
      {
        title: "Social", anchor: "socials",
        help: "Posts are edited in the Social gallery tab.",
        fields: { social: { kind: "object", label: "", fields: { enabled: enabled() } } },
      },
      {
        title: "Testimonials", anchor: "testimonials",
        help: "Testimonials are edited in the Coaches, partners & testimonials tab. They appear inside “Become a founding member” and are hidden while there are none.",
        fields: { testimonials: { kind: "object", label: "", fields: { enabled: enabled(), title: title("Heading") } } },
      },
      {
        title: "Early access", anchor: "early-access",
        fields: {
          earlyAccess: {
            kind: "object", label: "",
            fields: {
              eyebrow: text("Eyebrow", { max: 60 }), title: title("Heading"), body: area("Body", { max: 400 }),
              benefits: lines("Benefits", 6, 160), image: image(),
            },
          },
        },
      },
    ],
  },

  programmes: {
    label: "Programs",
    description: "Disciplines, programs, formats, modalities, fusion formats, signature workouts and the assessment journey.",
    previewPath: "/programs",
    groups: [
      { title: "Introduction", fields: { intro: area("Intro", { max: 600 }), tagline: text("Tagline", { max: 120 }) } },
      {
        title: "Flagship programs",
        anchor: "core",
        help: "These cards power the homepage, mega menu and one static detail page per program.",
        fields: {
          featured: {
            kind: "list", label: "Flagship programs", itemTitleKey: "title", maxItems: 12,
            fields: {
              slug: { kind: "id", label: "Slug", help: "Used in /programs/slug. Lowercase letters, numbers and hyphens." },
              title: title(),
              description: area("One-line description", { required: true, max: 240 }),
              image: image(),
              goals: { kind: "multiSelect", label: "Goals", options: PROGRAMME_GOAL_OPTIONS, help: "Used to suggest related programs on each program page." },
              intensity: { kind: "number", label: "Intensity (1–5)", min: 1, max: 5, integer: true, nullable: true, help: "Leave empty when intensity is set individually." },
              level: text("Level", { required: true, max: 80 }),
              duration: int("Session length (minutes)", 1, 360),
              format: text("Format", { required: true, max: 80 }),
              about: area("What it is", { required: true, max: 800 }),
              whoFor: lines("Who it's for", 6, 180),
              timeline: {
                kind: "list", label: "Session timeline", itemTitleKey: "label", maxItems: 8,
                fields: { label: text("Block", { required: true, max: 80 }), minutes: int("Minutes", 1, 240) },
                newItem: () => ({ label: "New block", minutes: 10 }),
              },
              progress: {
                kind: "list", label: "Typical progress", itemTitleKey: "text", maxItems: 6,
                fields: { weeks: int("Weeks", 1, 52), text: area("Expectation", { required: true, max: 300 }) },
                newItem: () => ({ weeks: 4, text: "" }),
              },
              spaces: lines("Spaces used", 6, 100),
              interest: select("Inquiry interest", INTEREST_OPTIONS),
              bookable: bool("Bookable once the schedule is live"),
            },
            newItem: () => ({
              slug: newId("programme"), title: "New program", description: "", image: IMAGE_LIBRARY[0] ?? "",
              goals: [] as ProgrammeGoalId[], intensity: null, level: "All levels", duration: 60, format: "Group",
              about: "", whoFor: [], timeline: [], progress: [], spaces: [], interest: "membership-local" as const, bookable: true,
            }),
          },
        },
      },
      { title: "Disciplines", anchor: "disciplines", fields: { disciplines: descItems("Disciplines", 8, "discipline") } },
      {
        title: "Programs", anchor: "core",
        fields: {
          programmes: {
            kind: "list", label: "Programs", itemTitleKey: "title", maxItems: 24,
            fields: {
              slug: { kind: "id", label: "Slug", help: "Used in links (?program=…). Lowercase letters, numbers and hyphens." },
              title: title(),
              group: select("Group", [{ value: "core", label: "Core training" }, { value: "wellness", label: "Wellness & recovery" }, { value: "phase-2", label: "Phase 2" }]),
              availability: availability(),
              summary: area("Summary", { max: 400 }),
              image: image(),
              audiences: { kind: "multiSelect", label: "Audiences", options: AUDIENCE_OPTIONS },
              level: text("Level", { max: 80 }),
              format: text("Format", { max: 80 }),
              whatToExpect: area("What to expect", { max: 800 }),
              whoFor: lines("Who it's for", 8, 160),
              outcomes: lines("Outcomes", 8, 80),
              bookable: bool("Bookable (shows “Request a session”)"),
              spaces: {
                kind: "list", label: "Facility spaces", itemTitleKey: "label", maxItems: 5,
                fields: { label: text("Label", { required: true, max: 60 }), anchor: select("Facility zone", ANCHOR_OPTIONS) },
                newItem: () => ({ label: FACILITY_ANCHOR_LABEL["training-zones"], anchor: "training-zones" as FacilityAnchor }),
              },
              interest: select("Inquiry interest", INTEREST_OPTIONS),
            },
            newItem: () => ({
              slug: newId("programme"), title: "New program", group: "core" as const, availability: "planned" as Availability, summary: "",
              image: IMAGE_LIBRARY[0] ?? "", audiences: [] as Audience[], level: "", format: "", whatToExpect: "", whoFor: [], outcomes: [],
              bookable: false, spaces: [], interest: "membership-local" as const,
            }),
          },
        },
      },
      {
        title: "Formats", anchor: "formats",
        fields: {
          formats: {
            kind: "list", label: "Formats (homepage coverflow)", itemTitleKey: "title", maxItems: 12,
            fields: { id: id(), title: title(), description: area("Description", { max: 400 }), image: image(), href: href() },
            newItem: () => ({ id: newId("format"), title: "New format", description: "", image: IMAGE_LIBRARY[0] ?? "", href: "/programs" }),
          },
        },
      },
      {
        title: "Modalities", anchor: "modalities",
        fields: {
          modalities: {
            kind: "list", label: "Modalities", itemTitleKey: "title", maxItems: 24,
            fields: {
              id: id(), title: title(), description: area("Description", { max: 400 }),
              category: select("Category", [{ value: "train", label: "Train" }, { value: "outdoor", label: "Outdoor" }, { value: "mind-body", label: "Mind-body" }, { value: "recovery", label: "Recovery" }]),
              availability: availability(),
            },
            newItem: () => ({ id: newId("modality"), title: "New modality", description: "", category: "train" as const, availability: "planned" as Availability }),
          },
        },
      },
      {
        title: "Fusion formats", anchor: "fusion",
        fields: {
          fusion: {
            kind: "list", label: "Fusion formats", itemTitleKey: "title", maxItems: 12,
            fields: { id: id(), title: title(), description: area("Description", { max: 400 }), availability: availability() },
            newItem: () => ({ id: newId("fusion"), title: "New format", description: "", availability: "planned" as Availability }),
          },
        },
      },
      {
        title: "Signature workouts", anchor: "signature",
        fields: {
          signatureWorkouts: {
            kind: "list", label: "Signature workouts", itemTitleKey: "title", maxItems: 12,
            fields: { id: id(), title: title(), description: area("Description", { max: 400 }), availability: availability(), when: text("When", { max: 80 }) },
            newItem: () => ({ id: newId("workout"), title: "New workout", description: "", availability: "planned" as Availability, when: "" }),
          },
        },
      },
      {
        title: "Assessment", anchor: "assessment",
        fields: {
          assessment: {
            kind: "object", label: "",
            fields: {
              availability: availability(), promise: area("Promise", { max: 400 }),
              steps: descItems("Steps", 8, "step"),
              categories: lines("Outcome categories", 12, 80),
            },
          },
        },
      },
    ],
  },

  recovery: {
    label: "Recovery modalities",
    description: "The recovery ecosystem shown on Facilities › Recovery and the homepage. Prices live in the Pricing tab.",
    previewPath: "/facilities/recovery",
    groups: [
      {
        title: "Introduction & disclaimer", anchor: "modalities",
        fields: {
          intro: area("Intro", { max: 600 }),
          disclaimer: area("Medical disclaimer", { max: 600, required: true, help: "Shown wherever hyperbaric, cryotherapy or NAD+ appears. Make no medical claims." }),
        },
      },
      {
        title: "Modalities", anchor: "modalities",
        fields: {
          modalities: {
            kind: "list", label: "Modalities", itemTitleKey: "title", maxItems: 24,
            fields: {
              id: id(), title: title(), description: area("Description", { max: 400 }), detail: area("Detail", { max: 400 }),
              category: select("Category", same(["cold", "heat", "contrast", "compression", "light", "oxygen", "mind-body", "sleep"] as const)),
              availability: availability(),
              medicalNote: bool("Show the medical disclaimer with this modality"),
            },
            newItem: () => ({ id: newId("modality"), title: "New modality", description: "", detail: "", category: "heat" as const, availability: "planned" as Availability, medicalNote: false }),
          },
        },
      },
    ],
  },

  pricing: {
    label: "Pricing",
    description: "Every price group, shown across the Membership pages (camps on Visit › Camps). The homepage “from” prices and recovery prices are worked out from these items.",
    previewPath: "/membership",
    groups: [
      { title: "Introduction & notes", fields: { intro: area("Intro", { max: 600 }), notes: lines("Notes", 8, 300) } },
      {
        title: "Price groups", anchor: "tiers",
        fields: {
          groups: {
            kind: "list", label: "Price groups", itemTitleKey: "title", maxItems: 16,
            fields: {
              id: id(),
              anchor: text("Page anchor", { required: true, max: 60, format: "slug", help: "Where the group appears: tiers → /membership; packs, day-passes, open-gym → /membership/passes; recovery-pricing, advanced-recovery, yoga → /membership/recovery-pricing; corporate → /membership/corporate; camps-pricing → /visit/camps. Other anchors appear on /membership/passes." }),
              title: title(), intro: area("Intro", { max: 400 }),
              audience: select("Audience", [{ value: "locals", label: "Locals" }, { value: "travellers", label: "Travelers" }, { value: "both", label: "Both" }]),
              items: {
                kind: "list", label: "Items", itemTitleKey: "name", maxItems: 20, fields: PRICE_ITEM_FIELDS,
                newItem: () => ({
                  id: newId("item"), name: "New item", price: { min: 0, max: null } as Price | null, unit: "", usd: "", perUnit: "", validity: "",
                  description: "", features: [], featured: false, badge: "", availability: "planned" as Availability, visible: true,
                }),
              },
            },
            newItem: () => ({ id: newId("group"), anchor: "tiers", title: "New group", intro: "", audience: "both" as const, items: [] }),
          },
        },
      },
      {
        title: "FAQ", anchor: "faq",
        fields: {
          faq: {
            kind: "list", label: "Questions", itemTitleKey: "question", maxItems: 20,
            fields: { id: id(), question: title("Question"), answer: area("Answer", { max: 800, required: true }) },
            newItem: () => ({ id: newId("faq"), question: "New question", answer: "" }),
          },
        },
      },
    ],
  },

  schedule: {
    label: "Schedule & events",
    description: "Daily rhythm, timetable, recurring events and the events calendar.",
    previewPath: "/schedule",
    groups: [
      {
        title: "Introduction & notice",
        fields: {
          intro: area("Intro", { max: 600 }),
          notice: area("Timetable notice", { max: 300, help: "Leave empty to use the launch-phase notice." }),
        },
      },
      { title: "Daily rhythm", anchor: "rhythm", fields: { rhythm: descItems("Rhythm", 8, "rhythm") } },
      {
        title: "Timetable", anchor: "timetable",
        fields: {
          timetable: {
            kind: "list", label: "Slots", itemTitleKey: "title", maxItems: 80,
            fields: {
              id: id(),
              day: select("Day", same(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const)),
              time: text("Time", { required: true, max: 60 }),
              title: title(),
              category: select("Category", same(["sunrise", "class", "open-gym", "private", "evening", "night", "recovery"] as const)),
              programmeSlug: text("Program slug", { max: 60, format: "slug", help: "Optional: a program slug from the Programs tab." }),
              capacity: { kind: "number", label: "Capacity", min: 1, max: 500, integer: true, nullable: true, help: "Leave empty when not yet set." },
              status: select("Status", [{ value: "tba", label: "To be announced" }, { value: "invite-only", label: "Invite only" }, { value: "open", label: "Open" }, { value: "full", label: "Full (waitlist)" }]),
            },
            newItem: () => ({ id: newId("slot"), day: "Mon" as const, time: "Time TBA", title: "New session", category: "class" as const, programmeSlug: "", capacity: null, status: "tba" as const }),
          },
        },
      },
      {
        title: "Recurring events", anchor: "night",
        fields: {
          recurring: {
            kind: "list", label: "Recurring events", itemTitleKey: "title", maxItems: 20,
            fields: {
              id: id(), title: title(),
              cadence: select("Cadence", same(["Daily", "Weekly", "Regular", "Monthly", "Quarterly"] as const)),
              description: area("Description", { max: 400 }), night: bool("Night event (after dark)"), availability: availability(),
            },
            newItem: () => ({ id: newId("recurring"), title: "New event", cadence: "Weekly" as const, description: "", night: false, availability: "planned" as Availability }),
          },
        },
      },
      {
        title: "Calendar events", anchor: "events",
        fields: {
          events: {
            kind: "list", label: "Events", itemTitleKey: "title", maxItems: 40,
            fields: {
              id: id(), title: title(),
              kind: select("Kind", same(["launch", "festival", "competition", "workshop", "camp", "community"] as const)),
              date: date("Date", "Leave empty until confirmed."),
              dateLabel: text("Date label", { max: 80, help: "Shown when no date is set, e.g. Date to be announced." }),
              description: area("Description", { max: 400 }), availability: availability(),
              ctaHref: { kind: "href", label: "Button link", optional: true },
            },
            newItem: () => ({ id: newId("event"), title: "New event", kind: "community" as const, date: "", dateLabel: "Date to be announced", description: "", availability: "planned" as Availability, ctaHref: "/contact?interest=events" }),
          },
        },
      },
      { title: "Leaderboards", anchor: "competition", fields: { leaderboardCategories: lines("Leaderboard categories", 10, 60) } },
    ],
  },

  story: {
    label: "Brand, founders & build journal",
    description: "Brand positioning, pillars, the founders' story and build updates (About pages).",
    previewPath: "/about",
    groups: [
      {
        title: "Brand positioning", anchor: "positioning",
        fields: {
          positioning: {
            kind: "object", label: "",
            fields: {
              notLine: text("“Not a…” line", { max: 160 }), headline: title("Headline"), sub: area("Sub-headline", { max: 400 }),
              breakdown: bodyItems("Breakdown", 6, "point"),
            },
          },
        },
      },
      { title: "Brand pillars", anchor: "pillars", fields: { brandPillars: bodyItems("Pillars", 6, "pillar") } },
      {
        title: "Founders", anchor: "founders",
        fields: {
          founders: {
            kind: "object", label: "",
            fields: {
              eyebrow: text("Eyebrow", { max: 60 }), title: title("Heading"), paragraphs: lines("Paragraphs", 8, 1200),
              signature: text("Signature", { max: 120 }), image: image(),
            },
          },
        },
      },
      {
        title: "Build journal", anchor: "build",
        fields: {
          buildUpdates: {
            kind: "list", label: "Build updates", itemTitleKey: "title", maxItems: 40,
            fields: {
              id: id(), date: date("Date", "Leave empty if undated."), title: title(), body: area("Body", { max: 800 }), image: image(),
              tag: select("Tag", same(["Build", "Zone reveal", "Equipment", "Design", "Milestone"] as const)),
            },
            newItem: () => ({ id: newId("update"), date: "", title: "New update", body: "", image: IMAGE_LIBRARY[0] ?? "", tag: "Build" as const }),
          },
        },
      },
    ],
  },

  people: {
    label: "Coaches, partners & testimonials",
    description: "Leave a list empty to hide its section. Only add real people, partners and quotes.",
    previewPath: "/about",
    groups: [
      {
        title: "Coaches", anchor: "/programs/coaching#coaches", help: "Shown on Programs › Coaching once at least one coach is added.",
        fields: {
          coaches: {
            kind: "list", label: "Coaches", itemTitleKey: "name", maxItems: 24,
            fields: {
              id: id(), name: title("Name"), role: text("Role", { max: 80 }), bio: area("Bio", { max: 800 }),
              credentials: lines("Credentials", 10, 120), image: image("Photo"),
            },
            newItem: () => ({ id: newId("coach"), name: "New coach", role: "", bio: "", credentials: [], image: IMAGE_LIBRARY[0] ?? "" }),
          },
        },
      },
      {
        title: "Partners", anchor: "partners",
        fields: {
          partners: {
            kind: "list", label: "Partners", itemTitleKey: "name", maxItems: 24,
            fields: {
              id: id(), name: title("Name"),
              type: select("Type", [{ value: "accommodation", label: "Accommodation" }, { value: "transport", label: "Transport" }, { value: "wellness", label: "Wellness" }, { value: "ambassador", label: "Ambassador" }]),
              description: area("Description", { max: 400 }), url: url("Website"),
            },
            newItem: () => ({ id: newId("partner"), name: "New partner", type: "accommodation" as const, description: "", url: "" }),
          },
        },
      },
      {
        title: "Testimonials", anchor: "/#early-access", help: "Shown on the homepage, inside “Become a founding member”, once at least one testimonial is added.",
        fields: {
          testimonials: {
            kind: "list", label: "Testimonials", itemTitleKey: "name", maxItems: 24,
            fields: {
              id: id(), quote: area("Quote", { max: 600, required: true }), name: title("Name"), context: text("Context", { max: 120 }),
              source: select("Source", [{ value: "founding-member", label: "Founding member" }, { value: "soft-opening", label: "Soft opening" }, { value: "ambassador", label: "Ambassador" }, { value: "google", label: "Google review" }]),
            },
            newItem: () => ({ id: newId("testimonial"), quote: "", name: "Name", context: "", source: "founding-member" as const }),
          },
        },
      },
    ],
  },

  gallery: {
    label: "Social gallery",
    description: "The homepage “Follow the movement” gallery (also shown on Facilities › Gallery).",
    previewPath: "/",
    groups: [
      { title: "Heading", anchor: "socials", fields: { eyebrow: text("Eyebrow", { max: 60 }), title: title("Heading"), intro: area("Intro", { max: 400 }) } },
      {
        title: "Posts", anchor: "socials",
        fields: {
          posts: {
            kind: "list", label: "Posts", itemTitleKey: "title", maxItems: 12,
            fields: {
              id: id(), platform: select("Platform", PLATFORM_OPTIONS), type: text("Type label", { max: 40 }),
              pillar: select("Content pillar", same(["training", "nature", "community", "build", "coaches", "recovery"] as const)),
              format: select("Format", same(["Photo", "Reel", "Update"] as const)),
              badge: text("Badge", { max: 60 }), title: title(), caption: text("Caption", { max: 200 }), detail: area("Detail", { max: 600 }),
              image: image(), imagePosition: text("Image focus", { max: 40, format: "position", help: "CSS position, e.g. center 42%." }),
              href: { kind: "href", label: "Post link", optional: true },
            },
            newItem: () => ({
              id: newId("post"), platform: "Instagram" as SocialPlatform, type: "", pillar: "training" as const, format: "Photo" as const, badge: "",
              title: "New post", caption: "", detail: "", image: IMAGE_LIBRARY[0] ?? "", imagePosition: "center", href: "",
            }),
          },
        },
      },
    ],
  },

  whyCamsur: {
    label: "Why CamSur",
    description: "Reasons to come to CamSur (Visit › Why CamSur and the homepage).",
    previewPath: "/visit/why-camsur",
    groups: [
      {
        title: "Why CamSur", anchor: "why-camsur",
        fields: {
          title: title("Heading"), intro: area("Intro", { max: 400 }),
          reasons: bodyItems("Reasons", 8, "reason"),
          story: area("Story line", { max: 400 }),
        },
      },
    ],
  },
} satisfies EditorSchema;

/** All fields of a section (its groups' fields merged), for validation and path labels. */
export function sectionFields(section: SectionKey): Record<string, Field> {
  const out: Record<string, Field> = {};
  for (const group of EDITOR_SCHEMA[section].groups as readonly { fields: Record<string, Field> }[]) Object.assign(out, group.fields);
  return out;
}
