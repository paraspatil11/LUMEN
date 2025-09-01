import React from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-smooth">
          <nav className="flex items-center justify-between px-4 py-3">
            <a
              href="#top"
              className="flex items-center gap-2"
              aria-label="LUMEN Home"
            >
              <Logo />
            </a>
            <div className="hidden md:flex items-center gap-2">
              <a
                href="#features"
                className="px-4 py-2 rounded-lg hover:bg-secondary text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#how"
                className="px-4 py-2 rounded-lg hover:bg-secondary text-sm font-medium"
              >
                How it works
              </a>
              <a
                href="#demo"
                className="px-4 py-2 rounded-lg hover:bg-secondary text-sm font-medium"
              >
                Demo
              </a>
              <Link
                to="/technical"
                className="px-4 py-2 rounded-lg hover:bg-secondary text-sm font-medium"
              >
                Technical
              </Link>
              <a
                href="#contact"
                className="px-4 py-2 rounded-lg hover:bg-secondary text-sm font-medium"
              >
                Contact
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a href="#demo" className="btn-cta">
                Try LUMEN
              </a>
              <a
                href="#about"
                className="px-4 py-2 rounded-lg border border-input bg-background font-semibold hover:bg-accent"
              >
                Learn More
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
