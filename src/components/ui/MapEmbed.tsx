/** Lazy Google Maps embed for a search query (spec §E.1). */
export default function MapEmbed({ query, className }: { query: string; className?: string }) {
  return (
    <div className={`ui-map${className ? ` ${className}` : ""}`}>
      <iframe
        title="Map: BaseCamp CamSur"
        src={"https://www.google.com/maps?q=" + encodeURIComponent(query) + "&output=embed"}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
