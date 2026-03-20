// ============================================================
// CET2002 Assignment One 2025/6
// Tony's Toy Emporium (TTE) - MongoDB Script
// Part B: NoSQL Database Implementation
// ============================================================

// Switch to TTE database
use("tte_database");

// ============================================================
// DROP EXISTING COLLECTIONS
// ============================================================
db.customers.drop();
db.stores.drop();
db.products.drop();
db.purchases.drop();

// ============================================================
// INSERT SAMPLE DATA
// ============================================================

// ---- COLLECTION 1: customers ----
// Bank accounts are NESTED as an array inside each customer document
// This reduces collections vs relational model (no separate BankAccount table)
db.customers.insertMany([
  {
    _id: 1,
    first_name: "James",
    last_name: "Smith",
    address: { line1: "14 Oak Street", city: "Manchester", postcode: "M1 1AA" },
    phone: "07700 900001",
    date_of_birth: new Date("1985-03-12"),
    created_at: new Date(),
    bank_accounts: [
      { bank_name: "Barclays", bank_address: "1 Churchill Place, London", sort_code: "20-00-00", account_number: "12345678" },
      { bank_name: "HSBC",     bank_address: "8 Canada Square, London",   sort_code: "40-00-01", account_number: "87654321" }
    ]
  },
  {
    _id: 2,
    first_name: "Emily",
    last_name: "Johnson",
    address: { line1: "7 Birch Lane", line2: "Apt 3", city: "London", postcode: "E1 6AN" },
    phone: "07700 900002",
    date_of_birth: new Date("1992-07-24"),
    created_at: new Date(),
    bank_accounts: [
      { bank_name: "Lloyds", bank_address: "25 Gresham Street, London", sort_code: "30-00-00", account_number: "11223344" }
    ]
  },
  {
    _id: 3,
    first_name: "Oliver",
    last_name: "Williams",
    address: { line1: "22 Maple Road", city: "Birmingham", postcode: "B1 1BB" },
    phone: "07700 900003",
    date_of_birth: new Date("1978-11-05"),
    created_at: new Date(),
    bank_accounts: [
      { bank_name: "NatWest", bank_address: "135 Bishopsgate, London", sort_code: "60-00-01", account_number: "55667788" }
    ]
  },
  {
    _id: 4,
    first_name: "Sophie",
    last_name: "Brown",
    address: { line1: "9 Elm Close", line2: "Unit 5", city: "Leeds", postcode: "LS1 1BA" },
    phone: "07700 900004",
    date_of_birth: new Date("1995-02-18"),
    created_at: new Date(),
    bank_accounts: [
      { bank_name: "Santander", bank_address: "2 Triton Square, London", sort_code: "09-01-28", account_number: "99001122" }
    ]
  },
  {
    _id: 5,
    first_name: "Harry",
    last_name: "Jones",
    address: { line1: "33 Cedar Avenue", city: "Bristol", postcode: "BS1 1AA" },
    phone: "07700 900005",
    date_of_birth: new Date("1988-09-30"),
    created_at: new Date(),
    bank_accounts: [
      { bank_name: "Barclays", bank_address: "1 Churchill Place, London", sort_code: "20-00-00", account_number: "33445566" }
    ]
  },
  {
    _id: 6,
    first_name: "Mia",
    last_name: "Davis",
    address: { line1: "18 Pine Drive", line2: "Floor 2", city: "Sheffield", postcode: "S1 1AB" },
    phone: "07700 900006",
    date_of_birth: new Date("2000-04-14"),
    created_at: new Date(),
    bank_accounts: [
      { bank_name: "Halifax", bank_address: "Trinity Road, Halifax", sort_code: "11-00-01", account_number: "77889900" }
    ]
  },
  {
    _id: 7,
    first_name: "William",
    last_name: "Wilson",
    address: { line1: "56 Willow Way", city: "Liverpool", postcode: "L1 1AA" },
    phone: "07700 900007",
    date_of_birth: new Date("1975-12-22"),
    created_at: new Date(),
    bank_accounts: [
      { bank_name: "HSBC", bank_address: "8 Canada Square, London", sort_code: "40-00-02", account_number: "44332211" }
    ]
  },
  {
    _id: 8,
    first_name: "Isla",
    last_name: "Taylor",
    address: { line1: "3 Poplar Place", line2: "Room 1", city: "Nottingham", postcode: "NG1 1AA" },
    phone: "07700 900008",
    date_of_birth: new Date("1998-06-08"),
    created_at: new Date(),
    bank_accounts: [
      { bank_name: "Nationwide", bank_address: "Nationwide House, Swindon", sort_code: "07-00-93", account_number: "66778899" }
    ]
  },
  {
    _id: 9,
    first_name: "George",
    last_name: "Anderson",
    address: { line1: "88 Ash Court", city: "Leicester", postcode: "LE1 1AA" },
    phone: "07700 900009",
    date_of_birth: new Date("1983-08-17"),
    created_at: new Date(),
    bank_accounts: [
      { bank_name: "Lloyds", bank_address: "25 Gresham Street, London", sort_code: "30-00-01", account_number: "22113344" }
    ]
  },
  {
    _id: 10,
    first_name: "Amelia",
    last_name: "Thomas",
    address: { line1: "12 Chestnut Gardens", line2: "Flat B", city: "Newcastle", postcode: "NE1 1AA" },
    phone: "07700 900010",
    date_of_birth: new Date("1990-01-25"),
    created_at: new Date(),
    bank_accounts: [
      { bank_name: "Barclays", bank_address: "1 Churchill Place, London", sort_code: "20-00-00", account_number: "10203040" }
    ]
  }
]);

