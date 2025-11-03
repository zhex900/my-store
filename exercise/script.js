// REST API Endpoint for product listing
const REST_API_ENDPOINT = "https://fakestoreapi.com/products";

// --- Global State ---
let products = [];
// Load cart data from local storage on startup
let cart = [];

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
function applyFiltersAndSort() {}
// Initialize Stripe (client-side)
// const stripe = Stripe(STRIPE_PUBLIC_KEY);

// --- API Fetching (Using REST) ---

/**
 * Fetches products from the Fake Store REST endpoint.
 */
async function fetchProducts() {}

// --- Product Rendering ---

/**
 * Renders the products onto the main grid and attaches 'Add to Cart' listeners.
 */
function renderProducts(productList) {}

// --- Cart Logic ---

/**
 * Persists the global cart state to localStorage and triggers a re-render.
 */
function updateCart() {}

/**
 * Adds a product to the cart or increments its quantity.
 */
function handleAddToCart(productId) {}

/**
 * Renders the cart items, total, and updates the cart count.
 */
function renderCart() {}

/**
 * Handles quantity increase/decrease buttons in the cart.
 */
function handleCartQuantityChange(event) {}

/**
 * Toggles the cart sidebar visibility using the 'cart-open' class.
 */
function toggleCart(show) {}

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

  // Initial data load and render
  fetchProducts(); // Load products and render the grid
}

// Start the application once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", init);
