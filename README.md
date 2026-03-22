# Tony's Toy Emporium (TTE) Database System

## Project Overview

This project designs and implements a complete database system for Tony's Toy Emporium (TTE), including:

- **Part A**: PostgreSQL Relational Database (8 tables)
- **Part B**: MongoDB NoSQL Database (4 collections)

---

## File Structure

```
├── TTE_Assignment_Design.docx   # Design documentation (E-R Diagram, Data Dictionary, Part C Discussion)
├── TTE_PostgreSQL.sql                # PostgreSQL script (create tables, insert data, queries)
├── TTE_MongoDB.js                 # MongoDB script (create collections, insert data, queries)
└── README.md                    # Project documentation
```

---

## Prerequisites

- **PostgreSQL 15+** — https://www.postgresql.org/download/windows/
- **MongoDB 6+** — https://www.mongodb.com/try/download/community
- **mongosh** — https://www.mongodb.com/try/download/shell

> After installation, add the following directories to your system **PATH** environment variable:
> ```
> C:\Program Files\PostgreSQL\<version>\bin
> C:\Program Files\mongosh\bin
> ```

---

## Part A — PostgreSQL

### Step 1: Connect to PostgreSQL

Open Command Prompt as Administrator and run:

```bash
psql -U postgres
```

Enter your password when prompted.

---

### Step 2: Create the Database

```sql
CREATE DATABASE tte_database;
```

Verify it was created:

```sql
\l
```

Switch to the database:

```sql
\c tte_database
```

Exit psql:

```sql
\q
```

---

### Step 3: Run the SQL Script

```bash
psql -U postgres -d tte_database -f "C:\path\to\TTE_PostgreSQL.sql"
```

Replace the path with the actual location of your file. Example:

```bash
psql -U postgres -d tte_database -f "C:\Users\YourUsername\Desktop\TTE_PostgreSQL.sql"
```

Expected output:

```
DROP TABLE
DROP TABLE
...
CREATE TABLE
CREATE TABLE
...
INSERT 0 10
INSERT 0 10
INSERT 0 6
INSERT 0 10
...
```

---

### Step 4: Verify the Data

Connect to the database:

```bash
psql -U postgres -d tte_database
```

Check row counts:

```sql
SELECT 'Customer'       AS table_name, COUNT(*) AS row_count FROM Customer
UNION ALL
SELECT 'BankAccount',   COUNT(*) FROM BankAccount
UNION ALL
SELECT 'Store',         COUNT(*) FROM Store
UNION ALL
SELECT 'Product',       COUNT(*) FROM Product
UNION ALL
SELECT 'StoreStock',    COUNT(*) FROM StoreStock
UNION ALL
SELECT 'Purchase',      COUNT(*) FROM Purchase
UNION ALL
SELECT 'PurchaseItem',  COUNT(*) FROM PurchaseItem
UNION ALL
SELECT 'StockTransfer', COUNT(*) FROM StockTransfer;
```

Expected results:

```
   table_name   | row_count
----------------+-----------
 Customer       |        10
 BankAccount    |        10
 Store          |         6
 Product        |        10
 StoreStock     |        19
 Purchase       |         8
 PurchaseItem   |        16
 StockTransfer  |         6
```

---

### Step 5: Run the SQL Queries

While connected to `tte_database`, run each query directly:

```sql
-- Query 1: Management Report - Sales summary by store
SELECT
    s.store_name,
    COUNT(p.purchase_id)  AS total_transactions,
    SUM(p.total_amount)   AS total_revenue,
    AVG(p.total_amount)   AS avg_transaction_value
FROM Purchase p
JOIN Store s ON p.store_id = s.store_id
WHERE p.purchase_date BETWEEN '2025-01-01' AND '2025-03-31'
GROUP BY s.store_id, s.store_name
ORDER BY total_revenue DESC;
```

```sql
-- Query 2: Top selling products by revenue
SELECT
    pr.product_name,
    pr.product_type,
    SUM(pi.quantity)   AS total_units_sold,
    SUM(pi.line_total) AS total_revenue
FROM PurchaseItem pi
JOIN Product pr ON pi.product_id = pr.product_id
GROUP BY pr.product_id, pr.product_name, pr.product_type
ORDER BY total_revenue DESC;
```

