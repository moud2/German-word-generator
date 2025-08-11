import { useState, useRef } from 'react';
import RecordRTC, { RecordRTCPromisesHandler } from 'recordrtc';

export function useAudioRecorder() {
  const [recordings, setRecordings] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<RecordRTCPromisesHandler | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    if (typeof window === 'undefined') return;
    if (isRecording) return;

    // ✅ Check if browser supports audio recording
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Audio recording is not supported in this browser. Please use Safari or Chrome.');
      return;
    }

    if (recordings.length >= 2) {
      alert('You can only have up to 2 recordings. Please delete one to record a new one.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new RecordRTCPromisesHandler(stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: RecordRTC.StereoAudioRecorder,
        disableLogs: true,
      });

      recorderRef.current = recorder;
      await recorder.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.error('🎙️ Failed to access mic:', err);
      alert('Could not access microphone. Please check browser permissions.');
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current || !isRecording) return;

    try {
      await recorderRef.current.stopRecording();
      const blob = await recorderRef.current.getBlob();
      setRecordings((prev) => [...prev, blob]);
    } catch (err) {
      console.error('🛑 Failed to stop recording:', err);
    }

    // ✅ Clean up audio tracks
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
    setIsRecording(false);
  };

  const deleteRecording = (index: number) => {
    setRecordings((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    recordings,
    isRecording,
    startRecording,
    stopRecording,
    deleteRecording,
  };
}
