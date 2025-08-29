export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Test Page</h1>
        <p className="text-gray-300 mb-8">Testing if Tailwind CSS is working properly</p>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-4">
          <h2 className="text-2xl font-semibold text-blue-400 mb-2">Card Title</h2>
          <p className="text-gray-400">This is a test card with Tailwind styles.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-600 text-white p-4 rounded">Blue Box</div>
          <div className="bg-green-600 text-white p-4 rounded">Green Box</div>
          <div className="bg-red-600 text-white p-4 rounded">Red Box</div>
        </div>
      </div>
    </div>
  );
}