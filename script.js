
/* ==========================================================================
   NORTH STAR BAKERY - SYSTEM CORE INTERACTIVITY & VALIDATION
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Sub-Systems based on active page components
    initWishlistTracker();
    initFormValidation();
});

/* ==========================================================================
   SUB-SYSTEM A: PRODUCT WISHLIST TRACKER (localStorage Integrated)
   ========================================================================== */
function initWishlistTracker() {
    let wishlist = loadWishlistData();

    // Attach click listeners to item cards if on products page
    const productGrid = document.querySelector(".product-grid");
    if (productGrid) {
        // Find all list items representing products
        const products = productGrid.querySelectorAll("li");
        products.forEach(product => {
            const heading = product.querySelector("h3");
            if (heading) {
                const productName = heading.textContent.trim();
                
                // Append a friendly interactive badge button programmatically
                const addBtn = document.createElement("button");
                addBtn.type = "button";
                addBtn.textContent = wishlist.includes(productName) ? "✓ Added to Wishlist" : "+ Add to Pre-Order List";
                addBtn.style.cssText = "display:inline-block; width:auto; padding:6px 12px; margin-top:8px; font-size:0.85rem; background-color:#e3d7cd; color:#2F2A26; border:none; border-radius:4px; cursor:pointer;";
                
                // Toggle status on click action
                addBtn.addEventListener("click", () => {
                    toggleWishlistItem(productName, addBtn);
                });
                
                product.appendChild(addBtn);
            }
        });
    }

    // Auto-populate form input field if on contact page
    autoPopulateWishlistIntoForm();
}

function loadWishlistData() {
    const stored = localStorage.getItem("bakery_wishlist");
    return stored ? JSON.parse(stored) : [];
}

function saveWishlistData(arrayData) {
    localStorage.setItem("bakery_wishlist", JSON.stringify(arrayData));
}

function toggleWishlistItem(itemName, buttonElement) {
    let currentList = loadWishlistData();
    
    if (currentList.includes(itemName)) {
        // Remove item from array structure
        currentList = currentList.filter(item => item !== itemName);
        buttonElement.textContent = "+ Add to Pre-Order List";
        buttonElement.style.backgroundColor = "#e3d7cd";
    } else {
        // Append item to array structure
        currentList.push(itemName);
        buttonElement.textContent = "✓ Added to Wishlist";
        buttonElement.style.backgroundColor = "#D88C5A";
    }
    
    saveWishlistData(currentList);
}

function autoPopulateWishlistIntoForm() {
    const messageField = document.getElementById("order-message");
    if (messageField) {
        const activeList = loadWishlistData();
        if (activeList.length > 0) {
            // Smoothly auto-fill the field container without wiping custom text notes
            messageField.value = `I would like to pre-order the following items:\n-------------------------------------\n${activeList.map(item => `- ${item}`).join("\n")}\n-------------------------------------\n\nPlease add my missing notes here: `;
        }
    }
}

/* ==========================================================================
   SUB-SYSTEM B: JAVASCRIPT FORM VALIDATION WITH INLINE FEEDBACK
   ========================================================================== */
function initFormValidation() {
    const form = document.querySelector("form");
    if (!form) return;

    // Disables browser native validation popup balloons so custom layout feedback takes precedence
    form.setAttribute("novalidate", true);

    form.addEventListener("submit", (event) => {
        let isFormValid = true;

        // Validation Target Check 1: Explicit Custom Required Check for Name
        const nameField = document.getElementById("customer-name");
        if (nameField) {
            if (nameField.value.trim() === "") {
                displayFieldError(nameField, "We need your full name to reserve your pickup order.");
                isFormValid = false;
            } else {
                clearFieldError(nameField);
            }
        }

        // Validation Target Check 2: Strict Regex Match for Format validation on Email Address
        const emailField = document.getElementById("customer-email");
        if (emailField) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                displayFieldError(emailField, "Please provide a valid email format (e.g., name@example.com) for order verification.");
                isFormValid = false;
            } else {
                clearFieldError(emailField);
            }
        }

        // Action block: Prevent full post routine execution if validation array breaks down
        if (!isFormValid) {
            event.preventDefault();
        } else {
            // Clear baseline storage upon successful verification submission
            localStorage.removeItem("bakery_wishlist");
        }
    });
}

function displayFieldError(inputElement, errorMessageString) {
    // Clear previous elements to avoid cascading repeating labels
    clearFieldError(inputElement);

    // Build functional container structure programmatically near the element field border
    const errorLabel = document.createElement("span");
    errorLabel.className = "js-error-feedback";
    errorLabel.textContent = `⚠️ ${errorMessageString}`;
    errorLabel.style.cssText = "display:block; color:#b22222; font-size:0.9rem; font-weight:bold; margin-top:5px; font-family:Georgia, serif;";
    
    inputElement.style.borderColor = "#b22222";
    inputElement.style.backgroundColor = "#fff5f5";
    
    // Inject node elements precisely after target area boundaries
    inputElement.parentNode.appendChild(errorLabel);
}

function clearFieldError(inputElement) {
    inputElement.style.borderColor = "";
    inputElement.style.backgroundColor = "";
    
    const contextParent = inputElement.parentNode;
    const existingFeedbackNode = contextParent.querySelector(".js-error-feedback");
    if (existingFeedbackNode) {
        contextParent.removeChild(existingFeedbackNode);
    }
}