// Filipino /visit (design: src/i18n/README.md): the English page module rendered in Filipino, statically prerendered.
import * as en from "@/app/visit/page";
import { localizedRoute } from "@/i18n/route";

const route = localizedRoute("fil", "/visit", en);
export default route.Page;
export const generateMetadata = route.generateMetadata;
