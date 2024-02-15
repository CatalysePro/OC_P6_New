document.addEventListener('DOMContentLoaded', function() {
    // Constants declaration
    const loginForm = document.getElementById('login-form');
    const userMail = document.getElementById('user-email');
    const userPwd = document.getElementById('user-password');
    const loginError = document.getElementById('error-message');
    const forgotPwLink = document.getElementById("forgot-password-link");

    // Function to check if DOM elements are present
    const checkElements = () => {
        if (!loginForm || !userMail || !userPwd || !loginError || !forgotPwLink) {
            console.error('One or more elements not found.');
            return false;
        }
        return true;
    }

    // Function to highlight input field with red shadow
    const highlightInputError = (inputElement) => {
        inputElement.classList.add('input-error');
    }

    // Function to remove red shadow from input field
    const removeInputErrorHighlight = (inputElement) => {
        inputElement.classList.remove('input-error');
    }

    // Function to remove error highlights when input is changed
    const removeErrorOnInput = () => {
        userMail.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                removeInputErrorHighlight(this);
                loginError.innerHTML = '';
            }
        });

        userPwd.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                removeInputErrorHighlight(this);
                loginError.innerHTML = '';
            }
        });
    }

    // Call the function to remove error highlights on input change
    removeErrorOnInput();


    // Event listener for form submission
    loginForm.addEventListener('submit', async function(event){
        event.preventDefault(); // Prevent the reload when form is submitted

        // Check if DOM elements are present
        if (!checkElements()) {
            return;
        }

        // Check for user input
        const userEmailValue = userMail.value.trim();
        const userPwdValue = userPwd.value.trim();

        // Highlight input fields with errors
        if (userEmailValue === '') {
            highlightInputError(userMail);
        } else {
            removeInputErrorHighlight(userMail);
        }

        if (userPwdValue === '') {
            highlightInputError(userPwd);
        } else {
            removeInputErrorHighlight(userPwd);
        }

        // Check if any required field is empty
        if (userEmailValue === '' || userPwdValue === '') {
            loginError.innerHTML = 'Tous les champs du formulaire doivent être remplis !';
            return;
        } 

        // Access to API /login with POST method via fetch function
        try {
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: userEmailValue, password: userPwdValue })
            });

            if (response.ok) {
                // Handle successful response
                const data = await response.json();
                const tokenId = data.token;

                // Adding token & log in info in local storage and redirect to index.html
                localStorage.setItem('accessToken', tokenId);
                localStorage.setItem('userLoggedIn', true);

                // Redirect to index.html if ok
                console.log('User logged in');
                location.href = 'index.html';
            } else {
                // Handle other cases if responses not ok
                const errorData = await response.json();
                loginError.innerHTML = errorData.message || 'Erreur dans l’identifiant ou le mot de passe.';
            }
        } catch (error) {
            console.error('An error occurred:', error);
            loginError.innerHTML = 'Une erreur s\'est produite lors de la connexion.';
        }
    });

    // Manage forgot password

    forgotPwLink.addEventListener("click", function(event) {
        event.preventDefault();

        // Forgot pw 1st msg (Q? confirmation)
        const confirmation = confirm("Etes-vous sûr(e) de vouloir recevoir un nouveau mot de passe ?");

        // If confirmed (click yes)
        if (confirmation) {
            // Display 2nd msg
            alert("Un nouveau de passe a été envoyé par email");
        }
    });

});
