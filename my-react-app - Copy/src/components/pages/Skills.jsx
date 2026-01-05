import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Text,
  Kbd
} from "@chakra-ui/react";
import prviVideo from "../videos/prviVideo.mp4";
import prvaSlika from "../images/vreme.png";
import drugaSlika from "../images/drugaSlika.png";
import drugiVideo from "../videos/drugiVideo.mp4";
import trecaSlika from "../images/trecaSlika.png";
import treciVideo from "../videos/treciVideo.mp4";

// ================= SkillCard Component =================

const SkillCard = ({ title, videoUrl, imageUrl, path, onClick }) => {
  const videoRef = useRef(null);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  // Proveravamo da li je link eksterni (počinje sa http)
  const isExternal = path && path.startsWith("http");

  const Content = () => (
    <div
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => {
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
      }}
      className="relative w-full h-[270px] rounded-[30px] overflow-hidden cursor-pointer shadow-xl transition-transform hover:scale-105 group"
    >
      {/* Slika */}
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
      />

      {/* Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* Naslov */}
      <div className="absolute bottom-0 w-full bg-black/40 p-8 backdrop-blur-sm">
        <h3 className="text-white text-2xl font-black uppercase tracking-widest">
          {title}
        </h3>
      </div>
    </div>
  );

  // LOGIKA: Ako postoji onClick (za Modal), koristi div umesto linka
  if (onClick) {
    return (
      <div onClick={onClick} className="block">
        <Content />
      </div>
    );
  }

  // Ako je eksterni, koristi <a>, ako je interni koristi <Link>
  return isExternal ? (
    <a href={path} target="_blank" rel="noopener noreferrer" className="block">
      <Content />
    </a>
  ) : (
    <Link to={path} className="block">
      <Content />
    </Link>
  );
};

// ================= Skills Page =================

const Skills = () => {
  const { colorMode } = useColorMode();
  
  // Hooks za Modal i Navigaciju
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  // Funkcija koja vodi na Pizza stranicu nakon što korisnik pročita modal
  const handleProceedToPizza = () => {
    onClose();
    navigate("/pizzarestaurant");
  };

  return (
    <div className="min-h-screen px-10 pt-10">
      <h1
        className={`!text-6xl font-black text-center pb-16 ${
          colorMode === "dark" ? "text-white" : "text-black"
        }`}
      >
        MY PROJECTS
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        <SkillCard
          title="Weather App"
          path="/weather"
          imageUrl={prvaSlika}
          videoUrl={prviVideo}
        />
        
        {/* Pizza Kartica - ovde prosleđujemo onOpen umesto path-a da bi se prvo otvorio modal */}
        <SkillCard
          title={"Pizza Restaurant"}
          onClick={onOpen} 
          imageUrl={drugaSlika}
          videoUrl={drugiVideo}
        />

        <SkillCard
          title={"Barber site (supabase)"}
          path={"https://barber-ace-studio.netlify.app/"}
          imageUrl={trecaSlika}
          videoUrl={treciVideo}
        />
      </div>

      {/* ================= MODAL ZA PIZZA RESTORAN ================= */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay backdropFilter='blur(5px)' />
        <ModalContent bg={colorMode === "dark" ? "gray.800" : "white"}>
          <ModalHeader fontSize="2xl" fontWeight="bold">
            Važna napomena za Pizza Restaurant
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody fontSize="lg">
            <Text mb={4}>
              Ovo je <strong>CRUD</strong> (Create, Read, Update, Delete) sajt.
            </Text>
            <Text mb={4}>
              To znači da možete <strong>dodavati ili brisati</strong> pice koje se nalaze u ponudi picerije.
            </Text>
            <Text 
              p={4} 
              bg={colorMode === "dark" ? "whiteAlpha.200" : "orange.100"} 
              borderRadius="md" 
              fontWeight="medium"
            >
              Za pristup Admin panelu pritisnite prečicu: <br />
              <span>
                <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>Z</Kbd>
              </span>
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Zatvori
            </Button>
            <Button colorScheme="orange" onClick={handleProceedToPizza}>
              Razumem, otvori sajt
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
};

export default Skills;
