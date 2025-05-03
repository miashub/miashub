// constants.ts

export const PROJECTS = [
  {
    title: "Inventory Manager",
    description: "Barcode-based inventory system using Django + React with stock tracking and scan logs.",
    icons: ["react", "django", "tailwind", "postgresql"],
    live: "https://inventoryfrontened.vercel.app",
    github: "https://github.com/miashub/inventory-management",
    details: {
      features: [
        "Barcode scanning with device camera",
        "Real-time stock level tracking",
        "Low stock alerts",
        "Scan history logging",
        "CSV export functionality",
        "Responsive mobile-friendly UI"
      ],
      challenges: [
        "Implementing real-time barcode scanning",
        "Syncing frontend inventory updates",
        "Designing intuitive scan logs"
      ]
    }
  },
  {
    title: "Secure File Sharing",
    description: "Encrypted file sharing using Django and Fernet encryption with previews and auth.",
    icons: ["python", "django", "postgresql", "html", "css"],
    live: "https://sfh-web.onrender.com",
    github: "https://github.com/miashub/SHF-file-sharing-website",
    details: {
      features: [
        "End-to-end file encryption",
        "Secure user authentication",
        "File previews for multiple formats",
        "Granular access controls",
        "Admin dashboard",
        "PostgreSQL database"
      ],
      challenges: [
        "Implementing file encryption/decryption",
        "Handling large file uploads",
        "Creating secure sharing workflows"
      ]
    }
  }
];

// --- Organized SKILLS with categories ---

export const SKILL_CATEGORIES = [
    {
      title: "Frontend",
      icon: "monitor",
      skills: [
        { name: "React", icon: "react" },
        { name: "Next.js", icon: "nextjs" },
        { name: "Tailwind CSS", icon: "tailwind" },
        { name: "JavaScript", icon: "javascript" },
        { name: "TypeScript", icon: "typescript" },
        { name: "HTML5", icon: "html" },
        { name: "CSS3", icon: "css" },
      ],
    },
    {
      title: "Backend & Databases",
      icon: "server",
      skills: [
        { name: "Django", icon: "django" },
        { name: "Python", icon: "python" },
        { name: "PostgreSQL", icon: "postgresql" },
        { name: "MySQL", icon: "mysql" },
      ],
    },
    {
      title: "Programming Languages",
      icon: "code",
      skills: [
        { name: "Python", icon: "python" },
        { name: "C++", icon: "c" },
        { name: "TypeScript", icon: "typescript" },
        { name: "JavaScript", icon: "javascript" },
      ],
    },
    {
      title: "DevOps & Tools",
      icon: "settings",
      skills: [
        { name: "Linux", icon: "linux" },
        { name: "Git", icon: "git" },
        { name: "VS Code", icon: "vscode" },
      ],
    }
  ];
  