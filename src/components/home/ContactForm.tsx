"use client";

import { useState } from "react";
import { ArrowRight, Check } from "@/components/site/Icons";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full border-0 border-b border-line-strong bg-transparent px-0 py-3 text-base text-ink placeholder:text-ink3 transition-colors focus:border-accent focus:outline-none focus:ring-0";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(res.status === 400 ? "Please check your name, email and message." : "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="panel flex min-h-[18rem] flex-col items-start justify-center gap-4 p-8" role="status">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-ok text-paper">
          <Check />
        </span>
        <p className="font-serif text-3xl leading-tight">Message sent. Thank you.</p>
        <p className="text-sm text-ink2">I read everything and usually reply within a day or two.</p>
        <button type="button" className="link text-sm" onClick={() => setStatus("idle")}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="label">Your name</span>
          <input name="name" type="text" required minLength={2} maxLength={100} autoComplete="name" placeholder="Jane Doe" className={field} />
        </label>
        <label className="block">
          <span className="label">Email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="jane@company.com" className={field} />
        </label>
      </div>
      <label className="block">
        <span className="label">Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={4}
          placeholder="A role, a project, or a hard bug"
          className={`${field} resize-y`}
        />
      </label>
      {/* Honeypot: real people never see or fill this. */}
      <label className="absolute -left-[9999px]" aria-hidden="true">
        Company website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button type="submit" className="btn btn-solid" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"} <ArrowRight />
        </button>
        <p className="text-sm text-accent" role="alert">
          {status === "error" ? `${error} You can also email me directly.` : ""}
        </p>
      </div>
    </form>
  );
}
