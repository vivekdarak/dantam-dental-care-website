"use client";

import { AlertTriangle, CheckCircle2, Clock, LogOut, Search, Send, X } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SelectPicker, type SelectPickerOption } from "@/components/select-picker";

type ReviewRequestLog = {
  id: number;
  patientName: string;
  phoneCountryCode: string;
  phoneNumber: string;
  branchName: string;
  n8nStatusCode: number | null;
  createdAtDisplay: string;
};

type HistoryResponse = {
  items: ReviewRequestLog[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type SendResponse = {
  ok: boolean;
  error?: string;
  duplicate?: boolean;
  previousRequests?: ReviewRequestLog[];
  log?: ReviewRequestLog;
  cooldownSeconds?: number;
};

export function InternalReviewRequestClient({
  authenticated,
  branches,
}: {
  authenticated: boolean;
  branches: SelectPickerOption[];
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [branchSlug, setBranchSlug] = useState(branches[0]?.value || "");
  const [patientName, setPatientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmDuplicate, setConfirmDuplicate] = useState(false);
  const [duplicateLogs, setDuplicateLogs] = useState<ReviewRequestLog[]>([]);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [sendError, setSendError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [historyError, setHistoryError] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const phoneIsValid = /^\d{10}$/.test(phoneNumber);
  const canSubmit = Boolean(branchSlug && patientName.trim().length >= 2 && phoneIsValid && !sending && cooldownSeconds === 0);
  const submitLabel = useMemo(() => {
    if (sending) return "Sending...";
    if (cooldownSeconds > 0) return `Wait ${cooldownSeconds}s`;
    return confirmDuplicate ? "Send anyway" : "Send review request";
  }, [confirmDuplicate, cooldownSeconds, sending]);

  useEffect(() => {
    if (!authenticated) return;
    void loadHistory(page, search);
  }, [authenticated, page, search]);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setCooldownSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  function resetDuplicateState() {
    setConfirmDuplicate(false);
    setDuplicateLogs([]);
    setDuplicateModalOpen(false);
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    setLoggingIn(true);

    try {
      const response = await fetch("/api/internal/review/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setLoginError(data.error || "Could not sign in.");
        return;
      }

      setPassword("");
      router.refresh();
    } catch {
      setLoginError("Could not sign in. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function logout() {
    await fetch("/api/internal/review/logout", { method: "POST" });
    router.refresh();
  }

  async function loadHistory(nextPage: number, nextSearch: string) {
    setHistoryLoading(true);
    setHistoryError("");

    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        search: nextSearch,
      });
      const response = await fetch(`/api/internal/review/history?${params.toString()}`);
      const data = (await response.json()) as { ok: boolean; error?: string; history?: HistoryResponse };

      if (!response.ok || !data.ok || !data.history) {
        setHistoryError(data.error || "Could not load history.");
        return;
      }

      setHistory(data.history);
    } catch {
      setHistoryError("Could not load history.");
    } finally {
      setHistoryLoading(false);
    }
  }

  async function sendReviewRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitReviewRequest(false);
  }

  async function submitReviewRequest(forceDuplicateSend: boolean) {
    if (!canSubmit) return;

    setSending(true);
    setSendError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/internal/review/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchSlug,
          patientName,
          phoneNumber,
          confirmDuplicate: forceDuplicateSend || confirmDuplicate,
        }),
      });

      const data = (await response.json()) as SendResponse;

      if (data.duplicate) {
        setDuplicateLogs(data.previousRequests || []);
        setConfirmDuplicate(true);
        setDuplicateModalOpen(true);
        setSendError("");
        return;
      }

      if (!response.ok || !data.ok) {
        setSendError(data.error || "Could not send review request.");
        if (data.cooldownSeconds) setCooldownSeconds(data.cooldownSeconds);
        return;
      }

      setSuccessMessage(`Review request sent to +91 ${phoneNumber}.`);
      setPatientName("");
      setPhoneNumber("");
      resetDuplicateState();
      setCooldownSeconds(data.cooldownSeconds || 30);
      setPage(1);
      await loadHistory(1, search);
    } catch {
      setSendError("Could not send review request. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function handlePhoneChange(value: string) {
    setPhoneNumber(value.replace(/\D/g, "").slice(0, 10));
    resetDuplicateState();
  }

  function handlePatientNameChange(value: string) {
    setPatientName(value.replace(/(^|\s)([a-z])/g, (match) => match.toUpperCase()));
    resetDuplicateState();
  }

  if (!authenticated) {
    return (
      <section className="internal-review-page">
        <div className="internal-review-login">
          <div className="internal-review-kicker">Dantam Team</div>
          <h1>Review request access</h1>
          <form onSubmit={login}>
            <label>
              Internal password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            {loginError && <div className="internal-review-error">{loginError}</div>}
            <button className="internal-review-primary" type="submit" disabled={loggingIn}>
              {loggingIn ? "Checking..." : "Continue"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="internal-review-page">
      <div className="internal-review-shell">
        <header className="internal-review-header">
          <div>
            <div className="internal-review-kicker">Dantam Team</div>
            <h1>Send review request</h1>
          </div>
          <button className="internal-review-icon-button" type="button" onClick={logout} aria-label="Logout">
            <LogOut size={18} />
          </button>
        </header>

        <form className="internal-review-form" onSubmit={sendReviewRequest}>
          <SelectPicker label="Branch" value={branchSlug} options={branches} onChange={setBranchSlug} />

          <label>
            Patient name
            <input
              type="text"
              value={patientName}
              onChange={(event) => handlePatientNameChange(event.target.value)}
              placeholder="Enter patient name"
              autoComplete="name"
              required
            />
          </label>

          <label>
            Mobile number
            <span className="internal-review-phone-row">
              <span className="internal-review-country">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                value={phoneNumber}
                onChange={(event) => handlePhoneChange(event.target.value)}
                placeholder="10 digit number"
                autoComplete="tel-national"
                required
              />
            </span>
          </label>

          {sendError && <div className="internal-review-error">{sendError}</div>}
          {successMessage && (
            <div className="internal-review-success">
              <CheckCircle2 size={18} />
              {successMessage}
            </div>
          )}

          <button className="internal-review-primary" type="submit" disabled={!canSubmit}>
            <Send size={18} />
            {submitLabel}
          </button>
        </form>

        <section className="internal-review-history">
          <div className="internal-review-history-head">
            <div>
              <h2>Request history</h2>
              <p>10 records per page. Times shown in Asia/Kolkata.</p>
            </div>
          </div>

          <label className="internal-review-search">
            <Search size={17} />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search name or phone"
            />
          </label>

          {historyError && <div className="internal-review-error">{historyError}</div>}
          {historyLoading && <div className="internal-review-muted">Loading history...</div>}

          {!historyLoading && history && (
            <>
              <div className="internal-review-log-list">
                {history.items.length > 0 ? (
                  history.items.map((log) => <HistoryItem key={log.id} log={log} />)
                ) : (
                  <div className="internal-review-empty">No review requests found.</div>
                )}
              </div>

              <div className="internal-review-pagination">
                <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={history.page <= 1}>
                  Previous
                </button>
                <span>
                  Page {history.page} of {history.totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.min(history.totalPages, value + 1))}
                  disabled={history.page >= history.totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      {duplicateModalOpen && (
        <div className="internal-review-modal-backdrop" role="presentation">
          <div className="internal-review-modal" role="dialog" aria-modal="true" aria-labelledby="duplicate-review-title">
            <button className="internal-review-modal-close" type="button" onClick={() => setDuplicateModalOpen(false)} aria-label="Close">
              <X size={18} />
            </button>
            <div className="internal-review-alert-title">
              <AlertTriangle size={20} />
              <span id="duplicate-review-title">Previous requests found</span>
            </div>
            <p>
              This mobile number already has review request history. Check the records below before sending again.
            </p>
            <div className="internal-review-modal-list">
              {duplicateLogs.map((log) => (
                <HistoryItem key={log.id} log={log} compact />
              ))}
            </div>
            <div className="internal-review-modal-actions">
              <button type="button" onClick={() => setDuplicateModalOpen(false)}>
                Review form
              </button>
              <button className="danger" type="button" disabled={sending || cooldownSeconds > 0} onClick={() => submitReviewRequest(true)}>
                {sending ? "Sending..." : "Send anyway"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function HistoryItem({ log, compact = false }: { log: ReviewRequestLog; compact?: boolean }) {
  const status = log.n8nStatusCode && log.n8nStatusCode >= 200 && log.n8nStatusCode < 300 ? "Received by automation" : "Trigger issue";

  return (
    <article className={`internal-review-log ${compact ? "compact" : ""}`}>
      <div>
        <strong>{log.patientName}</strong>
        <span>
          +91 {log.phoneNumber} · {log.branchName}
        </span>
      </div>
      <div className="internal-review-log-meta">
        <span>
          <Clock size={14} />
          {log.createdAtDisplay}
        </span>
        <span className={status === "Received by automation" ? "ok" : "warn"}>{status}</span>
      </div>
    </article>
  );
}
