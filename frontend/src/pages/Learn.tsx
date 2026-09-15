import { useState } from 'react';
import { learnTopics } from '@/data/learnTopics';
import { Panel } from '@/components/ui/Panel';
import { Badge } from '@/components/ui/Badge';
import { ChevronDown } from 'lucide-react';

export function Learn() {
  const [openId, setOpenId] = useState<string | null>(learnTopics[0]?.id ?? null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-xs tracking-wide text-cyan">KNOW YOUR ENEMY</p>
      <h1 className="mt-3 text-3xl font-semibold text-text sm:text-4xl">
        Learn the signals. Understand the psychology. Build the habit.
      </h1>

      <div className="mt-12 space-y-4">
        {learnTopics.map((topic) => {
          const open = openId === topic.id;
          return (
            <Panel key={topic.id} padding="none" className="overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : topic.id)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 p-6 text-left"
              >
                <div className="flex items-center gap-3">
                  <Badge tone="cyan">{String(learnTopics.indexOf(topic) + 1).padStart(2, '0')}</Badge>
                  <h2 className="text-lg font-semibold text-text">{topic.title}</h2>
                </div>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-muted transition-transform ${open ? 'rotate-180 text-cyan' : ''}`}
                />
              </button>

              {open && (
                <div className="space-y-6 border-t border-line px-6 pb-6 pt-5">
                  <p className="text-sm leading-relaxed text-text">{topic.definition}</p>

                  <div>
                    <p className="font-mono text-xs tracking-wide text-muted">WARNING SIGNS</p>
                    <ul className="mt-3 space-y-2">
                      {topic.warningSigns.map((sign) => (
                        <li key={sign} className="flex gap-3 text-sm text-muted">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan" />
                          {sign}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg border border-line bg-panel-2 p-4">
                    <p className="font-mono text-xs tracking-wide text-muted">EXAMPLE</p>
                    <p className="mt-2 text-sm text-text">{topic.example}</p>
                  </div>

                  <div className="rounded-lg border border-green/30 bg-green/5 p-4">
                    <p className="font-mono text-xs tracking-wide text-green">SAFER BEHAVIOR</p>
                    <p className="mt-2 text-sm text-text">{topic.saferBehavior}</p>
                  </div>
                </div>
              )}
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
