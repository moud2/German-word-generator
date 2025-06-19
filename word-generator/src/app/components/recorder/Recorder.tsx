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

type SentencePair = { wrong: string; correct: string };

function extractSentencePairs(feedback: string): SentencePair[] {
  const pattern = /\d+\.\s*❌ You said:\s*"([^"]+)"\s*✅ AI Suggests:\s*"([^"]+)"/g;
  const matches = feedback.matchAll(pattern);
  const pairs: SentencePair[] = [];

  for (const match of matches) {
    pairs.push({
      wrong: match[1].trim(),
      correct: match[2].trim(),
    });
  }

  return pairs;
}

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
  const [feedback, setFeedback] = useState<string | null>(null);

  // ✅ Get user ID
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
      setFeedback(data.feedback || null);
    } catch (err) {
      console.error('Error parsing feedback:', err);
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
          price_id: 'price_1Rb54bCX5IVNSF5NOnnvp0JI', // replace with your Stripe price ID
        }),
      });

      const { url } = await res.json();
      if (url) window.location.href = url;
      return;
    }

    // Enough minutes → proceed
    await getFeedback();
  };

  const sentencePairs = feedback ? extractSentencePairs(feedback) : [];

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl max-w-md w-full mx-auto space-y-6">
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

      {sentencePairs.length > 0 && (
        <div className="mt-6 p-4 bg-white border rounded-xl space-y-4 text-sm">
          <h3 className="font-semibold text-gray-800 mb-2">🗣 Feedback Table</h3>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm font-semibold">
                <th className="px-4 py-2 border-b">🗣 You said</th>
                <th className="px-4 py-2 border-b">🤖 AI Suggests</th>
              </tr>
            </thead>
            <tbody>
              {sentencePairs.map((pair, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 border-b text-gray-800 align-top">
                    {pair.wrong}
                  </td>
                  <td className="px-4 py-3 border-b text-gray-800 align-top">
                    {pair.correct}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
