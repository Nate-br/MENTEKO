import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-sm font-semibold text-text">
              <img
                src="/logo.png"
                alt="Menteko Logo"
                className="h-7 w-auto object-contain drop-shadow-[0_2px_8px_rgba(143,30,174,0.3)]"
              />
              <span className="font-bold tracking-wider">MENTEKO</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Human-centered cybersecurity awareness and digital fraud resilience training.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="font-mono text-xs tracking-wide text-muted">PLATFORM</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link to="/learn" className="text-muted hover:text-text">Learn</Link></li>
                <li><Link to="/simulate" className="text-muted hover:text-text">Simulate</Link></li>
                <li><Link to="/assessment" className="text-muted hover:text-text">Assessment</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs tracking-wide text-muted">PROJECT</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link to="/about" className="text-muted hover:text-text">About</Link></li>
                <li><span className="text-muted">Team HUNTERS</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>MENTEKO is an independent awareness project. Not affiliated with or endorsed by any bank.</p>
          <p className="font-mono">status: learning</p>
        </div>
      </div>
    </footer>
  );
}
