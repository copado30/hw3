$(document).ready(function () {
    // Populate the month dropdown
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthList = $("#month-list");
    const selectedMonth = $("#selected-month");
    const ordersDisplay = $("#orders-display"); // Element to display JSON data

    // Map month names to numbers
    const monthMap = {
        'Jan': 1,
        'Feb': 2,
        'Mar': 3,
        'Apr': 4,
        'May': 5,
        'Jun': 6,
        'Jul': 7,
        'Aug': 8,
        'Sep': 9,
        'Oct': 10,
        'Nov': 11,
        'Dec': 12
    };

    // Map T_ID to topping names (for displaying orders)
    const toppingMap = {
        1: 'Plain',
        2: 'Vegan',
        3: 'Chocolate',
        4: 'Cherry'
    };

    // Populate the month dropdown
    months.forEach(month => {
        let monthOption = $("<a>").text(month).attr("href", "#").click(function() {
            selectedMonth.text(month); // Update the displayed month

            // Issue a POST request to fetch orders
            $.post('/orders', { month: monthMap[month], year: 2023 }, function(data) {
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

        // Display each order
        orders.forEach(order => {
            const toppingName = toppingMap[order.T_ID] || 'Unknown';
            ordersDisplay.append(`<p>Topping: ${toppingName}, Quantity: ${order.QUANTITY}, Notes: ${order.NOTES}</p>`);
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
        $.post('/neworder', { topping: topping, quantity: quantity, notes: notes }, function(response) {
            if (response.success) {
                alert('Order submitted successfully!');
                // Refresh the orders display after submitting
                $.post('/orders', { month: selectedMonth.text(), year: 2023 }, function(data) {
                    updateOrdersDisplay(data);
                }).fail(function(error) {
                    console.error('Error fetching orders:', error);
                    alert('Failed to fetch orders. Please try again.');
                });
            }
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
