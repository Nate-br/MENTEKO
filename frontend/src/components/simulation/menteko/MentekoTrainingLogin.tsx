import { useState, type FormEvent } from 'react';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { ShieldAlert } from 'lucide-react';

interface MentekoTrainingLoginProps {
  onContinue: (enteredCredentials: boolean) => void;
  onBack: () => void;
}

/**
 * Non-functional training page. Form values are never stored or transmitted.
 */
export function MentekoTrainingLogin({ onContinue, onBack }: MentekoTrainingLoginProps) {
  const [, setTouched] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    onContinue(true);
  };

  return (
    <div className="space-y-4">
      <Panel padding="md" glow="purple" className="border-purple/30">
        <div className="flex items-start gap-3">
          <ShieldAlert size={18} className="mt-0.5 shrink-0 text-purple" aria-hidden />
          <div className="text-sm text-muted">
            <p className="font-medium text-text">Training page — not a real bank login</p>
            <p className="mt-1">
              This simulates what a phishing site might look like. Anything you type here is discarded
              immediately and is never sent to a server.
            </p>
          </div>
        </div>
      </Panel>

      <Panel padding="none" className="mx-auto max-w-md overflow-hidden">
        <div className="border-b border-line bg-[#0d2433] px-6 py-5 text-center">
          <p className="text-lg font-semibold tracking-tight text-text">Menteko Bank</p>
          <p className="mt-1 font-mono text-[10px] text-muted">secure.menteko.local — fictional domain</p>
        </div>

        <form className="space-y-4 px-6 py-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="menteko-training-user" className="block text-sm font-medium text-muted">
              Username or customer ID
            </label>
            <input
              id="menteko-training-user"
              name="username"
              type="text"
              autoComplete="off"
              className="mt-1.5 w-full rounded-lg border border-line bg-panel-2 px-3 py-2.5 text-sm text-text outline-none focus:border-cyan"
              placeholder="Training input only"
            />
          </div>
          <div>
            <label htmlFor="menteko-training-pass" className="block text-sm font-medium text-muted">
              Password
            </label>
            <input
              id="menteko-training-pass"
              name="password"
              type="password"
              autoComplete="off"
              className="mt-1.5 w-full rounded-lg border border-line bg-panel-2 px-3 py-2.5 text-sm text-text outline-none focus:border-cyan"
              placeholder="Training input only"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Continue
          </Button>
          <button
            type="button"
            onClick={() => onContinue(false)}
            className="w-full text-center text-sm text-muted hover:text-cyan"
          >
            Leave page without entering details
          </button>
        </form>
      </Panel>

      <div className="flex justify-start">
        <button type="button" onClick={onBack} className="text-sm text-muted hover:text-cyan">
          ← Back to email
        </button>
      </div>
    </div>
  );
}
