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

const mySqlQuery = async (sql) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }
            connection.query(sql, (error, results, fields) => {
                connection.release();
                if (error) {
                    console.trace(sql);
                    console.log(error.message);
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    });
}

const insert = async (table, values) => {
    try {
        const sql = mysql.format(`INSERT INTO ${table} SET ? `, values);
        return mySqlQuery(sql);
    } catch (err) {
        console.trace(err);
        return err;
    }
}



const update = async (table, values, where) => {
    try {
    const sql = mysql.format(`UPDATE ${table} SET ? WHERE ${where.map(w => `${w.field} ${w.operator} ${w.value}`).join(' AND ')}`, values);
    return mySqlQuery(sql);
    }catch(err){
        console.trace(err);
        return err;
    }
}


const select = async (table, where, columnsSelect) => {
    const columns = columnsSelect ? columnsSelect.join(', ') : '*';
    const sql = mysql.format(`SELECT ${columns} FROM ${table} ${where ? `WHERE ${where.map(w => `${w.field} ${w.operator} ${w.value}`).join(' AND ')}` : ''}`);
    return mySqlQuery(sql);
}


module.exports = {
    db,
    insert,
    update,
    select    
}