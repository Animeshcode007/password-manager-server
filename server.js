const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/auth");
const credentialRoutes = require("./routes/credentials");

const app = express();
app.use(
  cors({
    origin: process.env.VITE_API_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // only if you use cookies; omit if you don’t
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/credentials", credentialRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
