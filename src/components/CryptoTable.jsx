import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setAssets, 
  updateAsset, 
  setLoading, 
  setError 
} from '../features/crypto/cryptoSlice';
import { fetchCryptoData, simulateWebSocketUpdates } from '../features/crypto/cryptoService';
import { useInterval } from '../hooks/useInterval';
import CryptoChart from './CryptoChart';
import Loader from './Loader';
import Controls from './Controls';
import { 
  selectFilteredAssets, 
  selectLoadingStatus, 
  selectError 
} from '../features/crypto/cryptoSlice';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function CryptoTable() {
  const dispatch = useDispatch();
  const assets = useSelector(selectFilteredAssets);
  const loading = useSelector(selectLoadingStatus);
  const error = useSelector(selectError);

  useEffect(() => {
    const loadInitialData = async () => {
      dispatch(setLoading(true));
      try {
        const data = await fetchCryptoData();
        dispatch(setAssets(data));
      } catch (err) {
        dispatch(setError(err.message));
      }
    };

    loadInitialData();
  }, [dispatch]);

  useInterval(() => {
    simulateWebSocketUpdates((id, updates) => {
      dispatch(updateAsset({ id, updates }));
    });
  }, 2000);

  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatCurrency = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatLargeNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return formatCurrency(num);
  };

  if (loading && !assets.length) return <Loader />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <Controls />
      
      {/* Mobile View (Cards) */}
      <div className="sm:hidden space-y-4">
        {assets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No assets match your filters</div>
        ) : (
          assets.map((asset) => (
            <div key={asset.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img className="h-8 w-8 rounded-full" src={asset.logo} alt={asset.name} />
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-gray-500 text-sm">{asset.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(asset.price)}</p>
                  <p className={`text-sm ${asset.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h}%
                  </p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Market Cap</p>
                  <p>{formatLargeNumber(asset.marketCap)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Volume (24h)</p>
                  <p>{formatLargeNumber(asset.volume24h)}</p>
                </div>
                <div>
                  <p className="text-gray-500">1h Change</p>
                  <p className={asset.priceChange1h >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {asset.priceChange1h >= 0 ? '+' : ''}{asset.priceChange1h}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">7d Change</p>
                  <p className={asset.priceChange7d >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {asset.priceChange7d >= 0 ? '+' : ''}{asset.priceChange7d}%
                  </p>
                </div>
              </div>
              
              <div className="mt-3 h-12">
                <CryptoChart sparkline={asset.sparkline} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wider">#</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wider">Name</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wider">Price</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wider">1h %</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wider">24h %</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wider">7d %</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wider">
                <div className="flex items-center gap-1">
                  Market Cap
                  <InformationCircleIcon className="h-4 w-4 text-gray-400" />
                </div></th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wider hidden lg:table-cell">
                <div className="flex items-center gap-1">
                  Volume(24h)
                  <InformationCircleIcon className="h-4 w-4 text-gray-400" />
                </div></th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wider hidden xl:table-cell">
                <div className="flex items-center gap-1">
                  Circulating Supply
                  <InformationCircleIcon className="h-4 w-4 text-grey-400" />
                </div></th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wider hidden xl:table-cell">Max Supply</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wider">Last 7 days</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-8 text-gray-500">
                  No assets match your filters
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{asset.rank}</td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6">
                        <img className="h-6 w-6 rounded-full" src={asset.logo} alt={asset.name} />
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                        <div className="text-sm text-gray-500">{asset.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(asset.price)}</td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm ${asset.priceChange1h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {asset.priceChange1h >= 0 ? '+' : ''}{asset.priceChange1h}%
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm ${asset.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h}%
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm ${asset.priceChange7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {asset.priceChange7d >= 0 ? '+' : ''}{asset.priceChange7d}%
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{formatLargeNumber(asset.marketCap)}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">{formatLargeNumber(asset.volume24h)}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell">
                    {formatNumber(asset.circulatingSupply)} {asset.symbol}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell">
                    {asset.maxSupply ? `${formatNumber(asset.maxSupply)} ${asset.symbol}` : '∞'}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="w-20">
                      <CryptoChart sparkline={asset.sparkline} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}