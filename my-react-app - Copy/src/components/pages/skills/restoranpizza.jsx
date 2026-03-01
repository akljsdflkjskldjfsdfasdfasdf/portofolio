// ===== IMPORT SEKCIJA =====
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
// === SLIKE IZ STAROG REACT PROJEKTA ===
import pizzaImg from "../../images/pizza.png";
import celaPizzaImg from "../../images/celaPizza.png";
import ikonaGojko from "../../images/gojkoIkona.png";
import backgroundSlika from "../../images/background.jpeg";
// GSAP
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, SplitText, ScrollTrigger);

// ===== POČETNA BAZA PODATAKA =====
const initialMenuData = {
  classic: [
    {
      id: 1,
      name: "Capricciosa",
      desc: "Pelat, sir, šunka, pečurke, origano",
      img: "https://img.freepik.com/premium-photo/pizza-black-background-top-view_1268-30085.jpg",
    },
    {
      id: 2,
      name: "Margarita",
      desc: "Pelat, mocarela, svež bosiljak, maslinovo ulje",
      img: "https://img.freepik.com/premium-photo/pizza-black-background-top-view_1268-30085.jpg",
    },
    {
      id: 3,
      name: "Pepperoni",
      desc: "Pelat, sir, kulen, ljuta papričica",
      img: "https://img.freepik.com/premium-photo/pizza-black-background-top-view_1268-30085.jpg",
    },
  ],
  vegan: [
    {
      id: 101,
      name: "Vegeteriana",
      desc: "Pelat, biljni sir, paprika, tikvice, kukuruz",
      img: "https://img.freepik.com/premium-photo/pizza-black-background-top-view_1268-30085.jpg",
    },
    {
      id: 102,
      name: "Posna Specijal",
      desc: "Tunjevina, crni luk, masline, posni kačkavalj",
      img: "https://img.freepik.com/premium-photo/pizza-black-background-top-view_1268-30085.jpg",
    },
  ],
  drinks: [
    {
      id: 201,
      name: "Coca Cola",
      desc: "0.33l Limenka - Osvežavajuće gazirano piće",
      img: "https://www.shutterstock.com/image-photo/minsk-belarus-april-20-2018-600nw-1073112719.jpg",
    },
    {
      id: 202,
      name: "Fanta",
      desc: "0.33l Limenka - Ukus narandže",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlCCdEsZHBMdKL7YbKwEIB0qQC6M5uTZDnJw&s",
    },
    {
      id: 203,
      name: "Pivo",
      desc: "0.5l Flaša - Svetlo pivo",
      img: "https://www.huski.co.nz/cdn/shop/articles/pexels-photo-338711.jpeg?v=1505451796&width=1920",
    },
  ],
};

