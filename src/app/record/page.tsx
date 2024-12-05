"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import Confetti from "react-confetti";

const Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks: Blob[] = [];

  const questions = [
    "Explain how does the multi-threading work in Java?",
    "What is the importance of a constructor in Java?",
    "How does garbage collection work in Java?",
    "What is the difference between HashMap and HashTable in Java?",
    "Explain the concept of synchronization in Java.",
  ];

  // Automatically start recording when the component is mounted
  useEffect(() => {
    startRecording();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Set the video stream to the video element for live preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

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

      // Ensure that the recording stops after 30 seconds
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, 30000); // Stop after 30 seconds
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSaveAndNext = () => {
    // Logic to save the video (you can upload it or save it locally)
    console.log("Video saved:", recordedBlob);

    // Move to the next question or complete the quiz
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setIsPreview(false); // Reset preview for the next question
      startRecording(); // Start recording for the next question
    } else {
      setIsCompleted(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      {!isCompleted ? (
        <div className="rounded-md p-6 max-w-md text-white shadow-md relative">
          <h1 className="text-xl font-bold mb-4 text-left -ml-20">
            Recording Your Answer {questionIndex + 1} / {questions.length}
          </h1>

          {!isPreview ? (
            <>
              <div className="gap-4 flex items-center justify-center flex-col">
                <h2 className="text-2xl whitespace-nowrap font-semibold text-center mb-4">
                  {questions[questionIndex]}
                </h2>
                <TimerComponent stopRecording={stopRecording} />
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full mb-4 mt-4 rounded-2xl"
                ></video>
                {/* End button to stop recording manually */}
                <button
                  onClick={stopRecording}
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  End Recording
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-4">Preview Your Recording</h2>
              <video
                src={recordedBlob ? URL.createObjectURL(recordedBlob) : ""}
                controls
                className="w-full mb-4 bg-gray-900 rounded"
              ></video>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleSaveAndNext}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Save & Next
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="shadow-md rounded-xl p-8 max-w-md bg-white text-center">
          {/* <Confetti className="absolute w-full z-10 top-0 left-0"/> */}
          <h1 className="text-xl font-bold text-black mb-4">Test Completed</h1>
          <p className="text-gray-800 mb-4">
            Thank you for completing the recording. Your responses have been submitted successfully.
          </p>
          <Link href="/" className="bg-blue-900 text-white py-3 px-5 rounded-lg hover:bg-blue-900/80 transition-all">
            Go Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default Record;

const TimerComponent = ({ stopRecording }: { stopRecording: () => void }) => {
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      stopRecording();
    }
  }, [seconds, stopRecording]);

  return (
    <div>
      <p>
        Timer <span className="text-red-400 bg-yellow-100 px-2 py-1 rounded-lg">00:{seconds} s</span>
      </p>
    </div>
  );
};
