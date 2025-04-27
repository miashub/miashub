'use client';
import { motion } from 'framer-motion';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ResumeModal({ open, onClose }: ResumeModalProps) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
    >
      <div className="bg-[#0a0a1a] rounded-xl p-6 w-[90%] max-w-4xl relative border border-indigo-900/50 shadow-lg shadow-indigo-900/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl hover:text-purple-400 transition-colors"
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
            className="bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
          >
            Download
          </a>
        </div>
      </div>
    </motion.div>
  );
}