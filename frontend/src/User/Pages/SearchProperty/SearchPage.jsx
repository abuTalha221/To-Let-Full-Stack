import React, { useState } from 'react';
import SearchProperty from './SearchProperty';
import FindHouse from './FindHouse';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useState({
    district: '',
    area: '',
  });

  const handleSearch = (district, area) => {
    setSearchParams({ district, area });
  };

  return (
    <div>
      <SearchProperty onSearch={handleSearch} />
      <FindHouse district={searchParams.district} area={searchParams.area} />
    </div>
  );
};

export default SearchPage;
