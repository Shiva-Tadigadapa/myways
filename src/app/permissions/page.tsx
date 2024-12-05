"use client";
import { useState } from 'react';
import Link from 'next/link';

const Permissions = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const checkPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setPermissionsGranted(true);
    } catch (error) {
      alert('Please enable audio and video permissions.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-md p-6 max-w-md">
        <h1 className="text-xl font-bold mb-4">Permissions Check</h1>
        <p className="text-gray-600 mb-4">
          We need access to your camera and microphone to proceed with the interview.
        </p>
        <button
          onClick={checkPermissions}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Check Permissions
        </button>
        {permissionsGranted && (
          <Link href="/questions">
            <button className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
              Proceed to Questions
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Permissions;
