// login.js - Updated with better form detection
console.log('🔍 Login script loading...');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔍 DOM loaded, looking for form...');

    // Try multiple selectors to find the form
    const form = document.querySelector('#loginForm') ||
        document.querySelector('.loginForm') ||
        document.querySelector('form');

    console.log('🔍 Form found:', form);

    if (!form) {
        console.error('❌ Login form not found!');
        console.log('Available elements:', {
            'forms': document.querySelectorAll('form'),
            'loginForm ID': document.getElementById('loginForm'),
            'loginForm class': document.querySelector('.loginForm')
        });
        return;
    }

    // Use shared config
    const { API_URL } = window.AppConfig;
    console.log('🔧 Using API URL:', API_URL);

    // Form submit handler
    form.addEventListener("submit", async function (event) {
        console.log('📝 Form submitted');
        event.preventDefault();

        // Clear any existing error messages
        clearError();

        // Get form data
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("pass");

        if (!emailInput || !passwordInput) {
            console.error('❌ Form inputs not found');
            displayError("Erreur: Champs de formulaire non trouvés");
            return;
        }

        const formData = {
            "email": emailInput.value.trim(),
            "password": passwordInput.value
        };

        // Basic validation
        if (!formData.email || !formData.password) {
            displayError("Veuillez remplir tous les champs.");
            return;
        }

        console.log('📤 Sending login request...');

        try {
            const formDataJson = JSON.stringify(formData);

            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json"
                },
                body: formDataJson,
            });

            console.log('📥 Response received:', response.status);

            if (response.status === 200) {
                const data = await response.json();
                console.log('✅ Login successful');

                // Save token
                localStorage.setItem("token", data.token);
                if (data.userId) {
                    localStorage.setItem("userId", data.userId);
                }

                // Redirect
                window.location.href = "./index.html";

            } else if (response.status === 401 || response.status === 404) {
                displayError("E-mail ou mot de passe incorrect");
            } else {
                const errorData = await response.json().catch(() => ({}));
                displayError(errorData.message || "Erreur lors de la connexion");
            }

        } catch (error) {
            console.error("❌ Login error:", error);
            displayError("Un problème est survenu. Veuillez réessayer plus tard.");
        }
    });

    // Function to display error messages
    function displayError(message) {
        let spanErrorMessage = document.getElementById("errorMessage");

        if (!spanErrorMessage) {
            spanErrorMessage = document.createElement("span");
            spanErrorMessage.id = "errorMessage";
            spanErrorMessage.className = "error-message";
            spanErrorMessage.style.cssText = `
                color: #d63031;
                font-size: 14px;
                margin-top: 10px;
                display: block;
                text-align: center;
                background-color: #ffe6e6;
                padding: 10px;
                border-radius: 4px;
                border: 1px solid #d63031;
            `;
            form.appendChild(spanErrorMessage);
        }
        spanErrorMessage.innerText = message;
    }

    // Function to clear error messages
    function clearError() {
        const errorMessage = document.getElementById("errorMessage");
        if (errorMessage) {
            errorMessage.remove();
        }
    }
});

// Utility functions (outside DOMContentLoaded)
function getAuthToken() {
    return localStorage.getItem("token");
}

function isAuthenticated() {
    return !!getAuthToken();
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("projects");
    window.location.href = "./login.html";
}

// Auto-redirect if already logged in
if (isAuthenticated() && window.location.pathname.includes('login.html')) {
    console.log("✅ User already logged in, redirecting...");
    window.location.href = "./index.html";
}