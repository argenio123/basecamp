import type { Trip } from "../data/trips";

const difficultyStyles: Record<Trip["difficulty"], string> = {
  Easy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Moderate: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Challenging: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
};

export default function TripCard({ trip }: { trip: Trip }) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface p-6 transition-shadow hover:shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {trip.region}
        </p>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyStyles[trip.difficulty]}`}
        >
          {trip.difficulty}
        </span>
      </div>
      <h3 className="mt-3 text-xl font-semibold">{trip.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">{trip.summary}</p>
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
        <span className="text-muted">{trip.days} days</span>
        <span className="font-semibold">From ${trip.price.toLocaleString("en-US")}</span>
      </div>
    </article>
  );
}
