import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout.tsx';
import Home from './home/home.tsx';
import Dashboard from './dashboard/dashboard.tsx';
import Analytics from './analytics/analytics.tsx';
import Journeaux from './journeaux/journeaux.tsx';
import Data from './data/data.tsx';
import DataBrands from './data/brands/brands.tsx';
import DataUsers from './data/users/users.tsx';
import DataModels from './data/models/models.tsx';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/journeaux" element={<Journeaux />} />
          <Route path="/data" element={<Data />} />
          <Route path="/data/brands" element={<DataBrands />} />
          <Route path="/data/users" element={<DataUsers />} />
          <Route path="/data/models" element={<DataModels />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
