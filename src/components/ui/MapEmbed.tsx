/** Lazy Google Maps embed for a search query or "lat,lng" (spec §E.1), in satellite view (t=k) at street-block zoom. */
export default function MapEmbed({ query, className }: { query: string; className?: string }) {
  return (
    <div className={`ui-map${className ? ` ${className}` : ""}`}>
      <iframe
        title="Map: BaseCamp CamSur"
        src={"https://www.google.com/maps?q=" + encodeURIComponent(query) + "&t=k&z=17&output=embed"}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
