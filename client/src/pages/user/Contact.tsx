import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Layers3,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const enquiryTypes = [
  "SaaS / Product Development",
  "Corporate Training",
  "Digital Services",
  "Emerging Technology",
  "Technology Consulting",
  "Other",
];

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute left-1/2 top-0 h-[420px] w-[650px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px] sm:h-[500px] sm:w-[800px]" />

        <div className="absolute right-0 top-32 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8 lg:pb-24 lg:pt-32">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-medium text-cyan-300 backdrop-blur sm:text-sm">
              <MessageSquare className="h-4 w-4" />
              Contact IMMIQ
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Let's build something
              <span className="block text-cyan-400">
                meaningful together.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:mt-8 sm:text-lg sm:leading-8">
              Have a product idea, training requirement, technology
              challenge, or digital transformation goal? Tell us what
              you are working on.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT AREA */}
      <section className="border-b border-white/10 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">

          {/* LEFT */}
          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              Start a conversation
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Tell us what you need.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 sm:mt-6 sm:text-base sm:leading-8">
              Whether you are starting from an idea or already have an
              existing system, our team can help you explore the right
              technology direction.
            </p>

            {/* Contact details */}
            <div className="mt-8 space-y-4 sm:mt-10">

              <a
                href="mailto:hello@immiq.com"
                className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.04]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                  <Mail className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm text-slate-200 transition group-hover:text-cyan-300 sm:text-base">
                    hello@immiq.com
                  </p>
                </div>
              </a>

              <a
                href="tel:+91XXXXXXXXXX"
                className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.04]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                  <Phone className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-slate-200 sm:text-base">
                    +91 XXXXX XXXXX
                  </p>
                </div>
              </a>

              <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Location
                  </p>

                  <p className="mt-1 text-sm text-slate-200 sm:text-base">
                    India
                  </p>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5 sm:mt-8 sm:p-6">

              <p className="text-sm font-medium text-cyan-400">
                What happens next?
              </p>

              <div className="mt-5 space-y-4">
                {[
                  "We understand your requirement.",
                  "We identify the right technology approach.",
                  "We discuss scope, timeline, and next steps.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-cyan-400" />

                    <span className="text-sm leading-6 text-slate-400">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 shadow-2xl sm:p-8 lg:rounded-[2rem] lg:p-10">

            {submitted ? (
              <div className="flex min-h-[500px] flex-col items-center justify-center px-2 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <h2 className="mt-6 text-3xl font-semibold tracking-tight">
                  Thank you.
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
                  Your enquiry has been captured successfully. Our
                  team will get back to you soon.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-8 min-h-11 rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:bg-white/5 hover:text-white"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <>
                <div className="mb-7 sm:mb-8">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Project enquiry
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                    Start your enquiry
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Share a little about what you are looking to
                    build, improve or explore.
                  </p>
                </div>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-5 sm:space-y-6"
                >

                  {/* Name + Company */}
                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">

                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm text-slate-400"
                      >
                        Name
                      </label>

                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="Your name"
                        className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400/50 focus:bg-black/30"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="company"
                        className="mb-2 block text-sm text-slate-400"
                      >
                        Company
                      </label>

                      <input
                        id="company"
                        type="text"
                        placeholder="Company name"
                        className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400/50 focus:bg-black/30"
                      />
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm text-slate-400"
                      >
                        Email
                      </label>

                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="you@company.com"
                        className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400/50 focus:bg-black/30"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-sm text-slate-400"
                      >
                        Phone
                      </label>

                      <input
                        id="phone"
                        type="tel"
                        placeholder="+91"
                        className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400/50 focus:bg-black/30"
                      />
                    </div>
                  </div>

                  {/* Enquiry type */}
                  <div>
                    <label
                      htmlFor="enquiryType"
                      className="mb-2 block text-sm text-slate-400"
                    >
                      What can we help with?
                    </label>

                    <select
                      id="enquiryType"
                      required
                      defaultValue=""
                      className="min-h-12 w-full rounded-xl border border-white/10 bg-[#0a0d12] px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-cyan-400/50"
                    >
                      <option value="" disabled>
                        Select an enquiry type
                      </option>

                      {enquiryTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Requirement */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm text-slate-400"
                    >
                      Tell us about your requirement
                    </label>

                    <textarea
                      id="message"
                      required
                      rows={6}
                      placeholder="Describe your project, challenge, training requirement, or idea..."
                      className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400/50 focus:bg-black/30"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.99]"
                  >
                    Send Enquiry

                    <ArrowRight
                      className="h-[18px] w-[18px] transition group-hover:translate-x-1"
                    />
                  </button>

                  <p className="text-center text-xs leading-5 text-slate-600">
                    We respect your information and use it only to
                    respond to your enquiry.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* BUSINESS AREAS */}
      <section className="border-b border-white/10 bg-white/[0.015] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              Work with IMMIQ
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              One technology partner.
              <span className="block text-slate-500">
                Multiple possibilities.
              </span>
            </h2>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-12 lg:grid-cols-4">
            {[
              {
                icon: Building2,
                title: "Corporate Training",
                href: "/training",
              },
              {
                icon: Layers3,
                title: "SaaS Development",
                href: "/saas",
              },
              {
                icon: MessageSquare,
                title: "Emerging Technology",
                href: "/technology",
              },
              {
                icon: Globe,
                title: "Digital Services",
                href: "/services",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.04] sm:p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/10">
                    <Icon className="h-5 w-5 text-cyan-400" />
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-300 sm:text-base">
                    {item.title}
                  </p>

                  <ArrowRight className="mt-5 h-[17px] w-[17px] text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;