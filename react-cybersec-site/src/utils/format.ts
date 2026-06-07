export function formatMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/^#{1,3} (.+)$/gm, '<strong>$1</strong>')
    .replace(/\b(Critical|CRITICAL)\b/g, '<span class="severity-critical">$1</span>')
    .replace(/\b(High|HIGH)\b/g, '<span class="severity-high">$1</span>')
    .replace(/\b(Medium|MEDIUM)\b/g, '<span class="severity-medium">$1</span>')
    .replace(/\b(Low|LOW|Informational|INFO)\b/g, '<span class="severity-low">$1</span>')
    .replace(/\b(CVE-\d{4}-\d+)\b/g, '<span class="cve-link">$1</span>')
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre><code class="code-block">${code}</code></pre>`;
    })
    .replace(/\n/g, '<br />');
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getCurrentTimestamp(): number {
  return Date.now();
}
