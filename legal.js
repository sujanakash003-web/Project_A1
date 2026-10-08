// ============================================================================
// Legal Division Controller
// Classic Legal Document / Parchment Theme, Certified Seals & Stamped Badges,
// Multi-Stage Roadmap Tracker for Licenses, Testings, Reports & Founder Agreements
// ============================================================================

class LegalController {
  static init() {
    this.render();
  }

  static render() {
    const container = document.getElementById('legal-view');
    if (!container) return;

    const state = window.State.state;
    const documents = Array.isArray(state?.legal?.documents) ? state.legal.documents : [];

    container.innerHTML = `
      <div class="relative max-w-7xl mx-auto space-y-8 pb-16 legal-parchment-root">
        
        <!-- Header in Formal Legal Charter Style -->
        <div class="p-8 rounded-2xl bg-[#faf7ee] text-stone-900 border-2 border-[#d4af37]/60 shadow-2xl relative overflow-hidden">
          <!-- Subtle watermark seal in background -->
          <div class="absolute -right-12 -bottom-12 text-9xl text-stone-300/30 font-serif select-none pointer-events-none">
            §
          </div>

          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-2 border-stone-300">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2.5 py-0.5 rounded text-[11px] font-serif font-bold uppercase tracking-widest bg-stone-200 text-stone-800 border border-stone-400">
                  Official Statutory Ledger
                </span>
                <span class="text-xs font-serif text-stone-600">Article IV • Compliance & Certification</span>
              </div>
              <h1 class="text-3xl md:text-4xl font-serif font-black tracking-tight text-stone-900">
                Statutory Licenses, Lab Testings & Compliance Registry
              </h1>
              <p class="text-xs font-serif text-stone-600 mt-1 max-w-2xl">
                Master legal docket for Milan Jadhav & Sujan Akash. Tracking corporate standing, intellectual property, accredited laboratory assays, and licensing roadmaps.
              </p>
            </div>

            <div class="flex items-center gap-3">
              <button onclick="window.App.navigateTo('dashboard')" class="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-900 rounded-xl text-xs font-serif font-bold border border-stone-400 transition flex items-center gap-1.5 shadow-sm">
                <i class="fa-solid fa-arrow-left"></i> Dashboard
              </button>
              <button id="btn-add-legal-doc" class="px-5 py-2.5 bg-[#8b0000] hover:bg-[#a00000] text-amber-50 rounded-xl text-xs font-serif font-bold tracking-wider shadow-lg transition flex items-center gap-2">
                <i class="fa-solid fa-stamp"></i> Add License / Testing Docket
              </button>
            </div>
          </div>

          <!-- Document Counters -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div class="p-3 rounded-lg bg-stone-100 border border-stone-300 text-center">
              <div class="text-[10px] uppercase font-serif font-bold text-stone-500">Total Statutory Dockets</div>
              <div class="text-2xl font-serif font-bold text-stone-900 mt-0.5">${documents.length}</div>
            </div>
            <div class="p-3 rounded-lg bg-stone-100 border border-stone-300 text-center">
              <div class="text-[10px] uppercase font-serif font-bold text-stone-500">Cleared & Certified</div>
              <div class="text-2xl font-serif font-bold text-emerald-800 mt-0.5">${documents.filter(d => d.status === 'Active').length}</div>
            </div>
            <div class="p-3 rounded-lg bg-stone-100 border border-stone-300 text-center">
              <div class="text-[10px] uppercase font-serif font-bold text-stone-500">Under Review / Audit</div>
              <div class="text-2xl font-serif font-bold text-amber-800 mt-0.5">${documents.filter(d => d.status === 'Review').length}</div>
            </div>
            <div class="p-3 rounded-lg bg-stone-100 border border-stone-300 text-center">
              <div class="text-[10px] uppercase font-serif font-bold text-stone-500">Pending Filing / Action</div>
              <div class="text-2xl font-serif font-bold text-rose-800 mt-0.5">${documents.filter(d => d.status === 'Pending').length}</div>
            </div>
          </div>
        </div>

        <!-- Add Docket Modal / Panel -->
        <div id="add-legal-panel" class="hidden p-6 rounded-2xl bg-[#faf7ee] text-stone-900 border-2 border-stone-400 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-stone-300">
            <h3 class="text-base font-serif font-bold flex items-center gap-2">
              <i class="fa-solid fa-file-contract text-[#8b0000]"></i> Create Statutory Compliance Entry
            </h3>
            <button id="btn-cancel-legal" class="text-stone-500 hover:text-stone-800 p-1">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form id="form-new-legal" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-2">
                <label class="block text-xs font-serif font-bold text-stone-700 mb-1">Document / License Title</label>
                <input type="text" id="leg-title-input" placeholder="e.g. FSSAI Central Manufacturer License" required
                  class="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-[#8b0000]" />
              </div>
              <div>
                <label class="block text-xs font-serif font-bold text-stone-700 mb-1">Docket Type</label>
                <select id="leg-type-select" class="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none">
                  <option value="License">Operating License</option>
                  <option value="Testing">Laboratory Assay / Testing</option>
                  <option value="Report">Audit & Inspection Report</option>
                  <option value="Agreement">Founders & Legal Agreement</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-serif font-bold text-stone-700 mb-1">Regulatory Authority / Agency</label>
                <input type="text" id="leg-authority-input" placeholder="e.g. FSSAI / NABL Lab / IP India" required
                  class="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-serif font-bold text-stone-700 mb-1">Filing / Initiated Date</label>
                <input type="date" id="leg-filing-input" value="${new Date().toISOString().split('T')[0]}" required
                  class="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-serif font-bold text-stone-700 mb-1">Validity / Expiry Horizon</label>
                <input type="text" id="leg-expiry-input" placeholder="e.g. 1 Year / 10 Years / Batch Validated" required
                  class="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-serif font-bold text-stone-700 mb-1">Notes & Reference Numbers</label>
              <textarea id="leg-notes-input" rows="2" placeholder="Application number, testing parameters, lawyer notes..."
                class="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" id="btn-close-legal-form" class="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg text-xs font-serif font-bold">Cancel</button>
              <button type="submit" class="px-5 py-2 bg-[#8b0000] text-amber-50 rounded-lg text-xs font-serif font-bold shadow">
                Execute & Archive
              </button>
            </div>
          </form>
        </div>

        <!-- Dockets List with Stage Roadmaps -->
        <div class="space-y-6">
          ${documents.length === 0 ? '<div class="p-8 text-center text-xs text-stone-500 bg-stone-100 rounded-xl">No legal dockets registered yet.</div>' : documents.map(doc => this.renderLegalDocketCard(doc)).join('')}
        </div>

      </div>
    `;

    this.bindEvents();
  }

