import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/layouts';
import Dashboard from './pages/dashboard';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Add other routes here */}
        </Routes>
      </Layout>
    </Router>
  );
}