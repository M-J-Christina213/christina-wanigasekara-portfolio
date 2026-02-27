import { useState, useEffect, useRef } from "react";
import photo1 from "../../assets/images/photo1.png";
import photo2 from "../../assets/images/photo2.jpeg";
import photo3 from "../../assets/images/photo3.jpeg";

/* ─── Typing Hook ─────────────────────────────────────────── */
const TEXTS = [
  "I build meaningful web experiences.",
  "I craft beautiful mobile apps.",
  "I design with heart & purpose.",
  "I turn ideas into digital reality.",
];
function useTyping(texts, speed = 65, pause = 2200) {
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState("typing");
  const [tIdx, setTIdx] = useState(0);
  const [cIdx, setCIdx] = useState(0);
  useEffect(() => {
    const cur = texts[tIdx];
    let t;
    if (phase === "typing") {
      if (cIdx < cur.length) { t = setTimeout(() => { setDisplay(cur.slice(0, cIdx + 1)); setCIdx(c => c + 1); }, speed); }
      else { t = setTimeout(() => setPhase("del"), pause); }
    } else {
      if (cIdx > 0) { t = setTimeout(() => { setDisplay(cur.slice(0, cIdx - 1)); setCIdx(c => c - 1); }, speed / 2); }
      else { setTIdx(i => (i + 1) % texts.length); setPhase("typing"); }
    }
    return () => clearTimeout(t);
  }, [cIdx, phase, tIdx]);
  return display;
}

/* ─── Skill Icons ─────────────────────────────────────────── */
const ICONS = [
  { label: "React",    emoji: "⚛️",  ox: -148, oy: -110, fa: 0 },
  { label: "Flutter",  emoji: "🐦",  ox:  152, oy:  -95, fa: 1 },
  { label: "Figma",    emoji: "🎨",  ox: -158, oy:   65, fa: 2 },
  { label: "Firebase", emoji: "🔥",  ox:  158, oy:   80, fa: 3 },
  { label: "JS",       text: "JS",  color: "#F7DF1E", ox: -75, oy: 160, fa: 4 },
  { label: "API",      text: "API", color: "#61DAFB", ox:  85, oy: 155, fa: 5 },
];

/* ─── Photos ──────────────────────────────────────────────── */
const PHOTOS = [
  photo1, photo2, photo3
];

