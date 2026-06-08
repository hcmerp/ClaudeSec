import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Add copyCode function to global scope
;(window as any).copyCode = (codeId: string) => {
  const codeElement = document.getElementById(codeId);
  if (codeElement) {
    const text = codeElement.textContent || '';
    navigator.clipboard.writeText(text).then(() => {
      // Find the button and update it
      const button = document.querySelector(`button[onclick="copyCode('${codeId}')"]`) as HTMLButtonElement;
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✓ Copied!';
        button.disabled = true;
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy code:', err);
    });
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
