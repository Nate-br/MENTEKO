import type { ReactNode } from 'react';
import { Inbox, Search } from 'lucide-react';

interface WebmailShellProps {
  activeSubject: string;
  activeSender: string;
  children: ReactNode;
}

const decoyRows = [
  { sender: 'HR Updates', subject: 'Reminder: security awareness month', unread: false },
  { sender: 'IT Notifications', subject: 'Scheduled maintenance — Saturday', unread: false },
];

export function WebmailShell({ activeSubject, activeSender, children }: WebmailShellProps) {
  return (
    <div className="flex min-h-[420px] flex-col sm:min-h-[480px] sm:flex-row">
      <aside className="hidden w-14 shrink-0 flex-col items-center gap-4 border-r border-[#dadce0] bg-[#f6f8fc] py-4 sm:flex">
        <Inbox size={22} className="text-[#1a73e8]" aria-hidden />
      </aside>

      <div className="flex max-h-48 w-full flex-col overflow-y-auto border-b border-[#dadce0] sm:max-h-none sm:w-[38%] sm:border-b-0 sm:border-r">
        <div className="flex items-center gap-2 border-b border-[#dadce0] px-3 py-2">
          <Search size={16} className="text-[#5f6368]" aria-hidden />
          <span className="text-sm text-[#5f6368]">Search mail</span>
        </div>
        <ul className="text-sm">
          {decoyRows.map((row) => (
            <li
              key={row.subject}
              className="cursor-default border-b border-[#f1f3f4] px-3 py-3 opacity-60"
            >
              <p className="truncate font-medium text-[#202124]">{row.sender}</p>
              <p className="truncate text-[#5f6368]">{row.subject}</p>
            </li>
          ))}
          <li className="border-l-4 border-[#1a73e8] bg-[#e8f0fe] px-3 py-3">
            <p className="truncate font-medium text-[#202124]">{activeSender}</p>
            <p className="truncate text-[#202124]">{activeSubject}</p>
          </li>
        </ul>
      </div>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
