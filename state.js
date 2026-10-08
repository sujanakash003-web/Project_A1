// ============================================================================
// State Management & Real-Time Sync Engine
// Project A1 - Co-Founder Development Operating System
// Supports LocalStorage persistence, multi-tab BroadcastChannel sync,
// and 1-Click Computer File Backup & Restore.
// ============================================================================

const BROADCAST_CHANNEL_NAME = 'project_a1_sync_bus';
const LOCAL_STORAGE_KEY = 'project_a1_master_state_v1';
const SESSION_USER_KEY = 'project_a1_tab_user_v1';

// Initial Starter State
const DEFAULT_INITIAL_STATE = {
  auth: {
    milan: {
      name: "Milan Jadhav",
      role: "Co-Founder",
      code: "BusinessSlut@2167",
      avatar: "MJ",
      color: "#059669"
    },
    sujan: {
      name: "Sujan Akash",
      role: "Co-Founder",
      code: "PatnerInSlut@1557",
      avatar: "SA",
      color: "#2563eb"
    },
    currentUser: null // 'milan' | 'sujan' | null
  },
  presence: {
    milan: { isOnline: false, lastActive: null, currentView: 'welcome' },
    sujan: { isOnline: false, lastActive: null, currentView: 'welcome' }
  },
  todos: [
    {
      id: "td-1",
      text: "Finalize supplier quotes for initial batch packaging",
      assignedTo: "milan",
      priority: "high",
      completed: false,
      dueDate: "2026-10-02",
      category: "Operations",
      createdAt: new Date().toISOString()
    },
    {
      id: "td-2",
      text: "Review FSSAI / Trade license compliance documentation",
      assignedTo: "sujan",
      priority: "high",
      completed: false,
      dueDate: "2026-10-05",
      category: "Legal",
      createdAt: new Date().toISOString()
    },
    {
      id: "td-3",
      text: "Complete Q4 Seed Run Budget & Burn Rate evaluation",
      assignedTo: "team",
      priority: "high",
      completed: false,
      dueDate: "2026-09-30",
      category: "Finance",
      createdAt: new Date().toISOString()
    },
    {
      id: "td-4",
      text: "Draft brand narrative & product launch hook video scripts",
      assignedTo: "milan",
      priority: "medium",
      completed: true,
      dueDate: "2026-09-22",
      category: "Marketing",
      createdAt: new Date().toISOString()
    },
    {
      id: "td-5",
      text: "Test sample prototype batch #03 stress testing report",
      assignedTo: "sujan",
      priority: "medium",
      completed: false,
      dueDate: "2026-10-08",
      category: "Operations",
      createdAt: new Date().toISOString()
    },
    {
      id: "td-6",
      text: "Setup business banking current account & merchant gateway",
      assignedTo: "team",
      priority: "high",
      completed: false,
      dueDate: "2026-10-12",
      category: "Finance",
      createdAt: new Date().toISOString()
    }
  ],
  roadmap: [
    {
      id: "rm-1",
      stageNumber: 1,
      stageName: "Idea Validation & Co-Founder Agreement",
      description: "Define equity, strategic roadmap, legal baseline, and primary thesis",
      targetDate: "2026-08-30",
      completedDate: "2026-08-28",
      status: "Completed",
      progress: 100
    },
    {
      id: "rm-2",
      stageNumber: 2,
      stageName: "R&D Prototype Development & Lab Testing",
      description: "Develop initial formulation/product prototypes, lab validation, and stress audits",
      targetDate: "2026-10-15",
      completedDate: null,
      status: "In Progress",
      progress: 68
    },
    {
      id: "rm-3",
      stageNumber: 3,
      stageName: "Regulatory Compliance & Certifications",
      description: "Obtain trade licenses, testing certificates, and brand trademark filings",
      targetDate: "2026-11-10",
      completedDate: null,
      status: "Upcoming",
      progress: 25
    },
    {
      id: "rm-4",
      stageNumber: 4,
      stageName: "Pilot Batch Production & SKU Setup",
      description: "Finalize vendor tooling, pricing matrices, packaging, and warehouse logistics",
      targetDate: "2026-12-05",
      completedDate: null,
      status: "Upcoming",
      progress: 0
    },
    {
      id: "rm-5",
      stageNumber: 5,
      stageName: "Beta Market Launch & Customer Acquisition",
      description: "Omni-channel marketing launch, early adopter cohort, feedback iteration",
      targetDate: "2027-01-15",
      completedDate: null,
      status: "Upcoming",
      progress: 0
    }
  ],
  finance: {
    capital: {
      milan: 150000,
      sujan: 150000
    },
    inflows: [
      { id: "inf-1", source: "Founder Initial Capital Infusion - Milan", amount: 150000, date: "2026-08-15", paidBy: "milan", notes: "Seed capital account" },
      { id: "inf-2", source: "Founder Initial Capital Infusion - Sujan", amount: 150000, date: "2026-08-15", paidBy: "sujan", notes: "Seed capital account" }
    ],
    expenses: [
      {
        id: "exp-1",
        title: "Trademark & Legal Entity Registration Fees",
        amount: 18500,
        category: "Legal & Compliance",
        paidBy: "milan",
        date: "2026-08-20",
        paymentMethod: "UPI / Net Banking",
        notes: "Paid to RoC & IP India portal",
        receiptImage: null,
        createdAt: "2026-08-20T10:30:00Z"
      },
      {
        id: "exp-2",
        title: "Raw Material Prototype Samples Batch #1",
        amount: 24600,
        category: "R&D & Samples",
        paidBy: "sujan",
        date: "2026-08-26",
        paymentMethod: "Corporate Card",
        notes: "Ingredients and chemical assay testing batch",
        receiptImage: null,
        createdAt: "2026-08-26T14:15:00Z"
      },
      {
        id: "exp-3",
        title: "Industrial Design & 3D Packaging Mockups",
        amount: 14000,
        category: "Product Design",
        paidBy: "milan",
        date: "2026-09-02",
        paymentMethod: "UPI",
        notes: "Freelance 3D visualizer CAD files",
        receiptImage: null,
        createdAt: "2026-09-02T16:45:00Z"
      },
      {
        id: "exp-4",
        title: "Laboratory Analytical Certificate of Analysis (CoA)",
        amount: 16500,
        category: "Testing & Certification",
        paidBy: "sujan",
        date: "2026-09-10",
        paymentMethod: "Bank Transfer",
        notes: "NABL Accredited testing facility invoice",
        receiptImage: null,
        createdAt: "2026-09-10T11:20:00Z"
      },
      {
        id: "exp-5",
        title: "Domain, Google Workspace & Cloud Infrastructure",
        amount: 5800,
        category: "Software & IT",
        paidBy: "milan",
        date: "2026-09-15",
        paymentMethod: "Credit Card",
        notes: "Annual hosting, domain and professional email suites",
        receiptImage: null,
        createdAt: "2026-09-15T09:00:00Z"
      }
    ]
  },
  marketing: {
    folders: ["Brand & Packaging", "Viral & Social Ads", "Influencer Strategy", "Offline & Retail Popups", "E-Commerce Launch"],
    ideas: [
      {
        id: "mkt-1",
        title: "Unboxing Experience with Founders' Handwritten Wax-Sealed Note",
        folder: "Brand & Packaging",
        description: "Include a distinct numbered authentic message from Milan and Sujan sharing our founding story.",
        status: "implementation",
        stages: [
          { name: "Concept Draft & Copywriting", completed: true },
          { name: "Paper Texture & Wax Stamp Sourcing", completed: true },
          { name: "Sample Print Run & Quality Check", completed: false },
          { name: "Production Rollout for Batch 1", completed: false }
        ],
        currentStageIndex: 2,
        createdAt: "2026-09-01T12:00:00Z"
      },
      {
        id: "mkt-2",
        title: "Behind-The-Scenes Startup Building Vlog Series",
        folder: "Viral & Social Ads",
        description: "Raw 45-second Reels documenting prototype failures, supplier arguments, and breakthrough moments.",
        status: "implementation",
        stages: [
          { name: "Content Pillar Strategy", completed: true },
          { name: "Film Raw Footage at Lab / Factory", completed: false },
          { name: "Micro-Editing & Sound Design", completed: false },
          { name: "Weekly Release Calendar", completed: false }
        ],
        currentStageIndex: 1,
        createdAt: "2026-09-05T15:30:00Z"
      },
      {
        id: "mkt-3",
        title: "3D Augmented Reality QR Code on Outer Box",
        folder: "Brand & Packaging",
        description: "Scanning QR launches webAR visual model revealing inner formulation benefits in 3D.",
        status: "doubtful",
        stages: [],
        currentStageIndex: 0,
        createdAt: "2026-09-12T10:00:00Z"
      },
      {
        id: "mkt-4",
        title: "Top 50 Niche Micro-Creators Gifting Campaign",
        folder: "Influencer Strategy",
        description: "Identify 50 high-engagement micro-influencers (<25k followers) for zero-commission raw review seeding.",
        status: "dump",
        stages: [],
        currentStageIndex: 0,
        createdAt: "2026-09-18T18:20:00Z"
      },
      {
        id: "mkt-5",
        title: "Billboard campaign in prime commercial tech parks",
        folder: "Offline & Retail Popups",
        description: "Way too expensive for pre-revenue stage, high CAC risk.",
        status: "bin",
        stages: [],
        currentStageIndex: 0,
        createdAt: "2026-09-10T14:00:00Z"
      }
    ],
    otherIdeas: [
      {
        id: "oth-1",
        title: "Founders' Podcast Guest Appearances",
        notes: "Pitch Milan & Sujan's origin story on Tier 2 Indian startup podcasts once prototype is ready.",
        tags: ["PR", "Founders Brand"],
        date: "2026-09-19"
      },
      {
        id: "oth-2",
        title: "College Campus Ambassador Program",
        notes: "Offer verified certification and early product access to select student brand reps.",
        tags: ["Community", "Low CAC"],
        date: "2026-09-21"
      }
    ],
    chatMessages: [
      {
        id: "chat-1",
        sender: "milan",
        text: "Hey Sujan, check out the new 3D box finish. It looks ultra-premium!",
        timestamp: "2026-09-23T14:20:00Z",
        emoji: "🔥"
      },
      {
        id: "chat-2",
        sender: "sujan",
        text: "Agreed! Lab assay report comes out tomorrow. If it clears, we can lock SKU-001 pricing.",
        timestamp: "2026-09-23T14:24:00Z",
        emoji: "🚀"
      }
    ],
    drawingSnapshot: null
  },
  operations: {
    skus: [
      {
        id: "sku-1",
        code: "SKU-A1-001",
        name: "Prime Performance Elixir - 500ml",
        category: "Beverage / Nutrition",
        description: "Electrolyte infused botanical adaptogen formula with zero added sugar.",
        specs: "Glass bottle 500ml, Amber UV tint, Aluminium screw cap, 12 month shelf life.",
        unit: "Bottle",
        status: "Prototype Final",
        cogs: 68.50,
        devCost: 14.20,
        packagingCost: 22.00,
        freightCost: 12.00,
        marginPercent: 65,
        taxPercent: 18,
        retailPrice: 349.00,
        wholesalePrice: 199.00
      },
      {
        id: "sku-2",
        code: "SKU-A1-002",
        name: "Pocket Energy Sachet Pack (10ct)",
        category: "Quick Consumption",
        description: "Rapid dissolve powder concentrate for on-the-go mental clarity.",
        specs: "Multi-layer foil barrier sachet, 10 units in retail dispenser box.",
        unit: "Box",
        status: "R&D Testing",
        cogs: 42.00,
        devCost: 8.50,
        packagingCost: 15.00,
        freightCost: 7.50,
        marginPercent: 70,
        taxPercent: 18,
        retailPrice: 249.00,
        wholesalePrice: 139.00
      }
    ]
  },
  legal: {
    documents: [
      {
        id: "leg-1",
        title: "Private Limited Company Incorporation & RoC SPICe+",
        type: "License",
        authority: "Ministry of Corporate Affairs (MCA), India",
        filingDate: "2026-08-18",
        expiryDate: "Permanent (Subject to Annual Filing)",
        currentStage: 5,
        stages: ["Name Reservation", "SPICe+ Part B Filing", "PAN/TAN Issuance", "Bank Verification", "Certificate of Incorporation Issued"],
        status: "Active",
        notes: "CIN received. Articles of Association and MoA executed."
      },
      {
        id: "leg-2",
        title: "Brand Name & Wordmark Trademark Registration (Class 32 & 5)",
        type: "License",
        authority: "Controller General of Patents, Designs and Trade Marks",
        filingDate: "2026-08-25",
        expiryDate: "10 Years From Registration",
        currentStage: 3,
        stages: ["Search & Cleared", "Form TM-A Filed", "Examination Report / Formalities Check", "Journal Publication", "Registration Certificate"],
        status: "Review",
        notes: "Trademark application number issued. Under formalities check pass."
      },
      {
        id: "leg-3",
        title: "FSSAI Central Food / Supplement Operating License",
        type: "License",
        authority: "Food Safety and Standards Authority of India (FSSAI)",
        filingDate: "2026-09-08",
        expiryDate: "2027-09-07",
        currentStage: 3,
        stages: ["FoSCoS Application", "Document & Flowchart Verification", "Site Inspection / Auditor Review", "Queries Addressed", "License Grant"],
        status: "Pending",
        notes: "Site layout and kitchen/lab hygiene certificate submitted."
      },
      {
        id: "leg-4",
        title: "Toxicology, Heavy Metal & Microbial NABL Lab Testing Report",
        type: "Testing",
        authority: "NABL Accredited Analytical Laboratories",
        filingDate: "2026-09-12",
        expiryDate: "Batch Validated",
        currentStage: 4,
        stages: ["Sample Collection", "Microbiological Culture (7-day)", "Heavy Metal Spectrometry", "Draft Report Review", "Signed Final Certificate"],
        status: "Review",
        notes: "Microbial counts well within limits. Awaiting final signed COA."
      },
      {
        id: "leg-5",
        title: "Co-Founders' Operating & Reverse Vesting Agreement",
        type: "Agreement",
        authority: "Corporate Legal Counsel",
        filingDate: "2026-08-16",
        expiryDate: "Indefinite",
        currentStage: 5,
        stages: ["Term Sheet", "Equity & Vesting Draft", "Founder IP Assignment", "Notarization & Stamp Duty", "Executed & Archived"],
        status: "Active",
        notes: "Signed by Milan Jadhav and Sujan Akash with 4-year vesting schedule and 1-year cliff."
      }
    ]
  }
};

