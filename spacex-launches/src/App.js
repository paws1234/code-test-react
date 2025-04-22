import React, { useState } from 'react';
import LaunchList from './components/LaunchList';
import Search from './components/Search';
import './styles.css';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="space-text">SPACEX-</span> 
            <span className="launches-text">LAUNCHES</span>
          </h1>
          <div className="search-container">
            <Search onSearch={handleSearch} />
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <div className="launches-container">
          <LaunchList searchTerm={searchTerm} />
        </div>
      </main>
      
      <footer className="app-footer">
        <p>Space launch data provided by SpaceX API</p>
      </footer>
    </div>
  );
};

export default App;