import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with GymDine.",
};

export default function ContactPage() {
  return (
    <section className="border-b border-border">
      <div className="container-x py-20 md:py-28 grid md:grid-cols-2 gap-12 max-w-5xl">
        <div>
          <span className="chip mb-4">GET IN TOUCH</span>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.9]">
            TALK <span className="text-accent">TO US.</span>
          </h1>
          <p className="text-foreground/80 mt-6 max-w-md">
            Questions about an order, custom macro plans, corporate catering, or partnerships —
            we&apos;re here.
          </p>
          <div className="mt-10 space-y-5 text-sm">
            <ContactItem label="Email" value="hello@gymdine.lk" href="mailto:hello@gymdine.lk" />
            <ContactItem label="WhatsApp" value="+94 77 000 0000" href="https://wa.me/94770000000" />
            <ContactItem label="Kitchen" value="Colombo 05, Sri Lanka" />
            <ContactItem label="Hours" value="Mon–Sat · 8am – 8pm" />
          </div>
        </div>

        <form className="bg-surface border border-border p-6 md:p-8 space-y-4">
          <Field label="Name" name="name" type="text" />
          <Field label="Email" name="email" type="email" />
          <Field label="Phone" name="phone" type="tel" />
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-muted mb-2">
              Message
            </label>
            <textarea
              name="message"
              rows={5}
              className="w-full bg-background border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <button type="submit" className="btn-primary w-full text-sm">
            Send Message →
          </button>
        </form>
      </div>
    </section>
  );
}

function ContactItem({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = (
    <>
      <div className="text-[10px] uppercase tracking-[0.15em] text-muted">{label}</div>
      <div className="font-bold text-foreground">{value}</div>
    </>
  );
  return href ? (
    <a href={href} className="block hover:text-accent transition-colors">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
}

function Field({ label, name, type }: { label: string; name: string; type: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.15em] text-muted mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="w-full bg-background border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
      />
    </div>
  );
}
