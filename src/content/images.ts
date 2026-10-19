// Every image an editor may pick (spec §B.15). Keep in sync with public/images.
export const IMAGE_LIBRARY: readonly string[] = [
  "/images/brand/basecamp-green-logo.png",
  "/images/brand/basecamp-logo.png",
  "/images/brand/basecamp-white-logo.png",
  "/images/destination/thrive.png",
  "/images/destination/train.png",
  "/images/destination/transform.png",
  "/images/facilities/facility-aerial.jpg",
  "/images/facilities/facility-background-a1-5-b.jpg",
  "/images/facilities/facility-detail.jpg",
  "/images/facilities/facility-exterior.jpg",
  "/images/facilities/facility-front.jpg",
  "/images/facilities/facility-landscape.jpg",
  "/images/facilities/facility-render-a1-2.jpg",
  "/images/facilities/facility-render-a1-3.jpg",
  "/images/hero/hero-training.png",
  "/images/programs/program-coaching.png",
  "/images/programs/program-endurance.png",
  "/images/programs/program-functional.png",
  "/images/programs/program-recovery.png",
  "/images/programs/program-strength.png",
  "/images/programs/generated/endurance.png",
  "/images/programs/generated/functional-training.png",
  "/images/programs/generated/personal-coaching.png",
  "/images/programs/generated/recovery-mobility.png",
  "/images/programs/generated/strength-conditioning.png",
];

export function isLibraryImage(src: string): boolean {
  return IMAGE_LIBRARY.includes(src);
}
