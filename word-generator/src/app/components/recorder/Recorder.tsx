'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioRecorder } from '@/app/hooks/useAudioRecorder';
import { Mic, Loader2 } from 'lucide-react';
import useAvailableMinutes from '@hooks/useAvailableMinutes';
import { supabase } from '@/app/lib/supabaseClient';

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

type Correction = {
  wrong: string;
  correct: string;
};

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

  const {
    recordings,
    isRecording,
    startRecording,
    stopRecording,
    deleteRecording,
  } = useAudioRecorder();

  const [audioURLs, setAudioURLs] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [feedback, setFeedback] = useState<SimpleFeedback | null>(null);
  const [transcript, setTranscript] = useState<string>('');

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
      console.log("🎧 Raw API Response:", data);

      try {
        const cleaned = data.feedback?.replace(/^```json\s*|```$/g, '').trim();
        const parsed: SimpleFeedback = JSON.parse(cleaned);
        console.log('✅ Parsed feedback JSON:', parsed);
        
        // Always set feedback, even if not German
        setFeedback(parsed);
        setTranscript(data.transcript || '');
        return true;
      } catch (err) {
        console.error('❌ Failed to parse feedback JSON:', err);
        alert('Invalid AI response.');
        return false;
      }
    } catch (err) {
      console.error('🛑 Error fetching feedback:', err);
      alert('Something went wrong. Please try again or record a clearer sentence.');

      return false;
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAnalyzeClick = async () => {
    // 1. Check if user is signed in
    if (!userId) {
      alert('Please log in first.');
      return;
    }

    // 2. Check if user has enough minutes
    if ((minutes ?? 0) < 1) {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          price_id: 'price_1RcXI9CX5IVNSF5NEdxdcAzl',
        }),
      });

      const { url } = await res.json();
      if (url) window.location.href = url;
      return;
    }

    // 3. Attempt to get feedback
    const success = await getFeedback();

    // 4. If successful, deduct 1 minute
    if (success) {
      const deductionSuccess = await deductMinutes(1);
      if (!deductionSuccess) {
        console.error('Failed to deduct minutes, but analysis was successful');
      }
    }
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
            disabled={analyzing}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-lg transition-all duration-200 relative z-10 ${
              isRecording ? 'bg-red-600' : 'bg-green-600 hover:bg-green-700'
            } ${analyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
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

      {/* Minutes Display */}
      {minutes !== null && (
        <div className="text-center">
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {minutes} Times remaining
          </span>
        </div>
      )}

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
                  disabled={analyzing}
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
                    disabled={analyzing || minutesLoading}
                    className={`text-green-600 text-sm hover:underline flex items-center gap-1 ${
                      analyzing || minutesLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {analyzing && <Loader2 className="w-3 h-3 animate-spin" />}
                    {analyzing 
                      ? 'Analyzing...' 
                      : i18n.language === 'ar' ? 'تحليل' : 'Analyze'
                    }
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 📝 Transcript */}
      {transcript && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">What you said:</h4>
          <p className="text-blue-700 text-sm">{transcript}</p>
        </div>
      )}

      {/* ⚠️ Language Warning */}
      {feedback && !feedback.isGerman && (
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-600">⚠️</span>
            <h4 className="font-medium text-yellow-800">Language Detection</h4>
          </div>
          <p className="text-yellow-700 text-sm">
            {feedback.detectedLanguage 
              ? `This sounds like ${feedback.detectedLanguage}. Please speak in German for analysis.`
              : 'This doesn\'t sound like German. Please speak in German for analysis.'
            }
          </p>
        </div>
      )}

      {/* ✅ Simple Corrections */}
      {feedback?.isGerman && feedback.corrections && feedback.corrections.length > 0 && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h4 className="font-medium text-red-800 mb-3">Corrections needed:</h4>
          <div className="space-y-2">
            {feedback.corrections.map((correction, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                  {correction.wrong}
                </span>
                <span className="text-gray-400">→</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                  {correction.correct}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Perfect German Speech */}
      {feedback?.isGerman && feedback.corrections && feedback.corrections.length === 0 && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
          <span className="text-green-700 font-medium">🎉 Perfect German! No corrections needed.</span>
        </div>
      )}
    </div>
  );
}