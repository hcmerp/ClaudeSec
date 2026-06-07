import React, { useState, useEffect } from 'react';
import { AnalysisResult } from '../types';

interface Platform {
  id: string;
  name: string;
  status: string;
  description: string;
  requiresKey: boolean;
  icon: string;
}

const PLATFORMS: Platform[] = [
  {
    id: 'virustotal',
    name: 'VirusTotal',
    status: 'Multi-AV',
    description: '70+ antivirus engines • Community scans • File reputation',
    requiresKey: true,
    icon: '🦠',
  },
  {
    id: 'hybrid-analysis',
    name: 'Hybrid Analysis',
    status: 'Sandbox',
    description: 'CrowdStrike sandbox • Dynamic analysis • ATT&CK mapping',
    requiresKey: true,
    icon: '🔬',
  },
  {
    id: 'malwarebazaar',
    name: 'MalwareBazaar',
    status: 'Database',
    description: 'Known malware hashes • Family identification • No API key needed',
    requiresKey: false,
    icon: '🗄️',
  },
];

export const FileAnalysis: React.FC = () => {
  const [selectedFile, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string>('');
  const [isComputingHash, setIsComputingHash] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [apiKeys, setApiKeys] = useState({ virustotal: '', hybridAnalysis: '' });
  const [showApiModal, setShowApiModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Load API keys from localStorage on mount
  useEffect(() => {
    const vtKey = localStorage.getItem('virustotal_api_key');
    const haKey = localStorage.getItem('hybrid_analysis_api_key');
    if (vtKey) setApiKeys(prev => ({ ...prev, virustotal: vtKey }));
    if (haKey) setApiKeys(prev => ({ ...prev, hybridAnalysis: haKey }));
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    // File size validation (32MB limit)
    const maxSize = 32 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 32MB limit. Please select a smaller file.');
      return;
    }

    setFile(file);
    setIsComputingHash(true);

    try {
      const hash = await computeSHA256(file);
      setFileHash(hash);
    } catch (error) {
      console.error('Hash computation error:', error);
    } finally {
      setIsComputingHash(false);
    }
  };

  const computeSHA256 = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const copyHashToClipboard = () => {
    navigator.clipboard.writeText(fileHash);
  };

  const removeFile = () => {
    setFile(null);
    setFileHash('');
    setSelectedPlatforms([]);
    setResults([]);
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const saveApiKeys = () => {
    if (apiKeys.virustotal) {
      localStorage.setItem('virustotal_api_key', apiKeys.virustotal);
    }
    if (apiKeys.hybridAnalysis) {
      localStorage.setItem('hybrid_analysis_api_key', apiKeys.hybridAnalysis);
    }
    setShowApiModal(false);
  };

  const analyzeFile = async () => {
    if (selectedPlatforms.length === 0) return;

    // Check for required API keys
    const needsVTKey = selectedPlatforms.includes('virustotal') && !apiKeys.virustotal;
    const needsHAKey = selectedPlatforms.includes('hybrid-analysis') && !apiKeys.hybridAnalysis;

    if (needsVTKey || needsHAKey) {
      setShowApiModal(true);
      return;
    }

    setIsAnalyzing(true);
    setResults(
      selectedPlatforms.map(platform => ({
        platform,
        status: 'pending',
      }))
    );

    // Run analysis in parallel
    const analysisPromises = selectedPlatforms.map(platform =>
      analyzePlatform(platform, fileHash, selectedFile)
    );

    const analysisResults = await Promise.allSettled(analysisPromises);

    setResults(
      analysisResults.map((result, index) => {
        const platform = selectedPlatforms[index];
        if (result.status === 'fulfilled') {
          return { platform, ...result.value };
        }
        return { platform, status: 'error', error: result.reason?.message || 'Analysis failed' };
      })
    );

    setIsAnalyzing(false);
  };

  const analyzePlatform = async (
    platform: string,
    hash: string,
    file: File | null
  ): Promise<AnalysisResult> => {
    // Simulate API call (replace with actual API calls)
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (platform === 'virustotal') {
      // Call VirusTotal API
      return {
        platform,
        status: 'success',
        data: {
          detections: 5,
          totalEngines: 70,
          lastAnalysis: new Date().toISOString(),
        },
      };
    }

    if (platform === 'hybrid-analysis') {
      return {
        platform,
        status: 'success',
        data: {
          threatScore: 'High',
          verdict: 'Malicious',
          tactics: ['Command and Control', 'Exfiltration'],
        },
      };
    }

    if (platform === 'malwarebazaar') {
      return {
        platform,
        status: 'success',
        data: {
          found: true,
          family: 'Agent Tesla',
          tags: ['stealer', 'keylogger'],
        },
      };
    }

    return { platform, status: 'error', error: 'Unknown platform' };
  };

  const resetAnalysis = () => {
    removeFile();
  };

  const platformName = (id: string) => PLATFORMS.find(p => p.id === id)?.name || id;

  return (
    <div className="content-area">
      <div className="upload-container">
        {/* Header */}
        <div className="upload-header">
          <h1>☣ Malware File Analysis</h1>
          <p className="subtitle">Upload and analyze suspicious files against multiple threat intelligence platforms</p>
        </div>

        {/* Security Notice */}
        <div className="security-notice">
          <span className="notice-icon">⚠</span>
          <span className="notice-text">
            <strong>Security Notice:</strong> Do not upload files containing real personal data, credentials, or sensitive information.
          </span>
        </div>

        {/* File Upload Zone */}
        {!selectedFile && (
          <div
            className={`upload-zone ${dragActive ? 'dragover' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input type="file" id="fileInput" className="file-input" accept="*/*" onChange={handleFileChange} />
            <div className="upload-content">
              <div className="upload-icon">📁</div>
              <h3>Drop file here or click to browse</h3>
              <p>Any file type • Max 32MB • SHA256 computed client-side</p>
            </div>
          </div>
        )}

        {/* File Info Display */}
        {selectedFile && (
          <>
            <div className="file-info">
              <div className="file-details">
                <div className="file-name">
                  <span className="label">File:</span>
                  <span className="value">{selectedFile.name}</span>
                </div>
                <div className="file-size">
                  <span className="label">Size:</span>
                  <span className="value">{formatFileSize(selectedFile.size)}</span>
                </div>
                <div className="file-type">
                  <span className="label">Type:</span>
                  <span className="value">{selectedFile.type || 'Unknown type'}</span>
                </div>
              </div>
              <div className="file-hash">
                <span className="label">SHA256:</span>
                <span className="hash-value">{isComputingHash ? 'Computing...' : fileHash}</span>
                {!isComputingHash && (
                  <button className="copy-btn" onClick={copyHashToClipboard} title="Copy to clipboard">
                    📋
                  </button>
                )}
              </div>
              <button className="remove-file-btn" onClick={removeFile}>
                ✕ Remove File
              </button>
            </div>

            {/* Platform Selection */}
            {fileHash && !isComputingHash && (
              <div className="platform-section">
                <h3>Select Analysis Platforms</h3>
                <p className="platform-instructions">Click to select one or more platforms for analysis</p>
                <div className="platform-grid">
                  {PLATFORMS.map(platform => (
                    <label
                      key={platform.id}
                      className={`platform-card ${selectedPlatforms.includes(platform.id) ? 'selected' : ''}`}
                      onClick={() => togglePlatform(platform.id)}
                    >
                      <div className="platform-content">
                        <div className="platform-header">
                          <span className="platform-icon">{platform.icon}</span>
                          <div>
                            <span className="platform-name">{platform.name}</span>
                            <span className="platform-status">{platform.status}</span>
                          </div>
                          <span className="selection-indicator">{selectedPlatforms.includes(platform.id) ? '☑' : '☐'}</span>
                        </div>
                        <p className="platform-description">{platform.description}</p>
                        <div className={`platform-badge ${!platform.requiresKey ? 'platform-badge-free' : ''}`}>
                          {platform.requiresKey ? 'API Key Required' : 'Free'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Analyze Button */}
            {selectedPlatforms.length > 0 && (
              <div className="analyze-section">
                <div className="platform-summary">
                  <span className="summary-label">
                    Selected: <span id="selectedCount">{selectedPlatforms.length}</span>
                  </span>
                  <div className="summary-platforms">
                    {selectedPlatforms.map(p => (
                      <span key={p} className="summary-platform-tag">
                        {p === 'virustotal' ? 'VT' : p === 'hybrid-analysis' ? 'HA' : 'MB'}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="analyze-btn" onClick={analyzeFile} disabled={isAnalyzing}>
                  {isAnalyzing ? 'Analyzing...' : 'Analyze File'}
                </button>
              </div>
            )}

            {/* Results Section */}
            {results.length > 0 && (
              <div className="results-section">
                <h2>Analysis Results</h2>
                <div className="results-container">
                  {results.map((result, index) => (
                    <div
                      key={result.platform}
                      className={`result-card ${result.status === 'success' ? 'success' : result.status === 'error' ? 'error' : 'pending'}`}
                    >
                      <div className="result-header">
                        <div className="result-platform">
                          <span className="platform-icon">{PLATFORMS.find(p => p.id === result.platform)?.icon}</span>
                          <span>{platformName(result.platform)}</span>
                        </div>
                        <div className={`result-status ${result.status}`}>
                          {result.status === 'loading' && <div className="spinner"></div>}
                          {result.status === 'pending' && 'Initializing...'}
                          {result.status === 'success' && '✓ Complete'}
                          {result.status === 'error' && '✗ Failed'}
                        </div>
                      </div>
                      {result.status === 'success' && result.data && (
                        <div className="result-body">
                          <pre>{JSON.stringify(result.data, null, 2)}</pre>
                          {result.url && (
                            <a href={result.url} target="_blank" rel="noopener noreferrer" className="view-report-link">
                              View Full Report →
                            </a>
                          )}
                        </div>
                      )}
                      {result.status === 'error' && (
                        <div className="result-body">
                          <div className="error-message">{result.error}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button className="new-analysis-btn" onClick={resetAnalysis}>
                  Start New Analysis
                </button>
              </div>
            )}
          </>
        )}

        {/* API Keys Modal */}
        {showApiModal && (
          <div className="modal-overlay" onClick={() => setShowApiModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>API Keys Required</h2>
              <p>Some selected platforms require API keys. Enter your keys below:</p>
              <div className="api-key-inputs">
                <div className="api-key-group">
                  <label>VirusTotal API Key</label>
                  <input
                    type="password"
                    value={apiKeys.virustotal}
                    onChange={e => setApiKeys(prev => ({ ...prev, virustotal: e.target.value }))}
                    placeholder="Enter your VirusTotal API key"
                  />
                </div>
                <div className="api-key-group">
                  <label>Hybrid Analysis API Key</label>
                  <input
                    type="password"
                    value={apiKeys.hybridAnalysis}
                    onChange={e => setApiKeys(prev => ({ ...prev, hybridAnalysis: e.target.value }))}
                    placeholder="Enter your Hybrid Analysis API key"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button className="modal-btn modal-btn-cancel" onClick={() => setShowApiModal(false)}>
                  Cancel
                </button>
                <button className="modal-btn modal-btn-save" onClick={saveApiKeys}>
                  Save & Analyze
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
