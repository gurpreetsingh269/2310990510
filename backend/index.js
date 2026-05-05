const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const BASE_URL = "http://20.207.122.201/evaluation-service";

const userData = {
  email: "himanshu0522.be23@chitkara.edu.in",
  name: "Himanshu",
  mobileNo: "9350482781",
  githubUsername: "guurpreetsingh269",
  rollNo: "231090522",
  accessCode: "EXfvDp", 
};

const priorityMap = {
  Result: 2,
  Event: 1,
};

app.get("/notifications", async (req, res) => {
  try {
    // STEP 1: Register
    const registerRes = await axios.post(`${BASE_URL}/register`, userData);
    const { clientID, clientSecret } = registerRes.data;

    // STEP 2: Auth
    const authRes = await axios.post(`${BASE_URL}/auth`, {
      ...userData,
      clientID,
      clientSecret,
    });

    const token = authRes.data.access_token;

    // STEP 3: Get Notifications
    const notifRes = await axios.get(`${BASE_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const notifications = notifRes.data.notifications;

    // STEP 4: Sort
    const sorted = notifications.sort((a, b) => {
      const p = priorityMap[b.Type] - priorityMap[a.Type];
      if (p !== 0) return p;
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    const top10 = sorted.slice(0, 10);

    res.json(top10);

  } catch (err) {
    console.log("Backend ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Backend failed" });
  }
});

// START SERVER
app.listen(3000, () => {
  console.log("Server running on http://localhost:5000");
});
