const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { initializeSocket } = require("./controllers/admin/notifications-controller");
const authRouter = require("./routes/auth/auth-route");
const adminProductsRouter = require("./routes/admin/products-routes");
const shopProductsRouter = require('./routes/shop/products-routes');
const shopCartRouter = require("./routes/shop/cart-route");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const notification = require('./routes/admin/notifications-routes');


require("dotenv").config();

// Create Express App
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

// Connect to Database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

// Middleware
app.use(
  cors({
    origin: ["https://e-comd-1.onrender.com", "http://localhost:5173"], // Allow both frontend URLs
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/admin/orders', adminOrderRouter);
app.use('/api/shop/products', shopProductsRouter);
app.use('/api/shop/cart', shopCartRouter);
app.use('/api/shop/address', shopAddressRouter);
app.use('/api/shop/order', shopOrderRouter);
app.use('/api/shop/search', shopSearchRouter);
app.use('/api/shop/review', shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/admin",notification)


// Initialize WebSocket Server
initializeSocket(server);

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
