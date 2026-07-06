"use client";

import { Check, CheckCircle2, Clipboard, Copy, ExternalLink, Loader2, Mic, Pencil, Send, Square, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import "./review-us.css";

const GOOGLE_REVIEW_URL = "https://g.page/r/CZTqDEbf8-hXEBM/review";
const TRANSLATION_WEBHOOK_PATH = "/webhook/dantam-translation";
const LOW_REVIEW_WEBHOOK_PATH = "/webhook/dantam-low-review";
const ATTEMPT_COOKIE = "dantam_review_attempts";
const MAX_ATTEMPTS = 5;
const MAX_RECORDING_SECONDS = 120;

type RecordingState = "idle" | "recording" | "uploading";

function getCookieValue(name: string) {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : "";
}

function setCookieValue(name: string, value: string) {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${oneYear}; path=/; samesite=lax`;
}

function buildWebhookUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_N8N_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) return "";
  return `${baseUrl}${path}`;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export function ReviewUsClient() {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [language, setLanguage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [secondsLeft, setSecondsLeft] = useState(MAX_RECORDING_SECONDS);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(true);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const reviewTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - attempts);
  const canRecord = attemptsLeft > 0 && recordingState === "idle";
  const translationWebhookUrl = useMemo(() => buildWebhookUrl(TRANSLATION_WEBHOOK_PATH), []);
  const lowReviewWebhookUrl = useMemo(() => buildWebhookUrl(LOW_REVIEW_WEBHOOK_PATH), []);

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
    setError("");
    setCopied(false);

    if (!rating) {
      setError("Please select a star rating before recording.");
      return;
    }

    if (!translationWebhookUrl) {
      setError("The n8n base URL is not configured. Please add NEXT_PUBLIC_N8N_BASE_URL.");
      return;
    }

    if (!canRecord) return;

    try {
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
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (audioBlob.size > 0) {
          void sendAudioForTranslation(audioBlob);
        } else {
          setRecordingState("idle");
          setError("No audio was captured. Please try again.");
        }
      };

      setSecondsLeft(MAX_RECORDING_SECONDS);
      setRecordingState("recording");
      recorder.start();

      timerRef.current = window.setInterval(() => {
        setSecondsLeft((current) => {
          if (current <= 1) {
            stopRecording();
            return 0;
          }
          return current - 1;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      setRecordingState("idle");
      setError("Microphone access was blocked or unavailable. You can still type your review below.");
    }
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  }

  async function sendAudioForTranslation(audioBlob: Blob) {
    setRecordingState("uploading");
    incrementAttempts();

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "review.webm");
      formData.append("rating", String(rating));
      formData.append("source", "dantam-review-us");

      const response = await fetch(translationWebhookUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Translation webhook failed with ${response.status}`);
      }

      const data = (await response.json()) as { text?: string; language?: string };
      setReviewText(data.text?.trim() || "");
      setLanguage(data.language || "");
      setIsEditingDraft(!data.text?.trim());
      setError(data.text ? "" : "The audio was received, but no text came back. You can type your review below.");
    } catch (err) {
      console.error(err);
      setError("We could not convert the voice note right now. You can type or edit your review below.");
    } finally {
      setRecordingState("idle");
      setSecondsLeft(MAX_RECORDING_SECONDS);
    }
  }

  async function copyAndContinue() {
    setError("");
    const text = reviewText.trim();
    if (!text) {
      setError("Please add your review text before continuing to Google Reviews.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }

    window.location.href = GOOGLE_REVIEW_URL;
  }

  async function copyDraft() {
    setError("");
    const text = reviewText.trim();
    if (!text) {
      setError("Please add your review text before copying.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setError("We could not copy the text automatically. Please select and copy it manually.");
    }
  }

  function toggleDraftEditing() {
    if (isEditingDraft) {
      setIsEditingDraft(false);
      return;
    }

    setIsEditingDraft(true);
    reviewTextareaRef.current?.focus();
  }

  async function submitPrivateFeedback() {
    setError("");
    const text = reviewText.trim();

    if (!rating) {
      setError("Please select a star rating.");
      return;
    }

    if (rating >= 4) {
      setError("Please continue to Google Review for 4 or 5 star feedback.");
      return;
    }

    if (!text) {
      setError("Please add your feedback before submitting.");
      return;
    }

    if (!lowReviewWebhookUrl) {
      setError("The n8n base URL is not configured. Please add NEXT_PUBLIC_N8N_BASE_URL.");
      return;
    }

    try {
      const response = await fetch(lowReviewWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          text,
          language,
          source: "dantam-review-us",
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Low review webhook failed with ${response.status}`);
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("We could not submit your feedback right now. Please try again.");
    }
  }

  function continueToGoogleReview() {
    window.location.href = GOOGLE_REVIEW_URL;
  }

  if (submitted) {
    return (
      <section className="review-page review-success">
        <div className="container review-success-card">
          <CheckCircle2 size={54} />
          <h1>Thank you for helping us improve.</h1>
          <p>
            Your feedback has been sent directly to the doctors and clinic management.
            We read every concern carefully and use it to make the next visit better.
          </p>
          <button className="button outline" type="button" onClick={continueToGoogleReview}>
            Continue to Google Review
            <ExternalLink size={17} />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="review-page">
      <div className="container review-grid">
        <div className="review-intro">
          <div className="intro-image">
            <Image
              src="/images/doctors-image.jpeg"
              alt="Doctors at Dantam Dental Care"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 34vw"
            />
          </div>
          <div className="intro-card">
            <div className="eyebrow">Google Review Helper</div>
            <h1>Say it in your words. We will help you write it.</h1>
            <p>
              Speak naturally in English, Hindi, Marathi, or any language you are comfortable with.
              Our tool converts your voice into clear English review text that you can edit, copy,
              and post on Google.
            </p>
            <div className="privacy-note">
              We use your audio only to create your review draft.
            </div>
          </div>
        </div>

        <div className="review-panel">
          <div className="tool-heading">
            <span>Step 1</span>
            <h2>How was your experience?</h2>
          </div>

          <div className="rating-block" aria-label="Select a star rating">
            <div className="star-row">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={value <= rating ? "selected" : ""}
                  aria-label={`${value} star${value > 1 ? "s" : ""}`}
                  onClick={() => {
                    setRating(value);
                    setError("");
                  }}
                >
                  <Star size={34} fill="currentColor" />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p>
                {rating >= 4
                  ? "Great. We will help you prepare a Google review draft."
                  : "We are sorry it was not a 5-star experience. You can send feedback directly to clinic management, and you may still continue to Google Review."}
              </p>
            )}
          </div>

          <div className="tool-heading spaced">
            <span>Step 2</span>
            <h2>Record your review</h2>
            <p>
              Talk about your treatment, comfort, doctors, staff, cleanliness, or anything that stood out.
              We will convert your voice into editable English text.
            </p>
          </div>

          <div className="recorder-card">
            <button
              type="button"
              className={`record-button ${recordingState}`}
              onClick={recordingState === "recording" ? stopRecording : startRecording}
              disabled={recordingState === "uploading" || attemptsLeft === 0}
            >
              {recordingState === "uploading" ? (
                <Loader2 size={38} />
              ) : recordingState === "recording" ? (
                <Square size={36} fill="currentColor" />
              ) : (
                <Mic size={42} />
              )}
            </button>

            <div className="recording-copy">
              {recordingState === "recording" && (
                <>
                  <strong>Recording... {formatTime(secondsLeft)} remaining</strong>
                  <span>Tap stop when you finish. Recording auto-stops at 2 minutes.</span>
                </>
              )}
              {recordingState === "uploading" && (
                <>
                  <strong>Converting your voice to text...</strong>
                  <span>Please keep this page open.</span>
                </>
              )}
              {recordingState === "idle" && (
                <>
                  <strong>{attemptsLeft > 0 ? "Tap the mic to record" : "Recording attempts used"}</strong>
                  <span>
                    Attempts left: {attemptsLeft} of {MAX_ATTEMPTS}. Maximum recording length is 120 seconds.
                  </span>
                </>
              )}
            </div>
          </div>

          {attemptsLeft === 0 && (
            <div className="notice">
              You have used all recording attempts. You can still type or edit your review below.
            </div>
          )}

          <label className="review-textarea">
            Your Google review draft
            <span className="draft-box">
              <textarea
                ref={reviewTextareaRef}
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                readOnly={reviewText.trim().length > 0 && !isEditingDraft}
                rows={7}
                placeholder="Your English review draft will appear here. Edit it before posting, or type your feedback manually."
              />
              <span className="draft-controls" aria-label="Review draft controls">
                <button type="button" onClick={toggleDraftEditing} aria-label={isEditingDraft ? "Save review draft" : "Edit review draft"}>
                  {isEditingDraft ? <Check size={16} /> : <Pencil size={16} />}
                  {isEditingDraft ? "Save" : "Edit"}
                </button>
                <button type="button" onClick={copyDraft} aria-label="Copy review draft">
                  <Copy size={16} />
                  Copy
                </button>
              </span>
            </span>
          </label>
          <div className="textarea-help">Edit this before copying. The final words should feel like yours.</div>

          {error && <div className="review-error">{error}</div>}
          {copied && <div className="notice">Review copied.</div>}

          <div className="review-actions">
            {rating >= 4 ? (
              <button className="button primary" type="button" onClick={copyAndContinue}>
                <Clipboard size={18} />
                Copy & Continue to Google Review
              </button>
            ) : (
              <>
                <div className="low-rating-note">
                  <strong>Give us an option to improve.</strong>
                  <span>
                    This feedback is personally delivered to the doctors and clinic management.
                  </span>
                </div>
                <div className="review-button-row">
                  <button className="button primary" type="button" onClick={submitPrivateFeedback}>
                    <Send size={18} />
                    Send feedback privately
                  </button>
                  <button className="button outline" type="button" onClick={copyAndContinue}>
                    <Clipboard size={18} />
                    Copy & Continue to Google Review
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
