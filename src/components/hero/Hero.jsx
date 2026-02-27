import { useState, useEffect, useRef } from "react";
import photo1 from "../../assets/images/photo1.jpeg";
import photo2 from "../../assets/images/photo2.jpeg";
import photo3 from "../../assets/images/photo3.jpeg";

const TYPING_TEXTS = [
  "I build meaningful web experiences.",
  "I craft beautiful mobile apps.",
  "I design with heart & purpose.",
];

const SKILL_ICONS = [
  { label: "React", icon: "⚛️", x: 75, y: 15, delay: 0 },
  { label: "JS", icon: "JS", x: 88, y: 38, delay: 0.6, isText: true, color: "#F7DF1E" },
  { label: "Flutter", icon: "🐦", x: 80, y: 65, delay: 1.2 },
  { label: "Figma", icon: "🎨", x: 62, y: 80, delay: 1.8 },
  { label: "Firebase", icon: "🔥", x: 55, y: 10, delay: 2.4 },
  { label: "API", icon: "API", x: 93, y: 58, delay: 0.9, isText: true, color: "#61DAFB" },
];

const PHOTOS = [ photo1, photo2, photo3 ];

function useTyping(texts, speed = 60, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState("typing");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    let timeout;
    const current = texts[textIdx];
    if (phase === "typing") {
      if (charIdx < current.length) {
        timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
        setDisplay(current.slice(0, charIdx + 1));
      } else {
        timeout = setTimeout(() => setPhase("deleting"), pause);
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
        setDisplay(current.slice(0, charIdx - 1));
      } else {
        setTextIdx((i) => (i + 1) % texts.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [charIdx, phase, textIdx, texts, speed, pause]);

  return display;
}

export default function HeroSection() {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [fadePhoto, setFadePhoto] = useState(true);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const typedText = useTyping(TYPING_TEXTS);

  // Photo rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setFadePhoto(false);
      setTimeout(() => {
        setPhotoIdx((i) => (i + 1) % PHOTOS.length);
        setFadePhoto(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Mouse parallax
  useEffect(() => {
    const handleMove = (e) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMouse({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 30,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0a0a0f;
          overflow-x: hidden;
        }

        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          background: #080810;
          font-family: 'DM Sans', sans-serif;
        }

        /* Ambient background */
        .hero::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(180,120,255,0.12) 0%, transparent 70%);
          top: -100px; right: 200px;
          pointer-events: none;
        }
        .hero::after {
          content: '';
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(80,200,255,0.08) 0%, transparent 70%);
          bottom: 50px; left: 100px;
          pointer-events: none;
        }

        /* Grain overlay */
        .grain {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 1; opacity: 0.4;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 48px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          position: relative; z-index: 2;
          width: 100%;
        }

        /* LEFT SIDE */
        .left { display: flex; flex-direction: column; gap: 28px; }

        .greeting {
          display: flex;
          align-items: center;
          gap: 12px;
          opacity: 0;
          animation: fadeUp 0.8s ease forwards;
        }
        .greeting-wave {
          font-size: 2rem;
          display: inline-block;
          animation: wave 2s ease-in-out infinite;
          transform-origin: 70% 70%;
        }
        .greeting-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.1rem;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 300;
        }

        .name-block {
          opacity: 0;
          animation: fadeUp 0.8s ease 0.2s forwards;
        }
        .name-hi {
          font-family: 'Fraunces', serif;
          font-size: clamp(3rem, 6vw, 5.5rem);
          color: #fff;
          line-height: 1;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        .name-full {
          font-family: 'Fraunces', serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          background: linear-gradient(135deg, #c084fc, #818cf8, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .typing-wrap {
          min-height: 32px;
          opacity: 0;
          animation: fadeUp 0.8s ease 0.4s forwards;
        }
        .typing-text {
          font-size: 1.15rem;
          color: rgba(255,255,255,0.6);
          font-weight: 300;
          font-style: italic;
          font-family: 'Fraunces', serif;
        }
        .cursor {
          display: inline-block;
          width: 2px; height: 1.1em;
          background: #c084fc;
          margin-left: 3px;
          vertical-align: middle;
          animation: blink 1s step-end infinite;
        }

        .cta-row {
          display: flex;
          gap: 16px;
          opacity: 0;
          animation: fadeUp 0.8s ease 0.6s forwards;
        }
        .btn-primary {
          padding: 14px 32px;
          background: linear-gradient(135deg, #c084fc, #818cf8);
          color: #fff;
          border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          border-radius: 100px;
          letter-spacing: 0.03em;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 30px rgba(192,132,252,0.3);
          text-decoration: none;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 40px rgba(192,132,252,0.45);
        }
        .btn-outline {
          padding: 14px 32px;
          background: transparent;
          color: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          border-radius: 100px;
          letter-spacing: 0.03em;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
        }
        .btn-outline:hover {
          border-color: rgba(192,132,252,0.6);
          color: #fff;
          background: rgba(192,132,252,0.08);
        }

        /* SCROLL HINT */
        .scroll-hint {
          display: flex; align-items: center; gap: 10px;
          color: rgba(255,255,255,0.25);
          font-size: 0.78rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          opacity: 0;
          animation: fadeUp 0.8s ease 1s forwards;
        }
        .scroll-line {
          width: 40px; height: 1px;
          background: rgba(255,255,255,0.2);
        }

        /* RIGHT SIDE - PHOTO */
        .right {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 560px;
          opacity: 0;
          animation: fadeIn 1s ease 0.3s forwards;
        }

        .photo-frame {
          position: relative;
          width: 300px;
          height: 380px;
          transition: transform 0.1s ease;
        }

        /* Decorative ring */
        .photo-ring {
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          border: 1px solid rgba(192,132,252,0.15);
          animation: spin 20s linear infinite;
        }
        .photo-ring::before {
          content: '';
          position: absolute;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #c084fc;
          top: 30px; left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 0 12px #c084fc;
        }
        .photo-ring-2 {
          position: absolute;
          inset: -40px;
          border-radius: 50%;
          border: 1px dashed rgba(129,140,248,0.1);
          animation: spin 30s linear infinite reverse;
        }

        .photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 40% 60% 55% 45% / 45% 45% 55% 55%;
          position: absolute;
          transition: opacity 0.5s ease;
          box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05);
        }

        /* Morphing blob animation */
        @keyframes morph {
          0%, 100% { border-radius: 40% 60% 55% 45% / 45% 45% 55% 55%; }
          25% { border-radius: 55% 45% 45% 55% / 55% 40% 60% 45%; }
          50% { border-radius: 50% 50% 60% 40% / 40% 60% 40% 60%; }
          75% { border-radius: 45% 55% 40% 60% / 60% 50% 50% 40%; }
        }
        .photo-img { animation: morph 10s ease-in-out infinite; }

        /* Glow behind photo */
        .photo-glow {
          position: absolute;
          inset: -30px;
          background: radial-gradient(ellipse, rgba(192,132,252,0.2) 0%, transparent 70%);
          border-radius: 50%;
          animation: glowPulse 4s ease-in-out infinite;
        }

        /* FLOATING ICONS */
        .float-icon {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          transition: transform 0.15s ease;
        }
        .float-icon-bubble {
          width: 52px; height: 52px;
          border-radius: 16px;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: default;
        }
        .float-icon-bubble:hover {
          transform: scale(1.15) translateY(-3px);
          box-shadow: 0 16px 40px rgba(192,132,252,0.2);
          border-color: rgba(192,132,252,0.4);
        }
        .float-icon-text-badge {
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
        }
        .float-icon-label {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.3);
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* Photo dots indicator */
        .photo-dots {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex; gap: 8px;
        }
        .dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .dot.active {
          background: #c084fc;
          width: 20px;
          border-radius: 3px;
          box-shadow: 0 0 10px rgba(192,132,252,0.5);
        }

        /* MARQUEE WATERMARK */
        .marquee-wrap {
          position: absolute;
          bottom: 40px; left: 0; right: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        .marquee-track {
          display: flex;
          white-space: nowrap;
          animation: marquee 25s linear infinite;
          gap: 60px;
        }
        .marquee-name {
          font-family: 'Fraunces', serif;
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 300;
          color: rgba(255,255,255,0.04);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          user-select: none;
        }

        /* KEYFRAMES */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-15deg); }
          40% { transform: rotate(20deg); }
          60% { transform: rotate(-10deg); }
          80% { transform: rotate(15deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); } to { transform: rotate(360deg); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes floatY2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(-2deg); }
        }

        .float-anim-0 { animation: floatY 4s ease-in-out infinite; }
        .float-anim-1 { animation: floatY2 5s ease-in-out infinite 0.5s; }
        .float-anim-2 { animation: floatY 3.5s ease-in-out infinite 1s; }
        .float-anim-3 { animation: floatY2 4.5s ease-in-out infinite 1.5s; }
        .float-anim-4 { animation: floatY 5.5s ease-in-out infinite 0.8s; }
        .float-anim-5 { animation: floatY2 4s ease-in-out infinite 2s; }

        @media (max-width: 900px) {
          .container { grid-template-columns: 1fr; gap: 60px; padding: 80px 24px 40px; }
          .right { height: 420px; }
          .photo-frame { width: 240px; height: 300px; }
        }
      `}</style>

      <section className="hero" ref={heroRef}>
        <div className="grain" />

        <div className="container">
          {/* LEFT */}
          <div className="left">
            <div className="greeting">
              <span className="greeting-wave">👋</span>
              <span className="greeting-text">Welcome to my world</span>
            </div>

            <div className="name-block">
              <div className="name-hi">Hi, I'm</div>
              <div className="name-full">Christina<br />Wanigasekara</div>
            </div>

            <div className="typing-wrap">
              <span className="typing-text">{typedText}</span>
              <span className="cursor" />
            </div>

            <div className="cta-row">
              <a href="#projects" className="btn-primary">View Projects ✦</a>
              <a href="#contact" className="btn-outline">Contact Me</a>
            </div>

            <div className="scroll-hint">
              <div className="scroll-line" />
              scroll to explore
            </div>
          </div>

          {/* RIGHT */}
          <div className="right">
            {/* Floating icons */}
            {SKILL_ICONS.map((icon, i) => (
              <div
                key={icon.label}
                className={`float-icon float-anim-${i}`}
                style={{
                  position: "absolute",
                  left: `${icon.x}%`,
                  top: `${icon.y}%`,
                  transform: `translate(
                    calc(${mouse.x * 0.3}px),
                    calc(${mouse.y * 0.3}px)
                  )`,
                  zIndex: 10,
                }}
              >
                <div className="float-icon-bubble">
                  {icon.isText ? (
                    <span className="float-icon-text-badge" style={{ color: icon.color }}>
                      {icon.icon}
                    </span>
                  ) : (
                    icon.icon
                  )}
                </div>
                <span className="float-icon-label">{icon.label}</span>
              </div>
            ))}

            {/* Photo frame */}
            <div
              className="photo-frame"
              style={{
                transform: `translate(${mouse.x * 0.05}px, ${mouse.y * 0.05}px)`,
              }}
            >
              <div className="photo-glow" />
              <div className="photo-ring" />
              <div className="photo-ring-2" />
              {PHOTOS.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`Christina ${i + 1}`}
                  className="photo-img"
                  style={{ opacity: i === photoIdx && fadePhoto ? 1 : 0 }}
                />
              ))}
              <div className="photo-dots">
                {PHOTOS.map((_, i) => (
                  <div
                    key={i}
                    className={`dot ${i === photoIdx ? "active" : ""}`}
                    onClick={() => { setPhotoIdx(i); setFadePhoto(true); }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Watermark marquee */}
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="marquee-name">
                Merrian Jethuni Christina Wanigasekara Wanniarachchige &nbsp;✦&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}