import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useColorMode } from "@chakra-ui/react"; // Dodajemo Chakra hook

function Contact() {
  const contactRef = useRef(null);
  const { colorMode } = useColorMode(); // Izvlačimo trenutnu temu (light ili dark)

  // Proveravamo da li je dark mode
  const isDark = colorMode === "dark";

  useEffect(() => {
    // Animacija: Slide in odozdo
    gsap.fromTo(
      contactRef.current.children,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
    );
  }, []);

  return (
    <div
      ref={contactRef}
      /* Dinamički menjamo tekstualnu boju celog kontejnera na osnovu teme */
      className={`absolute -top-50 left-1/2 -translate-x-1/2 min-h-screen flex flex-col items-center justify-center p-6 text-center ${
        isDark ? "text-white" : "text-gray-800"
      }`}
    >
      <h1 className="text-4xl md:!text-5xl font-bold mb-2 text-sky-400">
        Contact
      </h1>
      <p
        className={`${
          isDark ? "text-gray-400" : "text-gray-600"
        } mb-10 text-lg uppercase font-medium`}
      >
        Lets work together
      </p>

      {/* KARTICA SA PODACIMA */}
      <div
        className={`w-full max-w-md backdrop-blur-sm border p-8 rounded-2xl shadow-2xl transition-colors duration-300 ${
          isDark
            ? "bg-white/5 border-white/10 shadow-black/50"
            : "bg-black/5 border-black/10 shadow-gray-200"
        }`}
      >
        {/* EMAIL */}
        <div className="mb-6">
          <p
            className={`text-sm uppercase font-bold tracking-wider mb-1 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Email
          </p>
          <a
            href="mailto:nikolasovljanski.nevergiveup@gmail.com"
            className={`text-lg md:text-xl break-words transition-colors hover:text-sky-400 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            nikolasovljanski.nevergiveup@gmail.com
          </a>
        </div>

        {/* TELEFON */}
        <div className="mb-8">
          <p
            className={`text-sm uppercase font-bold tracking-wider mb-1 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Phone number
          </p>
          <a
            href="tel:0612303702"
            className={`text-xl transition-colors hover:text-sky-400 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            061 230 3702
          </a>
        </div>

        {/* DIVIDER */}
        <div
          className={`h-px w-full my-6 ${
            isDark ? "bg-gray-700" : "bg-gray-300"
          }`}
        ></div>

        {/* DRUSTVENE MREZE */}
        <div className="flex justify-center gap-8">
          {/* LINKEDIN */}
          <a
            href="https://www.linkedin.com/in/nikola-sovljanski/"
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col items-center gap-2 hover:-translate-y-1 transition-transform"
          >
            <div
              className={`p-3 rounded-full transition-colors ${
                isDark
                  ? "bg-gray-800 group-hover:bg-[#0077b5]"
                  : "bg-gray-200 group-hover:bg-[#0077b5]"
              }`}
            >
              <svg
                className={`w-6 h-6 transition-colors ${
                  isDark ? "fill-white" : "fill-gray-700 group-hover:fill-white"
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
            <span
              className={`text-sm transition-colors ${
                isDark
                  ? "text-gray-400 group-hover:text-white"
                  : "text-gray-500 group-hover:text-black"
              }`}
            >
              LinkedIn
            </span>
          </a>

          {/* INSTAGRAM */}
          <a
            href="https://www.instagram.com/_sovljanski_/"
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col items-center gap-2 hover:-translate-y-1 transition-transform"
          >
            <div
              className={`p-3 rounded-full transition-colors ${
                isDark
                  ? "bg-gray-800 group-hover:bg-[#E1306C]"
                  : "bg-gray-200 group-hover:bg-[#E1306C]"
              }`}
            >
              <svg
                className={`w-6 h-6 transition-colors ${
                  isDark ? "fill-white" : "fill-gray-700 group-hover:fill-white"
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <span
              className={`text-sm transition-colors ${
                isDark
                  ? "text-gray-400 group-hover:text-white"
                  : "text-gray-500 group-hover:text-black"
              }`}
            >
              Instagram
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contact;
