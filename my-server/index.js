const express = require("express");
const app = express();
const port = 3000;

const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const connectDB = require("./db");
const { Category, Product, Employee, Customer, Order, OrderDetails } = require("./models");

// Connect to MongoDB
connectDB();

// Middleware
app.use(morgan("combined"));
app.use(cors()); // cho phép tất cả các nguồn truy cập API
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

//create default API
app.get("/", (req, res) => {
  res.send("Hello Restful API");
});

/* =====================
   AUTH API
===================== */
app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    let user;
    if (role === 'employee') {
      user = await Employee.findOne({ email, password });
    } else {
      user = await Customer.findOne({ email, password });
    }

    if (user) {
      res.json({ success: true, user, role });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* =====================
   PRODUCTS API
===================== */

// Q2 POST
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    const products = await Product.find().populate('categoryId');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Q3 GET
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find().populate('categoryId');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Q4 PUT
app.put("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    const products = await Product.find().populate('categoryId');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Q5 DELETE
app.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    const products = await Product.find().populate('categoryId');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* =====================
   CATEGORIES API
===================== */
app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =====================
   ORDERS API
===================== */

app.post("/orders", async (req, res) => {
  try {
    const { customerId, details, total } = req.body;
    
    // Create new order
    const order = await Order.create({ customerId, total, status: 'pending' });
    
    // Create details
    if (details && details.length > 0) {
      for (const d of details) {
        await OrderDetails.create({
          orderId: order._id,
          productId: d.productId,
          quantity: d.quantity,
          price: d.price
        });
      }
    }
    
    const orders = await Order.find().populate('customerId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate('customerId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, req.body);
    const orders = await Order.find().populate('customerId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/orders/:id", async (req, res) => {
  try {
    await OrderDetails.deleteMany({ orderId: req.params.id });
    await Order.findByIdAndDelete(req.params.id);
    const orders = await Order.find().populate('customerId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* =====================
   SEARCH API
===================== */

// Q8 search price
app.get("/products/price/:max", async (req, res) => {
  try {
    const max = parseFloat(req.params.max);
    const result = await Product.find({ price: { $lte: max } }).populate('categoryId');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Q9 search category
app.get("/products/category/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const result = await Product.find({ categoryId: categoryId }).populate('categoryId');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* =====================
   REVENUE STATISTICS
===================== */

// Q12: Revenue statistics by month and year
app.get("/revenue", async (req, res) => {
  try {
    const revenueStats = await Order.aggregate([
      { $match: { status: 'paid' } },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" }
          },
          totalRevenue: { $sum: "$total" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    // Also calculate total
    const totalResult = await Order.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    res.json({
      revenueStats,
      total: totalResult.length > 0 ? totalResult[0].total : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Khởi động server và lắng nghe trên cổng đã định nghĩa
app.listen(port, () => {
  console.log(`My Server listening on port http://localhost:${port}`);
});