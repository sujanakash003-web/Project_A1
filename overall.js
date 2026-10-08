// ============================================================================
// Overall Dashboard Controller
// Real-Time Mechanics & Telemetry HUD Aesthetic with Animated Gears,
// Sector Selector & Dynamic Multi-Division Chart.js Visualizations
// ============================================================================

class OverallController {
  static activeSector = 'all'; // 'all' | 'finance' | 'marketing' | 'operations' | 'legal'
  static charts = {};

  static init() {
    this.render();
    this.initCharts();
    this.startTelemetryPulse();
  }

  static render() {
    const container = document.getElementById('overall-view');
    if (!container) return;

    const state = window.State.state;
    const stats = this.computeMacroStats(state);

    container.innerHTML = `
      <div class="relative max-w-7xl mx-auto space-y-8 pb-16 overall-mechanics-root">
        
        <!-- Rotating Mechanics Gear Watermarks in corners -->
        <div class="mechanics-gear gear-top-right select-none pointer-events-none">
          <i class="fa-solid fa-gear"></i>
        </div>
        <div class="mechanics-gear gear-bottom-left select-none pointer-events-none">
          <i class="fa-solid fa-gears"></i>
        </div>

        <!-- Telemetry Command Header -->
        <div class="relative z-10 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center justify-center text-xl shadow-sm">
              <i class="fa-solid fa-satellite-dish"></i>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span class="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                  REAL-TIME TELEMETRY MATRIX • LIVE
                </span>
                <span class="text-[10px] text-zinc-500 font-mono" id="telemetry-timestamp"></span>
              </div>
              <h1 class="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight font-mono">
                CENTRAL TELEMETRY & ANALYTICS COMMAND
              </h1>
            </div>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <button onclick="window.App.navigateTo('dashboard')" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-mono font-medium border border-zinc-700 transition flex items-center gap-1.5 shadow-sm cursor-pointer">
              <i class="fa-solid fa-arrow-left"></i> Main Cockpit
            </button>

            <!-- Sector Drill-Down Selector -->
            <div class="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              ${['all', 'finance', 'marketing', 'operations', 'legal'].map(sec => `
                <button onclick="OverallController.setSector('${sec}')" 
                  class="px-3 py-1.5 rounded-lg text-xs font-mono font-medium uppercase transition cursor-pointer ${
                    this.activeSector === sec ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm' : 'text-zinc-400 hover:text-white'
                  }">
                  ${sec === 'all' ? 'All Sectors' : sec}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Real-Time Telemetry KPI Gauges -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div class="p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm relative overflow-hidden">
            <div class="text-[10px] font-mono font-semibold text-zinc-400 uppercase">Treasury Available</div>
            <div class="text-xl font-mono font-bold text-zinc-100 mt-1">₹${stats.cashBalance.toLocaleString('en-IN')}</div>
            <div class="text-[10px] text-zinc-500 font-mono mt-1">Burn: ₹${stats.monthlyBurn.toLocaleString('en-IN')}/mo</div>
          </div>

          <div class="p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm relative overflow-hidden">
            <div class="text-[10px] font-mono font-semibold text-zinc-400 uppercase">Marketing Pipeline</div>
            <div class="text-xl font-mono font-bold text-zinc-100 mt-1">${stats.activeCampaigns} <span class="text-xs text-zinc-500 font-normal">Active</span></div>
            <div class="text-[10px] text-zinc-500 font-mono mt-1">${stats.totalIdeas} Total Concepts In Dump</div>
          </div>

          <div class="p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm relative overflow-hidden">
            <div class="text-[10px] font-mono font-semibold text-zinc-400 uppercase">Operational SKUs</div>
            <div class="text-xl font-mono font-bold text-zinc-100 mt-1">${stats.skuCount} <span class="text-xs text-zinc-500 font-normal">Units</span></div>
            <div class="text-[10px] text-zinc-500 font-mono mt-1">Roadmap: Stage ${stats.currentStageNum} of ${stats.totalStages}</div>
          </div>

          <div class="p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm relative overflow-hidden">
            <div class="text-[10px] font-mono font-semibold text-zinc-400 uppercase">Legal Compliance</div>
            <div class="text-xl font-mono font-bold text-zinc-100 mt-1">${stats.clearedLegalPercent}% <span class="text-xs text-zinc-500 font-normal">Cleared</span></div>
            <div class="text-[10px] text-zinc-500 font-mono mt-1">${stats.activeLegalCount} of ${stats.totalLegalCount} Dockets Active</div>
          </div>

