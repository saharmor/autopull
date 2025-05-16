import { motion } from 'framer-motion';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export default function Loading({ text = 'Loading...', fullScreen = false }: LoadingProps) {
  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50' 
    : 'flex flex-col items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center">
        <div className="relative">
          <motion.div 
            className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div 
            className="absolute inset-0 h-16 w-16 rounded-full border-r-4 border-l-4 border-secondary-500"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        {text && (
          <p className="mt-4 text-lg font-medium text-gray-700">{text}</p>
        )}
      </div>
    </div>
  );
} 