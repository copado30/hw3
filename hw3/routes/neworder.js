const express = require("express");
const router = express.Router();
const dbms = require("./dbms.js");

router.post("/", function(req, res) {
    const { t_id, quantity, notes, month, year } = req.body;
    
    // Input validation
    if ([t_id, quantity, month, year].some(Number.isNaN)) {
        return res.status(400).json({ 
            error: "Invalid input",
            details: "t_id, quantity, month, and year must be numbers"
        });
    }

    if (!notes || typeof notes !== 'string') {
        return res.status(400).json({ 
            error: "Invalid notes",
            details: "Notes must be a string"
        });
    }

    const sql = `
        INSERT INTO orders (t_id, quantity, notes, month, year)
        VALUES (?, ?, ?, ?, ?)
    `;

    dbms.dbquery(sql, 
        [parseInt(t_id), parseInt(quantity), notes, parseInt(month), parseInt(year)],
        (error, result) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({ 
                    error: "Failed to save order",
                    details: error.message
                });
            }
            
            res.json({ 
                success: true,
                orderId: result.insertId,
                message: "Order submitted successfully"
            });
        }
    );
});

module.exports = router;