        </div>

        <!-- Telemetry Status Bar Ticker -->
        <div class="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400 overflow-x-auto whitespace-nowrap gap-6">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>SYSTEM INTEGRITY: <strong class="text-zinc-200">NOMINAL</strong></span>
          </div>
          <div>BUS LATENCY: <span class="text-zinc-300 font-semibold" id="latency-indicator">14ms</span></div>
          <div>CO-FOUNDER NODES: <span class="text-zinc-300 font-semibold">2 ACTIVE</span></div>
          <div>BACKUP ENGINE: <span class="text-zinc-400">AUTO-LOCAL / READY</span></div>
          <div>TELEMETRY REFRESH: <span class="text-zinc-400">STREAMING</span></div>
        </div>

        <!-- SECTOR GRAPHS SECTION -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Graph 1: Macro Business Readiness Radar / Multi-Dimension Progress -->
          <div class="p-6 rounded-2xl bg-zinc-950/90 border border-cyan-500/30 shadow-xl space-y-4 ${this.activeSector === 'all' || this.activeSector === 'operations' ? '' : 'hidden'}">
            <div class="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 class="text-sm font-mono font-bold text-cyan-300 flex items-center gap-2">
                <i class="fa-solid fa-chart-pie"></i> Multi-Sector Development Readiness (%)
              </h3>
              <span class="text-[10px] font-mono text-zinc-500">Live Matrix</span>
            </div>
            <div class="h-64 relative flex items-center justify-center">
              <canvas id="chart-radar-readiness"></canvas>
            </div>
          </div>

          <!-- Graph 2: Financial Capital Deployment vs Expenses (Finance Sector) -->
          <div class="p-6 rounded-2xl bg-zinc-950/90 border border-emerald-500/30 shadow-xl space-y-4 ${this.activeSector === 'all' || this.activeSector === 'finance' ? '' : 'hidden'}">
            <div class="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 class="text-sm font-mono font-bold text-emerald-300 flex items-center gap-2">
                <i class="fa-solid fa-chart-column"></i> Expense Breakdown by Category (₹)
              </h3>
              <span class="text-[10px] font-mono text-zinc-500">Finance Sector</span>
            </div>
            <div class="h-64 relative flex items-center justify-center">
              <canvas id="chart-finance-categories"></canvas>
            </div>
          </div>

          <!-- Graph 3: Marketing Pipeline Funnel (Marketing Sector) -->
          <div class="p-6 rounded-2xl bg-zinc-950/90 border border-purple-500/30 shadow-xl space-y-4 ${this.activeSector === 'all' || this.activeSector === 'marketing' ? '' : 'hidden'}">
            <div class="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 class="text-sm font-mono font-bold text-purple-300 flex items-center gap-2">
                <i class="fa-solid fa-filter"></i> Marketing Concept Progression Funnel
              </h3>
              <span class="text-[10px] font-mono text-zinc-500">Marketing Sector</span>
            </div>
            <div class="h-64 relative flex items-center justify-center">
              <canvas id="chart-marketing-funnel"></canvas>
            </div>
          </div>

          <!-- Graph 4: Operations Roadmap Velocity & Task Status (Operations Sector) -->
          <div class="p-6 rounded-2xl bg-zinc-950/90 border border-amber-500/30 shadow-xl space-y-4 ${this.activeSector === 'all' || this.activeSector === 'operations' ? '' : 'hidden'}">
            <div class="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 class="text-sm font-mono font-bold text-amber-300 flex items-center gap-2">
                <i class="fa-solid fa-bars-progress"></i> Roadmap Milestone Completion (%)
              </h3>
              <span class="text-[10px] font-mono text-zinc-500">Operations Sector</span>
            </div>
            <div class="h-64 relative flex items-center justify-center">
              <canvas id="chart-roadmap-velocity"></canvas>
            </div>
          </div>