/* ─── 3D Sphere Canvas ────────────────────────────────────── */
function Sphere3D({ mxRef, myRef, scrollRef }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const S = 360; canvas.width = S; canvas.height = S;
    const cx = S/2, cy = S/2, r = 138;
    const N = 300;
    const pts = Array.from({length:N},(_,i)=>{
      const phi = Math.acos(-1+(2*i)/N);
      const th  = Math.sqrt(N*Math.PI)*phi;
      return {phi, th};
    });
    function rot(x,y,z,rx,ry){
      let nx=x*Math.cos(ry)+z*Math.sin(ry), nz=-x*Math.sin(ry)+z*Math.cos(ry);
      let ny=y*Math.cos(rx)-nz*Math.sin(rx); nz=y*Math.sin(rx)+nz*Math.cos(rx);
      return [nx,ny,nz];
    }
    function proj(x,y,z){ const fov=600,zz=z+fov; return {x:x*fov/zz+cx,y:y*fov/zz+cy,z}; }
    let raf;
    function draw(t){
      ctx.clearRect(0,0,S,S);
      const ry=t*0.0007+(mxRef.current||0)*0.014;
      const rx=Math.sin(t*0.0003)*0.3+(myRef.current||0)*0.009+((scrollRef.current||0)/900)*0.5;
      const projected = pts.map(({phi,th})=>{
        let x=r*Math.sin(phi)*Math.cos(th), y=r*Math.cos(phi), z=r*Math.sin(phi)*Math.sin(th);
        [x,y,z]=rot(x,y,z,rx,ry);
        return proj(x,y,z);
      });
      // connection lines
      for(let i=0;i<projected.length;i++){
        for(let j=i+1;j<projected.length;j++){
          const a=projected[i],b=projected[j];
          const d=Math.hypot(a.x-b.x,a.y-b.y);
          if(d<26){
            const alpha=((a.z+b.z)/(4*r)+0.5)*0.28;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
            ctx.strokeStyle=`rgba(170,130,255,${alpha})`; ctx.lineWidth=0.5; ctx.stroke();
          }
        }
      }
      // dots
      projected.forEach(({x,y,z})=>{
        const d=(z+r)/(2*r);
        const sz=1.4+d*2.8, alpha=0.12+d*0.7;
        const g=ctx.createRadialGradient(x,y,0,x,y,sz*2.5);
        g.addColorStop(0,`rgba(215,175,255,${alpha})`);
        g.addColorStop(0.5,`rgba(160,120,255,${alpha*0.6})`);
        g.addColorStop(1,`rgba(100,80,200,0)`);
        ctx.beginPath(); ctx.arc(x,y,sz,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      });
      // center glow
      const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,r*0.65);
      cg.addColorStop(0,"rgba(180,130,255,0.05)"); cg.addColorStop(1,"rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(cx,cy,r*0.65,0,Math.PI*2); ctx.fillStyle=cg; ctx.fill();
      raf=requestAnimationFrame(draw);
    }
    raf=requestAnimationFrame(draw);
    return ()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={canvasRef} style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>;
}

/* ─── Cursor Trail ────────────────────────────────────────── */
function CursorTrail(){
  const cvRef=useRef(null);
  useEffect(()=>{
    const cv=cvRef.current; const ctx=cv.getContext("2d");
    let trail=[], raf;
    const resize=()=>{ cv.width=window.innerWidth; cv.height=window.innerHeight; };
    resize(); window.addEventListener("resize",resize);
    const onMove=(e)=>{ trail.push({x:e.clientX,y:e.clientY,l:1}); if(trail.length>32) trail.shift(); };
    window.addEventListener("mousemove",onMove);
    function draw(){
      ctx.clearRect(0,0,cv.width,cv.height);
      trail=trail.filter(p=>p.l>0.015);
      trail.forEach(p=>{
        ctx.beginPath(); ctx.arc(p.x,p.y,p.l*7,0,Math.PI*2);
        ctx.fillStyle=`rgba(180,138,255,${p.l*0.45})`; ctx.fill();
        p.l*=0.87;
      });
      raf=requestAnimationFrame(draw);
    }
    draw();
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("mousemove",onMove); window.removeEventListener("resize",resize); };
  },[]);
  return <canvas ref={cvRef} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}}/>;
}

/* ─── Laptop SVG ──────────────────────────────────────────── */
function Laptop(){
  return(
    <svg width="170" height="118" viewBox="0 0 170 118" fill="none">
      <rect x="8" y="4" width="154" height="96" rx="9" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
      <rect x="16" y="12" width="138" height="82" rx="6" fill="rgba(130,90,255,0.07)"/>
      <rect x="28" y="24" width="65" height="5" rx="2.5" fill="rgba(190,155,255,0.22)"/>
      <rect x="28" y="35" width="100" height="3" rx="1.5" fill="rgba(255,255,255,0.09)"/>
      <rect x="28" y="43" width="80" height="3" rx="1.5" fill="rgba(255,255,255,0.07)"/>
      <rect x="28" y="56" width="54" height="18" rx="5" fill="rgba(130,90,255,0.18)" stroke="rgba(160,120,255,0.28)" strokeWidth="1"/>
      <rect x="90" y="56" width="44" height="18" rx="5" fill="rgba(80,200,255,0.1)" stroke="rgba(80,200,255,0.22)" strokeWidth="1"/>
      <circle cx="85" cy="8" r="2.2" fill="rgba(255,255,255,0.18)"/>
      <path d="M0 104 Q3 100 12 100 L158 100 Q167 100 170 104 L164 110 Q162 114 85 114 Q8 114 6 110Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <rect x="64" y="103" width="42" height="5" rx="2.5" fill="rgba(255,255,255,0.07)"/>
    </svg>
  );
}

/* ─── Phone SVG ───────────────────────────────────────────── */
function Phone(){
  return(
    <svg width="62" height="118" viewBox="0 0 62 118" fill="none">
      <rect x="2" y="2" width="58" height="114" rx="13" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
      <rect x="8" y="16" width="46" height="82" rx="7" fill="rgba(130,90,255,0.07)"/>
      <rect x="16" y="26" width="30" height="4" rx="2" fill="rgba(190,155,255,0.25)"/>
      <rect x="16" y="36" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.09)"/>
      <rect x="16" y="44" width="22" height="3" rx="1.5" fill="rgba(255,255,255,0.07)"/>
      <rect x="16" y="56" width="30" height="22" rx="5" fill="rgba(130,90,255,0.14)" stroke="rgba(160,120,255,0.2)" strokeWidth="1"/>
      <rect x="22" y="5" width="18" height="6" rx="3" fill="rgba(0,0,0,0.45)"/>
      <rect x="22" y="106" width="18" height="4" rx="2" fill="rgba(255,255,255,0.18)"/>
    </svg>
  );
}

