export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="flex items-center space-x-6 text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Secure • Compliant • Trusted
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-500 dark:text-gray-400">
                System Status: Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}