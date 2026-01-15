const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const client = require('prom-client');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// --- MONITORING: Default Metrics (CPU/RAM) ---
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics(); 

// --- MONITORING: Custom HTTP Metrics (RED Method) ---
// 1. Create a Histogram to track duration and status codes
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5] // Buckets for latency (0.1s to 5s)
});

// 2. Middleware to record every request
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    // Record duration in seconds
    httpRequestDuration.observe(
      { 
        method: req.method, 
        route: req.path, 
        status_code: res.statusCode 
      }, 
      duration / 1000
    );
  });
  next();
});
// ----------------------------------------------------

app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// --- MONITORING: Metrics Endpoint ---
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('ElectroMart Backend API is running...');
});

if (!MONGO_URI) {
  console.error('❌ MONGO_URI missing in .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB', err);
    process.exit(1);
  });