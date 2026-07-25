'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Reservation, Order, MenuItem } from '@/lib/cafe/types';

type Tab = 'reservations' | 'orders' | 'menu';

interface Stats {
  totalOrders: number;
  totalReservations: number;
  totalMenuItems: number;
}

function getHeaders() {
  const apiKey = localStorage.getItem('apiKey');
  return {
    'Content-Type': 'application/json',
    'x-api-key': apiKey || '',
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('reservations');
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalReservations: 0,
    totalMenuItems: 0,
  });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('apiKey');
    router.push('/cafe/admin/login');
  }, [router]);

  const checkAuth = useCallback(
    (res: Response) => {
      if (res.status === 401) {
        logout();
        return true;
      }
      return false;
    },
    [logout]
  );

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/cafe-api/admin/stats', {
        headers: getHeaders(),
      });
      if (checkAuth(res)) return;
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [checkAuth]);

  const fetchReservations = useCallback(async () => {
    try {
      const res = await fetch('/api/cafe-api/admin/reservations', {
        headers: getHeaders(),
      });
      if (checkAuth(res)) return;
      const data = await res.json();
      if (data.success) {
        setReservations(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [checkAuth]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/cafe-api/admin/orders', {
        headers: getHeaders(),
      });
      if (checkAuth(res)) return;
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [checkAuth]);

  const fetchMenuAdmin = useCallback(async () => {
    try {
      const res = await fetch('/api/cafe-api/menu');
      const data = await res.json();
      if (data.success) {
        setMenuItems(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchReservations(),
        fetchOrders(),
        fetchMenuAdmin(),
      ]);
      setLoading(false);
    };
    loadAll();
  }, [fetchStats, fetchReservations, fetchOrders, fetchMenuAdmin]);

  const updateResStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/cafe-api/admin/reservations/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      fetchReservations();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/cafe-api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMenuItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await fetch(`/api/cafe-api/admin/menu/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      fetchMenuAdmin();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const addMenuItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form));
    try {
      await fetch('/api/cafe-api/admin/menu', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      form.reset();
      fetchMenuAdmin();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const sortedReservations = [...reservations].sort((a, b) =>
    a.status === 'pending' && b.status !== 'pending'
      ? -1
      : a.status !== 'pending' && b.status === 'pending'
        ? 1
        : 0
  );

  const sortedOrders = [...orders].sort((a, b) =>
    a.status === 'pending' && b.status !== 'pending'
      ? -1
      : a.status !== 'pending' && b.status === 'pending'
        ? 1
        : 0
  );

  const totalGuests = reservations
    .filter((r) => r.status === 'confirmed')
    .reduce((sum, r) => sum + r.guests, 0);
  const capacityPct = Math.min((totalGuests / 100) * 100, 100);
  const barColor =
    totalGuests >= 80
      ? 'var(--danger)'
      : totalGuests >= 50
        ? 'var(--warning)'
        : 'var(--success)';
  const capacityMsg =
    totalGuests >= 80
      ? 'Fully booked!'
      : totalGuests >= 50
        ? 'Busy day ahead.'
        : 'Plenty of space available.';

  const tabBtn = (tab: Tab, label: string) => (
    <button
      className={activeTab === tab ? 'active' : ''}
      onClick={() => setActiveTab(tab)}
    >
      {label}
    </button>
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        {tabBtn('reservations', 'Reservations')}
        {tabBtn('orders', 'Orders')}
        {tabBtn('menu', 'Menu Management')}
        <button
          onClick={logout}
          style={{ marginTop: 'auto', color: 'var(--danger)', border: '1px solid var(--danger)' }}
        >
          Logout
        </button>
      </aside>

      <main className="admin-main">
        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.totalOrders}</div>
            <div className="stat-label">Total Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalReservations}</div>
            <div className="stat-label">Reservations</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalMenuItems}</div>
            <div className="stat-label">Menu Items</div>
          </div>
        </div>

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div>
            <h2 className="admin-header">Reservations</h2>

            <div className="capacity-tracker">
              {loading ? (
                'Loading capacity...'
              ) : (
                <>
                  <p>
                    <strong>Today&apos;s Confirmed Guests:</strong> {totalGuests}
                  </p>
                  <div className="capacity-bar-container">
                    <div
                      className="capacity-bar"
                      style={{ width: `${capacityPct}%`, background: barColor }}
                    />
                  </div>
                  <p>{capacityMsg}</p>
                </>
              )}
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Guests</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReservations.length > 0 ? (
                    sortedReservations.map((r) => (
                      <tr key={r.id}>
                        <td>
                          {r.name}
                          <br />
                          <small>{r.email}</small>
                        </td>
                        <td>{r.date}</td>
                        <td>{r.time}</td>
                        <td>{r.guests}</td>
                        <td>
                          <span className={`status-badge status-${r.status}`}>
                            {r.status}
                          </span>
                        </td>
                        <td>
                          {r.status === 'pending' && (
                            <>
                              <button
                                className="cafe-btn cafe-btn-success cafe-btn-sm"
                                onClick={() => updateResStatus(r.id, 'confirmed')}
                              >
                                Confirm
                              </button>{' '}
                              <button
                                className="cafe-btn cafe-btn-danger cafe-btn-sm"
                                onClick={() => updateResStatus(r.id, 'cancelled')}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>No reservations yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="admin-header">Orders</h2>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.length > 0 ? (
                    sortedOrders.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <strong>{o.orderNumber}</strong>
                        </td>
                        <td>
                          {o.customerName}
                          <br />
                          <small>{o.customerPhone}</small>
                        </td>
                        <td>
                          {o.items
                            .map((i) => `${i.quantity}x ${i.name}`)
                            .join(', ')}
                        </td>
                        <td>
                          <strong>{o.total} MAD</strong>
                        </td>
                        <td>
                          <span className={`status-badge status-${o.status}`}>
                            {o.status}
                          </span>
                        </td>
                        <td>
                          <select
                            className="form-control"
                            style={{ width: 'auto', padding: '0.4rem', fontSize: '0.8rem' }}
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          >
                            {['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map(
                              (s) => (
                                <option key={s} value={s}>
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                              )
                            )}
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>No orders yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Menu Management Tab */}
        {activeTab === 'menu' && (
          <div>
            <h2 className="admin-header">Add New Menu Item</h2>
            <div
              className="cafe-form-container"
              style={{ maxWidth: '100%', marginBottom: '2rem', padding: '2rem' }}
            >
              <form onSubmit={addMenuItem}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" className="form-control" name="name" required />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select className="form-control" name="category" required>
                      <option value="Hot Drinks">Hot Drinks</option>
                      <option value="Cold Drinks">Cold Drinks</option>
                      <option value="Pastries">Pastries</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Savory Food">Savory Food</option>
                      <option value="Waffles & Crepes">Waffles & Crepes</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-control" name="description" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price (MAD)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      name="image"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>
                <button type="submit" className="cafe-btn">
                  Add Item
                </button>
              </form>
            </div>

            <h2 className="admin-header">Current Menu</h2>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.length > 0 ? (
                    menuItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: 8,
                                objectFit: 'cover',
                                marginRight: 8,
                              }}
                            />
                          )}
                          {item.name}
                        </td>
                        <td>{item.category}</td>
                        <td>{item.price} MAD</td>
                        <td>
                          <button
                            className="cafe-btn cafe-btn-danger cafe-btn-sm"
                            onClick={() => deleteMenuItem(item.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>No menu items.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
