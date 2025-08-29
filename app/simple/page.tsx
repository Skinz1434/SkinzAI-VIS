export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-white mb-8">VIS Service Verifier</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-green-400 mb-4">
            Vadir Accuracy: 97.3%
          </h2>
          <p className="text-gray-300">
            System is operating above the 97% threshold
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-600 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white">12,847</h3>
            <p className="text-blue-100">Total Veterans</p>
          </div>
          
          <div className="bg-green-600 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white">3,421</h3>
            <p className="text-green-100">Active Claims</p>
          </div>
          
          <div className="bg-purple-600 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white">99.98%</h3>
            <p className="text-purple-100">System Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );
}