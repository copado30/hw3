$(document).ready(function () {
    // Constants and mappings
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthMap = months.reduce((acc, month, index) => {
        acc[month] = index + 1;
        return acc;
    }, {});
    
    const toppingMap = {
        1: 'Plain',
        2: 'Vegan',
        3: 'Chocolate',
        4: 'Cherry'
    };
    const reverseToppingMap = {
        'Plain': 1,
        'Vegan': 2,
        'Chocolate': 3,
        'Cherry': 4
    };

    // DOM elements
    const monthList = $("#month-list");
    const selectedMonth = $("#selected-month");
    const ordersDisplay = $("#orders-display");

    // Initialize month dropdown
    months.forEach(month => {
        monthList.append(
            $("<a>").text(month).attr("href", "#").click(function() {
                selectedMonth.text(month);
                fetchOrders(monthMap[month], 2023);
            })
        );
    });

    // Order submission handler
    $("#order-button").click(function(event) {
        event.preventDefault();
        
        const notes = $("#Notes").val().trim();
        const quantity = parseInt($("#Numbers").val());
        const topping = $('input[name="toppings"]:checked').val();

        // Validation
        if (!topping) return alert("Please select a topping");
        if (isNaN(quantity) || quantity < 1) return alert("Please enter a valid quantity");
        if (notes.toLowerCase().includes('vegan')) {
            alert("Warning: Cheesecakes contain dairy.");
            return;
        }

        // Submit order
        $.post('/neworder', {
            t_id: reverseToppingMap[topping],
            quantity: quantity,
            notes: notes,
            month: monthMap[selectedMonth.text()],
            year: 2023
        }, function(response) {
            if (response.success) {
                showConfirmation(topping, quantity, notes);
                fetchOrders(monthMap[selectedMonth.text()], 2023);
            }
        }).fail(handleOrderError);
    });

    // Helper functions
    function fetchOrders(month, year) {
        $.post('/orders', { month, year }, function(data) {
            updateOrdersDisplay(data.data || data); // Handle both response formats
        }).fail(function(error) {
            console.error('Error fetching orders:', error);
            alert('Failed to fetch orders. Please try again.');
        });
    }

    function updateOrdersDisplay(orders) {
        ordersDisplay.empty().append("<h3>Orders:</h3>");
        orders.forEach(order => {
            ordersDisplay.append(
                `<p>Topping: ${toppingMap[order.T_ID]}, ` +
                `Quantity: ${order.QUANTITY}, ` +
                `Notes: ${order.NOTES || 'None'}</p>`
            );
        });
    }

    function showConfirmation(topping, quantity, notes) {
        $("#order-form").html(`
            <h2>Thank you! Your order has been placed.</h2>
            <p><strong>Topping:</strong> ${topping}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Notes:</strong> ${notes || "None"}</p>
        `);
    }

    function handleOrderError(error) {
        console.error('Error submitting order:', error);
        alert('Failed to submit order. Please try again.');
    }
});
