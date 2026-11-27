// Filipino /visit/why-camsur (design: src/i18n/README.md): the English page module rendered in Filipino, statically prerendered.
import * as en from "@/app/visit/why-camsur/page";
import { localizedRoute } from "@/i18n/route";

const route = localizedRoute("fil", "/visit/why-camsur", en);
export default route.Page;
export const generateMetadata = route.generateMetadata;
