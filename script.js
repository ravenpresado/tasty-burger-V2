
document.addEventListener("DOMContentLoaded", function () {

    // STAR RATING FUNCTION
    const ratingGroups = document.querySelectorAll(".rating");

    ratingGroups.forEach(function (ratingGroup) {
        const stars = ratingGroup.querySelectorAll(".star-button");

        stars.forEach(function (star) {
            star.addEventListener("click", function () {
                const selectedRating = Number(star.dataset.value);

                stars.forEach(function (item) {
                    const starValue = Number(item.dataset.value);

                    item.classList.toggle("active", starValue <= selectedRating);
                });
            });
        });
    });

    // FAVORITE HEART FUNCTION
    const favoriteButtons = document.querySelectorAll(".favorite");

    favoriteButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            button.classList.toggle("active");
            button.textContent = button.classList.contains("active") ? "♥" : "♡";
        });
    });

    // SHOPPING CART
    let cart = [];

    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const cartCount = document.getElementById("cart-count");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutButton = document.getElementById("checkout-btn");

    function updateCart() {

        // UPDATE CART COUNTER
        const totalItems = cart.reduce(function (total, item) {
            return total + item.quantity;
        }, 0);

        cartCount.textContent = totalItems;

        // EMPTY CART
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is currently empty.</p>';
            cartTotal.textContent = "₱0.00";
            checkoutButton.disabled = true;
            return;
        }

        // DISPLAY CART ITEMS
        cartItems.innerHTML = "";

        cart.forEach(function (item, index) {

            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";

            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>₱${item.price.toFixed(2)} each</p>
                </div>

                <div class="cart-item-controls">
                    <button class="quantity-btn decrease" data-index="${index}">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}">Remove</button>
                </div>

                <strong>₱${(item.price * item.quantity).toFixed(2)}</strong>
            `;

            cartItems.appendChild(cartItem);
        });

        // CALCULATE TOTAL
        const totalPrice = cart.reduce(function (total, item) {
            return total + item.price * item.quantity;
        }, 0);

        cartTotal.textContent = "₱" + totalPrice.toFixed(2);
        checkoutButton.disabled = false;
    }

    // ADD TO CART
    addToCartButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const name = button.dataset.name;
            const price = Number(button.dataset.price);

            const existingProduct = cart.find(function (item) {
                return item.name === name;
            });

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            updateCart();

            // BUTTON FEEDBACK
            const originalText = button.textContent;
            button.textContent = "Added! ✓";
            button.classList.add("added");

            setTimeout(function () {
                button.textContent = originalText;
                button.classList.remove("added");
            }, 800);
        });
    });

    // CART QUANTITY AND REMOVE BUTTONS
    cartItems.addEventListener("click", function (event) {

        const index = Number(event.target.dataset.index);

        if (event.target.classList.contains("increase")) {
            cart[index].quantity++;
        }

        if (event.target.classList.contains("decrease")) {
            cart[index].quantity--;

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        }

        if (event.target.classList.contains("remove-item")) {
            cart.splice(index, 1);
        }

        updateCart();
    });

    // CHECKOUT BUTTON
checkoutButton.addEventListener("click", function () {

    let orderDetails = "YOUR ORDER SUMMARY\n\n";

    cart.forEach(function (item) {
        orderDetails += item.name + " x" + item.quantity +
            " - ₱" + (item.price * item.quantity).toFixed(2) + "\n";
    });

    const totalPrice = cart.reduce(function (total, item) {
        return total + item.price * item.quantity;
    }, 0);

    orderDetails += "\nTotal: ₱" + totalPrice.toFixed(2);
    orderDetails += "\n\nThank you for choosing Tasty Burger!";

    alert(orderDetails);
});

    // INITIAL CART DISPLAY
    updateCart();

});
