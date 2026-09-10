"use client";

import { CalendarCheck, CheckCircle2, Loader2, Plus, RotateCcw, Send, Square, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SelectPicker } from "@/components/select-picker";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

type ChildDetails = {
  name: string;
  age: string;
};

type FormState = {
  date: string;
  parentName: string;
  mobile: string;
  children: ChildDetails[];
  concern: string;
  otherConcern: string;
  childNotPresent: boolean;
};

type CampaignDate = {
  value: string;
  label: string;
  shortLabel: string;
};

type PhoneOtpState = "idle" | "sent" | "verified";

const campaignDates: CampaignDate[] = [
  { value: "2026-09-26", label: "Sat, 26 Sep 2026", shortLabel: "Sat, 26 Sep" },
  { value: "2026-09-27", label: "Sun, 27 Sep 2026", shortLabel: "Sun, 27 Sep" },
  { value: "2026-09-28", label: "Mon, 28 Sep 2026", shortLabel: "Mon, 28 Sep" },
  { value: "2026-09-29", label: "Tue, 29 Sep 2026", shortLabel: "Tue, 29 Sep" },
  { value: "2026-09-30", label: "Wed, 30 Sep 2026", shortLabel: "Wed, 30 Sep" },
  { value: "2026-10-01", label: "Thu, 1 Oct 2026", shortLabel: "Thu, 1 Oct" },
  { value: "2026-10-02", label: "Fri, 2 Oct 2026", shortLabel: "Fri, 2 Oct" },
  { value: "2026-10-03", label: "Sat, 3 Oct 2026", shortLabel: "Sat, 3 Oct" },
];

const TRANSLATION_WEBHOOK_PATH = "/webhook/dantam-translation";
const MAX_RECORDING_SECONDS = 120;
const MAX_ATTEMPTS = 5;
const ATTEMPT_COOKIE = "dantam_review2_attempts";
const PHONE_VERIFICATION_KEY = "dantamPedoConsultationPhoneVerification";

function buildWebhookUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_N8N_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) return "";
  return `${baseUrl}${path}`;
}

function getCookieValue(name: string) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : "";
}

