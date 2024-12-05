import Link from 'next/link';

const Completion = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-md p-6 max-w-md">
        <h1 className="text-xl font-bold mb-4">Test Completed</h1>
        <p className="text-gray-600 mb-4">
          Thank you for completing the AI Interview. Your responses have been recorded.
        </p>
        <Link href="/">
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Completion;