          <!-- Graph 5: Legal & Statutory Compliance Status (Legal Sector) -->
          <div class="p-6 rounded-2xl bg-zinc-950/90 border border-stone-600/40 shadow-xl space-y-4 col-span-full ${this.activeSector === 'all' || this.activeSector === 'legal' ? '' : 'hidden'}">
            <div class="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 class="text-sm font-mono font-bold text-stone-200 flex items-center gap-2">
                <i class="fa-solid fa-scale-balanced"></i> Statutory License Clearance by Agency Status
              </h3>
              <span class="text-[10px] font-mono text-zinc-500">Legal Sector</span>
            </div>
            <div class="h-64 relative flex items-center justify-center">
              <canvas id="chart-legal-compliance"></canvas>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  static computeMacroStats(state) {
    const inflows = Array.isArray(state?.finance?.inflows) ? state.finance.inflows : [];
    const expenses = Array.isArray(state?.finance?.expenses) ? state.finance.expenses : [];
    const totalInflows = inflows.reduce((a, b) => a + Number(b.amount || 0), 0);
    const totalExpenses = expenses.reduce((a, b) => a + Number(b.amount || 0), 0);
    const cashBalance = totalInflows - totalExpenses;
    const monthlyBurn = Math.round(totalExpenses * 0.55);

    const ideas = Array.isArray(state?.marketing?.ideas) ? state.marketing.ideas : [];
    const totalIdeas = ideas.length;
    const activeCampaigns = ideas.filter(i => i.status === 'implementation').length;

    const skus = Array.isArray(state?.operations?.skus) ? state.operations.skus : [];
    const skuCount = skus.length;
    const roadmap = Array.isArray(state?.roadmap) ? state.roadmap : [];
    const totalStages = roadmap.length;
    const currentStage = roadmap.find(s => s.status === 'In Progress') || roadmap[0];
    const currentStageNum = currentStage ? currentStage.stageNumber : 1;

    const docs = Array.isArray(state?.legal?.documents) ? state.legal.documents : [];
    const totalLegalCount = docs.length;
    const activeLegalCount = docs.filter(d => d.status === 'Active').length;
    const clearedLegalPercent = totalLegalCount > 0 ? Math.round((activeLegalCount / totalLegalCount) * 100) : 0;

    return {
      cashBalance,
      monthlyBurn,
      totalIdeas,
      activeCampaigns,
      skuCount,
      totalStages,
      currentStageNum,
      totalLegalCount,
      activeLegalCount,
      clearedLegalPercent
    };
  }

  static setSector(sec) {
    this.activeSector = sec;
    this.render();
    this.initCharts();
  }

