# Filipino (Taglish) glossary — draft for native-speaker review

Scope: `content.ts` (from `src/content/defaults.ts`) and `data/*.ts` (from `src/data/*.ts`).
Register: everyday Philippine Taglish as used in local gym and fitness marketing. Short, confident, energetic.
Formal Tagalog coinages were avoided where Filipinos normally say the English word.

## Kept in English (on purpose)

| Term | Why |
|---|---|
| BaseCamp CamSur, CamSur, Bicol, Pili, Naga, Legazpi, Lago Del Rey, Villa Del Rey | Proper names |
| **Train. Transform. Thrive.** (tagline, pillar names TRAIN / TRANSFORM / THRIVE) | Brand tagline; the same in every language |
| Performance Playground | Brand phrase; used as "Ang Performance Playground ng Timog-Silangang Asya" |
| CrossFit, CrossFit-style, HYROX, HYROX-style | Trademarks / the descriptor used in the English copy |
| open gym, sauna, cold plunge, ice bath, coach, membership, founding member, early member, early access, day pass, drop-in, class pack, guest pass | Filipinos use these words as-is at the gym |
| warm-up, cool-down, workout, session, reps, sets, intervals, pace, pacing, grip, core, mobility, breathwork, recovery | Standard gym vocabulary in the Philippines |
| Tier names: Local Basic, Athlete, Premium; product names such as Standard Day Pass, Weekend Premium Pass, 10-Class Pack | Product names that appear on receipts and the payment page |
| Programme titles: Strength & Conditioning, Functional Training, Personal Coaching, Endurance, Recovery & Mobility | Page titles and nav labels; kept identical so links, search and signage match |
| Class and event names: Sunrise Strength, Engine Room, HYROX Race Lab, Night Games, Friday Night Lights, CamSur Crucible, The Lake Loop, CamSur Trail Festival… | Proper event names |
| HYROX station names: SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Rowing, Farmer's Carry, Sandbag Lunges, Wall Balls | Official race station names |
| Medical / tech terms: VO2, HRV, InBody, NAD+, hyperbaric, cryotherapy, infrared | No common Filipino equivalent |

## Key term choices

| English | Filipino used | Note |
|---|---|---|
| train / training | mag-train, nagte-train / training | e.g. "Mag-train nang todo" |
| recover | mag-recover, maka-recover | Not "magpagaling" (reads as healing from sickness) |
| athlete(s) | atleta / mga atleta | |
| beginner(s) | baguhan / mga baguhan | "Swak sa baguhan" = beginner friendly |
| traveler(s) | biyahero / mga biyahero | "turista" only where the English says tourist |
| locals | mga lokal, mga taga-CamSur | |
| community | komunidad | Kept "community" inside compounds (Community Comps, founding community) |
| class(es) | class / mga class | "klase" sounds like school; check with reviewer |
| all levels | Lahat ng level | Programme `level` keeps the "Label: detail" colon (the timetable splits on ":") |
| Intermediate+ | Intermediate pataas | |
| per session / per day / per class | bawat session / bawat araw / bawat class | `/month` → `/buwan` |
| 60-day validity | Valid nang 60 araw | |
| to be announced | iaanunsyo pa | "TBA" kept inside the timetable times |
| planned | nakaplano / planado | |
| Southeast Asia | Timog-Silangang Asya | |
| sunrise (session) | madaling-araw | "pagsikat ng araw" in longer prose |
| scaled / scalable | ini-scale / naii-scale | |
| saving of about 29% | tipid na humigit-kumulang 29% | |
| recovery is infrastructure | Ang recovery ay imprastraktura | |
| restroom | CR | Everyday Philippine word, used in image alt text |
| Monday…Sunday | Lunes…Linggo | `WEEKDAY_LABEL` |

## Please check (unsure)

1. **Prices and the founding offer.** Translated exactly as the English on this branch: 29%, Php 3,200, Php 850 test rate, cap "50 to 150". Approved values elsewhere are ₱800 day pass, ₱3,150 founding = 30% off, cap 100; these are reconciled at merge, so check the numbers after the merge, not the wording.
2. **"class" vs "klase".** I used "class" throughout. Change globally if "klase" reads better for the audience.
3. **Ghost words** in `data/features.ts` (big faded background words): changed FACILITIES → PASILIDAD, VISIT → BISITA, ABOUT → TUNGKOL, CONTACT → KONTAK; kept BASECAMP, CLASSES, MEMBERSHIP, SCHEDULE. Confirm these fit the layout and read well in all caps.
4. **Headline statements** in `data/workout-details.ts` keep the ≤27-character line limit. A few are looser than the English rhythm (e.g. "Galawin ang di-matinag." for "Move the immovable.").
5. **"Make it impossible to post a boring photo"** became "Imposibleng pumangit ang litrato mo." Close in spirit, not literal.
6. **Programme spaces / zone labels**: "Pagdating at pagsalubong" (Arrival & welcome) and "Social at lounge" could sound stiff on signage.
7. **"Own the night"** became "Angkinin ang gabi." It may read better left in English as a campaign line.
8. **`About` copy** "Not a gym / Not a resort / A new category" became "Hindi gym / Hindi resort / Bagong kategorya": check the tone.
9. **SEO keywords** (`data/brand.ts`): the English list plus four Filipino search phrases ("gym sa Naga", etc.). Keep or drop.
10. **Medical disclaimer** (`recovery.disclaimer`): written plainly, but it is health-related text and should get the same legal review as the English.

## Notes for the infrastructure side

- `content.ts` imports `DEFAULT_CONTENT` only to map the generated timetable (its ids come from a seeded pool) by English title and time. If the pool in `defaults.ts` changes, add the new titles to `SLOT_TITLE` / `SLOT_TIME`.
- `programmes.programmes` and `programmes.featured` have no `id`. They are matched by index, and each item carries its unchanged `slug` as a check.
- The Filipino `data/*` modules export the same names and types as the English ones. Exports with no text (ids, links, numbers, URL helpers) are left out, so fall back to the English module for those.
