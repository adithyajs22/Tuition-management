export const KERALA_PLUS_ONE_SYLLABUS = {
  science: [
    {
      id: 'phy',
      subject: 'Physics',
      code: 'PHY-101',
      icon: 'Atom',
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      totalChapters: 14,
      modules: [
        { id: 'phy-1', name: 'Physical World & Measurement', chapters: ['Physical World', 'Units and Measurements'], status: 'Completed', progress: 100 },
        { id: 'phy-2', name: 'Kinematics', chapters: ['Motion in a Straight Line', 'Motion in a Plane'], status: 'Completed', progress: 100 },
        { id: 'phy-3', name: 'Laws of Motion & Work Energy', chapters: ['Laws of Motion', 'Work, Energy and Power'], status: 'In Progress', progress: 75 },
        { id: 'phy-4', name: 'System of Particles & Gravitation', chapters: ['System of Particles & Rotational Motion', 'Gravitation'], status: 'In Progress', progress: 40 },
        { id: 'phy-5', name: 'Properties of Bulk Matter', chapters: ['Mechanical Properties of Solids', 'Mechanical Properties of Fluids', 'Thermal Properties of Matter'], status: 'Not Started', progress: 0 },
        { id: 'phy-6', name: 'Thermodynamics & Kinetic Theory', chapters: ['Thermodynamics', 'Kinetic Theory of Gases'], status: 'Not Started', progress: 0 },
        { id: 'phy-7', name: 'Oscillations & Waves', chapters: ['Oscillations', 'Waves'], status: 'Not Started', progress: 0 }
      ]
    },
    {
      id: 'chem',
      subject: 'Chemistry',
      code: 'CHE-101',
      icon: 'FlaskConical',
      color: 'from-cyan-500 to-blue-600',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      totalChapters: 14,
      modules: [
        { id: 'chem-1', name: 'Basic Concepts & Structure of Atom', chapters: ['Some Basic Concepts of Chemistry', 'Structure of Atom'], status: 'Completed', progress: 100 },
        { id: 'chem-2', name: 'Periodic Properties & Chemical Bonding', chapters: ['Classification of Elements', 'Chemical Bonding and Molecular Structure'], status: 'Completed', progress: 100 },
        { id: 'chem-3', name: 'States of Matter & Thermodynamics', chapters: ['States of Matter', 'Chemical Thermodynamics'], status: 'In Progress', progress: 60 },
        { id: 'chem-4', name: 'Equilibrium & Redox Reactions', chapters: ['Equilibrium', 'Redox Reactions'], status: 'In Progress', progress: 30 },
        { id: 'chem-5', name: 'Hydrogen & s-Block Elements', chapters: ['Hydrogen', 'The s-Block Elements'], status: 'Not Started', progress: 0 },
        { id: 'chem-6', name: 'p-Block Elements', chapters: ['The p-Block Elements (Group 13 & 14)'], status: 'Not Started', progress: 0 },
        { id: 'chem-7', name: 'Organic Chemistry Principles', chapters: ['Organic Chemistry - Basic Principles', 'Hydrocarbons', 'Environmental Chemistry'], status: 'Not Started', progress: 0 }
      ]
    },
    {
      id: 'math',
      subject: 'Mathematics',
      code: 'MAT-101',
      icon: 'Calculator',
      color: 'from-violet-500 to-purple-600',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      totalChapters: 16,
      modules: [
        { id: 'math-1', name: 'Sets, Relations & Functions', chapters: ['Sets', 'Relations and Functions', 'Trigonometric Functions'], status: 'Completed', progress: 100 },
        { id: 'math-2', name: 'Algebra I', chapters: ['Principle of Mathematical Induction', 'Complex Numbers and Quadratic Equations'], status: 'Completed', progress: 100 },
        { id: 'math-3', name: 'Algebra II', chapters: ['Linear Inequalities', 'Permutations and Combinations', 'Binomial Theorem'], status: 'In Progress', progress: 80 },
        { id: 'math-4', name: 'Sequences & Coordinate Geometry', chapters: ['Sequence and Series', 'Straight Lines'], status: 'In Progress', progress: 50 },
        { id: 'math-5', name: 'Conic Sections & 3D Geometry', chapters: ['Conic Sections', 'Introduction to Three Dimensional Geometry'], status: 'Not Started', progress: 0 },
        { id: 'math-6', name: 'Calculus & Mathematical Reasoning', chapters: ['Limits and Derivatives', 'Mathematical Reasoning'], status: 'Not Started', progress: 0 },
        { id: 'math-7', name: 'Statistics & Probability', chapters: ['Statistics', 'Probability'], status: 'Not Started', progress: 0 }
      ]
    },
    {
      id: 'bio',
      subject: 'Biology / Computer Science',
      code: 'BIO-101',
      icon: 'Dna',
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      totalChapters: 22,
      modules: [
        { id: 'bio-1', name: 'Diversity in Living World', chapters: ['The Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom'], status: 'Completed', progress: 100 },
        { id: 'bio-2', name: 'Structural Organisation', chapters: ['Morphology of Flowering Plants', 'Anatomy of Flowering Plants', 'Structural Organisation in Animals'], status: 'In Progress', progress: 70 },
        { id: 'bio-3', name: 'Cell Structure & Functions', chapters: ['Cell: The Unit of Life', 'Biomolecules', 'Cell Cycle and Cell Division'], status: 'In Progress', progress: 50 },
        { id: 'bio-4', name: 'Plant Physiology', chapters: ['Transport in Plants', 'Mineral Nutrition', 'Photosynthesis', 'Respiration', 'Plant Growth'], status: 'Not Started', progress: 0 },
        { id: 'bio-5', name: 'Human Physiology', chapters: ['Digestion', 'Breathing', 'Body Fluids', 'Excretory Products', 'Locomotion', 'Neural Control', 'Chemical Coordination'], status: 'Not Started', progress: 0 }
      ]
    }
  ],
  commerce: [
    {
      id: 'acc',
      subject: 'Accountancy',
      code: 'ACC-101',
      icon: 'BookOpenCheck',
      color: 'from-emerald-500 to-green-600',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      totalChapters: 13,
      modules: [
        { id: 'acc-1', name: 'Theoretical Framework', chapters: ['Introduction to Accounting', 'Theory Base of Accounting'], status: 'Completed', progress: 100 },
        { id: 'acc-2', name: 'Accounting Process I', chapters: ['Recording of Transactions - I (Journal & Ledger)', 'Recording of Transactions - II (Cash Book & Special Journals)'], status: 'Completed', progress: 100 },
        { id: 'acc-3', name: 'Accounting Process II', chapters: ['Bank Reconciliation Statement', 'Trial Balance and Rectification of Errors'], status: 'In Progress', progress: 85 },
        { id: 'acc-4', name: 'Depreciation & Provisions', chapters: ['Depreciation, Provisions and Reserves', 'Bill of Exchange'], status: 'In Progress', progress: 45 },
        { id: 'acc-5', name: 'Financial Statements I', chapters: ['Financial Statements - Sole Proprietorship'], status: 'Not Started', progress: 0 },
        { id: 'acc-6', name: 'Financial Statements II', chapters: ['Financial Statements with Adjustments', 'Accounts from Incomplete Records'], status: 'Not Started', progress: 0 },
        { id: 'acc-7', name: 'Computers in Accounting', chapters: ['Applications of Computers in Accounting'], status: 'Not Started', progress: 0 }
      ]
    },
    {
      id: 'eco',
      subject: 'Economics',
      code: 'ECO-101',
      icon: 'TrendingUp',
      color: 'from-blue-500 to-indigo-600',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      totalChapters: 19,
      modules: [
        { id: 'eco-1', name: 'Statistics for Economics Intro', chapters: ['Introduction', 'Collection of Data', 'Organisation of Data'], status: 'Completed', progress: 100 },
        { id: 'eco-2', name: 'Presentation & Central Tendency', chapters: ['Presentation of Data', 'Measures of Central Tendency (Mean, Median, Mode)'], status: 'In Progress', progress: 90 },
        { id: 'eco-3', name: 'Dispersion & Correlation', chapters: ['Measures of Dispersion', 'Correlation', 'Index Numbers'], status: 'In Progress', progress: 30 },
        { id: 'eco-4', name: 'Indian Economic Development Intro', chapters: ['Indian Economy on the Eve of Independence', 'Indian Economy 1950-1990'], status: 'Completed', progress: 100 },
        { id: 'eco-5', name: 'Economic Reforms & Challenges', chapters: ['LPG Reforms', 'Poverty', 'Human Capital Formation', 'Rural Development'], status: 'Not Started', progress: 0 }
      ]
    },
    {
      id: 'bst',
      subject: 'Business Studies',
      code: 'BST-101',
      icon: 'Briefcase',
      color: 'from-amber-500 to-yellow-600',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      totalChapters: 11,
      modules: [
        { id: 'bst-1', name: 'Foundations of Business', chapters: ['Business, Trade and Commerce', 'Forms of Business Organisations'], status: 'Completed', progress: 100 },
        { id: 'bst-2', name: 'Private, Public & Global Enterprises', chapters: ['Private, Public and Global Enterprises', 'Business Services'], status: 'Completed', progress: 100 },
        { id: 'bst-3', name: 'Emerging Modes & Ethics', chapters: ['Emerging Modes of Business', 'Social Responsibilities of Business and Business Ethics'], status: 'In Progress', progress: 60 },
        { id: 'bst-4', name: 'Finance & Trade', chapters: ['Sources of Business Finance', 'Small Business and Enterprises'], status: 'Not Started', progress: 0 },
        { id: 'bst-5', name: 'Trade & International Business', chapters: ['Internal Trade', 'International Business'], status: 'Not Started', progress: 0 }
      ]
    }
  ]
};
