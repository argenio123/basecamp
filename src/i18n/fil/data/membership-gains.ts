// Filipino draft of src/data/membership-gains.ts. Figures are kept exactly as in the English file.
import type { Gain } from "@/components/programs/GainList";

export const MEMBERSHIP_GAINS: Readonly<Record<string, readonly Gain[]>> = {
  "/membership": [
    { title: "Mga coached class linggo-linggo", detail: "Kasama sa Athlete at Premium ang bawat coached group class, na may programming para sa mga seryosong lokal na atleta." },
    { title: "Open gym sa sarili mong oras", detail: "Kasama sa bawat tier ang unlimited open-gym access sa mga oras na may staff, kaya puwede kang mag-train sa pagitan ng mga class." },
    { title: "May kasamang recovery", detail: "May dagdag na apat na buwanang recovery credit ang Premium para sa sauna, ice bath at therapy zones, at dalawang guest pass kada buwan." },
  ],
  "/membership/founding": [
    { title: "Mas mababang buwanang rate", detail: "30% off sa unang anim na buwan mo, o lifetime alumni rate na naka-lock na habambuhay." },
    { title: "Mauuna ka", detail: "Priority booking sa mga camp, workshop, at special event bago ito buksan sa lahat." },
    { title: "Bahagi ka ng kuwento", detail: "Pagkilala bilang bahagi ng founding community at imbitasyon sa eksklusibong launch event." },
  ],
  "/membership/launch-promotions": [
    { title: "Founding na Athlete rate", detail: "Php 3,150 kada buwan sa unang anim na buwan mo, kumpara sa Php 4,500 na standard: 30% off para sa mga founding member." },
    { title: "Weekend day access", detail: "Day pass na may gym access at isang coached class: Php 650 standard at Php 800 tuwing weekend." },
    { title: "Tipid sa camp", detail: "Proposed na 20% off sa mga camp na na-book nang hindi bababa sa 60 araw bago ito." },
  ],
  "/membership/price-guide": [
    { title: "Lahat ng presyo sa iisang lugar", detail: "Packs, passes, open gym, yoga, recovery, camps, at corporate bookings, bawat isa may panimulang presyo." },
    { title: "Pumili ayon sa paraan mo ng pag-train", detail: "Memberships at class packs ang kadalasang pinipili ng mga lokal; day pass, trips, at camps naman sa mga biyahero." },
    { title: "Diretso sa detalye", detail: "Bawat row ay may link sa buong price page nito, kaya isang click lang para magkumpara ng opsyon." },
  ],
  "/about/faq": [
    { title: "Malinaw na sagot bago ka sumali", detail: "Packs, passes, freeze, cancellation, at ang founding offer, ipinaliwanag nang simple." },
    { title: "Alamin ang paparating", detail: "Ang idadagdag ng member platform: online sign-up, booking na may waitlist, at automated billing." },
    { title: "Totoong tao kapag kailangan mo", detail: "Kung may hindi nasagot dito, direktang sasagutin ka ng BaseCamp CamSur team." },
  ],
};
