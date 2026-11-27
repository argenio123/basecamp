// Filipino /schedule/timetable (design: src/i18n/README.md): the English page module rendered in Filipino, statically prerendered.
import * as en from "@/app/schedule/timetable/page";
import { localizedRoute } from "@/i18n/route";

const route = localizedRoute("fil", "/schedule/timetable", en);
export default route.Page;
export const generateMetadata = route.generateMetadata;
