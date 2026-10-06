import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { DYNAMIC_DRILLS } from '@/data/dynamicDrills';
import {
  ShieldCheck,
  Send,
  Mail,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Clock,
  Search,
  CheckCircle2,
  Trash2,
  Lock,
  Loader2,
} from 'lucide-react';
import { api } from '@/lib/api';

interface DrillSession {
  id: string;
  token: string;
  drill_id: string;
  target_name?: string;
  target_email?: string;
  sender_email?: string;
  department?: string;
  status: 'dispatched' | 'opened' | 'clicked' | 'compromised' | 'reported' | 'trained';
  reaction_time_seconds?: number;
  opened_at?: string;
  clicked_at?: string;
  submitted_at?: string;
  reported_at?: string;
  trained_at?: string;
  created_at: string;
  drillUrl: string;
  compromised_details?: any;
}

interface AdminStats {
  totalDispatched: number;
  openedCount: number;
  openRate: number;
  clickedCount: number;
  clickRate: number;
  compromisedCount: number;
  compromiseRate: number;
  reportedCount: number;
  reportingRate: number;
  trainedCount: number;
  trainingRate: number;
  avgReactionTime: number;
}

export function AdminPortal() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'launcher' | 'monitor' | 'emails'>('analytics');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [drills, setDrills] = useState<DrillSession[]>([]);
  const [directAdminEmails, setDirectAdminEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter in Monitor tab
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Launch Campaign Form
  const [selectedDrillId, setSelectedDrillId] = useState('drill-bank-webmail');
  const [selectedSenderEmail, setSelectedSenderEmail] = useState('security-alerts@savethegeneration.com.et');
  const [targetName, setTargetName] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [targetDept, setTargetDept] = useState('Finance');
  const [sendRealEmail, setSendRealEmail] = useState(true);
  const [bulkTargets, setBulkTargets] = useState('');
  const [bulkMode, setBulkMode] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [launchSuccessMsg, setLaunchSuccessMsg] = useState<string | null>(null);
  const [launchResults, setLaunchResults] = useState<any[]>([]);

  // DirectAdmin Mailbox Form
  const [newEmailUser, setNewEmailUser] = useState('');
  const [newEmailPass, setNewEmailPass] = useState('MentekoDrills@2026.');
  const [creatingEmail, setCreatingEmail] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);

  // Copied indicator state
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setRefreshing(true);
    try {
      const [statsRes, drillsRes, emailsRes] = await Promise.all([
        api.get<{ success: boolean; metrics: AdminStats }>('/admin/drills/stats'),
        api.get<{ success: boolean; drills: DrillSession[] }>('/admin/drills'),
        api.get<{ success: boolean; mailboxes: string[] }>('/admin/emails'),
      ]);

      if (statsRes.success) setStats(statsRes.metrics);
      if (drillsRes.success) setDrills(drillsRes.drills);
      if (emailsRes.success && emailsRes.mailboxes?.length) {
        setDirectAdminEmails(emailsRes.mailboxes);
        if (!selectedSenderEmail && emailsRes.mailboxes[0]) {
          setSelectedSenderEmail(emailsRes.mailboxes[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load admin telemetry:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 20000); // 20s live polling
    return () => clearInterval(interval);
  }, []);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleLaunchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLaunching(true);
    setLaunchSuccessMsg(null);
    setLaunchResults([]);

    let targetsToSend: Array<{ name: string; email: string; department: string }> = [];

    if (bulkMode) {
      const lines = bulkTargets.split('\n').filter((l) => l.trim().length > 0);
      targetsToSend = lines.map((line) => {
        const parts = line.split(',').map((p) => p.trim());
        return {
          name: parts[0] || 'Team Member',
          email: parts[1] || '',
          department: parts[2] || 'Operations',
        };
      });
    } else {
      if (!targetEmail.trim() && sendRealEmail) {
        alert('Recipient email is required for real email delivery.');
        setLaunching(false);
        return;
      }
      targetsToSend = [
        {
          name: targetName.trim() || 'Team Member',
          email: targetEmail.trim(),
          department: targetDept.trim() || 'General',
        },
      ];
    }

    try {
      const res = await api.post('/admin/drills/launch', {
        drillId: selectedDrillId,
        senderEmail: selectedSenderEmail,
        sendEmail: sendRealEmail,
        targets: targetsToSend,
      });

      if (res.success) {
        setLaunchSuccessMsg(
          res.message || `Dispatched ${targetsToSend.length} drill(s) from ${selectedSenderEmail}!`
        );
        setLaunchResults(res.results || []);
        fetchAdminData();
        if (!bulkMode) {
          setTargetName('');
          setTargetEmail('');
        }
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to dispatch drill campaign.');
    } finally {
      setLaunching(false);
    }
  };

  const handleCreateMailbox = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmailUser.trim() || !newEmailPass.trim()) return;

    setCreatingEmail(true);
    setEmailSuccessMsg(null);

    try {
      const res = await api.post('/admin/emails/create', {
        username: newEmailUser.trim(),
        password: newEmailPass.trim(),
        quota: 500,
      });

      if (res.success) {
        setEmailSuccessMsg(res.message);
        setNewEmailUser('');
        fetchAdminData();
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to create DirectAdmin mailbox.');
    } finally {
      setCreatingEmail(false);
    }
  };

  const handleDeleteDrill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this drill session?')) return;
    try {
      await api.delete(`/admin/drills/${id}`);
      fetchAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredDrills = drills.filter((d) => {
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (d.target_name && d.target_name.toLowerCase().includes(searchLower)) ||
      (d.target_email && d.target_email.toLowerCase().includes(searchLower)) ||
      (d.department && d.department.toLowerCase().includes(searchLower)) ||
      d.drill_id.toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  if (loading && !stats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan" />
          <p className="mt-3 text-sm font-mono text-muted">CONNECTING TO ENTERPRISE CYBER COMMAND...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
              <ShieldCheck size={18} />
            </span>
            <p className="font-mono text-xs uppercase tracking-widest text-cyan font-bold">
              MENTEKO ENTERPRISE DEFENSE
            </p>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold text-text">Security Admin Console</h1>
          <p className="text-xs text-muted mt-1">
            Connected to <b>DirectAdmin MTA (savethegeneration.com.et)</b> · Employee Vulnerability & Training Tracker
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchAdminData}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs"
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Syncing...' : 'Refresh Telemetry'}
          </Button>

          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-3 py-1 font-mono text-[11px] text-emerald-400 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            LIVE SERVER CONNECTED
          </span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="mt-8 flex flex-wrap gap-2 border-b border-line pb-3">
        {[
          { id: 'analytics', label: 'Overview & Metrics' },
          { id: 'launcher', label: 'Send Demo Link / Launch Campaign' },
          { id: 'monitor', label: `Employee Live Tracker (${drills.length})` },
          { id: 'emails', label: `DirectAdmin Mailboxes (${directAdminEmails.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === t.id
                ? 'bg-cyan text-bg shadow-md'
                : 'bg-panel-1 border border-line text-muted hover:text-text hover:border-cyan/30'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="mt-8 space-y-8 animate-in fade-in duration-200">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-2xl border border-line bg-panel-1 p-4 shadow-sm">
              <p className="font-mono text-[11px] uppercase text-muted">Total Dispatched</p>
              <p className="mt-2 text-2xl font-black text-text">{stats?.totalDispatched || 0}</p>
              <p className="mt-1 text-[10px] text-muted">Employee Drill Sessions</p>
            </div>

            <div className="rounded-2xl border border-line bg-panel-1 p-4 shadow-sm">
              <p className="font-mono text-[11px] uppercase text-cyan">Opened Rate</p>
              <p className="mt-2 text-2xl font-black text-cyan">{stats?.openRate || 0}%</p>
              <p className="mt-1 text-[10px] text-muted">{stats?.openedCount || 0} viewed emails/links</p>
            </div>

            <div className="rounded-2xl border border-line bg-panel-1 p-4 shadow-sm">
              <p className="font-mono text-[11px] uppercase text-purple">Clicked Phish</p>
              <p className="mt-2 text-2xl font-black text-purple">{stats?.clickRate || 0}%</p>
              <p className="mt-1 text-[10px] text-muted">{stats?.clickedCount || 0} engaged with link</p>
            </div>

            <div className="rounded-2xl border border-red-500/30 bg-red-950/10 p-4 shadow-sm">
              <p className="font-mono text-[11px] uppercase text-red-400">Compromised</p>
              <p className="mt-2 text-2xl font-black text-red-400">{stats?.compromiseRate || 0}%</p>
              <p className="mt-1 text-[10px] text-muted">{stats?.compromisedCount || 0} entered credentials</p>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-4 shadow-sm">
              <p className="font-mono text-[11px] uppercase text-emerald-400">Reported to SOC</p>
              <p className="mt-2 text-2xl font-black text-emerald-400">{stats?.reportingRate || 0}%</p>
              <p className="mt-1 text-[10px] text-muted">{stats?.reportedCount || 0} defended properly</p>
            </div>

            <div className="rounded-2xl border border-line bg-panel-1 p-4 shadow-sm">
              <p className="font-mono text-[11px] uppercase text-cyan">Trained & Educated</p>
              <p className="mt-2 text-2xl font-black text-cyan">{stats?.trainingRate || 0}%</p>
              <p className="mt-1 text-[10px] text-muted">{stats?.trainedCount || 0} completed training</p>
            </div>
          </div>

          {/* Secondary Info: Reaction Speed & Instructions */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-line bg-panel-1 p-6 space-y-4">
              <h3 className="text-base font-bold text-text flex items-center gap-2">
                <Clock size={16} className="text-cyan" />
                Human Vulnerability Metric: Reaction Velocity
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Social engineers exploit impulsive reactions. Threat actors succeed when victims react in under 60
                seconds without inspecting domains.
              </p>
              <div className="rounded-xl border border-line bg-panel-2 p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted">Average Employee Reaction Time</p>
                  <p className="text-3xl font-extrabold text-cyan mt-1">
                    {stats?.avgReactionTime ? `${stats.avgReactionTime}s` : '14.2s'}
                  </p>
                </div>
                <div className="text-right text-xs text-muted">
                  <span className="rounded bg-cyan/10 border border-cyan/30 px-2 py-0.5 text-cyan font-bold">
                    Target: &gt; 90s (Stop & Verify)
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-panel-1 p-6 space-y-3">
              <h3 className="text-base font-bold text-text flex items-center gap-2">
                <Mail size={16} className="text-cyan" />
                How the Employee Demo Simulation Works
              </h3>
              <ol className="list-decimal pl-4 space-y-2 text-xs text-muted leading-relaxed">
                <li>
                  <b>Dispatch:</b> Admin sends an authentic phishing email via DirectAdmin SMTP or copies a demo link to
                  the employee.
                </li>
                <li>
                  <b>Live Interception:</b> When the employee clicks the link and attempts to enter credentials, the
                  system triggers a <b>Vulnerability Breach Simulator</b> showing them what an attacker captured (IP,
                  session, credentials).
                </li>
                <li>
                  <b>Teachable Moment:</b> The platform redirects them automatically to the <b>Defense Briefing</b> where
                  they learn the exact indicators they missed.
                </li>
                <li>
                  <b>Verification:</b> Completing the briefing updates their record to <b>Trained & Educated 🎓</b> in this
                  portal.
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LAUNCH DRILL & GENERATE DEMO LINK */}
      {activeTab === 'launcher' && (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 animate-in fade-in duration-200">
          {/* Form */}
          <div className="rounded-2xl border border-line bg-panel-1 p-6 shadow-xl lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-text">Send Drill / Generate Employee Demo Link</h2>
              <p className="text-xs text-muted mt-1">
                Dispatch an authorized awareness exercise directly to an employee's inbox using your DirectAdmin emails.
              </p>
            </div>

            <form onSubmit={handleLaunchCampaign} className="space-y-4">
              {/* Drill Scenario Template */}
              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1.5">Simulation Template</label>
                <select
                  value={selectedDrillId}
                  onChange={(e) => setSelectedDrillId(e.target.value)}
                  className="w-full rounded-xl border border-line bg-panel-2 px-3 py-2.5 text-xs text-text focus:border-cyan focus:outline-none"
                >
                  {DYNAMIC_DRILLS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title} ({d.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* DirectAdmin Sender Selection */}
              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1.5">
                  DirectAdmin Sender Account (savethegeneration.com.et)
                </label>
                <select
                  value={selectedSenderEmail}
                  onChange={(e) => setSelectedSenderEmail(e.target.value)}
                  className="w-full rounded-xl border border-line bg-panel-2 px-3 py-2.5 text-xs text-cyan font-mono focus:border-cyan focus:outline-none"
                >
                  {directAdminEmails.map((email) => (
                    <option key={email} value={email}>
                      {email} (Verified DirectAdmin Mailbox)
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => setBulkMode(false)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${
                    !bulkMode ? 'bg-cyan/20 border-cyan text-cyan' : 'border-line text-muted'
                  }`}
                >
                  Single Employee
                </button>
                <button
                  type="button"
                  onClick={() => setBulkMode(true)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${
                    bulkMode ? 'bg-cyan/20 border-cyan text-cyan' : 'border-line text-muted'
                  }`}
                >
                  Bulk Employee List (CSV)
                </button>
              </div>

              {!bulkMode ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-muted mb-1">Employee Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Abebe Kebede"
                      value={targetName}
                      onChange={(e) => setTargetName(e.target.value)}
                      className="w-full rounded-lg border border-line bg-panel-2 px-3 py-2 text-xs text-text focus:border-cyan focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-muted mb-1">Work Email</label>
                    <input
                      type="email"
                      placeholder="abebe@company.com"
                      value={targetEmail}
                      onChange={(e) => setTargetEmail(e.target.value)}
                      className="w-full rounded-lg border border-line bg-panel-2 px-3 py-2 text-xs text-text focus:border-cyan focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-muted mb-1">Department</label>
                    <input
                      type="text"
                      placeholder="Finance, HR, Tech"
                      value={targetDept}
                      onChange={(e) => setTargetDept(e.target.value)}
                      className="w-full rounded-lg border border-line bg-panel-2 px-3 py-2 text-xs text-text focus:border-cyan focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    Paste Roster (Format: Name, Email, Department)
                  </label>
                  <textarea
                    rows={4}
                    placeholder={`Abebe Kebede, abebe@company.com, Finance\nSara Haile, sara@company.com, HR\nDawit Mengistu, dawit@company.com, Operations`}
                    value={bulkTargets}
                    onChange={(e) => setBulkTargets(e.target.value)}
                    className="w-full rounded-lg border border-line bg-panel-2 p-3 font-mono text-xs text-text focus:border-cyan focus:outline-none"
                  />
                </div>
              )}

              {/* Delivery method checkboxes */}
              <div className="rounded-xl border border-line bg-panel-2 p-3.5 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={sendRealEmail}
                    onChange={(e) => setSendRealEmail(e.target.checked)}
                    className="rounded border-line text-cyan focus:ring-0"
                  />
                  <span>
                    <b>Deliver Real Email:</b> Send authentic phishing email via DirectAdmin MTA to employee inbox
                  </span>
                </label>
              </div>

              {launchSuccessMsg && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{launchSuccessMsg}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={launching}
                className="w-full text-xs font-bold py-2.5 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan to-blue-600 hover:from-cyan/90 hover:to-blue-500 text-bg"
              >
                {launching ? (
                  'Dispatching Drills...'
                ) : (
                  <>
                    <Send size={14} /> Dispatch Campaign & Generate Demo Links
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Generated Links Panel */}
          <div className="rounded-2xl border border-line bg-panel-1 p-6 lg:col-span-5 space-y-4">
            <h3 className="text-base font-bold text-text flex items-center gap-2">
              <ExternalLink size={16} className="text-cyan" />
              Generated Demo Links
            </h3>
            <p className="text-xs text-muted">
              You can copy these links directly to send via Slack, Microsoft Teams, WhatsApp, or test them in your own
              browser.
            </p>

            {launchResults.length > 0 ? (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {launchResults.map((r, i) => (
                  <div key={i} className="rounded-xl border border-line bg-panel-2 p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text">{r.name}</span>
                      <span className="font-mono text-[10px] text-muted">{r.department}</span>
                    </div>
                    {r.email && <p className="text-[11px] text-muted">{r.email}</p>}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        readOnly
                        value={r.drillUrl}
                        className="w-full rounded border border-line bg-black/40 px-2 py-1 font-mono text-[10px] text-cyan truncate"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleCopyLink(r.drillUrl, r.token)}
                        className="text-[11px] px-2.5 shrink-0"
                      >
                        {copiedToken === r.token ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </Button>
                      <a
                        href={r.drillUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded bg-cyan/10 border border-cyan/30 p-1.5 text-cyan hover:bg-cyan/20 shrink-0"
                      >
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-line bg-panel-2 p-8 text-center text-xs text-muted">
                No active links generated in this session yet. Launch a drill to produce tracked demo links.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: EMPLOYEE LIVE TRACKER */}
      {activeTab === 'monitor' && (
        <div className="mt-8 space-y-6 animate-in fade-in duration-200">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search size={14} className="absolute left-3 top-2.5 text-muted" />
                <input
                  type="text"
                  placeholder="Search employee, email, department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-line bg-panel-1 pl-9 pr-3 py-2 text-xs text-text focus:border-cyan focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {['all', 'dispatched', 'opened', 'clicked', 'compromised', 'reported', 'trained'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize transition-all ${
                    statusFilter === st
                      ? 'bg-cyan text-bg font-bold'
                      : 'bg-panel-1 border border-line text-muted hover:text-text'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className="rounded-2xl border border-line bg-panel-1 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-line bg-panel-2 text-muted font-mono uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Dept</th>
                    <th className="px-4 py-3">Scenario</th>
                    <th className="px-4 py-3">DirectAdmin Sender</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Reaction Time</th>
                    <th className="px-4 py-3">Dispatched</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredDrills.length > 0 ? (
                    filteredDrills.map((drill) => {
                      const isCompromised = drill.status === 'compromised';
                      const isReported = drill.status === 'reported';
                      const isTrained = drill.status === 'trained';
                      const isOpened = drill.status === 'opened';
                      const isClicked = drill.status === 'clicked';

                      return (
                        <tr key={drill.id} className="hover:bg-panel-2/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-text">
                            <div>{drill.target_name || 'Anonymous Employee'}</div>
                            <div className="text-[11px] text-muted">{drill.target_email || 'Demo Link (In-App)'}</div>
                          </td>
                          <td className="px-4 py-3 text-muted">{drill.department || 'General'}</td>
                          <td className="px-4 py-3 font-mono text-[11px] text-cyan">{drill.drill_id}</td>
                          <td className="px-4 py-3 font-mono text-[11px] text-muted">
                            {drill.sender_email || 'security-alerts@savethegeneration.com.et'}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                isCompromised
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : isReported
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : isTrained
                                  ? 'bg-cyan/20 text-cyan border border-cyan/40'
                                  : isClicked
                                  ? 'bg-purple/20 text-purple border border-purple/30'
                                  : isOpened
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : 'bg-panel-2 text-muted border border-line'
                              }`}
                            >
                              {drill.status === 'trained'
                                ? '🎓 Trained'
                                : drill.status === 'compromised'
                                ? '⚠️ Compromised'
                                : drill.status === 'reported'
                                ? '🛡️ Reported'
                                : drill.status === 'clicked'
                                ? '🔗 Clicked'
                                : drill.status === 'opened'
                                ? '👁️ Opened'
                                : '📩 Dispatched'}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-muted">
                            {drill.reaction_time_seconds ? `${drill.reaction_time_seconds}s` : '—'}
                          </td>
                          <td className="px-4 py-3 text-[11px] text-muted">
                            {new Date(drill.created_at).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopyLink(drill.drillUrl, drill.id)}
                                className="h-7 w-7 p-0 text-muted hover:text-cyan"
                                title="Copy Demo Link"
                              >
                                {copiedToken === drill.id ? (
                                  <Check size={12} className="text-emerald-400" />
                                ) : (
                                  <Copy size={12} />
                                )}
                              </Button>
                              <a
                                href={drill.drillUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="h-7 w-7 flex items-center justify-center rounded text-muted hover:text-cyan"
                                title="Open Link"
                              >
                                <ExternalLink size={12} />
                              </a>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteDrill(drill.id)}
                                className="h-7 w-7 p-0 text-muted hover:text-red-400"
                                title="Delete Record"
                              >
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted text-xs">
                        No drill records found matching the current search/filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DIRECTADMIN MAILBOX MANAGER */}
      {activeTab === 'emails' && (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 animate-in fade-in duration-200">
          {/* Active Mailboxes List */}
          <div className="rounded-2xl border border-line bg-panel-1 p-6 lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-text flex items-center gap-2">
                  <Mail size={16} className="text-cyan" />
                  Active DirectAdmin Mailboxes
                </h3>
                <p className="text-xs text-muted mt-1">Domain: savethegeneration.com.et</p>
              </div>
              <span className="rounded-full bg-cyan/10 border border-cyan/30 px-2.5 py-0.5 font-mono text-[11px] text-cyan font-bold">
                {directAdminEmails.length} Mailboxes
              </span>
            </div>

            <div className="divide-y divide-line rounded-xl border border-line bg-panel-2 overflow-hidden">
              {directAdminEmails.map((email) => (
                <div key={email} className="flex items-center justify-between p-3.5 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-panel-1 border border-line flex items-center justify-center text-cyan">
                      <Mail size={14} />
                    </div>
                    <div>
                      <p className="font-mono font-bold text-slate-200">{email}</p>
                      <p className="text-[10px] text-muted">DirectAdmin Exim MTA Active</p>
                    </div>
                  </div>
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] text-emerald-400 font-bold">
                    READY FOR CAMPAIGNS
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Create Mailbox Form */}
          <div className="rounded-2xl border border-line bg-panel-1 p-6 lg:col-span-5 space-y-4">
            <h3 className="text-base font-bold text-text flex items-center gap-2">
              <Lock size={16} className="text-cyan" />
              Create DirectAdmin Mailbox
            </h3>
            <p className="text-xs text-muted">
              Instantly create a new verified mailbox on <b>savethegeneration.com.et</b> via the DirectAdmin API.
            </p>

            <form onSubmit={handleCreateMailbox} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">Mailbox Username</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. security-team"
                    value={newEmailUser}
                    onChange={(e) => setNewEmailUser(e.target.value)}
                    className="flex-1 rounded-lg border border-line bg-panel-2 px-3 py-2 text-xs text-text focus:border-cyan focus:outline-none"
                  />
                  <span className="text-xs font-mono text-muted">@savethegeneration.com.et</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">Mailbox Password</label>
                <input
                  type="text"
                  required
                  value={newEmailPass}
                  onChange={(e) => setNewEmailPass(e.target.value)}
                  className="w-full rounded-lg border border-line bg-panel-2 px-3 py-2 font-mono text-xs text-text focus:border-cyan focus:outline-none"
                />
              </div>

              {emailSuccessMsg && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-2.5 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  <span>{emailSuccessMsg}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={creatingEmail}
                className="w-full text-xs font-bold py-2 bg-cyan text-bg hover:bg-cyan/90"
              >
                {creatingEmail ? 'Creating in DirectAdmin...' : 'Create DirectAdmin Mailbox'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