// ===== ADMIN MODAL =====
const AdminModal = ({ isOpen, onClose, menuData, setMenuData }) => {
  const [newItem, setNewItem] = useState({
    category: "classic",
    name: "",
    desc: "",
    img: "",
  });
  if (!isOpen) return null;
  const handleAdd = () => {
    if (!newItem.name || !newItem.desc) return alert("Popuni polja!");
    const item = { ...newItem, id: Date.now() };
    setMenuData((prev) => ({
      ...prev,
      [newItem.category]: [...prev[newItem.category], item],
    }));
    setNewItem({ category: "classic", name: "", desc: "", img: "" });
  };
  const handleDelete = (category, id) => {
    setMenuData((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item.id !== id),
    }));
  };
  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-red-500 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="!text-3xl !font-mono !text-red-500 !font-bold">
            ADMIN PANEL (Secret)
          </h2>
          <button onClick={onClose} className="text-2xl hover:text-red-500">
            ✕
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800 p-4 rounded-xl mb-8 border border-gray-700">
          <h3 className="col-span-full !text-xl !text-yellow-400">
            Dodaj novi proizvod
          </h3>
          <select
            className="bg-black border border-gray-600 p-2 rounded !text-white"
            value={newItem.category}
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
          >
            <option value="classic">Classic Pizza</option>
            <option value="vegan">Vegan / Posno</option>
            <option value="drinks">Pića</option>
          </select>
          <input
            placeholder="Naziv proizvoda"
            className="bg-black border border-gray-600 p-2 rounded !text-white"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            placeholder="URL Slike"
            className="bg-black border border-gray-600 p-2 rounded !text-white"
            value={newItem.img}
            onChange={(e) => setNewItem({ ...newItem, img: e.target.value })}
          />
          <input
            placeholder="Opis / Sastojci"
            className="bg-black border border-gray-600 p-2 rounded !text-white md:col-span-2"
            value={newItem.desc}
            onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
          />
          <button
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded md:col-span-2"
          >
            + DODAJ U MENI
          </button>
        </div>
        <div className="space-y-6">
          {Object.keys(menuData).map((cat) => (
            <div key={cat}>
              <h3 className="!text-xl !uppercase !text-red-400 border-b border-gray-700 mb-2 pb-1">
                {cat}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {menuData[cat].map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-gray-800 p-2 rounded border border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={item.img}
                        alt=""
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <span>{item.name}</span>
                    </div>
                    <button
                      onClick={() => handleDelete(cat, item.id)}
                      className="bg-red-900/50 hover:bg-red-600 !text-white px-3 py-1 rounded !text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===== GLAVNA KOMPONENTA =====
const RestoranPizza = () => {
  const containerRef = useRef(null);
  const menuContainerRef = useRef(null);
  const [menuData, setMenuData] = useState(initialMenuData);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "z" || e.key === "Z")) {
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (activeCategory) {
        gsap.fromTo(
          ".menu-item-card",
          { y: 50, opacity: 0, scale: 0.5 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.2)",
          },
        );
        gsap.fromTo(
          ".back-btn",
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, delay: 0.2 },
        );
      } else {
        gsap.fromTo(
          ".category-card",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
          },
        );
        gsap.to(".pizza-outer", {
          rotation: 360,
          duration: 25,
          repeat: -1,
          ease: "linear",
        });
      }
    }, menuContainerRef);
    return () => ctx.revert();
  }, [activeCategory]);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    let ctx = gsap.context(() => {
      ["#section", "#section1", "#section2", "#section3"].forEach(
        (sectionId) => {
          gsap.fromTo(
            sectionId,
            { x: 1800, opacity: 1 },
            {
              x: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power2",
              scrollTrigger: {
                trigger: sectionId,
                start: "top 85%",
                toggleActions: "play reverse play reverse",
              },
            },
          );
        },
      );
      const pizzaTl = gsap.timeline();
      pizzaTl
        .fromTo(
          ".pizza-img",
          { scale: 0.3, opacity: 0, rotation: -15 },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 2.8,
            ease: "elastic.out(1, 0.75)",
            delay: 0.4,
          },
        )
        .to(".pizza-img", {
          y: 20,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      gsap.from(".naslov", {
        duration: 1.5,
        y: 50,
        opacity: 0,
        ease: "power4.out",
        delay: 0.5,
      });
      gsap.from(".krugovi", {
        duration: 1.5,
        y: 50,
        opacity: 0,
        ease: "power4.out",
        delay: 0.5,
      });
      gsap.from(".celapizza", {
        rotation: 360,
        duration: 25,
        repeat: -1,
        ease: "linear",
      });
      const split = new SplitText(".hero-title", { type: "chars, words" });
      gsap.from(split.chars, {
        duration: 1,
        y: 25,
        autoAlpha: 0,
        stagger: 0.04,
        repeat: -1,
        repeatDelay: 1.5,
        ease: "elastic.inOut",
      });
      gsap.to(".strelica-unutar-kruga", {
        y: 10,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.2,
      });
      gsap.to(".pizza-outer", {
        rotation: 360,
        duration: 25,
        repeat: -1,
        ease: "linear",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleScroll = (id) => {
    const element = document.querySelector(id);
    if (element) {
      gsap.to(window, {
        duration: 2,
        scrollTo: { y: element, offsetY: 100 },
        ease: "power3.inOut",
      });
    }
  };

  const bgStyle = {
    backgroundImage: `url(${backgroundSlika})`,
    backgroundPosition: "center",
    minHeight: "100vh",
    backgroundAttachment: "fixed",
  };

  const handleCategoryClick = (category) => setActiveCategory(category);
  const handleBackToMenu = () => setActiveCategory(null);

  return (
    <div ref={containerRef}>
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        menuData={menuData}
        setMenuData={setMenuData}
      />

      <header className="fixed top-0 left-0 w-full z-50 !text-2xl md:!text-4xl !font-mono !text-white h-25 backdrop-blur-md bg-black/50 shadow-2xl shadow-amber-50/20 flex items-center justify-around px-7 md:px-18 lg:px-24">
        <div className="flex-1">
          <div className="w-20 hover:text-red-500">
            <a
              href="#section1"
              onClick={(e) => {
                e.preventDefault();
                handleScroll("#section1");
              }}
            >
              Meni
            </a>
          </div>
        </div>
        <div className="flex-initial">
          <a
            href="#section"
            onClick={(e) => {
              e.preventDefault();
              handleScroll("#section");
            }}
          >
            <img className="size-20" src={ikonaGojko} alt="Gojko Ikona" />
          </a>
        </div>
        <nav className="flex-3 md:flex-1 md:!text-4xl flex justify-end gap-6 text-center items-center">
          <div className="hover:shadow-2xs hover:shadow-amber-50 hover:text-red-500">
            <a
              href="#section2"
              onClick={(e) => {
                e.preventDefault();
                handleScroll("#section2");
              }}
            >
              About
            </a>
          </div>
          <div className="hover:text-red-500 hover:shadow-2xs hover:shadow-amber-50">
            <a
              href="#section3"
              onClick={(e) => {
                e.preventDefault();
                handleScroll("#section3");
              }}
            >
              Contact
            </a>
          </div>
        </nav>
      </header>

      <main style={bgStyle}>
        <section id="section" className="!pt-30 h-[100vh]">
          <div>
            <img
              className="pizza-img mx-auto w-1/4 w-2xs inset-0 object-cover object-center"
              src={pizzaImg}
              alt="Pizza na drva"
            />
            <h1 className="naslov p-7 !tracking-wider block !text-center w-[90vw] notable-regular rounded-b-4xl !mx-auto bg-red-800/90 hero-title !text-yellow-300 !uppercase !text-center !text-shadow-black !text-shadow-md !text-4xl md:!text-7xl">
              Welcome to Pizzeria Gojko
            </h1>
            <div className="flex justify-center gap-10 mt-10">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="krugovi w-20 h-20 rounded-full border-4 bg-red-800 border-amber-300 flex items-center justify-center"
                >
                  <svg
                    className="strelica-unutar-kruga w-10 h-10 text-amber-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="section1"
          ref={menuContainerRef}
          className="!min-h-[80vh] mt-20 sm:mt-10 md:mt-5 lg:mt-0 opacity-0 p-4 flex flex-col gap-4 max-w-7xl mx-auto !overflow-hidden!"
        >
          {!activeCategory && (
            <>
              <div className="flex-1 flex flex-col md:flex-row gap-4">
                <div
                  onClick={() => handleCategoryClick("classic")}
                  className="text-shadow-lg text-shadow-black category-card min-h-[250px] group relative flex-5 bg-red-700/40 rounded-3xl overflow-hidden flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.02] duration-300 border border-red-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-black opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-70 transition-opacity">
                    <img
                      src="https://png.pngtree.com/png-clipart/20230412/original/pngtree-modern-kitchen-food-boxed-cheese-lunch-pizza-png-image_9048155.png"
                      className="pizza-outer w-[60%] absolute"
                      alt=""
                    />
                  </div>
                  <div className="relative z-10 text-center">
                    <h2 className="!text-2xl md:!text-7xl !font-black !text-white !uppercase !italic drop-shadow-2xl">
                      Classic
                    </h2>
                    <p className="!text-yellow-400 !text-3xl !font-bold mt-2 !tracking-widest !uppercase">
                      Standard Selection
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => handleCategoryClick("vegan")}
                  className="text-shadow-lg text-shadow-black category-card group min-h-[250px] relative flex-5 bg-green-800/80 rounded-3xl overflow-hidden flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.02] duration-0 border border-green-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-black opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-70 transition-opacity">
                    <img
                      src="https://png.pngtree.com/png-clipart/20230412/original/pngtree-modern-kitchen-food-boxed-cheese-lunch-pizza-png-image_9048155.png"
                      className="pizza-outer w-[60%] absolute"
                      alt=""
                    />
                  </div>
                  <div className="relative z-10 text-center">
                    <h2 className="!text-2xl md:!text-7xl !font-black !text-white !uppercase !italic drop-shadow-2xl">
                      Vegan
                    </h2>
                    <p className="!text-green-300 !font-bold !text-3xl mt-2 !tracking-widest !uppercase">
                      Lenten (Posno)
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => handleCategoryClick("drinks")}
                className="category-card z-50! overflow-hidden group relative mx-auto w-[100%]! md:w-[70%] min-h-[250px] bg-black/30 backdrop-blur-sm rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-center md:justify-between p-8 md:px-20 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="z-10 text-left">
                  <h3 className="!text-4xl md:!text-6xl !font-black !text-white !uppercase !italic !tracking-tighter">
                    Thirsty?
                  </h3>
                  <p className="!text-gray-400 !text-2xl !uppercase !tracking-widest">
                    Cold drinks selection →
                  </p>
                </div>
                <div className="relative md:absolute md:right-0 h-40 md:h-full w-full md:w-1/2 flex items-center justify-center md:justify-end mt-4 md:mt-0">
                  <div className="absolute w-40 h-40 bg-red-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
                  <img
                    src="https://www.shutterstock.com/shutterstock/videos/1065268699/thumb/1.jpg?ip=x480"
                    className="!h-8/9 object-contain transition-transform duration-500 group-hover:scale-110"
                    alt="Coca Cola"
                  />
                </div>
              </div>
            </>
          )}

          {activeCategory && (
            <div className="relative w-full min-h-[500px] flex flex-col">
              <div className="flex justify-between items-center mb-6 px-4">
                <h2 className="bg-red-500 rounded-3xl p-5 !text-4xl !text-shadow-lg !text-black md:!text-6xl !font-black !text-white !uppercase !italic drop-shadow-lg">
                  {activeCategory} <span className="text-amber-100">Menu</span>
                </h2>
                <button
                  onClick={handleBackToMenu}
                  className="back-btn group flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full !bg-red-500/80 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all hover:scale-110"
                >
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                {menuData[activeCategory].map((item) => (
                  <div
                    key={item.id}
                    className="menu-item-card group bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-4 hover:border-red-500/50 transition-colors group h-full"
                  >
                    <div className="relative w-full h-48 flex items-center justify-center shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl z-0" />
                      <img
                        src={item.img}
                        alt={item.name}
                        className="relative z-10 max-h-full max-w-full object-contain drop-shadow-2xl transform group-hover:scale-110 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <div className="text-center z-10 flex flex-col flex-1">
                      <h3 className="!text-2xl !font-bold !text-white !uppercase !italic mb-2 !line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="!text-gray-300 !text-sm !font-mono !leading-relaxed !line-clamp-3">
                        {item.desc}
                      </p>
                    </div>
                    <button className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-500 !text-3xl !text-white !font-bold !uppercase !tracking-wider rounded-full transition-all group-hover:shadow-lg group-hover:shadow-red-600 transform !active:scale-95 shrink-0">
                      Order Now
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleBackToMenu}
                  className="!text-amber-300 rounded-2xl !p-5 text-center hover:text-white !underline !uppercase !tracking-widest !text-lg !font-bold !bg-red-700 !h-14"
                >
                  ← Back to Categories
                </button>
              </div>
            </div>
          )}
        </section>

        <section
          id="section2"
          className="opacity-0 mt-20 sm:mt-0 md:mt-25 w-[80vw] h-[130vh] md:h-[120vh] lg:h-[100vh] mx-auto overflow-hidden"
        >
          <div className="flex flex-col md:flex-row justify-between items-center h-full flex-1 text-center">
            <div className="rounded-3xl bg-black/30 backdrop-blur-sm flex-1 h-[75%] md:h-[65%] w-full flex flex-col justify-center p-10 md:p-16 border-b-4 md:border-b-0 md:border-r-4 border-amber-50/20">
              <h2 className="bricolage-font !text-yellow-300 !text-4xl md:!text-6xl !uppercase !italic !font-black mb-6 !leading-tight">
                Naša Priča <br />
                <span className="!text-white !text-2xl md:!text-3xl !not-italic !font-light">
                  Od 1990. godine
                </span>
              </h2>
              <p className="bricolage-font !text-gray-200 !text-sm md:!text-xl !leading-relaxed mb-8">
                U{" "}
                <span className="text-red-500 font-bold">Pizzeriji Gojko</span>,
                pica nije samo hrana – to je tradicija koja se peče na pravoj
                bukovoj vatri. Svako testo mesimo ručno, ostavljajući ga da
                sazri 48 sati za savršenu hrskavost.
              </p>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-red-500 text-2xl">🔥</span>
                  <p className="!text-white !font-bold !uppercase !tracking-tighter">
                    Peć na drva (Bukova drva)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-red-500 text-2xl">🍅</span>
                  <p className="!text-white !font-bold !uppercase !tracking-tighter">
                    Originalni Italijanski sastojci
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-red-500 text-2xl">👨‍🍳</span>
                  <p className="!text-white !font-bold !uppercase !tracking-tighter">
                    Recept čuvan generacijama
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 flex justify-center items-center h-full">
              <img
                src={celaPizzaImg}
                alt="big pizza"
                className="mx-auto celapizza object-contain"
              />
            </div>
          </div>
        </section>

        <section
          id="section3"
          className="h-[100vh] relative grid place-items-center"
        >
          <div className="w-[80vw] mx-auto bg-black/30 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10">
            <div className="flex flex-col md:flex-row">
              <div className="p-10 md:w-1/3 flex flex-col justify-center">
                <h2 className="!text-4xl !font-black !text-yellow-300 !uppercase !italic mb-4">
                  Gde smo?
                </h2>
                <p className="!text-white !text-lg mb-2">
                  📍 Adresa Restorana 123
                </p>
                <p className="!text-white !text-lg mb-2">📞 +381 11 123 456</p>
                <p className="!text-gray-400 mt-4 !italic">
                  Svratite na najbolju picu u gradu!
                </p>
              </div>
              <div className="md:w-2/3 h-[400px] w-full">
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.1!2d20.4!3d44.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDQ4JzAwLjAiTiAyMMKwMjQnMDAuMCJF!5e0!3m2!1ssr!2srs!4v1700000000000!5m2!1ssr!2srs"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RestoranPizza;
