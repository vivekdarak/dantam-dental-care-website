"use client";

import { CalendarCheck, Loader2, Send, Square, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { SelectPicker } from "@/components/select-picker";

type FormState = {
  date: string;
  parentName: string;
  mobile: string;
  childName: string;
  childAge: string;
  concern: string;
  otherConcern: string;
};

type CampaignDate = {
  value: string;
  label: string;
  shortLabel: string;
};

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

const initialForm: FormState = {
  date: campaignDates[0].value,
  parentName: "",
  mobile: "",
  childName: "",
  childAge: "",
  concern: "",
  otherConcern: "",
};

export function PedoDentistCampaignForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "error" | "sending" | "sent" | "preview">("idle");
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

    if (!form.date || !form.parentName.trim() || !form.mobile.trim() || !form.childName.trim() || !form.childAge.trim() || !form.concern || (showOtherConcern && !form.otherConcern.trim())) {
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
          campaign: "Pedo Dentist Free Consultation",
          selectedDateLabel: campaignDates.find((day) => day.value === form.date)?.label,
        }),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      const payload = (await response.json()) as { forwarded?: boolean };
      setStatus(payload.forwarded ? "sent" : "preview");
      setForm(initialForm);
    } catch {
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
        <label>
          Parent name *
          <input
            required
            autoComplete="name"
            value={form.parentName}
            onChange={(event) => setForm({ ...form, parentName: event.target.value })}
          />
        </label>
        <label>
          Mobile number *
          <input
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="+91"
            type="tel"
            value={form.mobile}
            onChange={(event) => setForm({ ...form, mobile: event.target.value })}
          />
        </label>
        <label>
          Child name *
          <input
            required
            autoComplete="off"
            value={form.childName}
            onChange={(event) => setForm({ ...form, childName: event.target.value })}
          />
        </label>
        <label>
          Child age *
          <input
            required
            inputMode="numeric"
            min="2"
            max="12"
            type="number"
            value={form.childAge}
            onChange={(event) => setForm({ ...form, childAge: event.target.value })}
          />
        </label>
        <SelectPicker
          label="Main concern *"
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
      </div>

      {status === "error" && <div className="form-status error">Please check the required fields and try again.</div>}
      {status === "sent" && <div className="form-status sent">Your registration details were sent successfully.</div>}
      {status === "preview" && (
        <div className="form-status sent">Local preview received. Add the pedo campaign webhook URL to forward these details.</div>
      )}

      <button className="button primary" type="submit" disabled={status === "sending"}>
        <Send size={17} />
        {status === "sending" ? "Sending..." : "Confirm free consultation"}
      </button>
    </form>
  );
}
