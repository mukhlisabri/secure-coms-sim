import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import RailFence from './pages/RailFence';
import DiffieHellman from './pages/DiffieHellman';
import MITM from './pages/MITM';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mission/rail-fence" element={<RailFence />} />
          <Route path="/mission/diffie-hellman" element={<DiffieHellman />} />
          <Route path="/mission/mitm" element={<MITM />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