function setCookieValue(name: string, value: string) {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${oneYear}; path=/; samesite=lax`;
}
function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

function trackPedoRegistration({
  parentName,
  mobile,
  childCount,
  preferredDate,
}: {
  parentName: string;
  mobile: string;
  childCount: number;
  preferredDate: string;
}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "pedo-registration",
    parent_name: parentName,
    mobile_number: mobile,
    child_count: childCount,
    preferred_date: preferredDate,
  });
}

function PhoneOtpField({
  onVerifiedPhoneChange,
  disabled,
}: {
  onVerifiedPhoneChange: (phoneNumber: string | null) => void;
  disabled?: boolean;
}) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpState, setOtpState] = useState<PhoneOtpState>("idle");
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const phoneIsValid = /^\d{10}$/.test(phone);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(PHONE_VERIFICATION_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored) as { phoneNumber?: string; verifiedAt?: number };
      const isFresh = parsed.verifiedAt && Date.now() - parsed.verifiedAt < 30 * 24 * 60 * 60 * 1000;
      if (parsed.phoneNumber && /^\d{10}$/.test(parsed.phoneNumber) && isFresh) {
        setPhone(parsed.phoneNumber);
        setOtpState("verified");
        onVerifiedPhoneChange(parsed.phoneNumber);
      }
    } catch {
      window.sessionStorage.removeItem(PHONE_VERIFICATION_KEY);
    }
  }, [onVerifiedPhoneChange]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  function updatePhone(value: string) {
    const nextPhone = value.replace(/\D/g, "").slice(0, 10);
    setPhone(nextPhone);
    setOtp("");
    setOtpState("idle");
    setMessage("");
    onVerifiedPhoneChange(null);
    window.sessionStorage.removeItem(PHONE_VERIFICATION_KEY);
  }

  async function sendOtp() {
    if (!phoneIsValid || loading || disabled || cooldown > 0) return;
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/pedo-dentist-free-consultation/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string; cooldownSeconds?: number };

      if (!response.ok || !payload.ok) {
        setMessage(payload.error || "Could not send OTP. Please try again.");
        if (payload.cooldownSeconds) setCooldown(payload.cooldownSeconds);
        return;
      }

      setOtpState("sent");
      setCooldown(payload.cooldownSeconds || 60);
      setMessage("OTP sent on WhatsApp.");
    } catch {
      setMessage("Could not send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (!phoneIsValid || !/^\d{6}$/.test(otp) || loading || disabled) return;
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/pedo-dentist-free-consultation/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !payload.ok) {
        setMessage(payload.error || "Could not verify OTP. Please try again.");
        return;
      }

      setOtpState("verified");
      setOtp("");
      setMessage("Mobile number verified.");
      onVerifiedPhoneChange(phone);
      window.sessionStorage.setItem(PHONE_VERIFICATION_KEY, JSON.stringify({ phoneNumber: phone, verifiedAt: Date.now() }));
    } catch {
      setMessage("Could not verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function changePhone() {
    setPhone("");
    setOtp("");
    setOtpState("idle");
    setMessage("");
    onVerifiedPhoneChange(null);
    window.sessionStorage.removeItem(PHONE_VERIFICATION_KEY);
  }

  return (
    <div className="pedo-phone-otp-field">
      <span className="pedo-phone-label">Mobile number *</span>
      <div className={`pedo-phone-row ${otpState === "verified" ? "verified" : ""}`}>
        <span className="pedo-phone-prefix" aria-label="India country code">
          +91
        </span>
        <input
          required
          autoComplete="tel-national"
          inputMode="numeric"
          pattern="[0-9]{10}"
          placeholder="10 digit number"
          type="tel"
          value={phone}
          disabled={disabled || otpState === "verified"}
          onChange={(event) => updatePhone(event.target.value)}
        />
        {otpState === "verified" ? (
          <button type="button" className="pedo-otp-action verified" onClick={changePhone} disabled={disabled}>
            <RotateCcw size={15} />
            Change
          </button>
        ) : (
          <button
            type="button"
            className="pedo-otp-action"
            onClick={sendOtp}
            disabled={disabled || loading || !phoneIsValid || cooldown > 0}
          >
            {loading && otpState !== "sent" ? <Loader2 size={15} /> : null}
            {cooldown > 0 && otpState === "sent" ? `${cooldown}s` : "Send OTP"}
          </button>
        )}
      </div>

      {otpState === "sent" && (
        <div className="pedo-otp-row">
          <input
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            placeholder="6 digit OTP"
            value={otp}
            disabled={disabled}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
          />
          <button
            type="button"
            className="pedo-otp-action"
            onClick={verifyOtp}
            disabled={disabled || loading || !/^\d{6}$/.test(otp)}
          >
            {loading ? <Loader2 size={15} /> : null}
            Verify
          </button>
        </div>
      )}

      {otpState === "verified" && (
        <span className="pedo-otp-success">
          <CheckCircle2 size={15} />
          Verified for WhatsApp: 91{phone}
        </span>
      )}
      {message && <span className={otpState === "verified" ? "pedo-otp-message success" : "pedo-otp-message"}>{message}</span>}
    </div>
  );
}

type RecordingState = "idle" | "requesting" | "recording" | "uploading";
type FeedbackMode = "manual" | "voice";

const concerns = [
  "Cavity or black tooth",
  "Tooth pain or sensitivity",
  "Milk tooth falling or shaking",
  "New tooth coming irregularly",
  "Brushing or food habit guidance",
  "First dental check-up",
  "Other concern",
];

const childAgeOptions = Array.from({ length: 11 }, (_, index) => String(index + 2));
const maxChildren = 3;

const initialForm: FormState = {
  date: campaignDates[0].value,
  parentName: "",
  mobile: "",
  children: [{ name: "", age: "" }],
  concern: "",
  otherConcern: "",
  childNotPresent: false,
};

export function PedoDentistCampaignForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "error" | "sending" | "sent" | "preview">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [phoneFieldKey, setPhoneFieldKey] = useState(0);
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>("manual");
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [voiceError, setVoiceError] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const discardRecordingRef = useRef(false);
  const translationWebhookUrl = useMemo(() => buildWebhookUrl(TRANSLATION_WEBHOOK_PATH), []);
  const showOtherConcern = form.concern === "Other concern";
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - attempts);
  const handleVerifiedPhoneChange = useCallback((phoneNumber: string | null) => {
    setVerifiedPhone(phoneNumber);
    setForm((current) => ({ ...current, mobile: phoneNumber || "" }));
  }, []);

  useEffect(() => {
    const savedAttempts = Number.parseInt(getCookieValue(ATTEMPT_COOKIE), 10);
    if (!Number.isNaN(savedAttempts)) {
      setAttempts(Math.min(Math.max(savedAttempts, 0), MAX_ATTEMPTS));
    }

    return () => {
      stopTimer();
      stopStream();
    };
  }, []);

  function stopTimer() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function incrementAttempts() {
    setAttempts((current) => {
      const next = Math.min(current + 1, MAX_ATTEMPTS);
      setCookieValue(ATTEMPT_COOKIE, String(next));
      return next;
    });
  }

  function updateChild(index: number, details: Partial<ChildDetails>) {
    setForm((current) => ({
      ...current,
      children: current.children.map((child, childIndex) =>
        childIndex === index ? { ...child, ...details } : child,
      ),
    }));
  }

  function addChild() {
    setForm((current) => {
      if (current.children.length >= maxChildren) return current;
      return { ...current, children: [...current.children, { name: "", age: "" }] };
    });
  }

  function removeChild(index: number) {
    setForm((current) => {
      if (current.children.length === 1) return current;
      return { ...current, children: current.children.filter((_, childIndex) => childIndex !== index) };
    });
  }

  async function startRecording() {
    setVoiceError("");
    setFeedbackMode("voice");

    if (!translationWebhookUrl) {
      setVoiceError("Voice to text is not configured. You can still type your concern below.");
      return;
    }

    if (attemptsLeft <= 0 || recordingState !== "idle") return;

    try {
      setRecordingState("requesting");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        stopTimer();
        stopStream();
        if (discardRecordingRef.current) {
          discardRecordingRef.current = false;
          chunksRef.current = [];
          setRecordingState("idle");
          setRecordingSeconds(0);
          return;
        }

        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (audioBlob.size > 0) {
          void sendAudioForTranslation(audioBlob);
        } else {
          setRecordingState("idle");
          setVoiceError("No audio was captured. Please try again or type your concern.");
        }
      };

      discardRecordingRef.current = false;
      setRecordingSeconds(0);
      setRecordingState("recording");
      recorder.start();

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((current) => {
          const next = current + 1;
          if (next >= MAX_RECORDING_SECONDS) {
            stopRecording();
            return MAX_RECORDING_SECONDS;
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      setRecordingState("idle");
      setVoiceError("Microphone access was blocked or unavailable. You can still type your concern.");
    }
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  }

  function deleteRecording() {
    discardRecordingRef.current = true;
    stopRecording();
  }

  async function sendAudioForTranslation(audioBlob: Blob) {
    setRecordingState("uploading");
    incrementAttempts();

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "pedo-concern.webm");
      formData.append("language", "en");
      formData.append("source", "dantam-pedo-dentist-free-consultation");

      const response = await fetch(translationWebhookUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Translation webhook failed with ${response.status}`);
      }

      const data = (await response.json()) as { text?: string; language?: string };
      setForm((current) => ({ ...current, otherConcern: data.text?.trim() || "" }));
      setVoiceError(data.text ? "" : "The audio was received, but no text came back. You can type your concern.");
    } catch (err) {
      console.error(err);
      setVoiceError("We could not convert the voice note right now. You can type your concern below.");
    } finally {
      setRecordingState("idle");
      setRecordingSeconds(0);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const children = form.children.map((child) => ({
      name: child.name.trim(),
      age: child.age.trim(),
    }));
    const hasInvalidChild = children.some((child) => !child.name || !child.age);

    if (!form.date || !form.parentName.trim() || !verifiedPhone || hasInvalidChild || (showOtherConcern && !form.otherConcern.trim())) {
      setErrorMessage(!verifiedPhone ? "Please verify your mobile number first." : "Please check the required fields and try again.");
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/pedo-dentist-free-consultation/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          mobile: verifiedPhone,
          children,
          childName: children[0]?.name || "",
          childAge: children[0]?.age || "",
          campaign: "Pedo Dentist Free Consultation",
          selectedDateLabel: campaignDates.find((day) => day.value === form.date)?.label,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrorMessage(payload?.error || "Please check the required fields and try again.");
        setStatus("error");
        return;
      }

      const payload = (await response.json()) as { forwarded?: boolean };
      if (payload.forwarded) {
        trackPedoRegistration({
          parentName: form.parentName.trim(),
          mobile: verifiedPhone,
          childCount: children.length,
          preferredDate: form.date,
        });
      }
      setStatus(payload.forwarded ? "sent" : "preview");
      setForm(initialForm);
      setVerifiedPhone(null);
      setPhoneFieldKey((current) => current + 1);
    } catch {
      setErrorMessage("We could not submit the form right now. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form className="pedo-campaign-form" onSubmit={onSubmit}>
      <div className="pedo-form-header">
        <div>
          <div className="eyebrow">Reserve your visit</div>
          <h2>Book your free consultation</h2>
        </div>
        <CalendarCheck aria-hidden="true" size={34} />
      </div>
      <p>
        Our team may call or WhatsApp you to confirm your visit at the Majiwada clinic during the campaign week.
      </p>

      <SelectPicker
        label="Select preferred date *"
        value={form.date}
        options={campaignDates.map((day) => ({
          value: day.value,
          label: day.label,
          description: "Majiwada clinic",
        }))}
        onChange={(date) => setForm({ ...form, date })}
        className="pedo-date-picker"
      />

      <div className="pedo-form-grid">
        <label className="pedo-parent-field">
          Parent name *
          <input
            required
            autoComplete="name"
            autoCapitalize="words"
            value={form.parentName}
            onChange={(event) => setForm({ ...form, parentName: event.target.value })}
          />
        </label>
        <div className="pedo-child-fields">
          {form.children.map((child, index) => (
            <div className="pedo-child-row" key={index}>
              <label>
                {index === 0 ? "Child name *" : `Child ${index + 1} name *`}
                <input
                  required
                  autoComplete="off"
                  autoCapitalize="words"
                  value={child.name}
                  onChange={(event) => updateChild(index, { name: event.target.value })}
                />
              </label>
              <label>
                Age *
                <select
                  required
                  value={child.age}
                  onChange={(event) => updateChild(index, { age: event.target.value })}
                >
                  <option value="">Age</option>
                  {childAgeOptions.map((age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
              </label>
              {index === 0 ? (
                <button
                  className="pedo-child-icon-button"
                  type="button"
                  onClick={addChild}
                  disabled={form.children.length >= maxChildren}
                  aria-label="Add another child"
                  title="Add another child"
                >
                  <Plus size={18} />
                </button>
              ) : (
                <button
                  className="pedo-child-icon-button danger"
                  type="button"
                  onClick={() => removeChild(index)}
                  aria-label={`Remove child ${index + 1}`}
                  title={`Remove child ${index + 1}`}
                >
                  <Trash2 size={17} />
                </button>
              )}
            </div>
          ))}
        </div>
        <SelectPicker
          label="Main concern"
          value={form.concern}
          options={[
            { value: "", label: "Select main concern" },
            ...concerns.map((concern) => ({ value: concern, label: concern })),
          ]}
          onChange={(concern) => {
            setForm({ ...form, concern });
            setVoiceError("");
          }}
          className="pedo-concern-field"
        />

        {showOtherConcern && (
          <label className="feedback-textarea pedo-other-concern-field">
            <span className="feedback-textarea-box">
              <span className="feedback-mode-tabs" role="tablist" aria-label="Other concern">
                <button
                  className={feedbackMode === "manual" ? "active" : ""}
                  type="button"
                  onClick={() => setFeedbackMode("manual")}
                  disabled={recordingState === "uploading"}
                >
                  Type manually
                </button>
                <button
                  className={feedbackMode === "voice" ? "active" : ""}
                  type="button"
                  onClick={startRecording}
                  disabled={recordingState !== "idle" || attemptsLeft === 0}
                >
                  {recordingState === "requesting" && feedbackMode === "voice" ? <Loader2 size={16} /> : null}
                  Use Voice
                </button>
              </span>
              <textarea
                required
                value={form.otherConcern}
                onChange={(event) => {
                  setForm({ ...form, otherConcern: event.target.value });
                  if (feedbackMode !== "manual") setFeedbackMode("manual");
                }}
                rows={5}
                placeholder="Tell us what you are noticing in your child's teeth or oral health."
                readOnly={feedbackMode === "voice" && recordingState === "recording"}
              />
              <span className="feedback-meta">
                {recordingState === "recording"
                  ? formatTime(recordingSeconds)
                  : recordingState === "requesting"
                    ? "Starting microphone..."
                    : recordingState === "uploading"
                      ? "Converting voice to text..."
                      : attemptsLeft === 0
                        ? `Voice attempts: ${attempts}/${MAX_ATTEMPTS}. You have used all recording attempts. You can still type your concern.`
                        : `Voice attempts: ${attempts}/${MAX_ATTEMPTS}`}
              </span>
              <span className="feedback-record-controls">
                {recordingState === "recording" ? (
                  <>
                    <button className="record-pill danger" type="button" onClick={deleteRecording}>
                      <Trash2 size={16} />
                      Delete
                    </button>
                    <button className="record-pill stop" type="button" onClick={stopRecording}>
                      <Square size={15} />
                      Stop
                    </button>
                  </>
                ) : null}
              </span>
            </span>
            {voiceError && <span className="pedo-voice-error">{voiceError}</span>}
          </label>
        )}

        <PhoneOtpField
          key={phoneFieldKey}
          disabled={status === "sending"}
          onVerifiedPhoneChange={handleVerifiedPhoneChange}
        />
      </div>

      <label className="pedo-child-visit-check">
        <input
          type="checkbox"
          checked={form.childNotPresent}
          onChange={(event) => setForm({ ...form, childNotPresent: event.target.checked })}
        />
        <span>
          <strong>My child will not be present for this visit</strong>
          <small>
            I understand this will be a parent guidance consultation based on the details I share. The dentist may
            recommend bringing my child for an in-person check-up if needed.
          </small>
        </span>
      </label>

      <button className="button primary" type="submit" disabled={status === "sending"}>
        <Send size={17} />
        {status === "sending" ? "Sending..." : "Confirm free consultation"}
      </button>

      {status === "error" && <div className="form-status error">{errorMessage || "Please check the required fields and try again."}</div>}
      {status === "sent" && <div className="form-status sent">Your registration details were sent successfully.</div>}
      {status === "preview" && (
        <div className="form-status sent">Local preview received. Add the pedo campaign webhook URL to forward these details.</div>
      )}
    </form>
  );
}
