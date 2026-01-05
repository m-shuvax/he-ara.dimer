const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'mydb.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('DB connection error:', err.message);
  } else {
    console.log('SQLite connected');
  }
});


const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('SQL Error:', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const insert = (table, values) => {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(values);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const params = Object.values(values);

    db.run(sql, params, function(err) {
      if (err) {
        console.error('Insert Error:', err.message);
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const update = (table, values, where) => {
  return new Promise((resolve, reject) => {
    const setClause = Object.keys(values).map(key => `${key} = ?`).join(', ');
    const whereClause = where.map(w => `${w.field} ${w.operator} ?`).join(' AND ');
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    const params = [...Object.values(values), ...where.map(w => w.value)];

    db.run(sql, params, function(err) {
      if (err) {
        console.error('Update Error:', err.message);
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
};

const select = (table, where = null, columnsSelect = null) => {
  return new Promise((resolve, reject) => {
    const columns = columnsSelect ? columnsSelect.join(', ') : '*';
    let sql = `SELECT ${columns} FROM ${table}`;
    let params = [];

    if (where && where.length > 0) {
      const whereClause = where.map(w => `${w.field} ${w.operator} ?`).join(' AND ');
      sql += ` WHERE ${whereClause}`;
      params = where.map(w => w.value);
    }

    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Select Error:', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  db,
  query,
  insert,
  update,
  select
}