"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Permi from "./permissions/page";

const Home = () => {
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
        console.log("Camera stream obtained:", stream); // Debugging log
      } catch (error) {
        console.warn("Camera access denied:", error);
      }
    };

    requestCameraAccess();
  }, []);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
      console.log("Video stream attached to video element:", videoStream); // Debugging log
    }
  }, [videoStream]);

  useEffect(() => {
    // Clean up the video stream when the component unmounts
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
        console.log("Video stream stopped."); // Debugging log
      }
    };
  }, [videoStream]);
  const [showPermissions, setShowPermissions] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="flex items-center justify-center flex-1">
        {/* Video Section */}
      

       <Permi/>
 
 
      </div>
    </div>
  );
};

export default Home;
