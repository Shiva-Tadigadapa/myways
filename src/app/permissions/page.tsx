"use client";
import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { BsCameraVideo } from "react-icons/bs";
import {PiMicrophone} from 'react-icons/pi';
import {PiScreencastLight} from 'react-icons/pi';
import {HiOutlineSpeakerWave} from 'react-icons/hi2';
// import audioclip from '../assets/test.mp3';

const Permissions = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [permissions, setPermissions] = useState({
    microphone: false,
    camera: false,
    screen: false,
    speaker: false,
  });

  const steps = ["camera", "microphone", "screen", "speaker"];
  const allPermissionsGranted = Object.values(permissions).every(Boolean); // Check if all permissions are granted

  const requestPermission = async (step: string) => {
    try {
      if (step === "camera") {
        const camStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setPermissions((prev) => ({ ...prev, camera: !!camStream }));
      } else if (step === "microphone") {
        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setPermissions((prev) => ({ ...prev, microphone: !!micStream }));
      } else if (step === "screen") {
        await navigator.mediaDevices.getDisplayMedia();
        setPermissions((prev) => ({ ...prev, screen: true }));
      } else if (step === "speaker") {
        const audio = new Audio("/test.mp3");
        audio.play();
        audio.onended = () => {
          setPermissions((prev) => ({ ...prev, speaker: true }));
        };
        return; // Stop here while audio is playing
      }
    } catch (error) {
      console.warn(
        `${step.charAt(0).toUpperCase() + step.slice(1)} access not granted:`,
        error
      );
    }
  };

  const handlePermission = async () => {
    const step = steps[currentStep];
    await requestPermission(step);
    setCurrentStep((prev) => prev + 1);
  };

  useEffect(() => {
    if (currentStep < steps.length) {
      handlePermission();
    }
  }, [currentStep]);

  const handleCheckboxClick = async (step: string) => {
    if (!permissions[step]) {
      await requestPermission(step);
    }
  };

  return (
    <div className="p-4 text-white rounded-md">
      <h2 className="text-2xl font-bold text-left">Ready to join?</h2>
      <h2 className="text-md mt-1 font-normal text-gray-400 mb-5 text-left">
        Please allow all permissions to proceed.
      </h2>
      <ul className="space-y-2">
        {steps.map((step, index) => (
          <li
            key={step}
            className={`flex items-center gap-4 border w-[400px] h-[60px] gap-4 justify-between px-6 py-3 rounded-lg 
              ${permissions[step] ? "border-gray-500" : "border-gray-200"}`}
          >
            {step === "camera" ? (
              <BsCameraVideo className="text-2xl opacity-80" />
            ) : step  === "microphone" ? (
              <PiMicrophone className="text-2xl opacity-80" />
            ) : step === "screen" ? (
              <PiScreencastLight className="text-2xl opacity-80" />
            ) : 
            (
              // Render another icon for steps other than "speaker"
              <HiOutlineSpeakerWave className="text-2xl opacity-80" />
            )}
            <span className="text-xl capitalize">{step}</span>
            <input
              type="checkbox"
              checked={permissions[step]}
              readOnly
              onClick={
                step !== "speaker" ? () => handleCheckboxClick(step) : undefined
              }
              className="h-6 w-6 accent-gray-900  cursor-pointer"
            />
          </li>
        ))}
      </ul>
      {allPermissionsGranted ? (
        <Link href="/record">
          <button className="mt-6 w-[100%] font-bold bg-[#6d60f3] text-white py-2 px-4 rounded hover:bg-blue-600">
            Start Interview
          </button>
        </Link>
      ) : (
        <button
          className="mt-6 w-[100%] font-bold bg-gray-300 text-gray-600 py-2 px-4 rounded cursor-not-allowed"
          disabled
        >
          Checking...
        </button>
      )}
    </div>
  );
};

const Home = () => {
  const [showPermissions, setShowPermissions] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const requestCameraAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setCameraPermission(true);
        setVideoStream(stream);
      } catch (error) {
        console.warn("Camera access denied:", error);
      }
    };

    requestCameraAccess();
  }, []);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Content */}
      <div className="flex items-center gap-10 justify-center flex-1">
        {/* Video Section */}
        <div className="w-[600px] h-[450px] bg-black overflow-hidden rounded-xl flex items-center justify-center">
          {cameraPermission && videoStream ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full rounded-xl"
            />
          ) : (
            <p className="text-gray-400 text-center">
              Please enable camera permissions to view the video feed.
            </p>
          )}
        </div>

        {/* Right Section */}
        <div className="rounded-md p-8 max-w-xl text-center">
          {showPermissions ? (
            <Permissions />
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4 text-white text-left ml-8">
                AI Interview Instructions
              </h1>
              <ul className="list-decimal scale-90 text-xl list-inside text-left text-gray-200 space-y-2">
                <li>Ensure your audio and video permissions are enabled.</li>
                <li>Answer all questions sincerely and confidently.</li>
                <li>Complete the test without interruptions.</li>
                <li>
                  Provide detailed responses, including examples and projects.
                </li>
                <li>Speak clearly and structure your answers logically.</li>
              </ul>
              <button
                onClick={() => setShowPermissions(true)}
                className="mt-6 w-[90%] font-bold bg-[#6d60f3] text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Start Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
