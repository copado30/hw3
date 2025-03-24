/**
 * dbms.js - Modern Database Manager
 * 
 * Handles MySQL connections and queries with parameterized query support
 * Includes proper error handling and connection management
 */

const mysql = require('mysql');

// Database configuration
const dbConfig = {
  host: "10.6.2.7",         // PDX0MySQL00 IP address
  user: "cs341-06",         // Your database username
  password: "W-4cq7u5CKIw50-5", // Your database password
  database: "copado27_db",  // Your database name
  multipleStatements: false // Prevent SQL injection
};

/**
 * Executes a parameterized SQL query
 * @param {string} query_str - SQL query with ? placeholders
 * @param {array} params - Array of parameter values
 * @param {function} callback - Callback function (err, results)
 */
exports.dbquery = function(query_str, params, callback) {
  // Validate inputs
  if (typeof query_str !== 'string') {
    return callback(new Error('Query must be a string'));
  }
  
  if (!Array.isArray(params)) {
    return callback(new Error('Params must be an array'));
  }

  console.log(`Executing query: ${query_str}`);
  console.log(`With parameters: ${JSON.stringify(params)}`);

  const connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error('Connection error:', err);
      return callback(err);
    }

    connection.query(query_str, params, (queryErr, results) => {
      // Always close the connection
      connection.end();
      
      if (queryErr) {
        console.error('Query error:', queryErr);
        return callback(queryErr);
      }
      
      callback(null, results);
    });
  });
};

/**
 * Test database connection (optional)
 */
exports.testConnection = function(callback) {
  this.dbquery('SELECT 1 + 1 AS test', [], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0].test === 2);
  });
};
