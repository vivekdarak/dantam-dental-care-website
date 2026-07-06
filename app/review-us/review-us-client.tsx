"use client";

import { CheckCircle2, Clipboard, Loader2, Mic, Square, Star } from "lucide-react";
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

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

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
    if (rating < 4) {
      setError("Please submit private feedback for ratings below 4 stars.");
      return;
    }
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

  if (submitted) {
    return (
      <section className="review-page review-success">
        <div className="container review-success-card">
          <CheckCircle2 size={54} />
          <h1>Thank you for telling us.</h1>
          <p>
            Your feedback has reached the Dantam Dental Care team. We read every concern carefully
            and use it to make the next visit better.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="review-page">
      <div className="container review-grid">
        <div className="review-image">
          <Image
            src="/images/doctors-image.jpeg"
            alt="Doctors at Dantam Dental Care"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 44vw"
          />
        </div>

        <div className="review-panel">
          <div className="eyebrow">Patient Feedback</div>
          <h1>Review Dantam Dental Care</h1>
          <p className="lead">
            Your words help us care with more attention. Share what your visit felt like,
            and we will help turn your voice into review-ready text.
          </p>

          <div className="rating-block" aria-label="Select a star rating">
            <span>Your rating</span>
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
                  <strong>{attemptsLeft > 0 ? "Tap the mic to record your review" : "Recording attempts used"}</strong>
                  <span>
                    Attempts left: {attemptsLeft}. Maximum recording length is 120 seconds.
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
            Your review text
            <textarea
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
              rows={7}
              placeholder="Your transcribed review will appear here. You can also type your feedback manually."
            />
          </label>

          {language && <div className="language-note">Detected language: {language}</div>}
          {error && <div className="review-error">{error}</div>}
          {copied && <div className="notice">Review copied. Opening Google Reviews...</div>}

          <div className="review-actions">
            {rating >= 4 ? (
              <button className="button primary" type="button" onClick={copyAndContinue}>
                <Clipboard size={18} />
                Copy & Continue to Google Review
              </button>
            ) : (
              <button className="button primary" type="button" onClick={submitPrivateFeedback}>
                Submit private feedback
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
