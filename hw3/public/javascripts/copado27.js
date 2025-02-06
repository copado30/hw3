

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthList = document.getElementById('month-list');
            const selectedMonth = document.getElementById('selected-month');
    
            months.forEach(month => {
                const monthOption = document.createElement('a');
                monthOption.textContent = month;
                monthOption.href = "#";
                monthOption.onclick = function() {
                    selectedMonth.textContent = month; // Update the displayed month
                };
                monthList.appendChild(monthOption);
            });

                document.getElementById('order-button').addEventListener('click', function() {
                const notes = document.getElementById('Notes').value.toLowerCase();
                const quantity = document.getElementById('Numbers').value;
                const topping = document.querySelector('input[name="toppings"]:checked');

                if (notes.includes('vegan')) {
                    alert("Warning: Cheesecakes contain dairy.");
                    return;
                }

                if (!topping) {
                    alert("Please select a topping.");
                    return;
                }

                document.getElementById('order-form').innerHTML = `
                    <h2>Thank you! Your order has been placed.</h2>
                    <p><strong>Topping:</strong> ${topping.value}</p>
                    <p><strong>Quantity:</strong> ${quantity}</p>
                    <p><strong>Notes:</strong> ${notes || "None"}</p>`;
            });




