// ============================================================================
// Marketing Division Controller
// Modern 3D Look, Idea Dump with Folders & Triage (Bin/Doubtful/Implementation),
// Brainstorming Fun Collaborative Canvas & Live Emoji Chat, Implementation Roadmaps, Other Ideas
// ============================================================================

class MarketingController {
  static currentSubpage = 'dump'; // 'dump' | 'brainstorm' | 'implementation' | 'other'
  static activeFolder = 'ALL';
  static canvas = null;
  static ctx = null;
  static isDrawing = false;
  static currentColor = '#ec4899';
  static currentLineWidth = 4;
  static isEraser = false;

  static init() {
    this.render();
  }

  static render() {
    const container = document.getElementById('marketing-view');
    if (!container) return;

    const state = window.State.state;
    const currentUser = window.State.getCurrentUser() || 'milan';
    const currentUserData = (state.auth && state.auth[currentUser]) || { name: 'Co-Founder', color: '#059669', avatar: 'MJ' };
    const mktIdeas = Array.isArray(state.marketing?.ideas) ? state.marketing.ideas : [];
    const mktFolders = Array.isArray(state.marketing?.folders) ? state.marketing.folders : [];
    const mktOther = Array.isArray(state.marketing?.otherIdeas) ? state.marketing.otherIdeas : [];
    const mktChat = Array.isArray(state.marketing?.chatMessages) ? state.marketing.chatMessages : [];

    container.innerHTML = `
      <div class="relative max-w-7xl mx-auto space-y-6 pb-16">
        
        <!-- Header & Matte Subpage Navigation -->
        <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 text-indigo-300 flex items-center justify-center text-xl shadow-sm">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-indigo-300 border border-zinc-700">
                  Growth & Brand Lab
                </span>
                <span class="text-xs text-zinc-400 font-mono">Creative Studio</span>
              </div>
              <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">Marketing & Growth Studio</h1>
            </div>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <button onclick="window.App.navigateTo('dashboard')" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold border border-zinc-700 transition flex items-center gap-1.5">
              <i class="fa-solid fa-arrow-left"></i> Dashboard
            </button>
            <div class="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button id="mkt-nav-dump" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${this.currentSubpage === 'dump' ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' : 'text-zinc-400 hover:text-white'}">
                <i class="fa-solid fa-lightbulb mr-1"></i> Idea Dump
              </button>
              <button id="mkt-nav-brainstorm" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${this.currentSubpage === 'brainstorm' ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' : 'text-zinc-400 hover:text-white'}">
                <i class="fa-solid fa-palette mr-1"></i> Brainstorming Fun
              </button>
              <button id="mkt-nav-implementation" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${this.currentSubpage === 'implementation' ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' : 'text-zinc-400 hover:text-white'}">
                <i class="fa-solid fa-rocket mr-1"></i> Implementation
              </button>
              <button id="mkt-nav-other" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${this.currentSubpage === 'other' ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' : 'text-zinc-400 hover:text-white'}">
                <i class="fa-solid fa-folder-open mr-1"></i> Other Ideas
              </button>
            </div>
          </div>
        </div>

        <!-- SUBPAGE 1: IDEA DUMP -->
        <div id="subpage-dump" class="${this.currentSubpage === 'dump' ? '' : 'hidden'} space-y-6">
          
          <!-- Folder Filter & Controls -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-1">Folders:</span>
              <button onclick="MarketingController.setFolder('ALL')" class="px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${this.activeFolder === 'ALL' ? 'bg-zinc-700 text-white border border-zinc-600' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'}">
                All Ideas (${mktIdeas.filter(i => i.status === 'dump').length})
              </button>
              ${mktFolders.map(f => `
                <div class="inline-flex items-center rounded-lg transition ${this.activeFolder === f ? 'bg-zinc-700 text-white border border-zinc-600 shadow-sm' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'}">
                  <button onclick="MarketingController.setFolder('${f}')" class="px-3 py-1 text-xs font-semibold whitespace-nowrap">
                    ${f}
                  </button>
                  <button onclick="MarketingController.promptDeleteFolder('${f}', event)" class="pr-2 pl-0.5 py-1 text-xs opacity-60 hover:opacity-100 hover:text-rose-400 transition" title="Delete folder '${f}'">
                    <i class="fa-solid fa-xmark text-[11px]"></i>
                  </button>
                </div>
              `).join('')}
              <button id="btn-add-mkt-folder" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 whitespace-nowrap transition cursor-pointer" title="Add new category folder">
                <i class="fa-solid fa-folder-plus mr-1"></i> + Folder
              </button>
            </div>

            <!-- Quick Add Idea Button -->
            <button id="btn-toggle-add-idea" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 whitespace-nowrap">
              <i class="fa-solid fa-plus"></i> Dump Raw Idea
            </button>
          </div>

          <!-- Add Idea Inline Box -->
          <div id="add-idea-panel" class="hidden p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg">
            <h3 class="text-sm font-bold text-white mb-3">Add Rough Marketing Concept</h3>
            <form id="form-new-idea" class="space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div class="md:col-span-2">
                  <input type="text" id="idea-title-input" placeholder="Idea Title (e.g. Founder unboxing wax-sealed envelope)" required
                    class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white focus:border-purple-500 focus:outline-none" />
                </div>
                <div>
                  <select id="idea-folder-select" class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white focus:border-purple-500 focus:outline-none">
                    ${mktFolders.map(f => `<option value="${f}">${f}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div>
                <textarea id="idea-desc-input" rows="2" placeholder="Rough description, target audience, crazy angles, or early thoughts..." required
                  class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:border-purple-500 focus:outline-none"></textarea>
              </div>
              <div class="flex items-center justify-end gap-2">
                <button type="button" id="btn-cancel-add-idea" class="px-3 py-1.5 text-xs text-zinc-400 hover:text-white">Cancel</button>
                <button type="submit" class="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow">
                  Save to Idea Dump
                </button>
              </div>
            </form>
          </div>

          <!-- Ideas Grid (3D Card Perspective) -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${this.renderDumpIdeas(mktIdeas)}
          </div>

          <!-- Doubtful & Bin Drawers -->
          <div class="pt-6 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Doubtful Ideas Card -->
            <div class="p-5 rounded-2xl bg-zinc-950/80 border border-amber-500/30">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <i class="fa-solid fa-circle-question"></i> Doubtful / Parking Lot Ideas
                </h3>
                <span class="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                  ${mktIdeas.filter(i => i.status === 'doubtful').length}
                </span>
              </div>
              <div class="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                ${mktIdeas.filter(i => i.status === 'doubtful').length === 0 ? `
                  <div class="text-xs text-zinc-500 py-4 text-center">No ideas currently marked as doubtful.</div>
                ` : ''}
                ${mktIdeas.filter(i => i.status === 'doubtful').map(i => `
                  <div class="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <div class="text-xs font-bold text-zinc-200 truncate">${i.title}</div>
                      <div class="text-[10px] text-zinc-400">${i.folder}</div>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <button onclick="MarketingController.moveIdea('${i.id}', 'dump')" class="px-2 py-1 text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-semibold" title="Restore to Idea Dump">
                        Restore
                      </button>
                      <button onclick="MarketingController.moveIdea('${i.id}', 'implementation')" class="px-2 py-1 text-[10px] bg-purple-900 hover:bg-purple-800 text-purple-200 rounded font-semibold" title="Advance to Implementation">
                        Implement
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Bin Ideas Card -->
            <div class="p-5 rounded-2xl bg-zinc-950/80 border border-rose-500/30">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-bold text-rose-300 flex items-center gap-2">
                  <i class="fa-solid fa-trash-can"></i> Deleted Ideas (Bin)
                </h3>
                <span class="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono">
                  ${mktIdeas.filter(i => i.status === 'bin').length}
                </span>
              </div>
              <div class="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                ${mktIdeas.filter(i => i.status === 'bin').length === 0 ? `
                  <div class="text-xs text-zinc-500 py-4 text-center">Bin is empty.</div>
                ` : ''}
                ${mktIdeas.filter(i => i.status === 'bin').map(i => `
                  <div class="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <div class="text-xs font-bold text-zinc-400 line-through truncate">${i.title}</div>
                      <div class="text-[10px] text-zinc-500">${i.folder}</div>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <button onclick="MarketingController.moveIdea('${i.id}', 'dump')" class="px-2 py-1 text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-semibold" title="Recover idea">
                        Recover
                      </button>
                      <button onclick="MarketingController.permanentlyDeleteIdea('${i.id}')" class="px-2 py-1 text-[10px] bg-rose-950 hover:bg-rose-900 text-rose-300 rounded font-semibold" title="Permanently delete">
                        Destroy
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

        </div>

        <!-- SUBPAGE 2: BRAINSTORMING FUN (Interactive Whiteboard & Emoji Chat) -->
        <div id="subpage-brainstorm" class="${this.currentSubpage === 'brainstorm' ? '' : 'hidden'} space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Collaborative Drawing Canvas (2 Cols) -->
            <div class="lg:col-span-2 p-5 rounded-2xl bg-zinc-900/90 border border-purple-500/40 shadow-2xl flex flex-col">
              <div class="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3 flex-wrap gap-2">
                <div class="flex items-center gap-2">
                  <span class="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
                    <i class="fa-solid fa-paintbrush"></i>
                  </span>
                  <div>
                    <h3 class="text-sm font-bold text-white">Co-Founder Creative Whiteboard</h3>
                    <p class="text-[10px] text-zinc-400">Sketch wireframes, logos, hooks, and packaging ideas together in real-time</p>
                  </div>
                </div>

                <!-- Canvas Tools Palette -->
                <div class="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                  <input type="color" id="canvas-color-picker" value="#ec4899" class="w-6 h-6 rounded cursor-pointer bg-transparent border-0" title="Brush color" />
                  
                  <button id="btn-brush-pen" class="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs" title="Pen tool">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button id="btn-brush-eraser" class="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs" title="Eraser">
                    <i class="fa-solid fa-eraser"></i>
                  </button>
                  
                  <select id="canvas-size-select" class="px-2 py-0.5 bg-zinc-800 text-zinc-200 rounded text-xs">
                    <option value="2">Fine</option>
                    <option value="4" selected>Normal</option>
                    <option value="8">Thick</option>
                    <option value="16">Marker</option>
                  </select>

                  <button id="btn-clear-canvas" class="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded text-xs font-semibold" title="Clear board">
                    Clear
                  </button>
                </div>
              </div>

              <!-- Canvas Surface -->
              <div class="relative w-full h-[420px] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-inner flex items-center justify-center">
                <canvas id="marketing-canvas" class="cursor-crosshair w-full h-full"></canvas>
              </div>
            </div>

            <!-- Instant Founder Chat & Emoji Reactions (1 Col) -->
            <div class="p-5 rounded-2xl bg-zinc-900/90 border border-purple-500/40 shadow-2xl flex flex-col h-[520px]">
              <div class="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div class="flex items-center gap-2">
                  <span class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <i class="fa-solid fa-comments"></i>
                  </span>
                  <h3 class="text-sm font-bold text-white">Brainstorm Chat & Reactions</h3>
                </div>
                <span class="text-[10px] text-emerald-400 font-mono">LIVE CONNECTED</span>
              </div>

              <!-- Message Stream -->
              <div id="mkt-chat-stream" class="flex-1 overflow-y-auto space-y-3 pr-1">
                ${mktChat.map(msg => `
                  <div class="p-2.5 rounded-xl ${msg.sender === currentUser ? 'bg-purple-950/50 border border-purple-500/30 ml-4' : 'bg-zinc-950 border border-zinc-800 mr-4'}">
                    <div class="flex items-center justify-between text-[10px] mb-1">
                      <span class="font-bold ${msg.sender === 'milan' ? 'text-emerald-400' : 'text-blue-400'}">
                        ${msg.sender === 'milan' ? 'Milan' : 'Sujan'}
                      </span>
                      <span class="text-zinc-500">${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p class="text-xs text-zinc-200">${msg.text}</p>
                    ${msg.emoji ? `<span class="inline-block mt-1 text-base">${msg.emoji}</span>` : ''}
                  </div>
                `).join('')}
              </div>

              <!-- Emoji Quick Reaction Bar -->
              <div class="py-2 flex items-center justify-around border-t border-zinc-800 my-2">
                ${['🔥', '🚀', '💡', '💯', '❤️', '👏', '🎯', '🎉'].map(emoji => `
                  <button onclick="MarketingController.triggerEmojiBurst('${emoji}')" class="text-xl hover:scale-125 transform transition p-1" title="React with ${emoji}">
                    ${emoji}
                  </button>
                `).join('')}
              </div>

              <!-- Message Input -->
              <form id="mkt-chat-form" class="flex items-center gap-2">
                <input type="text" id="mkt-chat-input" placeholder="Type a creative thought..." required
                  class="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white focus:border-purple-500 focus:outline-none" />
                <button type="submit" class="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow">
                  <i class="fa-solid fa-paper-plane"></i>
                </button>
              </form>
            </div>

          </div>
        </div>

        <!-- SUBPAGE 3: IMPLEMENTATION STAGE (Dedicated Roadmaps per Idea) -->
        <div id="subpage-implementation" class="${this.currentSubpage === 'implementation' ? '' : 'hidden'} space-y-6">
          <div class="flex items-center justify-between p-4 rounded-xl bg-purple-950/40 border border-purple-500/30">
            <div>
              <h2 class="text-lg font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-stairs text-purple-400"></i> Active Marketing Implementation Roadmaps
              </h2>
              <p class="text-xs text-purple-200/70">Ideas graduated from Idea Dump. Track step-by-step rollout stages with completion check-offs.</p>
            </div>
            <span class="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
              ${mktIdeas.filter(i => i.status === 'implementation').length} In Execution
            </span>
          </div>

          <div class="space-y-6">
            ${mktIdeas.filter(i => i.status === 'implementation').length === 0 ? `
              <div class="p-12 text-center rounded-2xl bg-zinc-900 border border-zinc-800">
                <i class="fa-solid fa-rocket text-3xl text-zinc-600 mb-3"></i>
                <h3 class="text-sm font-bold text-zinc-300">No campaigns in implementation stage yet</h3>
                <p class="text-xs text-zinc-500 mt-1">Go to Idea Dump and click "Move to Implementation" on any idea!</p>
              </div>
            ` : ''}

            ${mktIdeas.filter(i => i.status === 'implementation').map(idea => this.renderImplementationIdeaCard(idea)).join('')}
          </div>
        </div>

        <!-- SUBPAGE 4: OTHER IDEAS (Archive & Inspiration Board) -->
        <div id="subpage-other" class="${this.currentSubpage === 'other' ? '' : 'hidden'} space-y-6">
          <div class="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <div>
              <h2 class="text-lg font-bold text-white">Other Marketing Notes & Ideas</h2>
              <p class="text-xs text-zinc-400">Long-term references, competitor teardowns, podcast ideas, and overflow thoughts.</p>
            </div>
            <button id="btn-add-other-idea" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow">
              <i class="fa-solid fa-plus mr-1"></i> Add Note
            </button>
          </div>

          <!-- Add Other Idea Form -->
          <div id="add-other-panel" class="hidden p-5 rounded-xl bg-zinc-900 border border-zinc-700 space-y-3">
            <form id="form-other-idea" class="space-y-3">
              <input type="text" id="other-title-input" placeholder="Note or Campaign Inspiration Title" required
                class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none" />
              <textarea id="other-notes-input" rows="2" placeholder="Details, links, or takeaways..." required
                class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none"></textarea>
              <input type="text" id="other-tags-input" placeholder="Tags (comma-separated, e.g. PR, Campus, Viral)"
                class="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none" />
              <div class="flex justify-end gap-2">
                <button type="button" id="btn-cancel-other" class="px-3 py-1.5 text-xs text-zinc-400">Cancel</button>
                <button type="submit" class="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg">Save</button>
              </div>
            </form>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${(state.marketing.otherIdeas || []).map(item => `
              <div class="p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between shadow-lg">
                <div>
                  <div class="flex items-center justify-between text-[11px] text-zinc-500 mb-2">
                    <span>${item.date}</span>
                    <button onclick="MarketingController.deleteOtherIdea('${item.id}')" class="text-zinc-600 hover:text-rose-400 p-1" title="Delete note">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                  <h4 class="text-sm font-bold text-white mb-1.5">${item.title}</h4>
                  <p class="text-xs text-zinc-300 leading-relaxed">${item.notes}</p>
                </div>
                <div class="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                  <div class="flex flex-wrap gap-1.5">
                    ${(item.tags || []).map(t => `
                      <span class="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-purple-300 font-medium">#${t}</span>
                    `).join('')}
                  </div>
                  <button onclick="MarketingController.moveOtherIdeaToImplementation('${item.id}')" 
                    class="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-[11px] font-bold shadow-sm flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer"
                    title="Move this idea to the Implementation stage">
                    <i class="fa-solid fa-rocket text-[10px] text-indigo-400"></i> Move to Implementation
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    this.bindEvents();
    if (this.currentSubpage === 'brainstorm') {
      this.initWhiteboard();
    }
  }

  static renderDumpIdeas(ideas) {
    let filtered = ideas.filter(i => i.status === 'dump');
    if (this.activeFolder !== 'ALL') {
      filtered = filtered.filter(i => i.folder === this.activeFolder);
    }

    if (filtered.length === 0) {
      return `
        <div class="col-span-full p-12 text-center rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <i class="fa-solid fa-lightbulb text-3xl text-zinc-600 mb-2"></i>
          <h3 class="text-sm font-bold text-zinc-300">No ideas in this folder</h3>
          <p class="text-xs text-zinc-500 mt-1">Click "Dump Raw Idea" above to jot down a new marketing concept!</p>
        </div>
      `;
    }

    return filtered.map(idea => `
      <!-- Tactile Matte Idea Card -->
      <div class="group p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 shadow-sm transition-all duration-200 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              ${idea.folder}
            </span>
            <span class="text-[10px] text-zinc-500 font-mono">
              ${new Date(idea.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h3 class="text-sm font-bold text-white group-hover:text-zinc-200 transition leading-snug">
            ${idea.title}
          </h3>

          <p class="text-xs text-zinc-400 mt-2 leading-relaxed">
            ${idea.description}
          </p>
        </div>

        <!-- TRIAGE TRANSFER ACTIONS (Bin / Doubtful / Implementation) -->
        <div class="mt-5 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
          <button onclick="MarketingController.moveIdea('${idea.id}', 'bin')" class="px-2.5 py-1.5 text-[11px] font-semibold text-rose-400 hover:text-white hover:bg-zinc-800 rounded-lg transition" title="Move to Bin">
            <i class="fa-solid fa-trash-can mr-1"></i> Bin
          </button>
          
          <button onclick="MarketingController.moveIdea('${idea.id}', 'doubtful')" class="px-2.5 py-1.5 text-[11px] font-semibold text-amber-300 hover:text-white hover:bg-zinc-800 rounded-lg transition" title="Mark as Doubtful">
            <i class="fa-solid fa-circle-question mr-1"></i> Doubtful
          </button>

          <button onclick="MarketingController.moveIdea('${idea.id}', 'implementation')" class="px-3 py-1.5 text-[11px] font-bold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg shadow-sm transition" title="Graduate to Implementation">
            <i class="fa-solid fa-rocket mr-1 text-indigo-400"></i> Implement
          </button>
        </div>
      </div>
    `).join('');
  }

  static renderImplementationIdeaCard(idea) {
    const totalStages = idea.stages.length;
    const completedStages = idea.stages.filter(s => s.completed).length;
    const progressPercent = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

    return `
      <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-800 text-indigo-300 border border-zinc-700">
                ${idea.folder}
              </span>
              <span class="text-xs text-zinc-400 font-mono">${progressPercent}% Completed</span>
            </div>
            <h3 class="text-base font-bold text-white">${idea.title}</h3>
            <p class="text-xs text-zinc-400 mt-0.5">${idea.description}</p>
          </div>

          <!-- Scrap Idea Button (With Explicit Confirmation) -->
          <button onclick="MarketingController.confirmScrapIdea('${idea.id}')" class="px-3.5 py-2 bg-zinc-800 hover:bg-rose-950 text-rose-300 border border-zinc-700 hover:border-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start md:self-auto">
            <i class="fa-solid fa-ban"></i> Scrap Idea
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
          <div class="bg-indigo-500 h-2 rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
        </div>

        <!-- Step-by-Step Roadmap Milestones -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          ${idea.stages.map((stage, sIdx) => `
            <div class="p-3 rounded-xl border ${stage.completed ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400'} flex items-start gap-2.5">
              <input type="checkbox" ${stage.completed ? 'checked' : ''} onchange="MarketingController.toggleStageComplete('${idea.id}', ${sIdx})"
                class="mt-0.5 h-4 w-4 rounded border-zinc-700 text-purple-600 focus:ring-purple-500 cursor-pointer" />
              <div class="min-w-0">
                <div class="text-[10px] font-bold uppercase opacity-80">Stage ${sIdx + 1}</div>
                <div class="text-xs font-semibold text-zinc-200 leading-snug mt-0.5">${stage.name}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Add Custom Milestone Button -->
        <div class="pt-2 flex justify-end">
          <button onclick="MarketingController.promptAddStage('${idea.id}')" class="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1">
            <i class="fa-solid fa-plus text-[9px]"></i> Add Milestone Stage
          </button>
        </div>
      </div>
    `;
  }

  static setFolder(folder) {
    this.activeFolder = folder;
    this.render();
  }

  static moveIdea(id, targetStatus) {
    window.State.moveMarketingIdea(id, targetStatus);
    this.render();
    AuthController.showToast(`Idea transferred to ${targetStatus}!`, 'info');
  }

  static permanentlyDeleteIdea(id) {
    if (confirm("Permanently delete this idea from the bin?")) {
      window.State.deleteMarketingIdea(id);
      this.render();
    }
  }

  static confirmScrapIdea(id) {
    if (confirm("Are you sure you want to SCRAP this implementation campaign? It will be moved to the Bin.")) {
      window.State.moveMarketingIdea(id, 'bin');
      this.render();
      AuthController.showToast("Campaign scrapped and moved to Bin.", 'error');
    }
  }

  static toggleStageComplete(ideaId, stageIndex) {
    const idea = window.State.state.marketing.ideas.find(i => i.id === ideaId);
    if (idea && idea.stages[stageIndex]) {
      idea.stages[stageIndex].completed = !idea.stages[stageIndex].completed;
      window.State.saveState();
      this.render();
      if (idea.stages[stageIndex].completed && typeof confetti === 'function') {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
      }
    }
  }

  static promptAddStage(ideaId) {
    const name = prompt("Enter milestone stage title:");
    if (name && name.trim()) {
      const idea = window.State.state.marketing.ideas.find(i => i.id === ideaId);
      if (idea) {
        idea.stages.push({ name: name.trim(), completed: false });
        window.State.saveState();
        this.render();
      }
    }
  }

  static deleteOtherIdea(id) {
    if (confirm("Delete this marketing note?")) {
      window.State.deleteOtherIdea(id);
      this.render();
    }
  }

  static promptDeleteFolder(folderName, event) {
    if (event) event.stopPropagation();
    if (!folderName) return;
    if (confirm(`Are you sure you want to delete folder "${folderName}"?\n\nAny ideas inside will be safely reassigned to the default folder.`)) {
      window.State.deleteMarketingFolder(folderName);
      if (this.activeFolder === folderName) {
        this.activeFolder = 'ALL';
      }
      this.render();
      if (window.AuthController) {
        window.AuthController.showToast(`Folder "${folderName}" deleted.`, 'info');
      }
    }
  }

  static moveOtherIdeaToImplementation(id) {
    const newIdea = window.State.moveOtherIdeaToImplementation(id);
    if (newIdea) {
      if (window.AuthController) {
        window.AuthController.showToast(`"${newIdea.title}" moved to Implementation Stage!`, 'success');
      }
      this.currentSubpage = 'implementation';
      this.render();
      if (typeof confetti === 'function') {
        confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
      }
    }
  }

  static triggerEmojiBurst(emoji) {
    // Post to chat
    window.State.addChatMessage(`Sent reaction ${emoji}`, emoji);
    window.State.broadcastChange({ type: 'EMOJI_BURST', emoji: emoji, user: window.State.getCurrentUser() });
    this.renderFloatingEmoji(emoji);
    this.render();
  }

  static renderFloatingEmoji(emoji) {
    const burst = document.createElement('div');
    burst.className = 'fixed bottom-10 right-10 text-5xl pointer-events-none z-50 animate-bounce';
    burst.textContent = emoji;
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 1800);
  }

  static initWhiteboard() {
    this.canvas = document.getElementById('marketing-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    
    // Resize canvas to parent container
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;

    // Restore saved drawing if available
    const saved = window.State.state.marketing.drawingSnapshot;
    if (saved) {
      const img = new Image();
      img.onload = () => this.ctx.drawImage(img, 0, 0);
      img.src = saved;
    }

    // Drawing handlers
    const startDraw = (e) => {
      this.isDrawing = true;
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
    };

    const draw = (e) => {
      if (!this.isDrawing) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

      this.ctx.strokeStyle = this.isEraser ? '#09090b' : this.currentColor;
      this.ctx.lineWidth = this.currentLineWidth;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';

      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    };

    const stopDraw = () => {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.ctx.closePath();
        // Save snapshot
        window.State.saveDrawing(this.canvas.toDataURL());
      }
    };

    this.canvas.onmousedown = startDraw;
    this.canvas.onmousemove = draw;
    this.canvas.onmouseup = stopDraw;
    this.canvas.onmouseleave = stopDraw;

    this.canvas.ontouchstart = startDraw;
    this.canvas.ontouchmove = draw;
    this.canvas.ontouchend = stopDraw;

    // Palette listeners
    const colorPicker = document.getElementById('canvas-color-picker');
    if (colorPicker) {
      colorPicker.oninput = (e) => {
        this.currentColor = e.target.value;
        this.isEraser = false;
      };
    }

    const penBtn = document.getElementById('btn-brush-pen');
    const eraserBtn = document.getElementById('btn-brush-eraser');
    if (penBtn) {
      penBtn.onclick = () => {
        this.isEraser = false;
        penBtn.className = 'w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs';
        eraserBtn.className = 'w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs';
      };
    }
    if (eraserBtn) {
      eraserBtn.onclick = () => {
        this.isEraser = true;
        eraserBtn.className = 'w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs';
        penBtn.className = 'w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs';
      };
    }

    const sizeSelect = document.getElementById('canvas-size-select');
    if (sizeSelect) {
      sizeSelect.onchange = (e) => {
        this.currentLineWidth = parseInt(e.target.value);
      };
    }

    const clearBtn = document.getElementById('btn-clear-canvas');
    if (clearBtn) {
      clearBtn.onclick = () => {
        if (confirm("Clear the whiteboard?")) {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          window.State.saveDrawing(null);
        }
      };
    }
  }

  static bindEvents() {
    // Subpage navigation buttons
    ['dump', 'brainstorm', 'implementation', 'other'].forEach(sub => {
      const btn = document.getElementById(`mkt-nav-${sub}`);
      if (btn) {
        btn.onclick = () => {
          this.currentSubpage = sub;
          this.render();
        };
      }
    });

    // Add folder prompt
    const addFolderBtn = document.getElementById('btn-add-mkt-folder');
    if (addFolderBtn) {
      addFolderBtn.onclick = () => {
        const name = prompt("Enter new marketing folder name:");
        if (name && name.trim()) {
          window.State.addMarketingFolder(name.trim());
          this.render();
        }
      };
    }

    // Toggle add idea
    const toggleAddIdeaBtn = document.getElementById('btn-toggle-add-idea');
    const addIdeaPanel = document.getElementById('add-idea-panel');
    const cancelAddIdeaBtn = document.getElementById('btn-cancel-add-idea');

    if (toggleAddIdeaBtn && addIdeaPanel) {
      toggleAddIdeaBtn.onclick = () => {
        addIdeaPanel.classList.toggle('hidden');
        if (!addIdeaPanel.classList.contains('hidden')) {
          document.getElementById('idea-title-input')?.focus();
        }
      };
    }
    if (cancelAddIdeaBtn && addIdeaPanel) {
      cancelAddIdeaBtn.onclick = () => addIdeaPanel.classList.add('hidden');
    }

    // Form new idea
    const formNewIdea = document.getElementById('form-new-idea');
    if (formNewIdea) {
      formNewIdea.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('idea-title-input').value.trim();
        const folder = document.getElementById('idea-folder-select').value;
        const description = document.getElementById('idea-desc-input').value.trim();

        if (title && description) {
          window.State.addMarketingIdea({ title, folder, description });
          this.render();
          AuthController.showToast("Idea dumped successfully!", 'success');
        }
      };
    }

    // Chat form in Brainstorming Fun
    const chatForm = document.getElementById('mkt-chat-form');
    if (chatForm) {
      chatForm.onsubmit = (e) => {
        e.preventDefault();
        const input = document.getElementById('mkt-chat-input');
        const text = input.value.trim();
        if (text) {
          window.State.addChatMessage(text);
          input.value = '';
          this.render();
          const stream = document.getElementById('mkt-chat-stream');
          if (stream) stream.scrollTop = stream.scrollHeight;
        }
      };
    }

    // Add Other Idea
    const addOtherBtn = document.getElementById('btn-add-other-idea');
    const addOtherPanel = document.getElementById('add-other-panel');
    const cancelOtherBtn = document.getElementById('btn-cancel-other');

    if (addOtherBtn && addOtherPanel) {
      addOtherBtn.onclick = () => addOtherPanel.classList.toggle('hidden');
    }
    if (cancelOtherBtn && addOtherPanel) {
      cancelOtherBtn.onclick = () => addOtherPanel.classList.add('hidden');
    }

    const formOther = document.getElementById('form-other-idea');
    if (formOther) {
      formOther.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('other-title-input').value.trim();
        const notes = document.getElementById('other-notes-input').value.trim();
        const rawTags = document.getElementById('other-tags-input').value.trim();
        const tags = rawTags ? rawTags.split(',').map(t => t.trim()) : [];

        if (title && notes) {
          window.State.addOtherIdea({ title, notes, tags });
          this.render();
        }
      };
    }
  }
}

// Remote emoji receiver callback
window.onRemoteEmojiBurst = (data) => {
  MarketingController.renderFloatingEmoji(data.emoji || '🔥');
};

window.MarketingController = MarketingController;