// ---- COLLECTION 2: stores ----
// Stock information is embedded as an array of stock items within each store
// This allows fast queries for "what's in this store" without joins
db.stores.insertMany([
  {
    _id: 1,
    store_name: "TTE Manchester",
    address: { line1: "100 Market Street", city: "Manchester", postcode: "M1 1PW" },
    phone: "0161 000 0001",
    manager_name: "David Clark",
    stock: [
      { product_id: 1, product_name: "Monopoly Classic",       quantity: 50 },
      { product_id: 2, product_name: "FIFA 2025",              quantity: 30 },
      { product_id: 5, product_name: "Minecraft Legends",      quantity: 40 },
      { product_id: 9, product_name: "RC Racing Car Pro",      quantity: 20 }
    ]
  },
  {
    _id: 2,
    store_name: "TTE London Central",
    address: { line1: "50 Oxford Street", city: "London", postcode: "W1D 1BS" },
    phone: "0207 000 0001",
    manager_name: "Sarah Green",
    stock: [
      { product_id: 1, product_name: "Monopoly Classic",          quantity: 60 },
      { product_id: 3, product_name: "Space Ranger Set",          quantity: 80 },
      { product_id: 6, product_name: "LEGO City Fire Station",    quantity: 15 }
    ]
  },
  {
    _id: 3,
    store_name: "TTE Birmingham",
    address: { line1: "35 New Street", city: "Birmingham", postcode: "B2 4QA" },
    phone: "0121 000 0001",
    manager_name: "Mark Evans",
    stock: [
      { product_id: 2, product_name: "FIFA 2025",                  quantity: 25 },
      { product_id: 4, product_name: "1000-Piece Landscape",       quantity: 70 },
      { product_id: 7, product_name: "Cluedo Deluxe Edition",      quantity: 45 }
    ]
  },
  {
    _id: 4,
    store_name: "TTE Leeds",
    address: { line1: "12 The Headrow", city: "Leeds", postcode: "LS1 6PU" },
    phone: "0113 000 0001",
    manager_name: "Helen White",
    stock: [
      { product_id: 5,  product_name: "Minecraft Legends",        quantity: 35 },
      { product_id: 8,  product_name: "Fashion Doll Starter Set", quantity: 60 },
      { product_id: 10, product_name: "Science Experiment Kit",   quantity: 30 }
    ]
  },
  {
    _id: 5,
    store_name: "TTE Bristol",
    address: { line1: "8 Broadmead", city: "Bristol", postcode: "BS1 3EA" },
    phone: "0117 000 0001",
    manager_name: "Tom Harris",
    stock: [
      { product_id: 3, product_name: "Space Ranger Set",        quantity: 55 },
      { product_id: 6, product_name: "LEGO City Fire Station",  quantity: 10 },
      { product_id: 9, product_name: "RC Racing Car Pro",       quantity: 25 }
    ]
  },
  {
    _id: 6,
    store_name: "TTE Liverpool",
    address: { line1: "22 Church Street", city: "Liverpool", postcode: "L1 3AY" },
    phone: "0151 000 0001",
    manager_name: "Fiona Brown",
    stock: [
      { product_id: 1, product_name: "Monopoly Classic",      quantity: 40 },
      { product_id: 4, product_name: "1000-Piece Landscape",  quantity: 50 },
      { product_id: 7, product_name: "Cluedo Deluxe Edition", quantity: 20 }
    ]
  }
]);

