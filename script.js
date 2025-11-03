// --- Configuration ---
// Stripe's public test key (safe to use on the client)
const STRIPE_PUBLIC_KEY = "pk_test_TYooMQhupHostV8GrpRvmbZz";
// REST API Endpoint for product listing
const REST_API_ENDPOINT = "https://fakestoreapi.com/products";

// --- Global State ---
let products = [];
// Load cart data from local storage on startup
let cart = JSON.parse(localStorage.getItem("fakestore_cart")) || [];

// --- DOM Elements ---
const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const cartSidebar = document.getElementById("cart-sidebar");
const openCartBtn = document.getElementById("open-cart-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const cartCountElement = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");
const emptyCartMessage = document.getElementById("empty-cart-message");

/**
 * Sorts and filters the global products array based on current search and sort criteria.
 */
function applyFiltersAndSort() {
  let currentProducts = [...products]; // Start with a copy of the full list

  // 1. FILTERING (Search)
  const query = searchInput.value.toLowerCase().trim();
  if (query) {
    currentProducts = currentProducts.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
  }

  // 2. SORTING
  const sortValue = sortSelect.value;

  if (sortValue !== "default") {
    currentProducts.sort((a, b) => {
      if (sortValue === "name-asc") {
        return a.title.localeCompare(b.title);
      } else if (sortValue === "price-asc") {
        return a.price - b.price;
      } else if (sortValue === "price-desc") {
        return b.price - a.price; // Reverse order
      }
      return 0; // Should not happen
    });
  }

  // 3. RENDER
  renderProducts(currentProducts);

  if (currentProducts.length === 0) {
    productGrid.innerHTML =
      '<p class="col-span-full text-center text-gray-500 py-10">No products found matching your search.</p>';
  }
}
// Initialize Stripe (client-side)
// const stripe = Stripe(STRIPE_PUBLIC_KEY);

// --- API Fetching (Using REST) ---

/**
 * Fetches products from the Fake Store REST endpoint.
 */
async function fetchProducts() {
  try {
    const response = await fetch(REST_API_ENDPOINT);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Map the REST data structure to a consistent product object
    products = result.map((p) => ({
      id: p.id.toString(), // Ensure ID is a string for consistent use
      title: p.title,
      description: p.description,
      image: p.image,
      price: parseFloat(p.price),
      currency: "USD",
    }));

    renderProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    productGrid.innerHTML =
      '<p class="text-red-600 text-center col-span-full">Failed to load products. Check console for details.</p>';
  }
}

// --- Product Rendering ---

/**
 * Renders the products onto the main grid and attaches 'Add to Cart' listeners.
 */
function renderProducts(productList) {
  productGrid.innerHTML = productList
    .map(
      (product) => `
        <div class="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-[1.02] transition duration-300">
            <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-contain p-4">
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 truncate">${product.title}</h3>
                <p class="text-gray-500 text-sm h-10 overflow-hidden mb-4">${product.description.substring(0, 50)}...</p>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-indigo-600">$${product.price.toFixed(2)}</span>
                    <button 
                        data-product-id="${product.id}"
                        class="add-to-cart-btn bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition duration-150 text-sm"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  // Attach event listeners to the new 'Add to Cart' buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.currentTarget.getAttribute("data-product-id");
      handleAddToCart(productId);
    });
  });
}

/**
 * Sorts and filters the global products array based on current search and sort criteria.
 */
function applyFiltersAndSort() {
  let currentProducts = [...products]; // Start with a copy of the full list

  // 1. FILTERING (Search)
  const query = searchInput.value.toLowerCase().trim();
  if (query) {
    currentProducts = currentProducts.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
  }

  // 2. SORTING
  const sortValue = sortSelect.value;

  if (sortValue !== "default") {
    currentProducts.sort((a, b) => {
      if (sortValue === "name-asc") {
        return a.title.localeCompare(b.title);
      } else if (sortValue === "price-asc") {
        return a.price - b.price;
      } else if (sortValue === "price-desc") {
        return b.price - a.price; // Reverse order
      }
      return 0; // Should not happen
    });
  }

  // 3. RENDER
  renderProducts(currentProducts);

  if (currentProducts.length === 0) {
    productGrid.innerHTML =
      '<p class="col-span-full text-center text-gray-500 py-10">No products found matching your search.</p>';
  }
}

// --- Cart Logic ---

/**
 * Persists the global cart state to localStorage and triggers a re-render.
 */
function updateCart() {
  localStorage.setItem("fakestore_cart", JSON.stringify(cart));
  renderCart();
}

/**
 * Adds a product to the cart or increments its quantity.
 */
function handleAddToCart(productId) {
  // ID from FakeStore API is a number, ensure type consistency
  const idString = productId.toString();
  const product = products.find((p) => p.id === idString);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === idString);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  updateCart();
  openCart(); // Open the cart sidebar when an item is added
}

/**
 * Renders the cart items, total, and updates the cart count.
 */
function renderCart() {
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "";
    emptyCartMessage.classList.remove("hidden");
    checkoutBtn.disabled = true;
  } else {
    emptyCartMessage.classList.add("hidden");
    checkoutBtn.disabled = false;

    const cartHtml = cart
      .map((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
                <div class="flex items-start space-x-4 border-b pb-4 pt-4 last:border-b-0">
                    <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain rounded flex-shrink-0">
                    <div class="flex-grow">
                        <h4 class="text-base font-medium">${item.title}</h4>
                        <p class="text-sm font-semibold text-indigo-600">$${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div class="flex items-center space-x-1 flex-shrink-0">
                        <button data-id="${item.id}" data-action="decrease" class="cart-quantity-btn text-gray-700 hover:bg-gray-200 border border-gray-300 w-6 h-6 rounded-full text-sm font-bold leading-none">-</button>
                        <span class="text-sm font-semibold w-4 text-center">${item.quantity}</span>
                        <button data-id="${item.id}" data-action="increase" class="cart-quantity-btn text-gray-700 hover:bg-gray-200 border border-gray-300 w-6 h-6 rounded-full text-sm font-bold leading-none">+</button>
                    </div>
                </div>
            `;
      })
      .join("");

    cartItemsContainer.innerHTML = cartHtml;
  }

  cartTotalElement.textContent = `$${total.toFixed(2)}`;
  // Calculate and update the total number of items
  cartCountElement.textContent = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Re-attach listeners for quantity buttons
  document.querySelectorAll(".cart-quantity-btn").forEach((button) => {
    button.addEventListener("click", handleCartQuantityChange);
  });
}

