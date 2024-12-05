import Link from 'next/link';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-md p-6 max-w-md">
        <h1 className="text-xl font-bold mb-4">AI Interview Instructions</h1>
        <p className="text-gray-600 mb-4">
          Follow these instructions carefully to complete the interview process.
        </p>
        <ul className="list-disc list-inside text-gray-700">
          <li>Ensure your audio and video permissions are enabled.</li>
          <li>Answer all questions sincerely and confidently.</li>
          <li>Complete the test without interruptions.</li>
        </ul>
        <Link href="/permissions">
          <button className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Proceed to Permissions Check
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
