\# Tony's Toy Emporium (TTE) Database System



\## Project Overview



This project designs and implements a complete database system for Tony's Toy Emporium (TTE), including:



\- \*\*Part A\*\*: PostgreSQL Relational Database (8 tables)

\- \*\*Part B\*\*: MongoDB NoSQL Database (4 collections)



\---



\## File Structure



```

├── TTE\_Assignment\_Design.docx   # Design documentation (E-R Diagram, Data Dictionary, Part C Discussion)

├── TTE\_PostgreSQL.sql                # PostgreSQL script (create tables, insert data, queries)

├── TTE\_MongoDB.js                 # MongoDB script (create collections, insert data, queries)

└── README.md                    # Project documentation

```



\---



\## Prerequisites



\- \*\*PostgreSQL 15+\*\* — https://www.postgresql.org/download/windows/

\- \*\*MongoDB 6+\*\* — https://www.mongodb.com/try/download/community

\- \*\*mongosh\*\* — https://www.mongodb.com/try/download/shell



> After installation, add the following directories to your system \*\*PATH\*\* environment variable:

> ```

> C:\\Program Files\\PostgreSQL\\<version>\\bin

> C:\\Program Files\\mongosh\\bin

> ```



\---



\## Part A — PostgreSQL



\### Step 1: Connect to PostgreSQL



Open Command Prompt as Administrator and run:



```bash

psql -U postgres

```



Enter your password when prompted.



\---



\### Step 2: Create the Database



```sql

CREATE DATABASE tte\_database;

```



Verify it was created:



```sql

\\l

```



Switch to the database:



```sql

\\c tte\_database

```



Exit psql:



```sql

\\q

```



\---



\### Step 3: Run the SQL Script



```bash

psql -U postgres -d tte\_database -f "C:\\path\\to\\TTE\_PostgreSQL.sql"

```



Replace the path with the actual location of your file. Example:



```bash

psql -U postgres -d tte\_database -f "C:\\Users\\YourUsername\\Desktop\\TTE\_PostgreSQL.sql"

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



\---



\### Step 4: Verify the Data



Connect to the database:



```bash

psql -U postgres -d tte\_database

```



Check row counts:



```sql

SELECT 'Customer'       AS table\_name, COUNT(\*) AS row\_count FROM Customer

UNION ALL

SELECT 'BankAccount',   COUNT(\*) FROM BankAccount

UNION ALL

SELECT 'Store',         COUNT(\*) FROM Store

UNION ALL

SELECT 'Product',       COUNT(\*) FROM Product

UNION ALL

SELECT 'StoreStock',    COUNT(\*) FROM StoreStock

UNION ALL

SELECT 'Purchase',      COUNT(\*) FROM Purchase

UNION ALL

SELECT 'PurchaseItem',  COUNT(\*) FROM PurchaseItem

UNION ALL

SELECT 'StockTransfer', COUNT(\*) FROM StockTransfer;

```



Expected results:



```

&#x20;  table\_name   | row\_count

\----------------+-----------

&#x20;Customer       |        10

&#x20;BankAccount    |        10

&#x20;Store          |         6

&#x20;Product        |        10

&#x20;StoreStock     |        19

&#x20;Purchase       |         8

&#x20;PurchaseItem   |        16

&#x20;StockTransfer  |         6

```



\---



\### Step 5: Run the SQL Queries



While connected to `tte\_database`, run each query directly:



```sql

\-- Query 1: Management Report - Sales summary by store

SELECT

&#x20;   s.store\_name,

&#x20;   COUNT(p.purchase\_id)  AS total\_transactions,

&#x20;   SUM(p.total\_amount)   AS total\_revenue,

&#x20;   AVG(p.total\_amount)   AS avg\_transaction\_value

FROM Purchase p

JOIN Store s ON p.store\_id = s.store\_id

WHERE p.purchase\_date BETWEEN '2025-01-01' AND '2025-03-31'

GROUP BY s.store\_id, s.store\_name

