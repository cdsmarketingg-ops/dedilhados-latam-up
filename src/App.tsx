/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AlertCircle, 
  CheckCircle, 
  ShieldCheck, 
  Volume2, 
  ArrowRight, 
  Timer, 
  Zap,
  Play,
  Music
} from "lucide-react";

export default function App() {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [progress, setProgress] = useState(83);
  const [showContent, setShowContent] = useState(true);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const hotmartWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Global error sanitizer to prevent circular structure errors in the preview environment
    const handleError = (event: ErrorEvent) => {
      // Prevent the error from bubbling up and causing circular structure issues in the logger
      if (event) {
        const message = event.message || (event.error && event.error.message) || "Unknown Script Error";
        console.warn("Caught global error:", String(message));
        
        // If it's a circular structure error, we definitely want to stop it here
        if (message.includes && message.includes("circular structure")) {
          event.stopImmediatePropagation();
        }
        
        event.preventDefault();
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event) {
        const reason = event.reason?.message || String(event.reason) || "Unknown Rejection";
        console.warn("Caught unhandled promise rejection:", String(reason));
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Vturb Script Integration
    const loadVturb = () => {
      const script = document.createElement("script");
      script.src = "https://scripts.converteai.net/1b23d824-f7d5-46ac-8edc-700038ffb33d/players/69d69717eeab8ff9b72c1914/v4/player.js";
      script.async = true;
      document.head.appendChild(script);
    };

    loadVturb();

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!showContent) return;

    // Use a small timeout to ensure the DOM element is rendered by React after showContent is true
    const timeoutId = setTimeout(() => {
      try {
        const funnelEl = document.getElementById('hotmart-sales-funnel');
        if (hotmartWrapperRef.current && funnelEl) {
          if (!document.getElementById('hotmart-script-loaded')) {
            const scriptLoad = document.createElement('script');
            scriptLoad.id = 'hotmart-script-loaded';
            scriptLoad.src = "https://checkout.hotmart.com/lib/hotmart-checkout-elements.js";
            scriptLoad.async = true;
            
            scriptLoad.onload = () => {
              try {
                const scriptSetup = document.createElement('script');
                scriptSetup.innerHTML = "if(window.checkoutElements) { try { const el = document.getElementById('hotmart-sales-funnel'); if(el) { checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel'); } } catch(e) { console.warn('Hotmart Setup Error:', String(e.message || e)); } }";
                document.body.appendChild(scriptSetup);
              } catch (setupErr) {
                console.warn("Hotmart script setup injection failed");
              }
            };
            
            document.body.appendChild(scriptLoad);
          } else {
            // Script already loaded, just run the setup
            const scriptSetup = document.createElement('script');
            scriptSetup.innerHTML = "if(window.checkoutElements) { try { const el = document.getElementById('hotmart-sales-funnel'); if(el) { checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel'); } } catch(e) { console.warn('Hotmart Setup Error:', String(e.message || e)); } }";
            document.body.appendChild(scriptSetup);
          }
        }
      } catch (err) {
        console.warn("Hotmart initialization block failed");
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [showContent]);


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30 overflow-x-hidden">
      {/* Top Warning Banner */}
      <div className="bg-red-600/90 backdrop-blur-md text-white py-2.5 md:py-3 px-4 text-center sticky top-0 z-50 border-b border-red-500/20">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-[10px] sm:text-xs md:text-base font-medium">
          <AlertCircle className="w-4 h-4 md:w-5 md:h-5 animate-pulse shrink-0" />
          <p className="leading-tight">
            PASO FINAL: <span className="font-bold">NO CIERRES NI ACTUALICES ESTA PÁGINA</span>. TU PEDIDO ESTÁ SIENDO PROCESADO.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-16 md:pb-24 space-y-16 md:space-y-24">
        
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center px-3 py-1 rounded-full border border-orange-500/20 mb-8 md:mb-12"
            >
              <span className="text-orange-500 font-bold tracking-[0.3em] uppercase text-[8px] md:text-[10px]">Acceso Confirmado</span>
            </motion.div>

            <h1 className="flex flex-col items-center">
              <span className="text-5xl md:text-8xl font-serif italic text-[#F5F2ED] leading-none tracking-tight">
                ¡Felicidades!
              </span>
              <div className="flex items-center gap-4 w-full max-w-[280px] md:max-w-md my-6 md:my-10">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                <span className="text-[9px] md:text-xs font-sans font-bold uppercase tracking-[0.4em] text-zinc-500 whitespace-nowrap">
                  Bienvenido al
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
              </div>
              <span className="text-[2.8rem] md:text-[10rem] font-sans font-black not-italic text-white tracking-tighter leading-[0.8] drop-shadow-[0_20px_50px_rgba(255,255,255,0.12)]">
                DICCIONARIO <br className="md:hidden" /> DE ACORDES
              </span>
            </h1>

            <p className="text-zinc-500 max-w-md mx-auto text-[11px] md:text-lg font-light leading-relaxed mt-8 md:mt-12 opacity-80">
              Mira el video de bienvenida a continuación <br className="md:hidden" /> para conocer tus próximos pasos...
            </p>
          </motion.div>

          <motion.div 
            key="vturb-player-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 orange-glow group flex items-center justify-center min-h-[300px] md:min-h-[480px]"
          >
            {/* Vturb Smart Player Container */}
            <div className="w-full" ref={playerContainerRef}>
              <div dangerouslySetInnerHTML={{ 
                __html: '<vturb-smartplayer id="vid-69d69717eeab8ff9b72c1914" style="display: block; margin: 0 auto; width: 100%; "></vturb-smartplayer>' 
              }} />
            </div>
            
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-white/10 z-10 pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold tracking-tighter uppercase">REC</span>
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm italic">
            <Volume2 className="w-4 h-4" />
            <p>Por favor, verifica que tu sonido esté activado para no perderte nada.</p>
          </div>
        </section>

        <AnimatePresence>
          {showContent && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16 md:space-y-24"
            >
              {/* Pricing & Scarcity */}
              <section className="text-center space-y-8 md:space-y-12 py-8 md:py-12">
                <div className="space-y-4">
                  <h4 className="text-lg md:text-xl text-zinc-400">Inversión única y exclusiva:</h4>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-zinc-600 line-through text-xl md:text-2xl">$97.00</span>
                    <div className="text-6xl md:text-8xl font-black tracking-tighter">
                      $14<span className="text-orange-500">.90</span>
                    </div>
                    <p className="text-orange-500 font-bold uppercase tracking-widest text-xs md:text-sm">¡Oferta de Lanzamiento!</p>
                  </div>
                </div>

                <div className="max-w-md mx-auto space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                      <span>Últimos cupos disponibles</span>
                      <span className="text-orange-500">{progress}% Completado</span>
                    </div>
                    <div className="h-3 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6 text-zinc-400">
                    <div className="flex flex-col items-center">
                      <Timer className="w-6 h-6 mb-1 text-orange-500" />
                      <span className="text-2xl font-mono font-bold text-white">{formatTime(timeLeft)}</span>
                      <span className="text-[10px] uppercase tracking-widest">Tiempo restante</span>
                    </div>
                    <div className="w-px h-12 bg-white/10" />
                    <div className="flex flex-col items-center">
                      <Zap className="w-6 h-6 mb-1 text-orange-500" />
                      <span className="text-2xl font-bold text-white">2</span>
                      <span className="text-[10px] uppercase tracking-widest">Cupos libres</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* HOTMART - Sales Funnel Widget */}
              <section className="max-w-3xl mx-auto" id="hotmart-sales-funnel-wrapper" ref={hotmartWrapperRef}>
                <div id="hotmart-sales-funnel"></div>
              </section>

              {/* Headline & Subheadline */}
              <section className="text-center space-y-4 md:space-y-6 max-w-4xl mx-auto px-2">
                <h2 className="text-2xl md:text-5xl font-bold leading-tight">
                  ¿Você já sabe os acordes… mas ainda não soa profissional no teclado?
                </h2>
                <p className="text-lg md:text-2xl text-zinc-400 font-light leading-relaxed">
                  Descubra como transformar acordes simples em um som bonito e envolvente usando dedilhados e arpejos prontos.
                </p>
              </section>

              {/* Product Showcase & Objection Handling */}
              <section className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative bg-[#0a0a0a] rounded-3xl border border-white/5 overflow-hidden">
                    <img 
                      src="https://eliabcamposteclas.com/wp-content/uploads/2026/04/ChatGPT-Image-8-de-abr.-de-2026-11_34_22.jpg" 
                      alt="Dedilhados e Arpejos" 
                      className="w-full h-auto object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold uppercase tracking-widest text-orange-500">O que você vai receber:</h3>
                    <ul className="space-y-4">
                      {[
                        "Padrões de dedilhados prontos pra usar",
                        "Arpejos simples que já soam profissionais",
                        "Aplicação prática nos acordes que você já aprendeu",
                        "Combinações que deixam sua música muito mais bonita"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-zinc-300">
                          <div className="mt-1 bg-orange-500/20 p-1 rounded">
                            <CheckCircle className="w-4 h-4 text-orange-500" />
                          </div>
                          <span className="text-lg">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4 bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Sin barreiras:</h3>
                    <ul className="space-y-2">
                      {[
                        "Mesmo que você seja iniciante",
                        "Mesmo que ainda toque travado",
                        "Mesmo que nunca tenha usado dedilhados"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                          <ArrowRight className="w-3 h-3 text-orange-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Bonus Section */}
              <section className="bg-gradient-to-b from-orange-500/10 to-transparent p-6 md:p-16 rounded-3xl md:rounded-[3rem] border border-orange-500/20 text-center space-y-8 md:space-y-12">
                <div className="space-y-4">
                  <span className="bg-orange-500 text-white text-[10px] md:text-xs font-black px-4 py-1 rounded-full uppercase tracking-tighter">Regalo Exclusivo</span>
                  <h2 className="text-3xl md:text-5xl font-bold">Bônus Especiais</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  {[
                    { title: "PDF com padrões prontos", desc: "Todo el material de apoyo para que no te pierdas ningún detalle." },
                    { title: "Guia rápido por tonalidade", desc: "Encuentra el dedilhado perfeito para qualquer música ao instante." }
                  ].map((bonus, i) => (
                    <div key={i} className="bg-black/40 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 text-left space-y-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <Music className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold">{bonus.title}</h3>
                      <p className="text-zinc-500 text-xs md:text-sm leading-relaxed">{bonus.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Urgency & Guarantee */}
              <section className="space-y-12 md:space-y-16">
                <div className="bg-red-600/10 border border-red-600/20 p-6 md:p-8 rounded-2xl md:rounded-3xl text-center space-y-4">
                  <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-red-600 mx-auto" />
                  <h3 className="text-lg md:text-2xl font-bold text-red-500 uppercase tracking-tighter">¡Atención!</h3>
                  <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto">
                    Essa oferta é exclusiva dessa página e não estará disponível novamente. Aproveita agora essa oportunidade única de elevar seu nível musical.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                  <div className="relative group max-w-xs mx-auto md:max-w-none">
                    <img 
                      src="https://i.ibb.co/kgGkcHHy/Chat-GPT-Image-23-de-mar-de-2026-23-27-43.png" 
                      alt="Garantía" 
                      className="rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-orange-500 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-2xl shadow-orange-500/40">
                      <ShieldCheck className="w-8 h-8 md:w-12 md:h-12 text-white" />
                    </div>
                  </div>
                  <div className="space-y-4 md:space-y-6 text-center md:text-left">
                    <h2 className="text-2xl md:text-4xl font-serif italic">Garantía 100% <br /> <span className="not-italic font-sans font-bold">Libre de Riesgo</span></h2>
                    <p className="text-zinc-400 leading-relaxed text-base md:text-lg">
                      Prueba el Pack de Dedilhados y Arpejos durante 30 días y si por alguna razón sientes que no es para ti, te devolveremos el 100% de lo que invertiste.
                    </p>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>


      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-600 text-sm">
          <p>© 2026 Eliab Campos Teclas. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
