import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer 
      className="text-center py-8 bg-[rgba(10,10,26,0.9)] border-t border-indigo-900/30 text-gray-400 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <p className="mb-2">© {new Date().getFullYear()} Mia's Portfolio</p>
      <p className="text-sm text-gray-500">Built with Next.js & Tailwind CSS</p>
    </motion.footer>
  );
}