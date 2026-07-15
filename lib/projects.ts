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
    eyebrow: 'Toitū Te Whenua LINZ · Internal Engineering Tooling',
    role: 'Creator & Maintainer',
    shot: '[ knowledge platform ]',
    desc: 'A Graph RAG knowledge base that maps a large multi-repo codebase — domain classification, code symbols, cross-repo dependency graphs — served to AI coding agents via MCP.',
    tags: ['MCP', 'AI Agents', 'Graph RAG', 'React', 'Node.js'],
    details: [
      'Built an ingest pipeline that classifies repos by domain and extracts code symbols across a large multi-repo engineering org.',
      'Modelled cross-repo dependency and call-graph relationships in a graph database, queryable in real time.',
      'Exposed the knowledge base as MCP tools, letting AI coding agents answer "where is X defined" and "who calls Y" without ad-hoc grepping.',
      'Shipped a web portal alongside the MCP tools for browsing the knowledge graph directly.',
    ],
    links: [],
  },
  {
    name: 'Pinakes Plugin',
    eyebrow: 'Toitū Te Whenua LINZ · Internal Engineering Tooling',
    role: 'Creator',
    shot: '[ agent tooling ]',
    desc: 'A Claude Code plugin and marketplace that exposes the knowledge base as agent skills — turning "where is X defined, who calls it, which repo owns this" into single tool calls instead of ad-hoc grepping.',
    tags: ['Claude Code', 'MCP', 'Developer Tooling', 'AI Agents'],
    details: [
      'Packaged the knowledge graph as a set of Claude Code skills and MCP tools covering symbol lookup, call-graph navigation, and cross-repo dependency queries.',
      'Built a lightweight plugin-marketplace registry so the tooling can be installed without cloning the full knowledge-base source.',
      'Used daily across the engineering team to cut down on manual grepping and blind cross-repo exploration.',
    ],
    links: [],
  },
  {
    name: 'AutoRally',
    eyebrow: 'Personal Project',
    role: 'Creator',
    shot: '[ badminton club app ]',
    shotIframeSrc: './works/autorally.html',
    desc: 'A cross-platform desktop app for badminton club organizers — handling session check-in, smart court filling, fee tracking, analytics, and tournaments, all offline with no server required.',
    tags: ['Electron', 'React', 'SQLite', 'TypeScript'],
    details: [
      'Built four core modules: session management, a live match panel with smart court generation, per-session analytics, and a fee/credit ledger.',
      'Smart court-fill algorithm weighs skill level, wait time, and play history simultaneously to fill all courts in one pass.',
      'Supports three tournament formats (round robin, single elimination, double elimination) with bracket management built in.',
      'Ships as a fully offline app with no data leaving the machine — available on macOS, Windows, and Linux via Electron.',
    ],
    links: [{ label: 'Slide Deck', href: './works/autorally.html' }],
  },
  {
    name: 'Online Survey System',
    eyebrow: '2021 — 2025 · Toitū Te Whenua LINZ',
    role: 'Full Stack Developer',
    shot: '[ survey platform ]',
    shotIframeSrc: './works/survey.html',
    desc: "A ground-up online survey platform for New Zealand's national land-information agency, replacing an ageing legacy system.",
    tags: ['React', 'TypeScript', 'Kotlin', 'Spring Boot'],
    details: [
      'Built the system end-to-end, working closely with the customer and UX team to ship new features at pace.',
      'Analysed the legacy system in depth and migrated its functionality into the new platform without data loss.',
      'Helped shape front-end standards and mentored developers on the delivery team.',
    ],
    links: [{ label: 'Case Study', href: './works/survey.html' }],
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
    links: [],
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
