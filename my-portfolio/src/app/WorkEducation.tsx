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
      skills: ['HTML', 'CSS', 'JavaScript','Event Management'],
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
    return items.map(item => {
      let roleOrDegree = '';
      let companyOrSchool = '';
      let period = '';
      let descriptionPoints: string[] = [];
      let skills: string[] = [];

      if ('role' in item) {
        roleOrDegree = item.role;
        companyOrSchool = item.company;
        period = item.period;
        descriptionPoints = item.description ? item.description.split('\n') : [];
        skills = item.skills || [];
      } else {
        roleOrDegree = item.degree;
        companyOrSchool = item.school;
        period = item.period;
        descriptionPoints = item.description ? item.description.split('\n') : [];
        skills = item.skills || [];
      }

      return {
        roleOrDegree,
        companyOrSchool,
        period,
        descriptionPoints,
        skills,
      };
    });
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
      let result = '';

      const lockProgress = (currentFrame / frames) * maxLength;

      for (let i = 0; i < maxLength; i++) {
        const fromChar = from[i] || '';
        const toChar = to[i] || '';

        if (i < lockProgress) {
          result += toChar;
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
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
    <section id="work-education" className="min-h-screen flex flex-col items-center px-6 gap-5 pt-25 pb-5 relative overflow-hidden">

      {/* ✨ Animate Whole Group */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: false, amount: 0.1 }}
        className="flex flex-col items-center w-full gap-10"
      >

        {/* ✨ Heading */}
        <h3
          className={`text-4xl md:text-5xl font-extrabold text-center bg-clip-text text-transparent ${
            theme === 'nebula'
              ? 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500'
              : 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500'
          } drop-shadow-lg`}
        >
          Work & Education
        </h3>

        {/* ✨ Tabs */}
        <div className="sticky top-1 z-20 flex justify-center gap-8 bg-white/5 backdrop-blur-md rounded-xl py-3 px-6 shadow-md border border-white/10">
          <button
            onClick={() => setTab('work')}
            disabled={scrambling}
            className={`px-6 py-3 rounded-lg text-base font-semibold transition-all ${
              activeTab === 'work' ? `bg-white/10 ${tabColor} shadow-md` : 'text-gray-400 hover:text-white'
            }`}
          >
            Work Experience
          </button>
          <button
            onClick={() => setTab('education')}
            disabled={scrambling}
            className={`px-6 py-3 rounded-lg text-base font-semibold transition-all ${
              activeTab === 'education' ? `bg-white/10 ${tabColor} shadow-md` : 'text-gray-400 hover:text-white'
            }`}
          >
            Education
          </button>
        </div>

        {/* ✨ Cards Section */}
        <div className="max-w-7xl w-full p-10 rounded-2xl border border-white/5 shadow-md shadow-white/5 backdrop-blur-md bg-white/5 flex flex-col gap-8">
          {displayedItems.map((item, index) => {
            const { roleOrDegree, companyOrSchool, period, descriptionPoints, skills } = item;
            const isReadyToWork = roleOrDegree.trim() === 'Ready to Work..';

            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl shadow-md flex flex-col gap-2 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
              >
                <h3 className={`text-2xl font-bold ${tabColor}`}>{roleOrDegree}</h3>
                {!isReadyToWork && companyOrSchool && <p className="text-gray-300">{companyOrSchool}</p>}
                {!isReadyToWork && period && <p className="text-gray-400 text-sm whitespace-pre-line">{period}</p>}

                {!isReadyToWork && (
                  <div className="text-gray-300 mt-4">
                    <ul className="flex flex-col gap-2 mb-4">
                      {descriptionPoints.map((point, idx) => (
                        point.trim() && (
                          <li key={idx} className="relative pl-6">
                            <span
                              className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full ${bulletColor} shadow-md`}
                            ></span>
                            {point.trim()}
                          </li>
                        )
                      ))}
                    </ul>

                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-2">
                        {skills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-sm shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </motion.div>
    </section>
  );
}
