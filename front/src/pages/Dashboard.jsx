import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile (mock / replace with backend API call)
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/profile", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          navigate("/auth"); // redirect if not logged in
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Paper Trading Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome, {user?.username || "Trader"} 👋
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Portfolio Card */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-2">Portfolio Value</h3>
            <p className="text-2xl font-bold text-green-600">
              ₹{user?.portfolioValue || "0"}
            </p>
          </div>

          {/* Balance Card */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-2">Cash Balance</h3>
            <p className="text-2xl font-bold text-blue-600">
              ₹{user?.balance || "0"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
