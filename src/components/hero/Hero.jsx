import React from "react";
import { motion } from "framer-motion";
import profilePic from "../../assets/images/christina.jpg"; // replace with your image
import { FaJs, FaReact, FaFlutter } from "react-icons/fa";

const roles = [
  "Software Engineer",
  "Mobile App Developer",
  "UI/UX Designer",
  "Frontend Developer",
  "Backend Developer",
];

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-16 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 relative overflow-hidden">
      
      {/* LEFT: Text */}
      <div className="md:w-1/2 text-center md:text-left space-y-6 z-10">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-white"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Hi, I’m Christina Wanigasekara
        </motion.h1>

        <motion.div
          className="text-xl md:text-2xl font-semibold text-gray-100 h-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <CycleRoles roles={roles} />
        </motion.div>

        <motion.button
          className="mt-4 px-6 py-3 rounded-full bg-white text-purple-600 font-bold hover:scale-105 transition-transform"
          whileHover={{ scale: 1.1 }}
          onClick={() => document.getElementById("projects").scrollIntoView({ behavior: "smooth" })}
        >
          View Projects
        </motion.button>
      </div>

      {/* RIGHT: Image + Floating Icons */}
      <div className="md:w-1/2 relative mt-10 md:mt-0 flex justify-center">
        <motion.img
          src={profilePic}
          alt="Christina"
          className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-2xl z-10"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
        />

        {/* Floating tech icons */}
        <motion.div
          className="absolute top-0 left-1/4 text-3xl text-yellow-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <FaJs />
        </motion.div>

        <motion.div
          className="absolute bottom-10 right-10 text-4xl text-cyan-400"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          <FaReact />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-1/4 text-3xl text-blue-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        >
          <FaFlutter />
        </motion.div>
      </div>
    </section>
  );
};

// Component for cycling roles
const CycleRoles = ({ roles }) => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 2000); // change role every 2 seconds
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <motion.span
      key={index}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
    >
      {roles[index]}
    </motion.span>
  );
};

export default Hero;
