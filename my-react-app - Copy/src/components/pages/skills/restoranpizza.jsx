// ===== IMPORT SEKCIJA =====
// Uvozimo React biblioteku i njene hook-ove za state management i lifecycle
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import pizzaImg from "../../images/pizza.png";
import celaPizzaImg from "../../images/celaPizza.png";
// Uvozimo slike koje će se koristiti u aplikaciji (logo i pozadina)
import ikonaGojko from "../../images/gojkoIkona.png";
import backgroundSlika from "../../images/background.jpeg";

// Uvozimo GSAP biblioteku za profesionalne animacije
import { gsap } from "gsap";
// Plugin za smooth scroll do određenih elemenata
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
// Plugin koji deli tekst na karaktere za fancy animacije
import { SplitText } from "gsap/SplitText";
// Plugin koji aktivira animacije dok scroll-uješ stranicu
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrujemo sve GSAP pluginove da bi mogli da ih koristimo
gsap.registerPlugin(ScrollToPlugin, SplitText, ScrollTrigger);

// ===== POČETNA BAZA PODATAKA =====
// Objekat koji čuva sve proizvode podeljene po kategorijama
const initialMenuData = {
  // Klasične pice (niz objekata)
  classic: [
    {
      id: 1, // Jedinstveni identifikator
      name: "Capricciosa", // Naziv proizvoda
      desc: "Pelat, sir, šunka, pečurke, origano", // Opis sastojaka
      img: "https://img.freepik.com/premium-photo/pizza-black-background-top-view_1268-30085.jpg", // URL slike proizvoda
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
  // Veganske/posne pice
  vegan: [
    {
      id: 101, // Različit range ID-jeva za lakše razlikovanje kategorija
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
  // Pića
  drinks: [
    {
      id: 201, // Opet drugačiji range
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
      img: "https://www.huski.co.nz/cdn/shop/articles/pexels-photo-338711.jpeg?v=1505451796&width=1920  ",
    },
  ],
};

// ===== ADMIN MODAL KOMPONENTA =====
// Komponenta za dodavanje/brisanje proizvoda (otvara se sa Ctrl+Shift+Z)
const AdminModal = ({ isOpen, onClose, menuData, setMenuData }) => {
  // Lokalni state za formu - čuva šta korisnik unosi
  const [newItem, setNewItem] = useState({
    category: "classic", // Početna kategorija je "classic"
    name: "", // Naziv proizvoda (prazno)
    desc: "", // Opis proizvoda (prazno)
    img: "", // URL slike (prazno)
  });

  // Ako modal nije otvoren, ne renderuj ništa (vrati null)
  if (!isOpen) return null;

  // Funkcija koja dodaje novi proizvod u meni
  const handleAdd = () => {
    // Provera: ako nema ime ili opis, prikaži upozorenje i prekini
    if (!newItem.name || !newItem.desc) return alert("Popuni polja!");

    // Kreiraj novi objekat proizvoda sa jedinstvenim ID-jem (trenutni timestamp)
    const item = { ...newItem, id: Date.now() };

    // Ažuriraj menuData state - dodaj novi proizvod u odgovarajuću kategoriju
    setMenuData((prev) => ({
      ...prev, // Kopiraj sve postojeće kategorije
      [newItem.category]: [...prev[newItem.category], item], // Dodaj novi proizvod na kraj niza
    }));

    // Resetuj formu na početne vrednosti
    setNewItem({ category: "classic", name: "", desc: "", img: "" });
  };

  // Funkcija koja briše proizvod iz menija
  const handleDelete = (category, id) => {
    // Ažuriraj menuData - filtriraj sve proizvode OSIM onog sa ovim ID-jem
    setMenuData((prev) => ({
      ...prev, // Kopiraj sve kategorije
      [category]: prev[category].filter((item) => item.id !== id), // Izbaci proizvod sa ovim ID-jem
    }));
  };

  // JSX koji renderuje modal
  return (
    // Full screen overlay sa crnom pozadinom
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      {/* Modal kontejner */}
      <div className="bg-gray-900 border border-red-500 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 text-white">
        {/* Header modala sa naslovom i X dugmetom */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-mono text-red-500 font-bold">
            ADMIN PANEL (Secret)
          </h2>
          {/* X dugme koje zatvara modal */}
          <button onClick={onClose} className="text-2xl hover:text-red-500">
            ✕
          </button>
        </div>

        {/* FORMA ZA DODAVANJE NOVOG PROIZVODA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800 p-4 rounded-xl mb-8 border border-gray-700">
          <h3 className="col-span-full text-xl text-yellow-400">
            Dodaj novi proizvod
          </h3>

          {/* Dropdown za izbor kategorije */}
          <select
            className="bg-black border border-gray-600 p-2 rounded text-white"
            value={newItem.category} // Trenutna vrednost iz state-a
            onChange={
              (e) => setNewItem({ ...newItem, category: e.target.value }) // Promeni kategoriju
            }
          >
            <option value="classic">Classic Pizza</option>
            <option value="vegan">Vegan / Posno</option>
            <option value="drinks">Pića</option>
          </select>

          {/* Input za naziv proizvoda */}
          <input
            placeholder="Naziv proizvoda"
            className="bg-black border border-gray-600 p-2 rounded text-white"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />

          {/* Input za URL slike */}
          <input
            placeholder="URL Slike"
            className="bg-black border border-gray-600 p-2 rounded text-white"
            value={newItem.img}
            onChange={(e) => setNewItem({ ...newItem, img: e.target.value })}
          />

          {/* Input za opis (zauzima 2 kolone na većim ekranima) */}
          <input
            placeholder="Opis / Sastojci"
            className="bg-black border border-gray-600 p-2 rounded text-white md:col-span-2"
            value={newItem.desc}
            onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
          />

          {/* Dugme koje poziva handleAdd funkciju */}
          <button
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded md:col-span-2"
          >
            + DODAJ U MENI
          </button>
        </div>

        {/* LISTA PROIZVODA SA OPCIJOM ZA BRISANJE */}
        <div className="space-y-6">
          {/* Petlja kroz sve kategorije (classic, vegan, drinks) */}
          {Object.keys(menuData).map((cat) => (
            <div key={cat}>
              {/* Naslov kategorije */}
              <h3 className="text-xl uppercase text-red-400 border-b border-gray-700 mb-2 pb-1">
                {cat}
              </h3>
              {/* Grid sa proizvodima iz te kategorije */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Petlja kroz sve proizvode u kategoriji */}
                {menuData[cat].map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-gray-800 p-2 rounded border border-gray-700"
                  >
                    {/* Leva strana: slika i naziv */}
                    <div className="flex items-center gap-2">
                      <img
                        src={item.img}
                        alt=""
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <span>{item.name}</span>
                    </div>
                    {/* Desna strana: Delete dugme */}
                    <button
                      onClick={() => handleDelete(cat, item.id)} // Briši ovaj proizvod
                      className="bg-red-900/50 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
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
  // Ref za GSAP context (za čišćenje animacija)
  const containerRef = useRef(null);

  // STATE MANAGEMENT
  // Čuva trenutne proizvode (može se menjati u admin panelu)
  const [menuData, setMenuData] = useState(initialMenuData);
  // null = prikazane kategorije | 'classic'/'vegan'/'drinks' = prikazani proizvodi
  const [activeCategory, setActiveCategory] = useState(null);
  // Da li je admin panel otvoren?
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // ===== ADMIN SHORTCUT (Ctrl+Shift+Z) =====
  useEffect(() => {
    // Funkcija koja sluša tastere
    const handleKeyDown = (e) => {
      // Ako je Ctrl + Shift + Z pritisnuto
      if (e.ctrlKey && e.shiftKey && (e.key === "z" || e.key === "Z")) {
        // Toggle admin panel (otvori ako je zatvoren, zatvori ako je otvoren)
        setIsAdminOpen((prev) => !prev);
      }
    };
    // Dodaj event listener
    window.addEventListener("keydown", handleKeyDown);
    // Cleanup: ukloni listener kad se komponenta unmountuje
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); // Prazan dependency array = pokreni samo jednom

  // ===== GSAP ANIMACIJE ZA MENJANJE POGLEDA =====
  const menuContainerRef = useRef(null); // Ref za menu kontejner

  // useLayoutEffect se pokreće PRE nego što browser nacrta ekran
  useLayoutEffect(() => {
    // Kreiraj GSAP context sa scope-om na menuContainerRef
    let ctx = gsap.context(() => {
      // Ako je izabrana kategorija (prikazani su proizvodi)
      if (activeCategory) {
        // Animiraj kartice proizvoda
        gsap.fromTo(
          ".menu-item-card", // Selektor
          { y: 50, opacity: 0, scale: 0.5, willChange: "transform" }, // OD (početno stanje)
          {
            y: 0, // DO normalne pozicije
            opacity: 1, // DO vidljivo
            scale: 1, // DO normalna veličina
            duration: 0.5, // Traje 0.5s
            stagger: 0, // Svaka kartica kreće 0.1s kasnije
            ease: "back.out(1.2)", // Bounce efekat
            willChange: "transform",
          }
        );
        // Animiraj "Back" dugme
        gsap.fromTo(
          ".back-btn",
          { x: -20, opacity: 0 }, // Levo i nevidljivo
          { x: 0, opacity: 1, duration: 0.5, delay: 0.2 } // Klizi s leva
        );
      }
      // Ako nisu prikazani proizvodi (vrati se na kategorije)
      else {
        // Animiraj kartice kategorija
        gsap.fromTo(
          ".category-card",
          { y: 20, opacity: 0 }, // Ispod i nevidljivo
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" }
        );
        gsap.to(".pizza-outer", {
          rotation: 360,
          duration: 25,
          repeat: -1,
          ease: "linear",
        });
      }
    }, menuContainerRef); // Scope animacija samo na ovaj kontejner

    // Cleanup: ukloni sve animacije kad se effect ponovo pokrene
    return () => ctx.revert();
  }, [activeCategory]); // Pokreni svaki put kad se activeCategory promeni

  // ===== POČETNE ANIMACIJE I SCROLL SETUP =====
  useEffect(() => {
    // Isključi automatski scroll restore (uvek kreni od vrha)
    window.history.scrollRestoration = "manual";
    // Scroll na vrh stranice
    window.scrollTo(0, 0);

    // Kreiraj GSAP context
    let ctx = gsap.context(() => {
      // Animiraj Section 1 i Section 2 kad scroll-uješ do njih
      ["#section", "#section1", "#section2", "#section3"].forEach(
        (sectionId) => {
          gsap.from(sectionId, {
            scrollTrigger: {
              trigger: sectionId, // Element koji triggeruje animaciju
              start: "top 99%", // Kad vrh sekcije dođe do 80% ekrana
              toggleActions: "play none none reverse", // Animacija se pokreće i obrće
              // Kad sekcija uđe u viewport
              onEnter: () =>
                gsap.fromTo(
                  sectionId,
                  {
                    x: 150, // Kreni 50px ispod
                    opacity: 0.2, // Nevidljivo
                    delay: 20,
                  },
                  {
                    delay: 0.1,
                    x: 0,
                    duration: 2.2,
                    ease: "power4",
                    overwrite: "auto", // Automatski prekini prethodne animacije
                    opacity: 1,
                    willChange: "transform",
                  }
                ),
              // Kad scroll-uješ nazad
              onEnterBack: () =>
                gsap.fromTo(
                  sectionId,
                  {
                    x: 50, // Kreni 50px ispod
                    opacity: 0.2, // Nevidljivo
                  },
                  {
                    x: 0,
                    duration: 3.2,
                    ease: "back.out",
                    overwrite: "auto", // Automatski prekini prethodne animacije
                    opacity: 1,
                    willChange: "transform",
                  }
                ),
            },
          });
        }
      );

      // Animacija za pizza sliku
      const pizzaTl = gsap.timeline(); // Kreiraj timeline (niz animacija)
      pizzaTl
        // Prvo: uvod slike (scale in sa rotacijom)
        .fromTo(
          ".pizza-img",
          { scale: 0.3, opacity: 0, rotation: -15 }, // Mala i rotirana
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 2.8,
            ease: "elastic.out(1, 0.75)", // Elastic bounce efekat
            delay: 0.4,
          }
        )
        // Zatim: lebdenje gore-dole (beskonačno)
        .to(".pizza-img", {
          y: 20, // Pomeri 20px dole
          duration: 2,
          repeat: -1, // Beskonačno ponavljanje
          yoyo: true, // Vrati se nazad (gore-dole)
          ease: "sine.inOut", // Glatko ubrzavanje/usporavanje
          willChange: "transform",
        });

      // Animacija za naslov (fade in odozdo)
      gsap.from(".naslov", {
        duration: 1.5,
        y: 50, // 50px ispod
        opacity: 0,
        ease: "power4.out",
        delay: 0.5,
        willChange: "transform",
      });

      // Animacija za krugove sa strelicama
      gsap.from(".krugovi ", {
        duration: 1.5,
        y: 50,
        opacity: 0,
        ease: "power4.out",
        delay: 0.5,
      });

      // Beskonačna rotacija velike pice u About sekciji
      gsap.from(".celapizza", {
        rotation: 360, // Rotiraj 360 stepeni
        duration: 25, // Za 25 sekundi
        repeat: -1, // Beskonačno
        ease: "linear", // Konstantna brzina
      });

      // Split text animacija za hero naslov
      const split = new SplitText(".hero-title", { type: "chars, words" }); // Podeli na karaktere
      gsap.from(split.chars, {
        smartWrap: true,
        autoSplit: true,
        duration: 1,
        y: 25, // Svaki karakter krene 25px ispod
        autoAlpha: 0, // Nevidljiv
        stagger: 0.04, // Svaki karakter kreće 0.04s kasnije
        repeat: -1, // Beskonačno ponavljanje
        repeatDelay: 1.5, // Pauza između ponavljanja
        ease: "elastic.inOut",
      });

      // Bounce animacija za strelice u krugovima
      gsap.to(".strelica-unutar-kruga", {
        y: 10, // Pomeri 10px dole
        duration: 0.8,
        repeat: -1,
        yoyo: true, // Gore-dole
        ease: "power1.inOut",
        stagger: 0.2, // Svaka strelica kreće sa zakašnjenjem
      });

      // Beskonačna rotacija pizza slika u pozadini kartica
      gsap.to(".pizza-outer", {
        rotation: 360,
        duration: 25,
        repeat: -1,
        ease: "linear",
      });

      // Smooth scroll za header linkove
      // Smooth scroll za header linkove
      const links = document.querySelectorAll("header a");
    }, containerRef); // Scope svih animacija na containerRef

    // Cleanup: ukloni sve animacije
    return () => ctx.revert();
  }, []); // Prazan array = pokreni samo jednom
  // OVO TREBA DA STOJI SAMOSTALNO
  const handleScroll = (id) => {
    const element = document.querySelector(id);
    if (element) {
      gsap.to(window, {
        duration: 2,
        scrollTo: { y: element, offsetY: 100 },
        ease: "power3.inOut",
      });
    } else {
      console.warn(`Element sa ID-jem ${id} nije pronađen!`);
    }
  };
  // Stil za background sliku (fixed parallax efekat)
  const bgStyle = {
    backgroundImage: `url(${backgroundSlika})`, // Background slika
    backgroundPosition: "center", // Centriraj sliku
    minHeight: "100vh", // Minimalna visina = visina ekrana
    backgroundAttachment: "fixed", // Fiksirana pozadina (parallax)
  };

  // Funkcija koja prebacuje na prikaz proizvoda
  const handleCategoryClick = (category) => {
    setActiveCategory(category); // Postavi aktivnu kategoriju
  };

  // Funkcija koja vraća na prikaz kategorija
  const handleBackToMenu = () => {
    setActiveCategory(null); // Resetuj aktivnu kategoriju
  };

  // ===== JSX RENDER =====
  return (
    // Glavni kontejner sa ref-om za GSAP
    <div ref={containerRef}>
      {/* Admin Modal Komponenta */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        menuData={menuData}
        setMenuData={setMenuData}
      />

      {/* HEADER - Fiksiran na vrhu */}
      <header className="fixed top-0 left-0 w-full z-50 text-2xl md:text-4xl font-mono text-white h-25 backdrop-blur-md bg-black/50 shadow-2xl shadow-amber-50/20 flex items-center justify-around px-7 md:px-18 lg:px-24">
        {/* Link za Meni */}
        <div className="flex-1">
          <div className="w-20 hover:text-red-500">
            <a
              href="#section1"
              className="hover:shadow-2xs hover:shadow-amber-50"
              onClick={(e) => {
                e.preventDefault();
                handleScroll("#section1");
              }}
            >
              Meni
            </a>
          </div>
        </div>
        {/* Logo u sredini */}
        <div className="flex-initial">
          <a
            href="#section"
            className="text-white hover:text-gray-400"
            onClick={(e) => {
              e.preventDefault();
              handleScroll("#section");
            }}
          >
            <img className="size-20 " src={ikonaGojko} alt="Gojko Ikona" />
          </a>
        </div>
        {/* Navigacija desno */}
        <nav className="flex-3 md:flex-1 md:text-4xl flex justify-end gap-6  text-center items-center">
          <div className=" hover:shadow-2xs hover:shadow-amber-50 hover:text-red-500 ">
            <a
              href="#section2"
              className="text-white hover:text-gray-400 sm:text-[25px]! md:text-4xl!"
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
              className="text-white hover:text-gray-400"
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

      {/* MAIN - Glavni sadržaj sa background slikom */}
      <main style={bgStyle}>
        {/* SECTION 1: HERO SEKCIJA */}
        <section id="section" className="!pt-30 ">
          <div className=" h-[90vh]">
            {/* Lebdeća pizza slika */}
            <img
  className="pizza-img mx-auto w-1/4 w-2xs inset-0 object-cover object-center"
  src={pizzaImg}
  alt="Pizza na drva"
/>
            {/* Hero naslov sa animacijom karaktera */}
            <h1 className="naslov p-7 tracking-wider block text-center w-[90vw] notable-regular  rounded-b-4xl !mx-auto bg-red-800/90 hero-title  text-yellow-300 uppercase text-center !text-shadow-black !text-shadow-md  !text-4xl md:!text-7xl ">
              Welcome to Pizzeria Gojko
            </h1>
            {/* 3 kruga sa strelicama (scroll hint) */}
            <div className=" flex justify-center gap-10 mt-10 mt-25">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="krugovi w-20 h-20 rounded-full border-4 bg-red-800 border-amber-300 flex items-center justify-center"
                >
                  {/* SVG strelica dole */}
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
                    ></path>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: MENU (DINAMIČKI) */}
        <section
          id="section1"
          ref={menuContainerRef} // Ref za GSAP scope
          className="!min-h-[80vh] opacity-0 pt-20 p-4 flex flex-col gap-4 max-w-7xl mx-auto !overflow-hidden!"
        >
          {/* Prikaz Kategorija (samo ako activeCategory === null) */}
          {!activeCategory && (
            <>
              <div className="flex-1 flex flex-col md:flex-row gap-4">
                {/* CLASSIC KARTICA */}
                <div
                  onClick={() => handleCategoryClick("classic")} // Klik prebacuje na proizvode
                  className="text-shadow-lg text-shadow-black category-card min-h-[250px] group relative flex-5 bg-red-700/40 rounded-3xl overflow-hidden flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.02] duration-300 border border-red-500/30"
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-black opacity-40" />
                  {/* Pizza slika u pozadini */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-70 transition-opacity">
                    <img
                      src="https://png.pngtree.com/png-clipart/20230412/original/pngtree-modern-kitchen-food-boxed-cheese-lunch-pizza-png-image_9048155.png"
                      className="pizza-outer w-[60%] absolute"
                      alt=""
                    />
                  </div>
                  {/* Tekst */}
                  <div className="relative z-10 text-center ">
                    <h2 className="!text-2xl md:text-7xl font-black text-white uppercase italic drop-shadow-2xl">
                      Classic
                    </h2>
                    <p className="text-yellow-400  text-3xl font-bold mt-2 tracking-widest uppercase">
                      Standard Selection
                    </p>
                  </div>
                </div>

                {/* VEGAN KARTICA (ista logika kao Classic) */}
                <div
                  onClick={() => handleCategoryClick("vegan")}
                  className=" text-shadow-lg text-shadow-black category-card group min-h-[250px] relative flex-5 bg-green-800/80  rounded-3xl overflow-hidden flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.02] duration-0 border border-green-500/30"
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
                    <h2 className="!text-2xl md:text-7xl font-black text-white uppercase italic drop-shadow-2xl">
                      Vegan
                    </h2>
                    <p className="text-green-300 font-bold text-3xl mt-2 tracking-widest uppercase">
                      Lenten (Posno)
                    </p>
                  </div>
                </div>
              </div>

              {/* DRINKS KARTICA (drugačiji layout) */}
              <div
                onClick={() => handleCategoryClick("drinks")}
                id="drinks"
                className="category-card z-50! overflow-hidden group relative mx-auto w-[90%] md:w-[70%] min-h-[250px] bg-black/100 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-center md:justify-between p-8 md:px-20 cursor-pointer  transition-all hover:scale-[1.02]"
              >
                {/* Leva strana: tekst */}
                <div className="z-10 md:text-left  ">
                  <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
                    Thirsty?
                  </h3>
                  <p className="text-gray-400 text-2xl uppercase tracking-widest ">
                    Cold drinks selection →
                  </p>
                </div>
                {/* Desna strana: slika Coca Cole */}
                <div className="relative md:absolute md:right-0 h-40 md:h-full w-full md:w-1/2 flex items-center justify-center md:justify-end mt-4 md:mt-0">
                  {/* Crveni glow efekat */}
                  <div className="absolute w-40 h-40 bg-red-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
                  {/* Slika pića */}
                  <img
                    src="https://www.shutterstock.com/shutterstock/videos/1065268699/thumb/1.jpg?ip=x480"
                    className="!h-8/9 object-contain transition-transform duration-500 group-hover:scale-110"
                    alt="Coca Cola"
                  />
                </div>
              </div>
            </>
          )}

          {/* Prikaz Proizvoda (kada je izabrana kategorija) */}
          {activeCategory && (
            <div className="relative w-full min-h-[500px] flex flex-col">
              {/* Header sa Back dugmetom */}
              <div className="flex justify-between items-center mb-6 px-4">
                {/* Naslov kategorije */}
                <h2 className="bg-red-500 rounded-3xl p-5 !text-4xl !text-shadow-lg !text-black md:text-6xl font-black text-white uppercase italic drop-shadow-lg">
                  {activeCategory} <span className="text-amber-100">Menu</span>
                </h2>
                {/* X dugme za povratak */}
                <button
                  onClick={handleBackToMenu}
                  className="back-btn group flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full !bg-red-500/80 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all hover:scale-110 "
                >
                  {/* SVG X ikona */}
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
                    ></path>
                  </svg>
                </button>
              </div>

              {/* Grid sa proizvodima */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                {/* Petlja kroz sve proizvode iz aktivne kategorije */}
                {menuData[activeCategory].map((item) => (
                  <div
                    key={item.id} // Jedinstveni ključ za React
                    className="menu-item-card group bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-4 hover:border-red-500/50 transition-colors group h-full"
                  >
                    {/* KONTEJNER ZA SLIKU */}
                    <div className="relative w-full h-48 flex items-center justify-center shrink-0">
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl z-0" />
                      {/* Slika proizvoda sa hover efektom */}
                      <img
                        src={item.img}
                        alt={item.name}
                        className="relative z-10 max-h-full max-w-full object-contain drop-shadow-2xl transform group-hover:scale-110 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>

                    {/* TEKSTUALNI DEO */}
                    <div className="text-center z-10 flex flex-col flex-1">
                      {/* Naziv proizvoda */}
                      <h3 className="text-2xl font-bold text-white uppercase italic mb-2 line-clamp-1">
                        {item.name}
                      </h3>
                      {/* Opis proizvoda (max 3 linije) */}
                      <p className="text-gray-300 text-sm font-mono leading-relaxed line-clamp-3">
                        {item.desc}
                      </p>
                    </div>

                    {/* DUGME ZA NARUDŽBINU */}
                    <button className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-500 !text-3xl text-white font-bold uppercase tracking-wider rounded-full transition-all group-hover:shadow-lg group-hover:shadow-red-600 transform !active:scale-95 shrink-0">
                      Order Now
                    </button>
                  </div>
                ))}
              </div>

              {/* Back dugme na dnu (za mobilne) */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleBackToMenu}
                  className="text-amber-300 rounded-2xl !p-5 text-center hover:text-white underline uppercase tracking-widest !text-lg font-bold !bg-red-700 !h-14"
                >
                  ← Back to Categories
                </button>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 3: MAPA I KONTAKT */}
        <section
          id="section3"
          className="py-20 px-4 opacity-0 h-[100vh] relative mb-20"
        >
          <div className="mt-40 max-w-7xl mx-auto bg-black/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10">
            <div className="flex flex-col md:flex-row">
              {/* Leva strana: kontakt informacije */}
              <div className="p-10 md:w-1/3 flex flex-col justify-center">
                <h2 className="text-4xl font-black text-yellow-300 uppercase italic mb-4">
                  Gde smo?
                </h2>
                {/* Adresa sa emoji */}
                <p className="text-white text-lg mb-2">
                  📍 Adresa Restorana 123
                </p>
                {/* Telefon sa emoji */}
                <p className="text-white text-lg mb-2">📞 +381 11 123 456</p>
                {/* Poziv na akciju */}
                <p className="text-gray-400 mt-4 italic">
                  Svratite na najbolju picu u gradu!
                </p>
              </div>
              {/* Desna strana: Google Maps iframe */}
              <div className="md:w-2/3 h-[400px] w-full">
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.1!2d20.4!3d44.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDQ4JzAwLjAiTiAyMMKwMjQnMDAuMCJF!5e0!3m2!1ssr!2srs!4v1700000000000!5m2!1ssr!2srs"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }} // Bez border-a
                  allowFullScreen="" // Dozvoli full screen
                  loading="lazy" // Lazy load za bolje performanse
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: ABOUT (O NAMA) */}
        <section
          id="section2"
          className=" opacity-0 w-[80vw] h-[100vh] mx-auto border-4 border-amber-50 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row justify-between items-center h-full">
            {/* Leva strana: priča o pizzeriji */}
            <div className="bg-black/80 flex-1 h-[60%] w-full flex flex-col justify-center p-10 md:p-16 border-b-4 md:border-b-0 md:border-r-4 border-amber-50/20">
              {/* Naslov */}
              <h2 className="bricolage-font text-yellow-300 text-4xl md:text-6xl uppercase italic font-black mb-6 leading-tight">
                Naša Priča <br />
                {/* Podnaslov */}
                <span className="text-white text-2xl md:text-3xl not-italic font-light tracking-widest">
                  Od 1990. godine
                </span>
              </h2>
              {/* Opis */}
              <p className="bricolage-font text-gray-200 text-sm md:text-xl leading-relaxed mb-8">
                U{" "}
                <span className="text-red-500 font-bold">Pizzeriji Gojko</span>,
                pica nije samo hrana – to je tradicija koja se peče na pravoj
                bukovoj vatri. Svako testo mesimo ručno, ostavljajući ga da
                sazri 48 sati za savršenu hrskavost.
              </p>
              {/* 3 bullet pointa sa emoji ikonama */}
              <div className="flex flex-col gap-4">
                {/* Peć na drva */}
                <div className="flex items-center gap-3">
                  <span className="text-red-500 text-2xl">🔥</span>
                  <p className="text-white font-bold uppercase tracking-tighter">
                    Peć na drva (Bukova drva)
                  </p>
                </div>
                {/* Italijanski sastojci */}
                <div className="flex items-center gap-3">
                  <span className="text-red-500 text-2xl">🍅</span>
                  <p className="text-white font-bold uppercase tracking-tighter">
                    Originalni Italijanski sastojci
                  </p>
                </div>
                {/* Tradicionalni recept */}
                <div className="flex items-center gap-3">
                  <span className="text-red-500 text-2xl">👨‍🍳</span>
                  <p className="text-white font-bold uppercase tracking-tighter">
                    Recept čuvan generacijama
                  </p>
                </div>
              </div>
            </div>
            {/* Desna strana: velika pizza slika koja rotira */}
            <div className="flex-1 flex justify-center items-center h-full">
              <img
  src={celaPizzaImg}
  alt="big pizza"
  className="mx-auto celapizza max-h-4/5 object-contain"
/>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// Exportuj komponentu da bi mogla da se koristi u drugim fajlovima
export default RestoranPizza;




