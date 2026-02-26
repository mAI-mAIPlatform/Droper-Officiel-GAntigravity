/* ============================
   DROPER — Page Actualités
   ============================ */

import { NEWS_ARTICLES } from '../../data/news.js';
import { parseMarkdown } from '../../utils/MarkdownParser.js';

export class NewsPage {
  constructor(app) {
    this.app = app;
    this.showNotes = false;
    this.currentNotes = '';
    this.loading = false;
    this.searchTerm = '';
    this.currentPage = 1;
    this.pageSize = 5;
    this.selectedArticle = null;
  }

  render() {
    if (this.selectedArticle) return this.renderFullArticle();

    const adminNews = this.app.adminManager?.config?.customNews || [];
    const allNews = [...adminNews, ...NEWS_ARTICLES];

    const filtered = allNews.filter(article => {
      if (!this.searchTerm) return true;
      const search = this.searchTerm.toLowerCase();
      return article.title.toLowerCase().includes(search) ||
        (article.summary && article.summary.toLowerCase().includes(search)) ||
        (article.version && article.version.toLowerCase().includes(search));
    });

    const totalPages = Math.ceil(filtered.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const pageArticles = filtered.slice(start, start + this.pageSize);

    return `
      <div class="page">
        <div class="page__header">
          <div class="row row--between">
            <h1 class="section-title">
              <span class="section-title__prefix">///</span> ACTUALITÉS
            </h1>
            <div class="search-bar" style="margin-bottom: 0;">
              <span class="search-bar__icon">🔍</span>
              <input type="text" id="news-search" class="search-bar__input" 
                     placeholder="Chercher une version..." value="${this.searchTerm}">
            </div>
          </div>
        </div>

        <div class="stack" style="gap: var(--spacing-lg);">
          ${pageArticles.length === 0 ? `
            <div class="card" style="text-align: center; padding: var(--spacing-xl);">
              <p style="color: var(--color-text-muted);">Aucune actualité trouvée pour "${this.searchTerm}"</p>
            </div>
          ` : pageArticles.map((article, i) => `
            <div class="card anim-fade-in-up anim-delay-${Math.min(i + 1, 6)}"
                 style="border-left: 4px solid ${article.type === 'event' ? 'var(--color-accent-gold)' : 'var(--color-accent-blue)'};">
              <div class="row row--between" style="margin-bottom: var(--spacing-sm);">
                <span class="badge ${article.type === 'event' ? 'badge--epic' : 'badge--common'}">
                  ${article.type === 'event' ? '🎉 Événement' : '📋 Mise à jour'}
                </span>
                <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${article.date}</span>
              </div>
              <h3 class="news-title ${article.version ? 'news-title--link' : ''}" 
                  data-version="${article.version || ''}"
                  style="font-size: var(--font-size-lg); font-weight: 800; margin-bottom: var(--spacing-sm); cursor: ${article.version ? 'pointer' : 'default'}">
                ${article.title}
                ${article.version ? `<span style="font-size: 0.7rem; color: var(--color-accent-blue); display: block; margin-top: 4px;">📂 Cliquez pour voir les notes détaillées</span>` : ''}
              </h3>
              <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--spacing-md);">
                ${article.summary}
              </p>
              <div class="news-details" style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                ${article.content.map(line => `<div style="padding: 2px 0;">• ${line}</div>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        ${totalPages > 1 ? `
          <div class="row row--center" style="margin-top: var(--spacing-2xl); gap: var(--spacing-md);">
            <button class="btn btn--ghost" id="prev-page" style="width: auto;" ${this.currentPage === 1 ? 'disabled' : ''}>⬅️ Précédent</button>
            <span style="font-weight: 700; color: var(--color-text-primary);">${this.currentPage} / ${totalPages}</span>
            <button class="btn btn--ghost" id="next-page" style="width: auto;" ${this.currentPage === totalPages ? 'disabled' : ''}>Suivant ➡️</button>
          </div>
        ` : ''}

        <!-- Modal Patch Notes -->
        <div id="notes-modal" class="modal-overlay ${this.showNotes ? 'active' : ''}" style="display: ${this.showNotes ? 'flex' : 'none'};">
            <div class="modal-content" style="max-width: 800px; max-height: 85vh; overflow-y: auto;">
                <div class="modal-header">
                    <h2>NOTES DE VERSION</h2>
                    <button id="close-notes" class="btn btn--ghost">Fermer</button>
                </div>
                <div class="modal-body markdown-content" style="padding: 20px; line-height: 1.6; color: var(--color-text-secondary);">
                    ${this.loading ? '<div class="loader">Chargement...</div>' : this.currentNotes}
                </div>
            </div>
        </div>
      </div>
    `;
  }

  renderFullArticle() {
    const article = this.selectedArticle;
    return `
      <div class="page anim-fade-in">
        <div class="page__header">
            <button id="btn-back-news" class="btn btn--ghost" style="margin-bottom: 10px;">⬅️ Retour aux actualités</button>
            <div class="row row--between">
                <h1 class="section-title" style="font-size: 1.8rem;">${article.title}</h1>
                <span class="badge ${article.type === 'event' ? 'badge--epic' : 'badge--common'}">
                  ${article.type === 'event' ? '🎉 Événement' : '📋 Mise à jour'}
                </span>
            </div>
            <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 5px;">Publié le ${article.date}</div>
        </div>

        <div class="card" style="padding: 30px; line-height: 1.8;">
            ${article.summary ? `<p style="font-size: 1.1rem; color: var(--color-text-primary); font-weight: 600; margin-bottom: 25px; border-left: 4px solid var(--color-accent-blue); padding-left: 15px;">${article.summary}</p>` : ''}
            
            <div class="stack" style="gap: 15px; color: var(--color-text-secondary); font-size: 1rem;">
                ${article.content.map(line => `<div>${line}</div>`).join('')}
            </div>

            ${article.version ? `
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--color-border); text-align: center;">
                    <button class="btn btn--purple news-title--link" data-version="${article.version}">📂 Voir les notes techniques (${article.version})</button>
                </div>
            ` : ''}
        </div>
      </div>
    `;
  }

  async openNotes(version) {
    if (!version) return;
    this.loading = true;
    this.showNotes = true;
    this.refresh();

    try {
      const response = await fetch(`./notes/${version}.md`);
      if (response.ok) {
        const text = await response.text();
        this.currentNotes = parseMarkdown(text);
      } else {
        this.currentNotes = `<p style="color:red">Erreur lors du chargement des notes pour ${version}</p>`;
      }
    } catch (e) {
      this.currentNotes = `<p style="color:red">Erreur technique : ${e.message}</p>`;
    } finally {
      this.loading = false;
      this.refresh();
    }
  }

  afterRender() {
    // Search
    const searchInput = document.getElementById('news-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value;
        this.currentPage = 1;
        this.refresh();
        // Garder le focus
        const newInput = document.getElementById('news-search');
        newInput.focus();
        newInput.setSelectionRange(this.searchTerm.length, this.searchTerm.length);
      });
    }

