// Filipino /membership (design: src/i18n/README.md): the English page module rendered in Filipino, statically prerendered.
import * as en from "@/app/membership/page";
import { localizedRoute } from "@/i18n/route";

const route = localizedRoute("fil", "/membership", en);
export default route.Page;
export const generateMetadata = route.generateMetadata;
