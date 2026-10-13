import type { Metadata } from "next";
import TripCard from "../components/TripCard";
import { trips } from "../data/trips";

export const metadata: Metadata = {
  title: "Trips",
};

export default function TripsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">All trips</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        From weekend lake loops to week-long summit pushes, there&apos;s a trip
        for every level of experience.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {trips.map((trip) => (
          <TripCard key={trip.slug} trip={trip} />
        ))}
      </div>
    </section>
  );
}
