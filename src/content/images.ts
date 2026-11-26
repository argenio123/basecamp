// Every image an editor may pick (spec §B.15). Keep in sync with public/images.
export const IMAGE_LIBRARY: readonly string[] = [
  "/images/brand/basecamp-green-logo.png",
  "/images/brand/basecamp-camsur-logo-black.png",
  "/images/brand/basecamp-camsur-logo-white.png",
  "/images/destination/thrive.webp",
  "/images/destination/train.webp",
  "/images/destination/transform.webp",
  "/images/facilities/facility-aerial-render.jpg",
  "/images/facilities/facility-aerial.jpg",
  "/images/facilities/facility-background-a1-5-b.jpg",
  "/images/facilities/facility-detail.jpg",
  "/images/facilities/facility-exterior.jpg",
  "/images/facilities/facility-front.jpg",
  "/images/facilities/facility-landscape.jpg",
  "/images/facilities/facility-render-a1-2.jpg",
  "/images/facilities/facility-render-a1-3.jpg",
  "/images/hero/hero-training.webp",
  "/images/programs/program-coaching.webp",
  "/images/programs/program-endurance.webp",
  "/images/programs/program-functional.webp",
  "/images/programs/program-recovery.webp",
  "/images/programs/program-strength.webp",
  "/images/programs/generated/endurance.webp",
  "/images/programs/generated/functional-training.webp",
  "/images/programs/generated/personal-coaching.webp",
  "/images/programs/generated/recovery-mobility.webp",
  "/images/programs/generated/strength-conditioning.webp",
];

export function isLibraryImage(src: string): boolean {
  return IMAGE_LIBRARY.includes(src);
}