  static renderLegalDocketCard(doc) {
    const stages = Array.isArray(doc.stages) ? doc.stages : ["Draft Preparation", "Initial Filing", "Departmental Verification", "Compliance Clearance", "Issued"];
    const isCompleted = doc.currentStage >= stages.length;

    return `
      <div class="p-6 md:p-8 rounded-2xl bg-[#faf7ee] text-stone-900 border-2 border-stone-300 hover:border-[#d4af37] shadow-xl transition-all relative overflow-hidden">
        
        <!-- Official Seal / Stamp on Top Right -->
        <div class="absolute right-6 top-6">
          ${doc.status === 'Active' ? `
            <div class="legal-stamp stamp-approved">
              CERTIFIED CLEARED
            </div>
          ` : doc.status === 'Review' ? `
            <div class="legal-stamp stamp-review">
              UNDER EXAMINATION
            </div>
          ` : `
            <div class="legal-stamp stamp-pending">
              PENDING FILING
            </div>
          `}
        </div>

        <div class="max-w-2xl">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] uppercase font-serif font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800 border border-stone-400">
              ${doc.type}
            </span>
            <span class="text-xs font-serif text-stone-600">Jurisdiction: <strong>${doc.authority}</strong></span>
          </div>

          <h3 class="text-xl font-serif font-bold text-stone-900">${doc.title}</h3>
          
          <div class="flex items-center gap-4 text-xs font-serif text-stone-600 mt-2">
            <span>Filing Date: <strong class="text-stone-900">${doc.filingDate}</strong></span>
            <span>•</span>
            <span>Validity: <strong class="text-stone-900">${doc.expiryDate}</strong></span>
          </div>

          ${doc.notes ? `
            <p class="text-xs font-serif text-stone-700 bg-stone-100 p-2.5 rounded-lg border border-stone-300 mt-3 leading-relaxed">
              <i class="fa-solid fa-quote-left text-stone-400 mr-1"></i> ${doc.notes}
            </p>
          ` : ''}
        </div>

        <!-- Multi-Stage Horizontal Compliance Roadmap -->
        <div class="mt-8 pt-6 border-t border-stone-300">
          <div class="flex items-center justify-between text-xs font-serif mb-3">
            <span class="font-bold text-stone-800 uppercase tracking-wider">
              Statutory Stage Roadmap: <span class="text-[#8b0000]">Stage ${doc.currentStage} of ${stages.length}</span>
            </span>
            <span class="text-stone-500 text-[11px]">Click any stage circle to advance or regress milestone</span>
          </div>

          <!-- Stepper Nodes -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
            ${stages.map((stageName, sIdx) => {
              const stageNum = sIdx + 1;
              const isPast = stageNum < doc.currentStage;
              const isCurrent = stageNum === doc.currentStage;

              return `
                <div onclick="LegalController.advanceStage('${doc.id}', ${stageNum})" 
                  class="cursor-pointer p-3 rounded-xl border-2 transition text-center flex flex-col justify-between ${
                    isCurrent 
                      ? 'bg-amber-100 border-[#8b0000] shadow-md ring-2 ring-amber-300' 
                      : isPast 
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900' 
                      : 'bg-stone-100 border-stone-300 text-stone-400'
                  }">
                  <div class="flex items-center justify-center gap-1 text-[10px] font-serif font-bold uppercase mb-1">
                    <span>Stage ${stageNum}</span>
                    <i class="fa-solid ${isPast ? 'fa-check text-emerald-700' : isCurrent ? 'fa-circle-dot text-[#8b0000]' : 'fa-circle text-stone-300'}"></i>
                  </div>
                  <div class="text-[11px] font-serif font-semibold text-stone-900 leading-snug">
                    ${stageName}
                  </div>
                  <div class="text-[9px] font-serif text-stone-500 mt-2">
                    ${isCurrent ? '● Active Step' : isPast ? '✓ Completed' : 'Pending'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Bottom Controls -->
        <div class="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
          <div class="text-[11px] font-serif text-stone-500">
            Docket ID: <span class="font-mono text-stone-700">${doc.id}</span>
          </div>
          <button onclick="LegalController.deleteDocket('${doc.id}')" class="text-xs font-serif text-rose-800 hover:text-rose-950 flex items-center gap-1">
            <i class="fa-solid fa-trash-can"></i> Expunge Docket
          </button>
        </div>

      </div>
    `;
  }

  static advanceStage(docId, stageNum) {
    window.State.updateLegalStage(docId, stageNum);
    this.render();
    AuthController.showToast(`Statutory stage updated to Stage ${stageNum}`, 'info');
  }

  static deleteDocket(docId) {
    if (confirm("Are you sure you want to expunge this legal docket?")) {
      window.State.deleteLegalDocument(docId);
      this.render();
    }
  }

  static bindEvents() {
    const addBtn = document.getElementById('btn-add-legal-doc');
    const panel = document.getElementById('add-legal-panel');
    const cancelBtn = document.getElementById('btn-cancel-legal');
    const closeBtn = document.getElementById('btn-close-legal-form');

    if (addBtn && panel) {
      addBtn.onclick = () => panel.classList.toggle('hidden');
    }
    if (cancelBtn && panel) cancelBtn.onclick = () => panel.classList.add('hidden');
    if (closeBtn && panel) closeBtn.onclick = () => panel.classList.add('hidden');

    const form = document.getElementById('form-new-legal');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('leg-title-input').value.trim();
        const type = document.getElementById('leg-type-select').value;
        const authority = document.getElementById('leg-authority-input').value.trim();
        const filingDate = document.getElementById('leg-filing-input').value;
        const expiryDate = document.getElementById('leg-expiry-input').value.trim();
        const notes = document.getElementById('leg-notes-input').value.trim();

        if (title && authority) {
          window.State.addLegalDocument({
            title, type, authority, filingDate, expiryDate, notes
          });
          panel.classList.add('hidden');
          form.reset();
          this.render();
          AuthController.showToast("Legal docket registered successfully!", 'success');
        }
      };
    }
  }
}

window.LegalController = LegalController;
