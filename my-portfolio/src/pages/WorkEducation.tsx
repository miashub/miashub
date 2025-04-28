'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type WorkItem = {
  role: string;
  company: string;
  period: string;
  description: string;
  skills?: string[];
};

type EducationItem = {
  degree: string;
  school: string;
  period: string;
  description: string;
  skills?: string[];
};

type Tab = 'work' | 'education';

interface DisplayedItem {
  roleOrDegree: string;
  companyOrSchool: string;
  period: string;
  descriptionPoints: string[];
  skills: string[];
}

export default function WorkEducation({
  theme,
  activeTab,
  setTab,
}: {
  theme: 'nebula' | 'supernova';
  activeTab: Tab;
  setTab: (tab: Tab) => void;
}) {
  const tabColor = theme === 'nebula' ? 'text-purple-400' : 'text-yellow-400';
  const bulletColor = theme === 'nebula' ? 'bg-purple-400' : 'bg-yellow-400';

  const workExperience: WorkItem[] = [
    {
      role: 'Software Support Intern',
      company: 'Infotech Computers, India',
      period: 'July 2023 – Nov 2023',
      description:
        'Troubleshot internal software and system issues for users.\n' +
        'Updated backend inventory databases using basic automation scripts.\n' +
        'Collaborated with developers to document and resolve technical bugs.',
      skills: ['Python', 'SQL', 'Troubleshooting'],
    },
    {
      role: 'Tech Community Volunteer',
      company: 'Infotech Computers, India',
      period: 'June 2023',
      description:
        'Led beginner programming workshops, focusing on web development fundamentals (HTML, CSS, JavaScript).\n' +
        'Mentored students individually, helping debug projects and guiding them through coding challenges.\n' +
        'Fostered a collaborative and supportive learning environment, enhancing the programming skills of participants.',
      skills: ['HTML', 'CSS', 'JavaScript', 'Mentoring'],
    },
    {
      role: 'Volunteer Web Assistant',
      company: 'Quilon Social Service Charity Trust, India',
      period: 'May 2022 – Oct 2022',
      description:
        'Designed and maintained web pages to support charity events.\n' +
        'Created digital posters and managed social media outreach.\n' +
        'Built online registration forms and simple event tracking sheets.',
      skills: ['HTML', 'CSS', 'JavaScript', 'Event Management'],
    },
  ];

  const education: EducationItem[] = [
    {
      degree: 'Bachelor of Software Engineering (BSA)',
      school: 'Seneca Polytechnic College – Toronto',
      period: 'Jan 2024 – Present\nExpected Graduation: Dec 2027',
      description:
        'Operating Systems (Linux Kernel)\n' +
        'Data Structures and Algorithm\n' +
        'Artificial Intelligence (AI)\n' +
        'Object-Oriented Programming (OOP)\n' +
        'Database Management Systems (RDBMS)',
      skills: ['C', 'Python', 'C++', 'JavaScript', 'HTML', 'CSS', 'MySQL'],
    },
    {
      degree: 'Diploma in Computer Application',
      school: 'Infotech Computers – India',
      period: 'May 2023 – Oct 2023',
      description:
        'Computer Networks\n' +
        'Databases\n' +
        'Application Development\n' +
        'Basic Web Development',
    },
    {
      degree: 'High School Diploma',
      school: 'Sunrise Senior Secondary School – India',
      period: 'Graduated: April 2022',
      description: 'Computer Science\nMathematics\nPhysics',
    },
  ];

  const getItems = (tab: Tab) => (tab === 'work' ? workExperience : education);

  const mergeItems = (items: (WorkItem | EducationItem)[]): DisplayedItem[] => {
    return items.map(item => ({
      roleOrDegree: 'role' in item ? item.role : item.degree,
      companyOrSchool: 'role' in item ? item.company : item.school,
      period: item.period,
      descriptionPoints: item.description ? item.description.split('\n') : [],
      skills: item.skills || [],
    }));
  };

  const [displayedItems, setDisplayedItems] = useState<DisplayedItem[]>(mergeItems(getItems(activeTab)));
  const [scrambling, setScrambling] = useState(false);

  useEffect(() => {
    if (!scrambling) fullContentScramble(mergeItems(getItems(activeTab)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fullContentScramble = (newItems: DisplayedItem[]) => {
    setScrambling(true);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=<>?';
    const frames = 30;
    let currentFrame = 0;

    const oldItems = displayedItems;

    const scrambleText = (from: string, to: string) => {
      const maxLength = Math.max(from.length, to.length);
      const lockProgress = (currentFrame / frames) * maxLength;
      let result = '';

      for (let i = 0; i < maxLength; i++) {
        result += i < lockProgress ? to[i] || '' : chars[Math.floor(Math.random() * chars.length)];
      }

      return result;
    };

    const interval = setInterval(() => {
      setDisplayedItems(() =>
        newItems.map((targetItem, idx) => {
          const sourceItem = oldItems[idx] || {
            roleOrDegree: '',
            companyOrSchool: '',
            period: '',
            descriptionPoints: [],
            skills: [],
          };

          return {
            roleOrDegree: scrambleText(sourceItem.roleOrDegree, targetItem.roleOrDegree),
            companyOrSchool: scrambleText(sourceItem.companyOrSchool, targetItem.companyOrSchool),
            period: scrambleText(sourceItem.period, targetItem.period),
            descriptionPoints: targetItem.descriptionPoints.map((point, i) =>
              scrambleText(sourceItem.descriptionPoints?.[i] || '', point)
            ),
            skills: targetItem.skills.map((skill, i) =>
              scrambleText(sourceItem.skills?.[i] || '', skill)
            ),
          };
        })
      );

      currentFrame++;
      if (currentFrame > frames) {
        clearInterval(interval);
        setScrambling(false);
      }
    }, 20);
  };

  return (
    <section id="work-education" className="min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-10 gap-5 pt-24 pb-8 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: false, amount: 0.1 }}
        className="flex flex-col items-center w-full gap-10"
      >
        {/* Heading */}
        <h3
          className={`text-3xl md:text-5xl font-extrabold text-center bg-clip-text text-transparent ${
            theme === 'nebula'
              ? 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500'
              : 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500'
          } drop-shadow-lg`}
        >
          Work & Education
        </h3>

        {/* Tabs */}
        <div className="sticky top-1 z-20 flex justify-center gap-2 sm:gap-8 bg-white/5 backdrop-blur-sm rounded-md sm:rounded-xl py-2 px-3 sm:py-3 sm:px-6 shadow-md border border-white/10">
          <button
            onClick={() => setTab('work')}
            disabled={scrambling}
            className={`px-3 sm:px-6 py-1 sm:py-3 rounded-md sm:rounded-lg text-xs sm:text-base font-semibold transition-all ${
              activeTab === 'work' ? `bg-white/10 ${tabColor} shadow-md` : 'text-gray-400 hover:text-white'
            }`}
          >
            Work
          </button>
          <button
            onClick={() => setTab('education')}
            disabled={scrambling}
            className={`px-3 sm:px-6 py-1 sm:py-3 rounded-md sm:rounded-lg text-xs sm:text-base font-semibold transition-all ${
              activeTab === 'education' ? `bg-white/10 ${tabColor} shadow-md` : 'text-gray-400 hover:text-white'
            }`}
          >
            Education
          </button>
        </div>

        {/* Cards Section */}
        <div className="max-w-7xl w-full p-2 sm:p-6 md:p-10 rounded-2xl border border-white/5 shadow-md shadow-white/5 backdrop-blur-md bg-white/5 flex flex-col gap-6 sm:gap-8">
          {displayedItems.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md flex flex-col gap-3 transition-transform duration-300 ease-in-out hover:scale-100 sm:hover:scale-105 hover:shadow-lg"
            >
              <h3 className={`text-lg sm:text-2xl font-bold ${tabColor}`}>{item.roleOrDegree}</h3>
              {item.companyOrSchool && <p className="text-gray-300">{item.companyOrSchool}</p>}
              {item.period && <p className="text-gray-400 text-xs sm:text-sm whitespace-pre-line">{item.period}</p>}

              <ul className="flex flex-col gap-2 mt-3 sm:mt-4">
                {item.descriptionPoints.map((point, idx) => (
                  point.trim() && (
                    <li key={idx} className="relative pl-5 sm:pl-6 text-gray-300 text-sm">
                      <span
                        className={`absolute left-0 top-2 w-2 h-2 rounded-full ${bulletColor} shadow-md`}
                      ></span>
                      {point.trim()}
                    </li>
                  )
                ))}
              </ul>

              {item.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-3">
                  {item.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 sm:px-3 py-1 bg-white/10 rounded-full text-xs sm:text-sm shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
