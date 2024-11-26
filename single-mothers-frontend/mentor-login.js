document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const emailInput = document.querySelector("input[type='text']");
    const passwordInput = document.querySelector("input[type='password']");
    const rememberCheckbox = document.getElementById("remember");

    // Check if email is stored in localStorage
    if (localStorage.getItem("rememberEmail")) {
        emailInput.value = localStorage.getItem("rememberEmail");
        rememberCheckbox.checked = true;
    }

    // Form submission event
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Simple validation
        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        
        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        // Save email in localStorage if "Remember me" is checked
        if (rememberCheckbox.checked) {
            localStorage.setItem("rememberEmail", email);
        } else {
            localStorage.removeItem("rememberEmail");
        }

        // Simulate successful login (replace with actual login logic)
        alert("Login successful!");
        form.submit();
    });

    // Email validation function
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
});
