//Rafael Copado

var express = require("express");
var router = express.Router();
const dbms = require("./dbms.js");

router.post("/", function (req, res, next) {
    const month = req.body.month; // Get the requested month from the client
    const year = req.body.year;   // Get the requested year from the client
    console.log(`Received POST request for orders in month: ${month}, year: ${year}`, req.body);

    if (!month || !year) {
        return res.status(400).json({ error: "Month and year are required" });
    }

    // Query the database for orders in the specified month and year
    const sql = `SELECT T_ID, QUANTITY, NOTES FROM orders WHERE MONTH = ? AND YEAR = ?`;
    console.log("Executing query:", sql, "with params:", [month, year]);

    dbms.dbquery(sql, [month, year], (error, results) => {
        if (error) {
            console.error("Database error:", error);
            console.error("Failed query:", sql, "with params:", [month, year]);
            res.status(500).json({ error: "Database query failed", details: error.message });
        } else {
            res.json({
                success: true,
                data: results
            });
        }
    });
});

module.exports = router;
