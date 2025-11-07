const mysql = require('mysql2')

// VULNERABLE: SQL injection via string concatenation
function login(username, password) {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password123',
    database: 'users'
  })
  
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'"
  return connection.execute(query)
}

// VULNERABLE: Template literal injection
function getUser(id) {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'secret'
  })
  
  const sql = `SELECT * FROM users WHERE id = ${id}`
  return connection.query(sql)
}

// VULNERABLE: Dynamic WHERE clause
function searchUsers(term) {
  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin'
  })
  
  let query = "SELECT * FROM users WHERE 1=1"
  if (term) {
    query += " AND name LIKE '%" + term + "%'"
  }
  return db.execute(query)
}

module.exports = { login, getUser, searchUsers }