class StateManager {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
    this.broadcastChannel = null;
    this.heartbeatTimer = null;
    this.serverSyncTimer = null;
    this.lastServerSyncHash = null;

    this.initBroadcastChannel();
    this.startPresenceHeartbeat();
    this.initServerSync();
  }

  loadState() {
    let mySessionUser = null;
    try {
      mySessionUser = sessionStorage.getItem(SESSION_USER_KEY);
      if (mySessionUser !== 'milan' && mySessionUser !== 'sujan') {
        mySessionUser = null;
      }
    } catch (e) {}

    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = {
          ...DEFAULT_INITIAL_STATE,
          ...parsed,
          auth: {
            ...DEFAULT_INITIAL_STATE.auth,
            ...(parsed.auth || {}),
            milan: {
              ...DEFAULT_INITIAL_STATE.auth.milan,
              ...((parsed.auth && parsed.auth.milan) || {})
            },
            sujan: {
              ...DEFAULT_INITIAL_STATE.auth.sujan,
              ...((parsed.auth && parsed.auth.sujan) || {})
            },
            currentUser: mySessionUser || null
          },
          presence: {
            ...DEFAULT_INITIAL_STATE.presence,
            ...(parsed.presence || {})
          },
          finance: {
            ...DEFAULT_INITIAL_STATE.finance,
            ...(parsed.finance || {}),
            inflows: Array.isArray(parsed.finance?.inflows) ? parsed.finance.inflows : DEFAULT_INITIAL_STATE.finance.inflows,
            expenses: Array.isArray(parsed.finance?.expenses) ? parsed.finance.expenses : DEFAULT_INITIAL_STATE.finance.expenses
          },
          marketing: {
            ...DEFAULT_INITIAL_STATE.marketing,
            ...(parsed.marketing || {}),
            folders: Array.isArray(parsed.marketing?.folders) ? parsed.marketing.folders : DEFAULT_INITIAL_STATE.marketing.folders,
            ideas: Array.isArray(parsed.marketing?.ideas) ? parsed.marketing.ideas : DEFAULT_INITIAL_STATE.marketing.ideas,
            otherIdeas: Array.isArray(parsed.marketing?.otherIdeas) ? parsed.marketing.otherIdeas : DEFAULT_INITIAL_STATE.marketing.otherIdeas,
            chatMessages: Array.isArray(parsed.marketing?.chatMessages) ? parsed.marketing.chatMessages : DEFAULT_INITIAL_STATE.marketing.chatMessages
          },
          operations: {
            ...DEFAULT_INITIAL_STATE.operations,
            ...(parsed.operations || {}),
            skus: Array.isArray(parsed.operations?.skus) ? parsed.operations.skus : DEFAULT_INITIAL_STATE.operations.skus
          },
          legal: {
            ...DEFAULT_INITIAL_STATE.legal,
            ...(parsed.legal || {}),
            documents: Array.isArray(parsed.legal?.documents) ? parsed.legal.documents : DEFAULT_INITIAL_STATE.legal.documents
          },
          todos: Array.isArray(parsed.todos) ? parsed.todos : DEFAULT_INITIAL_STATE.todos,
          roadmap: Array.isArray(parsed.roadmap) ? parsed.roadmap : DEFAULT_INITIAL_STATE.roadmap
        };

        if (!merged.auth.milan.code) merged.auth.milan.code = "BusinessSlut@2167";
        if (!merged.auth.sujan.code) merged.auth.sujan.code = "PatnerInSlut@1557";

        return merged;
      }
    } catch (e) {
      console.error("Failed to parse state from localStorage:", e);
    }
    const fallback = JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
    fallback.auth.currentUser = mySessionUser || null;
    return fallback;
  }

  initServerSync() {
    if (window.location.protocol.startsWith('http')) {
      // Initial fetch from server
      this.fetchStateFromServer();

      // Periodic sync poll every 3.5 seconds
      this.serverSyncTimer = setInterval(() => {
        this.fetchStateFromServer();
      }, 3500);
    }
  }

  async fetchStateFromServer() {
    try {
      const resp = await fetch('/api/state');
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.auth && data.todos) {
          const serialized = JSON.stringify(data);
          if (serialized !== this.lastServerSyncHash) {
            this.lastServerSyncHash = serialized;
            // Retain active local user session
            const localUser = this.getCurrentUser();
            this.state = data;
            if (localUser) this.state.auth.currentUser = localUser;
            const toSave = JSON.parse(JSON.stringify(this.state));
            toSave.auth.currentUser = null;
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toSave));
            this.notifyListeners();
          }
        }
      }
    } catch (e) {
      // Offline or file:// protocol, silent fallback to localStorage
    }
  }

  async pushStateToServer() {
    if (window.location.protocol.startsWith('http')) {
      try {
        const payload = JSON.parse(JSON.stringify(this.state));
        payload.auth.currentUser = null; // Do not overwrite remote devices' active local login session
        await fetch('/api/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        // Silent fallback
      }
    }
  }

  saveState(notify = true) {
    try {
      const toSave = JSON.parse(JSON.stringify(this.state));
      toSave.auth.currentUser = null; // NEVER save currentUser into shared localStorage!
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toSave));
      this.pushStateToServer();
      if (notify) {
        this.notifyListeners();
        this.broadcastChange({ type: 'STATE_UPDATED', timestamp: Date.now() });
      }
    } catch (e) {
      console.error("Failed to save state to localStorage:", e);
    }
  }

  initBroadcastChannel() {
    try {
      if ('BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.broadcastChannel.onmessage = (event) => {
          this.handleBroadcastMessage(event.data);
        };
      }
    } catch (e) {
      console.warn("BroadcastChannel not supported, falling back to storage listener", e);
    }

    // Fallback cross-tab storage listener
    window.addEventListener('storage', (e) => {
      if (e.key === LOCAL_STORAGE_KEY) {
        this.state = this.loadState();
        this.notifyListeners();
      }
    });
  }

  broadcastChange(message) {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(message);
      } catch (e) {
        console.error("Broadcast post failed:", e);
      }
    }
  }

  handleBroadcastMessage(msg) {
    if (!msg) return;
    if (msg.type === 'STATE_UPDATED') {
      this.state = this.loadState();
      this.notifyListeners();
    } else if (msg.type === 'PRESENCE_PULSE') {
      if (msg.user && this.state.presence[msg.user]) {
        this.state.presence[msg.user].isOnline = true;
        this.state.presence[msg.user].lastActive = Date.now();
        this.state.presence[msg.user].currentView = msg.view || 'dashboard';
        this.notifyListeners();
      }
    } else if (msg.type === 'EMOJI_BURST') {
      if (window.onRemoteEmojiBurst) {
        window.onRemoteEmojiBurst(msg);
      }
    }
  }

  startPresenceHeartbeat() {
    // Send heartbeat every 4 seconds if user is logged in
    this.heartbeatTimer = setInterval(() => {
      const user = this.getCurrentUser();
      if (user) {
        this.state.presence[user].isOnline = true;
        this.state.presence[user].lastActive = Date.now();
        this.broadcastChange({
          type: 'PRESENCE_PULSE',
          user: user,
          view: window.currentActiveView || 'dashboard',
          timestamp: Date.now()
        });
      }

      // Check timeout on other partner (if inactive for > 12 seconds, mark offline)
      const now = Date.now();
      ['milan', 'sujan'].forEach(u => {
        if (u !== user) {
          const p = this.state.presence[u];
          if (p && p.lastActive && (now - p.lastActive > 12000)) {
            p.isOnline = false;
          }
        }
      });
      this.notifyListeners();
    }, 4000);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(fn => {
      try {
        fn(this.state);
      } catch (err) {
        console.error("Error in state subscriber:", err);
      }
    });
  }

  // --- Auth & User State ---
  getCurrentUser() {
    try {
      const sess = sessionStorage.getItem(SESSION_USER_KEY);
      if (sess === 'milan' || sess === 'sujan') return sess;
    } catch (e) {}
    return (this.state && this.state.auth && this.state.auth.currentUser) || null;
  }

  getCurrentUserData() {
    const userKey = this.getCurrentUser();
    return userKey ? this.state.auth[userKey] : null;
  }

  getOtherUser() {
    const current = this.getCurrentUser();
    if (current === 'milan') return 'sujan';
    if (current === 'sujan') return 'milan';
    return null;
  }

  getOtherUserData() {
    const otherKey = this.getOtherUser();
    return otherKey ? this.state.auth[otherKey] : null;
  }

  login(userKey) {
    if (userKey === 'milan' || userKey === 'sujan') {
      try {
        sessionStorage.setItem(SESSION_USER_KEY, userKey);
      } catch (e) {}
      this.state.auth.currentUser = userKey;
      this.state.presence[userKey].isOnline = true;
      this.state.presence[userKey].lastActive = Date.now();
      this.saveState();
      return true;
    }
    return false;
  }

  logout() {
    const curr = this.getCurrentUser();
    if (curr && this.state.presence[curr]) {
      this.state.presence[curr].isOnline = false;
    }
    try {
      sessionStorage.removeItem(SESSION_USER_KEY);
    } catch (e) {}
    this.state.auth.currentUser = null;
    this.saveState();
  }

  updatePassword(userKey, newCode) {
    const curr = this.getCurrentUser();
    if (!curr || curr !== userKey) {
      console.warn("Unauthorized attempt to modify another co-founder's credentials.");
      return { 
        success: false, 
        error: "Unauthorized: You can only change your own login passcode. To change your partner's code, log in as them." 
      };
    }
    if (this.state.auth[userKey]) {
      this.state.auth[userKey].code = newCode;
      this.saveState();
      return { success: true };
    }
    return { success: false, error: "Invalid user specified." };
  }

  // --- Todos ---
  addTodo(todo) {
    const newTodo = {
      id: "td-" + Date.now(),
      completed: false,
      createdAt: new Date().toISOString(),
      ...todo
    };
    this.state.todos.unshift(newTodo);
    this.saveState();
    return newTodo;
  }

  toggleTodo(id) {
    const t = this.state.todos.find(item => item.id === id);
    if (t) {
      t.completed = !t.completed;
      this.saveState();
    }
  }

  deleteTodo(id) {
    this.state.todos = this.state.todos.filter(t => t.id !== id);
    this.saveState();
  }

  // --- Roadmap ---
  updateRoadmapStage(id, updates) {
    const stage = this.state.roadmap.find(s => s.id === id);
    if (stage) {
      Object.assign(stage, updates);
      this.saveState();
    }
  }

  addRoadmapStage(stage) {
    const newStage = {
      id: "rm-" + Date.now(),
      stageNumber: this.state.roadmap.length + 1,
      progress: 0,
      status: "Upcoming",
      ...stage
    };
    this.state.roadmap.push(newStage);
    this.saveState();
  }

  // --- Finance ---
  addExpense(expense) {
    const newExp = {
      id: "exp-" + Date.now(),
      createdAt: new Date().toISOString(),
      ...expense
    };
    this.state.finance.expenses.unshift(newExp);
    this.saveState();
    return newExp;
  }

  deleteExpense(id) {
    this.state.finance.expenses = this.state.finance.expenses.filter(e => e.id !== id);
    this.saveState();
  }

  addInflow(inflow) {
    const newInf = {
      id: "inf-" + Date.now(),
      ...inflow
    };
    this.state.finance.inflows.unshift(newInf);
    this.saveState();
  }

  // --- Marketing ---
  addMarketingFolder(name) {
    if (name && !this.state.marketing.folders.includes(name)) {
      this.state.marketing.folders.push(name);
      this.saveState();
    }
  }

  deleteMarketingFolder(name) {
    if (!name) return;
    this.state.marketing.folders = this.state.marketing.folders.filter(f => f !== name);
    if (this.state.marketing.folders.length === 0) {
      this.state.marketing.folders.push("General");
    }
    const fallback = this.state.marketing.folders[0] || "General";
    this.state.marketing.ideas.forEach(idea => {
      if (idea.folder === name) {
        idea.folder = fallback;
      }
    });
    this.saveState();
  }

  addMarketingIdea(idea) {
    const newIdea = {
      id: "mkt-" + Date.now(),
      status: "dump",
      stages: [
        { name: "Initial Research & Feasibility", completed: false },
        { name: "Design & Copy Prototype", completed: false },
        { name: "Budget & Partner Review", completed: false },
        { name: "Execution & Tracking", completed: false }
      ],
      currentStageIndex: 0,
      createdAt: new Date().toISOString(),
      ...idea
    };
    this.state.marketing.ideas.unshift(newIdea);
    this.saveState();
    return newIdea;
  }

  moveMarketingIdea(id, targetStatus) {
    const idea = this.state.marketing.ideas.find(i => i.id === id);
    if (idea) {
      idea.status = targetStatus;
      idea.lastUpdated = new Date().toISOString();
      this.saveState();
    }
  }

  updateMarketingIdea(id, updates) {
    const idea = this.state.marketing.ideas.find(i => i.id === id);
    if (idea) {
      Object.assign(idea, updates);
      this.saveState();
    }
  }

  deleteMarketingIdea(id) {
    this.state.marketing.ideas = this.state.marketing.ideas.filter(i => i.id !== id);
    this.saveState();
  }

  addChatMessage(text, emoji = null) {
    const user = this.getCurrentUser() || 'milan';
    const msg = {
      id: "chat-" + Date.now(),
      sender: user,
      text: text,
      emoji: emoji,
      timestamp: new Date().toISOString()
    };
    this.state.marketing.chatMessages.push(msg);
    this.saveState();
    return msg;
  }

  saveDrawing(dataUrl) {
    this.state.marketing.drawingSnapshot = dataUrl;
    this.saveState(false); // don't spam listeners on every stroke
  }

  addOtherIdea(item) {
    const newOther = {
      id: "oth-" + Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...item
    };
    this.state.marketing.otherIdeas.unshift(newOther);
    this.saveState();
  }

  deleteOtherIdea(id) {
    this.state.marketing.otherIdeas = this.state.marketing.otherIdeas.filter(o => o.id !== id);
    this.saveState();
  }

  moveOtherIdeaToImplementation(otherId) {
    const item = this.state.marketing.otherIdeas.find(o => o.id === otherId);
    if (!item) return null;

    const folder = (item.tags && item.tags[0]) || (this.state.marketing.folders[0] || "General");
    if (!this.state.marketing.folders.includes(folder)) {
      this.state.marketing.folders.push(folder);
    }

    const newIdea = {
      id: "mkt-" + Date.now(),
      title: item.title,
      folder: folder,
      description: item.notes || "Promoted from Other Ideas reference.",
      status: "implementation",
      stages: [
        { name: "Initial Research & Feasibility", completed: true },
        { name: "Creative Strategy & Copy Prototype", completed: false },
        { name: "Co-Founder Review & Budget Approval", completed: false },
        { name: "Execution, Deployment & Tracking", completed: false }
      ],
      currentStageIndex: 1,
      createdAt: new Date().toISOString()
    };

    this.state.marketing.ideas.unshift(newIdea);
    this.state.marketing.otherIdeas = this.state.marketing.otherIdeas.filter(o => o.id !== otherId);
    this.saveState();
    return newIdea;
  }

  // --- Operations (SKUs & Pricing) ---
  addSku(sku) {
    const newSku = {
      id: "sku-" + Date.now(),
      ...sku
    };
    this.state.operations.skus.unshift(newSku);
    this.saveState();
    return newSku;
  }

  updateSku(id, updates) {
    const sku = this.state.operations.skus.find(s => s.id === id);
    if (sku) {
      Object.assign(sku, updates);
      this.saveState();
    }
  }

  deleteSku(id) {
    this.state.operations.skus = this.state.operations.skus.filter(s => s.id !== id);
    this.saveState();
  }

  // --- Legal ---
  addLegalDocument(doc) {
    const newDoc = {
      id: "leg-" + Date.now(),
      currentStage: 1,
      stages: doc.stages || ["Draft Preparation", "Initial Filing", "Departmental Verification", "Compliance Clearance", "Issued"],
      status: "Pending",
      ...doc
    };
    this.state.legal.documents.unshift(newDoc);
    this.saveState();
    return newDoc;
  }

  updateLegalStage(id, stageIndex) {
    const doc = this.state.legal.documents.find(d => d.id === id);
    if (doc) {
      doc.currentStage = stageIndex;
      if (stageIndex >= doc.stages.length) {
        doc.status = "Active";
      }
      this.saveState();
    }
  }

  deleteLegalDocument(id) {
    this.state.legal.documents = this.state.legal.documents.filter(d => d.id !== id);
    this.saveState();
  }

  // --- 1-Click Computer File Backup & Restore ---
  exportBackup() {
    try {
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `Project_A1_Backup_${timestamp}.json`;
      const jsonString = JSON.stringify(this.state, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true, filename: filename };
    } catch (e) {
      console.error("Backup export failed:", e);
      return { success: false, error: e.message };
    }
  }

  importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !parsed.auth || !parsed.todos || !parsed.finance) {
        throw new Error("Invalid backup format. Missing core business schemas.");
      }
      this.state = parsed;
      this.saveState();
      return { success: true };
    } catch (e) {
      console.error("Backup restore failed:", e);
      return { success: false, error: e.message };
    }
  }

  resetToDefault() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
    this.saveState();
  }
}

// Global Singleton
window.State = new StateManager();