// ---- COLLECTION 3: products ----
db.products.insertMany([
  { _id: 1,  product_type: "Board Game",     product_name: "Monopoly Classic",          description: "The classic property trading board game",         unit_cost: 8.50,  unit_price: 24.99, created_at: new Date() },
  { _id: 2,  product_type: "Computer Game",  product_name: "FIFA 2025",                 description: "Latest football simulation game",                  unit_cost: 35.00, unit_price: 59.99, created_at: new Date() },
  { _id: 3,  product_type: "Action Figure",  product_name: "Space Ranger Set",          description: "Set of 5 space ranger action figures",             unit_cost: 6.00,  unit_price: 14.99, created_at: new Date() },
  { _id: 4,  product_type: "Puzzle",         product_name: "1000-Piece Landscape",      description: "1000-piece scenic landscape jigsaw puzzle",         unit_cost: 5.00,  unit_price: 12.99, created_at: new Date() },
  { _id: 5,  product_type: "Computer Game",  product_name: "Minecraft Legends",         description: "Adventure strategy game for all ages",              unit_cost: 20.00, unit_price: 39.99, created_at: new Date() },
  { _id: 6,  product_type: "Building Set",   product_name: "LEGO City Fire Station",    description: "600-piece LEGO city fire station set",              unit_cost: 30.00, unit_price: 64.99, created_at: new Date() },
  { _id: 7,  product_type: "Board Game",     product_name: "Cluedo Deluxe Edition",     description: "Mystery board game deluxe version",                 unit_cost: 9.00,  unit_price: 22.99, created_at: new Date() },
  { _id: 8,  product_type: "Doll",           product_name: "Fashion Doll Starter Set",  description: "Complete fashion doll with accessories",            unit_cost: 7.50,  unit_price: 19.99, created_at: new Date() },
  { _id: 9,  product_type: "Remote Control", product_name: "RC Racing Car Pro",         description: "Professional remote control racing car",            unit_cost: 22.00, unit_price: 49.99, created_at: new Date() },
  { _id: 10, product_type: "Educational",    product_name: "Science Experiment Kit",    description: "Age 8+ beginner science kit with 50 experiments",   unit_cost: 12.00, unit_price: 29.99, created_at: new Date() }
]);

