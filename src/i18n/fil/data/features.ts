// Filipino draft of src/data/features.ts (SECTION_FEATURES). sectionKeyFor() has no text: use the English module.
// Ghost words are huge faded background words; kept short so they fit the same space as the English.
import type { SectionFeature, SectionKey } from "@/data/features";

export const SECTION_FEATURES: Record<SectionKey, SectionFeature> = {
  home: { marquee: "Hanapin ang rhythm mo", ghost: "BASECAMP", quote: "Pantay ang halaga ng training at recovery. Sa recovery nangyayari ang adaptation." },
  programs: { marquee: "Hanapin ang class mo", ghost: "CLASSES", quote: "Hindi niche: bagong kategorya." },
  facilities: { marquee: "Itinayo para sa performance", ghost: "PASILIDAD", quote: "Bawat pangako ng brand ay totoong arkitektura." },
  membership: { marquee: "Piliin ang access mo", ghost: "MEMBERSHIP", quote: "Walang itinatagong impormasyon. Naka-lock ang launch rates ng mga early member." },
  schedule: { marquee: "Planuhin ang linggo mo", ghost: "SCHEDULE", quote: "Train. Transform. Thrive." },
  visit: { marquee: "Tara na sa CamSur", ghost: "BISITA", quote: "Habang beach ang alok ng iba, freshwater at kagubatan ang alternatibo ng CamSur." },
  about: { marquee: "Train · Transform · Thrive", ghost: "TUNGKOL", quote: "Ang Performance Playground ng Timog-Silangang Asya." },
  contact: { marquee: "Simulan ang journey mo", ghost: "KONTAK", quote: "Train. Transform. Thrive." },
};
