/* ============================
   DROPER — Composant SearchBar
   ============================ */

export class SearchBar {
    constructor(placeholder = 'Rechercher...', onInput = null) {
        this.placeholder = placeholder;
        this.onInput = onInput;
    }

    render() {
        return `
      <div class="search-bar" id="search-bar">
        <span class="search-bar__icon">🔍</span>
        <input type="text" 
               class="search-bar__input" 
               id="search-input"
               placeholder="${this.placeholder}" 
               autocomplete="off" />
      </div>
    `;
    }

    afterRender() {
        const input = document.getElementById('search-input');
        if (input && this.onInput) {
            input.addEventListener('input', (e) => {
                this.onInput(e.target.value);
            });
        }
    }
}
