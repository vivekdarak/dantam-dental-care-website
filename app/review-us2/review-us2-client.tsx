"use client";

import {
  CheckCircle2,
  ChevronLeft,
  Clipboard,
  ExternalLink,
  Loader2,
  Mic,
  Send,
  Square,
  Trash2,
} from "lucide-react";
import { type TouchEvent, useEffect, useMemo, useRef, useState } from "react";
import { OpeninaryImage } from "@/components/openinary-image";
import "./review-us2.css";

const GOOGLE_REVIEW_URL = "https://g.page/r/CZTqDEbf8-hXEBM/review";
const TRANSLATION_WEBHOOK_PATH = "/webhook/dantam-translation";
const FEEDBACK_WEBHOOK_PATH = "/webhook/dantam-evaluate-review";
const FORM_VERSION = "review-us2-v1";
const ATTEMPT_COOKIE = "dantam_review2_attempts";
const MAX_ATTEMPTS = 5;
const MAX_RECORDING_SECONDS = 120;
const AUTO_ADVANCE_MS = 500;

type Language = "en" | "mr" | "hi";
type RecordingState = "idle" | "requesting" | "recording" | "uploading";
type FeedbackMode = "manual" | "voice";
type SummaryStatus = "positive" | "private";
type TransitionDirection = "forward" | "backward";

type RatingKey = "overallExperience" | "dentistCare" | "appointmentExperience" | "cleanliness" | "recommendation";

type Question = {
  key: RatingKey;
  labels: Record<Language, string>;
};

type N8nResponse = {
  sentiment?: string;
  reviewStatus?: string;
  googleEligible?: boolean;
  positive?: boolean;
  reviewText?: string;
  text?: string;
  message?: string;
};

const questions: Question[] = [
  {
    key: "overallExperience",
    labels: {
      en: "How would you rate your overall experience at the clinic?",
      mr: "क्लिनिकमधील तुमचा एकूण अनुभव कसा होता?",
      hi: "क्लिनिक में आपका कुल अनुभव कैसा था?",
    },
  },
  {
    key: "dentistCare",
    labels: {
      en: "How would you rate the dentist's care and attention?",
      mr: "डॉक्टरांची काळजी आणि लक्ष तुम्हाला कसे वाटले?",
      hi: "डेंटिस्ट की देखभाल और ध्यान आपको कैसा लगा?",
    },
  },
  {
    key: "appointmentExperience",
    labels: {
      en: "How would you rate the waiting time and appointment experience?",
      mr: "वेटिंग टाइम आणि अपॉइंटमेंटचा अनुभव कसा होता?",
      hi: "प्रतीक्षा समय और अपॉइंटमेंट का अनुभव कैसा था?",
    },
  },
  {
    key: "cleanliness",
    labels: {
      en: "How would you rate the cleanliness and hygiene of the clinic?",
      mr: "क्लिनिकची स्वच्छता आणि हायजीन तुम्हाला कसे वाटले?",
      hi: "क्लिनिक की सफाई और हाइजीन आपको कैसा लगा?",
    },
  },
  {
    key: "recommendation",
    labels: {
      en: "How likely are you to recommend our clinic to your friends and family?",
      mr: "तुम्ही आमचे क्लिनिक मित्र-परिवाराला सुचवाल का?",
      hi: "आप हमारे क्लिनिक को दोस्तों और परिवार को कितना सुझाएंगे?",
    },
  },
];

