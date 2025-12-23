import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <p className="text-orange-400 text-lg">Hi 👋 I’m</p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Christina <br />
            <span className="text-orange-500">Wanigasekara</span>
          </h1>

          <p className="text-gray-300 max-w-md">
            A passionate tech enthusiast exploring software engineering,
            mobile app development, UI/UX design, and modern web technologies.
          </p>

          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-xl bg-orange-500 text-black font-semibold hover:bg-orange-400 transition">
              View Projects
            </button>

            <button className="px-6 py-3 rounded-xl border border-gray-500 hover:border-orange-400 transition">
              Contact Me
            </button>
          </div>
        </motion.div>

        {/* RIGHT CONTENT (IMAGE PLACEHOLDER) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center text-black font-bold text-xl">
            Your Photo
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
