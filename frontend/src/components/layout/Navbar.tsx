import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const links = [
  { to: '/learn', label: 'Learn' },
  { to: '/simulate', label: 'Simulate' },
  { to: '/assessment', label: 'Assessment' },
  { to: '/about', label: 'About' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-3 pb-2 transition-all duration-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Main Floating Transparent Glass Bar */}
        <div
          className={`flex h-16 sm:h-18 items-center justify-between rounded-full px-5 sm:px-7 transition-all duration-300 ${
            scrolled ? 'nav-glass-scrolled' : 'nav-glass'
          }`}
        >
          {/* Left: Brand Logo */}
          <NavLink
            to="/"
            className="group flex items-center gap-3 font-mono tracking-wide text-text"
          >
            <img
              src="/logo.png"
              alt="Menteko Logo"
              className="h-9 sm:h-11 w-auto object-contain transition-transform duration-700 ease-out group-hover:rotate-[360deg] group-hover:scale-110 drop-shadow-[0_2px_12px_rgba(143,30,174,0.35)]"
            />
            <span className="text-base sm:text-xl font-black tracking-wider text-text transition-colors group-hover:text-cyan">
              MENTEKO
            </span>
          </NavLink>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden items-center gap-2 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-4 sm:px-5 py-2 text-base sm:text-lg font-semibold tracking-normal transition-all duration-150 ${
                    isActive
                      ? 'border border-cyan/30 bg-cyan/10 text-cyan shadow-[0_0_12px_rgba(143,30,174,0.15)]'
                      : 'text-muted hover:bg-black/[0.04] hover:text-text'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: CTA & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <NavLink
              to="/simulate"
              className="group hidden items-center gap-2 rounded-full bg-cyan px-5 sm:px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(143,30,174,0.25)] transition-all duration-150 hover:bg-[#7b1696] active:scale-95 sm:inline-flex"
            >
              <span>Start Training</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </NavLink>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-text transition-colors hover:bg-black/5 md:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {open && (
          <div className="mt-2 rounded-2xl nav-glass-scrolled p-4 shadow-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <ul className="flex flex-col gap-1">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-all ${
                        isActive
                          ? 'border border-cyan/30 bg-cyan/10 text-cyan'
                          : 'text-muted hover:bg-black/[0.04] hover:text-text'
                      }`
                    }
                  >
                    <span>{link.label}</span>
                    <span className="font-mono text-xs opacity-50">/&gt;</span>
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-3 border-t border-line">
              <NavLink
                to="/simulate"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan py-2.5 text-xs font-semibold text-white shadow-[0_4px_16px_rgba(143,30,174,0.25)] transition-all hover:bg-[#7b1696]"
              >
                <span>Start Training</span>
                <ArrowRight size={14} />
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}



