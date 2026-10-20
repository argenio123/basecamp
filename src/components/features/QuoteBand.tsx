/** Closing statement with large signal-lime quote marks (reload-fitness.com "Excuses are for people who don't…"). */
export default function QuoteBand({ quote }: { quote: string }) {
  return (
    <section className="ft-quote" aria-label="BaseCamp CamSur">
      <figure className="shell ft-quote-inner" data-reveal>
        <span className="ft-quote-mark" aria-hidden="true">“</span>
        <blockquote><p>{quote}</p></blockquote>
        <span className="ft-quote-mark" aria-hidden="true">”</span>
      </figure>
    </section>
  );
}
