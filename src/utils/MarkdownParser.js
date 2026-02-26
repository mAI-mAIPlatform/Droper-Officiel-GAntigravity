/* ============================
   DROPER — Simple Markdown Parser
   ============================ */

export function parseMarkdown(md) {
    if (!md) return '';

    let lines = md.split('\n');
    let htmlLines = [];
    let inList = false;

    for (let line of lines) {
        let trimmed = line.trim();

        // Horizontal Rule
        if (trimmed === '---') {
            if (inList) { htmlLines.push('</ul>'); inList = false; }
            htmlLines.push('<hr>');
            continue;
        }

        // Headings
        if (trimmed.startsWith('# ')) {
            if (inList) { htmlLines.push('</ul>'); inList = false; }
            htmlLines.push(`<h1>${trimmed.slice(2)}</h1>`);
            continue;
        }
        if (trimmed.startsWith('## ')) {
            if (inList) { htmlLines.push('</ul>'); inList = false; }
            htmlLines.push(`<h2>${trimmed.slice(3)}</h2>`);
            continue;
        }
        if (trimmed.startsWith('### ')) {
            if (inList) { htmlLines.push('</ul>'); inList = false; }
            htmlLines.push(`<h3>${trimmed.slice(4)}</h3>`);
            continue;
        }

        // List items
        const isListItem = trimmed.startsWith('- ') || /^\d+\. /.test(trimmed);
        if (isListItem) {
            if (!inList) {
                htmlLines.push('<ul>');
                inList = true;
            }
            const content = trimmed.replace(/^- |\d+\. /, '');
            htmlLines.push(`<li>${processInlines(content)}</li>`);
            continue;
        }

        if (inList && trimmed === '') {
            htmlLines.push('</ul>');
            inList = false;
            continue;
        }

        if (trimmed === '') {
            htmlLines.push('<br>');
        } else {
            if (inList) { htmlLines.push('</ul>'); inList = false; }
            htmlLines.push(`<p>${processInlines(trimmed)}</p>`);
        }
    }

    if (inList) htmlLines.push('</ul>');

    return htmlLines.join('\n');
}

function processInlines(text) {
    let html = text;
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
    return html;
}
