
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


// CART POPUP
const cartOverlay = document.getElementById("cart-overlay");
const openCart = document.getElementById("open-cart");
const closeCart = document.getElementById("close-cart");

// OPEN CART POPUP
openCart.addEventListener("click", function () {
    cartOverlay.classList.add("active");
});

// CLOSE CART POPUP
function hideCart() {
    cartOverlay.classList.remove("active");
}

closeCart.addEventListener("click", hideCart);

// CLOSE WHEN CLICKING OUTSIDE THE POPUP
cartOverlay.addEventListener("click", function (event) {
    if (event.target === cartOverlay) {
        hideCart();
    }
});


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

    
// CHECKOUT POPUP
const checkoutOverlay = document.getElementById("checkout-overlay");
const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");
const closeCheckout = document.getElementById("close-checkout");
const cancelCheckout = document.getElementById("cancel-checkout");
const confirmOrder = document.getElementById("confirm-order");

// OPEN CHECKOUT POPUP
checkoutButton.addEventListener("click", function () {

    checkoutItems.innerHTML = "";

    cart.forEach(function (item) {

        const checkoutItem = document.createElement("div");
        checkoutItem.className = "checkout-item";

        checkoutItem.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <strong>₱${(item.price * item.quantity).toFixed(2)}</strong>
        `;

        checkoutItems.appendChild(checkoutItem);
    });

    const totalPrice = cart.reduce(function (total, item) {
        return total + item.price * item.quantity;
    }, 0);

    checkoutTotal.textContent = "₱" + totalPrice.toFixed(2);

    checkoutOverlay.classList.add("active");
});

// CLOSE CHECKOUT POPUP
function hideCheckout() {
    checkoutOverlay.classList.remove("active");
}

closeCheckout.addEventListener("click", hideCheckout);
cancelCheckout.addEventListener("click", hideCheckout);

// CONFIRM ORDER
confirmOrder.addEventListener("click", function () {

    alert("Thank you for your order!\n\nYour order has been confirmed.");

    cart = [];
    updateCart();
    hideCheckout();
});

// CLOSE WHEN CLICKING OUTSIDE THE POPUP
checkoutOverlay.addEventListener("click", function (event) {
    if (event.target === checkoutOverlay) {
        hideCheckout();
    }
});


    // INITIAL CART DISPLAY
    updateCart();

// BURGER SEARCH AND CATEGORY FILTERS
const burgerSearch = document.getElementById("burger-search");
const filterButtons = document.querySelectorAll(".filter-btn");
const burgerCards = document.querySelectorAll(".burger-card");

let selectedCategory = "all";

function filterBurgers() {

    const searchText = burgerSearch.value.toLowerCase().trim();

    burgerCards.forEach(function (card) {

        const burgerName = card.querySelector("h3").textContent.toLowerCase();
        const category = card.dataset.category;
        const favoriteButton = card.querySelector(".favorite");

        const matchesSearch = burgerName.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            selectedCategory === "favorites" ||
            category === selectedCategory;

        const matchesFavorite =
            selectedCategory !== "favorites" ||
            favoriteButton.classList.contains("active");

        if (matchesSearch && matchesCategory && matchesFavorite) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {

        selectedCategory = button.dataset.category;

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        filterBurgers();
    });
});

burgerSearch.addEventListener("input", filterBurgers);

});

