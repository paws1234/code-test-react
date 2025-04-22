import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term); 
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by mission name"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default Search;