    // Pagination
    document.getElementById('prev-page')?.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.refresh();
      }
    });
    document.getElementById('next-page')?.addEventListener('click', () => {
      this.currentPage++;
      this.refresh();
    });

    // Open full article
    document.querySelectorAll('.card').forEach((card, i) => {
      if (this.selectedArticle) return;
      const index = (this.currentPage - 1) * this.pageSize + i;
      card.onclick = (e) => {
        if (e.target.closest('.news-title--link')) return; // Don't trigger if clicking version link
        const adminNews = this.app.adminManager?.config?.customNews || [];
        const allNews = [...adminNews, ...NEWS_ARTICLES];
        const filtered = allNews.filter(article => {
          if (!this.searchTerm) return true;
          const search = this.searchTerm.toLowerCase();
          return article.title.toLowerCase().includes(search) ||
            (article.summary && article.summary.toLowerCase().includes(search)) ||
            (article.version && article.version.toLowerCase().includes(search));
        });
        this.selectedArticle = filtered[index];
        this.refresh();
      };
    });

    document.getElementById('btn-back-news')?.addEventListener('click', () => {
      this.selectedArticle = null;
      this.refresh();
    });

    // Version links
    document.querySelectorAll('.news-title--link').forEach(link => {
      link.onclick = (e) => {
        e.stopPropagation();
        const version = link.dataset.version;
        this.openNotes(version);
      };
    });

    document.getElementById('close-notes')?.addEventListener('click', () => {
      this.showNotes = false;
      this.refresh();
    });
  }

  refresh() {
    const container = document.getElementById('page-container');
    if (container) {
      container.innerHTML = this.render();
      this.afterRender();
    }
  }
}
