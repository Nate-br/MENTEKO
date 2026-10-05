import type { ParsedEmail } from '@/components/simulation/webmail/parseEmailContent';
import { Paperclip } from 'lucide-react';

interface WebmailMessageViewProps {
  email: ParsedEmail;
  onCtaHover: (active: boolean) => void;
  onCtaClick?: () => void;
  ctaHint?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function WebmailMessageView({
  email,
  onCtaHover,
  onCtaClick,
  ctaHint,
}: WebmailMessageViewProps) {
  return (
    <div className="flex min-h-[280px] flex-col">
      <div className="border-b border-[#dadce0] px-4 py-4 sm:px-6">
        <h2 className="text-xl font-normal text-[#202124]">{email.subject}</h2>
        <div className="mt-4 flex gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a73e8] text-sm font-medium text-white"
            aria-hidden
          >
            {initials(email.fromName)}
          </div>
          <div className="min-w-0 flex-1 text-sm">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-medium text-[#202124]">{email.fromName}</span>
              {email.fromEmail && (
                <span className="truncate text-[#5f6368]">&lt;{email.fromEmail}&gt;</span>
              )}
            </div>
            <p className="mt-0.5 text-[#5f6368]">
              to {email.to} · {email.sentAt}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 sm:px-6">
        <p className="whitespace-pre-line text-[15px] leading-relaxed text-[#202124]">{email.body}</p>

        {email.attachmentLabel && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#dadce0] bg-[#f8f9fa] px-3 py-2 text-sm text-[#5f6368]">
            <Paperclip size={16} aria-hidden />
            {email.attachmentLabel}
          </div>
        )}

        {email.callToAction && (
          <div className="mt-6">
            <button
              type="button"
              className="rounded-md bg-[#1a73e8] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1765cc] focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:ring-offset-2"
              onMouseEnter={() => onCtaHover(true)}
              onMouseLeave={() => onCtaHover(false)}
              onFocus={() => onCtaHover(true)}
              onBlur={() => onCtaHover(false)}
              onClick={onCtaClick}
            >
              {email.callToAction}
            </button>
            {ctaHint && <p className="mt-2 text-xs text-[#5f6368]">{ctaHint}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
