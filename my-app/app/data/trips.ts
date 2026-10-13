export type Trip = {
  slug: string;
  name: string;
  region: string;
  days: number;
  difficulty: "Easy" | "Moderate" | "Challenging";
  price: number;
  summary: string;
};

export const trips: Trip[] = [
  {
    slug: "alpine-lakes",
    name: "Alpine Lakes Loop",
    region: "Cascade Range",
    days: 3,
    difficulty: "Easy",
    price: 490,
    summary:
      "A gentle trek past glacier-fed lakes and wildflower meadows. Perfect for first-time backpackers.",
  },
  {
    slug: "ridge-traverse",
    name: "High Ridge Traverse",
    region: "Sierra Nevada",
    days: 5,
    difficulty: "Moderate",
    price: 1150,
    summary:
      "Follow exposed granite ridgelines with sweeping views and camp beneath some of the darkest skies in the west.",
  },
  {
    slug: "summit-push",
    name: "Summit Push",
    region: "Rocky Mountains",
    days: 7,
    difficulty: "Challenging",
    price: 2200,
    summary:
      "A guided ascent of a 14,000 ft peak with acclimatization days, glacier travel, and an alpine start.",
  },
  {
    slug: "canyon-rim",
    name: "Canyon Rim Escape",
    region: "Colorado Plateau",
    days: 4,
    difficulty: "Moderate",
    price: 860,
    summary:
      "Desert sunrises, slot canyons, and quiet rim-top camps far from the crowds.",
  },
];