  static initCharts() {
    if (typeof Chart === 'undefined') return;

    // Defer chart instantiation slightly so the DOM container has computed layout dimensions
    setTimeout(() => {
      const state = window.State.state;
      if (!state) return;

      const safeDestroy = (canvasId) => {
        const el = document.getElementById(canvasId);
        if (el) {
          const existing = Chart.getChart(el);
          if (existing) {
            try { existing.destroy(); } catch (e) {}
          }
        }
        return el;
      };

      // 1. Radar Readiness Chart
      try {
        const ctxRadar = safeDestroy('chart-radar-readiness');
        if (ctxRadar) {
          this.charts.radar = new Chart(ctxRadar, {
            type: 'radar',
            data: {
              labels: ['Financial Runway', 'Brand & Mktg', 'Operations / SKU', 'Regulatory Legal', 'Team Execution'],
              datasets: [{
                label: 'Current Readiness Index',
                data: [78, 65, 82, 70, 88],
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                borderColor: '#38bdf8',
                borderWidth: 1.5,
                pointBackgroundColor: '#7dd3fc'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  angleLines: { color: '#27272a' },
                  grid: { color: '#27272a' },
                  pointLabels: { color: '#a1a1aa', font: { family: 'monospace', size: 10 } },
                  ticks: { display: false, max: 100 }
                }
              },
              plugins: { legend: { display: false } }
            }
          });
        }
      } catch (e) {
        console.warn("Error initializing radar chart:", e);
      }

      // 2. Finance Categories Chart
      try {
        const ctxFinance = safeDestroy('chart-finance-categories');
        if (ctxFinance) {
          const catMap = {};
          const expenses = Array.isArray(state?.finance?.expenses) ? state.finance.expenses : [];
          expenses.forEach(e => {
            catMap[e.category] = (catMap[e.category] || 0) + Number(e.amount || 0);
          });

          this.charts.finance = new Chart(ctxFinance, {
            type: 'doughnut',
            data: {
              labels: Object.keys(catMap).length ? Object.keys(catMap) : ['Uncategorized'],
              datasets: [{
                data: Object.values(catMap).length ? Object.values(catMap) : [1],
                backgroundColor: ['#34d399', '#38bdf8', '#fbbf24', '#a78bfa', '#f87171', '#818cf8', '#94a3b8'],
                borderWidth: 1,
                borderColor: '#181a1f'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                  labels: { color: '#d4d4d8', font: { family: 'monospace', size: 10 } }
                }
              }
            }
          });
        }
      } catch (e) {
        console.warn("Error initializing finance chart:", e);
      }

      // 3. Marketing Funnel Chart
      try {
        const ctxMarketing = safeDestroy('chart-marketing-funnel');
        if (ctxMarketing) {
          const ideas = Array.isArray(state?.marketing?.ideas) ? state.marketing.ideas : [];
          const otherIdeas = Array.isArray(state?.marketing?.otherIdeas) ? state.marketing.otherIdeas : [];
          const dumpCount = ideas.filter(i => i.status === 'dump').length;
          const doubtfulCount = ideas.filter(i => i.status === 'doubtful').length;
          const implCount = ideas.filter(i => i.status === 'implementation').length;
          const otherCount = otherIdeas.length;

          this.charts.marketing = new Chart(ctxMarketing, {
            type: 'bar',
            data: {
              labels: ['Raw Dump', 'Doubtful', 'In Execution', 'Archive / Other'],
              datasets: [{
                label: 'Concepts',
                data: [dumpCount, doubtfulCount, implCount, otherCount],
                backgroundColor: ['#a78bfa', '#fbbf24', '#34d399', '#64748b'],
                borderRadius: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { ticks: { color: '#a1a1aa', font: { family: 'monospace', size: 10 } }, grid: { display: false } },
                y: { ticks: { color: '#a1a1aa', font: { family: 'monospace', size: 10 } }, grid: { color: '#27272a' } }
              },
              plugins: { legend: { display: false } }
            }
          });
        }
      } catch (e) {
        console.warn("Error initializing marketing chart:", e);
      }

      // 4. Operations Roadmap Velocity
      try {
        const ctxRoadmap = safeDestroy('chart-roadmap-velocity');
        if (ctxRoadmap) {
          const roadmap = Array.isArray(state?.roadmap) ? state.roadmap : [];
          this.charts.roadmap = new Chart(ctxRoadmap, {
            type: 'bar',
            data: {
              labels: roadmap.map(s => `Stage ${s.stageNumber}`),
              datasets: [{
                label: 'Completion %',
                data: roadmap.map(s => s.status === 'Completed' ? 100 : (s.progress || 30)),
                backgroundColor: roadmap.map(s => s.status === 'Completed' ? '#34d399' : s.status === 'In Progress' ? '#fbbf24' : '#27272a'),
                borderRadius: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { ticks: { color: '#a1a1aa', font: { family: 'monospace', size: 10 } }, grid: { display: false } },
                y: { max: 100, ticks: { color: '#a1a1aa', font: { family: 'monospace', size: 10 } }, grid: { color: '#27272a' } }
              },
              plugins: { legend: { display: false } }
            }
          });
        }
      } catch (e) {
        console.warn("Error initializing roadmap chart:", e);
      }

      // 5. Legal Compliance Chart
      try {
        const ctxLegal = safeDestroy('chart-legal-compliance');
        if (ctxLegal) {
          const docs = Array.isArray(state?.legal?.documents) ? state.legal.documents : [];
          const active = docs.filter(d => d.status === 'Active').length;
          const review = docs.filter(d => d.status === 'Review').length;
          const pending = docs.filter(d => d.status === 'Pending').length;

          this.charts.legal = new Chart(ctxLegal, {
            type: 'bar',
            indexAxis: 'y',
            data: {
              labels: ['Certified Active', 'Under Examination / Review', 'Pending Department Action'],
              datasets: [{
                label: 'Dockets',
                data: [active, review, pending],
                backgroundColor: ['#34d399', '#fbbf24', '#f87171'],
                borderRadius: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { ticks: { color: '#a1a1aa', font: { family: 'monospace', size: 10 } }, grid: { color: '#27272a' } },
                y: { ticks: { color: '#d4d4d8', font: { family: 'monospace', size: 11 } }, grid: { display: false } }
              },
              plugins: { legend: { display: false } }
            }
          });
        }
      } catch (e) {
        console.warn("Error initializing legal chart:", e);
      }
    }, 60);
  }

  static startTelemetryPulse() {
    if (this.pulseTimer) clearInterval(this.pulseTimer);
    this.pulseTimer = setInterval(() => {
      const tsEl = document.getElementById('telemetry-timestamp');
      if (tsEl) {
        tsEl.textContent = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
      }

      const latEl = document.getElementById('latency-indicator');
      if (latEl) {
        latEl.textContent = `${Math.floor(10 + Math.random() * 8)}ms`;
      }
    }, 2000);
  }
}

window.OverallController = OverallController;
