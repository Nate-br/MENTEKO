import { useState, useEffect } from 'react';

export function LogoIntro() {
  // stage 0: hooks are offscreen at far left (-100vw) and far right (+100vw)
  // stage 1: hooks sweep in smoothly from opposite sides
  // stage 2: hooks lock firmly in place (no floating!)
  // stage 3: MENTEKO wordmark reveals smoothly (clean, solid, ZERO flicker)
  // stage 4: Small transparent glossy tab emerges underneath
  const [stage, setStage] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [flowActive, setFlowActive] = useState(false);
  const [flowKey, setFlowKey] = useState(0);

  useEffect(() => {
    setStage(0);
    setFlowActive(false);

    // 1. Hooks begin sweeping in from far ends
    const t1 = setTimeout(() => {
      setStage(1);
    }, 60);

    // 2. Hooks lock firmly in place
    const t2 = setTimeout(() => {
      setStage(2);
    }, 1350);

    // 3. MENTEKO reveals cleanly and stably
    const t3 = setTimeout(() => {
      setStage(3);
    }, 1500);

    // 4. Transparent little tab emerges smoothly below MENTEKO
    const t4 = setTimeout(() => {
      setStage(4);
    }, 1800);

    // 5. Light flow sweeps across MENTEKO: once to left, and once to right after
    const t5 = setTimeout(() => {
      setFlowActive(true);
    }, 2050);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const triggerLightFlow = () => {
    setFlowActive(false);
    setTimeout(() => {
      setFlowKey((k) => k + 1);
      setFlowActive(true);
    }, 30);
  };

  return (
    <div className="relative w-full overflow-hidden py-8 sm:py-14 select-none">
      {/* Background Cyber Atmospheric Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[650px] md:w-[950px] h-[300px] sm:h-[460px] rounded-full bg-radial from-[#8f1eae]/18 via-[#b947db]/5 to-transparent blur-3xl -z-10" />

      {/* Main Arena: 3-Tier Multi-Hook Vanguard on Left & Right + Center Typography */}
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-2 sm:px-6 md:px-8">
        
        {/* ========================================================= */}
        {/* LEFT VANGUARD: COMES FROM FAR LEFT END (-100vw)           */}
        {/* ========================================================= */}
        {/* ========================================================= */}
        {/* LEFT VANGUARD: COMES FROM FAR LEFT END (-100vw)           */}
        {/* ========================================================= */}
        <div className="w-[55px] min-[400px]:w-[75px] sm:w-[220px] md:w-[300px] lg:w-[380px] xl:w-[440px] relative flex items-center justify-start shrink-0 z-10 pointer-events-none">
          
          {/* Tier 3: Far Background Micro-Echo Hook */}
          <div
            style={{
              transform:
                stage === 0
                  ? 'translateX(-120vw) scale(0.6)'
                  : 'translateX(-36px) translateY(18px) scale(0.68)',
              opacity: stage === 0 ? 0 : 0.25,
              transition: 'all 1.9s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="absolute left-0 hidden md:block"
          >
            <img
              src="/logo.png"
              alt=""
              className="h-32 sm:h-52 md:h-72 lg:h-[340px] xl:h-[400px] w-auto object-contain brightness-125 blur-[1px]"
            />
          </div>

          {/* Tier 2: Secondary Guardian Hook (Slightly behind, glowing) */}
          <div
            style={{
              transform:
                stage === 0
                  ? 'translateX(-110vw) scale(0.72)'
                  : 'translateX(-18px) translateY(8px) scale(0.84)',
              opacity: stage === 0 ? 0 : 0.5,
              transition: 'all 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="absolute left-0"
          >
            <img
              src="/logo.png"
              alt=""
              className="h-16 min-[400px]:h-22 sm:h-56 md:h-76 lg:h-[370px] xl:h-[430px] w-auto object-contain drop-shadow-[0_10px_25px_rgba(143,30,174,0.4)] brightness-110"
            />
          </div>

          {/* Tier 1: Primary Giant Front Hook — Locked firmly in place (no floating!) */}
          <div
            style={{
              transform:
                stage === 0
                  ? 'translateX(-100vw) scale(0.85)'
                  : 'translateX(0px) scale(1)',
              opacity: stage === 0 ? 0 : 1,
              transition: 'all 1.65s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="relative z-10"
          >
            <img
              src="/logo.png"
              alt="Menteko Left Primary Hook"
              className="h-20 min-[400px]:h-26 sm:h-64 md:h-80 lg:h-[400px] xl:h-[470px] 2xl:h-[510px] w-auto object-contain drop-shadow-[0_24px_50px_rgba(143,30,174,0.45)]"
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTER: CLEAN, STABLE, SOLID MENTEKO & TRANSPARENT TAB   */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-1 sm:px-4 z-20 min-w-0">
          
          {/* MENTEKO Wordmark — Rich metallic violet base + Dual light flow (left, then right after) */}
          <div
            onClick={triggerLightFlow}
            title="Click to replay light flow"
            style={{
              transform:
                stage >= 3
                  ? 'scale(1) translateY(0px)'
                  : 'scale(0.88) translateY(18px)',
              opacity: stage >= 3 ? 1 : 0,
              transition: 'all 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="group relative inline-flex items-center justify-center cursor-pointer select-none"
          >
            {/* Base Layer: Permanent, pristine metallic ultraviolet typography */}
            <h1 className="font-display text-2xl min-[380px]:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black tracking-[0.10em] min-[380px]:tracking-[0.14em] sm:tracking-[0.22em] leading-none select-none bg-gradient-to-b from-[#b83de5] via-[#8f1eae] to-[#5b0b75] bg-clip-text text-transparent filter drop-shadow-[0_4px_14px_rgba(0,0,0,0.18)] drop-shadow-[0_12px_32px_rgba(143,30,174,0.38)]">
              MENTEKO
            </h1>

            {/* Specular Light Flow Overlay: Sweeps twice (once to left, once to right after) then gracefully settles */}
            {flowActive && (
              <h1
                key={flowKey}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center select-none font-display text-2xl min-[380px]:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black tracking-[0.10em] min-[380px]:tracking-[0.14em] sm:tracking-[0.22em] leading-none animate-double-light-flow"
              >
                MENTEKO
              </h1>
            )}
          </div>

          {/* Subtitle in a SMALL, TRANSPARENT GLOSSY TAB (No flickering, discreet & elegant) */}
          <div
            style={{
              opacity: stage >= 4 ? 1 : 0,
              transform: stage >= 4 ? 'translateY(0px)' : 'translateY(12px)',
              transition: 'all 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="mt-2.5 sm:mt-4 inline-flex items-center rounded-full border border-white/50 bg-white/20 px-3 sm:px-5 py-1 sm:py-1.5 shadow-[0_2px_8px_rgba(143,30,174,0.06),inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-md"
          >
            <span className="font-mono text-[8px] min-[380px]:text-[9px] sm:text-[11px] tracking-[0.18em] min-[380px]:tracking-[0.22em] sm:tracking-[0.26em] text-[#8f1eae] font-bold uppercase">
              HUMAN CYBER RESILIENCE
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT VANGUARD: COMES FROM FAR RIGHT END (+100vw)         */}
        {/* Parent translates in world space from +100vw to 0 (right) */}
        {/* ========================================================= */}
        <div className="w-[55px] min-[400px]:w-[75px] sm:w-[220px] md:w-[300px] lg:w-[380px] xl:w-[440px] relative flex items-center justify-end shrink-0 z-10 pointer-events-none">
          
          {/* Tier 3: Far Background Micro-Echo Hook (Mirrored) */}
          <div
            style={{
              transform:
                stage === 0
                  ? 'translateX(120vw) scale(0.6)'
                  : 'translateX(36px) translateY(18px) scale(0.68)',
              opacity: stage === 0 ? 0 : 0.25,
              transition: 'all 1.9s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="absolute right-0 hidden md:block"
          >
            <img
              src="/logo.png"
              alt=""
              className="scale-x-[-1] h-32 sm:h-52 md:h-72 lg:h-[340px] xl:h-[400px] w-auto object-contain brightness-125 blur-[1px]"
            />
          </div>

          {/* Tier 2: Secondary Guardian Hook (Mirrored, slightly behind, glowing) */}
          <div
            style={{
              transform:
                stage === 0
                  ? 'translateX(110vw) scale(0.72)'
                  : 'translateX(18px) translateY(8px) scale(0.84)',
              opacity: stage === 0 ? 0 : 0.5,
              transition: 'all 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="absolute right-0"
          >
            <img
              src="/logo.png"
              alt=""
              className="scale-x-[-1] h-16 min-[400px]:h-22 sm:h-56 md:h-76 lg:h-[370px] xl:h-[430px] w-auto object-contain drop-shadow-[0_10px_25px_rgba(143,30,174,0.4)] brightness-110"
            />
          </div>

          {/* Tier 1: Primary Giant Front Hook — Comes from +100vw (the right side!) */}
          <div
            style={{
              transform:
                stage === 0
                  ? 'translateX(100vw) scale(0.85)'
                  : 'translateX(0px) scale(1)',
              opacity: stage === 0 ? 0 : 1,
              transition: 'all 1.65s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="relative z-10"
          >
            <img
              src="/logo.png"
              alt="Menteko Right Primary Hook"
              className="scale-x-[-1] h-20 min-[400px]:h-26 sm:h-64 md:h-80 lg:h-[400px] xl:h-[470px] 2xl:h-[510px] w-auto object-contain drop-shadow-[0_24px_50px_rgba(143,30,174,0.45)]"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
