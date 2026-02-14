import { useState, useEffect } from 'react';
import api from '../config/api';
import toast from 'react-hot-toast';

const Expenditures = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [assets, setAssets] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    disposalMethod: ''
  });
  const [formData, setFormData] = useState({
    assetId: '',
    expenditureDate: new Date().toISOString().split('T')[0],
    reason: '',
    disposalMethod: 'destroyed',
    disposalValue: 0,
    notes: ''
  });

  useEffect(() => {
    fetchExpenditures();
    fetchAvailableAssets();
  }, [filters]);

  const fetchAvailableAssets = async () => {
    try {
      const response = await api.get('/assets?status=available,assigned');
      setAssets(response.data.data?.assets || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const fetchExpenditures = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.disposalMethod) params.append('disposalMethod', filters.disposalMethod);

      const response = await api.get(`/expenditures?${params.toString()}`);
      setExpenditures(response.data.data.expenditures);
    } catch (error) {
      toast.error('Failed to fetch expenditures');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenditures', formData);
      toast.success('Asset marked as expended successfully');
      setShowForm(false);
      setFormData({
        assetId: '',
        expenditureDate: new Date().toISOString().split('T')[0],
        reason: '',
        disposalMethod: 'destroyed',
        disposalValue: 0,
        notes: ''
      });
      fetchExpenditures();
      fetchAvailableAssets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark asset as expended');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Expenditures</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          {showForm ? 'Cancel' : '+ Mark as Expended'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Mark Asset as Expended</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset</label>
                <select
                  required
                  value={formData.assetId}
                  onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Asset</option>
                  {assets.map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.serialNumber} - {asset.equipmentType?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expenditure Date</label>
                <input
                  type="date"
                  required
                  value={formData.expenditureDate}
                  onChange={(e) => setFormData({ ...formData, expenditureDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disposal Method</label>
                <select
                  required
                  value={formData.disposalMethod}
                  onChange={(e) => setFormData({ ...formData, disposalMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="destroyed">Destroyed</option>
                  <option value="sold">Sold</option>
                  <option value="scrapped">Scrapped</option>
                  <option value="lost">Lost</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disposal Value</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.disposalValue}
                  onChange={(e) => setFormData({ ...formData, disposalValue: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="3"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="3"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Mark as Expended
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disposal Method</label>
            <select
              value={filters.disposalMethod}
              onChange={(e) => setFilters({ ...filters, disposalMethod: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Methods</option>
              <option value="destroyed">Destroyed</option>
              <option value="sold">Sold</option>
              <option value="scrapped">Scrapped</option>
              <option value="lost">Lost</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expenditures Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disposal Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disposal Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marked By</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : expenditures.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">No expenditures found</td>
                </tr>
              ) : (
                expenditures.map((expenditure) => (
                  <tr key={expenditure.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(expenditure.expenditureDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expenditure.asset?.serialNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {expenditure.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 rounded bg-red-100 text-red-800 capitalize">
                        {expenditure.disposalMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${expenditure.disposalValue?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expenditure.marker?.fullName || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Expenditures;
