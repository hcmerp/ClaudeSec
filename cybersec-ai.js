const SYSTEM_PROMPT = `You are an elite cybersecurity consultant, malware analyst, cloud security architect, Red Hat engineer, OSINT investigator, incident responder, and penetration testing mentor.

Your purpose is to help users understand, analyze, secure, troubleshoot, and improve systems while maintaining strict adherence to legal, ethical, and defensive security principles.

Core principles:
1. Prioritize security, safety, legality, and accuracy.
2. Assume all activities require proper authorization.
3. Focus on defense, detection, hardening, analysis, and education.
4. Refuse assistance that facilitates unauthorized access, malware deployment, or real-world offensive operations.
5. Explain not only what to do, but why it works.

Technical expertise: Linux (RHEL, Ubuntu, Debian), Windows AD, macOS, AWS/Azure/GCP cloud security, OSINT, malware analysis, penetration testing support (authorized/lab only), detection engineering (Sigma, YARA, SIEM), incident response, MITRE ATT&CK/D3FEND, NIST CSF, CIS Benchmarks, OWASP, Zero Trust.

Response style: Be practical and methodical. Use markdown-style formatting for headers and code blocks. For findings, include severity ratings (Critical/High/Medium/Low). Keep responses focused and actionable.`;

let history = [];
let busy = false;
let apiKey = '';

// Load saved API key from localStorage
window.addEventListener('DOMContentLoaded', () => {
  const savedKey = localStorage.getItem('cybersec_api_key');
  if (savedKey) {
    document.getElementById('api-key').value = savedKey;
    apiKey = savedKey;
    document.getElementById('status-badge').textContent = '● READY';
    document.getElementById('status-badge').style.background = '#1a3a1a';
    document.getElementById('status-badge').style.color = '#3fb950';
    document.getElementById('status-badge').style.border = '1px solid #238636';
    appendSystem('API key loaded from storage. Terminal ready.');
  }
});

function saveKey() {
  const val = document.getElementById('api-key').value.trim();
  if (!val.startsWith('sk-ant-')) {
    alert('That doesn\'t look like a valid Anthropic API key (should start with sk-ant-)');
    return;
  }
  apiKey = val;
  localStorage.setItem('cybersec_api_key', val);
  document.getElementById('status-badge').textContent = '● READY';
  document.getElementById('status-badge').style.background = '#1a3a1a';
  document.getElementById('status-badge').style.color = '#3fb950';
  document.getElementById('status-badge').style.border = '1px solid #238636';
  appendSystem('API key saved. Terminal ready.');
}

function scrollBottom() {
  const o = document.getElementById('output');
  o.scrollTop = o.scrollHeight;
}

function appendSystem(msg) {
  const o = document.getElementById('output');
  const d = document.createElement('div');
  d.style.cssText = 'color:#3fb950;font-size:12px;margin:8px 0;font-family:JetBrains Mono,monospace;';
  d.textContent = '// ' + msg;
  o.appendChild(d);
  scrollBottom();
}

function appendUser(text) {
  const o = document.getElementById('output');
  const d = document.createElement('div');
  d.className = 'msg-user';
  d.textContent = text;
  o.appendChild(d);
  scrollBottom();
}

function appendThinking() {
  const o = document.getElementById('output');
  const d = document.createElement('div');
  d.className = 'thinking';
  d.id = 'thinking-indicator';
  d.textContent = 'processing...';
  o.appendChild(d);
  scrollBottom();
}

function removeThinking() {
  const t = document.getElementById('thinking-indicator');
  if (t) t.remove();
}

function formatResponse(text) {
  const div = document.createElement('div');
  div.className = 'msg-assistant';
  let html = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`\n]+)`/g, '<span class="value">$1</span>')
    .replace(/^#{1,3} (.+)$/gm, '<strong>$1</strong>')
    .replace(/\b(Critical|CRITICAL)\b/g, '<span class="crit">$1</span>')
    .replace(/\b(High|HIGH)\b/g, '<span class="crit">$1</span>')
    .replace(/\b(Medium|MEDIUM)\b/g, '<span class="warn">$1</span>')
    .replace(/\b(Low|LOW|Informational|INFO)\b/g, '<span class="ok">$1</span>')
    .replace(/\b(CVE-\d{4}-\d+)\b/g, '<span class="kw">$1</span>');
  div.innerHTML = html;
  return div;
}

async function ask(question) {
  if (busy) return;
  document.getElementById('user-input').value = question;
  sendMsg();
}

async function sendMsg() {
  if (busy) return;
  if (!apiKey) { alert('Please enter and save your API key first.'); return; }

  const input = document.getElementById('user-input');
  const btn = document.getElementById('send-btn');
  const text = input.value.trim();
  if (!text) return;

  busy = true;
  input.value = '';
  btn.disabled = true;
  btn.textContent = '...';

  appendUser(text);
  history.push({ role: 'user', content: text });
  appendThinking();

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: document.getElementById('model-select').value,
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: history
      })
    });

    const data = await res.json();
    removeThinking();

    if (data.error) {
      const o = document.getElementById('output');
      const d = document.createElement('div');
      d.className = 'err-msg';
      d.textContent = 'API error: ' + data.error.message;
      o.appendChild(d);
    } else {
      const reply = data.content?.find(b => b.type === 'text')?.text || 'No response.';
      history.push({ role: 'assistant', content: reply });
      const o = document.getElementById('output');
      o.appendChild(formatResponse(reply));
    }
    scrollBottom();
  } catch (err) {
    removeThinking();
    const o = document.getElementById('output');
    const d = document.createElement('div');
    d.className = 'err-msg';
    d.textContent = 'Connection error: ' + err.message;
    o.appendChild(d);
    scrollBottom();
  }

  busy = false;
  btn.disabled = false;
  btn.textContent = 'RUN';
  input.focus();
}

document.getElementById('user-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMsg();
});