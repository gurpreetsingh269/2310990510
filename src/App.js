import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/notifications");

      console.log("API DATA:", res.data); // 👈 check this in console

      setNotifications(res.data || []);
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🔥 Top 10 Notifications</h2>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* No Data */}
      {!loading && notifications.length === 0 && (
        <p>No notifications found</p>
      )}

      {/* Data */}
      {notifications.map((n, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #ccc",
            margin: "10px 0",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <h3>{n.Type || n.type}</h3>
          <p>{n.Message || n.message}</p>
          <small>
            {new Date(n.Timestamp || n.timestamp).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default App;