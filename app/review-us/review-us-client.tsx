"use client";

import { CheckCircle2, Clipboard, Copy, ExternalLink, Loader2, Mic, Send, Square, Star, Trash2 } from "lucide-react";
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

async function copyTextToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      textarea.remove();
    }
  }
}

export function ReviewUsClient() {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [language, setLanguage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const discardRecordingRef = useRef(false);

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
          setError("No audio was captured. Please try again.");
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
      setError("Microphone access was blocked or unavailable. You can still type your review below.");
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
      setError(data.text ? "" : "The audio was received, but no text came back. You can type your review below.");
    } catch (err) {
      console.error(err);
      setError("We could not convert the voice note right now. You can type or edit your review below.");
    } finally {
      setRecordingState("idle");
      setRecordingSeconds(0);
    }
  }

  async function copyAndContinue() {
    setError("");
    const text = reviewText.trim();
    if (!text) {
      setError("Please add your review text before continuing to Google Reviews.");
      return;
    }

    const wasCopied = await copyTextToClipboard(text);
    if (!wasCopied) {
      setCopied(false);
      setError("We could not copy the text automatically. Please tap Copy, then continue to Google Review.");
      return;
    }

    setCopied(true);
    window.setTimeout(() => {
      window.location.href = GOOGLE_REVIEW_URL;
    }, 150);
  }

  async function copyDraft() {
    setError("");
    const text = reviewText.trim();
    if (!text) {
      setError("Please add your review text before copying.");
      return;
    }

    try {
      const wasCopied = await copyTextToClipboard(text);
      if (!wasCopied) throw new Error("Clipboard copy failed");
      setCopied(true);
    } catch {
      setError("We could not copy the text automatically. Please select and copy it manually.");
    }
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

          {attemptsLeft === 0 && (
            <div className="notice">
              You have used all recording attempts. You can still type or edit your review below.
            </div>
          )}

          <label className="review-textarea">
            Your Google review draft
            <span className="draft-box">
              <span className="draft-top-controls">
                <button type="button" onClick={copyDraft} aria-label="Copy review draft">
                  <Copy size={16} />
                  Copy
                </button>
              </span>
              <textarea
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                rows={9}
                placeholder="Record your experience or type it here. Talk about your treatment, comfort, doctors, staff, cleanliness, or anything that stood out."
              />
              <span className="draft-meta">
                {recordingState === "recording"
                  ? formatTime(recordingSeconds)
                  : recordingState === "uploading"
                    ? "Converting voice to text..."
                    : `Usage Count: ${attempts}/${MAX_ATTEMPTS}`}
              </span>
              <span className="draft-record-controls" aria-label="Recording controls">
                {recordingState === "recording" ? (
                  <>
                    <button className="draft-icon-button danger" type="button" onClick={deleteRecording} aria-label="Delete recording">
                      <Trash2 size={17} />
                      Delete
                    </button>
                    <button className="draft-icon-button stop" type="button" onClick={stopRecording} aria-label="Stop recording">
                      <Square size={16} fill="currentColor" />
                      Stop
                    </button>
                  </>
                ) : (
                  <button
                    className={`draft-mic-button ${recordingState}`}
                    type="button"
                    onClick={startRecording}
                    disabled={recordingState === "uploading" || attemptsLeft === 0}
                    aria-label="Record voice review"
                  >
                    {recordingState === "uploading" ? <Loader2 size={22} /> : <Mic size={24} />}
                  </button>
                )}
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
