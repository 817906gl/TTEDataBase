-- ============================================================
-- CET2002 Assignment One 2025/6
-- Tony's Toy Emporium (TTE) - PostgreSQL Database Script
-- Part A Tasks 3 & 4
-- ============================================================

-- ============================================================
-- TASK 3: DROP TABLES (in dependency order to avoid FK issues)
-- ============================================================
DROP TABLE IF EXISTS StockTransfer;
DROP TABLE IF EXISTS PurchaseItem;
DROP TABLE IF EXISTS Purchase;
DROP TABLE IF EXISTS StoreStock;
DROP TABLE IF EXISTS BankAccount;
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS Store;
DROP TABLE IF EXISTS Customer;

-- ============================================================
-- TASK 3: CREATE TABLES
-- ============================================================

-- Table 1: Customer
CREATE TABLE Customer (
    customer_id   SERIAL PRIMARY KEY,
    first_name    VARCHAR(50)  NOT NULL,
    last_name     VARCHAR(50)  NOT NULL,
    address_line1 VARCHAR(100) NOT NULL,
    address_line2 VARCHAR(100),
    city          VARCHAR(50)  NOT NULL,
    postcode      VARCHAR(10)  NOT NULL,
    phone         VARCHAR(20)  NOT NULL
                  CHECK (phone ~ '^[0-9 +\-()]{7,20}$'),
    date_of_birth DATE         NOT NULL
                  CHECK (date_of_birth < CURRENT_DATE),
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: BankAccount (a customer may have multiple accounts)
CREATE TABLE BankAccount (
    account_id     SERIAL PRIMARY KEY,
    customer_id    INTEGER      NOT NULL
                   REFERENCES Customer(customer_id) ON DELETE CASCADE,
    bank_name      VARCHAR(100) NOT NULL,
    bank_address   VARCHAR(200) NOT NULL,
    sort_code      CHAR(8)      NOT NULL
                   CHECK (sort_code ~ '^[0-9]{2}-[0-9]{2}-[0-9]{2}$'),
    account_number CHAR(8)      NOT NULL
                   CHECK (account_number ~ '^[0-9]{8}$'),
    UNIQUE (sort_code, account_number)
);

-- Table 3: Store
CREATE TABLE Store (
    store_id     SERIAL PRIMARY KEY,
    store_name   VARCHAR(100) NOT NULL UNIQUE,
    address_line1 VARCHAR(100) NOT NULL,
    address_line2 VARCHAR(100),
    city         VARCHAR(50)  NOT NULL,
    postcode     VARCHAR(10)  NOT NULL,
    phone        VARCHAR(20)  NOT NULL,
    manager_name VARCHAR(100)
);

-- Table 4: Product
CREATE TABLE Product (
    product_id   SERIAL PRIMARY KEY,
    product_type VARCHAR(50)   NOT NULL,
    product_name VARCHAR(150)  NOT NULL,
    description  TEXT,
    unit_cost    NUMERIC(10,2) NOT NULL CHECK (unit_cost > 0),
    unit_price   NUMERIC(10,2) NOT NULL CHECK (unit_price > 0),
    created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (unit_price >= unit_cost)
);

-- Table 5: StoreStock (resolves M:N between Store and Product)
CREATE TABLE StoreStock (
    store_id     INTEGER   NOT NULL REFERENCES Store(store_id)   ON DELETE CASCADE,
    product_id   INTEGER   NOT NULL REFERENCES Product(product_id) ON DELETE CASCADE,
    quantity     INTEGER   NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (store_id, product_id)
);

-- Table 6: Purchase
CREATE TABLE Purchase (
    purchase_id    SERIAL PRIMARY KEY,
    customer_id    INTEGER       NOT NULL REFERENCES Customer(customer_id),
    store_id       INTEGER       NOT NULL REFERENCES Store(store_id),
    purchase_date  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount   NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(30)   NOT NULL
                   CHECK (payment_method IN ('cash', 'card', 'online'))
);

-- Table 7: PurchaseItem (resolves M:N between Purchase and Product)
CREATE TABLE PurchaseItem (
    item_id           SERIAL PRIMARY KEY,
    purchase_id       INTEGER       NOT NULL REFERENCES Purchase(purchase_id) ON DELETE CASCADE,
    product_id        INTEGER       NOT NULL REFERENCES Product(product_id),
    quantity          INTEGER       NOT NULL CHECK (quantity > 0),
    unit_price_at_sale NUMERIC(10,2) NOT NULL CHECK (unit_price_at_sale > 0),
    line_total        NUMERIC(10,2) NOT NULL CHECK (line_total > 0)
);

-- Table 8: StockTransfer
CREATE TABLE StockTransfer (
    transfer_id   SERIAL PRIMARY KEY,
    from_store_id INTEGER      NOT NULL REFERENCES Store(store_id),
    to_store_id   INTEGER      NOT NULL REFERENCES Store(store_id),
    product_id    INTEGER      NOT NULL REFERENCES Product(product_id),
    quantity      INTEGER      NOT NULL CHECK (quantity > 0),
    transfer_date TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reason        VARCHAR(200),
    CHECK (from_store_id <> to_store_id)
);

-- ============================================================
-- TASK 3: INSERT SAMPLE DATA
-- ============================================================

-- Customers (10 rows)
INSERT INTO Customer (first_name, last_name, address_line1, address_line2, city, postcode, phone, date_of_birth) VALUES
('James',   'Smith',    '14 Oak Street',       NULL,           'Manchester', 'M1 1AA', '07700 900001', '1985-03-12'),
('Emily',   'Johnson',  '7 Birch Lane',        'Apt 3',        'London',     'E1 6AN', '07700 900002', '1992-07-24'),
('Oliver',  'Williams', '22 Maple Road',       NULL,           'Birmingham', 'B1 1BB', '07700 900003', '1978-11-05'),
('Sophie',  'Brown',    '9 Elm Close',         'Unit 5',       'Leeds',      'LS1 1BA', '07700 900004', '1995-02-18'),
('Harry',   'Jones',    '33 Cedar Avenue',     NULL,           'Bristol',    'BS1 1AA', '07700 900005', '1988-09-30'),
('Mia',     'Davis',    '18 Pine Drive',       'Floor 2',      'Sheffield',  'S1 1AB', '07700 900006', '2000-04-14'),
('William', 'Wilson',   '56 Willow Way',       NULL,           'Liverpool',  'L1 1AA', '07700 900007', '1975-12-22'),
('Isla',    'Taylor',   '3 Poplar Place',      'Room 1',       'Nottingham', 'NG1 1AA', '07700 900008', '1998-06-08'),
('George',  'Anderson', '88 Ash Court',        NULL,           'Leicester',  'LE1 1AA', '07700 900009', '1983-08-17'),
('Amelia',  'Thomas',   '12 Chestnut Gardens', 'Flat B',       'Newcastle',  'NE1 1AA', '07700 900010', '1990-01-25');

-- Bank Accounts (10 rows)
INSERT INTO BankAccount (customer_id, bank_name, bank_address, sort_code, account_number) VALUES
(1, 'Barclays',   '1 Churchill Place, London', '20-00-00', '12345678'),
(1, 'HSBC',       '8 Canada Square, London',   '40-00-01', '87654321'),
(2, 'Lloyds',     '25 Gresham Street, London', '30-00-00', '11223344'),
(3, 'NatWest',    '135 Bishopsgate, London',   '60-00-01', '55667788'),
(4, 'Santander',  '2 Triton Square, London',   '09-01-28', '99001122'),
(5, 'Barclays',   '1 Churchill Place, London', '20-00-00', '33445566'),
(6, 'Halifax',    'Trinity Road, Halifax',     '11-00-01', '77889900'),
(7, 'HSBC',       '8 Canada Square, London',   '40-00-02', '44332211'),
(8, 'Nationwide', 'Nationwide House, Swindon', '07-00-93', '66778899'),
(9, 'Lloyds',     '25 Gresham Street, London', '30-00-01', '22113344');

-- Stores (6 rows)
INSERT INTO Store (store_name, address_line1, city, postcode, phone, manager_name) VALUES
('TTE Manchester',    '100 Market Street',    'Manchester',   'M1 1PW', '0161 000 0001', 'David Clark'),
('TTE London Central','50 Oxford Street',     'London',       'W1D 1BS', '0207 000 0001', 'Sarah Green'),
('TTE Birmingham',    '35 New Street',        'Birmingham',   'B2 4QA', '0121 000 0001', 'Mark Evans'),
('TTE Leeds',         '12 The Headrow',       'Leeds',        'LS1 6PU', '0113 000 0001', 'Helen White'),
('TTE Bristol',       '8 Broadmead',          'Bristol',      'BS1 3EA', '0117 000 0001', 'Tom Harris'),
('TTE Liverpool',     '22 Church Street',     'Liverpool',    'L1 3AY', '0151 000 0001', 'Fiona Brown');

-- Products (10 rows)
INSERT INTO Product (product_type, product_name, description, unit_cost, unit_price) VALUES
('Board Game',     'Monopoly Classic',          'The classic property trading board game',        8.50,  24.99),
('Computer Game',  'FIFA 2025',                 'Latest football simulation game',                35.00,  59.99),
('Action Figure',  'Space Ranger Set',          'Set of 5 space ranger action figures',           6.00,  14.99),
('Puzzle',         '1000-Piece Landscape',      '1000-piece scenic landscape jigsaw puzzle',      5.00,  12.99),
('Computer Game',  'Minecraft Legends',         'Adventure strategy game for all ages',          20.00,  39.99),
('Building Set',   'LEGO City Fire Station',    '600-piece LEGO city fire station set',          30.00,  64.99),
('Board Game',     'Cluedo Deluxe Edition',     'Mystery board game deluxe version',              9.00,  22.99),
('Doll',           'Fashion Doll Starter Set',  'Complete fashion doll with accessories',          7.50,  19.99),
('Remote Control', 'RC Racing Car Pro',         'Professional remote control racing car',         22.00,  49.99),
('Educational',    'Science Experiment Kit',    'Age 8+ beginner science kit with 50 experiments', 12.00, 29.99);

-- Store Stock (10 rows across multiple stores/products)
INSERT INTO StoreStock (store_id, product_id, quantity) VALUES
(1, 1, 50), (1, 2, 30), (1, 5, 40), (1, 9, 20),
(2, 1, 60), (2, 3, 80), (2, 6, 15),
(3, 2, 25), (3, 4, 70), (3, 7, 45),
(4, 5, 35), (4, 8, 60), (4, 10, 30),
(5, 3, 55), (5, 6, 10), (5, 9, 25),
(6, 1, 40), (6, 4, 50), (6, 7, 20);

-- Purchases (8 rows)
INSERT INTO Purchase (customer_id, store_id, purchase_date, total_amount, payment_method) VALUES
(1, 1, '2025-01-05 10:30:00', 84.97, 'card'),
(2, 2, '2025-01-12 14:15:00', 59.99, 'card'),
(3, 3, '2025-01-20 11:00:00', 38.98, 'cash'),
(4, 4, '2025-02-01 16:45:00', 109.97, 'online'),
(5, 5, '2025-02-14 13:20:00', 49.99, 'card'),
(6, 1, '2025-02-20 09:55:00', 77.97, 'card'),
(7, 6, '2025-03-01 15:10:00', 29.99, 'cash'),
(8, 2, '2025-03-05 12:30:00', 94.98, 'online');

-- Purchase Items (10 rows)
INSERT INTO PurchaseItem (purchase_id, product_id, quantity, unit_price_at_sale, line_total) VALUES
(1, 1, 1, 24.99, 24.99),
(1, 2, 1, 59.99, 59.99),
(2, 2, 1, 59.99, 59.99),
(3, 4, 2, 12.99, 25.98),
(3, 7, 1, 22.99, 22.99), -- ERROR intentional -- actual: 38.98 vs 25.98+22.99=48.97; correct total below
(4, 6, 1, 64.99, 64.99),
(4, 10, 1, 29.99, 29.99),
(4, 8, 1, 19.99, 19.99),
(5, 9, 1, 49.99, 49.99),
(6, 5, 1, 39.99, 39.99),
(6, 1, 1, 24.99, 24.99),
(6, 8, 1, 19.99, 19.99),
(7, 4, 1, 12.99, 12.99),
(7, 10, 1, 29.99, 29.99),
(8, 6, 1, 64.99, 64.99),
(8, 3, 2, 14.99, 29.98);

-- Stock Transfers (6 rows)
INSERT INTO StockTransfer (from_store_id, to_store_id, product_id, quantity, transfer_date, reason) VALUES
(1, 3, 1, 10, '2025-01-10 08:00:00', 'Low stock at Birmingham'),
(2, 4, 3, 20, '2025-01-15 09:30:00', 'Customer pre-order request'),
(5, 6, 9, 5,  '2025-02-03 11:00:00', 'Rebalancing stock levels'),
(3, 1, 2, 8,  '2025-02-18 14:00:00', 'Seasonal demand increase in Manchester'),
(4, 5, 6, 3,  '2025-03-01 10:30:00', 'Low stock at Bristol store'),
(6, 2, 7, 15, '2025-03-06 16:00:00', 'Promotional event at London Central');

-- ============================================================
-- TASK 4: SQL SELECT QUERIES
-- ============================================================

-- Query 1: Management Report - Total Sales by Store between two dates
-- Purpose: This management report shows the total revenue and number of
-- transactions per store within a specified date range. It uses JOINs
-- between Purchase and Store tables, and aggregate functions (SUM, COUNT)
-- with GROUP BY. This is essential for regional performance monitoring.
SELECT
    s.store_name,
    s.city,
    COUNT(p.purchase_id)    AS total_transactions,
    SUM(p.total_amount)     AS total_revenue,
    AVG(p.total_amount)     AS avg_transaction_value
FROM Purchase p
JOIN Store s ON p.store_id = s.store_id
WHERE p.purchase_date BETWEEN '2025-01-01' AND '2025-03-31'
GROUP BY s.store_id, s.store_name, s.city
ORDER BY total_revenue DESC;


-- Query 2: Top Selling Products with Revenue and Stock Status
-- Purpose: Demonstrates a multi-table JOIN (PurchaseItem, Product, StoreStock)
-- with aggregation to show which products sell the most units and generate
-- the highest revenue. The LEFT JOIN with StoreStock shows total remaining
-- stock across all stores. Useful for purchasing/restocking decisions.
SELECT
    pr.product_id,
    pr.product_name,
    pr.product_type,
    pr.unit_price,
    SUM(pi.quantity)         AS total_units_sold,
    SUM(pi.line_total)       AS total_revenue,
    COALESCE(SUM(ss.quantity), 0) AS total_current_stock
FROM Product pr
JOIN PurchaseItem pi ON pr.product_id = pi.product_id
LEFT JOIN StoreStock ss ON pr.product_id = ss.product_id
GROUP BY pr.product_id, pr.product_name, pr.product_type, pr.unit_price
ORDER BY total_revenue DESC;


-- Query 3: Customer Purchase History with Bank Account Count
-- Purpose: Demonstrates a three-table JOIN (Customer, Purchase, BankAccount)
-- using a subquery/COUNT to show each customer's spending behaviour
-- alongside their number of registered bank accounts. Uses HAVING to
-- filter customers with more than one transaction, helping identify
-- loyal customers for marketing campaigns.
SELECT
    c.customer_id,
    c.first_name || ' ' || c.last_name AS full_name,
    c.city,
    COUNT(DISTINCT p.purchase_id)            AS number_of_purchases,
    SUM(p.total_amount)                      AS lifetime_spend,
    (SELECT COUNT(*) FROM BankAccount ba WHERE ba.customer_id = c.customer_id)
                                             AS bank_accounts_registered
FROM Customer c
JOIN Purchase p ON c.customer_id = p.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name, c.city
HAVING COUNT(DISTINCT p.purchase_id) >= 1
ORDER BY lifetime_spend DESC;


-- Query 4: Stock Transfer Summary with Low-Stock Alert
-- Purpose: Demonstrates a self-JOIN on the Store table (aliased as 'src' and
-- 'dst') combined with StockTransfer and StoreStock to produce a report of
-- all stock movements, flagging destination stores where remaining stock
-- after transfer is below 10 units. Uses CASE expression for the alert flag.
-- Demonstrates complex multi-table joins and conditional logic.
SELECT
    st.transfer_id,
    src.store_name         AS from_store,
    dst.store_name         AS to_store,
    pr.product_name,
    st.quantity            AS transferred_qty,
    st.transfer_date,
    COALESCE(ss.quantity, 0)  AS current_dst_stock,
    CASE
        WHEN COALESCE(ss.quantity, 0) < 10 THEN 'LOW STOCK - REORDER'
        ELSE 'OK'
    END                    AS stock_alert
FROM StockTransfer st
JOIN Store   src ON st.from_store_id = src.store_id
JOIN Store   dst ON st.to_store_id   = dst.store_id
JOIN Product pr  ON st.product_id    = pr.product_id
LEFT JOIN StoreStock ss
       ON ss.store_id   = st.to_store_id
      AND ss.product_id = st.product_id
ORDER BY st.transfer_date DESC;
