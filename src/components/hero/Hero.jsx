// src/components/hero/Hero.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaReact,
  FaJs,
  FaCode,
  FaFigma,
  FaDatabase,
} from "react-icons/fa";

const skillIcons = [
  { icon: <FaReact size={30} className="text-blue-500" />, name: "React" },
  { icon: <FaJs size={30} className="text-yellow-400" />, name: "JS" },
  { icon: <FaCode size={30} className="text-blue-400" />, name: "Flutter" },
  { icon: <FaFigma size={30} className="text-pink-500" />, name: "Figma" },
  { icon: <FaDatabase size={30} className="text-green-500" />, name: "Firebase" },
];

const Hero = () => {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const photos = [
    "/assets/images/photo1.jpeg",
    "/assets/images/photo2.jpeg",
    "/assets/images/photo3.jpeg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % photos.length);
    }, 4000); // change photo every 4s
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      
      {/* Left Intro */}
      <div className="flex-1 flex flex-col gap-4">
        <motion.h1
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-bold"
        >
          Hi 👋 <br /> I’m Christina Wanigasekara
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-lg md:text-xl text-gray-300"
        >
          I build meaningful web, mobile & design experiences.
        </motion.p>
        <div className="flex gap-4 mt-4">
          <motion.a
            whileHover={{ scale: 1.05 }}
            className="bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition"
            href="#projects"
          >
            View Projects
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            className="bg-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
            href="#contact"
          >
            Contact Me
          </motion.a>
        </div>
      </div>

      {/* Right Photo + Floating Icons */}
      <div className="flex-1 relative flex justify-center items-center mt-10 md:mt-0">
        {/* Rotating photos */}
        <motion.img
          key={currentPhoto}
          src={photos[currentPhoto]}
          alt="Christina"
          className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-blue-500 shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />

        {/* Floating skill icons */}
        {skillIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              top: `${20 + index * 20}%`,
              left: `${10 + index * 15}%`,
            }}
            animate={{
              y: ["0%", "10%", "0%"],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          >
            {item.icon}
          </motion.div>
        ))}

        {/* Subtle background name marquee */}
        <motion.div
          className="absolute bottom-0 w-full text-center text-white/10 text-4xl md:text-6xl font-thin whitespace-nowrap"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          Merrian Jethuni Christina Wanigasekara Wanniarachchige
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
