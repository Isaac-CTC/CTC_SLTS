import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function HomePage() {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalItems: 0,
    pendingItems: 0,
    fulfilledItems: 0,
  });
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:2007';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/items`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const items = response.data.items || [];
        const pending = items.filter((item) => item.status === 'Pending').length;
        const fulfilled = items.filter((item) => item.status === 'Fulfilled').length;

        setStats({
          totalItems: items.length,
          pendingItems: pending,
          fulfilledItems: fulfilled,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome, {user?.fullName}!
          </h1>
          <p className="text-gray-600">
            Manage your shopping list efficiently
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Items Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Items</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats.totalItems}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4l1-12z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Items Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Items</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {stats.pendingItems}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg
                  className="h-8 w-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Fulfilled Items Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Fulfilled Items</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats.fulfilledItems}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Start</h2>
          <p className="text-gray-600 mb-4">
            Get started by adding a new item to your shopping list or viewing your existing items.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a
              href="/new-item"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Add New Item
            </a>
            <a
              href="/view-items"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              View All Items
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
