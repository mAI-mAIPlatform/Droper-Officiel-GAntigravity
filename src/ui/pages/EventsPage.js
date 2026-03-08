import { DAILY_MODIFIERS, TEMPORARY_EVENTS } from '../../data/events.js';

export function EventsPage(app) {
    const eventManager = app.eventManager;
    const daily = eventManager.dailyModifier;
    const tempEvents = eventManager.activeTempEvents;

    const container = document.createElement('div');
    container.className = 'events-page fade-in';
    container.style.cssText = `
        padding: 40px;
        color: white;
        font-family: 'Outfit', sans-serif;
        background: radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%);
        min-height: 100vh;
    `;

    const html = `
        <div style="max-width: 900px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                <h1 style="font-size: 32px; font-weight: 800; margin: 0; background: linear-gradient(to right, #60a5fa, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    ÉVÉNEMENTS
                </h1>
                <button id="back-home" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer;">
                    Retour
                </button>
            </div>

            <!-- DAILY EVENT -->
            <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(96, 165, 250, 0.3); border-radius: 20px; padding: 30px; margin-bottom: 40px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -10px; right: 20px; font-size: 80px; opacity: 0.1; transform: rotate(15deg);">${daily.emoji}</div>
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <span style="background: #3b82f6; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-right: 15px;">AUJOURD'HUI</span>
                    <span style="color: #94a3b8; font-size: 14px;">Finit dans : <strong>${eventManager.getTimeRemainingString()}</strong></span>
                </div>
                <h2 style="font-size: 28px; margin: 0 0 10px 0;">${daily.name}</h2>
                <p style="color: #cbd5e1; margin: 0; font-size: 16px;">${daily.description}</p>
            </div>

            <!-- TEMPORARY EVENTS -->
            <h3 style="font-size: 20px; margin-bottom: 20px; color: #94a3b8;">Événements Temporaires</h3>
            <div style="display: grid; gap: 20px;">
                ${tempEvents.map(event => `
                    <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 20px; padding: 25px;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                            <div>
                                <h4 style="font-size: 22px; margin: 0 0 5px 0;">${event.emoji} ${event.name}</h4>
                                <p style="color: #94a3b8; font-size: 14px; margin: 0;">${event.description}</p>
                            </div>
                            <div style="text-align: right;">
                                <span style="display: block; color: #a855f7; font-weight: 700; font-size: 13px;">DURÉE : ${event.durationDays} JOURS</span>
                            </div>
                        </div>

                        ${event.objectives ? `
                            <div style="background: rgba(0,0,0,0.2); border-radius: 12px; padding: 15px;">
                                ${event.objectives.map(obj => {
        const prog = eventManager.getProgress(event.id, obj.id);
        const pct = (prog / obj.target) * 100;
        return `
                                        <div style="margin-bottom: 15px;">
                                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px;">
                                                <span>${obj.label}</span>
                                                <span style="color: ${prog >= obj.target ? '#22c55e' : '#cbd5e1'}">${prog}/${obj.target}</span>
                                            </div>
                                            <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                                                <div style="width: ${pct}%; height: 100%; background: linear-gradient(to right, #a855f7, #6366f1); border-radius: 3px; transition: width 0.5s ease;"></div>
                                            </div>
                                            <div style="font-size: 12px; color: #64748b; margin-top: 5px;">Récompense : ${obj.reward.name || obj.reward.amount + ' ' + (obj.reward.type === 'coins' ? 'Coins' : obj.reward.type)}</div>
                                        </div>
                                    `;
    }).join('')}
                            </div>
                        ` : ''}

                        ${event.isTournament ? `
                            <div style="text-align: center; padding: 20px; color: #94a3b8;">
                                <p>Classement en direct disponible prochainement !</p>
                                <button style="background: #a855f7; border: none; color: white; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer;">Participer</button>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    container.innerHTML = html;

    container.querySelector('#back-home').onclick = () => app.router.navigate('/');

    return container;
}
