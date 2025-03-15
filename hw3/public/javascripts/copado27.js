$(document).ready(function () {
    // Populate the month dropdown
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthList = $("#month-list");
    const selectedMonth = $("#selected-month");
    const ordersDisplay = $("#orders-display"); // Element to display JSON data

    months.forEach(month => {
        let monthOption = $("<a>").text(month).attr("href", "#").click(function() {
            selectedMonth.text(month); // Update the displayed month

            // Issue a POST request to fetch orders
            $.post('/orders', { month: month }, function(data) {
                updateOrdersDisplay(data);
            }).fail(function(error) {
                console.error('Error fetching orders:', error);
                alert('Failed to fetch orders. Please try again.');
            });
        });
        monthList.append(monthOption);
    });

    // Function to update the orders display at the bottom
    function updateOrdersDisplay(orders) {
        ordersDisplay.empty(); // Clear previous content
        ordersDisplay.append("<h3>Orders:</h3>");
        orders.forEach(order => {
            ordersDisplay.append(`<p>Topping: ${order.topping}, Quantity: ${order.quantity}</p>`);
        });
    }

    // Form Submission Handling
    $("#order-button").click(function(event) {
        event.preventDefault();

        const notes = $("#Notes").val().toLowerCase();
        const quantity = $("#Numbers").val();
        const topping = $('input[name="toppings"]:checked').val();

        // Validate vegan warning
        if (notes.includes('vegan')) {
            alert("Warning: Cheesecakes contain dairy.");
            return;
        }

        // Ensure a topping is selected
        if (!topping) {
            alert("Please select a topping.");
            return;
        }

        // Issue a POST request to submit the order
        $.post('/orders', { topping: topping, quantity: quantity, notes: notes }, function(response) {
            updateOrdersDisplay(response);
        }).fail(function(error) {
            console.error('Error submitting order:', error);
            alert('Failed to submit order. Please try again.');
        });

        // Replace order form with confirmation message
        $("#order-form").html(`
            <h2>Thank you! Your order has been placed.</h2>
            <p><strong>Topping:</strong> ${topping}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Notes:</strong> ${notes || "None"}</p>
        `);
    });
});