// ---- COLLECTION 4: purchases ----
// Purchase items are NESTED as an array inside each purchase document
// This is the key NoSQL design decision: no separate PurchaseItem collection needed
db.purchases.insertMany([
  {
    _id: 1,
    customer_id: 1,
    store_id: 1,
    store_name: "TTE Manchester",
    purchase_date: new Date("2025-01-05T10:30:00"),
    total_amount: 84.98,
    payment_method: "card",
    items: [
      { product_id: 1, product_name: "Monopoly Classic", quantity: 1, unit_price: 24.99, line_total: 24.99 },
      { product_id: 2, product_name: "FIFA 2025",         quantity: 1, unit_price: 59.99, line_total: 59.99 }
    ]
  },
  {
    _id: 2,
    customer_id: 2,
    store_id: 2,
    store_name: "TTE London Central",
    purchase_date: new Date("2025-01-12T14:15:00"),
    total_amount: 59.99,
    payment_method: "card",
    items: [
      { product_id: 2, product_name: "FIFA 2025", quantity: 1, unit_price: 59.99, line_total: 59.99 }
    ]
  },
  {
    _id: 3,
    customer_id: 3,
    store_id: 3,
    store_name: "TTE Birmingham",
    purchase_date: new Date("2025-01-20T11:00:00"),
    total_amount: 48.97,
    payment_method: "cash",
    items: [
      { product_id: 4, product_name: "1000-Piece Landscape",  quantity: 2, unit_price: 12.99, line_total: 25.98 },
      { product_id: 7, product_name: "Cluedo Deluxe Edition", quantity: 1, unit_price: 22.99, line_total: 22.99 }
    ]
  },
  {
    _id: 4,
    customer_id: 4,
    store_id: 4,
    store_name: "TTE Leeds",
    purchase_date: new Date("2025-02-01T16:45:00"),
    total_amount: 114.97,
    payment_method: "online",
    items: [
      { product_id: 6,  product_name: "LEGO City Fire Station",    quantity: 1, unit_price: 64.99, line_total: 64.99 },
      { product_id: 10, product_name: "Science Experiment Kit",     quantity: 1, unit_price: 29.99, line_total: 29.99 },
      { product_id: 8,  product_name: "Fashion Doll Starter Set",   quantity: 1, unit_price: 19.99, line_total: 19.99 }
    ]
  },
  {
    _id: 5,
    customer_id: 5,
    store_id: 5,
    store_name: "TTE Bristol",
    purchase_date: new Date("2025-02-14T13:20:00"),
    total_amount: 49.99,
    payment_method: "card",
    items: [
      { product_id: 9, product_name: "RC Racing Car Pro", quantity: 1, unit_price: 49.99, line_total: 49.99 }
    ]
  },
  {
    _id: 6,
    customer_id: 6,
    store_id: 1,
    store_name: "TTE Manchester",
    purchase_date: new Date("2025-02-20T09:55:00"),
    total_amount: 84.97,
    payment_method: "card",
    items: [
      { product_id: 5, product_name: "Minecraft Legends",      quantity: 1, unit_price: 39.99, line_total: 39.99 },
      { product_id: 1, product_name: "Monopoly Classic",        quantity: 1, unit_price: 24.99, line_total: 24.99 },
      { product_id: 8, product_name: "Fashion Doll Starter Set",quantity: 1, unit_price: 19.99, line_total: 19.99 }
    ]
  },
  {
    _id: 7,
    customer_id: 7,
    store_id: 6,
    store_name: "TTE Liverpool",
    purchase_date: new Date("2025-03-01T15:10:00"),
    total_amount: 42.98,
    payment_method: "cash",
    items: [
      { product_id: 4,  product_name: "1000-Piece Landscape",  quantity: 1, unit_price: 12.99, line_total: 12.99 },
      { product_id: 10, product_name: "Science Experiment Kit", quantity: 1, unit_price: 29.99, line_total: 29.99 }
    ]
  },
  {
    _id: 8,
    customer_id: 8,
    store_id: 2,
    store_name: "TTE London Central",
    purchase_date: new Date("2025-03-05T12:30:00"),
    total_amount: 94.97,
    payment_method: "online",
    items: [
      { product_id: 6, product_name: "LEGO City Fire Station", quantity: 1, unit_price: 64.99, line_total: 64.99 },
      { product_id: 3, product_name: "Space Ranger Set",        quantity: 2, unit_price: 14.99, line_total: 29.98 }
    ]
  }
]);

// ============================================================
// PART B QUERIES
// ============================================================