ORDER BY total\_revenue DESC;

```



```sql

\-- Query 2: Top selling products by revenue

SELECT

&#x20;   pr.product\_name,

&#x20;   pr.product\_type,

&#x20;   SUM(pi.quantity)   AS total\_units\_sold,

&#x20;   SUM(pi.line\_total) AS total\_revenue

FROM PurchaseItem pi

JOIN Product pr ON pi.product\_id = pr.product\_id

GROUP BY pr.product\_id, pr.product\_name, pr.product\_type

ORDER BY total\_revenue DESC;

```



```sql

\-- Query 3: Customer purchase history with bank account count

SELECT

&#x20;   c.customer\_id,

&#x20;   c.first\_name || ' ' || c.last\_name      AS full\_name,

&#x20;   COUNT(DISTINCT p.purchase\_id)            AS number\_of\_purchases,

&#x20;   SUM(p.total\_amount)                      AS lifetime\_spend,

&#x20;   (SELECT COUNT(\*) FROM BankAccount ba

&#x20;    WHERE ba.customer\_id = c.customer\_id)   AS bank\_accounts\_registered

FROM Customer c

JOIN Purchase p ON c.customer\_id = p.customer\_id

GROUP BY c.customer\_id, c.first\_name, c.last\_name

ORDER BY lifetime\_spend DESC;

```



```sql

\-- Query 4: Stock transfer report with low-stock alert

SELECT

&#x20;   st.transfer\_id,

&#x20;   src.store\_name          AS from\_store,

&#x20;   dst.store\_name          AS to\_store,

&#x20;   pr.product\_name,

&#x20;   st.quantity             AS transferred\_qty,

&#x20;   st.transfer\_date,

&#x20;   COALESCE(ss.quantity,0) AS current\_dst\_stock,

&#x20;   CASE

&#x20;       WHEN COALESCE(ss.quantity,0) < 10 THEN 'LOW STOCK - REORDER'

&#x20;       ELSE 'OK'

&#x20;   END                     AS stock\_alert

FROM StockTransfer st

JOIN Store   src ON st.from\_store\_id = src.store\_id

JOIN Store   dst ON st.to\_store\_id   = dst.store\_id

JOIN Product pr  ON st.product\_id    = pr.product\_id

LEFT JOIN StoreStock ss

&#x20;      ON ss.store\_id   = st.to\_store\_id

&#x20;     AND ss.product\_id = st.product\_id

ORDER BY st.transfer\_date DESC;

```



Or run all 4 queries at once from the script:



```bash

psql -U postgres -d tte\_database -f "C:\\path\\to\\TTE\_PostgreSQL.sql"

```



Exit psql when done:



```sql

\\q

```



\---



\## Part B — MongoDB



\### Step 1: Create Required Directories



```bash

md E:\\other\_dev\\mongodb\\data

md E:\\other\_dev\\mongodb\\logs

```



\---



\### Step 2: Configure MongoDB



Create or edit `D:\\mongodb\\bin\\mongod.cfg`:



```ini

dbpath=E:\\other\_dev\\mongodb\\data

logpath=E:\\other\_dev\\mongodb\\logs\\mongo.log

logappend=true

quiet=true

port=27017

```



> Make sure `journal=true` is NOT in this file — it is no longer supported in MongoDB 6+.



\---



\### Step 3: Start the MongoDB Service



Open Command Prompt as Administrator:



```bash

mongod --config "D:\\mongodb\\bin\\mongod.cfg"

```



Wait until you see:



```

"msg":"mongod startup complete"

```



> Keep this window open at all times. Do not close it.



\---



\### Step 4: Connect with mongosh



Open a \*\*new\*\* Command Prompt window and run:



```bash

mongosh

```



You should see the prompt:



```

test>

```



\---



\### Step 5: Run the MongoDB Script



From the mongosh prompt, load the script:



```javascript

load("C:\\\\path\\\\to\\\\TTE\_MongoDB.js")

```



Example:



```javascript

