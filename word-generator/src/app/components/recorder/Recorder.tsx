'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioRecorder } from '@/app/hooks/useAudioRecorder';
import { Mic } from 'lucide-react'; // ✅ mic icon

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
}

export default function Recorder() {
  const { i18n } = useTranslation();
  const {
    recordings,
    isRecording,
    startRecording,
    stopRecording,
    deleteRecording,
  } = useAudioRecorder();

  const [audioURLs, setAudioURLs] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(0);

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
    // Stop all playing audio
    const audios = document.querySelectorAll('audio');
    audios.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  
    // Then toggle recording
    isRecording ? stopRecording() : startRecording();
  };
  

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
              <div className="flex gap-3">
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
