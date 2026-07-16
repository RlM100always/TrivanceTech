import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mt-4">Page Not Found</h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 mt-4 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/" 
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <Home className="mr-2" size={20} />
            Go Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 font-medium rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="mr-2" size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;