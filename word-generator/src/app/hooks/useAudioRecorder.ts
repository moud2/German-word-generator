import { useState, useRef } from "react";

export function useAudioRecorder() {
  const [recordings, setRecordings] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (recordings.length >= 2) {
      alert("You can only have up to 2 recordings. Please delete one to record a new one.");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const selectedMimeType = MediaRecorder.isTypeSupported("audio/mp4")
      ? "audio/mp4"
      : "audio/webm";

    mediaRecorder.current = new MediaRecorder(stream, {
      mimeType: selectedMimeType,
    });

    mediaRecorder.current.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: selectedMimeType });
      setRecordings((prev) => [...prev, blob]);
      chunks.current = [];
    };

    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
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
