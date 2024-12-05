"use client"
import { useState } from 'react';
import Link from 'next/link';

const Questions = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 3;

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-md p-6 max-w-md">
        <h1 className="text-xl font-bold mb-4">Question {currentQuestion}</h1>
        <p className="text-gray-600 mb-4">
          {`This is a placeholder for question ${currentQuestion}.`}
        </p>
        <audio controls className="mb-4">
          <source src="/audio/sample-question.mp3" type="audio/mpeg" />
        </audio>
        {currentQuestion < totalQuestions ? (
          <button
            onClick={nextQuestion}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Next Question
          </button>
        ) : (
          <Link href="/record">
            <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
              Proceed to Recording
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Questions;