```sql
-- Query 3: Customer purchase history with bank account count
SELECT
    c.customer_id,
    c.first_name || ' ' || c.last_name      AS full_name,
    COUNT(DISTINCT p.purchase_id)            AS number_of_purchases,
    SUM(p.total_amount)                      AS lifetime_spend,
    (SELECT COUNT(*) FROM BankAccount ba
     WHERE ba.customer_id = c.customer_id)   AS bank_accounts_registered
FROM Customer c
JOIN Purchase p ON c.customer_id = p.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY lifetime_spend DESC;
```

```sql
-- Query 4: Stock transfer report with low-stock alert
SELECT
    st.transfer_id,
    src.store_name          AS from_store,
    dst.store_name          AS to_store,
    pr.product_name,
    st.quantity             AS transferred_qty,
    st.transfer_date,
    COALESCE(ss.quantity,0) AS current_dst_stock,
    CASE
        WHEN COALESCE(ss.quantity,0) < 10 THEN 'LOW STOCK - REORDER'
        ELSE 'OK'
    END                     AS stock_alert
FROM StockTransfer st
JOIN Store   src ON st.from_store_id = src.store_id
JOIN Store   dst ON st.to_store_id   = dst.store_id
JOIN Product pr  ON st.product_id    = pr.product_id
LEFT JOIN StoreStock ss
       ON ss.store_id   = st.to_store_id
      AND ss.product_id = st.product_id
ORDER BY st.transfer_date DESC;
```

Or run all 4 queries at once from the script:

```bash
psql -U postgres -d tte_database -f "C:\path\to\TTE_PostgreSQL.sql"
```

Exit psql when done:

```sql
\q
```

---

## Part B — MongoDB

### Step 1: Create Required Directories

```bash
md E:\other_dev\mongodb\data
md E:\other_dev\mongodb\logs
```

---

### Step 2: Configure MongoDB

Create or edit `D:\mongodb\bin\mongod.cfg`:

```ini
dbpath=E:\other_dev\mongodb\data
logpath=E:\other_dev\mongodb\logs\mongo.log
logappend=true
quiet=true
port=27017
```

> Make sure `journal=true` is NOT in this file — it is no longer supported in MongoDB 6+.

---

### Step 3: Start the MongoDB Service

Open Command Prompt as Administrator:

```bash
mongod --config "D:\mongodb\bin\mongod.cfg"
```

Wait until you see:

```
"msg":"mongod startup complete"
```

> Keep this window open at all times. Do not close it.

---

### Step 4: Connect with mongosh

Open a **new** Command Prompt window and run:

```bash
mongosh
```

You should see the prompt:

```
test>
```

---

### Step 5: Run the MongoDB Script

From the mongosh prompt, load the script:

```javascript
load("C:\\path\\to\\TTE_MongoDB.js")
```

Example:

```javascript
load("C:\\Users\\YourUsername\\Desktop\\TTE_MongoDB.js")
```

Expected output:

```javascript
{ acknowledged: true, insertedCount: 10 }
{ acknowledged: true, insertedCount: 6  }
{ acknowledged: true, insertedCount: 10 }
{ acknowledged: true, insertedCount: 8  }
true
```

---

### Step 6: Verify the Data

```javascript
use("tte_database")

db.customers.countDocuments()   // Expected: 10
db.stores.countDocuments()      // Expected: 6
db.products.countDocuments()    // Expected: 10
db.purchases.countDocuments()   // Expected: 8
```

List all collections:

```javascript
show collections
```

Expected output:

```
customers
stores
products
purchases
```

---

### Step 7: Run the MongoDB Queries

**Query 1: Total revenue by store (OLAP-style aggregation)**

```javascript
db.purchases.aggregate([
  {
    $group: {
      _id: { store_id: "$store_id", store_name: "$store_name" },
      total_transactions: { $sum: 1 },
      total_revenue:      { $sum: "$total_amount" },
      avg_transaction:    { $avg: "$total_amount" }
    }
  },
  { $sort: { total_revenue: -1 } },
  {
    $project: {
      _id: 0,
      store_name:         "$_id.store_name",
      total_transactions: 1,
      total_revenue:      { $round: ["$total_revenue", 2] },
      avg_transaction:    { $round: ["$avg_transaction", 2] }
    }
  }
])
```

**Query 2: Top selling products across two collections**

