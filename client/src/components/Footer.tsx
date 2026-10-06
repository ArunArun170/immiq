import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Training", href: "/training" },
  { label: "SaaS", href: "/saas" },
  { label: "Technology", href: "/technology" },
  { label: "Services", href: "/services" },
  { label: "Clients", href: "/clients" },
  { label: "Achievements", href: "/achievements" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.35fr_1fr_1fr] lg:gap-16">

          {/* Brand */}
          <div>
            <Link
              to="/"
              className="group inline-flex items-center"
            >
              <span className="text-2xl font-bold tracking-[0.16em] transition group-hover:text-cyan-300 sm:text-3xl">
                IMMIQ
                <span className="text-cyan-400 transition group-hover:text-cyan-300">
                  .
                </span>
              </span>
            </Link>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400 sm:text-sm">
              Curiosity First. Technology Next.
            </p>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
              A technology company focused on learning, software products,
              emerging technologies and digital transformation.
            </p>

            <Link
              to="/contact"
              className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-5 py-2.5 text-sm font-semibold text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-200"
            >
              Start a conversation
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-sm">
              Explore
            </p>

            <nav
              aria-label="Footer navigation"
              className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 sm:gap-y-3"
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex min-h-10 items-center text-sm text-slate-400 transition hover:text-cyan-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-sm">
              Contact
            </p>

            <div className="mt-5 space-y-4">

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

                <p className="text-sm leading-6 text-slate-400">
                  Coimbatore,
                  <br />
                  Tamil Nadu, India
                </p>
              </div>

              {/* Phone */}
              <a
                href="tel:+919876543210"
                className="flex min-h-10 items-center gap-3 text-sm text-slate-400 transition hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0 text-cyan-400" />
                <span>+91 9876543210</span>
              </a>

              {/* Email */}
              <a
                href="mailto:hello@immiq.in"
                className="flex min-h-10 items-center gap-3 text-sm text-slate-400 transition hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-cyan-400" />
                <span className="break-all">hello@immiq.in</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-sm">

          <p>
            © {new Date().getFullYear()} IMMIQ. All rights reserved.
          </p>

          <p className="text-left sm:text-right">
            Technology
            <span className="mx-2 text-slate-700">•</span>
            Innovation
            <span className="mx-2 text-slate-700">•</span>
            Learning
          </p>
        </div>
      </div>
    </footer>
  );
}