/* ─── Main ────────────────────────────────────────────────── */
export default function HeroSection(){
  const [photoIdx,setPhotoIdx]=useState(0);
  const [fadePhoto,setFadePhoto]=useState(true);
  const mxRef=useRef(0), myRef=useRef(0), scrollRef=useRef(0);
  const [tick,setTick]=useState(0);
  const heroRef=useRef(null);
  const typed=useTyping(TEXTS);

  useEffect(()=>{
    const iv=setInterval(()=>{ setFadePhoto(false); setTimeout(()=>{setPhotoIdx(i=>(i+1)%PHOTOS.length);setFadePhoto(true);},500); },4200);
    return ()=>clearInterval(iv);
  },[]);

  useEffect(()=>{
    const onMove=(e)=>{
      const rect=heroRef.current?.getBoundingClientRect(); if(!rect) return;
      mxRef.current=((e.clientX-rect.left)/rect.width-0.5)*2;
      myRef.current=((e.clientY-rect.top)/rect.height-0.5)*2;
      setTick(n=>n+1);
    };
    const onScroll=()=>{ scrollRef.current=window.scrollY; setTick(n=>n+1); };
    window.addEventListener("mousemove",onMove);
    window.addEventListener("scroll",onScroll);
    return ()=>{ window.removeEventListener("mousemove",onMove); window.removeEventListener("scroll",onScroll); };
  },[]);

  const px=(s)=>({ transform:`translate(${mxRef.current*s}px,${myRef.current*s}px)`, transition:"transform 0.18s ease" });
  const scrollFade=Math.max(0,1-scrollRef.current/600);
  const scrollY=scrollRef.current*0.22;

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#0e0e18;
          --bg2:#13131e;
          --surface:rgba(255,255,255,0.04);
          --border:rgba(255,255,255,0.07);
          --text:rgba(255,255,255,0.9);
          --muted:rgba(255,255,255,0.38);
          --accent:#b48aff;
          --accent2:#7dd3fc;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;overflow-x:hidden}

        /* HEADER */
        .hdr{
          position:fixed;top:0;left:0;right:0;z-index:200;
          padding:18px 60px;
          display:flex;align-items:center;justify-content:space-between;
          backdrop-filter:blur(20px);
          background:rgba(14,14,24,0.65);
          border-bottom:1px solid var(--border);
        }
        .logo{font-family:'Playfair Display',serif;font-size:1.25rem;color:var(--text);letter-spacing:0.04em}
        .logo em{color:var(--accent);font-style:normal}
        nav a{color:var(--muted);text-decoration:none;font-size:0.8rem;letter-spacing:0.12em;text-transform:uppercase;margin-left:32px;transition:color 0.2s}
        nav a:hover{color:var(--text)}

        /* HERO */
        .hero{
          min-height:100vh;display:flex;align-items:center;
          position:relative;overflow:hidden;padding-top:90px;
        }
        .blob1{position:absolute;width:700px;height:700px;border-radius:50%;
          background:radial-gradient(circle,rgba(140,90,255,0.08) 0%,transparent 68%);
          top:-150px;right:-80px;pointer-events:none}
        .blob2{position:absolute;width:500px;height:500px;border-radius:50%;
          background:radial-gradient(circle,rgba(80,190,255,0.05) 0%,transparent 68%);
          bottom:-80px;left:40px;pointer-events:none}
        .gridlines{
          position:absolute;inset:0;pointer-events:none;
          background-image:
            repeating-linear-gradient(0deg,rgba(255,255,255,0.014) 0,rgba(255,255,255,0.014) 1px,transparent 1px,transparent 80px),
            repeating-linear-gradient(90deg,rgba(255,255,255,0.012) 0,rgba(255,255,255,0.012) 1px,transparent 1px,transparent 100px);
        }

        .wrap{
          max-width:1240px;margin:0 auto;padding:0 60px;
          display:grid;grid-template-columns:1fr 1fr;gap:60px;
          align-items:center;position:relative;z-index:2;width:100%;
        }

        /* LEFT */
        .left{display:flex;flex-direction:column;gap:26px}
        .badge{
          display:inline-flex;align-items:center;gap:8px;padding:6px 16px;
          background:rgba(180,138,255,0.07);border:1px solid rgba(180,138,255,0.18);
          border-radius:100px;width:fit-content;
          opacity:0;animation:riseIn 0.7s ease 0.1s forwards;
        }
        .bdot{width:6px;height:6px;border-radius:50%;background:var(--accent);
          box-shadow:0 0 8px var(--accent);animation:pulse 2s infinite}
        .btxt{font-size:0.73rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(180,138,255,0.85)}

        .greeting{opacity:0;animation:riseIn 0.7s ease 0.25s forwards}
        .hi-line{font-size:1rem;color:var(--muted);font-weight:300;margin-bottom:8px}
        .name-big{
          font-family:'Playfair Display',serif;
          font-size:clamp(2.8rem,5vw,5rem);
          line-height:1.08;font-weight:900;letter-spacing:-0.02em;color:var(--text);
        }
        .name-big em{
          font-style:normal;
          background:linear-gradient(135deg,#c084fc,#818cf8,#38bdf8);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }

        .typing-wrap{min-height:28px;opacity:0;animation:riseIn 0.7s ease 0.4s forwards}
        .typing-text{font-size:1rem;color:var(--muted);font-style:italic;font-family:'Playfair Display',serif;font-weight:400}
        .cblink{display:inline-block;width:2px;height:1em;background:var(--accent);
          margin-left:2px;vertical-align:middle;animation:blink 1s step-end infinite}

        .cta{display:flex;gap:14px;opacity:0;animation:riseIn 0.7s ease 0.55s forwards}
        .btnf{
          padding:13px 28px;
          background:linear-gradient(135deg,#b48aff,#7c3aed);
          color:#fff;border:none;cursor:pointer;
          font-family:'Outfit',sans-serif;font-size:0.86rem;font-weight:500;
          border-radius:100px;letter-spacing:0.04em;text-decoration:none;
          transition:all 0.25s;box-shadow:0 4px 22px rgba(180,138,255,0.22);
        }
        .btnf:hover{transform:translateY(-2px);box-shadow:0 8px 34px rgba(180,138,255,0.38)}
        .btng{
          padding:13px 28px;background:transparent;
          color:var(--muted);border:1px solid var(--border);cursor:pointer;
          font-family:'Outfit',sans-serif;font-size:0.86rem;font-weight:400;
          border-radius:100px;letter-spacing:0.04em;text-decoration:none;transition:all 0.25s;
        }
        .btng:hover{border-color:rgba(180,138,255,0.4);color:var(--text);background:rgba(180,138,255,0.06)}

        .stats{display:flex;gap:28px;opacity:0;animation:riseIn 0.7s ease 0.7s forwards}
        .snum{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:var(--text);line-height:1}
        .slbl{font-size:0.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-top:3px}
        .sdiv{width:1px;background:var(--border);align-self:stretch}

        /* RIGHT */
        .right{
          position:relative;height:580px;
          display:flex;align-items:center;justify-content:center;
          opacity:0;animation:fadeIn 1s ease 0.3s forwards;
        }
        .sphere-holder{
          position:absolute;top:50%;left:50%;
          transform:translate(-50%,-50%);
          width:360px;height:360px;pointer-events:none;
        }

        /* photo */
        .photo-wrap{position:absolute;width:240px;height:300px;z-index:4}
        .pimg{
          width:100%;height:100%;object-fit:cover;position:absolute;
          border-radius:38% 62% 52% 48% / 46% 44% 56% 54%;
          transition:opacity 0.6s ease;
          box-shadow:0 24px 60px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.05);
          animation:blobMorph 10s ease-in-out infinite;
        }
        @keyframes blobMorph{
          0%,100%{border-radius:38% 62% 52% 48% / 46% 44% 56% 54%}
          33%{border-radius:55% 45% 40% 60% / 56% 42% 58% 44%}
          66%{border-radius:44% 56% 60% 40% / 40% 60% 40% 60%}
        }
        .pring{
          position:absolute;inset:-18px;border-radius:50%;
          border:1px solid rgba(180,138,255,0.16);
          animation:spinSlow 22s linear infinite;
        }
        .pring::after{
          content:'';position:absolute;width:8px;height:8px;border-radius:50%;
          background:var(--accent);top:14px;left:50%;transform:translateX(-50%);
          box-shadow:0 0 14px 4px rgba(180,138,255,0.55);
        }

        /* icons */
        .sicon{position:absolute;z-index:6;display:flex;flex-direction:column;align-items:center;gap:4px}
        .sbubble{
          width:50px;height:50px;
          background:rgba(255,255,255,0.035);
          backdrop-filter:blur(14px);
          border:1px solid rgba(255,255,255,0.09);
          border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;
          box-shadow:0 8px 28px rgba(0,0,0,0.32);cursor:default;
          transition:transform 0.2s,border-color 0.2s,box-shadow 0.2s;
        }
        .sbubble:hover{transform:scale(1.16) translateY(-4px);border-color:rgba(180,138,255,0.38);box-shadow:0 16px 38px rgba(180,138,255,0.16)}
        .slabel{font-size:0.59rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em}

        /* devices */
        .dev{position:absolute;z-index:3}

        /* dots */
        .pdots{position:absolute;bottom:-36px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:7}
        .pdot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.16);cursor:pointer;transition:all 0.3s}
        .pdot.on{background:var(--accent);width:20px;border-radius:3px;box-shadow:0 0 8px rgba(180,138,255,0.5)}

        /* MARQUEE SECTION */
        .mq-section{
          width:100%;overflow:hidden;
          padding:30px 0;
          background:var(--bg2);
          border-top:1px solid var(--border);
          border-bottom:1px solid var(--border);
          position:relative;z-index:10;
        }
        .mq-track{display:flex;white-space:nowrap;animation:mqScroll 30s linear infinite}
        .mq-item{display:flex;align-items:center;gap:36px;padding:0 36px;flex-shrink:0}
        .mq-plain{
          font-family:'Playfair Display',serif;
          font-size:clamp(1.5rem,3vw,2.6rem);
          font-weight:400;color:rgba(255,255,255,0.055);
          letter-spacing:0.18em;text-transform:uppercase;user-select:none;
          transition:color 0.3s;
        }
        .mq-section:hover .mq-plain{color:rgba(255,255,255,0.1)}
        .mq-hl{
          font-family:'Playfair Display',serif;
          font-size:clamp(1.5rem,3vw,2.6rem);
          font-weight:700;user-select:none;
          background:linear-gradient(90deg,rgba(180,138,255,0.7),rgba(125,211,252,0.6),rgba(244,114,182,0.55),rgba(180,138,255,0.7));
          background-size:250%;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          animation:shimmer 7s linear infinite;
          letter-spacing:0.12em;text-transform:uppercase;
        }
        .mq-sep{font-size:1rem;color:rgba(180,138,255,0.28);flex-shrink:0}

        /* KEYFRAMES */
        @keyframes riseIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulse{0%,100%{box-shadow:0 0 7px var(--accent)}50%{box-shadow:0 0 16px var(--accent)}}
        @keyframes spinSlow{to{transform:rotate(360deg)}}
        @keyframes shimmer{from{background-position:0% center}to{background-position:250% center}}
        @keyframes mqScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes floatA{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-14px) rotate(4deg)}}
        @keyframes floatB{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-18px) rotate(-3deg)}}
        @keyframes floatC{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-10px) rotate(2deg)}}
        @keyframes devLaptop{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-10px) rotate(-2deg)}}
        @keyframes devPhone{0%,100%{transform:translateY(0) rotate(6deg)}50%{transform:translateY(-12px) rotate(3deg)}}
        .fa0{animation:floatA 4.5s ease-in-out infinite}
        .fa1{animation:floatB 5.5s ease-in-out infinite 0.6s}
        .fa2{animation:floatA 3.8s ease-in-out infinite 1.2s}
        .fa3{animation:floatB 6s ease-in-out infinite 0.3s}
        .fa4{animation:floatC 4.2s ease-in-out infinite 1.8s}
        .fa5{animation:floatC 5s ease-in-out infinite 2.2s}

        @media(max-width:900px){
          .wrap{grid-template-columns:1fr;gap:50px;padding:60px 24px}
          .right{height:440px}
          .hdr{padding:16px 24px}
          nav a{margin-left:16px}
        }
      `}</style>

      <CursorTrail/>

      {/* Header */}
      <header className="hdr">
        <div className="logo">C<em>.</em>W</div>
        <nav>
          {["Home","About","Projects","Design","Contact"].map(n=>(
            <a key={n} href={`#${n.toLowerCase()}`}>{n}</a>
          ))}
        </nav>
      </header>

      {/* Hero */}
      <section
        className="hero" id="home" ref={heroRef}
        style={{opacity:scrollFade, transform:`translateY(${scrollY}px)`}}
      >
        <div className="blob1"/><div className="blob2"/><div className="gridlines"/>

        <div className="wrap">
          {/* LEFT */}
          <div className="left">
            <div className="badge"><div className="bdot"/><span className="btxt">Available for projects</span></div>

            <div className="greeting">
              <div className="hi-line">Hi there 👋</div>
              <h1 className="name-big">
                I'm <em>Christina</em><br/>Wanigasekara
              </h1>
            </div>

            <div className="typing-wrap">
              <span className="typing-text">{typed}</span>
              <span className="cblink"/>
            </div>

            <div className="cta">
              <a href="#projects" className="btnf">View Projects ✦</a>
              <a href="#contact" className="btng">Contact Me</a>
            </div>

            <div className="stats">
              <div><div className="snum">20+</div><div className="slbl">Projects</div></div>
              <div className="sdiv"/>
              <div><div className="snum">3+</div><div className="slbl">Years Exp.</div></div>
              <div className="sdiv"/>
              <div><div className="snum">5</div><div className="slbl">Tech Stacks</div></div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="right">
            {/* 3D Sphere */}
            <div className="sphere-holder">
              <Sphere3D mxRef={mxRef} myRef={myRef} scrollRef={scrollRef}/>
            </div>

            {/* Laptop */}
            <div className="dev" style={{top:"4%",left:"-6%",animation:"devLaptop 6s ease-in-out infinite",...px(10)}}>
              <div style={{opacity:0.6}}><Laptop/></div>
            </div>

            {/* Phone */}
            <div className="dev" style={{bottom:"6%",right:"-2%",animation:"devPhone 5s ease-in-out infinite 1.2s",...px(8)}}>
              <div style={{opacity:0.6}}><Phone/></div>
            </div>

            {/* Skill icons */}
            {ICONS.map((icon,i)=>(
              <div
                key={icon.label}
                className={`sicon fa${icon.fa}`}
                style={{
                  left:`calc(50% + ${icon.ox}px)`,
                  top:`calc(50% + ${icon.oy}px)`,
                  transform:`translate(-50%,-50%) translate(${mxRef.current*(5+i)}px,${myRef.current*(3+i*0.6)}px)`,
                  transition:"transform 0.18s ease",
                }}
              >
                <div className="sbubble">
                  {icon.text
                    ? <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:"0.76rem",color:icon.color}}>{icon.text}</span>
                    : icon.emoji}
                </div>
                <span className="slabel">{icon.label}</span>
              </div>
            ))}

            {/* Photo */}
            <div className="photo-wrap" style={{transform:`translate(${mxRef.current*6}px,${myRef.current*4}px)`,transition:"transform 0.15s ease"}}>
              <div className="pring"/>
              {PHOTOS.map((src,i)=>(
                <img key={src} src={src} alt={`Christina ${i}`} className="pimg"
                  style={{opacity:i===photoIdx&&fadePhoto?1:0}}/>
              ))}
              <div className="pdots">
                {PHOTOS.map((_,i)=>(
                  <div key={i} className={`pdot ${i===photoIdx?"on":""}`}
                    onClick={()=>{setPhotoIdx(i);setFadePhoto(true)}}/>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Full Name Marquee ───────────────────────────────── */}
      <div className="mq-section">
        <div className="mq-track">
          {[...Array(6)].map((_,i)=>(
            <div key={i} className="mq-item">
              <span className="mq-plain">Merrian Jethuni</span>
              <span className="mq-sep">✦</span>
              <span className="mq-hl">Christina Wanigasekara</span>
              <span className="mq-sep">✦</span>
              <span className="mq-plain">Wanniarachchige</span>
              <span className="mq-sep">◆</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
