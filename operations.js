// ============================================================================
// Operations Division Controller
// Motivational Cockpit Theme, Interlinked Master Roadmap,
// 3 Subpages: (1) SKU Manager, (2) Pricing Calculator, (3) Centralized "My Work" Hub
// ============================================================================

class OperationsController {
  static currentSubpage = 'roadmap'; // 'roadmap' | 'sku' | 'pricing' | 'mywork'

  static init() {
    this.render();
  }

  static render() {
    const container = document.getElementById('operations-view');
    if (!container) return;

    const state = window.State.state;
    const currentUserKey = window.State.getCurrentUser() || 'milan';
    const currentUser = (state.auth && state.auth[currentUserKey]) || { name: 'Co-Founder', color: '#059669', avatar: 'MJ' };
    const opsRoadmap = Array.isArray(state?.roadmap) ? state.roadmap : [];
    const opsSkus = Array.isArray(state?.operations?.skus) ? state.operations.skus : [];
    const opsTodos = Array.isArray(state?.todos) ? state.todos : [];

    container.innerHTML = `
      <div class="relative max-w-7xl mx-auto space-y-6 pb-16">
        
        <!-- Header & Matte Subpage Navigation -->
        <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 text-amber-400 flex items-center justify-center text-xl font-bold shadow-sm">
              <i class="fa-solid fa-bolt"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-amber-300 border border-zinc-700">
                  Execution Velocity Hub
                </span>
                <span class="text-xs text-zinc-400 font-mono">Stage 2 / Active Execution</span>
              </div>
              <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">Operations & Production Engine</h1>
            </div>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <button onclick="window.App.navigateTo('dashboard')" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold border border-zinc-700 transition flex items-center gap-1.5">
              <i class="fa-solid fa-arrow-left"></i> Dashboard
            </button>
            <div class="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button id="ops-nav-roadmap" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${this.currentSubpage === 'roadmap' ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' : 'text-zinc-400 hover:text-white'}">
                <i class="fa-solid fa-route mr-1"></i> Master Roadmap
              </button>
              <button id="ops-nav-sku" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${this.currentSubpage === 'sku' ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' : 'text-zinc-400 hover:text-white'}">
                <i class="fa-solid fa-boxes-stacked mr-1"></i> SKU Catalog
              </button>
              <button id="ops-nav-pricing" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${this.currentSubpage === 'pricing' ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' : 'text-zinc-400 hover:text-white'}">
                <i class="fa-solid fa-calculator mr-1"></i> Pricing Model
              </button>
              <button id="ops-nav-mywork" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${this.currentSubpage === 'mywork' ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' : 'text-zinc-400 hover:text-white'}">
                <i class="fa-solid fa-list-check mr-1"></i> My Work Hub
              </button>
            </div>
          </div>
        </div>

        <!-- SUBPAGE 0: MASTER ROADMAP (Interlinked with Main Dashboard) -->
        <div id="ops-subpage-roadmap" class="${this.currentSubpage === 'roadmap' ? '' : 'hidden'} space-y-6">
          <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                  <i class="fa-solid fa-flag-checkered text-amber-400"></i> Master Business Roadmap
                </h2>
                <p class="text-xs text-zinc-400 mt-1">Directly controls the stage and execution pace on the Main Dashboard.</p>
              </div>
              <button id="btn-add-roadmap-stage" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5">
                <i class="fa-solid fa-plus"></i> Add Roadmap Stage
              </button>
            </div>

            <!-- Interactive Stages List -->
            <div class="space-y-4">
              ${opsRoadmap.map(stage => `
                <div class="p-5 rounded-xl border ${stage.status === 'Completed' ? 'bg-emerald-950/20 border-emerald-500/30' : stage.status === 'In Progress' ? 'bg-amber-950/20 border-amber-500/40 ring-1 ring-amber-500/30' : 'bg-zinc-950 border-zinc-800'} transition space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <span class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${stage.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : stage.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-800 text-zinc-500'}">
                        ${stage.stageNumber}
                      </span>
                      <div>
                        <h3 class="text-sm font-bold text-white">${stage.stageName}</h3>
                        <p class="text-xs text-zinc-400 mt-0.5">${stage.description}</p>
                      </div>
                    </div>

                    <div class="flex items-center gap-3 self-end sm:self-auto">
                      <div class="text-right">
                        <div class="text-[10px] text-zinc-400 uppercase font-semibold">Target Date</div>
                        <div class="text-xs font-bold text-zinc-200 font-mono">${stage.targetDate}</div>
                      </div>

                      <select onchange="OperationsController.updateStageStatus('${stage.id}', this.value)" class="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-bold text-white focus:outline-none">
                        <option value="Upcoming" ${stage.status === 'Upcoming' ? 'selected' : ''}>Upcoming</option>
                        <option value="In Progress" ${stage.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Completed" ${stage.status === 'Completed' ? 'selected' : ''}>Completed</option>
                      </select>
                    </div>
                  </div>

                  <!-- Progress Slider -->
                  <div class="flex items-center gap-3 pt-1">
                    <span class="text-[11px] text-zinc-400 w-16">Progress: <strong class="text-white">${stage.progress || 0}%</strong></span>
                    <input type="range" min="0" max="100" value="${stage.progress || 0}" 
                      onchange="OperationsController.updateStageProgress('${stage.id}', this.value)"
                      class="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                    <button onclick="OperationsController.promptEditStage('${stage.id}')" class="text-xs text-zinc-500 hover:text-amber-400 p-1" title="Edit Stage Details">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- SUBPAGE 1: SKU MANAGER -->
        <div id="ops-subpage-sku" class="${this.currentSubpage === 'sku' ? '' : 'hidden'} space-y-6">
          <div class="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <div>
              <h2 class="text-lg font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-barcode text-amber-400"></i> Stock Keeping Units (SKUs)
              </h2>
              <p class="text-xs text-zinc-400">Manage formulations, prototype specifications, and bill of materials.</p>
            </div>
            <button id="btn-toggle-add-sku" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5">
              <i class="fa-solid fa-plus"></i> Add New SKU
            </button>
          </div>

          <!-- Add SKU Panel -->
          <div id="add-sku-panel" class="hidden p-5 rounded-2xl bg-zinc-900 border border-amber-500/40 space-y-4">
            <h3 class="text-sm font-bold text-white">Create New SKU Specification</h3>
            <form id="form-new-sku" class="space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label class="block text-[11px] font-semibold text-zinc-400 mb-1">SKU Code</label>
                  <input type="text" id="sku-code-input" placeholder="e.g. SKU-A1-003" required
                    class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-[11px] font-semibold text-zinc-400 mb-1">Product / Service Name</label>
                  <input type="text" id="sku-name-input" placeholder="e.g. Focus Booster Drops 30ml" required
                    class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label class="block text-[11px] font-semibold text-zinc-400 mb-1">Category</label>
                  <input type="text" id="sku-category-input" placeholder="e.g. Daily Wellness" required
                    class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-zinc-400 mb-1">Unit of Measure</label>
                  <input type="text" id="sku-unit-input" placeholder="e.g. Bottle, Box, Pack" required
                    class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-zinc-400 mb-1">Prototype Status</label>
                  <select id="sku-status-input" class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none">
                    <option value="R&D Testing">R&D Testing</option>
                    <option value="Prototype Final" selected>Prototype Final</option>
                    <option value="Production Ready">Production Ready</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-zinc-400 mb-1">Description & Ingredients</label>
                <textarea id="sku-desc-input" rows="2" placeholder="Key formulation, ingredients, batch specs..." required
                  class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none"></textarea>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-zinc-400 mb-1">Packaging Specifications</label>
                <input type="text" id="sku-specs-input" placeholder="e.g. Amber glass dropper, child-lock cap, mono-carton" required
                  class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none" />
              </div>

              <div class="flex justify-end gap-2 pt-2">
                <button type="button" id="btn-cancel-sku" class="px-3 py-1.5 text-xs text-zinc-400">Cancel</button>
                <button type="submit" class="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 font-bold text-xs rounded-xl shadow-sm">Save SKU</button>
              </div>
            </form>
          </div>

          <!-- SKU Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${opsSkus.length === 0 ? `<div class="col-span-full p-8 text-center text-xs text-zinc-500 bg-zinc-900/50 rounded-xl border border-zinc-800">No SKUs added yet. Click "Add New SKU" above.</div>` : ''}
            ${opsSkus.map(sku => `
              <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 transition shadow-xl space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold font-mono px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    ${sku.code}
                  </span>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                      ${sku.status}
                    </span>
                    <button onclick="OperationsController.deleteSku('${sku.id}')" class="text-zinc-500 hover:text-rose-400 p-1">
                      <i class="fa-regular fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 class="text-base font-bold text-white">${sku.name}</h3>
                  <div class="text-[11px] text-amber-400 font-semibold mt-0.5">${sku.category} (${sku.unit})</div>
                  <p class="text-xs text-zinc-400 mt-2 leading-relaxed">${sku.description}</p>
                </div>

                <div class="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1 text-xs">
                  <div class="text-[10px] text-zinc-500 uppercase font-semibold">Packaging Specs:</div>
                  <div class="text-zinc-300 font-mono text-[11px]">${sku.specs}</div>
                </div>

                <div class="pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <div>
                    <span class="text-[10px] text-zinc-400">Target Retail:</span>
                    <strong class="text-sm text-white font-mono ml-1">₹${sku.retailPrice || 'TBD'}</strong>
                  </div>
                  <button onclick="OperationsController.openPricingForSku('${sku.id}')" class="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    <i class="fa-solid fa-calculator"></i> Calculate Pricing
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- SUBPAGE 2: PRICING CALCULATOR -->
        <div id="ops-subpage-pricing" class="${this.currentSubpage === 'pricing' ? '' : 'hidden'} space-y-6">
          <div class="p-6 rounded-2xl bg-zinc-900 border border-amber-500/40 shadow-2xl space-y-6">
            <div>
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-calculator text-amber-400"></i> Unit Economics & Pricing Model
              </h2>
              <p class="text-xs text-zinc-400 mt-1">Determine exact unit cost, target profit margin %, retail MSRP, and wholesale tier.</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Inputs Column (2 Cols) -->
              <div class="lg:col-span-2 space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-zinc-300 mb-1">Select SKU to Price</label>
                  <select id="pricing-sku-select" onchange="OperationsController.loadSkuPricing(this.value)" class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none">
                    ${opsSkus.length === 0 ? `<option value="">No SKUs available</option>` : opsSkus.map(s => `<option value="${s.id}">${s.code} - ${s.name}</option>`).join('')}
                  </select>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-zinc-300 mb-1">Raw Material / Active Ingredients (₹)</label>
                    <input type="number" id="calc-cogs" value="68.50" step="0.5" oninput="OperationsController.recalculatePricing()"
                      class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white font-mono" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-zinc-300 mb-1">Development / R&D Cost Allocation (₹)</label>
                    <input type="number" id="calc-dev" value="14.20" step="0.5" oninput="OperationsController.recalculatePricing()"
                      class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white font-mono" />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-zinc-300 mb-1">Bottle, Cap & Outer Packaging (₹)</label>
                    <input type="number" id="calc-packaging" value="22.00" step="0.5" oninput="OperationsController.recalculatePricing()"
                      class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white font-mono" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-zinc-300 mb-1">Freight, Warehousing & Fulfillment (₹)</label>
                    <input type="number" id="calc-freight" value="12.00" step="0.5" oninput="OperationsController.recalculatePricing()"
                      class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white font-mono" />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-zinc-300 mb-1">Target Gross Margin (%)</label>
                    <input type="number" id="calc-margin" value="65" min="10" max="95" oninput="OperationsController.recalculatePricing()"
                      class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white font-mono" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-zinc-300 mb-1">GST / Indirect Tax (%)</label>
                    <input type="number" id="calc-tax" value="18" oninput="OperationsController.recalculatePricing()"
                      class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white font-mono" />
                  </div>
                </div>
              </div>

              <!-- Computed Results Column (1 Col) -->
              <div class="p-6 rounded-2xl bg-zinc-950 border border-amber-500/40 flex flex-col justify-between space-y-4">
                <div>
                  <span class="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Unit Economics Summary</span>
                  <div class="mt-4 space-y-3 text-xs">
                    <div class="flex justify-between py-1 border-b border-zinc-800">
                      <span class="text-zinc-400">Total Landed Cost:</span>
                      <span id="res-landed-cost" class="font-bold text-white font-mono">₹116.70</span>
                    </div>
                    <div class="flex justify-between py-1 border-b border-zinc-800">
                      <span class="text-zinc-400">Gross Margin Amount:</span>
                      <span id="res-margin-amt" class="font-bold text-emerald-400 font-mono">₹216.73</span>
                    </div>
                    <div class="flex justify-between py-1 border-b border-zinc-800">
                      <span class="text-zinc-400">Suggested Retail (B2C):</span>
                      <span id="res-retail-price" class="font-extrabold text-base text-amber-300 font-mono">₹349.00</span>
                    </div>
                    <div class="flex justify-between py-1">
                      <span class="text-zinc-400">Wholesale / B2B Price:</span>
                      <span id="res-wholesale-price" class="font-bold text-blue-300 font-mono">₹199.00</span>
                    </div>
                  </div>
                </div>

                <button onclick="OperationsController.saveCurrentPricing()" class="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 font-bold rounded-xl text-xs shadow-sm transition">
                  <i class="fa-solid fa-check mr-1"></i> Lock Pricing to SKU
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- SUBPAGE 3: MY WORK HUB (Centralized Unified Task Aggregator) -->
        <div id="ops-subpage-mywork" class="${this.currentSubpage === 'mywork' ? '' : 'hidden'} space-y-6">
          <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                  <i class="fa-solid fa-list-check text-amber-400"></i> Unified "My Work" Command Board
                </h2>
                <p class="text-xs text-zinc-400 mt-1">Interlinked with the entire dashboard: derives tasks from Roadmap, Marketing, Legal, and Finance.</p>
              </div>

              <!-- Quick Task Add -->
              <button onclick="OperationsController.promptQuickTask()" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5">
                <i class="fa-solid fa-plus"></i> Add Instant Work Item
              </button>
            </div>

            <!-- Filter Tabs -->
            <div class="flex items-center gap-2 pb-2">
              <span class="text-xs text-zinc-400 uppercase font-semibold">Filter:</span>
              <button onclick="OperationsController.renderMyWork('all')" class="px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-700 text-white border border-zinc-600">
                All Tasks (${opsTodos.length})
              </button>
              <button onclick="OperationsController.renderMyWork('${currentUserKey}')" class="px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
                My Responsibilities (${opsTodos.filter(t => t.assignedTo === currentUserKey).length})
              </button>
              <button onclick="OperationsController.renderMyWork('team')" class="px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
                Team Tasks (${opsTodos.filter(t => t.assignedTo === 'team').length})
              </button>
            </div>

            <!-- Unified Tasks List -->
            <div id="unified-tasks-container" class="space-y-3">
              ${this.renderUnifiedTasksList('all')}
            </div>
          </div>
        </div>

      </div>
    `;

    this.bindEvents();
    if (this.currentSubpage === 'pricing') {
      this.recalculatePricing();
    }
  }

  static renderUnifiedTasksList(filter = 'all') {
    const state = window.State.state;
    let list = Array.isArray(state?.todos) ? state.todos : [];
    if (filter !== 'all') {
      list = list.filter(t => t.assignedTo === filter);
    }

    if (list.length === 0) {
      return `<div class="p-8 text-center text-xs text-zinc-500">No tasks match this filter.</div>`;
    }

    return list.map(t => `
      <div class="p-3.5 rounded-xl border ${t.completed ? 'bg-zinc-950/40 border-zinc-800 opacity-60' : 'bg-zinc-950 border-zinc-800'} flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="OperationsController.toggleTask('${t.id}')"
            class="h-4 w-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 cursor-pointer" />
          <div class="min-w-0">
            <p class="text-xs font-bold ${t.completed ? 'line-through text-zinc-500' : 'text-zinc-200'} truncate">
              ${t.text}
            </p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${t.assignedTo === 'milan' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : t.assignedTo === 'sujan' ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-indigo-950 text-indigo-300 border border-indigo-800'}">
                ${t.assignedTo === 'milan' ? 'Milan' : t.assignedTo === 'sujan' ? 'Sujan' : 'Team'}
              </span>
              <span class="text-[10px] text-zinc-400">${t.category}</span>
              <span class="text-[10px] text-zinc-500">Due: ${t.dueDate || 'TBD'}</span>
            </div>
          </div>
        </div>

        <button onclick="OperationsController.deleteTask('${t.id}')" class="text-zinc-600 hover:text-rose-400 p-1">
          <i class="fa-regular fa-trash-can text-xs"></i>
        </button>
      </div>
    `).join('');
  }

  static renderMyWork(filter) {
    const container = document.getElementById('unified-tasks-container');
    if (container) {
      container.innerHTML = this.renderUnifiedTasksList(filter);
    }
  }

  static toggleTask(id) {
    window.State.toggleTodo(id);
    this.render();
  }

  static deleteTask(id) {
    if (confirm("Delete task?")) {
      window.State.deleteTodo(id);
      this.render();
    }
  }

  static promptQuickTask() {
    const text = prompt("Enter new task description:");
    if (text && text.trim()) {
      window.State.addTodo({
        text: text.trim(),
        assignedTo: window.State.getCurrentUser() || 'milan',
        priority: 'high',
        category: 'Operations',
        dueDate: new Date(Date.now() + 5*86400000).toISOString().split('T')[0]
      });
      this.render();
    }
  }

  static updateStageStatus(stageId, newStatus) {
    window.State.updateRoadmapStage(stageId, { status: newStatus });
    AuthController.showToast("Roadmap stage status updated & synced to Main Dashboard!", 'success');
  }

  static updateStageProgress(stageId, progressVal) {
    window.State.updateRoadmapStage(stageId, { progress: parseInt(progressVal) });
  }

  static promptEditStage(stageId) {
    const stage = window.State.state.roadmap.find(s => s.id === stageId);
    if (!stage) return;
    const name = prompt("Edit Stage Name:", stage.stageName);
    const date = prompt("Edit Target Deadline (YYYY-MM-DD):", stage.targetDate);
    if (name && date) {
      window.State.updateRoadmapStage(stageId, { stageName: name, targetDate: date });
      this.render();
    }
  }

  static deleteSku(id) {
    if (confirm("Delete this SKU from catalog?")) {
      window.State.deleteSku(id);
      this.render();
    }
  }

  static openPricingForSku(skuId) {
    this.currentSubpage = 'pricing';
    this.render();
    const select = document.getElementById('pricing-sku-select');
    if (select) {
      select.value = skuId;
      this.loadSkuPricing(skuId);
    }
  }

  static loadSkuPricing(skuId) {
    const skus = Array.isArray(window.State.state?.operations?.skus) ? window.State.state.operations.skus : [];
    const sku = skus.find(s => s.id === skuId);
    if (!sku) return;

    if (document.getElementById('calc-cogs')) document.getElementById('calc-cogs').value = sku.cogs || 60;
    if (document.getElementById('calc-dev')) document.getElementById('calc-dev').value = sku.devCost || 10;
    if (document.getElementById('calc-packaging')) document.getElementById('calc-packaging').value = sku.packagingCost || 20;
    if (document.getElementById('calc-freight')) document.getElementById('calc-freight').value = sku.freightCost || 10;
    if (document.getElementById('calc-margin')) document.getElementById('calc-margin').value = sku.marginPercent || 65;
    if (document.getElementById('calc-tax')) document.getElementById('calc-tax').value = sku.taxPercent || 18;

    this.recalculatePricing();
  }

  static recalculatePricing() {
    const cogs = parseFloat(document.getElementById('calc-cogs')?.value || 0);
    const dev = parseFloat(document.getElementById('calc-dev')?.value || 0);
    const packaging = parseFloat(document.getElementById('calc-packaging')?.value || 0);
    const freight = parseFloat(document.getElementById('calc-freight')?.value || 0);
    const margin = parseFloat(document.getElementById('calc-margin')?.value || 60);
    const tax = parseFloat(document.getElementById('calc-tax')?.value || 18);

    const landedCost = cogs + dev + packaging + freight;
    // Price = Landed / (1 - margin/100)
    const marginFactor = Math.max(0.1, 1 - (margin / 100));
    const preTaxRetail = landedCost / marginFactor;
    const finalRetail = Math.round(preTaxRetail * (1 + (tax / 100)));
    const wholesale = Math.round(landedCost * 1.7);
    const marginAmt = finalRetail - landedCost;

    const landedEl = document.getElementById('res-landed-cost');
    const marginAmtEl = document.getElementById('res-margin-amt');
    const retailEl = document.getElementById('res-retail-price');
    const wholesaleEl = document.getElementById('res-wholesale-price');

    if (landedEl) landedEl.textContent = `₹${landedCost.toFixed(2)}`;
    if (marginAmtEl) marginAmtEl.textContent = `₹${marginAmt.toFixed(2)}`;
    if (retailEl) retailEl.textContent = `₹${finalRetail.toFixed(2)}`;
    if (wholesaleEl) wholesaleEl.textContent = `₹${wholesale.toFixed(2)}`;
  }

  static saveCurrentPricing() {
    const skuId = document.getElementById('pricing-sku-select')?.value;
    const skus = Array.isArray(window.State.state?.operations?.skus) ? window.State.state.operations.skus : [];
    const sku = skus.find(s => s.id === skuId);
    if (!sku) return;

    const retail = parseFloat(document.getElementById('res-retail-price')?.textContent.replace('₹', '') || 0);
    const wholesale = parseFloat(document.getElementById('res-wholesale-price')?.textContent.replace('₹', '') || 0);

    window.State.updateSku(skuId, {
      cogs: parseFloat(document.getElementById('calc-cogs')?.value || 0),
      devCost: parseFloat(document.getElementById('calc-dev')?.value || 0),
      packagingCost: parseFloat(document.getElementById('calc-packaging')?.value || 0),
      freightCost: parseFloat(document.getElementById('calc-freight')?.value || 0),
      marginPercent: parseFloat(document.getElementById('calc-margin')?.value || 65),
      taxPercent: parseFloat(document.getElementById('calc-tax')?.value || 18),
      retailPrice: retail,
      wholesalePrice: wholesale
    });

    AuthController.showToast(`Pricing locked for ${sku.code}! Retail: ₹${retail}`, 'success');
  }

  static bindEvents() {
    // Subpage switcher
    ['roadmap', 'sku', 'pricing', 'mywork'].forEach(sub => {
      const btn = document.getElementById(`ops-nav-${sub}`);
      if (btn) {
        btn.onclick = () => {
          this.currentSubpage = sub;
          this.render();
        };
      }
    });

    // Add Roadmap Stage
    const addStageBtn = document.getElementById('btn-add-roadmap-stage');
    if (addStageBtn) {
      addStageBtn.onclick = () => {
        const name = prompt("Enter Roadmap Stage Name:");
        const desc = prompt("Enter Description:");
        const targetDate = prompt("Enter Target Date (YYYY-MM-DD):", "2026-12-15");
        if (name && targetDate) {
          window.State.addRoadmapStage({
            stageName: name,
            description: desc || "Operational milestone",
            targetDate: targetDate
          });
          this.render();
          AuthController.showToast("Roadmap stage added!", "success");
        }
      };
    }

    // Toggle Add SKU
    const toggleSkuBtn = document.getElementById('btn-toggle-add-sku');
    const skuPanel = document.getElementById('add-sku-panel');
    const cancelSkuBtn = document.getElementById('btn-cancel-sku');

    if (toggleSkuBtn && skuPanel) {
      toggleSkuBtn.onclick = () => skuPanel.classList.toggle('hidden');
    }
    if (cancelSkuBtn && skuPanel) {
      cancelSkuBtn.onclick = () => skuPanel.classList.add('hidden');
    }

    // SKU form submit
    const skuForm = document.getElementById('form-new-sku');
    if (skuForm) {
      skuForm.onsubmit = (e) => {
        e.preventDefault();
        const code = document.getElementById('sku-code-input').value.trim();
        const name = document.getElementById('sku-name-input').value.trim();
        const category = document.getElementById('sku-category-input').value.trim();
        const unit = document.getElementById('sku-unit-input').value.trim();
        const status = document.getElementById('sku-status-input').value;
        const description = document.getElementById('sku-desc-input').value.trim();
        const specs = document.getElementById('sku-specs-input').value.trim();

        if (code && name) {
          window.State.addSku({
            code, name, category, unit, status, description, specs,
            retailPrice: 299, wholesalePrice: 159
          });
          this.render();
          AuthController.showToast("SKU saved successfully!", 'success');
        }
      };
    }
  }
}

window.OperationsController = OperationsController;
