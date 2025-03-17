//Rafael Copado


var express = require('express');
var router = express.Router();

//data
const orders = [
  { topping: "cherry", quantity: "2" },
  { topping: "plain", quantity: "6" },
  { topping: "chocolate", quantity: "3" }
];

router.get('/', function(req, res, next) {
  console.log("Received GET request for /orders");
  res.json(orders);
});

router.post('/', function(req, res, next) {
  const month = req.body.month; //month request
  console.log(`Received POST request for month: ${month}`);

  res.json(orders);
});

module.exports = router;
