interface LinkInspectBarProps {
  linkDisplay?: string;
  linkActual?: string;
  visible: boolean;
}

export function LinkInspectBar({ linkDisplay, linkActual, visible }: LinkInspectBarProps) {
  const showMismatch = linkDisplay && linkActual && linkDisplay !== linkActual;
  const liveSummary =
    visible && linkDisplay
      ? showMismatch
        ? `Link shows ${linkDisplay}. Actual destination ${linkActual}.`
        : `Link destination ${linkDisplay}.`
      : '';

  return (
    <div
      className={`border-t border-[#dadce0] bg-[#f8f9fa] px-3 py-2 font-mono text-[11px] transition-opacity ${
        visible && (linkDisplay || linkActual) ? 'opacity-100' : 'opacity-40'
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="sr-only">{liveSummary}</span>
      {visible && linkDisplay && (
        <p className="truncate text-[#1a73e8]">
          <span className="text-[#5f6368]">Shows: </span>
          {linkDisplay}
        </p>
      )}
      {visible && showMismatch && (
        <p className="mt-0.5 truncate text-[#d93025]">
          <span className="text-[#5f6368]">Goes to: </span>
          {linkActual}
        </p>
      )}
      {!linkDisplay && !linkActual && (
        <p className="text-[#5f6368]">Hover the button or link to inspect the destination.</p>
      )}
    </div>
  );
}
