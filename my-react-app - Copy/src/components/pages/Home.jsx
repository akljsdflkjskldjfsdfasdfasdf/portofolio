import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText"; // <-- PROVERI DA LI IMAS OVAJ FAJL
import { Link } from "react-router-dom";
import { useColorMode } from "@chakra-ui/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

function Home() {
  const containerRef = useRef(null);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  useEffect(() => {
    let ctx = gsap.context(() => {
      // --- SPLIT TEXT ANIMACIJA ---
      const split = new SplitText(".hero-title", { type: "chars, words" });

      gsap.from(split.chars, {
        duration: 1,

        autoAlpha: 0,
        stagger: 0.1,
        repeat: -1,
        repeatDelay: 1,
        ease: "bounce",
      });

      // --- OSTALE ANIMACIJE ---
      gsap.fromTo(
        ".slide-in-elem",
        { opacity: 0, y: 25, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.2,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.to(".skill-tag", {
        scale: 1.05,
        duration: 2,
        boxShadow: isDark
          ? "0 0 20px rgba(56, 189, 248, 0.3)"
          : "0 0 15px rgba(14, 165, 233, 0.2)",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.2, from: "center" },
        ease: "power1.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className={` absolute -top-40 left-1/2 -translate-x-1/2 min-h-screen flex flex-col items-center justify-center p-4 text-center transition-colors duration-500 w-full ${
        isDark ? " !text-white" : " !text-slate-900"
      }`}
    >
      {/* SADA JE OVO OBICAN NASLOV, SPLITTEXT CE GA RASPARČATI */}
      <h1 className=" !text-shadow-lg !text-shadow-sky-500 hero-title !text-5xl md:!text-7xl lg:!text-8xl font-black mb-8 md:mb-12 tracking-tighter uppercase">
        Hi, I'm Nikola Sovljanski
      </h1>

      <div className="slide-in-elem max-w-2xl md:max-w-3xl mb-10 md:mb-14">
        <h3
          className={`!mt-12 !text-2xl md:!text-3xl font-black mb-4 md:mb-6 tracking-wide ${
            isDark ? "text-sky-400" : "text-sky-600"
          }`}
        >
          Front-End Developer
        </h3>
        <p
          className={`!text-lg md:!text-xl font-medium leading-relaxed ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}
        >
          My name is{" "}
          <span
            className={`font-black ${isDark ? "text-sky-400" : "text-sky-600"}`}
          >
            Nikola Sovljanski
          </span>
          , I am 19 years old and I come from Novi Sad, Serbia.
          <br />I graduated in IT and I live for coding. My motto is:{" "}
          <span
            className={`italic font-black ${
              isDark ? "text-sky-400" : "text-sky-600"
            }`}
          >
            "Never give up"
          </span>
          .
        </p>
      </div>

      <div className="slide-in-elem flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mb-12">
        {[
          "HTML5",
          "CSS3",
          "JavaScript",
          "Express.js",
          "SQL",
          "TypeScript",
          "React",
          "GSAP",
          "Tailwind CSS",
          "REST API",
          "Git/GitHub",
          "Responsive Design",
        ].map((skill) => (
          <span
            key={skill}
            className={`skill-tag px-4 md:px-5 py-2 md:py-2.5 border rounded-full !text-sm md:!text-base font-black transition-colors ${
              isDark
                ? "border-sky-400/30 text-sky-400 bg-sky-400/5"
                : "border-sky-600/30 text-sky-700 bg-sky-600/5"
            }`}
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="slide-in-elem mt-10 md:mt-16">
        <Link
          to="/skills"
          className={`group relative inline-flex items-center justify-center !shadow-lg !shadow-red-500 overflow-hidden rounded-full border-2 px-10 py-4 font-black uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 md:px-14 md:py-5 ${
            isDark
              ? "border-sky-400 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
              : "border-sky-600 text-sky-600 shadow-[0_0_15px_rgba(14,165,233,0.1) ]"
          }`}
        >
          <div
            className={`${
              isDark
                ? "absolute inset-0 -z-10 bg-black"
                : "absolute inset-0 -z-10  bg-sky-600/10 "
            }`}
          >
            {" "}
          </div>

          <div
            className={`absolute inset-0 -z-10 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0  ${
              isDark ? "bg-sky-400" : "bg-sky-600"
            }`}
          />
          <span
            className={`relative z-10 transition-colors duration-300  ${
              isDark ? "group-hover:text-black" : "group-hover:text-white"
            }`}
          >
            My PROJECTS
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Home;




