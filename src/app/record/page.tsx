"use client";

import { useRef, useState } from "react";

const Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks: Blob[] = [];

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current!.srcObject = stream;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      setRecordedBlob(blob);
      setIsPreview(true);

      // Stop all tracks to release the camera
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    setIsCompleted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {!isCompleted ? (
        <div className="bg-white shadow-md rounded-md p-6 max-w-md">
          <h1 className="text-xl font-bold mb-4">Record Your Answer</h1>

          {!isPreview ? (
            <>
              <video ref={videoRef} autoPlay muted className="w-full mb-4 bg-gray-200 rounded"></video>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-full ${
                  isRecording ? "bg-red-500" : "bg-blue-500"
                } text-white py-2 px-4 rounded hover:bg-opacity-80`}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-4">Preview Your Recording</h2>
              <video
                src={recordedBlob ? URL.createObjectURL(recordedBlob) : ""}
                controls
                className="w-full mb-4 bg-gray-200 rounded"
              ></video>
              <button
                onClick={handleSubmit}
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Submit
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-md p-6 max-w-md text-center">
          <h1 className="text-xl font-bold mb-4">Test Completed</h1>
          <p className="text-gray-600 mb-4">
            Thank you for completing the recording. Your response has been submitted successfully.
          </p>
        </div>
      )}
    </div>
  );
};

export default Record;