load("C:\\\\Users\\\\YourUsername\\\\Desktop\\\\TTE\_MongoDB.js")

```



Expected output:



```javascript

{ acknowledged: true, insertedCount: 10 }

{ acknowledged: true, insertedCount: 6  }

{ acknowledged: true, insertedCount: 10 }

{ acknowledged: true, insertedCount: 8  }

true

```



\---



\### Step 6: Verify the Data



```javascript

use("tte\_database")



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



\---



\### Step 7: Run the MongoDB Queries



\*\*Query 1: Total revenue by store (OLAP-style aggregation)\*\*



```javascript

db.purchases.aggregate(\[

&#x20; {

&#x20;   $group: {

&#x20;     \_id: { store\_id: "$store\_id", store\_name: "$store\_name" },

&#x20;     total\_transactions: { $sum: 1 },

&#x20;     total\_revenue:      { $sum: "$total\_amount" },

&#x20;     avg\_transaction:    { $avg: "$total\_amount" }

&#x20;   }

&#x20; },

&#x20; { $sort: { total\_revenue: -1 } },

&#x20; {

&#x20;   $project: {

&#x20;     \_id: 0,

&#x20;     store\_name:         "$\_id.store\_name",

&#x20;     total\_transactions: 1,

&#x20;     total\_revenue:      { $round: \["$total\_revenue", 2] },

&#x20;     avg\_transaction:    { $round: \["$avg\_transaction", 2] }

&#x20;   }

&#x20; }

])

```



\*\*Query 2: Top selling products across two collections\*\*



```javascript

db.purchases.aggregate(\[

&#x20; { $unwind: "$items" },

&#x20; {

&#x20;   $group: {

&#x20;     \_id:              "$items.product\_id",

&#x20;     product\_name:     { $first: "$items.product\_name" },

&#x20;     total\_units\_sold: { $sum: "$items.quantity" },

&#x20;     total\_revenue:    { $sum: "$items.line\_total" }

&#x20;   }

&#x20; },

&#x20; {

&#x20;   $lookup: {

&#x20;     from:         "products",

&#x20;     localField:   "\_id",

&#x20;     foreignField: "\_id",

&#x20;     as:           "product\_details"

&#x20;   }

&#x20; },

&#x20; { $unwind: "$product\_details" },

&#x20; {

&#x20;   $project: {

&#x20;     \_id: 0,

&#x20;     product\_name:     1,

&#x20;     product\_type:     "$product\_details.product\_type",

&#x20;     unit\_price:       "$product\_details.unit\_price",

&#x20;     total\_units\_sold: 1,

&#x20;     total\_revenue:    { $round: \["$total\_revenue", 2] }

&#x20;   }

&#x20; },

&#x20; { $sort: { total\_revenue: -1 } }

])

```



\*\*Query 3: Management report — sales within a date range\*\*



```javascript

db.purchases.aggregate(\[

&#x20; {

&#x20;   $match: {

&#x20;     purchase\_date: {

&#x20;       $gte: new Date("2025-01-01"),

&#x20;       $lte: new Date("2025-03-31")

&#x20;     }

&#x20;   }

&#x20; },

&#x20; {

&#x20;   $lookup: {

&#x20;     from:         "customers",

&#x20;     localField:   "customer\_id",

&#x20;     foreignField: "\_id",

&#x20;     as:           "customer"

&#x20;   }

&#x20; },

&#x20; { $unwind: "$customer" },

&#x20; {

&#x20;   $project: {

&#x20;     \_id: 0,

&#x20;     purchase\_id:    "$\_id",

&#x20;     store\_name:     1,

&#x20;     purchase\_date:  1,

&#x20;     total\_amount:   1,

&#x20;     payment\_method: 1,

&#x20;     customer\_name:  { $concat: \["$customer.first\_name", " ", "$customer.last\_name"] },

&#x20;     number\_of\_items:{ $size: "$items" }

&#x20;   }

&#x20; },

&#x20; { $sort: { purchase\_date: 1 } }

])

```



