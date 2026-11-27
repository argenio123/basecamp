// Filipino /about/the-build (design: src/i18n/README.md): the English page module rendered in Filipino, statically prerendered.
import * as en from "@/app/about/the-build/page";
import { localizedRoute } from "@/i18n/route";

const route = localizedRoute("fil", "/about/the-build", en);
export default route.Page;
export const generateMetadata = route.generateMetadata;