```javascript
db.purchases.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id:              "$items.product_id",
      product_name:     { $first: "$items.product_name" },
      total_units_sold: { $sum: "$items.quantity" },
      total_revenue:    { $sum: "$items.line_total" }
    }
  },
  {
    $lookup: {
      from:         "products",
      localField:   "_id",
      foreignField: "_id",
      as:           "product_details"
    }
  },
  { $unwind: "$product_details" },
  {
    $project: {
      _id: 0,
      product_name:     1,
      product_type:     "$product_details.product_type",
      unit_price:       "$product_details.unit_price",
      total_units_sold: 1,
      total_revenue:    { $round: ["$total_revenue", 2] }
    }
  },
  { $sort: { total_revenue: -1 } }
])
```

**Query 3: Management report — sales within a date range**

```javascript
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
      from:         "customers",
      localField:   "customer_id",
      foreignField: "_id",
      as:           "customer"
    }
  },
  { $unwind: "$customer" },
  {
    $project: {
      _id: 0,
      purchase_id:    "$_id",
      store_name:     1,
      purchase_date:  1,
      total_amount:   1,
      payment_method: 1,
      customer_name:  { $concat: ["$customer.first_name", " ", "$customer.last_name"] },
      number_of_items:{ $size: "$items" }
    }
  },
  { $sort: { purchase_date: 1 } }
])
```

**Query 4: Query using nested document array**

```javascript
db.purchases.aggregate([
  { $unwind: "$items" },
  {
    $lookup: {
      from:         "products",
      localField:   "items.product_id",
      foreignField: "_id",
      as:           "product_info"
    }
  },
  { $unwind: "$product_info" },
  { $match: { "product_info.product_type": "Computer Game" } },
  {
    $project: {
      _id: 0,
      purchase_id:        "$_id",
      store_name:         1,
      purchase_date:      1,
      product_name:       "$items.product_name",
      product_type:       "$product_info.product_type",
      quantity_purchased: "$items.quantity",
      price_paid:         "$items.unit_price",
      line_total:         "$items.line_total"
    }
  },
  { $sort: { purchase_date: 1 } }
])
```

Exit mongosh when done:

```javascript
exit
```

---

## Database Schema Overview

### PostgreSQL — 8 Tables

```
Customer        (customer_id PK, first_name, last_name, address, phone, date_of_birth)
    |
    |-- BankAccount    (account_id PK, customer_id FK, bank_name, sort_code, account_number)
    |
    +-- Purchase       (purchase_id PK, customer_id FK, store_id FK, purchase_date, total_amount)
            |
            +-- PurchaseItem  (item_id PK, purchase_id FK, product_id FK, quantity, unit_price_at_sale)

Store           (store_id PK, store_name, address, phone, manager_name)
    |
    |-- StoreStock     (store_id FK, product_id FK, quantity)
    |
    +-- StockTransfer  (transfer_id PK, from_store_id FK, to_store_id FK, product_id FK, quantity)

Product         (product_id PK, product_type, product_name, description, unit_cost, unit_price)
```

### MongoDB — 4 Collections

```
customers   --> nested bank_accounts[ ]   (replaces Customer + BankAccount tables)
stores      --> nested stock[ ]           (replaces Store + StoreStock tables)
products    --> standalone collection     (replaces Product table)
purchases   --> nested items[ ]           (replaces Purchase + PurchaseItem tables)
```

---

## Troubleshooting

**`psql` is not recognised as a command**
```
Add PostgreSQL bin to system PATH:
C:\Program Files\PostgreSQL\<version>\bin
Reopen Command Prompt after updating PATH.
```

**`mongosh` is not recognised as a command**
```
Download MongoDB Shell from:
https://www.mongodb.com/try/download/shell
Add its bin directory to system PATH.
```

**MongoDB Compass / mongosh cannot connect**
```
Ensure the mongod service window is still running.
Do not close the terminal showing "mongod startup complete".
```

**SQL script errors on execution**
```
Ensure tte_database exists before running the script:
psql -U postgres -c "CREATE DATABASE tte_database;"
Then re-run the script against that database.
```

**mongosh load() not implemented**
```
Copy the entire contents of TTE_MongoDB.js and paste
directly into the mongosh terminal instead of using load().
```

---

## Tech Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| PostgreSQL | 15+ | Relational database (Part A) |
| psql | 15+ | PostgreSQL command-line client |
| MongoDB | 6+ | NoSQL document database (Part B) |
| mongosh | 2+ | MongoDB command-line shell |

---
