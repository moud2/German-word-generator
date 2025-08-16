'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { Mic, Loader2, Trash2, Download, Wand2 } from 'lucide-react';
import useAvailableMinutes from '@/hooks/useAvailableMinutes';
import { supabase } from '@/app/lib/supabaseClient';

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

type Correction = { wrong: string; correct: string };

type SimpleFeedback = {
  isGerman: boolean;
  detectedLanguage?: string;
  corrections: Correction[];
};

export default function Recorder() {
  const { i18n } = useTranslation();
  const [userId, setUserId] = useState<string | null>(null);
  const { minutes, deductMinutes, loading: minutesLoading } = useAvailableMinutes();
  const [analyzing, setAnalyzing] = useState(false);

  const { recordings, isRecording, startRecording, stopRecording, deleteRecording } = useAudioRecorder();

  const [audioURLs, setAudioURLs] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [feedback, setFeedback] = useState<SimpleFeedback | null>(null);
  const [transcript, setTranscript] = useState<string>('');

  // Component styles with glass morphism effect
  const containerStyle: React.CSSProperties = {
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '20px',
    boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.08)',
    maxWidth: '28rem',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  };

  const recorderButtonStyle: React.CSSProperties = {
    width: '5rem',
    height: '5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.875rem',
    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)',
    transition: 'all 0.2s ease',
    position: 'relative',
    zIndex: 10,
    border: 'none',
    cursor: analyzing ? 'not-allowed' : 'pointer',
    opacity: analyzing ? 0.5 : 1,
  };

  const audioPlayerContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    background: 'rgba(255, 255, 255, 0.4)',
    borderRadius: '12px',
    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
  };

  const feedbackContainerStyle: React.CSSProperties = {
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid',
    fontSize: '0.875rem',
  };

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    };
    getUser();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urls = recordings.map((blob) => URL.createObjectURL(blob));
    setAudioURLs(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [recordings]);

  const toggleRecording = () => {
    const audios = document.querySelectorAll('audio');
    audios.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    isRecording ? stopRecording() : startRecording();
  };

  const getFeedback = async () => {
    const lastBlob = recordings[recordings.length - 1];
    if (!lastBlob) {
      alert('No recording available.');
      return false;
    }

    const formData = new FormData();
    formData.append('file', lastBlob, 'recording.webm');

    try {
      setAnalyzing(true);
      const res = await fetch('/api/analyze-audio', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      try {
        const cleaned = data.feedback?.replace(/^```json\s*|```$/g, '').trim();
        const parsed: SimpleFeedback = JSON.parse(cleaned);
        setFeedback(parsed);
        setTranscript(data.transcript || '');
        return true;
      } catch (err) {
        console.error('Failed to parse feedback JSON:', err);
        alert('Invalid AI response.');
        return false;
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
      alert('Something went wrong. Please try again or record a clearer sentence.');
      return false;
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!userId) {
      alert('Please log in first.');
      return;
    }

    if ((minutes ?? 0) < 1) {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          price_id: 'price_1RcnHLCX5IVNSF5N3q1aCYai',
        }),
      });

      const { url } = await res.json();
      if (url) window.location.href = url;
      return;
    }

    const success = await getFeedback();
    if (success) {
      const deductionSuccess = await deductMinutes(1);
      if (!deductionSuccess) {
        console.error('Failed to deduct minutes, but analysis was successful');
      }
    }
  };

  return (
    <div style={containerStyle}>
      {/* Recorder Button Section */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}
      >
        <div style={{ position: 'relative' }}>
          {isRecording && (
            <div
              style={{
                position: 'absolute',
                inset: '0',
                borderRadius: '50%',
                animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
                backgroundColor: '#ef4444',
                opacity: 0.3,
                transform: 'scale(1.1)',
              }}
            ></div>
          )}
          <button
            onClick={toggleRecording}
            disabled={analyzing}
            style={{
              ...recorderButtonStyle,
              backgroundColor: '#2563eb',
            }}
            onMouseEnter={(e) => {
              if (!analyzing && !isRecording) e.currentTarget.style.backgroundColor = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              if (!analyzing && !isRecording) e.currentTarget.style.backgroundColor = '#2563eb';
            }}
          >
            <Mic style={{ width: '2rem', height: '2rem' }} />
          </button>
        </div>
        {isRecording && (
          <span style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: '#2563eb' }}>
            {formatTime(seconds)}
          </span>
        )}
      </div>

      {/* Minutes Display */}
      {minutes !== null && (
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              fontSize: '0.875rem',
              color: '#4b5563',
              backgroundColor: 'rgba(243, 244, 246, 0.8)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
            }}
          >
            {minutes} Times remaining
          </span>
        </div>
      )}

      {/* Audio Players */}
      {audioURLs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {audioURLs.map((url, index) => (
            <div key={index} style={audioPlayerContainerStyle}>
              <audio
                controls
                src={url}
                style={{ width: '100%' }}
                onPlay={(e) => {
                  document.querySelectorAll('audio').forEach((el) => {
                    if (el !== e.target) {
                      el.pause();
                      el.currentTime = 0;
                    }
                  });
                }}
              />

              {/* 🔵 English-only actions with icons (lucide) */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <button
                  onClick={() => deleteRecording(index)}
                  disabled={analyzing}
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-blue-300 disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Delete recording"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>

                <a
                  href={url}
                  download={`recording-${index + 1}.webm`}
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-blue-300"
                  aria-label="Download recording"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>

                {index === recordings.length - 1 && (
                  <button
                    onClick={handleAnalyzeClick}
                    disabled={analyzing || minutesLoading}
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-blue-300 disabled:opacity-50 disabled:pointer-events-none"
                    aria-label="Analyze recording"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing…
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        Analyze
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transcript Display */}
      {transcript && (
        <div
          style={{
            ...feedbackContainerStyle,
            backgroundColor: 'rgba(219, 234, 254, 0.8)',
            borderColor: '#93c5fd',
          }}
        >
          <h4 style={{ fontWeight: 500, color: '#1e40af', marginBottom: '0.5rem' }}>What you said:</h4>
          <p style={{ color: '#1d4ed8', margin: 0 }}>{transcript}</p>
        </div>
      )}

      {/* Language Warning */}
      {feedback && !feedback.isGerman && (
        <div
          style={{
            ...feedbackContainerStyle,
            backgroundColor: 'rgba(254, 249, 195, 0.8)',
            borderColor: '#fbbf24',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span>⚠️</span>
            <h4 style={{ fontWeight: 500, color: '#92400e', margin: 0 }}>Language Detection</h4>
          </div>
          <p style={{ color: '#a16207', margin: 0 }}>
            {feedback.detectedLanguage
              ? `This sounds like ${feedback.detectedLanguage}. Please speak in German for analysis.`
              : "This doesn't sound like German. Please speak in German for analysis."}
          </p>
        </div>
      )}

      {/* Corrections Display */}
      {feedback?.isGerman && feedback.corrections && feedback.corrections.length > 0 && (
        <div
          style={{
            ...feedbackContainerStyle,
            backgroundColor: 'rgba(254, 226, 226, 0.8)',
            borderColor: '#f87171',
          }}
        >
          <h4 style={{ fontWeight: 500, color: '#991b1b', marginBottom: '0.75rem' }}>Corrections needed:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {feedback.corrections.map((correction, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(254, 226, 226, 1)',
                    color: '#b91c1c',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                  }}
                >
                  {correction.wrong}
                </span>
                <span style={{ color: '#9ca3af' }}>→</span>
                <span
                  style={{
                    backgroundColor: 'rgba(220, 252, 231, 1)',
                    color: '#065f46',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontWeight: 500,
                  }}
                >
                  {correction.correct}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message */}
      {feedback?.isGerman && feedback.corrections && feedback.corrections.length === 0 && (
        <div
          style={{
            ...feedbackContainerStyle,
            backgroundColor: 'rgba(220, 252, 231, 0.8)',
            borderColor: '#34d399',
            textAlign: 'center',
          }}
        >
          <span style={{ color: '#047857', fontWeight: 500 }}>Perfect German! No corrections needed.</span>
        </div>
      )}

      {/* Add ping animation keyframes */}
      <style jsx>{`
        @keyframes ping {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
