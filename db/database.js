/* ============================================================
   db/database.js — SQLite Database Layer (using sql.js)
   Serverless-compatible (Vercel / Lambda) + Local Persistent
============================================================ */
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const os = require('os');

const isServerless = !!(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT ||
  process.env.VERCEL_ENV
);

// Bundled DB in repository
const BUNDLED_DB_PATH = path.join(__dirname, '..', 'launchpad.db');

// In serverless, write to /tmp; locally, write to project root
const ACTIVE_DB_PATH = isServerless
  ? path.join(os.tmpdir(), 'launchpad.db')
  : BUNDLED_DB_PATH;

let db = null;
let initPromise = null;

async function initDB() {
  if (db) return db;

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      const SQL = await initSqlJs();

      if (isServerless) {
        // If /tmp/launchpad.db already exists, load from /tmp
        if (fs.existsSync(ACTIVE_DB_PATH)) {
          const fileBuffer = fs.readFileSync(ACTIVE_DB_PATH);
          db = new SQL.Database(fileBuffer);
          console.log(`✅ Loaded existing database from serverless storage (${ACTIVE_DB_PATH})`);
        } else if (fs.existsSync(BUNDLED_DB_PATH)) {
          // Copy bundled DB into /tmp so future writes succeed
          const fileBuffer = fs.readFileSync(BUNDLED_DB_PATH);
          fs.writeFileSync(ACTIVE_DB_PATH, fileBuffer);
          db = new SQL.Database(fileBuffer);
          console.log(`✅ Copied bundled database to serverless storage (${ACTIVE_DB_PATH})`);
        } else {
          // Initialize fresh schema
          db = new SQL.Database();
          const schemaPath = path.join(__dirname, 'schema.sql');
          if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            db.run(schema);
          }
          saveDB();
          console.log('✅ Created fresh database from schema in serverless storage');
        }
      } else {
        // Local environment
        if (fs.existsSync(ACTIVE_DB_PATH)) {
          const fileBuffer = fs.readFileSync(ACTIVE_DB_PATH);
          db = new SQL.Database(fileBuffer);
          console.log(`✅ Loaded database from ${ACTIVE_DB_PATH}`);
        } else {
          db = new SQL.Database();
          const schemaPath = path.join(__dirname, 'schema.sql');
          if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            db.run(schema);
          }
          saveDB();
          console.log(`✅ Created fresh database at ${ACTIVE_DB_PATH}`);
        }
      }

      return db;
    } catch (err) {
      console.error('❌ Failed to initialize database:', err);
      throw err;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

function saveDB() {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(ACTIVE_DB_PATH, buffer);
  } catch (err) {
    console.warn(`⚠️ Warning: Could not write database to ${ACTIVE_DB_PATH}:`, err.message);
  }
}

// Wrapper functions for easier querying
const dbWrapper = {
  run(sql, params = []) {
    if (!db) throw new Error('Database not initialized. Please call initDB() first.');
    db.run(sql, params);
    saveDB();
    return { changes: 1 };
  },

  get(sql, params = []) {
    if (!db) throw new Error('Database not initialized. Please call initDB() first.');
    const stmt = db.prepare(sql);
    stmt.bind(params);
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return row;
    }
    stmt.free();
    return null;
  },

  all(sql, params = []) {
    if (!db) throw new Error('Database not initialized. Please call initDB() first.');
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
  },

  exec(sql) {
    if (!db) throw new Error('Database not initialized. Please call initDB() first.');
    db.run(sql);
    saveDB();
  }
};

function getDbStatus() {
  if (!db) {
    return { status: 'disconnected', initialized: false };
  }
  try {
    const tables = dbWrapper.all(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    ).map(t => t.name);

    const counts = {};
    for (const t of tables) {
      const c = dbWrapper.get(`SELECT COUNT(*) as count FROM "${t}"`);
      counts[t] = c ? c.count : 0;
    }

    return {
      status: 'connected',
      initialized: true,
      storagePath: ACTIVE_DB_PATH,
      isServerless,
      tablesCount: tables.length,
      tables,
      counts
    };
  } catch (err) {
    return {
      status: 'error',
      error: err.message,
      storagePath: ACTIVE_DB_PATH,
      isServerless
    };
  }
}

module.exports = {
  initDB,
  saveDB,
  dbWrapper,
  getDbStatus,
  isServerless,
  ACTIVE_DB_PATH
};
