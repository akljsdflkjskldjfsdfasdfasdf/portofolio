import React, { useEffect, useState } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const LINKS = [
    { href: "home", label: "Home" },
    { href: "skills", label: "Skills" },
    { href: "contact", label: "Contact" },
  ];

  return (
    <nav className="bg-[rgba(0,0,0,0.52)] backdrop-blur-sm text-white px-6 py-4  flex items-center justify-between relative border-4 shadow-md shadow-amber-50 border-black rounded-full ">
      {/* Logo / brand */}
      <div
        className="text-[130%] md:text-[175%] font-black uppercase 
             bg-linear-to-r from-[#ffa600ff] via-[#ff2727ff] to-[#00e1ffff]
             bg-clip-text text-transparent 
             drop-shadow-[0_0_4px_black]"
      >
        sovljanski.dev
      </div>

      {/* Desktop links */}
      <ul className="hidden md:flex gap-x-32 font-black text-2xl absolute left-1/2 -translate-x-1/2 nav-desktop-links my-auto ">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link
              to={l.href}
              className="hover:text-slate-400 transition-colors nav-hover "
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger button */}
      <button
        className="md:hidden relative -translate-x-15 z-50 p-2 rounded focus:outline-none focus:ring-0 active:outline-none"
        onClick={() => setIsOpen((s) => !s)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Zatvori meni" : "Otvori meni"}
      >
        {isOpen ? <LuX size={32} /> : <LuMenu size={27} />}
      </button>

      {/* Mobile sliding panel */}
      <div
        className={
          "fixed top-0 right-0 h-100% w-3/4 max-w-xs rounded-bl-4xl bg-black text-white transform transition-transform duration-400 md:hidden z-40 " +
          (isOpen ? "translate-x-0" : "translate-x-120")
        }
      >
        <div className="p-20">
          <ul className="flex flex-col space-y-15 font-black">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  to={l.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-[23px] hover:text-slate-400 transition-colors border-b-2 border-b-amber-50 text-center "
                >
                  {l.label}
                </Link>
                <hr color="white" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed -top-10 -left-10 h-1000 w-100000 p-0 m-0 inset-0 bg-black/50 md:hidden z-30"
          aria-hidden
        />
      )}
    </nav>
  );
}
