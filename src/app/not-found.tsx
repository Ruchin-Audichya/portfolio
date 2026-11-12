import Link from "next/link";
import { ArrowRight } from "@/components/site/Icons";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80vh] flex-col justify-center pb-20 pt-[calc(var(--header-h)+2rem)]">
      <p className="label">Error 404</p>
      <h1 className="display mt-5 text-[clamp(3rem,10vw,8rem)]">
        Not <span className="italic text-accent">exactly</span> here.
      </h1>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-ink2">
        This page moved or never existed. The work, the record and the contact form are all on the homepage.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-solid">
          Back to the homepage <ArrowRight />
        </Link>
        <Link href="/#work" className="btn btn-ghost">
          See the work
        </Link>
      </div>
    </section>
  );
}
