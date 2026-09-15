import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Terminal, TerminalLine, TerminalCursor } from '@/components/ui/Terminal';
import { MailWarning, UserX, Banknote, ArrowRight } from 'lucide-react';

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
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="bg-grid bg-grid-fade absolute inset-0 opacity-40" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
          <div>
            <p className="font-mono text-xs tracking-wide text-cyan">CYBERSECURITY AWARENESS PLATFORM</p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.1] text-text sm:text-5xl lg:text-6xl">
              Don't just warn people.
              <br />
              Train them to recognize the moment.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
              MENTEKO helps users recognize, verify, and respond safely to phishing, impersonation,
              social engineering and digital fraud before they become victims.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as="link" to="/simulate" variant="primary" size="lg">
                Start Training
              </Button>
              <Button as="link" to="/learn" variant="secondary" size="lg">
                Explore How It Works
              </Button>
            </div>
          </div>

          <Terminal label="SYSTEM / AWARENESS">
            <div className="space-y-1">
              <TerminalLine field="scenario" value="phishing" tone="cyan" />
              <TerminalLine field="user" value="reviewing" />
              <TerminalLine field="trust" value="unknown" tone="muted" />
              <TerminalLine field="risk" value="elevated" tone="purple" />
            </div>
            <div className="my-4 h-px bg-line" />
            <div className="space-y-1.5">
              <TerminalLine field="action" value="STOP" tone="cyan" />
              <TerminalLine field="action" value="CHECK" tone="cyan" />
              <TerminalLine field="action" value="VERIFY" tone="cyan" />
              <TerminalLine field="action" value="REPORT" tone="cyan" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-green">status: learning</span>
              <TerminalCursor />
            </div>
          </Terminal>
        </div>
      </section>

      {/* Problem section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {problems.map(({ icon: Icon, title, description }) => (
            <Panel key={title} padding="lg">
              <Icon className="text-cyan" size={22} strokeWidth={1.75} />
              <h3 className="mt-4 text-base font-semibold text-text">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
            </Panel>
          ))}
        </div>

        <div className="mt-16 border-t border-line pt-16 text-center">
          <p className="mx-auto max-w-2xl text-2xl font-medium leading-snug text-text sm:text-3xl">
            The problem isn't always a technical vulnerability.
            <br />
            <span className="text-cyan">Sometimes it's a decision.</span>
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-line bg-panel/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-text">The MENTEKO learning loop</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {process.map(({ step, description }, i) => (
              <div key={step} className="bg-panel p-6">
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-base font-semibold text-text">{step}</h3>
                <p className="mt-2 text-sm text-muted">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-text sm:text-4xl">Start your training</h2>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Five realistic scenarios. Real decisions. No pressure that isn't part of the lesson.
        </p>
        <div className="mt-8 flex justify-center">
          <Button as="link" to="/simulate" variant="primary" size="lg">
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