const copy = {
  en: {
    language: "Language",
    eyebrow: "Patient Feedback",
    title: "How was your visit to Dantam?",
    intro:
      "Your feedback helps our doctors improve every visit. If your experience was good, we will help you share your own words on Google.",
    private: "Your feedback is first sent privately to the clinic.",
    progress: "Question",
    skip: "Skip & continue",
    continue: "Continue",
    evaluating: "Submitting your feedback... please wait",
    back: "Back",
    ratingLabels: ["Very poor", "Poor", "Okay", "Good", "Excellent"],
    feedbackTitle: "Tell us about your visit",
    feedbackHelp: "Type your feedback or use voice to text. Your words stay editable before anything is copied.",
    feedbackRequired: "Please type your feedback or use voice to text before continuing.",
    feedbackWordCount: "Please write more than 6 words about your visit.",
    typeManually: "Type Manually",
    voiceToText: "Use Voice to Text",
    placeholder: "Share what you liked, how the doctors and staff helped, or anything we should improve.",
    record: "Record",
    stop: "Stop",
    delete: "Delete",
    attempts: "Usage Count",
    converting: "Converting voice to text...",
    requesting: "Starting microphone...",
    blankSummaryTitle: "Review your feedback",
    blankSummaryText: "You have shared ratings. You can submit them privately, or go back and add a few words.",
    positiveTitle: "Your words can help another patient choose care with confidence.",
    positiveText: "Copy your feedback and open Google Reviews. Paste it there to share your experience publicly.",
    privateTitle: "Thank you for sharing this with us.",
    privateText: "Your feedback has been received by the clinic team and will be reviewed carefully.",
    privateNameTitle: "Please share your name",
    privateNameHelp: "Please share your name or use Anonymous to submit the feedback.",
    privateNamePlaceholder: "Your name",
    anonymous: "Use Anonymous",
    privateNameRequired: "Please enter your name before submitting.",
    copyGoogle: "Copy & Open Google Review",
    submitPrivate: "Submit Feedback",
    done: "Done",
    edit: "Edit feedback",
    saved: "Feedback received.",
    copied: "Review copied.",
  },
  mr: {
    language: "भाषा",
    eyebrow: "रुग्ण अभिप्राय",
    title: "Dantam मधील तुमची भेट कशी होती?",
    intro:
      "तुमचा अभिप्राय आमच्या डॉक्टरांना प्रत्येक भेट अधिक चांगली करण्यात मदत करतो. अनुभव चांगला असेल तर तुमचेच शब्द Google वर शेअर करता येतील.",
    private: "तुमचा अभिप्राय आधी क्लिनिककडे खाजगीपणे पाठवला जातो.",
    progress: "प्रश्न",
    skip: "स्किप करा आणि पुढे जा",
    continue: "पुढे जा",
    evaluating: "तुमचा अभिप्राय सबमिट करत आहे... कृपया थांबा",
    back: "मागे",
    ratingLabels: ["खूप खराब", "खराब", "ठीक", "चांगले", "उत्कृष्ट"],
    feedbackTitle: "तुमच्या भेटीबद्दल सांगा",
    feedbackHelp: "टाइप करा किंवा आवाज वापरा. कॉपी करण्यापूर्वी शब्द बदलता येतील.",
    feedbackRequired: "पुढे जाण्यापूर्वी अभिप्राय टाइप करा किंवा आवाजातून टेक्स्ट वापरा.",
    feedbackWordCount: "कृपया तुमच्या भेटीबद्दल 6 पेक्षा जास्त शब्द लिहा.",
    typeManually: "स्वतः टाइप करा",
    voiceToText: "आवाजातून टेक्स्ट",
    placeholder: "काय आवडले, डॉक्टर/स्टाफने कशी मदत केली, किंवा काय सुधारावे ते लिहा.",
    record: "रेकॉर्ड",
    stop: "थांबवा",
    delete: "डिलीट",
    attempts: "वापर संख्या",
    converting: "आवाज टेक्स्टमध्ये बदलत आहे...",
    requesting: "मायक्रोफोन सुरू करत आहे...",
    blankSummaryTitle: "तुमचा अभिप्राय तपासा",
    blankSummaryText: "तुम्ही रेटिंग दिले आहे. ते खाजगीपणे पाठवा किंवा परत जाऊन काही शब्द जोडा.",
    positiveTitle: "तुमचे शब्द दुसऱ्या रुग्णाला विश्वासाने निवड करण्यात मदत करू शकतात.",
    positiveText: "तुमचा अभिप्राय कॉपी करा आणि Google Reviews उघडा. तिथे पेस्ट करून अनुभव शेअर करा.",
    privateTitle: "तुमचा प्रामाणिक अभिप्राय दिल्याबद्दल धन्यवाद.",
    privateText: "तुमचा अभिप्राय क्लिनिक टीमला मिळाला आहे आणि काळजीपूर्वक पाहिला जाईल.",
    privateNameTitle: "कृपया तुमचे नाव सांगा",
    privateNameHelp: "कृपया तुमचे नाव लिहा किंवा Anonymous वापरून अभिप्राय सबमिट करा.",
    privateNamePlaceholder: "तुमचे नाव",
    anonymous: "Anonymous वापरा",
    privateNameRequired: "सबमिट करण्यापूर्वी कृपया तुमचे नाव लिहा.",
    copyGoogle: "कॉपी करा आणि Google Review उघडा",
    submitPrivate: "अभिप्राय पाठवा",
    done: "पूर्ण",
    edit: "अभिप्राय बदला",
    saved: "अभिप्राय मिळाला.",
    copied: "रिव्ह्यू कॉपी झाला.",
  },
  hi: {
    language: "भाषा",
    eyebrow: "रोगी प्रतिक्रिया",
    title: "Dantam में आपकी विजिट कैसी रही?",
    intro:
      "आपकी प्रतिक्रिया हमारे डॉक्टरों को हर विजिट बेहतर बनाने में मदद करती है। अनुभव अच्छा हो तो आप अपने शब्द Google पर साझा कर सकते हैं।",
    private: "आपकी प्रतिक्रिया पहले क्लिनिक को निजी रूप से भेजी जाती है।",
    progress: "प्रश्न",
    skip: "स्किप करके आगे बढ़ें",
    continue: "आगे बढ़ें",
    evaluating: "आपकी प्रतिक्रिया सबमिट हो रही है... कृपया प्रतीक्षा करें",
    back: "पीछे",
    ratingLabels: ["बहुत खराब", "खराब", "ठीक", "अच्छा", "उत्कृष्ट"],
    feedbackTitle: "अपनी विजिट के बारे में बताएं",
    feedbackHelp: "टाइप करें या वॉइस टू टेक्स्ट इस्तेमाल करें। कॉपी करने से पहले शब्द बदले जा सकते हैं।",
    feedbackRequired: "आगे बढ़ने से पहले प्रतिक्रिया टाइप करें या वॉइस टू टेक्स्ट इस्तेमाल करें.",
    feedbackWordCount: "कृपया अपनी विजिट के बारे में 6 से अधिक शब्द लिखें.",
    typeManually: "खुद टाइप करें",
    voiceToText: "वॉइस टू टेक्स्ट",
    placeholder: "क्या अच्छा लगा, डॉक्टर/स्टाफ ने कैसे मदद की, या क्या सुधारना चाहिए, लिखें.",
    record: "रिकॉर्ड",
    stop: "रोकें",
    delete: "डिलीट",
    attempts: "उपयोग संख्या",
    converting: "आवाज को टेक्स्ट में बदल रहे हैं...",
    requesting: "माइक्रोफोन शुरू हो रहा है...",
    blankSummaryTitle: "अपनी प्रतिक्रिया देखें",
    blankSummaryText: "आपने रेटिंग दी है। इसे निजी रूप से भेजें, या वापस जाकर कुछ शब्द जोड़ें।",
    positiveTitle: "आपके शब्द दूसरे मरीज को भरोसे से सही care चुनने में मदद कर सकते हैं.",
    positiveText: "अपनी प्रतिक्रिया कॉपी करें और Google Reviews खोलें। वहां पेस्ट करके अनुभव साझा करें।",
    privateTitle: "ईमानदार प्रतिक्रिया देने के लिए धन्यवाद.",
    privateText: "आपकी प्रतिक्रिया क्लिनिक टीम को मिल गई है और ध्यान से देखी जाएगी.",
    privateNameTitle: "कृपया अपना नाम बताएं",
    privateNameHelp: "कृपया अपना नाम लिखें या Anonymous का उपयोग करके प्रतिक्रिया सबमिट करें.",
    privateNamePlaceholder: "आपका नाम",
    anonymous: "Anonymous इस्तेमाल करें",
    privateNameRequired: "सबमिट करने से पहले कृपया अपना नाम लिखें.",
    copyGoogle: "कॉपी करें और Google Review खोलें",
    submitPrivate: "प्रतिक्रिया भेजें",
    done: "Done",
    edit: "प्रतिक्रिया बदलें",
    saved: "प्रतिक्रिया मिल गई.",
    copied: "Review कॉपी हो गया.",
  },
} as const;

