import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

const stats = [
  { value: "12", label: "Years guiding" },
  { value: "4,800+", label: "Happy hikers" },
  { value: "38", label: "Peaks summited" },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">About Basecamp</h1>
      <div className="mt-6 space-y-5 text-lg leading-8 text-muted">
        <p>
          Basecamp started in 2014 with two guides, one battered van, and a
          simple idea: the mountains are better when you share them with good
          people and someone who knows the way.
        </p>
        <p>
          Today our team of guides leads trips across four mountain regions.
          We still keep our groups small, follow Leave No Trace principles, and
          donate 2% of every booking to trail maintenance organizations.
        </p>
      </div>
      <dl className="mt-12 grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-surface p-6 text-center"
          >
            <dt className="text-sm text-muted">{stat.label}</dt>
            <dd className="mt-1 text-3xl font-bold text-accent">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
