export class ErrorReporter {
    static init() {
        if (window._errorReporterInit) return;
        window._errorReporterInit = true;

        window.addEventListener('error', (event) => {
            const msg = event.error ? event.error.stack : (event.message + ' at ' + event.filename + ':' + event.lineno);
            ErrorReporter.showError(msg);
        });

        window.addEventListener('unhandledrejection', (event) => {
            const msg = event.reason ? (event.reason.stack || event.reason) : 'Unhandled Promise Rejection';
            ErrorReporter.showError(msg);
        });

        const ogConsoleError = console.error;
        console.error = function (...args) {
            ogConsoleError.apply(console, args);
            // Extract meaningful stack trace or message
            const msg = args.map(a => typeof a === 'object' && a?.stack ? a.stack : String(a)).join(' ');
            ErrorReporter.showError(msg);
        };
    }

    static showError(message) {
        if (typeof document === 'undefined') return;

        let container = document.getElementById('error-reporter-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'error-reporter-container';
            container.style.cssText = `
                position: fixed;
                top: 0; left: 0; right: 0;
                background: rgba(220, 38, 38, 0.95);
                color: #fff;
                z-index: 999999;
                max-height: 50vh;
                overflow-y: auto;
                font-family: monospace;
                box-shadow: 0 4px 6px rgba(0,0,0,0.5);
                pointer-events: auto;
            `;

            const header = document.createElement('div');
            header.style.cssText = `
                display: flex; justify-content: space-between; align-items: center;
                background: #991b1b; padding: 10px 15px; font-weight: bold; font-size: 16px;
            `;
            header.innerHTML = `<span>⚠️ Erreur Critique Apparue (ErrorReporter)</span>`;

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '❌';
            closeBtn.style.cssText = `background: transparent; border: none; font-size: 16px; cursor: pointer; color: white;`;
            closeBtn.onclick = () => { container.remove(); };
            header.appendChild(closeBtn);

            const pre = document.createElement('pre');
            pre.id = 'error-reporter-log';
            pre.style.cssText = `padding: 15px; margin: 0; white-space: pre-wrap; word-break: break-all; font-size: 13px; line-height: 1.4;`;

            container.appendChild(header);
            container.appendChild(pre);
            document.body.appendChild(container);
        }

        const pre = container.querySelector('#error-reporter-log');
        if (pre) {
            pre.textContent += '\n\n> ' + message;
        }
    }
}
