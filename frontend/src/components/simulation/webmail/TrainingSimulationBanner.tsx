import { Shield } from 'lucide-react';

export function TrainingSimulationBanner() {
  return (
    <div
      className="flex items-start gap-2 rounded-lg border border-cyan/30 bg-cyan/5 px-3 py-2 text-xs text-muted sm:items-center"
      role="note"
    >
      <Shield size={14} className="mt-0.5 shrink-0 text-cyan sm:mt-0" aria-hidden />
      <p>
        <span className="font-medium text-cyan">Authorized training simulation.</span> All messages,
        senders, and organizations shown here are fictional. No real accounts or credentials are
        involved.
      </p>
    </div>
  );
}
