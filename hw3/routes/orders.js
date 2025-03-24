

const express = require("express");
const router = express.Router();
const dbms = require("./dbms.js");

router.post("/", function(req, res) {
    const month = parseInt(req.body.month);
    const year = parseInt(req.body.year);
    
    if (isNaN(month) || isNaN(year)) {
        return res.status(400).json({ 
            error: "Invalid month or year",
            details: "Month and year must be numbers"
        });
    }

    const sql = `
        SELECT o.T_ID, o.quantity, o.notes, t.name as topping_name 
        FROM orders o
        JOIN toppings t ON o.T_ID = t.T_ID
        WHERE o.month = ? AND o.year = ?
    `;

    dbms.dbquery(sql, [month, year], (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ 
                error: "Database query failed",
                details: error.message
            });
        }
        
        res.json({
            success: true,
            data: results.map(order => ({
                T_ID: order.T_ID,
                QUANTITY: order.quantity,
                NOTES: order.notes,
                TOPPING_NAME: order.topping_name
            }))
        });
    });
});

module.exports = router;