/**
 * Handles quantity increase/decrease buttons in the cart.
 */
function handleCartQuantityChange(event) {
  const button = event.currentTarget;
  const id = button.getAttribute("data-id");
  const action = button.getAttribute("data-action");

  const itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex === -1) return;

  if (action === "increase") {
    cart[itemIndex].quantity += 1;
  } else if (action === "decrease") {
    cart[itemIndex].quantity -= 1;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1); // Remove item if quantity drops to 0
    }
  }

  updateCart();
}

/**
 * Toggles the cart sidebar visibility using the 'cart-open' class.
 */
function toggleCart(show) {
  const isVisible = cartSidebar.classList.contains("cart-open");
  if (show === undefined) {
    show = !isVisible;
  }

  if (show) {
    cartSidebar.classList.add("cart-open");
    cartOverlay.classList.remove("pointer-events-none");
    cartOverlay.classList.add("opacity-50");
  } else {
    cartSidebar.classList.remove("cart-open");
    cartOverlay.classList.add("pointer-events-none");
    cartOverlay.classList.remove("opacity-50");
  }
}

const openCart = () => toggleCart(true);
const closeCart = () => toggleCart(false);

// --- Stripe Checkout Integration (Client-Side Implementation) ---

/**
 * Initiates the Stripe checkout process.
 */
async function handleCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  checkoutBtn.textContent = "Processing...";
  checkoutBtn.disabled = true;

  // --- CRITICAL SECURITY NOTE ---
  // The actual Stripe Checkout Session creation MUST happen on a secure server.
  // You CANNOT pass item details directly to the client-side Stripe object for Checkout Session creation.
  // The code below simulates the process and explains the required backend step.

  alert(
    "🚨 ACTION REQUIRED: A real, secure checkout requires a **backend server** to call the Stripe API and create a 'Checkout Session ID'. We will now simulate the final client-side redirect step."
  );

  try {
    // 1. Prepare Line Items for the *hypothetical* backend
    const lineItems = cart.map((item) => ({
      // This structure is what your backend would receive
      // and use to create the real Stripe Checkout Session line items.
      name: item.title,
      image: item.image,
      amount: Math.round(item.price * 100), // Stripe requires amount in cents
      quantity: item.quantity,
    }));

    // 2. MOCK: Call the hypothetical server endpoint

    /* // Example of what a real fetch call to your server would look like:
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lineItems, currency: 'usd' }),
        });
        const session = await response.json();
        const sessionId = session.id; 
        
        // 3. Real Redirect with server-generated ID
        const { error } = await stripe.redirectToCheckout({
             sessionId: sessionId,
        });
        */

    // Since we don't have a backend, we just log and inform the user:
    console.log("Mock Line Items ready for backend:", lineItems);
    console.warn(
      "Stripe Checkout was initiated but requires a server-generated session ID to complete securely. The redirect step is simulated."
    );

    alert(
      "Mock checkout simulation complete. The next step is implementing a backend to generate the Checkout Session ID."
    );
  } catch (error) {
    console.error("Checkout error:", error);
    alert(
      "Checkout failed: " + error.message + ". Check console for security note."
    );
  } finally {
    checkoutBtn.textContent = "Proceed to Checkout";
    checkoutBtn.disabled = false;
  }
}

// --- Initialization ---

/**
 * Attaches all event listeners and starts the app.
 */
function init() {
  // Event Listeners
  openCartBtn.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);
  checkoutBtn.addEventListener("click", handleCheckout);

  // 🔍 ADD THIS LINE: Listen for input changes (real-time filtering)
  searchInput.addEventListener("input", applyFiltersAndSort); // <-- CHANGE THIS
  sortSelect.addEventListener("change", applyFiltersAndSort); // <-- ADD THIS LINE

  // Initial data load and render
  fetchProducts(); // Load products and render the grid
  renderCart(); // Render the cart from localStorage
}

// Start the application once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", init);
