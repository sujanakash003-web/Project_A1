// ============================================================================
// Finance Division Controller
// Emerald Theme with Floating Rupee FX, Camera Receipt Capture,
// P&L, Cash Flow, Ratios, and Partner Settlement Engine
// ============================================================================

class FinanceController {
  static currentReceiptImage = null;
  static mediaStream = null;

  static init() {
    this.render();
    this.initRupeeDecorations();
    this.bindEvents();
  }

  static render() {
    const container = document.getElementById('finance-view');
    if (!container) return;

    const state = window.State.state;
    const currentUser = window.State.getCurrentUser() || 'milan';
    const milanName = state.auth.milan.name;
    const sujanName = state.auth.sujan.name;

    // Calculate financials
    const calculations = this.calculateFinancials(state.finance);

    container.innerHTML = `
      <!-- Floating Rupee Background Effect Layer -->
      <div id="rupee-particles-layer" class="rupee-bg-layer pointer-events-none"></div>

      <div class="relative z-10 max-w-7xl mx-auto space-y-8 pb-16">
        
        <!-- Header & Navigation Bar -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
          <div>
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 text-emerald-400 flex items-center justify-center text-lg font-bold">
                ₹
              </span>
              <div>
                <h1 class="text-2xl md:text-3xl font-bold text-zinc-100 tracking-tight">Finance & Capital Engine</h1>
                <p class="text-xs text-zinc-400">Pre-Revenue Startup Treasury, Proofs & Equalization Settlement</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <button onclick="window.App.navigateTo('dashboard')" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-medium border border-zinc-700 transition flex items-center gap-2 cursor-pointer">
              <i class="fa-solid fa-arrow-left"></i> Main Dashboard
            </button>
            <button id="btn-open-expense-modal" class="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-2 cursor-pointer">
              <i class="fa-solid fa-camera text-emerald-400/80"></i> Record Expense & Photo Proof
            </button>
          </div>
        </div>

        <!-- 4 Key Financial Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
            <div class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Available Cash Balance</div>
            <div class="text-2xl md:text-3xl font-bold text-zinc-100 mt-1">₹${calculations.cashBalance.toLocaleString('en-IN')}</div>
            <div class="text-[11px] text-zinc-400 mt-1 flex items-center gap-1 font-mono">
              <i class="fa-solid fa-vault text-zinc-500"></i> In Startup Treasury
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
            <div class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Total Development Spend</div>
            <div class="text-2xl md:text-3xl font-bold text-zinc-100 mt-1">₹${calculations.totalExpenses.toLocaleString('en-IN')}</div>
            <div class="text-[11px] text-zinc-400 mt-1 flex items-center gap-1 font-mono">
              <i class="fa-solid fa-receipt text-zinc-500"></i> ${state.finance.expenses.length} Logged Transactions
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
            <div class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Est. Monthly Burn Rate</div>
            <div class="text-2xl md:text-3xl font-bold text-zinc-100 mt-1">₹${calculations.monthlyBurnRate.toLocaleString('en-IN')}</div>
            <div class="text-[11px] text-zinc-400 mt-1 flex items-center gap-1 font-mono">
              <i class="fa-solid fa-fire text-amber-500/80"></i> Average Burn / Month
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
            <div class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Estimated Runway</div>
            <div class="text-2xl md:text-3xl font-bold text-zinc-100 mt-1">${calculations.runwayMonths} <span class="text-sm font-normal text-zinc-400">Months</span></div>
            <div class="text-[11px] text-zinc-400 mt-1 flex items-center gap-1 font-mono">
              <i class="fa-solid fa-hourglass-half text-zinc-500"></i> At current burn velocity
            </div>
          </div>

        </div>

        <!-- Co-Founders Capital & Equalization Settlement Card -->
        <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
            <div>
              <span class="text-[10px] font-semibold uppercase tracking-wider text-zinc-300 bg-zinc-800 px-2.5 py-0.5 rounded border border-zinc-700">
                Partner Capital Equity & Reimbursement
              </span>
              <h2 class="text-xl font-bold text-zinc-100 mt-1.5">Who Brought In What & Settlement Balance</h2>
              <p class="text-xs text-zinc-400 mt-0.5">Calculates individual out-of-pocket expenses and ensures 50/50 partnership parity.</p>
            </div>

            <!-- Settlement Result Banner -->
            <div class="p-4 rounded-xl border ${calculations.settlement.classes} min-w-[300px]">
              <div class="text-xs uppercase font-bold tracking-wider">${calculations.settlement.statusLabel}</div>
              <div class="text-lg font-extrabold mt-0.5">${calculations.settlement.headline}</div>
              <div class="text-[11px] opacity-90 mt-0.5">${calculations.settlement.subnote}</div>
            </div>
          </div>

          <!-- Partner Comparison Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            
            <!-- Milan Jadhav Card -->
            <div class="p-5 rounded-xl bg-zinc-950/60 border border-emerald-700/30">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white shadow">
                    MJ
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-white">${milanName}</h3>
                    <span class="text-[10px] text-emerald-400">Co-Founder</span>
                  </div>
                </div>
                <span class="text-xs font-mono font-bold text-emerald-300">50% Target Split</span>
              </div>
              <div class="space-y-2 text-xs">
                <div class="flex justify-between py-1.5 border-b border-zinc-800">
                  <span class="text-zinc-400">Initial Capital Contributed:</span>
                  <span class="font-bold text-white">₹${calculations.milanCapital.toLocaleString('en-IN')}</span>
                </div>
                <div class="flex justify-between py-1.5 border-b border-zinc-800">
                  <span class="text-zinc-400">Out-Of-Pocket Expenses Paid:</span>
                  <span class="font-bold text-emerald-400">₹${calculations.milanExpenses.toLocaleString('en-IN')}</span>
                </div>
                <div class="flex justify-between py-1.5">
                  <span class="text-zinc-300 font-semibold">Total Financial Investment:</span>
                  <span class="font-extrabold text-base text-white">₹${(calculations.milanCapital + calculations.milanExpenses).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <!-- Sujan Akash Card -->
            <div class="p-5 rounded-xl bg-zinc-950/60 border border-emerald-700/30">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow">
                    SA
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-white">${sujanName}</h3>
                    <span class="text-[10px] text-blue-400">Co-Founder</span>
                  </div>
                </div>
                <span class="text-xs font-mono font-bold text-blue-300">50% Target Split</span>
              </div>
              <div class="space-y-2 text-xs">
                <div class="flex justify-between py-1.5 border-b border-zinc-800">
                  <span class="text-zinc-400">Initial Capital Contributed:</span>
                  <span class="font-bold text-white">₹${calculations.sujanCapital.toLocaleString('en-IN')}</span>
                </div>
                <div class="flex justify-between py-1.5 border-b border-zinc-800">
                  <span class="text-zinc-400">Out-Of-Pocket Expenses Paid:</span>
                  <span class="font-bold text-blue-400">₹${calculations.sujanExpenses.toLocaleString('en-IN')}</span>
                </div>
                <div class="flex justify-between py-1.5">
                  <span class="text-zinc-300 font-semibold">Total Financial Investment:</span>
                  <span class="font-extrabold text-base text-white">₹${(calculations.sujanCapital + calculations.sujanExpenses).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Financial Statements & Analysis Tabs -->
        <div class="p-6 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 shadow-2xl backdrop-blur-md">
          <div class="flex items-center justify-between pb-4 border-b border-zinc-800 flex-wrap gap-4">
            <div class="flex items-center gap-2">
              <button id="tab-btn-tx" class="px-4 py-2 rounded-xl text-xs font-bold transition bg-emerald-500 text-zinc-950">
                <i class="fa-solid fa-list mr-1"></i> Transactions & Proofs
              </button>
              <button id="tab-btn-pl" class="px-4 py-2 rounded-xl text-xs font-bold transition bg-zinc-900 text-zinc-400 hover:text-white">
                <i class="fa-solid fa-chart-pie mr-1"></i> Profit & Loss (P&L)
              </button>
              <button id="tab-btn-cf" class="px-4 py-2 rounded-xl text-xs font-bold transition bg-zinc-900 text-zinc-400 hover:text-white">
                <i class="fa-solid fa-money-bill-transfer mr-1"></i> Cash Flow Statement
              </button>
              <button id="tab-btn-ratios" class="px-4 py-2 rounded-xl text-xs font-bold transition bg-zinc-900 text-zinc-400 hover:text-white">
                <i class="fa-solid fa-sliders mr-1"></i> Startup Ratios
              </button>
            </div>

            <div class="text-xs text-emerald-300/80">
              Currency: <strong>INR (₹)</strong> | Accounting: <strong>Cash Basis</strong>
            </div>
          </div>

          <!-- TAB 1: Transactions & Receipts Table -->
          <div id="tab-content-tx" class="mt-6">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold">
                    <th class="py-3 px-3">Date</th>
                    <th class="py-3 px-3">Description / Item</th>
                    <th class="py-3 px-3">Category</th>
                    <th class="py-3 px-3">Paid By</th>
                    <th class="py-3 px-3">Payment Mode</th>
                    <th class="py-3 px-3 text-right">Amount (₹)</th>
                    <th class="py-3 px-3 text-center">Invoice Proof</th>
                    <th class="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-zinc-800/60">
                  ${state.finance.expenses.length === 0 ? `
                    <tr><td colspan="8" class="text-center py-8 text-zinc-500">No expense records found. Click 'Record Expense' to add one!</td></tr>
                  ` : ''}
                  ${state.finance.expenses.map(exp => `
                    <tr class="hover:bg-emerald-950/20 transition">
                      <td class="py-3.5 px-3 text-zinc-300 font-mono">${exp.date}</td>
                      <td class="py-3.5 px-3 font-semibold text-white">
                        ${exp.title}
                        ${exp.notes ? `<div class="text-[10px] text-zinc-400 font-normal mt-0.5">${exp.notes}</div>` : ''}
                      </td>
                      <td class="py-3.5 px-3">
                        <span class="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-medium">
                          ${exp.category}
                        </span>
                      </td>
                      <td class="py-3.5 px-3">
                        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${exp.paidBy === 'milan' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-blue-950 text-blue-300 border border-blue-800'}">
                          ${exp.paidBy === 'milan' ? 'Milan' : 'Sujan'}
                        </span>
                      </td>
                      <td class="py-3.5 px-3 text-zinc-400">${exp.paymentMethod || 'UPI'}</td>
                      <td class="py-3.5 px-3 text-right font-bold text-white font-mono">₹${Number(exp.amount).toLocaleString('en-IN')}</td>
                      <td class="py-3.5 px-3 text-center">
                        ${exp.receiptImage ? `
                          <button onclick="FinanceController.openLightbox('${exp.receiptImage}', '${exp.title.replace(/'/g, "\\'")}')" 
                            class="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/40 rounded-lg text-[10px] font-semibold transition" title="View attached bill proof">
                            <i class="fa-solid fa-image"></i> View Proof
                          </button>
                        ` : `
                          <span class="text-zinc-600 text-[10px]">No Proof</span>
                        `}
                      </td>
                      <td class="py-3.5 px-3 text-center">
                        <button onclick="FinanceController.deleteExpense('${exp.id}')" class="text-zinc-500 hover:text-rose-400 transition p-1" title="Delete entry">
                          <i class="fa-regular fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 2: P&L Statement -->
          <div id="tab-content-pl" class="hidden mt-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
                <h3 class="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">Revenue / Inflows</h3>
                <div class="flex justify-between text-xs py-1 text-zinc-300">
                  <span>Gross Operating Sales</span>
                  <span class="font-mono font-bold text-white">₹0</span>
                </div>
                <div class="flex justify-between text-xs py-1 text-zinc-300">
                  <span>Founder Seed Capital Inflow</span>
                  <span class="font-mono font-bold text-emerald-400">₹${calculations.totalInflows.toLocaleString('en-IN')}</span>
                </div>
                <div class="pt-2 border-t border-zinc-800 flex justify-between text-sm font-bold text-emerald-300">
                  <span>Total Inflow</span>
                  <span class="font-mono">₹${calculations.totalInflows.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div class="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
                <h3 class="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">Operating & Development Expenses</h3>
                ${Object.entries(calculations.categoryTotals).map(([cat, amt]) => `
                  <div class="flex justify-between text-xs py-1 text-zinc-300">
                    <span>${cat}</span>
                    <span class="font-mono text-white">₹${amt.toLocaleString('en-IN')}</span>
                  </div>
                `).join('')}
                <div class="pt-2 border-t border-zinc-800 flex justify-between text-sm font-bold text-rose-400">
                  <span>Total Operating Expenses</span>
                  <span class="font-mono">₹${calculations.totalExpenses.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <!-- Net Result -->
            <div class="p-5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <div class="text-xs uppercase font-bold text-emerald-400">Pre-Revenue Net Development Position</div>
                <div class="text-xs text-zinc-400 mt-0.5">Capital retained in business after funding development spend</div>
              </div>
              <div class="text-2xl font-extrabold text-white font-mono">
                +₹${calculations.cashBalance.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <!-- TAB 3: Cash Flow Statement -->
          <div id="tab-content-cf" class="hidden mt-6 space-y-4">
            <div class="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <h3 class="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">Statement of Cash Flows (Direct Method)</h3>
              
              <div class="space-y-2 text-xs">
                <div class="font-bold text-zinc-300">1. Cash Flow from Financing Activities:</div>
                <div class="flex justify-between pl-4 text-zinc-400">
                  <span>Initial Founders' Equity Contribution</span>
                  <span class="font-mono text-emerald-400">+₹${calculations.totalInflows.toLocaleString('en-IN')}</span>
                </div>

                <div class="font-bold text-zinc-300 pt-2">2. Cash Flow from Development Operations:</div>
                <div class="flex justify-between pl-4 text-zinc-400">
                  <span>Cash Outflows for Prototyping, Legal & IT</span>
                  <span class="font-mono text-rose-400">-₹${calculations.totalExpenses.toLocaleString('en-IN')}</span>
                </div>

                <div class="pt-4 border-t border-zinc-800 flex justify-between font-bold text-sm text-white">
                  <span>Net Change in Cash</span>
                  <span class="font-mono text-emerald-400">+₹${calculations.cashBalance.toLocaleString('en-IN')}</span>
                </div>
                <div class="flex justify-between font-extrabold text-sm text-teal-300">
                  <span>Ending Cash Balance at Bank</span>
                  <span class="font-mono">₹${calculations.cashBalance.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 4: Startup Ratios -->
          <div id="tab-content-ratios" class="hidden mt-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <div class="text-xs font-bold text-emerald-400 uppercase">Cash Burn Velocity</div>
                <div class="text-xl font-bold text-white mt-1">₹${calculations.weeklyBurnRate.toLocaleString('en-IN')} / week</div>
                <p class="text-[11px] text-zinc-400 mt-2">Pace at which capital is deployed towards prototyping, samples, and testing.</p>
              </div>

              <div class="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <div class="text-xs font-bold text-emerald-400 uppercase">Capital Utilization Ratio</div>
                <div class="text-xl font-bold text-white mt-1">${calculations.capitalDeployedPercent}%</div>
                <p class="text-[11px] text-zinc-400 mt-2">Percentage of total injected founder capital spent to date.</p>
              </div>

              <div class="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <div class="text-xs font-bold text-emerald-400 uppercase">Equity Balance Ratio</div>
                <div class="text-xl font-bold text-white mt-1">50.0% : 50.0%</div>
                <p class="text-[11px] text-zinc-400 mt-2">Targeted equal development ownership between Milan and Sujan.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- Add Expense & Camera Capture Modal -->
      <div id="expense-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden">
        <div class="relative w-full max-w-lg bg-zinc-900 border border-emerald-500/40 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
          <div class="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <i class="fa-solid fa-receipt"></i>
              </span>
              <h3 class="text-lg font-bold text-white">Record Expense & Proof</h3>
            </div>
            <button id="close-expense-modal" class="text-zinc-400 hover:text-white p-1">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <form id="expense-form" class="space-y-4 mt-4">
            <div>
              <label class="block text-xs font-semibold text-zinc-300 mb-1">Expense Title / Item Name</label>
              <input type="text" id="exp-title-input" placeholder="e.g. Lab Testing Assay Invoice #402" required
                class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white focus:border-emerald-500 focus:outline-none" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-zinc-300 mb-1">Amount (₹)</label>
                <input type="number" id="exp-amount-input" step="0.01" min="1" placeholder="4500" required
                  class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white focus:border-emerald-500 focus:outline-none font-mono" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-zinc-300 mb-1">Date</label>
                <input type="date" id="exp-date-input" value="${new Date().toISOString().split('T')[0]}" required
                  class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white focus:border-emerald-500 focus:outline-none" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-zinc-300 mb-1">Paid By</label>
                <select id="exp-paidby-select" class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white focus:border-emerald-500 focus:outline-none">
                  <option value="milan" ${currentUser === 'milan' ? 'selected' : ''}>Milan Jadhav</option>
                  <option value="sujan" ${currentUser === 'sujan' ? 'selected' : ''}>Sujan Akash</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
                <select id="exp-category-select" class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white focus:border-emerald-500 focus:outline-none">
                  <option value="R&D & Samples">R&D & Samples</option>
                  <option value="Testing & Certification">Testing & Certification</option>
                  <option value="Legal & Compliance">Legal & Compliance</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Software & IT">Software & IT</option>
                  <option value="Packaging & Tooling">Packaging & Tooling</option>
                  <option value="Travel & Logistics">Travel & Logistics</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-zinc-300 mb-1">Payment Method</label>
              <select id="exp-payment-method" class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white focus:border-emerald-500 focus:outline-none">
                <option value="UPI / Net Banking">UPI / Net Banking</option>
                <option value="Corporate / Personal Credit Card">Corporate / Personal Card</option>
                <option value="Bank NEFT / RTGS">Bank NEFT / RTGS</option>
                <option value="Cash / Petty Cash">Cash / Petty Cash</option>
              </select>
            </div>

            <!-- CAMERA PHOTO CAPTURE & PROOF UPLOAD FEATURE -->
            <div class="p-3.5 rounded-xl bg-zinc-950 border border-emerald-500/30 space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <i class="fa-solid fa-camera"></i> Invoice / Bill Proof Photo
                </label>
                <span class="text-[10px] text-zinc-400">Stores directly with transaction</span>
              </div>

              <!-- Camera Viewfinder Container (when live camera active) -->
              <div id="camera-viewfinder-box" class="hidden rounded-lg overflow-hidden border border-emerald-500 relative bg-black">
                <video id="camera-video-preview" autoplay playsinline class="w-full h-48 object-cover"></video>
                <canvas id="camera-snapshot-canvas" class="hidden"></canvas>
                <div class="absolute bottom-2 inset-x-0 flex justify-center gap-2">
                  <button type="button" id="btn-snap-photo" class="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-full font-bold text-xs shadow-lg flex items-center gap-1">
                    <i class="fa-solid fa-circle-dot"></i> Snap Photo
                  </button>
                  <button type="button" id="btn-cancel-camera" class="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-full text-xs">
                    Cancel
                  </button>
                </div>
              </div>

              <!-- Proof Preview & Trigger Controls -->
              <div id="proof-controls-row" class="flex items-center gap-2">
                <button type="button" id="btn-start-camera" class="flex-1 py-2 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition">
                  <i class="fa-solid fa-camera"></i> Open Camera
                </button>
                
                <label class="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition">
                  <i class="fa-solid fa-upload"></i> Upload Image
                  <input type="file" id="input-receipt-file" accept="image/*" capture="environment" class="hidden" />
                </label>
              </div>

              <!-- Attached Preview Thumbnail -->
              <div id="attached-proof-preview" class="hidden flex items-center justify-between p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                <div class="flex items-center gap-2">
                  <img id="img-proof-thumb" src="" alt="Proof Preview" class="w-12 h-12 object-cover rounded border border-emerald-400" />
                  <div class="text-[11px] text-emerald-200">
                    <div class="font-bold">Proof Attached</div>
                    <div class="text-[10px] text-zinc-400">Ready to save</div>
                  </div>
                </div>
                <button type="button" id="btn-remove-proof" class="text-rose-400 hover:text-rose-300 p-1 text-xs">
                  <i class="fa-solid fa-trash-can"></i> Remove
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-zinc-300 mb-1">Notes / Vendor Details</label>
              <textarea id="exp-notes-input" rows="2" placeholder="e.g. Paid to ChemAnalytica Labs, GST invoice included"
                class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:border-emerald-500 focus:outline-none"></textarea>
            </div>

            <div class="pt-2 flex items-center justify-end gap-3">
              <button type="button" id="btn-cancel-expense" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl text-xs font-bold shadow-lg transition">
                <i class="fa-solid fa-check"></i> Save Transaction
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Receipt Lightbox Zoom Modal -->
      <div id="receipt-lightbox" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg hidden">
        <div class="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
          <div class="w-full flex items-center justify-between pb-3 text-white">
            <h4 id="lightbox-title" class="font-bold text-sm">Invoice Proof</h4>
            <button id="close-lightbox" class="p-2 text-zinc-400 hover:text-white text-lg">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <img id="lightbox-image" src="" alt="Full invoice proof" class="max-w-full max-h-[80vh] object-contain rounded-xl border border-zinc-700 shadow-2xl" />
        </div>
      </div>
    `;
  }

  static calculateFinancials(finance) {
    const totalInflows = finance.inflows.reduce((acc, i) => acc + Number(i.amount || 0), 0);
    const totalExpenses = finance.expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
    const cashBalance = totalInflows - totalExpenses;

    const milanCapital = Number(finance.capital.milan || 0);
    const sujanCapital = Number(finance.capital.sujan || 0);

    const milanExpenses = finance.expenses
      .filter(e => e.paidBy === 'milan')
      .reduce((acc, e) => acc + Number(e.amount || 0), 0);

    const sujanExpenses = finance.expenses
      .filter(e => e.paidBy === 'sujan')
      .reduce((acc, e) => acc + Number(e.amount || 0), 0);

    // Category Totals
    const categoryTotals = {};
    finance.expenses.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount || 0);
    });

    // Burn & Runway
    // Approx based on 60 days
    const monthlyBurnRate = Math.round(totalExpenses * 0.55);
    const weeklyBurnRate = Math.round(monthlyBurnRate / 4);
    const runwayMonths = monthlyBurnRate > 0 ? (cashBalance / monthlyBurnRate).toFixed(1) : "12+";
    const capitalDeployedPercent = totalInflows > 0 ? Math.round((totalExpenses / totalInflows) * 100) : 0;

    // Equalization Settlement (50/50 balance)
    // If Milan paid more expenses, Sujan owes (Milan - Sujan)/2
    const expenseDiff = milanExpenses - sujanExpenses;
    let settlement = {
      statusLabel: "Accounts Balanced",
      headline: "Both Co-Founders are Even",
      subnote: "Out-of-pocket development expenses are exactly 50/50.",
      classes: "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
    };

    if (expenseDiff > 0) {
      const oweAmount = Math.round(expenseDiff / 2);
      settlement = {
        statusLabel: "Reimbursement Pending",
        headline: `Sujan owes Milan ₹${oweAmount.toLocaleString('en-IN')}`,
        subnote: `Milan has covered ₹${expenseDiff.toLocaleString('en-IN')} more in development expenses.`,
        classes: "bg-amber-950/60 border-amber-500/40 text-amber-300"
      };
    } else if (expenseDiff < 0) {
      const oweAmount = Math.round(Math.abs(expenseDiff) / 2);
      settlement = {
        statusLabel: "Reimbursement Pending",
        headline: `Milan owes Sujan ₹${oweAmount.toLocaleString('en-IN')}`,
        subnote: `Sujan has covered ₹${Math.abs(expenseDiff).toLocaleString('en-IN')} more in development expenses.`,
        classes: "bg-blue-950/60 border-blue-500/40 text-blue-300"
      };
    }

    return {
      totalInflows,
      totalExpenses,
      cashBalance,
      milanCapital,
      sujanCapital,
      milanExpenses,
      sujanExpenses,
      categoryTotals,
      monthlyBurnRate,
      weeklyBurnRate,
      runwayMonths,
      capitalDeployedPercent,
      settlement
    };
  }

  static initRupeeDecorations() {
    const layer = document.getElementById('rupee-particles-layer');
    if (!layer) return;

    layer.innerHTML = '';
    // Generate subtle, floating rupee symbols across the background
    const rupeeCount = 12;
    for (let i = 0; i < rupeeCount; i++) {
      const span = document.createElement('span');
      span.className = 'floating-rupee-symbol';
      span.textContent = '₹';
      span.style.left = `${Math.random() * 95}%`;
      span.style.top = `${Math.random() * 90}%`;
      span.style.animationDuration = `${12 + Math.random() * 15}s`;
      span.style.animationDelay = `${Math.random() * 6}s`;
      span.style.fontSize = `${1.2 + Math.random() * 2}rem`;
      span.style.opacity = `${0.05 + Math.random() * 0.08}`;
      layer.appendChild(span);
    }
  }

  static bindEvents() {
    // Tab Switching
    const tabs = ['tx', 'pl', 'cf', 'ratios'];
    tabs.forEach(t => {
      const btn = document.getElementById(`tab-btn-${t}`);
      const content = document.getElementById(`tab-content-${t}`);
      if (btn && content) {
        btn.onclick = () => {
          tabs.forEach(other => {
            document.getElementById(`tab-btn-${other}`)?.classList.replace('bg-emerald-500', 'bg-zinc-900');
            document.getElementById(`tab-btn-${other}`)?.classList.replace('text-zinc-950', 'text-zinc-400');
            document.getElementById(`tab-content-${other}`)?.classList.add('hidden');
          });
          btn.classList.replace('bg-zinc-900', 'bg-emerald-500');
          btn.classList.replace('text-zinc-400', 'text-zinc-950');
          content.classList.remove('hidden');
        };
      }
    });

    // Modal controls
    const modal = document.getElementById('expense-modal');
    const openBtn = document.getElementById('btn-open-expense-modal');
    const closeBtn = document.getElementById('close-expense-modal');
    const cancelBtn = document.getElementById('btn-cancel-expense');

    if (openBtn && modal) {
      openBtn.onclick = () => {
        this.resetExpenseForm();
        modal.classList.remove('hidden');
      };
    }
    if (closeBtn && modal) closeBtn.onclick = () => this.closeExpenseModal();
    if (cancelBtn && modal) cancelBtn.onclick = () => this.closeExpenseModal();

    // Camera features
    const startCamBtn = document.getElementById('btn-start-camera');
    const snapBtn = document.getElementById('btn-snap-photo');
    const cancelCamBtn = document.getElementById('btn-cancel-camera');
    const video = document.getElementById('camera-video-preview');
    const viewfinder = document.getElementById('camera-viewfinder-box');

    if (startCamBtn && video && viewfinder) {
      startCamBtn.onclick = async () => {
        try {
          this.mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 } },
            audio: false
          });
          video.srcObject = this.mediaStream;
          viewfinder.classList.remove('hidden');
          document.getElementById('proof-controls-row')?.classList.add('hidden');
        } catch (err) {
          console.warn("Camera access failed:", err);
          alert("Camera could not be opened on this device/permission. Please use the 'Upload Image' button instead.");
        }
      };
    }

    if (snapBtn && video) {
      snapBtn.onclick = () => {
        const canvas = document.getElementById('camera-snapshot-canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Compress to JPEG data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        this.setReceiptProof(dataUrl);
        this.stopCamera();
      };
    }

    if (cancelCamBtn) {
      cancelCamBtn.onclick = () => this.stopCamera();
    }

    // File input fallback
    const fileInput = document.getElementById('input-receipt-file');
    if (fileInput) {
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          this.setReceiptProof(evt.target.result);
        };
        reader.readAsDataURL(file);
      };
    }

    // Remove proof
    const removeProofBtn = document.getElementById('btn-remove-proof');
    if (removeProofBtn) {
      removeProofBtn.onclick = () => {
        this.currentReceiptImage = null;
        document.getElementById('attached-proof-preview')?.classList.add('hidden');
        document.getElementById('proof-controls-row')?.classList.remove('hidden');
      };
    }

    // Lightbox close
    const lightbox = document.getElementById('receipt-lightbox');
    const closeLightboxBtn = document.getElementById('close-lightbox');
    if (closeLightboxBtn && lightbox) {
      closeLightboxBtn.onclick = () => lightbox.classList.add('hidden');
      lightbox.onclick = (e) => {
        if (e.target === lightbox) lightbox.classList.add('hidden');
      };
    }

    // Form submit
    const form = document.getElementById('expense-form');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('exp-title-input').value.trim();
        const amount = parseFloat(document.getElementById('exp-amount-input').value);
        const date = document.getElementById('exp-date-input').value;
        const paidBy = document.getElementById('exp-paidby-select').value;
        const category = document.getElementById('exp-category-select').value;
        const paymentMethod = document.getElementById('exp-payment-method').value;
        const notes = document.getElementById('exp-notes-input').value.trim();

        if (title && !isNaN(amount)) {
          window.State.addExpense({
            title,
            amount,
            date,
            paidBy,
            category,
            paymentMethod,
            notes,
            receiptImage: this.currentReceiptImage
          });

          this.closeExpenseModal();
          this.render();
          AuthController.showToast("Expense and invoice proof recorded successfully!", "success");
        }
      };
    }
  }

  static setReceiptProof(dataUrl) {
    this.currentReceiptImage = dataUrl;
    const thumb = document.getElementById('img-proof-thumb');
    const previewBox = document.getElementById('attached-proof-preview');
    const controlsRow = document.getElementById('proof-controls-row');

    if (thumb && previewBox) {
      thumb.src = dataUrl;
      previewBox.classList.remove('hidden');
    }
    if (controlsRow) controlsRow.classList.add('hidden');
  }

  static stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    document.getElementById('camera-viewfinder-box')?.classList.add('hidden');
    document.getElementById('proof-controls-row')?.classList.remove('hidden');
  }

  static resetExpenseForm() {
    const form = document.getElementById('expense-form');
    if (form) form.reset();
    this.currentReceiptImage = null;
    this.stopCamera();
    document.getElementById('attached-proof-preview')?.classList.add('hidden');
    document.getElementById('proof-controls-row')?.classList.remove('hidden');
  }

  static closeExpenseModal() {
    this.stopCamera();
    document.getElementById('expense-modal')?.classList.add('hidden');
  }

  static openLightbox(imageUrl, title) {
    const lightbox = document.getElementById('receipt-lightbox');
    const img = document.getElementById('lightbox-image');
    const titleEl = document.getElementById('lightbox-title');
    if (lightbox && img) {
      img.src = imageUrl;
      if (titleEl) titleEl.textContent = title || "Invoice Proof";
      lightbox.classList.remove('hidden');
    }
  }

  static deleteExpense(id) {
    if (confirm("Delete this expense transaction record?")) {
      window.State.deleteExpense(id);
      this.render();
    }
  }
}

window.FinanceController = FinanceController;
