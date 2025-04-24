import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, resetFilters,selectFilters, setSortConfig ,selectSortConfig} from '../features/crypto/cryptoSlice';

export default function Controls() {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const sortConfig = useSelector(selectSortConfig);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e) => {
    dispatch(setFilters({ searchTerm: e.target.value }));
  };

  const handlePriceChange = (min, max) => {
    dispatch(setFilters({ priceRange: [min, max] }));
  };

  const handleMarketCapChange = (min, max) => {
    dispatch(setFilters({ marketCapRange: [min, max] }));
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    dispatch(setSortConfig({ key, direction }));
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="w-full sm:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-violet-200 border-2 border-violet-300  hover:bg-violet-300 rounded-lg transition"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button
            onClick={() => dispatch(resetFilters())}
            className="px-4 py-2 bg-violet-200 border-2 border-violet-300 hover:bg-violet-300 rounded-lg transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Price Range (USD)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange[1])}
                  className="w-24 px-2 py-1 border rounded"
                  min="0"
                />
                <span>to</span>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(filters.priceRange[0], Number(e.target.value))}
                  className="w-24 px-2 py-1 border rounded"
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Market Cap Range (USD)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={filters.marketCapRange[0]}
                  onChange={(e) => handleMarketCapChange(Number(e.target.value), filters.marketCapRange[1])}
                  className="w-24 px-2 py-1 border rounded"
                  min="0"
                />
                <span>to</span>
                <input
                  type="number"
                  value={filters.marketCapRange[1]}
                  onChange={(e) => handleMarketCapChange(filters.marketCapRange[0], Number(e.target.value))}
                  className="w-24 px-2 py-1 border rounded"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="font-medium mr-2">Sort by:</span>
        <button
          onClick={() => handleSort('rank')}
          className={`px-3 py-1 rounded-full text-sm ${sortConfig.key === 'rank' ? 'bg-blue-100 text-violet-800' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Rank {getSortIndicator('rank')}
        </button>
        <button
          onClick={() => handleSort('price')}
          className={`px-3 py-1 rounded-full text-sm ${sortConfig.key === 'price' ? 'bg-blue-100 text-violet-800' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Price {getSortIndicator('price')}
        </button>
        <button
          onClick={() => handleSort('priceChange24h')}
          className={`px-3 py-1 rounded-full text-sm ${sortConfig.key === 'priceChange24h' ? 'bg-blue-100 text-violet-800' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          24h Change {getSortIndicator('priceChange24h')}
        </button>
        <button
          onClick={() => handleSort('marketCap')}
          className={`px-3 py-1 rounded-full text-sm ${sortConfig.key === 'marketCap' ? 'bg-blue-100 text-violet-800' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Market Cap {getSortIndicator('marketCap')}
        </button>
      </div>
    </div>
  );
}