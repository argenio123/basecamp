import Link from "next/link";
import TripCard from "./components/TripCard";
import { trips } from "./data/trips";

const features = [
  {
    title: "Certified guides",
    body: "Every trip is led by AMGA-trained guides with wilderness first-responder certification.",
  },
  {
    title: "Small groups",
    body: "We cap groups at eight hikers, so you get real attention and a lighter footprint on the trail.",
  },
  {
    title: "Gear included",
    body: "Tents, stoves, and technical equipment are provided. Just bring your boots and curiosity.",
  },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Guided mountain adventures
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Your next summit starts at Basecamp.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
          Small-group hiking and climbing trips through the most beautiful
          ranges in North America, planned and led by people who love them.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/trips"
            className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 font-medium text-white transition-colors hover:bg-accent-hover dark:text-black"
          >
            Browse trips
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border px-6 font-medium transition-colors hover:bg-surface"
          >
            Talk to a guide
          </Link>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-3 sm:px-6">
          {features.map((feature) => (
            <div key={feature.title}>
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 leading-7 text-muted">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Featured trips</h2>
          <Link href="/trips" className="text-sm font-medium text-accent hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trips.slice(0, 3).map((trip) => (
            <TripCard key={trip.slug} trip={trip} />
          ))}
        </div>
      </section>
    </>
  );
}
