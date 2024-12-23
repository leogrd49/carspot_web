import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout.tsx';
import Home from './home/home.tsx';
import Dashboard from './dashboard/dashboard.tsx';
import Analytics from './analytics/analytics.tsx';
import Journeaux from './journeaux/journeaux.tsx';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/journeaux" element={<Journeaux />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
