export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  name: string;
  eyebrow: string;
  role: string;
  shot: string;
  shotIframeSrc?: string;
  desc: string;
  tags: string[];
  details: string[];
  links: ProjectLink[];
}

export const PROJECTS: Project[] = [
  {
    name: 'Pinakes',
    eyebrow: 'Open Source · Personal Project',
    role: 'Creator & Maintainer',
    shot: '[ knowledge platform ]',
    shotIframeSrc: '../works/pinakes.html',
    desc: 'A personal knowledge-management platform that ingests notes, tickets, and docs into a unified store — queryable by AI agents via MCP tools, with Atlassian integration, a personal wiki, and an extensible plugin system.',
    tags: ['MCP', 'AI Agents', 'Atlassian', 'React', 'Node.js'],
    details: [
      'Built an ingest pipeline to pull knowledge from multiple sources (notes, tickets, docs) into a unified storage layer.',
      'Developed an Atlassian connector for seamless Jira and Confluence integration.',
      'Exposed knowledge retrieval as MCP tools, enabling AI agents to query personal and team context in real time.',
      'Shipped a web portal with a personal wiki and an extensible plugin system for custom connectors.',
    ],
    links: [{ label: 'Demo Deck', href: '../works/pinakes.html' }],
  },
  {
    name: 'Online Survey System',
    eyebrow: '2021 — 2025 · Toitū Te Whenua LINZ',
    role: 'Full Stack Developer',
    shot: '[ survey platform ]',
    desc: "A ground-up online survey platform for New Zealand's national land-information agency, replacing an ageing legacy system.",
    tags: ['React', 'TypeScript', 'Kotlin', 'Spring Boot'],
    details: [
      'Built the system end-to-end, working closely with the customer and UX team to ship new features at pace.',
      'Analysed the legacy system in depth and migrated its functionality into the new platform without data loss.',
      'Helped shape front-end standards and mentored developers on the delivery team.',
    ],
    links: [{ label: 'Case Study', href: '#' }],
  },
  {
    name: 'ANZ Internet Banking',
    eyebrow: '2019 — 2021 · ANZ',
    role: 'Senior Program Analyst',
    shot: '[ banking platform ]',
    desc: 'Feature development and reliability work on the internet banking platform used daily across New Zealand.',
    tags: ['Java', 'JavaScript', 'Microservices', 'Spring Boot'],
    details: [
      'Maintained and built new features across both the frontend and backend.',
      'Partnered with external teams to develop and deploy new microservices.',
      'Held an on-call roster to keep the platform highly available.',
    ],
    links: [{ label: 'Case Study', href: '#' }],
  },
  {
    name: 'Next-Gen Betting System',
    eyebrow: '2017 — 2019 · SG Digital · TAB',
    role: 'Senior Software Engineer',
    shot: '[ betting system ]',
    desc: 'A high-throughput, next-generation betting platform serving customers throughout New Zealand.',
    tags: ['Java', 'High-Throughput', 'Microservices', 'Agile'],
    details: [
      'Engineered and delivered the platform on-site for the New Zealand Racing Board (TAB).',
      'Worked with a global development team and the customer to deliver features rapidly.',
      'Focused on throughput and reliability under heavy concurrent load.',
    ],
    links: [],
  },
  {
    name: 'COM&XMC Network Mgmt',
    eyebrow: '2010 — 2016 · Alcatel-Lucent',
    role: 'Software Engineer',
    shot: '[ network management ]',
    desc: 'Fault Management for a carrier-grade telecom network management system on the Java EE stack.',
    tags: ['Java EE', 'CORBA', 'Linux', 'C++ Interop'],
    details: [
      'Built Fault Management features for the COM&XMC network management system.',
      'Bridged Java and C++ components via CORBA (OpenFusion Notification Service).',
      'Developed on a Linux platform within Agile practices.',
    ],
    links: [],
  },
];
