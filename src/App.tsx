import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import Home from './home/home.tsx';
import Dashboard from './dashboard/dashboard.tsx';
import Analytics from './analytics/analytics.tsx';
import journeaux from './journeaux/journeaux';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/journeaux" element={<journeaux />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
