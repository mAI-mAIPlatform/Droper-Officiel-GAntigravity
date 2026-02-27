/* ============================
  * DROPER — Main Entry Point (v0.1.2 Alpha)
 * (c) 2026 mCompany / Mathias 🚀============================ */

import './styles/variables.css';
import './styles/reset.css';
import './styles/animations.css';
import './styles/components.css';
import './styles/layout.css';

import { Router } from './router.js';
import { SaveManager } from './systems/SaveManager.js';
import { PlayerManager } from './systems/PlayerManager.js';
import { EconomyManager } from './systems/EconomyManager.js';
import { HeroManager } from './systems/HeroManager.js';
import { QuestManager } from './systems/QuestManager.js';
import { AudioManager } from './systems/AudioManager.js';
import { SeasonPassManager } from './systems/SeasonPassManager.js';
import { InventoryManager } from './systems/InventoryManager.js';
import { RecordManager } from './systems/RecordManager.js';
import { LeagueManager } from './systems/LeagueManager.js';
import { MultiplayerManager } from './systems/MultiplayerManager.js';
import { ChatManager } from './systems/ChatManager.js';
import { ClubManager } from './systems/ClubManager.js';
import { FriendManager } from './systems/FriendManager.js';
import { SkinManager } from './systems/SkinManager.js';
import { EmoteManager } from './systems/EmoteManager.js';
import { MusicPlayer } from './systems/MusicPlayer.js';
import { MatchHistoryManager } from './systems/MatchHistoryManager.js';
import { AdminManager } from './systems/AdminManager.js';

class DroperApp {
    constructor() {
        this.version = '0.3.3 Alpha';
        this.app = this; // Self reference for managers [v0.3.1]
        this.saveManager = new SaveManager();
        this.playerManager = new PlayerManager(this.saveManager);
        this.economyManager = new EconomyManager(this.saveManager);
        this.heroManager = new HeroManager(this.saveManager);
        this.questManager = new QuestManager(this.saveManager);
        this.audioManager = new AudioManager();
        this.seasonPassManager = new SeasonPassManager(this.saveManager, this.economyManager, this.heroManager);
        this.inventoryManager = new InventoryManager(this.saveManager, this.economyManager);
        this.recordManager = new RecordManager(this.saveManager, this.economyManager, null);
        this.leagueManager = null;
        this.multiplayerManager = new MultiplayerManager(this);
        this.chatManager = new ChatManager();
        this.clubManager = new ClubManager(this.saveManager, this.chatManager);
        this.friendManager = new FriendManager(this.saveManager, this.chatManager);
        this.skinManager = new SkinManager(this.saveManager, this.economyManager);
        this.emoteManager = new EmoteManager(this.saveManager);
        this.musicPlayer = new MusicPlayer();
        this.matchHistoryManager = new MatchHistoryManager(this.saveManager);
        this.adminManager = new AdminManager(this);

        // Wiring [v0.3.1]
        this.heroManager.app = this;
        this.questManager.app = this;
        this.playerManager.app = this;
        this.economyManager.app = this;
        this.inventoryManager.app = this;
        this.recordManager.app = this;
        this.seasonPassManager.app = this;
        this.skinManager.app = this;
        this.emoteManager.app = this;
        this.matchHistoryManager.app = this;

        this.router = null;
        this.selectedMode = null;
        this.matchOnline = false;
    }

    init() {
        // Charger les sauvegardes
        this.saveManager.loadAll();
        this.playerManager.load();
        this.economyManager.load();
        this.heroManager.load();
        this.questManager.load();
        this.seasonPassManager.load();
        this.inventoryManager.load();
        this.recordManager.load();
        this.matchHistoryManager.load();

        // Wire managers
        this.seasonPassManager.setInventoryManager(this.inventoryManager);
        this.recordManager.inventory = this.inventoryManager;

        // League
        this.leagueManager = new LeagueManager(this.saveManager, this.economyManager, this.inventoryManager, this.recordManager);
        this.leagueManager.load();

        // Social
        this.clubManager.load();
        this.friendManager.load();

        // Cosmetics
        this.skinManager.load();
        this.emoteManager.load();

        // Audio (initialisé au premier clic)
        document.addEventListener('click', () => {
            if (!this.audioManager.ctx) {
                this.audioManager.init();
            }
            this.audioManager.resume();
            this.musicPlayer.resume();
        }, { once: true });

        // Router
        try {
            this.router = new Router(this);
            this.router.init();
        } catch (e) {
            console.error("❌ Erreur critique lors de l'initialisation du Router:", e);
            document.body.innerHTML = `<div style="background:#080c16; color:white; height:100vh; display:flex; align-items:center; justify-content:center; flex-direction:column; font-family:sans-serif; text-align:center; padding:20px;">
                <h1 style="color:#ef4444;">Echec du chargement du jeu</h1>
                <p>${e.message}</p>
                <button onclick="localStorage.clear(); window.location.reload();" style="background:#4a9eff; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer; margin-top:20px;">Réinitialiser les données</button>
            </div>`;
        }

        console.log(`🎮 Droper v${this.version} Alpha — Initialisé !`);
    }
}

// Lancement
document.addEventListener('DOMContentLoaded', () => {
    const app = new DroperApp();
    app.init();
});
