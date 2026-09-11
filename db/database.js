/* ============================================================
   db/database.js — SQLite Database Layer (using sql.js)
   Pure JavaScript SQLite, no native compilation required.
============================================================ */
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'launchpad.db');
let db = null;

async function initDB() {
  const SQL = await initSqlJs();
  
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    db.run(schema);
    saveDB();
  }
  
  console.log('✅ Database initialized');
  return db;
}

function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

// Wrapper functions for easier querying
const dbWrapper = {
  run(sql, params = []) {
    db.run(sql, params);
    saveDB();
    return { changes: 1 };
  },
  
  get(sql, params = []) {
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
    db.run(sql);
    saveDB();
  }
};

module.exports = { initDB, saveDB, dbWrapper };
