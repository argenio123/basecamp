// Filipino draft of src/data/workout-details.ts. Statement lines keep the English limit of ≤27 characters per line
// (headline size). Zone hrefs, images and sizes are identical to the English file. stepImage() has no text: use the
// English module.
import type { WorkoutDetail } from "@/data/workout-details";

const TRAINING_ZONE = { title: "Mga training zone", href: "/facilities/training", image: "/images/facilities/facility-render-a1-2.jpg", imageAlt: "Render ng training building ng BaseCamp CamSur", width: 1807, height: 802 };
const OUTDOOR_ZONE = { title: "Outdoor training facility", href: "/facilities/training", image: "/images/facilities/facility-landscape.jpg", imageAlt: "Ang open-air training field sa tabi ng BaseCamp CamSur", width: 1920, height: 1080 };

export const WORKOUT_DETAILS: Record<string, WorkoutDetail> = {
  "skierg-conditioning": {
    statement: ["Humila mula sa balakang.", "Huminga sa gitna ng hirap.", "Bumuo ng engine."],
    lead: "Station 01 ng HYROX-style na format: isang 1,000 m na SkiErg effort na nagpapalakas ng full-body cardio sa malalakas at paulit-ulit na hila. Ituturo muna ng mga coach ang hinge-and-pull pattern, tapos bubuuin ang engine para mapanatili ito kahit pagod na.",
    gains: ["Mas malakas ang bawat stroke: balakang at lats ang nagtutulak ng hila, kaya mas kaunti ang trabaho ng braso at mas tumatagal ang pace.", "Matutunan ang stroke rate na kaya mong panatilihin, kaya kontrolado ang 1,000 m mula unang hila hanggang huli.", "Sabay-sabay na gumagana ang binti, core, likod, at baga, para mabuo ang engine na kailangan ng bawat ibang station."],
    steps: [
      "Aralin ang hinge, ang hila, at ang reset kasama ang coach sa tabi ng makina, sa magaan na pace.",
      "Hanapin ang stroke rate na kaya mong panatilihin: tuloy-tuloy na hila, swabeng paghinga, iisang numero sa monitor.",
      "Maiikli at matitinding effort, at 1,000 m na pieces na bumubuo ng engine para sa race day.",
      "I-stretch ang lats at balikat, pababain ang heart rate, at i-log ang session.",
    ],
    zone: TRAINING_ZONE,
  },
  "sled-push": {
    statement: ["Bumaba. Itulak nang todo.", "Angkinin ang bawat hakbang.", "Galawin ang di-matinag."],
    lead: "Station 02: isang 50 m na sled push na nagpapaunlad ng pasabog na lakas ng binti. Nagsisimula ang bawat session sa anggulo ng katawan, dahil ang mababa at naka-brace na posisyon ay nakakagalaw ng mas mabigat nang mas kaunting effort.",
    gains: ["Lumalakas ang quads, glutes, at binti sa mabibigat at maiikling effort na dala mo rin sa pagtakbo at squats.", "Ang mababa at tuwid na posisyon ay nakakagalaw ng mas mabigat nang mas kaunting effort at pinoprotektahan ang lower back.", "Pasabog na simula at tuloy-tuloy na 50 m na tulak sa race weight, para hindi kailanman tumigil ang sled sa race day."],
    steps: [
      "Itakda ang anggulo ng katawan: kamay sa poles, mababa ang balakang, tuwid na linya mula ulo hanggang sakong.",
      "Maiikli at matinding tulak na nagtuturo sa binti na itulak palayo ang sahig sa bawat hakbang.",
      "May kargang 50 m na tulak sa race weight, ini-scale ng coach ayon sa level mo.",
      "Maglakad-lakad, huminga, at mag-reset bago ang susunod na set o station.",
    ],
    zone: OUTDOOR_ZONE,
  },
  "sled-pull": {
    statement: ["Hawakan. Hilahin.", "Salitan ang kamay.", "Huwag hayaang tumigil."],
    lead: "Station 03: isang 50 m na sled pull na nagte-train ng grip, likod at posterior chain habang may karga. Matututo kang mag-brace, humanap ng rhythm ng kamay, at panatilihing gumagalaw ang lubid nang hindi nawawala sa posisyon.",
    gains: ["Ang salitang paghila ng kamay sa lubid ay bumubuo ng grip na tatagal hanggang sa mga carry at pull sa huling bahagi ng race.", "Humila gamit ang buong likod at balakang, hindi lang braso, para mas mabilis ang bawat length nang mas kaunting pagod.", "Ang naka-brace at hindi gumagalaw na katawan ay nagpapanatiling tuwid ang takbo ng sled at pinoprotektahan ang gulugod habang may karga."],
    steps: [
      "Mag-brace sa mababang athletic stance: masikip ang core, nakatanim ang paa, hawak ang lubid.",
      "Humanap ng swabeng salitang paghila ng kamay para hindi tumigil ang sled.",
      "Mabibigat na hila sa buong distansya, hindi gumagalaw ang katawan at mababa ang balakang.",
      "Pagpagin ang grip, uminom ng tubig, at mag-recover bago ang susunod na round.",
    ],
    zone: OUTDOOR_ZONE,
  },
  "burpee-broad-jumps": {
    statement: ["Bumagsak sa sahig.", "Lumipad pasulong.", "Huwag tumigil."],
    lead: "Station 04: 80 m ng burpee broad jumps, pinagsasama ang lakas sa sahig at ang pasulong na power. Uunahin ng mga coach ang malambot na landing at tuloy-tuloy na rhythm, para makuha ang distansya nang hindi nauubos.",
    gains: ["Mas malakas na balakang at binti para sa mas mahaba at mas kontroladong talon pasulong sa buong 80 m.", "Burpee, talon, ulit: isang pattern ng paghinga na nagpapanatiling gumagalaw ka nang hindi humihinto para magpahinga.", "Ang paulit-ulit na full-body effort ay nagpapalaki ng kaya mong gawin bago sumuko ang heart rate at binti mo."],
    steps: [
      "Mag-practice ng malambot at kontroladong landing, at ng chest-to-floor burpee sa sarili mong pace.",
      "Pagdugtungin ang mga burpee sa rhythm na kaya mong ulitin, hininga sa hininga.",
      "Distance sets: burpee, talon pasulong, ulit, hanggang matapos ang lane.",
      "Humiga, pabagalin ang paghinga, at hayaang maka-recover ang binti.",
    ],
    zone: TRAINING_ZONE,
  },
  rowing: {
    statement: ["Binti. Katawan. Braso.", "Hanapin ang rhythm mo.", "Sulitin ang bawat stroke."],
    lead: "Station 05: isang 1,000 m na row na nagpapalakas ng aerobic power gamit ang episyenteng stroke. Nakatuon ito sa malinis na setup at kontroladong stroke rate, para sa binti manggaling ang power, hindi sa braso.",
    gains: ["Binti, katawan, tapos braso: isang malinis na pagkakasunod na ginagawang distansya ang bawat stroke, hindi sayang na effort.", "Panatilihin ang target split sa buong 1,000 m imbes na bumilis sa simula at humina sa ikalawang kalahati.", "Mas malaking aerobic base na tumutulong sa recovery mo sa pagitan ng mga station at sa malakas na pagtatapos."],
    steps: [
      "Ayusin ang foot straps at aralin ang catch, drive at recovery kasama ang coach.",
      "Panatilihin ang tuloy-tuloy na stroke rate: binti muna, tapos katawan, tapos braso.",
      "Working rows at 1,000 m na pieces sa race effort, katabi ang grupo.",
      "Isang magaan at relaxed na finish para paluwagin ang binti at mag-cool down.",
    ],
    zone: TRAINING_ZONE,
  },
  "farmers-carry": {
    statement: ["Kapit na parang bakal.", "Tumayo nang tuwid.", "Ilakad ang bigat."],
    lead: "Station 06: isang 200 m na farmers carry na nagpapalakas ng grip, core at postura habang may mabigat na karga. Matututo kang mag-brace, magbuhat nang ligtas, at maglakad nang tuwid sa buong distansya.",
    gains: ["Mga braso at kamay na kayang humawak ng mabigat sa loob ng 200 m nang hindi humihinto para magpagpag.", "Tuwid at naka-brace na postura habang may karga na pinoprotektahan ang likod at dala mo sa araw-araw na pagbubuhat.", "Tuloy-tuloy na paglalakad habang hinihila ng mabigat ang balikat, core at binti."],
    steps: [
      "I-brace ang core at ayusin ang balikat bago ang bawat buhat.",
      "Buhatin ang mga bigat nang patag ang likod, gamit ang lakas ng binti.",
      "May kargang carries sa malayong distansya: tuwid na postura, maiikli at mabilis na hakbang, walang pagmamadali.",
      "Ibaba nang kontrolado ang mga bigat at pagpagin ang grip.",
    ],
    zone: OUTDOOR_ZONE,
  },
  "sandbag-lunges": {
    statement: ["Isang binti bawat hakbang.", "Matatag kahit may karga.", "Mas malakas bawat hakbang."],
    lead: "Station 07: 100 m ng sandbag lunges para sa single-leg strength at kontrol habang gumagalaw ang karga. Aayusin muna ng mga coach ang bag at ang postura, tapos dadagdagan ang distansya.",
    gains: ["Hiwalay na gumagana ang bawat binti, inaayos ang imbalance at pinalalakas ang tuhod at balakang.", "Kontrolin ang gumagalaw na sandbag sa bawat hakbang, para ma-train ang maliliit na stabilising muscles.", "Panatilihin ang tamang lunge form sa buong 100 m habang hinihila ka ng bag palabas sa posisyon."],
    steps: [
      "Ipuwesto ang sandbag sa balikat at itayo nang tuwid ang postura.",
      "Kontroladong hakbang: tuhod na bahagyang nakaangat sa sahig, itulak pabalik pataas gamit ang paa sa harap.",
      "Distance sets sa lane, steady ang bag at tuwid ang katawan.",
      "Ibaba ang bag at i-stretch ang balakang, quads, at glutes.",
    ],
    zone: TRAINING_ZONE,
  },
  "wall-balls": {
    statement: ["Mag-squat nang malalim.", "Ihagis nang mataas.", "Tapusin nang malakas."],
    lead: "Station 08, ang finisher: wall balls na nagdudugtong ng malalim na squat at tumpak na hagis sa iisang tuloy-tuloy na effort. Itatakda ng mga coach ang target, bubuuin ang squat, at ituturo ang rhythm na tumatagal.",
    gains: ["Tamaan ang target bawat rep, para walang sayang na hagis kahit pagod na ang binti mo.", "Mag-squat nang buong lalim nang paulit-ulit nang hindi bumabagal, para tumibay ang binti at baga.", "Malakas na huling station: ang mga rep na magpapasya sa race time mo kapag tapos na ang lahat."],
    steps: [
      "Itakda ang taas ng target at ang stance mo kasama ang coach bago ang unang rep.",
      "Humanap ng squat rhythm: pababa hanggang lalim, itulak pataas, saluhin, at ulitin.",
      "Rep sets sa target, papunta sa race-standard na 100 reps.",
      "Mag-recover sa tabi ng pader, pabagalin ang paghinga, at ipagdiwang ang pagtatapos.",
    ],
    zone: TRAINING_ZONE,
  },
};
