import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ViewItemsPage() {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, fulfilled
  const [searchQuery, setSearchQuery] = useState('');

  const API_BASE_URL = 'http://localhost:2007';

  useEffect(() => {
    fetchItems();
  }, [token]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkFulfilled = async (itemId) => {
    try {
      await axios.put(
        `${API_BASE_URL}/items/${itemId}`,
        { status: 'Fulfilled' },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Item marked as fulfilled!');
      fetchItems();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update item';
      toast.error(message);
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${API_BASE_URL}/items/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Item deleted successfully!');
        fetchItems();
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete item';
        toast.error(message);
        console.error('Error deleting item:', error);
      }
    }
  };

  // Filter items based on status and search
  const filteredItems = items.filter((item) => {
    const matchesStatus =
      filterStatus === 'all' ||
      item.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pb-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">View Items</h1>
          <p className="text-gray-600">Manage your shopping list</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Pending ({items.filter((i) => i.status === 'Pending').length})
            </button>
            <button
              onClick={() => setFilterStatus('fulfilled')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === 'fulfilled'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Fulfilled ({items.filter((i) => i.status === 'Fulfilled').length})
            </button>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              {items.length === 0
                ? 'No items yet. Start by adding a new item!'
                : 'No items match your search.'}
            </p>
            {items.length === 0 && (
              <a
                href="/new-item"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                ➕ Add Your First Item
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
              >
                {/* Card Header with Status */}
                <div
                  className={`px-6 py-4 ${
                    item.status === 'Fulfilled'
                      ? 'bg-green-50 border-b-2 border-green-300'
                      : 'bg-yellow-50 border-b-2 border-yellow-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Fulfilled'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-6 py-4 space-y-3">
                  {item.description && (
                    <p className="text-gray-700 text-sm">{item.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Quantity</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {item.quantity}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Unit Price</p>
                      <p className="text-lg font-semibold text-gray-800">
                        ${parseFloat(item.unitPrice).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded p-3 border border-blue-200">
                    <p className="text-gray-600 text-xs font-medium">
                      Estimated Total Cost
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Card Footer with Actions */}
                <div className="px-6 py-4 border-t border-gray-200 flex gap-2">
                  {item.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => handleMarkFulfilled(item._id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        Fulfill
                      </button>
                      
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <div className="w-full text-center py-2 bg-gray-100 rounded-lg text-gray-600 font-medium">
                      Completed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
