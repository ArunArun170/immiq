import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", href: "/" },
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

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Main Navbar */}
        <div className="flex h-16 items-center justify-between sm:h-[72px]">

          {/* Logo */}
          <NavLink
            to="/"
            onClick={closeMenu}
            className="group flex items-center"
          >
            <span className="text-xl font-bold tracking-[0.12em] text-white transition group-hover:text-cyan-300 sm:text-2xl">
              IMMIQ
              <span className="text-cyan-400 transition group-hover:text-cyan-300">
                .
              </span>
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-5 xl:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  `relative whitespace-nowrap px-1 py-2 text-sm transition ${
                    isActive
                      ? "font-medium text-cyan-400"
                      : "text-slate-400 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}

                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-cyan-400" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <NavLink
            to="/contact"
            className="hidden items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-medium text-cyan-300 transition hover:border-cyan-400/50 hover:bg-cyan-400/20 hover:text-cyan-200 xl:inline-flex"
          >
            Talk to IMMIQ
            <ArrowUpRight className="h-4 w-4" />
          </NavLink>

          {/* Mobile / Tablet Menu Button */}
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300 xl:hidden"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile / Tablet Menu */}
        <div
          className={`overflow-hidden transition-all duration-300 xl:hidden ${
            isMenuOpen
              ? "max-h-[650px] pb-5 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <nav className="border-t border-white/10 pt-4">
            <div className="grid gap-1 sm:grid-cols-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.href}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-4 py-3.5 text-sm transition ${
                      isActive
                        ? "bg-cyan-400/10 font-medium text-cyan-300"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.label}</span>

                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Mobile CTA */}
            <NavLink
              to="/contact"
              onClick={closeMenu}
              className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Talk to IMMIQ
              <ArrowUpRight className="h-4 w-4" />
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}