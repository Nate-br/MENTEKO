import type { ReactNode } from 'react';

interface BrowserFrameProps {
  url: string;
  children: ReactNode;
}

export function BrowserFrame({ url, children }: BrowserFrameProps) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-[#dadce0] bg-white shadow-xl"
      role="region"
      aria-label="Training email simulation"
    >
      <div className="flex items-center gap-2 border-b border-[#dadce0] bg-[#f1f3f4] px-3 py-2">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="min-w-0 flex-1 truncate rounded-md bg-white px-3 py-1 font-mono text-[11px] text-[#5f6368]">
          {url}
        </div>
      </div>
      <div className="bg-white text-[#202124]">{children}</div>
    </div>
  );
}
