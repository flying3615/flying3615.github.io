export interface Role {
  title: string;
  dates: string;
  bullets: string[];
}

export interface Experience {
  company: string;
  location: string;
  span: string;
  roles: Role[];
}

export interface EducationEntry {
  years: string;
  school: string;
  degree: string;
}

export const SUMMARY =
  'Senior full stack developer with over a decade of professional experience delivering mission-critical software across internet banking, national betting infrastructure, government land-information systems and telecom network management. Equally fluent in the JVM — Java, Kotlin, Spring Boot — and the modern web — TypeScript and React. Oracle Certified Professional Java SE 11 Developer, Certified Kubernetes Application Developer and Administrator, and AWS Certified Solutions Architect Professional. Pragmatic, delivery-focused, and a vibe coding lover at heart.';

export const EXPERIENCES: Experience[] = [
  {
    company: 'Toitū Te Whenua LINZ',
    location: 'Land Information New Zealand',
    span: '2021 — Present · 4y 10m',
    roles: [
      {
        title: 'Senior Digital Specialist',
        dates: 'Jan 2025 — Present',
        bullets: [
          "Lead full stack delivery across the organisation's digital survey and land-information platforms, partnering closely with product and UX.",
          'Drive engineering standards and mentor developers while shipping new features at pace.',
        ],
      },
      {
        title: 'Full Stack Developer (Contractor)',
        dates: 'Sep 2021 — Jan 2025',
        bullets: [
          'Built an online survey system end-to-end, collaborating closely with the customer and UX team to ensure rapid delivery of new features.',
          'Conducted thorough analysis of the legacy system to facilitate the migration and re-implementation of its functions into the new platform.',
        ],
      },
    ],
  },
  {
    company: 'ANZ',
    location: 'Wellington & Wairarapa, NZ',
    span: '2019 — 2021 · 2y 1m',
    roles: [
      {
        title: 'Senior Program Analyst',
        dates: 'Sep 2019 — Sep 2021',
        bullets: [
          'Maintained and developed new features for both frontend and backend of the ANZ Internet Banking system, used daily across New Zealand.',
          'Collaborated with external teams to develop and deploy new microservices.',
          'Participated in an on-call roster to ensure high availability of the internet banking platform.',
        ],
      },
    ],
  },
  {
    company: 'SG Digital',
    location: 'Scientific Games · On-site at NZ Racing Board (TAB)',
    span: '2017 — 2019 · 2y',
    roles: [
      {
        title: 'Senior Software Engineer',
        dates: 'Sep 2017 — Aug 2019',
        bullets: [
          'Developed and delivered a high-throughput, next-generation betting system serving customers throughout New Zealand.',
          'Collaborated closely with a global development team and the customer to ensure rapid delivery of new features.',
        ],
      },
    ],
  },
  {
    company: 'Alcatel-Lucent',
    location: 'COM&XMC Network Management System',
    span: '2010 — 2016 · 5y 7m',
    roles: [
      {
        title: 'Software Engineer',
        dates: 'Dec 2010 — Jun 2016',
        bullets: [
          'Responsible for the development of Fault Management features for the COM&XMC network management system on the Java EE stack.',
          'Facilitated communication between Java and C++ components via CORBA (OpenFusion Notification Service).',
          'Developed the product on a Linux platform within Agile development practices.',
        ],
      },
    ],
  },
  {
    company: 'Zhaopin.com',
    location: 'CRM & Billing',
    span: '2009 — 2010 · 1y 1m',
    roles: [
      {
        title: 'Software Developer',
        dates: 'Aug 2009 — Aug 2010',
        bullets: [
          'Associate Java developer responsible for the website billing quotation model and CRM new-feature development.',
        ],
      },
    ],
  },
];

export const CORE_SKILLS = [
  'React.js', 'TypeScript', 'JavaScript', 'Kotlin', 'Java', 'Spring Boot',
  'Kubernetes', 'AWS', 'Microservices', 'Java EE', 'Linux', 'Agile',
];

export const AI_SKILLS = [
  'Claude Code', 'Codex', 'MCP', 'Agent Skills', 'Vibe Coding',
  'LLM Integration', 'Prompt Engineering', 'AI Pair Programming',
];

export const CERTIFICATIONS = [
  'Oracle Certified Professional: Java SE 11 Developer',
  'Certified Kubernetes Application Developer (CKAD)',
  'Certified Kubernetes Administrator (CKA)',
  'AWS Certified Solutions Architect – Professional',
  'AWS Certified Developer – Associate',
];

export const EDUCATION: EducationEntry[] = [
  {
    years: '2016 — 2017',
    school: 'Wintec — Waikato Institute of Technology',
    degree: 'Graduate Diploma, Information Technology',
  },
  {
    years: '2005 — 2009',
    school: 'Qingdao University of Science & Technology',
    degree: "Bachelor's Degree, Electrical, Electronic & Communications Engineering",
  },
];
