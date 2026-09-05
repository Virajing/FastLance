export const CATEGORIES = [
  { id: 'tech-dev', name: 'Web & App Development', icon: 'Code', count: 1420, slug: 'development', description: 'Fullstack, React, Next.js, Mobile apps, APIs and Cloud architectures' },
  { id: 'ui-ux', name: 'UI/UX & Product Design', icon: 'Palette', count: 980, slug: 'design', description: 'Design systems, Figma, mobile apps, SaaS dashboards, and Neomorphic interfaces' },
  { id: 'ai-ml', name: 'AI & Data Science', icon: 'Cpu', count: 640, slug: 'ai', description: 'LLM agents, fine-tuning, computer vision, data pipelines, and predictive models' },
  { id: 'marketing', name: 'Growth & Marketing', icon: 'TrendingUp', count: 720, slug: 'marketing', description: 'SEO optimization, Google & Meta ads, content strategy, and viral branding' },
  { id: 'writing', name: 'Content & Copywriting', icon: 'PenTool', count: 510, slug: 'writing', description: 'Technical documentation, pitch decks, landing page copy, and ghostwriting' },
  { id: 'video-audio', name: 'Video & Motion Design', icon: 'Video', count: 430, slug: 'video', description: 'Product explainers, 3D animations, reels editing, and voiceover production' },
  { id: 'cloud-devops', name: 'DevOps & Security', icon: 'ShieldCheck', count: 390, slug: 'devops', description: 'AWS, Docker, Kubernetes, CI/CD pipelines, and penetration testing' }
];

