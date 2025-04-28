'use client';
import { motion } from 'framer-motion';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
  theme: 'nebula' | 'supernova'; // Add theme here
}

export default function ResumeModal({ open, onClose, theme }: ResumeModalProps) {
  if (!open) return null;

  const buttonHoverColor = theme === 'nebula' ? 'hover:text-purple-400' : 'hover:text-yellow-400';
  const downloadGradient = theme === 'nebula'
    ? 'from-purple-500 to-blue-600'
    : 'from-yellow-400 to-orange-500';
  const shadowColor = theme === 'nebula'
    ? 'shadow-purple-500/20'
    : 'shadow-yellow-400/20';
  const modalBackground = theme === 'nebula'
    ? 'bg-[#0a0a1a]'
    : 'bg-[#1a1400]'; // Slightly warm dark color for supernova

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
    >
      <div className={`${modalBackground} rounded-xl p-6 w-[90%] max-w-4xl relative border border-indigo-900/50 shadow-lg ${shadowColor}`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-white text-xl transition-colors ${buttonHoverColor}`}
        >
          ✕
        </button>
        <iframe
          src="/mia_resume.pdf"
          className="w-full h-[75vh] rounded-lg border border-indigo-900/30"
          title="Resume PDF"
        ></iframe>
        <div className="flex justify-end mt-4">
          <a
            href="/mia_resume.pdf"
            download
            className={`bg-gradient-to-r ${downloadGradient} px-6 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-lg ${shadowColor}`}
          >
            Download
          </a>
        </div>
      </div>
    </motion.div>
  );
}
