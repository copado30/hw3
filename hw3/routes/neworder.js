var express = require("express");
var router = express.Router();
const dbms = require("./dbms.js");

router.post("/", function (req, res, next) {
    const { topping, quantity, notes } = req.body;

    if (!topping || !quantity || !notes) {
        return res.status(400).json({ error: "Topping, quantity, and notes are required" });
    }

    // Map topping names to their IDs (you can adjust this based on your toppings table)
    const toppingMap = {
        'Plain': 1,
        'Vegan': 2,
        'Chocolate': 3,
        'Cherry': 4
    };

    const t_id = toppingMap[topping];
    if (!t_id) {
        return res.status(400).json({ error: "Invalid topping" });
    }

    // Insert the new order into the database
    dbms.dbquery(
        `INSERT INTO orders (t_id, quantity, notes, month, year) VALUES (?, ?, ?, ?, ?)`,
        [t_id, quantity, notes, 2, 2023], // Hardcode month and year for now
        (error, results) => {
            if (error) {
                console.error("Database error:", error);
                res.status(500).json({ error: "Failed to submit order" });
            } else {
                res.json({ success: true, message: "Order submitted successfully" });
            }
        }
    );
});

module.exports = router;