export const FREELANCERS = [
  {
    id: 'fl-1',
    name: 'Elena Rostova',
    title: 'Senior Fullstack & AI Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    hourlyRate: 85,
    rating: 4.98,
    reviewsCount: 142,
    jobSuccess: 99,
    location: 'Berlin, Germany',
    responseTime: '< 1 hour',
    availability: 'Available Now',
    verified: true,
    bio: 'Ex-Stripe Senior Engineer specializing in React, Node.js, and autonomous LLM agent systems. I build fast, resilient SaaS applications with pixel-perfect design.',
    about: 'I have over 8 years of production software engineering experience. I focus on building scalable web apps using React, Next.js, Node.js, and Python. Recently, I have architected custom AI copilots and vector workflows for startups backed by Y Combinator.',
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'LangChain', 'Tailwind CSS', 'PostgreSQL'],
    languages: ['English (Fluent)', 'German (Native)', 'French (Conversational)'],
    stats: {
      completedProjects: 128,
      hoursWorked: 1840,
      repeatClientsPct: 94
    },
    portfolio: [
      { id: 'p1', title: 'Synapse AI Workspace', category: 'Web App', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', description: 'An AI-powered document editor with live semantic search and collaborative canvas.' },
      { id: 'p2', title: 'Aura Fintech Platform', category: 'Fintech', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80', description: 'Real-time multi-currency transaction dashboard with instant payment settlement.' },
      { id: 'p3', title: 'Veloce Design System', category: 'UI Kit', image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80', description: 'Enterprise component library used across 14 internal microfrontends.' }
    ],
    reviews: [
      { id: 'r1', clientName: 'David Sterling', clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', rating: 5, date: '2 days ago', comment: 'Elena is exceptional. She delivered our AI copilot 4 days ahead of deadline with zero bugs. Communication was proactive and clear.', projectTitle: 'AI Analytics Copilot MVP' },
      { id: 'r2', clientName: 'Sarah Jenkins', clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', rating: 5, date: '2 weeks ago', comment: 'Superb technical depth and architectural clarity. Elena elevated our entire codebase. Will definitely hire again!', projectTitle: 'Next.js SaaS Migration' }
    ]
  },
  {
    id: 'fl-2',
    name: 'Marcus Vance',
    title: 'Lead UI/UX & Brand Designer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    hourlyRate: 75,
    rating: 4.95,
    reviewsCount: 98,
    jobSuccess: 98,
    location: 'San Francisco, USA',
    responseTime: '< 2 hours',
    availability: 'Available Now',
    verified: true,
    bio: 'Award-winning product designer crafting clean, minimal, and neomorphic user experiences for top venture-backed companies.',
    about: 'I specialize in zero-to-one product design, high-converting web experiences, and micro-interactions. My work blends tactile neomorphism with crisp typography and human ergonomics.',
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping', 'User Research', 'Neomorphism', 'Tailwind CSS'],
    languages: ['English (Native)', 'Spanish (Basic)'],
    stats: {
      completedProjects: 86,
      hoursWorked: 1320,
      repeatClientsPct: 91
    },
    portfolio: [
      { id: 'p4', title: 'Krypton Protocol Portal', category: 'Web3 / Fintech', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80', description: 'DeFi lending interface with tactile neomorphic card states and live yields.' },
      { id: 'p5', title: 'Pulse Health App', category: 'Mobile UX', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80', description: 'Patient monitoring iOS application with accessible high-contrast tactile elements.' }
    ],
    reviews: [
      { id: 'r3', clientName: 'Thomas Wright', clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80', rating: 5, date: '1 month ago', comment: 'Marcus transformed our clunky enterprise tool into a sleek, beloved product. Our churn dropped by 22%.', projectTitle: 'Cloud Platform Redesign' }
    ]
  },
  {
    id: 'fl-3',
    name: 'Sophia Chen',
    title: 'Mobile App Specialist (React Native & Flutter)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    hourlyRate: 80,
    rating: 4.97,
    reviewsCount: 114,
    jobSuccess: 100,
    location: 'Toronto, Canada',
    responseTime: '< 30 mins',
    availability: 'Available Now',
    verified: true,
    bio: 'Building butter-smooth cross-platform mobile apps with 60fps animations, offline-first sync, and native module bridges.',
    about: 'I have published over 25 mobile applications to both the iOS App Store and Google Play. I obsess over micro-interactions, gesture navigation, and biometric authentication.',
    skills: ['React Native', 'Flutter', 'iOS / Swift', 'Android / Kotlin', 'GraphQL', 'Firebase', 'Supabase'],
    languages: ['English (Fluent)', 'Mandarin (Native)'],
    stats: {
      completedProjects: 112,
      hoursWorked: 1650,
      repeatClientsPct: 96
    },
    portfolio: [
      { id: 'p6', title: 'ZenFlow Meditation', category: 'Health & Wellness', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80', description: 'Audio streaming mobile app with offline downloads and spatial audio.' },
      { id: 'p7', title: 'FleetPulse Courier', category: 'Logistics', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80', description: 'Live GPS route optimization and barcode scanning tool for delivery fleets.' }
    ],
    reviews: [
      { id: 'r4', clientName: 'Emily Watson', clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80', rating: 5, date: '3 weeks ago', comment: 'Sophia solved complex gesture lags in our React Native app within 48 hours. Absolute magician!', projectTitle: 'Mobile Performance Audit' }
    ]
  },
  {
    id: 'fl-4',
    name: 'Dev Patel',
    title: 'Cloud Architect & DevOps Consultant',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    hourlyRate: 95,
    rating: 4.93,
    reviewsCount: 67,
    jobSuccess: 97,
    location: 'London, UK',
    responseTime: '< 3 hours',
    availability: 'Part-time',
    verified: true,
    bio: 'AWS Certified Solutions Architect. Specializing in zero-downtime migrations, Terraform infrastructure as code, and SOC2 compliance.',
    about: 'I help high-growth teams migrate from monolithic servers to scalable containerized clusters on Kubernetes and AWS serverless.',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD Pipelines', 'Prometheus', 'Grafana', 'PostgreSQL'],
    languages: ['English (Native)', 'Hindi (Fluent)'],
    stats: {
      completedProjects: 54,
      hoursWorked: 920,
      repeatClientsPct: 88
    },
    portfolio: [
      { id: 'p8', title: 'Global Multi-Region AWS Infra', category: 'Infrastructure', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80', description: 'Automated Terraform code managing 12 regions with auto-failover latency under 200ms.' }
    ],
    reviews: [
      { id: 'r5', clientName: 'Liam O\'Connor', clientAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80', rating: 5, date: '1 month ago', comment: 'Dev cut our monthly AWS bill from $14k to $4.8k while boosting latency and reliability.', projectTitle: 'Cloud Cost & Infra Optimization' }
    ]
  },
  {
    id: 'fl-5',
    name: 'Maya Lin',
    title: 'Growth Marketing & SEO Strategist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    hourlyRate: 65,
    rating: 4.96,
    reviewsCount: 82,
    jobSuccess: 99,
    location: 'Austin, USA',
    responseTime: '< 1 hour',
    availability: 'Available Now',
    verified: true,
    bio: 'Scaled 5 SaaS startups from $0 to $1M+ ARR through programmatic SEO, content engines, and paid acquisition funnels.',
    about: 'I combine technical SEO analysis with high-velocity conversion rate optimization. Data-driven, transparent, and focused on revenue rather than vanity metrics.',
    skills: ['Technical SEO', 'Content Strategy', 'Google Ads', 'Conversion Optimization', 'Google Analytics 4', 'Ahrefs'],
    languages: ['English (Native)'],
    stats: {
      completedProjects: 78,
      hoursWorked: 1150,
      repeatClientsPct: 92
    },
    portfolio: [
      { id: 'p9', title: 'Fintech SEO Growth Engine', category: 'Growth Strategy', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80', description: 'Drove organic search traffic from 15k to 240k monthly visitors in 6 months.' }
    ],
    reviews: [
      { id: 'r6', clientName: 'Rachel Green', clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', rating: 5, date: '5 days ago', comment: 'Maya is a powerhouse marketer. Our demo requests tripled within 60 days of implementing her playbook.', projectTitle: 'B2B SaaS Growth Overhaul' }
    ]
  },
  {
    id: 'fl-6',
    name: 'Alex Rivers',
    title: 'Product Copywriter & Technical Writer',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80',
    hourlyRate: 55,
    rating: 4.94,
    reviewsCount: 71,
    jobSuccess: 98,
    location: 'Melbourne, Australia',
    responseTime: '< 2 hours',
    availability: 'Available Now',
    verified: true,
    bio: 'Turning complex technical jargon into punchy, high-converting product copy and developer documentation.',
    about: 'I write landing page copy that sells, developer documentation that actually gets read, and microcopy that reduces user friction.',
    skills: ['Conversion Copywriting', 'Developer Docs', 'API Reference', 'UX Microcopy', 'Email Campaigns'],
    languages: ['English (Native)'],
    stats: {
      completedProjects: 65,
      hoursWorked: 890,
      repeatClientsPct: 89
    },
    portfolio: [
      { id: 'p10', title: 'OpenAPI Developer Hub', category: 'Documentation', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80', description: 'Interactive developer documentation portal with runnable code snippets and guides.' }
    ],
    reviews: [
      { id: 'r7', clientName: 'Chris Miller', clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', rating: 5, date: '2 weeks ago', comment: 'Alex is the best copywriter we have ever hired. Our homepage conversion jumped from 2.1% to 4.7%.', projectTitle: 'Landing Page Copy Refactor' }
    ]
  },
  {
    id: 'fl-7',
    name: 'Jordan Kim',
    title: '3D Motion Designer & Video Director',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=80',
    hourlyRate: 90,
    rating: 4.99,
    reviewsCount: 54,
    jobSuccess: 100,
    location: 'Seoul, South Korea',
    responseTime: '< 1 hour',
    availability: 'Available Now',
    verified: true,
    bio: 'Crafting mesmerizing 3D product reels, tactile UI animations, and high-impact launch videos in Cinema 4D and Blender.',
    about: 'My work has been featured on Product Hunt #1 of the Day and Cannes Lions. I build photorealistic 3D product visualizations that make software feel tangible.',
    skills: ['Blender', 'Cinema 4D', 'After Effects', 'Spline 3D', 'Motion Graphics', 'Sound Design'],
    languages: ['English (Fluent)', 'Korean (Native)'],
    stats: {
      completedProjects: 49,
      hoursWorked: 760,
      repeatClientsPct: 95
    },
    portfolio: [
      { id: 'p11', title: 'Hardware Teaser Launch Video', category: '3D Motion', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80', description: '45-second 3D exploded hardware render that garnered over 500k views on launch week.' }
    ],
    reviews: [
      { id: 'r8', clientName: 'Olivia Reed', clientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80', rating: 5, date: '1 month ago', comment: 'World-class aesthetic. Jordan exceeded our expectations in every single frame.', projectTitle: 'Product Launch 3D Teaser' }
    ]
  },
  {
    id: 'fl-8',
    name: 'Liam Walker',
    title: 'Cybersecurity & Smart Contract Auditor',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
    hourlyRate: 110,
    rating: 4.96,
    reviewsCount: 42,
    jobSuccess: 100,
    location: 'Dublin, Ireland',
    responseTime: '< 4 hours',
    availability: 'Available Now',
    verified: true,
    bio: 'Securing $400M+ in TVL across protocols. Specializing in Solidity audits, penetration testing, and zero-trust architectures.',
    about: 'I perform exhaustive vulnerability assessments, fuzz testing, and mathematical formal verification for high-stakes digital products.',
    skills: ['Penetration Testing', 'Solidity Audits', 'Rust', 'Web Security', 'OWASP Top 10', 'Zero Trust'],
    languages: ['English (Native)'],
    stats: {
      completedProjects: 38,
      hoursWorked: 620,
      repeatClientsPct: 93
    },
    portfolio: [
      { id: 'p12', title: 'DeFi Vault Security Audit', category: 'Security Review', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80', description: 'Identified 3 critical reentrancy vulnerabilities prior to mainnet launch.' }
    ],
    reviews: [
      { id: 'r9', clientName: 'Alexander Hayes', clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', rating: 5, date: '2 months ago', comment: 'Thorough, meticulous, and professional. The audit report was clear and easy to remediate.', projectTitle: 'Smart Contract Penetration Test' }
    ]
  }
];

export const SERVICES = [
  {
    id: 'srv-1',
    title: 'Fullstack React & Next.js SaaS Web Application Development',
    slug: 'react-nextjs-saas-development',
    category: 'development',
    categoryName: 'Web & App Development',
    freelancerId: 'fl-1',
    freelancerName: 'Elena Rostova',
    freelancerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    freelancerRating: 4.98,
    freelancerReviewsCount: 142,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80',
    rating: 4.98,
    reviewsCount: 89,
    ordersInQueue: 4,
    startingPrice: 280,
    deliveryTime: '3 days',
    shortDesc: 'Build a production-ready, highly scalable SaaS web application with React 19, Next.js, and clean Tailwind design.',
    description: 'Looking to turn your startup concept into an elite, responsive web application? I build production-grade web apps using the modern React ecosystem. Everything includes TypeScript, modular architecture, responsive layout, seamless API integration, authentication, and optimized performance score (>95 on Lighthouse).',
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'SaaS', 'Fullstack'],
    packages: {
      basic: {
        name: 'Starter Landing / MVP Page',
        price: 280,
        deliveryDays: 3,
        revisions: 2,
        description: 'Single-page responsive web application with high performance, smooth animations, and contact form.',
        features: ['1 Responsive Page', 'Modern Tailwind CSS Layout', 'SEO Metadata & OpenGraph', 'Clean TypeScript Code', 'Contact / Lead Capture Form']
      },
      standard: {
        name: 'Full Web App / SaaS MVP',
        price: 650,
        deliveryDays: 7,
        revisions: 5,
        description: 'Up to 5 pages / routes including auth flow, dashboard view, API integration, and database schema.',
        features: ['Up to 5 Interactive Pages', 'Authentication (OAuth / Email)', 'REST / GraphQL Integration', 'Dashboard Layout with Charts', 'State Management & Caching', 'Speed & Security Optimization']
      },
      premium: {
        name: 'Enterprise Production Grade',
        price: 1400,
        deliveryDays: 14,
        revisions: 'Unlimited',
        description: 'Complete multi-role SaaS platform with payment gateway (Stripe), admin portal, role permissions, and CI/CD.',
        features: ['Full Multi-Page SaaS System', 'Stripe Billing & Subscription Webhooks', 'Admin & Analytics Dashboard', 'Database Migrations & Backend Setup', 'Comprehensive End-to-End Tests', '30 Days Dedicated Support']
      }
    },
    faqs: [
      { q: 'What do I need to get started?', a: 'Just your Figma designs or a brief description of the features, user stories, and any existing API documentation.' },
      { q: 'Will the code be clean and documented?', a: 'Yes, 100% modular code with ESLint, strict TypeScript typing, and inline documentation.' },
      { q: 'Do you assist with deployment?', a: 'Absolutely! I will configure deployment on Vercel, Netlify, or AWS with automated CI/CD.' }
    ],
    reviews: [
      { id: 'sr-1', clientName: 'Marcus Wright', clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', rating: 5, date: '3 days ago', comment: 'Elena delivered an incredible dashboard for our logistics app. Blazing fast and pixel perfect.' },
      { id: 'sr-2', clientName: 'Samantha Hall', clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', rating: 5, date: '1 week ago', comment: 'Communication was smooth and the codebase is clean enough for our in-house team to easily maintain.' }
    ]
  },
  {
    id: 'srv-2',
    title: 'Premium Neomorphic & Soft UI Product Design in Figma',
    slug: 'neomorphic-soft-ui-design-figma',
    category: 'design',
    categoryName: 'UI/UX & Product Design',
    freelancerId: 'fl-2',
    freelancerName: 'Marcus Vance',
    freelancerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    freelancerRating: 4.95,
    freelancerReviewsCount: 98,
    coverImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&auto=format&fit=crop&q=80',
    rating: 4.96,
    reviewsCount: 64,
    ordersInQueue: 3,
    startingPrice: 220,
    deliveryTime: '2 days',
    shortDesc: 'Design cutting-edge, tactile Neomorphic UI and interactive prototypes that stand out from flat templates.',
    description: 'Elevate your SaaS product with a modern, tactile soft UI design system. I create clean, sophisticated interfaces that combine subtle shadows, gentle depth, and high contrast for maximum usability and aesthetic delight.',
    tags: ['Figma', 'UI/UX', 'Neomorphism', 'SaaS Design', 'Design System', 'Prototyping'],
    packages: {
      basic: {
        name: 'Single Key Screen',
        price: 220,
        deliveryDays: 2,
        revisions: 2,
        description: '1 high-fidelity tactile UI screen (Desktop or Mobile) with light theme neomorphic styling.',
        features: ['1 Screen Design in Figma', 'Custom Neomorphic Components', 'Design Tokens & Colors', 'Export Assets (SVG/PNG)']
      },
      standard: {
        name: 'Core Flow & UI System',
        price: 490,
        deliveryDays: 5,
        revisions: 4,
        description: 'Up to 5 connected screens covering the primary user journey, complete design system and interactive prototype.',
        features: ['5 Connected Screens', 'Interactive Clickable Prototype', 'Component Library (Buttons, Inputs, Cards)', 'Auto-Layout & Responsive Variants', 'Developer Handoff Notes']
      },
      premium: {
        name: 'Full Product Design Suite',
        price: 980,
        deliveryDays: 10,
        revisions: 'Unlimited',
        description: 'Complete 12-screen SaaS application design, design token documentation, and interactive prototype.',
        features: ['12+ Responsive Screens', 'Full Design System & Variables', 'Desktop + Mobile Responsive Views', 'Micro-interaction Guides', 'Interactive Prototype']
      }
    },
    faqs: [
      { q: 'Is neomorphism accessible?', a: 'Yes! Unlike early 2019 experiments, my design system uses strict WCAG AA contrast standards, crisp interior borders, and unmistakable focus states.' }
    ],
    reviews: [
      { id: 'sr-3', clientName: 'Liam Chen', clientAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80', rating: 5, date: '2 weeks ago', comment: 'Marcus created the most stunning SaaS dashboard our investors have ever seen. Highly recommended!' }
    ]
  },
  {
    id: 'srv-3',
    title: 'Custom AI Agent & LLM Chatbot Integration for Startups',
    slug: 'custom-ai-agent-llm-chatbot',
    category: 'ai',
    categoryName: 'AI & Data Science',
    freelancerId: 'fl-1',
    freelancerName: 'Elena Rostova',
    freelancerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    freelancerRating: 4.98,
    freelancerReviewsCount: 142,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1000&auto=format&fit=crop&q=80',
    rating: 4.99,
    reviewsCount: 52,
    ordersInQueue: 2,
    startingPrice: 350,
    deliveryTime: '4 days',
    shortDesc: 'Integrate intelligent AI copilots, OpenAI/Anthropic APIs, LangChain agents, and vector embeddings into your product.',
    description: 'Empower your platform with custom AI capabilities. From smart customer support agents that read your company knowledge base to automated workflows that execute complex tasks.',
    tags: ['AI Agent', 'OpenAI', 'LangChain', 'Python', 'Vector DB', 'RAG'],
    packages: {
      basic: {
        name: 'AI Chat Widget MVP',
        price: 350,
        deliveryDays: 4,
        revisions: 2,
        description: 'Custom embeddable chat widget connected to OpenAI/Anthropic with prompt guardrails.',
        features: ['AI Chat Assistant Widget', 'Custom System Prompt Design', 'Streaming Text Response', 'Error Handling & Fallbacks']
      },
      standard: {
        name: 'RAG Knowledgebase Agent',
        price: 750,
        deliveryDays: 7,
        revisions: 4,
        description: 'AI agent capable of querying your custom documents, PDFs, or database via Vector Search.',
        features: ['Vector DB Setup (Pinecone/Chroma)', 'Document Ingestion Pipeline', 'Hybrid Search & Semantic Reranking', 'Source Citation UI', 'Chat History Retention']
      },
      premium: {
        name: 'Autonomous Multi-Tool Agent',
        price: 1600,
        deliveryDays: 14,
        revisions: 'Unlimited',
        description: 'Autonomous agent that can call external APIs, perform database lookups, and execute multi-step logic.',
        features: ['Multi-agent Orchestration', 'Custom Tool & Function Calling', 'User Auth & Role Scoping', 'Admin Monitoring & Analytics', 'Production Docker Container']
      }
    },
    faqs: [
      { q: 'Which models can be used?', a: 'GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, or open-source models via Ollama / Together AI.' }
    ],
    reviews: [
      { id: 'sr-4', clientName: 'Arthur Dent', clientAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80', rating: 5, date: '1 month ago', comment: 'The RAG pipeline works flawlessly with our 2,000 PDF user manuals. Game changer for our support reps.' }
    ]
  },
  {
    id: 'srv-4',
    title: 'Cross-Platform Mobile App in React Native or Flutter',
    slug: 'cross-platform-react-native-flutter-app',
    category: 'development',
    categoryName: 'Web & App Development',
    freelancerId: 'fl-3',
    freelancerName: 'Sophia Chen',
    freelancerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    freelancerRating: 4.97,
    freelancerReviewsCount: 114,
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1000&auto=format&fit=crop&q=80',
    rating: 4.97,
    reviewsCount: 78,
    ordersInQueue: 5,
    startingPrice: 380,
    deliveryTime: '5 days',
    shortDesc: 'Launch a high-performance iOS and Android app from a single clean codebase with native responsiveness.',
    description: 'I build fluid mobile applications that feel native on both iOS and Android. Includes biometric authentication, push notifications, offline local caching, and app store deployment preparation.',
    tags: ['React Native', 'Flutter', 'iOS', 'Android', 'Mobile App', 'TypeScript'],
    packages: {
      basic: {
        name: 'Prototype Mobile Screen',
        price: 380,
        deliveryDays: 5,
        revisions: 2,
        description: '2 key screens in React Native / Flutter with navigation, clean layout, and responsive widgets.',
        features: ['2 Responsive Screens', 'Smooth Transitions', 'iOS & Android Support', 'Source Code in GitHub']
      },
      standard: {
        name: 'Feature-Complete MVP App',
        price: 850,
        deliveryDays: 10,
        revisions: 5,
        description: 'Up to 6 screens including authentication, state management, API integration, and local caching.',
        features: ['6 Screens with Full Nav Stack', 'User Authentication Flow', 'REST API Connection', 'Push Notifications Integration', 'Biometric Login (FaceID)']
      },
      premium: {
        name: 'Full App Store Ready System',
        price: 1800,
        deliveryDays: 20,
        revisions: 'Unlimited',
        description: 'Complete cross-platform app ready for publication with in-app purchases, analytics, and store assets.',
        features: ['Full Application', 'In-App Subscriptions (RevenueCat)', 'App Store & Google Play Submission', 'Deep Linking & Crashlytics', '60 Days Bug Warranty']
      }
    },
    faqs: [
      { q: 'Will you help publish to the App Store?', a: 'Yes, I handle metadata, screenshots, test builds in TestFlight and Google Play Internal Track.' }
    ],
    reviews: [
      { id: 'sr-5', clientName: 'Jordan Sparks', clientAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80', rating: 5, date: '3 weeks ago', comment: 'Our app runs at 60 FPS on both iPhone and low-end Androids. Sophia is a consummate professional.' }
    ]
  },
  {
    id: 'srv-5',
    title: 'SaaS SEO Optimization & Organic Traffic Growth Playbook',
    slug: 'saas-seo-organic-growth',
    category: 'marketing',
    categoryName: 'Growth & Marketing',
    freelancerId: 'fl-5',
    freelancerName: 'Maya Lin',
    freelancerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    freelancerRating: 4.96,
    freelancerReviewsCount: 82,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80',
    rating: 4.95,
    reviewsCount: 44,
    ordersInQueue: 2,
    startingPrice: 190,
    deliveryTime: '3 days',
    shortDesc: 'Comprehensive technical SEO audit, high-intent keyword research, and programmatic search growth plan.',
    description: 'Stop burning cash on paid ads without an organic engine. I analyze your domain architecture, crawl budget, Core Web Vitals, and backlink profile to generate a targeted roadmap that attracts high-converting customers.',
    tags: ['SEO', 'Growth', 'Content Marketing', 'Keywords', 'Analytics'],
    packages: {
      basic: {
        name: 'Technical SEO Audit',
        price: 190,
        deliveryDays: 3,
        revisions: 2,
        description: 'In-depth audit of technical issues, CWV errors, indexing blockers, and meta tags recommendations.',
        features: ['Technical Audit Report', 'Core Web Vitals Diagnosis', 'Indexing & Sitemap Fixes', 'Actionable Fix Checklist']
      },
      standard: {
        name: 'Growth Keyword Strategy',
        price: 450,
        deliveryDays: 6,
        revisions: 3,
        description: 'Keyword research uncovering 50 high-intent low-difficulty queries plus 4 pillar content briefs.',
        features: ['Audit + Competitor Gap Analysis', '50 High-Intent Keyword Matrix', '4 Content Briefs with Heading Outline', 'Internal Linking Architecture']
      },
      premium: {
        name: 'Full 90-Day Organic Roadmap',
        price: 890,
        deliveryDays: 12,
        revisions: 'Unlimited',
        description: 'Complete 3-month growth blueprint including programmatic page template specs and link building plan.',
        features: ['Comprehensive Technical Remediation', '150 Keyword Database', '12 Ready-to-Publish Content Briefs', 'Programmatic SEO Strategy Document', 'Monthly Progress Strategy Call']
      }
    },
    faqs: [
      { q: 'How long until we see SEO results?', a: 'Technical indexation fixes reflect in 2-3 weeks; keyword rank climbs typically occur within 60-90 days.' }
    ],
    reviews: [
      { id: 'sr-6', clientName: 'Felix Braun', clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', rating: 5, date: '1 month ago', comment: 'Maya pinpointed a critical canonical tag blunder that had prevented our product pages from indexing.' }
    ]
  },
  {
    id: 'srv-6',
    title: 'High-Converting Landing Page Copy & Developer Documentation',
    slug: 'landing-page-copy-developer-docs',
    category: 'writing',
    categoryName: 'Content & Copywriting',
    freelancerId: 'fl-6',
    freelancerName: 'Alex Rivers',
    freelancerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    freelancerRating: 4.94,
    freelancerReviewsCount: 71,
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000&auto=format&fit=crop&q=80',
    rating: 4.94,
    reviewsCount: 38,
    ordersInQueue: 1,
    startingPrice: 160,
    deliveryTime: '2 days',
    shortDesc: 'Crisp, persuasive copy for SaaS landing pages and clear developer documentation that developers love.',
    description: 'Your product deserves copy that explains the value proposition in 5 seconds. I write compelling hero headlines, feature benefit breakdowns, FAQs, and developer docs that eliminate friction.',
    tags: ['Copywriting', 'Content', 'Documentation', 'SaaS', 'Marketing Copy'],
    packages: {
      basic: {
        name: 'Hero Section & Value Prop',
        price: 160,
        deliveryDays: 2,
        revisions: 2,
        description: '3 high-converting headline variations, sub-copy, and CTA button text options.',
        features: ['3 Hero Section Variations', 'Sub-headline & Positioning', 'CTA Button Copy', 'Target Audience Persona Alignment']
      },
      standard: {
        name: 'Complete Homepage Copy',
        price: 360,
        deliveryDays: 4,
        revisions: 3,
        description: 'Full page copy from hero to footer: benefits, social proof framing, feature grid, and pricing tier labels.',
        features: ['Full Landing Page Copy (7 Sections)', 'Feature Benefit Matrix', 'Testimonial Framing', 'Wireframe Annotation Notes']
      },
      premium: {
        name: 'Product Copy + Developer Hub',
        price: 720,
        deliveryDays: 7,
        revisions: 5,
        description: 'Complete website copy plus 5 core developer documentation guides with code sample context.',
        features: ['Full Marketing Website Copy', '5 Technical Documentation Guides', 'Microcopy for UI App States', 'Style Guide & Voice Document']
      }
    },
    faqs: [
      { q: 'Do you write for technical products?', a: 'Yes, I write for developer tools, APIs, cloud platforms, and cybersecurity products regularly.' }
    ],
    reviews: [
      { id: 'sr-7', clientName: 'Nadia Petrov', clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', rating: 5, date: '1 month ago', comment: 'Our sign-up rate jumped immediately after deploying Alex\'s new hero copy.' }
    ]
  },
  {
    id: 'srv-7',
    title: 'AWS Cloud Architecture & Kubernetes Cluster Setup',
    slug: 'aws-cloud-kubernetes-devops-setup',
    category: 'devops',
    categoryName: 'DevOps & Security',
    freelancerId: 'fl-4',
    freelancerName: 'Dev Patel',
    freelancerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    freelancerRating: 4.93,
    freelancerReviewsCount: 67,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80',
    rating: 4.95,
    reviewsCount: 31,
    ordersInQueue: 2,
    startingPrice: 320,
    deliveryTime: '3 days',
    shortDesc: 'Resilient, automated cloud infrastructure using Terraform, Docker, and AWS ECS/EKS with monitoring.',
    description: 'Ensure 99.99% uptime with enterprise-grade cloud architecture. I configure Infrastructure as Code using Terraform, automated GitHub Actions CI/CD pipelines, and health monitoring.',
    tags: ['AWS', 'DevOps', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    packages: {
      basic: {
        name: 'Dockerize & Deploy MVP',
        price: 320,
        deliveryDays: 3,
        revisions: 2,
        description: 'Containerize your app with multi-stage Dockerfile and deploy to AWS App Runner or ECS.',
        features: ['Production Dockerfile Setup', 'AWS Account Configuration', 'SSL Certificate & Custom Domain', 'Automated GitHub Actions Deploy']
      },
      standard: {
        name: 'Terraform Cluster + CI/CD',
        price: 680,
        deliveryDays: 6,
        revisions: 4,
        description: 'Complete VPC, database RDS with automated backups, load balancer, and secure secret manager.',
        features: ['Terraform IaC Scripts', 'AWS RDS Postgres with Auto-Backups', 'ALB Load Balancer + Auto Scaling', 'Prometheus & Grafana Dashboard']
      },
      premium: {
        name: 'Multi-Region Kubernetes Suite',
        price: 1450,
        deliveryDays: 12,
        revisions: 'Unlimited',
        description: 'EKS Kubernetes cluster with ArgoCD GitOps, automated rollbacks, and SOC2 compliance safeguards.',
        features: ['Production EKS Cluster Setup', 'ArgoCD GitOps Pipeline', 'Network Security & IAM Hardening', 'Disaster Recovery Runbooks', '1 Month Monitoring Support']
      }
    },
    faqs: [
      { q: 'Will you share all code in our repository?', a: 'Yes! All Terraform and workflow scripts belong directly to your repository.' }
    ],
    reviews: [
      { id: 'sr-8', clientName: 'Gary Kaspar', clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', rating: 5, date: '2 months ago', comment: 'Zero downtime during migration. Outstanding expertise in Terraform and AWS.' }
    ]
  },
  {
    id: 'srv-8',
    title: '3D Product Animation & Motion Graphics Teaser Reel',
    slug: '3d-product-animation-motion-graphics',
    category: 'video',
    categoryName: 'Video & Motion Design',
    freelancerId: 'fl-7',
    freelancerName: 'Jordan Kim',
    freelancerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    freelancerRating: 4.99,
    freelancerReviewsCount: 54,
    coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1000&auto=format&fit=crop&q=80',
    rating: 4.99,
    reviewsCount: 29,
    ordersInQueue: 1,
    startingPrice: 390,
    deliveryTime: '4 days',
    shortDesc: 'Hypnotic 3D product motion, kinetic typography, and sound design that make tech products memorable.',
    description: 'Transform your tech release into an Apple-style announcement. I produce photorealistic 3D renders, physical camera moves, and custom sound design.',
    tags: ['3D Motion', 'Blender', 'Cinema 4D', 'Animation', 'Product Video'],
    packages: {
      basic: {
        name: '15-Sec Social Motion Reel',
        price: 390,
        deliveryDays: 4,
        revisions: 2,
        description: '15-second teaser featuring 3D product rotation, smooth typography, and sound effects.',
        features: ['15 Seconds 4K Animation', 'Custom Lighting & Materials', 'Commercial Music License', 'Vertical (9:16) & Wide (16:9)']
      },
      standard: {
        name: '30-Sec Product Launch Video',
        price: 790,
        deliveryDays: 8,
        revisions: 4,
        description: '30-second detailed product video showing feature highlights and exploded part animations.',
        features: ['30 Seconds Full Motion', 'Custom 3D Modeling / Ingestion', 'Pro Sound Mix & Sound Effects', '2 Aspect Ratios Included']
      },
      premium: {
        name: '60-Sec Cinematic Showcase',
        price: 1550,
        deliveryDays: 14,
        revisions: 'Unlimited',
        description: 'Full 60-second keynote-quality commercial with storyboard, voiceover sync, and visual effects.',
        features: ['60 Seconds 4K Cinematic Reel', 'Full Storyboard & Creative Direction', 'Professional Voiceover Inclusion', 'Complete Project Source Files']
      }
    },
    faqs: [
      { q: 'What CAD files do you accept?', a: 'STP, OBJ, FBX, or 2D vector sketches. I can also model the product from photos.' }
    ],
    reviews: [
      { id: 'sr-9', clientName: 'Lucas Vance', clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80', rating: 5, date: '1 month ago', comment: 'The video went viral on X and drove 12,000 waitlist signups in 48 hours!' }
    ]
  }
];

export const PROJECTS = [
  {
    id: 'prj-101',
    title: 'FastLance Neomorphic SaaS Platform Frontend',
    category: 'Web & App Development',
    serviceTitle: 'Fullstack React & Next.js SaaS Web Application Development',
    freelancerId: 'fl-1',
    freelancerName: 'Elena Rostova',
    freelancerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    status: 'active',
    progress: 75,
    budget: 1400,
    spent: 1050,
    startDate: '2026-08-20',
    deadline: '2026-09-12',
    deliverables: [
      'Design System Components with Neomorphic Soft UI',
      'Client Dashboard & Project Management View',
      'Interactive Chat & Messaging Module',
      'Stripe Integration & Auth Flows'
    ],
    milestones: [
      { title: 'Phase 1: Design Tokens & UI Component Library', dueDate: '2026-08-26', status: 'completed', amount: 450 },
      { title: 'Phase 2: Marketplace & Public Landing Pages', dueDate: '2026-09-02', status: 'completed', amount: 400 },
      { title: 'Phase 3: Interactive Dashboard & Messaging', dueDate: '2026-09-08', status: 'in_progress', amount: 350 },
      { title: 'Phase 4: QA Testing & Production Polish', dueDate: '2026-09-12', status: 'pending', amount: 200 }
    ]
  },
  {
    id: 'prj-102',
    title: 'Mobile App Wireframes & Figma UI Redesign',
    category: 'UI/UX & Product Design',
    serviceTitle: 'Premium Neomorphic & Soft UI Product Design in Figma',
    freelancerId: 'fl-2',
    freelancerName: 'Marcus Vance',
    freelancerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    status: 'in_progress',
    progress: 40,
    budget: 650,
    spent: 260,
    startDate: '2026-08-28',
    deadline: '2026-09-15',
    deliverables: [
      'Interactive Figma Prototype with Soft UI elements',
      'Design Tokens Specification Document',
      'Developer handoff assets'
    ],
    milestones: [
      { title: 'User Research & Wireframes', dueDate: '2026-09-01', status: 'completed', amount: 260 },
      { title: 'High-Fidelity Screens (Desktop & Mobile)', dueDate: '2026-09-09', status: 'in_progress', amount: 260 },
      { title: 'Prototype Interactions & Final Handoff', dueDate: '2026-09-15', status: 'pending', amount: 130 }
    ]
  },
  {
    id: 'prj-103',
    title: 'AI Document Summarizer Copilot Integration',
    category: 'AI & Data Science',
    serviceTitle: 'Custom AI Agent & LLM Chatbot Integration',
    freelancerId: 'fl-1',
    freelancerName: 'Elena Rostova',
    freelancerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    status: 'review',
    progress: 95,
    budget: 750,
    spent: 750,
    startDate: '2026-08-14',
    deadline: '2026-09-06',
    deliverables: [
      'LangChain RAG Pipeline connected to Pinecone',
      'PDF parser with semantic chunking',
      'API endpoint with citation sources'
    ],
    milestones: [
      { title: 'Pipeline Architecture & Chunking Setup', dueDate: '2026-08-21', status: 'completed', amount: 350 },
      { title: 'RAG Search & Citations Integration', dueDate: '2026-08-30', status: 'completed', amount: 300 },
      { title: 'Client Verification & Sign-off', dueDate: '2026-09-06', status: 'review', amount: 100 }
    ]
  },
  {
    id: 'prj-104',
    title: 'AWS Cloud Cost & Multi-Region Setup',
    category: 'DevOps & Security',
    serviceTitle: 'AWS Cloud Architecture & Kubernetes Cluster Setup',
    freelancerId: 'fl-4',
    freelancerName: 'Dev Patel',
    freelancerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    status: 'completed',
    progress: 100,
    budget: 680,
    spent: 680,
    startDate: '2026-07-10',
    deadline: '2026-07-28',
    deliverables: [
      'Terraform code for VPC and EKS',
      'Grafana alert metrics configured',
      'Cost optimization report showing 42% savings'
    ],
    milestones: [
      { title: 'Infra as Code Deployment', dueDate: '2026-07-18', status: 'completed', amount: 400 },
      { title: 'Monitoring & Alerting Setup', dueDate: '2026-07-28', status: 'completed', amount: 280 }
    ]
  },
  {
    id: 'prj-105',
    title: 'Product Hunt Launch 3D Teaser Animation',
    category: 'Video & Motion Design',
    serviceTitle: '3D Product Animation & Motion Graphics Teaser Reel',
    freelancerId: 'fl-7',
    freelancerName: 'Jordan Kim',
    freelancerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    status: 'completed',
    progress: 100,
    budget: 790,
    spent: 790,
    startDate: '2026-07-02',
    deadline: '2026-07-16',
    deliverables: [
      '30-second 4K product trailer',
      'Cutdowns for Instagram Reels & Twitter',
      'Sound design stems'
    ],
    milestones: [
      { title: 'Storyboard & 3D Clay Render', dueDate: '2026-07-08', status: 'completed', amount: 350 },
      { title: 'Final Render with Sound & Grading', dueDate: '2026-07-16', status: 'completed', amount: 440 }
    ]
  },
  {
    id: 'prj-106',
    title: 'Technical Documentation & Swagger Hub Migration',
    category: 'Content & Copywriting',
    serviceTitle: 'High-Converting Landing Page Copy & Developer Docs',
    freelancerId: 'fl-6',
    freelancerName: 'Alex Rivers',
    freelancerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    status: 'cancelled',
    progress: 15,
    budget: 360,
    spent: 50,
    startDate: '2026-06-15',
    deadline: '2026-06-25',
    deliverables: [
      'API specification review'
    ],
    milestones: [
      { title: 'Initial Outline', dueDate: '2026-06-18', status: 'cancelled', amount: 50 }
    ]
  }
];

export const CONVERSATIONS = [
  {
    id: 'conv-1',
    participant: {
      id: 'fl-1',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      title: 'Senior Fullstack Engineer',
      online: true,
      lastSeen: 'Active now'
    },
    unreadCount: 2,
    lastMessage: {
      text: 'I pushed the latest changes for the Neomorphic buttons and card components to GitHub.',
      timestamp: '10:42 AM',
      senderId: 'fl-1'
    },
    messages: [
      { id: 'm1', senderId: 'me', text: 'Hi Elena! How is the progress on the interactive dashboard going?', timestamp: '09:15 AM', isOwn: true },
      { id: 'm2', senderId: 'fl-1', text: 'Good morning! Everything is moving quickly. I have finished the stat cards and chart animations.', timestamp: '09:30 AM', isOwn: false },
      { id: 'm3', senderId: 'me', text: 'Awesome! Did the neomorphic shadow tokens work nicely with Tailwind v4?', timestamp: '09:35 AM', isOwn: true },
      { id: 'm4', senderId: 'fl-1', text: 'Yes, perfectly! The subtle dual-light shadows give it that premium tactile feel without looking overdone.', timestamp: '10:15 AM', isOwn: false },
      { id: 'm5', senderId: 'fl-1', text: 'I pushed the latest changes for the Neomorphic buttons and card components to GitHub.', timestamp: '10:42 AM', isOwn: false, attachments: [{ name: 'ui-preview-v2.png', size: '2.4 MB', type: 'image' }] }
    ]
  },
  {
    id: 'conv-2',
    participant: {
      id: 'fl-2',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      title: 'Lead UI/UX Designer',
      online: true,
      lastSeen: 'Active now'
    },
    unreadCount: 0,
    lastMessage: {
      text: 'Here is the updated Figma link with the mobile drawer navigation specs.',
      timestamp: 'Yesterday',
      senderId: 'fl-2'
    },
    messages: [
      { id: 'm6', senderId: 'fl-2', text: 'Hey there! Just wanted to share the updated Figma screens for the profile settings.', timestamp: 'Yesterday 3:10 PM', isOwn: false },
      { id: 'm7', senderId: 'me', text: 'Looking at them now. The tab transitions look very clean.', timestamp: 'Yesterday 3:45 PM', isOwn: true },
      { id: 'm8', senderId: 'fl-2', text: 'Here is the updated Figma link with the mobile drawer navigation specs.', timestamp: 'Yesterday 4:20 PM', isOwn: false }
    ]
  },
  {
    id: 'conv-3',
    participant: {
      id: 'fl-3',
      name: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      title: 'Mobile App Specialist',
      online: false,
      lastSeen: '1 hour ago'
    },
    unreadCount: 0,
    lastMessage: {
      text: 'The TestFlight build 1.4.0 is now processing. Should be ready in 15 minutes!',
      timestamp: 'Aug 30',
      senderId: 'fl-3'
    },
    messages: [
      { id: 'm9', senderId: 'fl-3', text: 'The TestFlight build 1.4.0 is now processing. Should be ready in 15 minutes!', timestamp: 'Aug 30', isOwn: false }
    ]
  },
  {
    id: 'conv-4',
    participant: {
      id: 'fl-4',
      name: 'Dev Patel',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
      title: 'DevOps Architect',
      online: false,
      lastSeen: 'Yesterday'
    },
    unreadCount: 0,
    lastMessage: {
      text: 'Milestone 2 has been delivered and all health check probes passed.',
      timestamp: 'Aug 24',
      senderId: 'fl-4'
    },
    messages: [
      { id: 'm10', senderId: 'fl-4', text: 'Milestone 2 has been delivered and all health check probes passed.', timestamp: 'Aug 24', isOwn: false }
    ]
  }
];

export const NOTIFICATIONS = [
  { id: 'n1', type: 'message', title: 'New message from Elena Rostova', message: 'I pushed the latest changes for the Neomorphic buttons...', time: '12 mins ago', read: false, link: '/dashboard/messages' },
  { id: 'n2', type: 'milestone', title: 'Milestone Approved', message: 'Phase 2 for Neomorphic SaaS Platform has been signed off.', time: '2 hours ago', read: false, link: '/dashboard/projects' },
  { id: 'n3', type: 'project', title: 'Project Under Review', message: 'Elena submitted the deliverables for AI Document Summarizer.', time: '5 hours ago', read: true, link: '/dashboard/projects' },
  { id: 'n4', type: 'payment', title: 'Invoice Receipt Available', message: 'Receipt #INV-8924 for $450.00 is ready to download.', time: 'Yesterday', read: true, link: '/dashboard' },
  { id: 'n5', type: 'system', title: 'Welcome to FastLance Pro', message: 'Your verified client perks and escrow protection are active.', time: '3 days ago', read: true, link: '/dashboard' }
];

export const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Julian Thorne',
    role: 'Co-Founder & CEO',
    company: 'HyperScale AI',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    content: 'FastLance changed how we scale our engineering squad. We matched with top 1% fullstack talent in 4 hours and had our AI copilot deployed in under two weeks.',
    rating: 5
  },
  {
    id: 't2',
    name: 'Clara Delacroix',
    role: 'VP of Product',
    company: 'Moneta Pay',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    content: 'The quality of freelancers here is on another level compared to legacy gig sites. The tactile neomorphic UI is also breathtaking to work with daily.',
    rating: 5
  },
  {
    id: 't3',
    name: 'Nathaniel Brock',
    role: 'CTO',
    company: 'Krypton Protocol',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    content: 'Zero friction escrow payments, milestone tracking, and verified senior engineers. FastLance is the future of remote high-impact knowledge work.',
    rating: 5
  }
];

export const DASHBOARD_STATS = {
  totalSpent: 4270,
  spentChangePct: '+18.4%',
  activeProjectsCount: 3,
  completedProjectsCount: 14,
  unreadMessagesCount: 2,
  hoursLogged: 342,
  monthlySpending: [
    { month: 'Mar', amount: 820 },
    { month: 'Apr', amount: 1250 },
    { month: 'May', amount: 980 },
    { month: 'Jun', amount: 1650 },
    { month: 'Jul', amount: 1470 },
    { month: 'Aug', amount: 2100 }
  ]
};