\*\*Query 4: Query using nested document array\*\*



```javascript

db.purchases.aggregate(\[

&#x20; { $unwind: "$items" },

&#x20; {

&#x20;   $lookup: {

&#x20;     from:         "products",

&#x20;     localField:   "items.product\_id",

&#x20;     foreignField: "\_id",

&#x20;     as:           "product\_info"

&#x20;   }

&#x20; },

&#x20; { $unwind: "$product\_info" },

&#x20; { $match: { "product\_info.product\_type": "Computer Game" } },

&#x20; {

&#x20;   $project: {

&#x20;     \_id: 0,

&#x20;     purchase\_id:        "$\_id",

&#x20;     store\_name:         1,

&#x20;     purchase\_date:      1,

&#x20;     product\_name:       "$items.product\_name",

&#x20;     product\_type:       "$product\_info.product\_type",

&#x20;     quantity\_purchased: "$items.quantity",

&#x20;     price\_paid:         "$items.unit\_price",

&#x20;     line\_total:         "$items.line\_total"

&#x20;   }

&#x20; },

&#x20; { $sort: { purchase\_date: 1 } }

])

```



Exit mongosh when done:



```javascript

exit

```



\---



\## Database Schema Overview



\### PostgreSQL — 8 Tables



```

Customer        (customer\_id PK, first\_name, last\_name, address, phone, date\_of\_birth)

&#x20;   |

&#x20;   |-- BankAccount    (account\_id PK, customer\_id FK, bank\_name, sort\_code, account\_number)

&#x20;   |

&#x20;   +-- Purchase       (purchase\_id PK, customer\_id FK, store\_id FK, purchase\_date, total\_amount)

&#x20;           |

&#x20;           +-- PurchaseItem  (item\_id PK, purchase\_id FK, product\_id FK, quantity, unit\_price\_at\_sale)



Store           (store\_id PK, store\_name, address, phone, manager\_name)

&#x20;   |

&#x20;   |-- StoreStock     (store\_id FK, product\_id FK, quantity)

&#x20;   |

&#x20;   +-- StockTransfer  (transfer\_id PK, from\_store\_id FK, to\_store\_id FK, product\_id FK, quantity)



Product         (product\_id PK, product\_type, product\_name, description, unit\_cost, unit\_price)

```



\### MongoDB — 4 Collections



```

customers   --> nested bank\_accounts\[ ]   (replaces Customer + BankAccount tables)

stores      --> nested stock\[ ]           (replaces Store + StoreStock tables)

products    --> standalone collection     (replaces Product table)

purchases   --> nested items\[ ]           (replaces Purchase + PurchaseItem tables)

```



\---



\## Troubleshooting



\*\*`psql` is not recognised as a command\*\*

```

Add PostgreSQL bin to system PATH:

C:\\Program Files\\PostgreSQL\\<version>\\bin

Reopen Command Prompt after updating PATH.

```



\*\*`mongosh` is not recognised as a command\*\*

```

Download MongoDB Shell from:

https://www.mongodb.com/try/download/shell

Add its bin directory to system PATH.

```



\*\*MongoDB Compass / mongosh cannot connect\*\*

```

Ensure the mongod service window is still running.

Do not close the terminal showing "mongod startup complete".

```



\*\*SQL script errors on execution\*\*

```

Ensure tte\_database exists before running the script:

psql -U postgres -c "CREATE DATABASE tte\_database;"

Then re-run the script against that database.

```



\*\*mongosh load() not implemented\*\*

```

Copy the entire contents of TTE\_MongoDB.js and paste

directly into the mongosh terminal instead of using load().

```



\---



\## Tech Stack



| Component | Version | Purpose |

|-----------|---------|---------|

| PostgreSQL | 15+ | Relational database (Part A) |

| psql | 15+ | PostgreSQL command-line client |

| MongoDB | 6+ | NoSQL document database (Part B) |

| mongosh | 2+ | MongoDB command-line shell |



\---

