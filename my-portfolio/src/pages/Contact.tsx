'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export default function Contact({ theme }: { theme: 'nebula' | 'supernova' }) {
  const getHoverStyles = (icon: string) => {
    if (theme === 'nebula') {
      if (icon === 'mail') return 'hover:text-indigo-400 hover:drop-shadow-[0_0_1px_indigo]';
      if (icon === 'github') return 'hover:text-purple-400 hover:drop-shadow-[0_0_1px_purple]';
      if (icon === 'linkedin') return 'hover:text-blue-400 hover:drop-shadow-[0_0_1px_skyblue]';
    } else {
      if (icon === 'mail') return 'hover:text-yellow-400 hover:drop-shadow-[0_0_2px_gold]';
      if (icon === 'github') return 'hover:text-orange-400 hover:drop-shadow-[0_0_2px_orange]';
      if (icon === 'linkedin') return 'hover:text-amber-400 hover:drop-shadow-[0_0_2px_amber]';
    }
    return '';
  };

  return (
    <section id="contact" className="flex flex-col items-center justify-center min-h-[80vh] px-6 pt-25 pb-10">

      
<motion.div 
  className={`relative w-full max-w-2xl bg-[rgba(10,10,26,0.8)] backdrop-blur-md p-10 md:p-14 rounded-3xl border border-gray-700/40 
    transition-all duration-500 z-10
    ${theme === 'nebula'
      ? 'shadow-[0_0_60px_rgba(99,102,241,0.4)]'  
      : 'shadow-[0_0_60px_rgba(251,191,36,0.4)]' 
    }`}
  initial={{ scale: 0.9, opacity: 0 }}
  whileInView={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.6 }}
  viewport={{ amount: 0.2 }}
>

        <motion.h3 
          className={`text-4xl font-bold mb-8 text-center bg-clip-text text-transparent ${
            theme === 'nebula'
              ? 'bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500'
              : 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500'
          }`}
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Let's Connect
        </motion.h3>

        <motion.p 
          className="text-gray-300 mb-10 text-lg text-center leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          I’m currently open to new opportunities.<br />
          Feel free to reach out if you're looking for a motivated developer ready to contribute and grow.
        </motion.p>

        <motion.div 
          className="flex justify-center items-center gap-10 pt-4 text-4xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.a 
            href="mailto:fathimas0207@gmail.com" 
            className={`text-gray-400 ${getHoverStyles('mail')} transition-all`}
            whileHover={{ scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <FaEnvelope />
          </motion.a>

          <motion.a 
            href="https://github.com/miashub/" 
            className={`text-gray-400 ${getHoverStyles('github')} transition-all`}
            whileHover={{ scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </motion.a>

          <motion.a 
            href="linkedin.com/in/mia-shajahan" 
            className={`text-gray-400 ${getHoverStyles('linkedin')} transition-all`}
            whileHover={{ scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
