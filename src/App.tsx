import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import Layout from "./components/layout";
import Home from "./home/home";
import Dashboard from "./dashboard/dashboard";
import Analytics from "./analytics/analytics";
import Journeaux from "./journeaux/journeaux";
import Tables from './tables/tables.tsx'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/journeaux" element={<Journeaux />} />
            <Route path="/tables" element={<Tables />} />
          </Routes>
        </Layout>
      </Router>
    </SessionContextProvider>
  );
}

export default App;