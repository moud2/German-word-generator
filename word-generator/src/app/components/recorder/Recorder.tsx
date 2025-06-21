'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioRecorder } from '@/app/hooks/useAudioRecorder';
import { Mic } from 'lucide-react';
import useAvailableMinutes from '@hooks/useAvailableMinutes';
import { supabase } from '@/app/lib/supabaseClient';

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

type FeedbackItem = {
  original: string;
  corrected: string;
  highlights: { wrong: string; correct: string }[];
  explanation?: string;
};

type SmartFeedback = {
  items: FeedbackItem[];
  grammarTopics?: string[];
  overallScore?: number;
};

export default function Recorder() {
  const { i18n } = useTranslation();
  const [userId, setUserId] = useState<string | null>(null);
  const minutes = useAvailableMinutes();

  const {
    recordings,
    isRecording,
    startRecording,
    stopRecording,
    deleteRecording,
  } = useAudioRecorder();

  const [audioURLs, setAudioURLs] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [feedback, setFeedback] = useState<SmartFeedback | null>(null);

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
    if (!lastBlob) return alert('No recording available.');

    const formData = new FormData();
    formData.append('file', lastBlob, 'recording.webm');

    try {
      const res = await fetch('/api/analyze-audio', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log("🎧 Raw API Response:", data);

      try {
        const cleaned = data.feedback?.replace(/^```json\s*|```$/g, '').trim();
        const parsed: SmartFeedback = JSON.parse(cleaned);
        console.log('✅ Parsed feedback JSON:', parsed);
        setFeedback(parsed);
      } catch (err) {
        console.error('❌ Failed to parse feedback JSON:', err);
        alert('Invalid AI response.');
      }
    } catch (err) {
      console.error('🛑 Error fetching feedback:', err);
      alert('Could not process feedback.');
    }
  };

  const handleAnalyzeClick = async () => {
    if (!userId) return alert('Please log in first.');

    if ((minutes ?? 0) < 1) {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          price_id: 'price_1Rb54bCX5IVNSF5NOnnvp0JI',
        }),
      });

      const { url } = await res.json();
      if (url) window.location.href = url;
      return;
    }

    await getFeedback();
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl max-w-md w-full mx-auto space-y-6">
      {/* 🎤 Recorder */}
      <div className="relative flex flex-col items-center justify-center space-y-2">
        <div className="relative">
          {isRecording && (
            <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-30 scale-110"></div>
          )}
          <button
            onClick={toggleRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-lg transition-all duration-200 relative z-10 ${
              isRecording ? 'bg-red-600' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <Mic className="w-8 h-8" />
          </button>
        </div>
        {isRecording && (
          <span className="text-sm font-mono text-gray-700">
            {formatTime(seconds)}
          </span>
        )}
      </div>

      {/* 🔉 Audio players */}
      {audioURLs.length > 0 && (
        <div className="space-y-4">
          {audioURLs.map((url, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-gray-100 rounded-lg shadow-sm"
            >
              <audio
                controls
                src={url}
                className="w-full sm:w-auto"
                onPlay={(e) => {
                  document.querySelectorAll('audio').forEach((el) => {
                    if (el !== e.target) {
                      el.pause();
                      el.currentTime = 0;
                    }
                  });
                }}
              />
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => deleteRecording(index)}
                  className="text-red-600 text-sm hover:underline"
                >
                  {i18n.language === 'ar' ? 'حذف' : 'Delete'}
                </button>
                <a
                  href={url}
                  download={`recording-${index + 1}.webm`}
                  className="text-blue-600 text-sm hover:underline"
                >
                  {i18n.language === 'ar' ? 'تحميل' : 'Download'}
                </a>
                {index === recordings.length - 1 && (
                  <button
                    onClick={handleAnalyzeClick}
                    className="text-green-600 text-sm hover:underline"
                  >
                    {i18n.language === 'ar' ? 'تحليل' : 'Analyze'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🧠 Modern Feedback UI */}
      {feedback?.items && feedback.items.length > 0 && (
        <div className="mt-6 p-6 bg-gray-50 border rounded-2xl shadow-sm space-y-6 text-sm">
          <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
            🧠 AI Feedback
          </h3>

          {feedback.items.map((item, i) => (
            <div key={i} className="rounded-xl border bg-white p-4 shadow-sm space-y-3">
              <div className="space-y-1">
                <p>
                  <span className="font-medium text-gray-600">❌ You said:</span>
                  <span className="ml-2 text-gray-800">{item.original}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-600">✅ AI Suggests:</span>
                  <span className="ml-2 text-gray-800">{item.corrected}</span>
                </p>
              </div>

              {item.highlights.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.highlights.map((h, j) => (
                    <div
                      key={j}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs bg-gray-100 text-gray-700"
                    >
                      <span className="line-through text-red-500">{h.wrong}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium text-green-600">{h.correct}</span>
                    </div>
                  ))}
                </div>
              )}

              {item.explanation && (
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  📘 <span>{item.explanation}</span>
                </p>
              )}
            </div>
          ))}

          {Array.isArray(feedback.grammarTopics) && feedback.grammarTopics.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="font-semibold text-gray-700 mb-1">📚 Grammar Topics</h4>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                {feedback.grammarTopics.map((topic, k) => (
                  <li key={k}>{topic}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
