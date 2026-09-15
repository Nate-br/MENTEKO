import { Panel } from '@/components/ui/Panel';
import { Badge } from '@/components/ui/Badge';

const team = [
  { name: 'Fitsum Zerihun', role: 'Focal Person' },
  { name: 'Natnael Sisay', role: 'Team Member' },
  { name: 'Samson Tesfaye', role: 'Team Member' },
];

export function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-xs tracking-wide text-cyan">ABOUT</p>
      <h1 className="mt-3 text-3xl font-semibold text-text sm:text-4xl">
        Human cyber resilience, not offensive hacking
      </h1>

      <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted">
        <p>
          MENTEKO is a human-centered cybersecurity awareness and digital fraud resilience
          platform. Most fraud doesn't succeed because of a technical exploit — it succeeds because
          of a moment of pressure, urgency, or misplaced trust. MENTEKO trains people to recognize
          that moment before it costs them anything.
        </p>
        <p>
          Rather than another list of warnings, MENTEKO puts people through realistic, controlled
          simulations — phishing messages, impersonation calls, fraudulent payment requests, fake
          transaction evidence, and social engineering attempts — and asks them to decide how to
          respond, the same way they would in real life.
        </p>
        <p>
          The platform follows a simple behavioral model: <span className="text-text">STOP</span> →{' '}
          <span className="text-text">CHECK</span> → <span className="text-text">VERIFY</span> →{' '}
          <span className="text-text">REPORT</span>. Every scenario reinforces that habit.
        </p>
      </div>

      <Panel padding="lg" className="mt-10" glow="cyan">
        <p className="font-mono text-xs tracking-wide text-cyan">SAFETY NOTE</p>
        <p className="mt-2 text-sm text-text">
          MENTEKO is an independent awareness and training project. It is not an official system of
          any bank and does not connect to, scan, or interact with any live financial system or real
          customer accounts. Any bank or institution referenced in scenarios is fictional; all names,
          domains, and transaction details are simulated for training purposes only.
        </p>
      </Panel>

      <div className="mt-14">
        <p className="font-mono text-xs tracking-wide text-muted">TEAM HUNTERS</p>
        <p className="mt-2 text-sm text-muted">
          MENTEKO was built by Team HUNTERS, formed during the 5th INSA Cyber Talent Summer Camp.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {team.map((member) => (
            <Panel key={member.name} padding="md">
              <p className="text-sm font-medium text-text">{member.name}</p>
              <div className="mt-2">
                <Badge tone={member.role === 'Focal Person' ? 'cyan' : 'muted'}>{member.role}</Badge>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}
