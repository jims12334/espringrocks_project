import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardTile from "../../ui/DashboardTile";
import Container from "../../ui/Container";
import { LineChart } from "@mui/x-charts/LineChart";
import FormModal from "../../ui/FormModal";
import AddOrder from "../../forms/AddOrder";
import DashboardHeader from "../../ui/DashboardHeader";
import AddCustomer from "../../forms/AddCustomer";
import DashboardButton from "../../ui/DashboardButton";
import { NotepadText, ShoppingCart, UserPen } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { API_BASE } from '../../../utils/api';


export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token, apiFetch } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    sales_today: 0,
    pending_orders: 0,
    active_products: 0,
    active_users: 0,
    revenue_trend: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getFullDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const [openOrder, setOpenOrder] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('monthly');

  const fetchDashboardData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      // Fetch dashboard stats
      const dashboardRes = await apiFetch(`${API_BASE}/dashboard/`);

      if (!dashboardRes.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const dashboardData = await dashboardRes.json();
      setDashboardStats(dashboardData);

      // Fetch recent orders
      const ordersRes = await apiFetch(`${API_BASE}/orders/`);

      if (!ordersRes.ok) {
        throw new Error("Failed to fetch orders");
      }

      const ordersData = await ordersRes.json();
      // Get the last 5 orders
      const orders = Array.isArray(ordersData)
        ? ordersData
        : ordersData.results || [];
      setRecentOrders(orders.slice(0, 5));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate current month revenue from paid orders
  const getMonthlyRevenue = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return recentOrders.reduce((sum, order) => {
      if (order.status === 'Paid') {
        const orderDate = new Date(order.created_at);
        if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
          return sum + (parseFloat(order.total_price) || 0);
        }
      }
      return sum;
    }, 0);
  };

  // Fetch dashboard data from backend
  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  // Derive chart data based on selected period
  const getChartData = () => {
    const trend = dashboardStats.revenue_trend || [];
    if (chartPeriod === 'monthly') {
      return {
        labels: trend.map((r) => r.month),
        values: trend.map((r) => r.revenue),
      };
    }
    if (chartPeriod === 'yearly') {
      const total = trend.reduce((sum, r) => sum + (r.revenue || 0), 0);
      return {
        labels: ['2026'],
        values: [total],
      };
    }
    // Weekly: split last 2 months into ~4 weeks each
    if (chartPeriod === 'weekly') {
      const recent = trend.slice(-2);
      const labels = [];
      const values = [];
      recent.forEach((r) => {
        for (let w = 1; w <= 4; w++) {
          labels.push(`${r.month} W${w}`);
          values.push(parseFloat((r.revenue / 4).toFixed(2)));
        }
      });
      return { labels, values };
    }
    return { labels: [], values: [] };
  };

  const chartData = getChartData();

  return (
    <div className="flex flex-col gap-3">
      <Container>
        <DashboardHeader title={`Welcome back, ${user?.first_name || "User"}!`} subtitle="Here is a summary of your operations today." />
      </Container>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 w-full">
        <DashboardTile
          title="Orders Today"
          stat={dashboardStats.sales_today || 0}
          subtitle={`As of ${getFullDate(new Date())}`}
        />
        <DashboardTile
          title="Pending Orders"
          stat={dashboardStats.pending_orders || 0}
          subtitle={`As of ${getFullDate(new Date())}`}
        />
        <DashboardTile
          title="Active Products"
          stat={dashboardStats.active_products || 0}
          subtitle={`As of ${getFullDate(new Date())}`}
        />
        <DashboardTile
          title="Active Users"
          stat={dashboardStats.active_users || 0}
          subtitle={`As of ${getFullDate(new Date())}`}
        />
        <DashboardTile
          title="Monthly Revenue"
          stat={`₱${Number(getMonthlyRevenue()).toLocaleString("en-PH")}`}
          subtitle={`As of ${getFullDate(new Date())}`}
        />
      </div>

      <div>
        <Container>
          <div className="flex flex-row justify-between items-start">
            <DashboardHeader
              title={`Revenue Growth (2026)`}
              subtitle={
                chartPeriod === 'weekly' ? 'Weekly trend analysis' :
                chartPeriod === 'yearly' ? 'Yearly trend analysis' :
                'Monthly trend analysis'
              }
            />
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {['weekly', 'monthly', 'yearly'].map((p) => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                    chartPeriod === p
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <LineChart
            height={300}
            xAxis={[
              {
                data: chartData.labels,
                scaleType: "point",
                tickLabelStyle: {
                  fontFamily: "Inter",
                  fontSize: 10,
                },
              },
            ]}
            yAxis={[
              {
                width: 90,
                valueFormatter: (value) => `₱${value.toLocaleString("en-PH")}`,
                tickLabelStyle: {
                  fontFamily: "Inter",
                  fontSize: 10,
                },
              },
            ]}
            series={[
              {
                data: chartData.values,
                color: "#f59e0b",
                valueFormatter: (value) => `₱${(value || 0).toLocaleString("en-PH")}`,
              },
            ]}
          />
        </Container>
      </div>

      <div className="grid grid-cols-[1fr_2fr] gap-3 w-full">
        <Container>
          <div>
            <DashboardHeader title="Quick Actions" />
            <div className="my-3 flex flex-row w-full gap-4 items-center justify-center">
              <div>
                <DashboardButton
                  icon={NotepadText}
                  label="Add a new order"
                  onClick={() => setOpenOrder(true)}
                />
                <FormModal
                  formtitle="Add Order"
                  open={openOrder}
                  handleClose={() => setOpenOrder(false)}
                >
                  <AddOrder onSave={() => { setOpenOrder(false); fetchDashboardData(); }} onCancel={() => setOpenOrder(false)} />
                </FormModal>
              </div>

              <div>
                <DashboardButton
                  icon={ShoppingCart}
                  label="Add a new customer"
                  onClick={() => setOpenCustomer(true)}
                />
                <FormModal
                  formtitle="Add Customer"
                  open={openCustomer}
                  handleClose={() => setOpenCustomer(false)}
                >
                  <AddCustomer onSave={() => { setOpenCustomer(false); fetchDashboardData(); }} onCancel={() => setOpenCustomer(false)} />
                </FormModal>
              </div>

              <div>
                <DashboardButton icon={UserPen} label="Manage users" onClick={() => navigate('/usermanagement')} />
              </div>
            </div>
          </div>
        </Container>

        <Container>
          <DashboardHeader title="Recent Orders" subtitle="Last 5 processed orders" />
          <table className="w-full text-sm mt-2">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-2 font-medium">Order ID</th>
                <th className="pb-2 font-medium">Customer</th>
                <th className="pb-2 font-medium">Volume</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-red-500">
                    Error loading orders
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.invoice_number} className="text-gray-700">
                    <td className="py-2 font-mono text-xs text-gray-400">
                      #{order.invoice_number}
                    </td>
                    <td className="py-2">
                      {order.customer_detail?.hauler_name || "N/A"}
                    </td>
                    <td className="py-2">
                      {order.total_cubic?.toFixed(2) || 0}m³
                    </td>
                    <td className="py-2 font-medium">
                      ₱
                      {parseFloat(order.total_price || 0).toLocaleString(
                        "en-PH",
                      )}
                    </td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium
                ${order.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Container>
      </div>
    </div>
  );
}
