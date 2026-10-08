// ============================================================================
// Main Dashboard Controller
// 3-Tier To-Do Lists, Master Roadmap Stage & Pace Evaluator, Division Grid
// ============================================================================

class DashboardController {
  static init() {
    this.render();
    this.bindEvents();
  }

  static render() {
    const container = document.getElementById('dashboard-view');
    if (!container) return;

    const state = window.State.state;
    const currentUserKey = window.State.getCurrentUser() || 'milan';
    const currentUser = state.auth[currentUserKey];
    const otherUserKey = window.State.getOtherUser() || 'sujan';
    const otherUser = state.auth[otherUserKey];

    // Get non-repeating quote
    const quote = window.QuoteManager.getCurrentOrNext();

    // Calculate current active roadmap stage and pace
    const roadmapList = Array.isArray(state.roadmap) ? state.roadmap : [];
    const todoList = Array.isArray(state.todos) ? state.todos : [];
    const activeRoadmapStage = this.calculateRoadmapPace(roadmapList);

    // Group To-Dos into 3 Tiers
    const myTodos = todoList.filter(t => t.assignedTo === currentUserKey);
    const teamTodos = todoList.filter(t => t.assignedTo === 'team');
    const partnerTodos = todoList.filter(t => t.assignedTo === otherUserKey);

    container.innerHTML = `
      <!-- Top Welcome Banner & Motivational Quote (Never Repeated) -->
      <div class="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 md:p-8 shadow-md mb-8">

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-0.5 rounded text-[11px] font-medium tracking-wider uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                Founder Workspace Active
              </span>
              <div class="flex items-center gap-2 text-xs text-zinc-400">
                <i class="fa-solid fa-clock"></i>
                <span id="live-clock-banner"></span>
              </div>
            </div>
            <h1 class="text-2xl md:text-3xl font-bold text-zinc-100 tracking-tight">
              Welcome back, <span class="text-white">${currentUser.name}</span>!
            </h1>
            <p class="text-sm text-zinc-400 max-w-2xl">
              Project A1 Development Control Center. You are co-piloting with <strong class="text-zinc-200">${otherUser.name}</strong>.
            </p>
          </div>

          <!-- Real-Time Co-Founders Presence Hub -->
          <div class="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2.5 min-w-[280px]">
            <div class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>Real-Time Presence</span>
              <span class="flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <div class="flex items-center justify-between gap-3 p-2 rounded-lg bg-zinc-900 border border-zinc-800/80">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow" style="background-color: ${currentUser.color}">
                  ${currentUser.avatar}
                </div>
                <div>
                  <div class="text-xs font-semibold text-zinc-200">${currentUser.name} (You)</div>
                  <div class="text-[10px] text-zinc-400 flex items-center gap-1 font-medium">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active Session
                  </div>
                </div>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">ONLINE</span>
            </div>

            <div class="flex items-center justify-between gap-3 p-2 rounded-lg bg-zinc-900 border border-zinc-800/80">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow" style="background-color: ${otherUser.color}">
                  ${otherUser.avatar}
                </div>
                <div>
                  <div class="text-xs font-semibold text-zinc-200">${otherUser.name}</div>
                  <div class="text-[10px] ${state.presence[otherUserKey]?.isOnline ? 'text-zinc-300' : 'text-zinc-500'} flex items-center gap-1 font-medium">
                    <span class="w-1.5 h-1.5 rounded-full ${state.presence[otherUserKey]?.isOnline ? 'bg-emerald-400' : 'bg-zinc-600'}"></span>
                    ${state.presence[otherUserKey]?.isOnline ? 'Collaborating Live' : 'Last seen recently'}
                  </div>
                </div>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded ${state.presence[otherUserKey]?.isOnline ? 'bg-zinc-800 text-zinc-300 font-mono' : 'bg-zinc-900 text-zinc-500 font-mono'}">
                ${state.presence[otherUserKey]?.isOnline ? 'ONLINE' : 'AWAY'}
              </span>
            </div>
          </div>
        </div>

        <!-- Non-Repeating Business Quote Card -->
        <div class="mt-6 pt-6 border-t border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-start gap-3">
            <span class="text-xl text-zinc-400 mt-0.5">“</span>
            <div>
              <p class="text-sm font-medium text-zinc-300 italic" id="banner-quote-text">
                ${quote.text}
              </p>
              <p class="text-xs text-zinc-500 font-medium tracking-wide mt-1" id="banner-quote-author">
                — ${quote.author}
              </p>
            </div>
          </div>
          <button id="btn-refresh-quote" class="px-3 py-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer" title="Next fresh motivational quote">
            <i class="fa-solid fa-arrows-rotate text-[11px]"></i> Next Quote
          </button>
        </div>
      </div>

      <!-- Roadmap Stage & Pace Status Window -->
      <div class="mb-8 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                Phase ${activeRoadmapStage.stageNumber} of ${state.roadmap.length}
              </span>
              <span class="text-xs text-zinc-400">Current Business Development Stage</span>
            </div>
            <h2 class="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>${activeRoadmapStage.stageName}</span>
            </h2>
            <p class="text-sm text-zinc-400 mt-1 max-w-2xl">
              ${activeRoadmapStage.description}
            </p>
          </div>

          <!-- Pace Badge & Deadline Countdown -->
          <div class="flex flex-wrap items-center gap-4">
            <div class="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center min-w-[130px]">
              <div class="text-[11px] text-zinc-400 uppercase font-semibold">Target Deadline</div>
              <div class="text-sm font-bold text-zinc-200 mt-0.5">${activeRoadmapStage.targetDateFormatted}</div>
              <div class="text-[10px] ${activeRoadmapStage.daysRemaining >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-medium">
                ${activeRoadmapStage.daysRemaining >= 0 ? `${activeRoadmapStage.daysRemaining} days remaining` : `${Math.abs(activeRoadmapStage.daysRemaining)} days overdue`}
              </div>
            </div>

            <!-- Intelligent Pace Indicator -->
            <div class="p-3 rounded-xl border ${activeRoadmapStage.paceClasses.border} ${activeRoadmapStage.paceClasses.bg} min-w-[170px]">
              <div class="text-[11px] ${activeRoadmapStage.paceClasses.text} uppercase font-semibold flex items-center gap-1.5">
                <i class="fa-solid ${activeRoadmapStage.paceClasses.icon}"></i> Execution Pace
              </div>
              <div class="text-base font-bold ${activeRoadmapStage.paceClasses.text} mt-0.5">
                ${activeRoadmapStage.paceStatus}
              </div>
              <div class="text-[10px] text-zinc-400 font-medium">
                ${activeRoadmapStage.paceNote}
              </div>
            </div>

            <button onclick="window.App.navigateTo('operations')" class="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer">
              <i class="fa-solid fa-pen-to-square"></i> Edit in Operations
            </button>
          </div>
        </div>

        <!-- Multi-Stage Horizontal Stepper -->
        <div class="mt-6">
          <div class="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span>Overall Roadmap Completion: <strong class="text-zinc-200">${activeRoadmapStage.overallPercent}%</strong></span>
            <span class="text-zinc-500 text-[11px]">Interlinked with Operations Roadmap</span>
          </div>
          <div class="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div class="bg-zinc-300 h-2 rounded-full transition-all duration-700" style="width: ${activeRoadmapStage.overallPercent}%"></div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
            ${state.roadmap.map((s, idx) => `
              <div class="p-2.5 rounded-lg border ${s.status === 'Completed' ? 'bg-zinc-800/80 border-zinc-700 text-zinc-300' : s.status === 'In Progress' ? 'bg-zinc-800/40 border-zinc-700 text-zinc-200' : 'bg-zinc-950/40 border-zinc-800/80 text-zinc-500'}">
                <div class="flex items-center justify-between text-[10px] font-semibold">
                  <span>STEP ${s.stageNumber}</span>
                  <i class="fa-solid ${s.status === 'Completed' ? 'fa-circle-check text-zinc-300' : s.status === 'In Progress' ? 'fa-spinner fa-spin text-zinc-400' : 'fa-circle text-zinc-700'}"></i>
                </div>
                <div class="text-xs font-medium truncate mt-1 text-zinc-200" title="${s.stageName}">${s.stageName}</div>
                <div class="text-[10px] text-zinc-400 mt-0.5 font-mono">${s.targetDate}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 3-Tier To-Do List Window -->
      <div class="mb-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div class="flex items-center gap-2">
              <span class="p-2 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700">
                <i class="fa-solid fa-list-check"></i>
              </span>
              <h2 class="text-xl font-bold text-zinc-100">Co-Founder Work Matrix & To-Dos</h2>
            </div>
            <p class="text-xs text-zinc-400 mt-1">Organized in 3 clear views: Your tasks, Shared Team priorities, and ${otherUser.name}'s responsibilities.</p>
          </div>
        </div>

        <!-- 3 Columns for 3 Tiers -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          <!-- TIER 1: Logged-in Partner's To-Dos -->
          <div class="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 flex flex-col h-full shadow-sm">
            <div class="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-zinc-400"></div>
                <h3 class="text-sm font-semibold text-zinc-200 tracking-wide">My To-Do List</h3>
              </div>
              <span class="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-medium font-mono border border-zinc-700">
                ${myTodos.filter(t => !t.completed).length} Pending
              </span>
            </div>
            <div class="space-y-2.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
              ${myTodos.length === 0 ? `<div class="text-xs text-zinc-500 text-center py-8">No personal tasks pending. All caught up!</div>` : ''}
              ${myTodos.map(todo => this.renderTodoCard(todo, true)).join('')}
            </div>
          </div>

          <!-- TIER 2: Team To-Dos (Performed Together) -->
          <div class="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 flex flex-col h-full shadow-sm">
            <div class="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-zinc-400"></div>
                <h3 class="text-sm font-semibold text-zinc-200 tracking-wide">Team To-Do List</h3>
              </div>
              <span class="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-medium font-mono border border-zinc-700">
                ${teamTodos.filter(t => !t.completed).length} Pending
              </span>
            </div>
            <div class="space-y-2.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
              ${teamTodos.length === 0 ? `<div class="text-xs text-zinc-500 text-center py-8">No shared team tasks right now.</div>` : ''}
              ${teamTodos.map(todo => this.renderTodoCard(todo, true)).join('')}
            </div>
          </div>

          <!-- TIER 3: Co-Founder's To-Dos -->
          <div class="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 flex flex-col h-full shadow-sm">
            <div class="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-zinc-400"></div>
                <h3 class="text-sm font-semibold text-zinc-200 tracking-wide">${otherUser.name}'s Tasks</h3>
              </div>
              <span class="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-medium font-mono border border-zinc-700">
                ${partnerTodos.filter(t => !t.completed).length} Pending
              </span>
            </div>
            <div class="space-y-2.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
              ${partnerTodos.length === 0 ? `<div class="text-xs text-zinc-500 text-center py-8">No pending tasks for ${otherUser.name}.</div>` : ''}
              ${partnerTodos.map(todo => this.renderTodoCard(todo, false)).join('')}
            </div>
          </div>

        </div>
      </div>

      <!-- Business Divisions Navigation Hub -->
      <div class="mb-12">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-zinc-100 tracking-tight">Business Divisions & Workspaces</h2>
          <p class="text-sm text-zinc-400">Collaborative workspaces built for development-stage co-founders. Select a division to enter:</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- 1. Finance -->
          <div onclick="window.App.navigateTo('finance')" 
            class="group rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-6 shadow-sm transition duration-200 cursor-pointer">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center justify-center text-base">
                <i class="fa-solid fa-indian-rupee-sign text-emerald-400/80"></i>
              </div>
              <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                Treasury & Proofs
              </span>
            </div>
            <h3 class="text-lg font-bold text-zinc-100 group-hover:text-white transition">Finance</h3>
            <p class="text-xs text-zinc-400 mt-2 leading-relaxed">
              Track founder expenses with live camera invoice capture, P&L, Cash Flow, Financial Ratios, and who owes what balance settlement.
            </p>
            <div class="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-300 font-medium">
              <span>Enter Workspace</span>
              <i class="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition text-zinc-400"></i>
            </div>
          </div>

          <!-- 2. Marketing -->
          <div onclick="window.App.navigateTo('marketing')" 
            class="group rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-6 shadow-sm transition duration-200 cursor-pointer">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center justify-center text-base">
                <i class="fa-solid fa-cube text-purple-400/80"></i>
              </div>
              <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                Campaign Studio
              </span>
            </div>
            <h3 class="text-lg font-bold text-zinc-100 group-hover:text-white transition">Marketing</h3>
            <p class="text-xs text-zinc-400 mt-2 leading-relaxed">
              Folder Idea Dump with move triage (Bin/Doubtful), real-time Brainstorming whiteboard & live chat, and step-by-step Implementation roadmaps.
            </p>
            <div class="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-300 font-medium">
              <span>Enter Workspace</span>
              <i class="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition text-zinc-400"></i>
            </div>
          </div>

          <!-- 3. Operations -->
          <div onclick="window.App.navigateTo('operations')" 
            class="group rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-6 shadow-sm transition duration-200 cursor-pointer">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center justify-center text-base">
                <i class="fa-solid fa-bolt text-amber-400/80"></i>
              </div>
              <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                Execution Engine
              </span>
            </div>
            <h3 class="text-lg font-bold text-zinc-100 group-hover:text-white transition">Operations</h3>
            <p class="text-xs text-zinc-400 mt-2 leading-relaxed">
              Master Development Roadmap, SKU registry, dynamic COGS & Pricing calculator, and centralized "My Work" cross-dashboard aggregator.
            </p>
            <div class="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-300 font-medium">
              <span>Enter Workspace</span>
              <i class="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition text-zinc-400"></i>
            </div>
          </div>

          <!-- 4. Legal -->
          <div onclick="window.App.navigateTo('legal')" 
            class="group rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-6 shadow-sm transition duration-200 cursor-pointer">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center justify-center text-base">
                <i class="fa-solid fa-scale-balanced text-stone-300"></i>
              </div>
              <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                Compliance Registry
              </span>
            </div>
            <h3 class="text-lg font-bold text-zinc-100 group-hover:text-white transition">Legal</h3>
            <p class="text-xs text-zinc-400 mt-2 leading-relaxed">
              Track progress stages for corporate licenses, laboratory testings, and compliance reports with official stamped document roadmaps.
            </p>
            <div class="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-300 font-medium">
              <span>Enter Workspace</span>
              <i class="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition text-zinc-400"></i>
            </div>
          </div>

          <!-- 5. Overall Dashboard -->
          <div onclick="window.App.navigateTo('overall')" 
            class="group md:col-span-2 lg:col-span-2 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-6 shadow-sm transition duration-200 cursor-pointer">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center justify-center text-base">
                <i class="fa-solid fa-chart-line text-cyan-400/80"></i>
              </div>
              <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                Telemetry Analytics
              </span>
            </div>
            <h3 class="text-lg font-bold text-zinc-100 group-hover:text-white transition">Overall Real-Time Dashboard</h3>
            <p class="text-xs text-zinc-400 mt-2 leading-relaxed max-w-xl">
              Centralized executive command center with real-time telemetry meters and interactive visual Chart.js analytics across Finance, Marketing, Operations, and Legal.
            </p>
            <div class="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-300 font-medium">
              <span>Launch Telemetry Command Center</span>
              <i class="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition text-zinc-400"></i>
            </div>
          </div>

        </div>
      </div>
    `;

    // Start banner live clock
    this.startClock();
  }

  static renderTodoCard(todo, allowToggle = true) {
    const priorityColors = {
      high: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    }[todo.priority] || 'bg-zinc-800 text-zinc-400';

    return `
      <div class="group p-3 rounded-lg border ${todo.completed ? 'bg-zinc-950/40 border-zinc-800 opacity-60' : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700'} transition flex items-start justify-between gap-3">
        <div class="flex items-start gap-2.5 flex-1 min-w-0">
          <input type="checkbox" ${todo.completed ? 'checked' : ''} ${allowToggle ? `onchange="DashboardController.toggleTodo('${todo.id}')"` : 'disabled'}
            class="mt-1 h-4 w-4 rounded border-zinc-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900 cursor-pointer" />
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium ${todo.completed ? 'line-through text-zinc-500' : 'text-zinc-200'} break-words">
              ${todo.text}
            </p>
            <div class="flex items-center gap-2 mt-1.5 flex-wrap">
              <span class="text-[9px] uppercase px-1.5 py-0.5 rounded border font-semibold ${priorityColors}">
                ${todo.priority}
              </span>
              <span class="text-[10px] text-zinc-400 font-medium">
                ${todo.category}
              </span>
              <span class="text-[10px] text-zinc-500 flex items-center gap-1">
                <i class="fa-regular fa-calendar text-[9px]"></i> ${todo.dueDate || 'No date'}
              </span>
            </div>
          </div>
        </div>
        <button onclick="DashboardController.deleteTodo('${todo.id}')" class="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 transition p-1" title="Delete task">
          <i class="fa-regular fa-trash-can text-xs"></i>
        </button>
      </div>
    `;
  }

  static calculateRoadmapPace(roadmap) {
    if (!roadmap || roadmap.length === 0) {
      return {
        stageNumber: 1,
        stageName: "Planning",
        description: "Initial startup formation",
        targetDateFormatted: "TBD",
        daysRemaining: 0,
        paceStatus: "On Track",
        paceClasses: { bg: 'bg-emerald-950/30', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: 'fa-circle-check' },
        paceNote: "Milestones progressing normally",
        overallPercent: 0
      };
    }

    // Find current active stage (first incomplete or in-progress)
    let activeStage = roadmap.find(s => s.status === 'In Progress') || roadmap.find(s => s.status === 'Upcoming') || roadmap[roadmap.length - 1];

    const now = new Date();
    const targetDate = new Date(activeStage.targetDate);
    const diffTime = targetDate - now;
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate overall percent
    const completedStages = roadmap.filter(s => s.status === 'Completed').length;
    const inProgressStages = roadmap.filter(s => s.status === 'In Progress');
    let inProgressProgress = inProgressStages.reduce((acc, s) => acc + (s.progress || 50), 0);
    const overallPercent = Math.min(100, Math.round(((completedStages * 100) + inProgressProgress) / (roadmap.length * 100) * 100));

    // Pace Logic
    let paceStatus = "On Track";
    let paceNote = "Meeting developmental milestones at a healthy pace";
    let paceClasses = { bg: 'bg-emerald-950/40', border: 'border-emerald-500/40', text: 'text-emerald-400', icon: 'fa-circle-check' };

    if (daysRemaining < 0) {
      paceStatus = "Deadline Exceeded";
      paceNote = `Action needed: stage is ${Math.abs(daysRemaining)} days overdue`;
      paceClasses = { bg: 'bg-rose-950/40', border: 'border-rose-500/40', text: 'text-rose-400', icon: 'fa-triangle-exclamation' };
    } else if (daysRemaining <= 7 && (activeStage.progress || 0) < 60) {
      paceStatus = "Behind Pace";
      paceNote = `7 days remaining, only ${activeStage.progress || 0}% completed`;
      paceClasses = { bg: 'bg-amber-950/40', border: 'border-amber-500/40', text: 'text-amber-400', icon: 'fa-gauge-high' };
    } else if ((activeStage.progress || 0) > 60 || completedStages >= 2) {
      paceStatus = "Ahead of Schedule";
      paceNote = "Rapid execution speed. Solid progress momentum.";
      paceClasses = { bg: 'bg-teal-950/40', border: 'border-teal-500/40', text: 'text-teal-300', icon: 'fa-rocket' };
    }

    return {
      stageNumber: activeStage.stageNumber,
      stageName: activeStage.stageName,
      description: activeStage.description,
      targetDateFormatted: activeStage.targetDate,
      daysRemaining: daysRemaining,
      paceStatus: paceStatus,
      paceClasses: paceClasses,
      paceNote: paceNote,
      overallPercent: overallPercent
    };
  }

  static toggleTodo(id) {
    window.State.toggleTodo(id);
    this.render();
  }

  static deleteTodo(id) {
    if (confirm("Delete this task?")) {
      window.State.deleteTodo(id);
      this.render();
    }
  }

  static bindEvents() {
    // Refresh quote button
    const refreshQuoteBtn = document.getElementById('btn-refresh-quote');
    if (refreshQuoteBtn) {
      refreshQuoteBtn.onclick = () => {
        const q = window.QuoteManager.getNextQuote();
        const textEl = document.getElementById('banner-quote-text');
        const authorEl = document.getElementById('banner-quote-author');
        if (textEl) textEl.textContent = q.text;
        if (authorEl) authorEl.textContent = `— ${q.author}`;
      };
    }

  }

  static startClock() {
    const clockEl = document.getElementById('live-clock-banner');
    if (!clockEl) return;

    const update = () => {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
    };
    update();
    setInterval(update, 1000);
  }
}

window.DashboardController = DashboardController;
