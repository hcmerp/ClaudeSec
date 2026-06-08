import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { ApiKeyBar } from './components/ApiKeyBar';
import { Terminal } from './pages/Terminal';
import { RedTeam } from './pages/RedTeam';
import { BlueTeam } from './pages/BlueTeam';
import { WebAnalysis } from './pages/WebAnalysis';
import { MalwareAnalysis } from './pages/MalwareAnalysis';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="wrapper">
          <Sidebar />
          <main className="main-content">
            <ApiKeyBar />
            <Routes>
              <Route path="/" element={<Terminal />} />
              <Route path="/redteam" element={<RedTeam />} />
              <Route path="/blueteam" element={<BlueTeam />} />
              <Route path="/web-analysis" element={<WebAnalysis />} />
              <Route path="/malware-analysis" element={<MalwareAnalysis />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
