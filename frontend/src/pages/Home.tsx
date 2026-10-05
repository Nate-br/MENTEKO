import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { LogoIntro } from '@/components/ui/LogoIntro';
import { CyberBackground } from '@/components/ui/CyberBackground';
import { MailWarning, UserX, Banknote, ArrowRight, ChevronDown } from 'lucide-react';

const problems = [
  {
    icon: MailWarning,
    title: 'Phishing',
    description: 'Fake messages designed to make users click, disclose information, or authenticate.',
  },
  {
    icon: UserX,
    title: 'Impersonation',
    description: 'Attackers abuse trusted identities and organizations.',
  },
  {
    icon: Banknote,
    title: 'Digital Fraud',
    description: 'Fake payments, requests, transaction evidence, and social engineering.',
  },
];

const process = [
  { step: 'Educate', description: 'Learn the signals and psychology behind common fraud patterns.' },
  { step: 'Simulate', description: 'Face a realistic, controlled version of the situation.' },
  { step: 'Decide', description: 'Make a real decision, under the same pressure attackers rely on.' },
  { step: 'Explain', description: 'See exactly which indicators mattered and why.' },
  { step: 'Assess', description: 'Track resilience across categories, not just a single score.' },
  { step: 'Improve', description: 'Return to the categories that need the most practice.' },
];

export function Home() {
  const missionRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [missionVisible, setMissionVisible] = useState(false);
  const [processVisible, setProcessVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === missionRef.current) setMissionVisible(true);
          if (entry.target === processRef.current) setProcessVisible(true);
          if (entry.target === ctaRef.current) setCtaVisible(true);
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    if (missionRef.current) observer.observe(missionRef.current);
    if (processRef.current) observer.observe(processRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* 1. Hero: Pure MENTEKO Hook Intro Screen */}
      <section className="relative isolate min-h-[82vh] flex flex-col justify-center items-center overflow-x-clip">
        {/* Interactive Cyber Defense Mesh Background */}
        <CyberBackground />

        <div className="relative z-10 w-full">
          <LogoIntro />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-xs font-mono text-muted/70 animate-bounce pointer-events-none select-none">
          <span>Scroll to explore</span>
          <ChevronDown size={14} className="text-cyan" />
        </div>
      </section>

      {/* 2. Mission Section: STOP WARNING AND START TRAINING EMPLOYEES (Scroll-Triggered Animated Intro) */}
      <section
        ref={missionRef}
        className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:py-24 sm:px-6 lg:px-8 text-center"
      >
        {/* Kicker & Main Headline */}
        <div
          style={{
            transform: missionVisible ? 'translateY(0)' : 'translateY(28px)',
            opacity: missionVisible ? 1 : 0,
            transition: 'all 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.05s',
          }}
        >
          <p className="font-mono text-xs tracking-wide text-cyan uppercase">
            CYBERSECURITY AWARENESS PLATFORM
          </p>

          <h2 className="mt-4 text-2xl min-[400px]:text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-text leading-[1.12] sm:leading-[1.08] max-w-4xl mx-auto">
            STOP WARNING AND
            <br />
            <span className="bg-gradient-to-r from-[#8f1eae] via-[#b947db] to-[#6d1385] bg-clip-text text-transparent">
              START TRAINING EMPLOYEES.
            </span>
          </h2>
        </div>

        {/* Subtitle */}
        <div
          style={{
            transform: missionVisible ? 'translateY(0)' : 'translateY(20px)',
            opacity: missionVisible ? 1 : 0,
            transition: 'all 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted">
            MENTEKO helps users recognize, verify, and respond safely to phishing, impersonation,
            social engineering and digital fraud before they become victims.
          </p>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            transform: missionVisible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.96)',
            opacity: missionVisible ? 1 : 0,
            transition: 'all 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.32s',
          }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button as="link" to="/simulate" variant="primary" size="lg" className="w-full sm:w-auto shadow-[0_8px_24px_rgba(143,30,174,0.3)]">
            Start Training <ArrowRight size={16} />
          </Button>
          <Button as="link" to="/learn" variant="secondary" size="lg" className="w-full sm:w-auto">
            Explore How It Works
          </Button>
        </div>

        {/* Problems Grid — Staggered Card Entrance */}
        <div className="mt-20 grid gap-6 sm:grid-cols-3 text-left">
          {problems.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              style={{
                transform: missionVisible ? 'translateY(0)' : 'translateY(32px)',
                opacity: missionVisible ? 1 : 0,
                transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.45 + i * 0.12}s`,
              }}
            >
              <Panel padding="lg" className="h-full">
                <Icon className="text-cyan" size={22} strokeWidth={1.75} />
                <h3 className="mt-4 text-base font-semibold text-text">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
              </Panel>
            </div>
          ))}
        </div>

        {/* Closing Quote Banner */}
        <div
          style={{
            transform: missionVisible ? 'translateY(0)' : 'translateY(20px)',
            opacity: missionVisible ? 1 : 0,
            transition: 'all 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.75s',
          }}
          className="mt-16 border-t border-line pt-16 text-center"
        >
          <p className="mx-auto max-w-2xl text-2xl font-medium leading-snug text-text sm:text-3xl">
            The problem isn't always a technical vulnerability.
            <br />
            <span className="text-cyan">Sometimes it's a decision.</span>
          </p>
        </div>
      </section>

      {/* 3. Process Section: The MENTEKO learning loop (Scroll-Triggered Animated Intro) */}
      <section
        ref={processRef}
        className="border-t border-line bg-gradient-to-b from-transparent via-[#8f1eae]/[0.02] to-transparent"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20 sm:px-6 lg:px-8">
          <div
            style={{
              transform: processVisible ? 'translateY(0)' : 'translateY(24px)',
              opacity: processVisible ? 1 : 0,
              transition: 'all 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.05s',
            }}
          >
            <p className="font-mono text-xs tracking-wide text-cyan">METHODOLOGY</p>
            <h2 className="mt-2 text-2xl font-semibold text-text sm:text-3xl">The MENTEKO learning loop</h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {process.map(({ step, description }, i) => (
              <div
                key={step}
                style={{
                  transform: processVisible ? 'translateY(0)' : 'translateY(30px)',
                  opacity: processVisible ? 1 : 0,
                  transition: `all 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.08}s`,
                }}
                className="glossy-panel group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/40 hover:shadow-[0_20px_40px_-10px_rgba(143,30,174,0.15)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-cyan">
                    STEP {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-cyan/20 transition-colors group-hover:bg-cyan" />
                </div>
                <h3 className="mt-3 text-base font-semibold text-text">{step}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Final CTA Section (Scroll-Triggered Animated Intro — Up to the End) */}
      <section
        ref={ctaRef}
        style={{
          transform: ctaVisible ? 'translateY(0)' : 'translateY(28px)',
          opacity: ctaVisible ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
        }}
        className="mx-auto max-w-7xl px-4 py-16 sm:py-24 text-center sm:px-6 lg:px-8"
      >
        <h2 className="text-3xl font-semibold text-text sm:text-4xl">Start your training</h2>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Five realistic scenarios. Real decisions. No pressure that isn't part of the lesson.
        </p>
        <div className="mt-8 flex justify-center">
          <Button as="link" to="/simulate" variant="primary" size="lg" className="shadow-[0_8px_24px_rgba(143,30,174,0.3)]">
            Start Training <ArrowRight size={16} />
          </Button>
        </div>
        <p className="mt-6">
          <Link to="/about" className="text-sm text-muted hover:text-cyan">
            Learn about the team behind MENTEKO →
          </Link>
        </p>
      </section>
    </div>
  );
}
