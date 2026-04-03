/**
 * Selro API to MongoDB Migration Script
 *
 * Fetches data from Selro API and pushes to MongoDB
 *
 * Usage: node scripts/selro-migration.js
 */

const mongoose = require('mongoose');

// Selro API Configuration
const SELRO_API_KEY = 'f08b593b-fd0d-4edc-8893-4370ff8fdbed';
const SELRO_API_SECRET = '0647910b-d6f8-4d73-80fc-47b7e76a3daf';
const SELRO_API_BASE = 'https://api.selro.com/6';

// MongoDB Configuration
const MONGODB_URI = 'mongodb+srv://Vercel-Admin-atlas-copper-island:HzPoEfhtWQxtfR9n@atlas-copper-island.49xhepl.mongodb.net/?retryWrites=true&w=majority';
const DB_NAME = 'invoices'; // Adjust if needed

// Helper function to make authenticated requests to Selro API
async function fetchFromSelro(endpoint, params = {}) {
  const url = new URL(`${SELRO_API_BASE}${endpoint}`);

  // Add API key and secret as query parameters
  url.searchParams.append('key', SELRO_API_KEY);
  url.searchParams.append('secret', SELRO_API_SECRET);

  // Add any additional params
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  console.log(`Fetching: ${url.toString().replace(SELRO_API_KEY, '***').replace(SELRO_API_SECRET, '***')}`);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Selro API error: ${response.status} - ${text}`);
  }

  const data = await response.json();
  return data;
}

// Fetch all orders with pagination
async function fetchAllOrders() {
  console.log('\n=== Fetching Orders ===\n');

  let allOrders = [];
  let page = 1;
  const pageSize = 100;
  let hasMore = true;

  while (hasMore) {
    try {
      const data = await fetchFromSelro('/orders', { page, pageSize: pageSize.toString() });

      if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
        allOrders = [...allOrders, ...data.orders];
        console.log(`Page ${page}: ${data.orders.length} orders, Total: ${allOrders.length}`);
        page++;

        if (data.orders.length < pageSize) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    } catch (err) {
      console.error(`Error fetching orders: ${err.message}`);
      hasMore = false;
    }
  }

  return allOrders;
}

// Fetch all products with pagination
async function fetchAllProducts() {
  console.log('\n=== Fetching Products ===\n');

  let allProducts = [];
  let page = 1;
  const pageSize = 100;
  let hasMore = true;

  while (hasMore) {
    try {
      const data = await fetchFromSelro('/products', { page: page.toString(), pageSize: pageSize.toString() });

      if (data.products && Array.isArray(data.products) && data.products.length > 0) {
        allProducts = [...allProducts, ...data.products];
        console.log(`Page ${page}: ${data.products.length} products, Total: ${allProducts.length}`);
        page++;

        if (data.products.length < pageSize) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    } catch (err) {
      console.error(`Error fetching products: ${err.message}`);
      hasMore = false;
    }
  }

  return allProducts;
}

// Fetch channels
async function fetchChannels() {
  console.log('\n=== Fetching Channels ===\n');

  try {
    const data = await fetchFromSelro('/channels');
    return data.channels || [];
  } catch (err) {
    console.error(`Error fetching channels: ${err.message}`);
    return [];
  }
}

// Fetch stock
async function fetchStock() {
  console.log('\n=== Fetching Stock ===\n');

  try {
    const data = await fetchFromSelro('/stock');
    return data.products || [];
  } catch (err) {
    console.error(`Error fetching stock: ${err.message}`);
    return [];
  }
}

// MongoDB Schemas
const createModels = (db) => {
  // Orders Schema
  const orderSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    orderId: String,
    channelUserId: Number,
    selroUserId: Number,
    selroChannelName: String,
    channel: String,
    site: String,
    channelUsername: String,
    purchaseDate: Number,
    dispatchDate: Number,
    lastUpdateDate: Number,
    orderStatus: String,
    paymentsStatus: String,
    totalPrice: Number,
    subTotal: Number,
    taxAmount: Number,
    shippingPrice: Number,
    totalPriceNet: Number,
    currencyCode: String,
    paymentMethod: String,
    trackingNumber: String,
    carrierName: String,
    shippingMethod: String,
    shipName: String,
    ioss: String,
    selroChannelId: Number,
    combinedOrderId: String,
    splitOrderId: String,
    numberoflineitems: Number,
    totalnumberofitems: Number,
    customerVatNumber: String,
    totalDiscounts: Number,
    // Store full raw data
    rawData: mongoose.Schema.Types.Mixed,
    migratedAt: { type: Date, default: Date.now }
  }, { collection: 'selro_orders' });

  // Products Schema
  const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    sku: String,
    title: String,
    qty: Number,
    description: String,
    sellingprice: Number,
    costprice: Number,
    ean: String,
    upc: String,
    brand: String,
    manufacturer: String,
    category: String,
    images: [String],
    attributes: mongoose.Schema.Types.Mixed,
    variations: mongoose.Schema.Types.Mixed,
    rawData: mongoose.Schema.Types.Mixed,
    migratedAt: { type: Date, default: Date.now }
  }, { collection: 'selro_products' });

  // Channels Schema
  const channelSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: String,
    type: String,
    enable: Boolean,
    downloadCatalogue: Boolean,
    downloadOrders: Boolean,
    lastCatalogueDownloadTime: Number,
    lastOrderDownloadTime: Number,
    migratedAt: { type: Date, default: Date.now }
  }, { collection: 'selro_channels' });

  // Stock Schema (for inventory levels)
  const stockSchema = new mongoose.Schema({
    productId: { type: Number, required: true },
    sku: String,
    title: String,
    qty: Number,
    sellingprice: Number,
    costprice: Number,
    variations: mongoose.Schema.Types.Mixed,
    migratedAt: { type: Date, default: Date.now }
  }, { collection: 'selro_stock' });

  return {
    Order: mongoose.models.SelroOrder || mongoose.model('SelroOrder', orderSchema),
    Product: mongoose.models.SelroProduct || mongoose.model('SelroProduct', productSchema),
    Channel: mongoose.models.SelroChannel || mongoose.model('SelroChannel', channelSchema),
    Stock: mongoose.models.SelroStock || mongoose.model('SelroStock', stockSchema)
  };
};

// Insert data into MongoDB
async function insertIntoMongoDB(data, Model, name) {
  if (!data || data.length === 0) {
    console.log(`No ${name} to insert`);
    return { inserted: 0, updated: 0 };
  }

  let inserted = 0;
  let updated = 0;

  for (const item of data) {
    try {
      const id = item.id || item.productId;
      if (!id) {
        console.log(`Skipping ${name} without id`);
        continue;
      }

      const result = await Model.findOneAndUpdate(
        { id },
        { $set: { ...item, rawData: item } },
        { upsert: true, new: true }
      );

      if (result.isNew) {
        inserted++;
      } else {
        updated++;
      }
    } catch (err) {
      console.error(`Error inserting ${name}: ${err.message}`);
    }
  }

  console.log(`${name}: ${inserted} inserted, ${updated} updated`);
  return { inserted, updated };
}

// Main function
async function main() {
  console.log('=== Selro to MongoDB Migration ===\n');
  console.log('Selro API Base:', SELRO_API_BASE);
  console.log('MongoDB:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
  console.log('Started:', new Date().toISOString());

  try {
    // Fetch all data from Selro
    const orders = await fetchAllOrders();
    console.log(`\nTotal Orders fetched: ${orders.length}`);

    const products = await fetchAllProducts();
    console.log(`Total Products fetched: ${products.length}`);

    const channels = await fetchChannels();
    console.log(`Total Channels fetched: ${channels.length}`);

    const stock = await fetchStock();
    console.log(`Total Stock items fetched: ${stock.length}`);

    // Connect to MongoDB
    console.log('\n=== Connecting to MongoDB ===\n');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const { Order, Product, Channel, Stock } = createModels();

    // Insert data into MongoDB
    console.log('\n=== Inserting into MongoDB ===\n');

    const orderStats = await insertIntoMongoDB(orders, Order, 'Orders');
    const productStats = await insertIntoMongoDB(products, Product, 'Products');
    const channelStats = await insertIntoMongoDB(channels, Channel, 'Channels');
    const stockStats = await insertIntoMongoDB(stock, Stock, 'Stock');

    // Summary
    console.log('\n=== Migration Summary ===\n');
    console.log('Orders:', orderStats);
    console.log('Products:', productStats);
    console.log('Channels:', channelStats);
    console.log('Stock:', stockStats);

    await mongoose.disconnect();
    console.log('\n=== Migration Complete ===');
    console.log('Finished:', new Date().toISOString());

  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

main();