const languageLabels: Record<Language, string> = {
  en: "English",
  mr: "मराठी",
  hi: "हिंदी",
};

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

function isGoogleEligible(data: N8nResponse) {
  if (typeof data.googleEligible === "boolean") return data.googleEligible;
  if (typeof data.positive === "boolean") return data.positive;
  const value = `${data.reviewStatus || data.sentiment || ""}`.toLowerCase();
  return ["positive", "good", "google", "eligible", "googleeligible"].includes(value);
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function ReviewUs2Client() {
  const [language, setLanguage] = useState<Language>("en");
  const [step, setStep] = useState(0);
  const [ratings, setRatings] = useState<Partial<Record<RatingKey, number>>>({});
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>("manual");
  const [feedbackText, setFeedbackText] = useState("");
  const [summaryStatus, setSummaryStatus] = useState<SummaryStatus | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [patientName, setPatientName] = useState("");
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>("forward");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const advanceTimerRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const discardRecordingRef = useRef(false);

  const translationWebhookUrl = useMemo(() => buildWebhookUrl(TRANSLATION_WEBHOOK_PATH), []);
  const feedbackWebhookUrl = useMemo(() => buildWebhookUrl(FEEDBACK_WEBHOOK_PATH), []);
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - attempts);
  const content = copy[language];
  const feedbackWordCount = countWords(feedbackText);
  const hasEnoughFeedbackWords = feedbackWordCount > 6;
  const isFeedbackStep = step === questions.length;
  const isSummaryStep = step > questions.length;

  useEffect(() => {
    const savedAttempts = Number.parseInt(getCookieValue(ATTEMPT_COOKIE), 10);
    if (!Number.isNaN(savedAttempts)) {
      setAttempts(Math.min(Math.max(savedAttempts, 0), MAX_ATTEMPTS));
    }

    return () => {
      stopTimer();
      clearAdvanceTimer();
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

  function clearAdvanceTimer() {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }

  function selectRating(key: RatingKey, value: number) {
    clearAdvanceTimer();
    setRatings((current) => ({ ...current, [key]: value }));
    setError("");

    advanceTimerRef.current = window.setTimeout(() => {
      setTransitionDirection("forward");
      setStep((current) => Math.min(current + 1, questions.length));
      advanceTimerRef.current = null;
    }, AUTO_ADVANCE_MS);
  }

  function continueFromRating() {
    setError("");
    setTransitionDirection("forward");
    setStep((current) => Math.min(current + 1, questions.length));
  }

  function goBack() {
    clearAdvanceTimer();
    setError("");
    setCopied(false);
    setSummaryStatus(null);
    setSubmitted(false);
    setTransitionDirection("backward");
    setStep((current) => Math.max(0, current - 1));
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    if (isSummaryStep || isEvaluating) return;
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) < 55 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;

    if (isSummaryStep || isEvaluating) return;

    if (deltaX > 0) {
      goBack();
      return;
    }

    if (!isFeedbackStep && !isSummaryStep) {
      const currentQuestion = questions[step];
      if (ratings[currentQuestion.key]) {
        clearAdvanceTimer();
        continueFromRating();
      }
    }
  }

  async function startRecording() {
    setError("");
    setCopied(false);
    setFeedbackMode("voice");

    if (!translationWebhookUrl) {
      setError("The n8n base URL is not configured. Please add NEXT_PUBLIC_N8N_BASE_URL.");
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
          setError("No audio was captured. Please try again or type your feedback.");
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
      setError("Microphone access was blocked or unavailable. You can still type your feedback.");
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
      formData.append("audio", audioBlob, "feedback.webm");
      formData.append("language", language);
      formData.append("ratings", JSON.stringify(ratings));
      formData.append("source", "dantam-review-us2");

      const response = await fetch(translationWebhookUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Translation webhook failed with ${response.status}`);
      }

      const data = (await response.json()) as { text?: string; language?: string };
      setFeedbackText(data.text?.trim() || "");
      setError(data.text ? "" : "The audio was received, but no text came back. You can type your feedback.");
    } catch (err) {
      console.error(err);
      setError("We could not convert the voice note right now. You can type your feedback below.");
    } finally {
      setRecordingState("idle");
      setRecordingSeconds(0);
    }
  }

  function payload() {
    const ratingAnswers = questions.map((question) => ({
      questionId: question.key,
      question: question.labels[language],
      rating: ratings[question.key] ?? null,
    }));

    return {
      formVersion: FORM_VERSION,
      language,
      ratings,
      ratingAnswers,
      feedbackText: feedbackText.trim(),
      source: "dantam-review-us2",
      submittedAt: new Date().toISOString(),
    };
  }

  async function continueFromFeedback() {
    setError("");
    setCopied(false);
    const text = feedbackText.trim();

    if (!text) {
      setError(content.feedbackRequired);
      return;
    }

    if (countWords(text) <= 6) {
      setError(content.feedbackWordCount);
      return;
    }

    if (!feedbackWebhookUrl) {
      setError("The n8n base URL is not configured. Please add NEXT_PUBLIC_N8N_BASE_URL.");
      return;
    }

    try {
      setIsEvaluating(true);
      const response = await fetch(feedbackWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });

      if (!response.ok) {
        throw new Error(`Feedback webhook failed with ${response.status}`);
      }

      const data = (await response.json()) as N8nResponse;
      const returnedText = (data.reviewText || data.text || "").trim();
      if (returnedText) setFeedbackText(returnedText);
      setSummaryStatus(isGoogleEligible(data) ? "positive" : "private");
      setSubmitted(false);
      setTransitionDirection("forward");
      setStep(questions.length + 1);
    } catch (err) {
      console.error(err);
      setError("We could not submit your feedback right now. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  }

  async function submitBlankPrivateFeedback() {
    setError("");
    if (!patientName.trim()) {
      setError(content.privateNameRequired);
      return;
    }
    setSubmitted(true);
  }

  async function copyAndOpenGoogle() {
    setError("");
    const text = feedbackText.trim();
    if (!text) {
      setError("Please add feedback text before opening Google Review.");
      return;
    }

    const wasCopied = await copyTextToClipboard(text);
    if (!wasCopied) {
      setCopied(false);
      setError("We could not copy the text automatically. Please select and copy it manually.");
      return;
    }

    setCopied(true);
    window.setTimeout(() => {
      window.location.href = GOOGLE_REVIEW_URL;
    }, 150);
  }

  function renderFormTop() {
    return (
      <div className="form-progress">
        <div className="timeline" aria-hidden="true">
          {Array.from({ length: questions.length + 1 }).map((_, index) => (
            <span key={index} className={index <= Math.min(step, questions.length) ? "active" : ""} />
          ))}
        </div>
      </div>
    );
  }

  function renderRatingStep() {
    const question = questions[step];
    const value = ratings[question.key] || 0;
    const ratingFaces = ["🙁", "😕", "😐", "🙂", "😊"];

    return (
      <div key={`rating-${step}-${transitionDirection}`} className={`feedback-card rating-card step-card slide-${transitionDirection}`}>
        <div className="feedback-step-top">
          {step > 0 ? (
            <button className="step-back-button" type="button" onClick={goBack} aria-label={content.back}>
              <ChevronLeft size={17} />
              {content.back}
            </button>
          ) : (
            <span />
          )}
          <div className="feedback-step-label">
            {content.progress} {step + 1} / {questions.length + 1}
          </div>
        </div>
        <h2>{question.labels[language]}</h2>

        <div className={`emoji-rating ${value ? "has-rating" : ""}`}>
          <div className="rating-options">
            {content.ratingLabels.map((label, index) => (
              <button
                key={label}
                type="button"
                className={value === index + 1 ? "active" : ""}
                onClick={() => selectRating(question.key, index + 1)}
                aria-label={`${label}, ${index + 1} out of 5`}
              >
                <span aria-hidden="true">{ratingFaces[index]}</span>
                <small>{label}</small>
              </button>
            ))}
          </div>
        </div>

        {renderFormTop()}
      </div>
    );
  }

  function renderFeedbackStep() {
    return (
      <div key={`feedback-${transitionDirection}`} className={`feedback-card step-card slide-${transitionDirection}`}>
        <div className="feedback-step-top">
          <button className="step-back-button" type="button" onClick={goBack} aria-label={content.back} disabled={isEvaluating}>
            <ChevronLeft size={17} />
            {content.back}
          </button>
          <div className="feedback-step-label">
            {content.progress} {questions.length + 1} / {questions.length + 1}
          </div>
        </div>
        <h2>{content.feedbackTitle}</h2>

        <label className="feedback-textarea">
          <span className="feedback-textarea-box">
            <span className="feedback-mode-tabs" role="tablist" aria-label={content.feedbackTitle}>
              <button
                className={feedbackMode === "manual" ? "active" : ""}
                type="button"
                onClick={() => setFeedbackMode("manual")}
                disabled={recordingState === "uploading"}
              >
                {content.typeManually}
              </button>
              <button
                className={feedbackMode === "voice" ? "active" : ""}
                type="button"
                onClick={startRecording}
                disabled={recordingState !== "idle" || attemptsLeft === 0}
              >
                {recordingState === "requesting" && feedbackMode === "voice" ? <Loader2 size={16} /> : null}
                {content.voiceToText}
              </button>
            </span>
            <textarea
              value={feedbackText}
              onChange={(event) => {
                setFeedbackText(event.target.value);
                if (feedbackMode !== "manual") setFeedbackMode("manual");
              }}
              rows={9}
              placeholder={content.placeholder}
              readOnly={feedbackMode === "voice" && recordingState === "recording"}
            />
            <span className="feedback-meta">
              {recordingState === "recording"
                ? formatTime(recordingSeconds)
                : recordingState === "requesting"
                  ? content.requesting
                : recordingState === "uploading"
                  ? content.converting
                  : attemptsLeft === 0
                    ? `${content.attempts}: ${attempts}/${MAX_ATTEMPTS}. You have used all recording attempts. You can still type your feedback.`
                    : `${content.attempts}: ${attempts}/${MAX_ATTEMPTS}`}
            </span>
            <span className="feedback-record-controls">
              {recordingState === "recording" ? (
                <>
                  <button className="record-pill danger" type="button" onClick={deleteRecording}>
                    <Trash2 size={16} />
                    {content.delete}
                  </button>
                  <button className="record-pill stop" type="button" onClick={stopRecording}>
                    <Square size={15} fill="currentColor" />
                    {content.stop}
                  </button>
                </>
              ) : (
                <button
                  className={`mic-button ${recordingState}`}
                  type="button"
                  onClick={startRecording}
                  disabled={recordingState !== "idle" || attemptsLeft === 0}
                  aria-label={content.record}
                >
                  {recordingState === "uploading" || recordingState === "requesting" ? <Loader2 size={22} /> : <Mic size={23} />}
                </button>
              )}
            </span>
          </span>
        </label>

        {error && <div className="review-error">{error}</div>}
        {feedbackText.trim() && !hasEnoughFeedbackWords && !error && <div className="review-error">{content.feedbackWordCount}</div>}
        {isEvaluating && <div className="notice">{content.evaluating}</div>}

        {renderFormTop()}
        <div className="feedback-actions">
          <button
            className="button primary"
            type="button"
            onClick={continueFromFeedback}
            disabled={recordingState !== "idle" || !hasEnoughFeedbackWords || isEvaluating}
          >
            {recordingState === "uploading" || isEvaluating ? <Loader2 size={18} /> : <Send size={18} />}
            {isEvaluating ? content.evaluating : content.continue}
          </button>
        </div>
      </div>
    );
  }

  function renderSummaryStep() {
    const hasText = feedbackText.trim().length > 0;
    const isPositive = summaryStatus === "positive" && hasText;
    const isPrivate = !isPositive;

    return (
      <div key={`summary-${transitionDirection}`} className={`feedback-card summary-card step-card slide-${transitionDirection}`}>
        <CheckCircle2 size={44} />
        <h2>{isPositive ? content.positiveTitle : hasText ? content.privateTitle : content.blankSummaryTitle}</h2>
        <p>{isPositive ? content.positiveText : hasText ? content.privateText : content.blankSummaryText}</p>

        {hasText && (
          <div className="summary-review-preview">{feedbackText}</div>
        )}

        {isPrivate && !submitted && (
          <label className="private-name-field">
            <span>{content.privateNameTitle}</span>
            <small>{content.privateNameHelp}</small>
            <input
              type="text"
              value={patientName}
              onChange={(event) => {
                setPatientName(event.target.value);
                setError("");
              }}
              placeholder={content.privateNamePlaceholder}
            />
            <button className="anonymous-button" type="button" onClick={() => setPatientName("Anonymous")}>
              {content.anonymous}
            </button>
          </label>
        )}

        {error && <div className="review-error">{error}</div>}
        {copied && <div className="notice">{content.copied}</div>}
        {submitted && !isPositive && <div className="notice">{content.saved}</div>}

        {renderFormTop()}
        <div className="feedback-actions">
          {isPositive ? (
            <button className="button primary" type="button" onClick={copyAndOpenGoogle}>
              <Clipboard size={18} />
              {content.copyGoogle}
              <ExternalLink size={17} />
            </button>
          ) : (
            <button
              className="button primary"
              type="button"
              onClick={submitBlankPrivateFeedback}
              disabled={!submitted && !patientName.trim()}
            >
              <Send size={18} />
              {submitted ? content.done : content.submitPrivate}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <section className={`review2-page lang-${language}`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="container review2-shell">
        <div className="review2-hero">
          <div className="review2-doctors">
            <OpeninaryImage
              src="/images/doctors-image.jpeg"
              alt="Dantam Dental Care doctors"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 420px"
            />
          </div>
          <div className="review2-copy">
            <div className="eyebrow">{content.eyebrow}</div>
            <h1>{content.title}</h1>
            <p>{content.intro}</p>
            <div className="private-note">{content.private}</div>
          </div>
        </div>

        <div className="feedback-flow">
          <div className="language-switch form-language-switch" aria-label={content.language}>
            {(Object.keys(languageLabels) as Language[]).map((item) => (
              <button key={item} className={language === item ? "active" : ""} type="button" onClick={() => setLanguage(item)}>
                {languageLabels[item]}
              </button>
            ))}
          </div>

          {!isFeedbackStep && !isSummaryStep && renderRatingStep()}
          {isFeedbackStep && renderFeedbackStep()}
          {isSummaryStep && renderSummaryStep()}
        </div>
      </div>
    </section>
  );
}