// ---- Query 1: Aggregation Pipeline - Total Revenue by Store (OLAP equivalent) ----
// Purpose: Multi-stage aggregation pipeline producing a revenue report per store.
// Equivalent to an SQL GROUP BY with SUM/COUNT/AVG - an OLAP-style rollup operation.
// Demonstrates: $group, $sort, $project stages.
db.purchases.aggregate([
  {
    $group: {
      _id: { store_id: "$store_id", store_name: "$store_name" },
      total_transactions: { $sum: 1 },
      total_revenue: { $sum: "$total_amount" },
      avg_transaction: { $avg: "$total_amount" }
    }
  },
  { $sort: { total_revenue: -1 } },
  {
    $project: {
      _id: 0,
      store_name: "$_id.store_name",
      total_transactions: 1,
      total_revenue: { $round: ["$total_revenue", 2] },
      avg_transaction: { $round: ["$avg_transaction", 2] }
    }
  }
]);

// ---- Query 2: Aggregation Pipeline across two collections - Top Selling Products ----
// Purpose: Unwinds the nested items array in purchases, then uses $lookup to join
// with the products collection to retrieve product type. Groups by product to find
// best sellers. Retrieves data from BOTH 'purchases' AND 'products' collections.
// Demonstrates: $unwind, $lookup, $group, $sort across two collections.
db.purchases.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.product_id",
      product_name: { $first: "$items.product_name" },
      total_units_sold: { $sum: "$items.quantity" },
      total_revenue: { $sum: "$items.line_total" }
    }
  },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "product_details"
    }
  },
  { $unwind: "$product_details" },
  {
    $project: {
      _id: 0,
      product_id: "$_id",
      product_name: 1,
      product_type: "$product_details.product_type",
      unit_price: "$product_details.unit_price",
      total_units_sold: 1,
      total_revenue: { $round: ["$total_revenue", 2] }
    }
  },
  { $sort: { total_revenue: -1 } }
]);

// ---- Query 3: Management Report - Sales between dates ----
// Purpose: Equivalent to the SQL management report in Part A Query 1.
// Shows all purchases at a specific store between two dates,
// with customer details (from nested purchase_date filtering).
// Demonstrates: $match with date range, $lookup to retrieve customer name.
db.purchases.aggregate([
  {
    $match: {
      purchase_date: {
        $gte: new Date("2025-01-01"),
        $lte: new Date("2025-03-31")
      }
    }
  },
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  {
    $project: {
      _id: 0,
      purchase_id: "$_id",
      store_name: 1,
      purchase_date: 1,
      total_amount: 1,
      payment_method: 1,
      customer_name: {
        $concat: ["$customer.first_name", " ", "$customer.last_name"]
      },
      number_of_items: { $size: "$items" }
    }
  },
  { $sort: { purchase_date: 1 } }
]);

// ---- Query 4: Query using nested collection (array of nested documents) ----
// Purpose: Queries the nested 'items' array within each purchase document.
// Finds all purchases that include a Computer Game product, showing full
// item details. Uses $unwind to deconstruct the array and $match to filter.
// This directly demonstrates the use of nested documents/arrays - a key
// NoSQL feature - to answer a query that would require a JOIN in SQL.
db.purchases.aggregate([
  { $unwind: "$items" },
  {
    $lookup: {
      from: "products",
      localField: "items.product_id",
      foreignField: "_id",
      as: "product_info"
    }
  },
  { $unwind: "$product_info" },
  {
    $match: {
      "product_info.product_type": "Computer Game"
    }
  },
  {
    $project: {
      _id: 0,
      purchase_id: "$_id",
      store_name: 1,
      purchase_date: 1,
      "product_name": "$items.product_name",
      "product_type": "$product_info.product_type",
      "quantity_purchased": "$items.quantity",
      "price_paid": "$items.unit_price",
      "line_total": "$items.line_total"
    }
  },
  { $sort: { purchase_date: 1 } }
]);
