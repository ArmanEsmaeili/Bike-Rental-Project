document.addEventListener('DOMContentLoaded', () => {  // Wait for the DOM to load
    
    token = getTokenIfValid();
    if (token){
        // return logged in users to index.html
        window.location.href = '/index.html';
    }


    registerForm();

    loginForm();

});


const validate = (phone) => {
    // Check if the text is a string
  if (typeof phone !== 'string') {
    return false;
  }

  // Check if the text starts with "09"
  if (!phone.startsWith('09')) {
    return false;
  }

  // Check if the text contains only numbers
  if (!/^\d+$/.test(phone)) {
    return false;
  }

  // Check if the text is exactly 11 characters long
  if (phone.length !== 11) {
    return false;
  }

  // If all checks pass, the phone number is valid
  return true;
}


function getTokenIfValid() {
    const token = localStorage.getItem('token');

    if (!token) {
        return false; // No token found
    }

    try {
        const decodedToken = jwt_decode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp && decodedToken.exp < currentTime) {
            // Token is expired
            localStorage.removeItem('token'); // Remove expired token
            return false;
        } else {
            // Token is valid
            return token;
        }
    } catch (error) {
        // Handle invalid token format
        console.error("Invalid token:", error);
        localStorage.removeItem('token'); // Remove invalid token
        return false;
    }
}


const registerForm = ()=>{
    try {
        // --- Registration Form ---
        const registerForm = document.getElementById('contact_form');
        const success = document.getElementById('mail_success');
        const fail = document.getElementById('mail_fail');

        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();  // Prevent the default form submission

            const formData = new FormData(registerForm);
            
            // validate password
            if (formData.get('password') != formData.get('re-password')){
                fail.style.display = 'block';
                const old_text = fail.textContent;
                fail.textContent = "پسورد و تکرار پسورد مطابقت ندارد";
                setTimeout(() => {
                    fail.style.display = 'none';
                    fail.textContent = old_text;
                }, 4000);
                return;
            }

            // validate phone
            if (! validate(formData.get('phone'))){
                fail.style.display = 'block';
                const old_text = fail.textContent;
                fail.textContent = "فرمت شماره تماس اشتباه است. لطفا به فرمت ---------09 شماره خود را وارد کنید"
                setTimeout(() => {
                    fail.style.display = 'none';
                    fail.textContent = old_text;
                }, 4000);
                return;
            }

            const data = Object.fromEntries(formData.entries()); // Convert to an object

            try {
                const response = await fetch('/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data) // Convert the JavaScript object to a JSON string
                });

                if (response.ok) {
                    const result = await response.json();
                    // save token
                    localStorage.setItem('token', result.token);
                    // alert(result.message); // Display success message
                    success.style.display = 'block';
                    setTimeout(() => {
                        window.location.href = "/index.html";
                    }, 6000);
                } else {
                    const error = await response.json();
                    // alert(error.error); // Display error message
                    fail.style.display = 'block';
                    setTimeout(() => {
                        fail.style.display = 'none';
                    }, 4000);
                }
            } catch (error) {
                console.error('Error:', error);
                // alert('An error occurred during registration.');
                fail.style.display = 'block';
                setTimeout(() => {
                    fail.style.display = 'none';
                }, 4000);
            }
        });
    } catch (error) {
        
    }
}

const loginForm = ()=>{
    try {
        // --- Login Form ---
        const loginForm = document.getElementById('form_register');
        const success = document.getElementById('mail_success');
        const fail = document.getElementById('mail_fail');

        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log('login form process');
            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries()); // Convert to an object

            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const result = await response.json();
                    // Store the token (example)
                    localStorage.setItem('token', result.token);
                    success.style.display = 'block';
                    setTimeout(() => {
                        window.location.href = "/index.html"
                    }, 2000);
                    
                } else {
                    const error = await response.json();
                    fail.style.display = 'block';
                    fail.textContent = "اطلاعات کاربری اشتباه است";
                    setTimeout(() => {
                        fail.style.display = 'none';
                    }, 4000);
                }
            } catch (error) {
                console.error('Error:', error);
                fail.style.display = 'block';
                fail.textContent = "خطایی رخ داد";
                setTimeout(() => {
                    fail.style.display = 'none';
                }, 4000);
            }
        });
    } catch (error) {
        
    }
}

