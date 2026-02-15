
import { useState } from 'react';
import './App.css';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ConnectWallet from './components/ConnectWallet';
import EventList from './components/EventList';
import CreateEvent from './components/CreateEvent';
import MyTickets from './components/MyTickets';
import LandingPage from './components/LandingPage';

function App() {
  const [account, setAccount] = useState(null);
  const location = useLocation();

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="logo-section">
            <h1><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>DeTiX</Link></h1>
            <p>Decentralized Event Ticketing</p>
          </div>
          <nav>
            <Link to="/events" className="nav-link">Events</Link>
            <Link to="/create" className="nav-link">Create Event</Link>
            <Link to="/my-tickets" className="nav-link" style={{ marginLeft: '1rem' }}>My Tickets</Link>
          </nav>
        </div>
        <ConnectWallet setAccount={setAccount} />
      </header>

      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/events" element={<EventList account={account} />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/my-tickets" element={<MyTickets account={account} />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
