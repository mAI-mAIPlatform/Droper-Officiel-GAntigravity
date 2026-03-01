/* ============================
   DROPER — Éditeur de Maps 🏗️ (Bêta)
   v0.4.5
   ============================ */

export class MapEditorPage {
    constructor(app) {
        this.app = app;
        this.gridCols = 30;
        this.gridRows = 20;
        this.cellSize = 30;
        this.grid = [];
        this.selectedTool = 'wall';
        this.mapName = 'Ma Map';
        this.isDrawing = false;

        // Initialiser la grille vide
        for (let r = 0; r < this.gridRows; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.gridCols; c++) {
                this.grid[r][c] = 'empty';
            }
        }
    }

    render() {
        const tools = [
            { id: 'wall', emoji: '🧱', label: 'Mur', color: '#4a9eff' },
            { id: 'water', emoji: '🌊', label: 'Eau', color: '#3b82f6' },
            { id: 'grass', emoji: '🌿', label: 'Herbe', color: '#22c55e' },
            { id: 'spawn', emoji: '🎯', label: 'Spawn', color: '#fbbf24' },
            { id: 'eraser', emoji: '🧹', label: 'Gomme', color: '#8b95a8' },
        ];

        return `
            <div class="page page--map-editor anim-fade-in" style="padding-bottom: 80px;">
                <div class="page__header row row--between" style="margin-bottom: 20px;">
                    <div class="row" style="gap: 12px; align-items: center;">
                        <h1 class="section-title" style="margin: 0;">
                            <span class="section-title__prefix">///</span> ÉDITEUR DE MAPS
                        </h1>
                        <span style="
                            background: rgba(168, 85, 247, 0.2);
                            color: #a855f7;
                            border: 1px solid #a855f7;
                            padding: 2px 10px;
                            border-radius: 20px;
                            font-size: 0.6rem;
                            font-weight: 900;
                            letter-spacing: 1px;
                            animation: pulse 2s infinite;
                        ">🧪 BÊTA</span>
                    </div>
                    <button class="btn btn--outline" id="btn-back-home" style="padding: 8px 15px; font-size: 0.7rem;">← ACCUEIL</button>
                </div>

                <!-- Nom de la map -->
                <div class="card" style="margin-bottom: 20px; padding: 15px;">
                    <div class="row row--between" style="align-items: center; flex-wrap: wrap; gap: 10px;">
                        <div class="row" style="gap: 10px; align-items: center;">
                            <span style="font-size: 1.2rem;">🗺️</span>
                            <input type="text" id="map-name-input" value="${this.mapName}"
                                style="background: rgba(255,255,255,0.05); border: 1px solid var(--color-border);
                                       color: #fff; padding: 8px 15px; border-radius: 8px; font-size: 0.85rem;
                                       font-weight: 700; width: 200px;" />
                        </div>
                        <div class="row" style="gap: 8px; flex-wrap: wrap;">
                            <button class="btn btn--accent btn--sm" id="btn-save-map">💾 Sauvegarder</button>
                            <button class="btn btn--outline btn--sm" id="btn-load-map">📂 Charger</button>
                            <button class="btn btn--outline btn--sm" id="btn-export-map" style="border-color: #22c55e; color: #22c55e;">📋 Exporter</button>
                            <button class="btn btn--outline btn--sm" id="btn-import-map" style="border-color: #3b82f6; color: #3b82f6;">📥 Importer</button>
                            <button class="btn btn--ghost btn--sm" id="btn-clear-map">🗑️ Effacer</button>
                        </div>
                    </div>
                </div>

                <!-- Palette d'outils -->
                <div class="card" style="margin-bottom: 15px; padding: 12px;">
                    <div class="row" style="gap: 8px; justify-content: center; flex-wrap: wrap;">
                        ${tools.map(t => `
                            <button class="btn btn--sm editor-tool ${t.id === this.selectedTool ? 'btn--accent' : 'btn--outline'}"
                                    data-tool="${t.id}"
                                    style="min-width: 90px; display: flex; align-items: center; gap: 5px; justify-content: center;
                                           ${t.id === this.selectedTool ? `box-shadow: 0 0 12px ${t.color}44;` : ''}">
                                <span style="font-size: 1rem;">${t.emoji}</span>
                                <span style="font-size: 0.7rem;">${t.label}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Grille de l'éditeur -->
                <div class="card" style="padding: 15px; overflow-x: auto;">
                    <div id="editor-grid" style="
                        display: grid;
                        grid-template-columns: repeat(${this.gridCols}, ${this.cellSize}px);
                        grid-template-rows: repeat(${this.gridRows}, ${this.cellSize}px);
                        gap: 1px;
                        background: rgba(255,255,255,0.05);
                        border-radius: 8px;
                        overflow: hidden;
                        width: fit-content;
                        margin: 0 auto;
                        user-select: none;
                    ">
                        ${this.renderGrid()}
                    </div>
                </div>

                <!-- Sauvegardées -->
                <div style="margin-top: 20px;">
                    <h3 style="font-size: 0.8rem; font-weight: 800; color: var(--color-text-muted); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">
                        📁 Maps Sauvegardées
                    </h3>
                    <div id="saved-maps-list" class="stack" style="gap: 8px;">
                        ${this.renderSavedMaps()}
                    </div>
                </div>

                <!-- Modal de chargement -->
                <div class="modal-overlay" id="load-modal" style="display: none;">
                    <div class="modal" id="load-modal-content" style="max-width: 400px;">
                        <h3 style="margin-bottom: 15px;">📂 Charger une map</h3>
                        <div id="load-maps-list" class="stack" style="gap: 8px; max-height: 300px; overflow-y: auto;"></div>
                        <button class="btn btn--ghost" id="btn-close-load" style="width: 100%; margin-top: 15px;">Fermer</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderGrid() {
        let html = '';
        for (let r = 0; r < this.gridRows; r++) {
            for (let c = 0; c < this.gridCols; c++) {
                const cell = this.grid[r][c];
                const style = this.getCellStyle(cell);
                html += `<div class="editor-cell" data-row="${r}" data-col="${c}"
                              style="width: ${this.cellSize}px; height: ${this.cellSize}px; ${style}
                                     cursor: pointer; transition: background 0.1s ease;
                                     display: flex; align-items: center; justify-content: center;
                                     font-size: 0.7rem;"></div>`;
            }
        }
        return html;
    }

    getCellStyle(type) {
        switch (type) {
            case 'wall': return 'background: rgba(74, 158, 255, 0.5); border: 1px solid #4a9eff;';
            case 'water': return 'background: rgba(59, 130, 246, 0.4); border: 1px solid #3b82f6;';
            case 'grass': return 'background: rgba(34, 197, 94, 0.4); border: 1px solid #22c55e;';
            case 'spawn': return 'background: rgba(251, 191, 36, 0.4); border: 1px solid #fbbf24;';
            default: return 'background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);';
        }
    }

    getCellEmoji(type) {
        switch (type) {
            case 'wall': return '🧱';
            case 'water': return '🌊';
            case 'grass': return '🌿';
            case 'spawn': return '🎯';
            default: return '';
        }
    }

    renderSavedMaps() {
        const saved = this.app.saveManager.get('customMaps') || [];
        if (saved.length === 0) {
            return '<div style="color: var(--color-text-muted); font-size: 0.75rem; text-align: center; padding: 20px;">Aucune map sauvegardée</div>';
        }
        return saved.map((m, i) => `
            <div class="card" style="padding: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong style="font-size: 0.8rem;">${m.name}</strong>
                    <span style="font-size: 0.6rem; color: var(--color-text-muted); margin-left: 8px;">
                        ${m.gridCols}x${m.gridRows}
                    </span>
                </div>
                <div class="row" style="gap: 5px;">
                    <button class="btn btn--sm btn--outline" data-load-saved="${i}">📂</button>
                    <button class="btn btn--sm btn--ghost" data-delete-saved="${i}" style="color: var(--color-accent-red);">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    afterRender() {
        // Navigation
        document.getElementById('btn-back-home')?.addEventListener('click', () => {
            window.location.hash = '#accueil';
        });

        // Tools
        document.querySelectorAll('.editor-tool').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedTool = btn.dataset.tool;
                this.refresh();
            });
        });

        // Grid — mousedown, mousemove, mouseup for drawing
        const grid = document.getElementById('editor-grid');
        if (grid) {
            grid.addEventListener('mousedown', (e) => {
                this.isDrawing = true;
                this.handleCellClick(e);
            });
            grid.addEventListener('mousemove', (e) => {
                if (this.isDrawing) this.handleCellClick(e);
            });
            grid.addEventListener('mouseup', () => { this.isDrawing = false; });
            grid.addEventListener('mouseleave', () => { this.isDrawing = false; });

            // Touch support
            grid.addEventListener('touchstart', (e) => {
                this.isDrawing = true;
                this.handleTouchCell(e);
            });
            grid.addEventListener('touchmove', (e) => {
                if (this.isDrawing) this.handleTouchCell(e);
                e.preventDefault();
            });
            grid.addEventListener('touchend', () => { this.isDrawing = false; });
        }

        // Save
        document.getElementById('btn-save-map')?.addEventListener('click', () => this.saveMap());
        // Load
        document.getElementById('btn-load-map')?.addEventListener('click', () => this.showLoadModal());
        // Clear
        document.getElementById('btn-clear-map')?.addEventListener('click', () => this.clearGrid());
        // Export
        document.getElementById('btn-export-map')?.addEventListener('click', () => this.exportMap());
        // Import
        document.getElementById('btn-import-map')?.addEventListener('click', () => this.importMap());
        // Close load modal
        document.getElementById('btn-close-load')?.addEventListener('click', () => {
            document.getElementById('load-modal').style.display = 'none';
        });

        // Saved map actions
        document.querySelectorAll('[data-load-saved]').forEach(btn => {
            btn.addEventListener('click', () => this.loadSavedMap(parseInt(btn.dataset.loadSaved)));
        });
        document.querySelectorAll('[data-delete-saved]').forEach(btn => {
            btn.addEventListener('click', () => this.deleteSavedMap(parseInt(btn.dataset.deleteSaved)));
        });
    }

    handleCellClick(e) {
        const cell = e.target.closest('.editor-cell');
        if (!cell) return;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (isNaN(row) || isNaN(col)) return;

        if (this.selectedTool === 'eraser') {
            this.grid[row][col] = 'empty';
        } else {
            this.grid[row][col] = this.selectedTool;
        }

        // Update visual immediately
        cell.style.cssText = `width: ${this.cellSize}px; height: ${this.cellSize}px; ${this.getCellStyle(this.grid[row][col])} cursor: pointer; transition: background 0.1s ease; display: flex; align-items: center; justify-content: center; font-size: 0.7rem;`;
        cell.textContent = this.getCellEmoji(this.grid[row][col]);
    }

    handleTouchCell(e) {
        const touch = e.touches[0];
        const elem = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elem?.classList.contains('editor-cell')) {
            this.handleCellClick({ target: elem, closest: (sel) => elem });
        }
    }

    saveMap() {
        const nameInput = document.getElementById('map-name-input');
        this.mapName = nameInput ? nameInput.value || 'Ma Map' : 'Ma Map';

        const mapData = {
            name: this.mapName,
            gridCols: this.gridCols,
            gridRows: this.gridRows,
            grid: JSON.parse(JSON.stringify(this.grid)),
            createdAt: Date.now(),
        };

        const saved = this.app.saveManager.get('customMaps') || [];
        saved.push(mapData);
        this.app.saveManager.set('customMaps', saved);

        // Toast
        if (window.app?.toast) window.app.toast.success(`✅ Map "${this.mapName}" sauvegardée !`);
        this.refresh();
    }

    loadSavedMap(index) {
        const saved = this.app.saveManager.get('customMaps') || [];
        if (!saved[index]) return;
        const mapData = saved[index];
        this.mapName = mapData.name;
        this.grid = JSON.parse(JSON.stringify(mapData.grid));
        this.refresh();
    }

    deleteSavedMap(index) {
        const saved = this.app.saveManager.get('customMaps') || [];
        if (!saved[index]) return;
        if (confirm(`Supprimer la map "${saved[index].name}" ?`)) {
            saved.splice(index, 1);
            this.app.saveManager.set('customMaps', saved);
            this.refresh();
        }
    }

    showLoadModal() {
        const modal = document.getElementById('load-modal');
        const list = document.getElementById('load-maps-list');
        if (!modal || !list) return;

        const saved = this.app.saveManager.get('customMaps') || [];
        if (saved.length === 0) {
            list.innerHTML = '<div style="color: var(--color-text-muted); text-align: center; padding: 20px;">Aucune map sauvegardée</div>';
        } else {
            list.innerHTML = saved.map((m, i) => `
                <button class="btn btn--outline" data-modal-load="${i}" style="width: 100%; text-align: left;">
                    🗺️ ${m.name} <span style="font-size: 0.6rem; opacity: 0.6;">(${m.gridCols}x${m.gridRows})</span>
                </button>
            `).join('');

            list.querySelectorAll('[data-modal-load]').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.loadSavedMap(parseInt(btn.dataset.modalLoad));
                    modal.style.display = 'none';
                });
            });
        }

        modal.style.display = 'flex';
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }

    clearGrid() {
        if (!confirm('Effacer toute la grille ?')) return;
        for (let r = 0; r < this.gridRows; r++) {
            for (let c = 0; c < this.gridCols; c++) {
                this.grid[r][c] = 'empty';
            }
        }
        this.refresh();
    }

    exportMap() {
        const nameInput = document.getElementById('map-name-input');
        this.mapName = nameInput ? nameInput.value || 'Ma Map' : 'Ma Map';

        const mapData = {
            name: this.mapName,
            gridCols: this.gridCols,
            gridRows: this.gridRows,
            grid: this.grid,
            version: '0.9.6',
        };

        try {
            const json = JSON.stringify(mapData);
            const encoded = btoa(unescape(encodeURIComponent(json)));
            const code = `DROPER_MAP:${encoded}`;

            navigator.clipboard.writeText(code).then(() => {
                if (window.app?.toast) window.app.toast.success('📋 Code de map copié dans le presse-papier !');
            }).catch(() => {
                // Fallback : afficher le code
                prompt('📋 Copie ce code pour partager ta map :', code);
            });
        } catch (e) {
            if (window.app?.toast) window.app.toast.error('❌ Erreur lors de l\'export');
        }
    }

    importMap() {
        const code = prompt('📥 Colle le code de la map à importer :');
        if (!code || !code.startsWith('DROPER_MAP:')) {
            if (code) {
                if (window.app?.toast) window.app.toast.error('❌ Code invalide. Le code doit commencer par DROPER_MAP:');
            }
            return;
        }

        try {
            const encoded = code.replace('DROPER_MAP:', '');
            const json = decodeURIComponent(escape(atob(encoded)));
            const mapData = JSON.parse(json);

            if (!mapData.grid || !mapData.gridCols || !mapData.gridRows) {
                if (window.app?.toast) window.app.toast.error('❌ Format de map invalide');
                return;
            }

            const confirmed = confirm(`📥 Importer la map "${mapData.name}" (${mapData.gridCols}x${mapData.gridRows}) ?\n\nCela remplacera la grille actuelle.`);
            if (!confirmed) return;

            this.mapName = mapData.name;
            this.gridCols = mapData.gridCols;
            this.gridRows = mapData.gridRows;
            this.grid = JSON.parse(JSON.stringify(mapData.grid));

            if (window.app?.toast) window.app.toast.success(`✅ Map "${this.mapName}" importée !`);
            this.refresh();
        } catch (e) {
            if (window.app?.toast) window.app.toast.error('❌ Code de map corrompu ou invalide');
        }
    }

    refresh() {
        const container = document.getElementById('page-container');
        if (container) {
            container.innerHTML = this.render();
            this.afterRender();
        }
    }
}
