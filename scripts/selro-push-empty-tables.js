/**
 * Selro API - Push All Empty Tables to MongoDB
 *
 * This script checks which MongoDB tables are empty and fetches
 * corresponding data from Selro API to populate them.
 *
 * Usage: node scripts/selro-push-empty-tables.js
 */

const mongoose = require('mongoose');

// Selro API Configuration
const SELRO_API_KEY = 'f08b593b-fd0d-4edc-8893-4370ff8fdbed';
const SELRO_API_SECRET = '0647910b-d6f8-4d73-80fc-47b7e76a3daf';
const SELRO_API_BASE = 'https://api.selro.com/6';

// MongoDB Configuration
const MONGODB_URI = 'mongodb+srv://Vercel-Admin-atlas-copper-island:HzPoEfhtWQxtfR9n@atlas-copper-island.49xhepl.mongodb.net/?retryWrites=true&w=majority';
const DB_NAME = 'invoices';

// Helper function to make authenticated requests to Selro API
async function fetchFromSelro(endpoint, params = {}) {
  const url = new URL(`${SELRO_API_BASE}${endpoint}`);

  url.searchParams.append('key', SELRO_API_KEY);
  url.searchParams.append('secret', SELRO_API_SECRET);

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

// Fetch with pagination
async function fetchAllPages(endpoint, dataKey, pageSize = 100) {
  let allData = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const data = await fetchFromSelro(endpoint, { page: page.toString(), pageSize: pageSize.toString() });

      if (data[dataKey] && Array.isArray(data[dataKey]) && data[dataKey].length > 0) {
        allData = [...allData, ...data[dataKey]];
        console.log(`  Page ${page}: ${data[dataKey].length} items, Total: ${allData.length}`);
        page++;

        if (data[dataKey].length < pageSize) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    } catch (err) {
      console.error(`  Error: ${err.message}`);
      hasMore = false;
    }
  }

  return allData;
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

  // Stock Schema
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

  // Customers Schema
  const customerSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    email: String,
    name: String,
    phone: String,
    address: mongoose.Schema.Types.Mixed,
    rawData: mongoose.Schema.Types.Mixed,
    migratedAt: { type: Date, default: Date.now }
  }, { collection: 'selro_customers' });

  // Returns Schema
  const returnSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    orderId: Number,
    status: String,
    reason: String,
    rawData: mongoose.Schema.Types.Mixed,
    migratedAt: { type: Date, default: Date.now }
  }, { collection: 'selro_returns' });

  // Shipments Schema
  const shipmentSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    orderId: Number,
    trackingNumber: String,
    carrier: String,
    status: String,
    rawData: mongoose.Schema.Types.Mixed,
    migratedAt: { type: Date, default: Date.now }
  }, { collection: 'selro_shipments' });

  return {
    Order: mongoose.models.SelroOrder || mongoose.model('SelroOrder', orderSchema),
    Product: mongoose.models.SelroProduct || mongoose.model('SelroProduct', productSchema),
    Channel: mongoose.models.SelroChannel || mongoose.model('SelroChannel', channelSchema),
    Stock: mongoose.models.SelroStock || mongoose.model('SelroStock', stockSchema),
    Customer: mongoose.models.SelroCustomer || mongoose.model('SelroCustomer', customerSchema),
    Return: mongoose.models.SelroReturn || mongoose.model('SelroReturn', returnSchema),
    Shipment: mongoose.models.SelroShipment || mongoose.model('SelroShipment', shipmentSchema)
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
  console.log('=== Selro to MongoDB - Push Empty Tables ===\n');
  console.log('Selro API Base:', SELRO_API_BASE);
  console.log('MongoDB:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
  console.log('Started:', new Date().toISOString());

  try {
    // Connect to MongoDB
    console.log('\n=== Connecting to MongoDB ===\n');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const models = createModels();
    const stats = {};

    // Check and populate each table
    const tables = [
      { name: 'Orders', model: models.Order, endpoint: '/orders', dataKey: 'orders' },
      { name: 'Products', model: models.Product, endpoint: '/products', dataKey: 'products' },
      { name: 'Channels', model: models.Channel, endpoint: '/channels', dataKey: 'channels', paginated: false },
      { name: 'Stock', model: models.Stock, endpoint: '/stock', dataKey: 'products', paginated: false },
      { name: 'Customers', model: models.Customer, endpoint: '/customers', dataKey: 'customers' },
      { name: 'Returns', model: models.Return, endpoint: '/returns', dataKey: 'returns' },
      { name: 'Shipments', model: models.Shipment, endpoint: '/shipments', dataKey: 'shipments' }
    ];

    for (const table of tables) {
      console.log(`\n=== Checking ${table.name} ===\n`);

      try {
        const count = await table.model.countDocuments();
        console.log(`Current count: ${count}`);

        if (count === 0) {
          console.log(`${table.name} table is empty. Fetching from Selro API...`);

          let data;
          if (table.paginated !== false) {
            data = await fetchAllPages(table.endpoint, table.dataKey);
          } else {
            const response = await fetchFromSelro(table.endpoint);
            data = response[table.dataKey] || [];
          }

          console.log(`Total ${table.name} fetched: ${data.length}`);
          stats[table.name] = await insertIntoMongoDB(data, table.model, table.name);
        } else {
          console.log(`${table.name} table already has ${count} records. Skipping.`);
          stats[table.name] = { skipped: true, count };
        }
      } catch (err) {
        console.error(`Error processing ${table.name}: ${err.message}`);
        stats[table.name] = { error: err.message };
      }
    }

    // Summary
    console.log('\n=== Migration Summary ===\n');
    for (const [name, result] of Object.entries(stats)) {
      console.log(`${name}:`, result);
    }

    await mongoose.disconnect();
    console.log('\n=== Migration Complete ===');
    console.log('Finished:', new Date().toISOString());

  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

main();