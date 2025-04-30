const modalHTML = `
<div class="modal-overlay"></div>
<div class="login-modal">
    <button class="close-btn" onclick="closeModal()">X</button>
    <h2 id="modalTitle">Login</h2>
    <form id="loginForm">
        <input type="text" id="username" placeholder="Username" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="submit">Login</button>
        <p>Don't have an account? <span onclick="switchToRegister()">Register</span></p>
    </form>
    <form id="registerForm" style="display: none;">
        <input type="text" id="regUsername" placeholder="Username" required>
        <input type="text" id="firstName" placeholder="First Name" required>
        <input type="text" id="lastName" placeholder="Last Name" required>
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="regPassword" placeholder="Password" required>
        <input type="password" id="confirmPassword" placeholder="Confirm Password" required>
        <button type="submit">Register</button>
        <p>Already have an account? <span onclick="switchToLogin()">Login</span></p>
    </form>
    <button id="logoutButton" style="display: none;" onclick="logout()">Logout</button>
</div>
`;

document.body.insertAdjacentHTML('beforeend', modalHTML);

const modalCSS = `
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8); 
    display: none;
    z-index: 1000;
}
.login-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #282c34, #3a3f47);
    color: #00fff6;
    padding: 30px; 
    border-radius: 15px; 
    width: 350px;
    text-align: center;
    box-shadow: 0 8px 30px rgba(255, 0, 255, 0.5);
    display: none;
    z-index: 1001;
    transition: transform 0.3s ease, opacity 0.3s ease; 
}
.login-modal.show {
    transform: translate(-50%, -50%) scale(1); 
    opacity: 1;
}
.close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    color: #ff00ff;
    font-size: 20px;
    cursor: pointer;
    transition: color 0.3s ease;
}
.close-btn:hover {
    color: #ff99ff;
}
.logged-in-user {
    margin-right: 10px;
    font-weight: bold; 
}
.btn {
    background: linear-gradient(45deg, #ff00ff, #00ffff);
    border: none;
    border-radius: 5px; 
    color: white;
    padding: 10px 15px;
    cursor: pointer;
    transition: background 0.3s ease; 
}

input[type="text"],
input[type="password"],
input[type="email"] {
    width: 100%; 
    padding: 10px; 
    margin: 10px 0; 
    border: 2px solid #00fff6; 
    border-radius: 5px;
    background: #1d1f27;
    color: #00fff6; 
    font-size: 16px; 
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); 
    transition: border-color 0.3s ease, box-shadow 0.3s ease; 
}

input[type="text"]:focus,
input[type="password"]:focus,
input[type="email"]:focus {
    border-color: #ff00ff;
    box-shadow: 0 0 10px rgba(255, 0, 255, 0.5); 
    outline: none;
}

input[type="text"]::placeholder,
input[type="password"]::placeholder,
input[type="email"]::placeholder {
    color: #00fff6; 
    opacity: 0.7;
}


.btn:hover {
    background: linear-gradient(45deg, #ff66ff, #66ffff); 
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = modalCSS;
document.head.appendChild(styleSheet);

function showModal() {
    document.querySelector('.modal-overlay').style.display = 'block';
    document.querySelector('.login-modal').style.display = 'block';
}

function closeModal() {
    document.querySelector('.modal-overlay').style.display = 'none';
    document.querySelector('.login-modal').style.display = 'none';
}

function switchToRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('modalTitle').textContent = 'Register';
}

function switchToLogin() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('modalTitle').textContent = 'Login';
}

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('regUsername').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!emailRegex.test(email)) {
        alert("Please enter a valid email.");
        return;
    }

    if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters, including an uppercase letter and a number.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const userData = JSON.parse(localStorage.getItem('users')) || {};

    if (userData[username]) {
        alert("Username already exists!");
        return;
    }

    userData[username] = {
        username,
        firstName,
        lastName,
        email,
        password,
        role: 'user'
    };

    localStorage.setItem('users', JSON.stringify(userData));
    alert("Registration successful!");
    switchToLogin();
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const userData = JSON.parse(localStorage.getItem('users')) || {};

    if (userData[username] && userData[username].password === password) {
        localStorage.setItem('currentUser', username);
        alert(`Welcome, ${userData[username].firstName}!`);
        closeModal();
        updateLoginStatus();

        if (userData[username].role === 'admin') {
            window.open('admin.html', '_blank');
        }
    } else {
        alert("Invalid username or password!");
    }
});

function updateLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    const navbar = document.querySelector('.navbar-nav');

    const existingLoginButton = document.querySelector('.btn.login-btn');
    if (existingLoginButton) {
        existingLoginButton.remove();
    }

    const existingUserDisplay = document.querySelector('.logged-in-user');
    if (existingUserDisplay) {
        existingUserDisplay.remove();
    }

    if (currentUser) {
        const userData = JSON.parse(localStorage.getItem('users'));
        const usernameDisplay = document.createElement('span');
        usernameDisplay.textContent = userData[currentUser].firstName;
        usernameDisplay.classList.add('logged-in-user');

        const logoutButton = document.getElementById('logoutButton');
        logoutButton.style.display = 'inline-block';

        navbar.appendChild(usernameDisplay);
        usernameDisplay.classList.add('neon-text');
        navbar.appendChild(logoutButton);
        logoutButton.classList.add('btn', 'neon-button', 'ms-3');
    } else {
        const loginButton = document.createElement('button');
        loginButton.textContent = 'Login';
        loginButton.classList.add('btn', 'neon-button', 'ms-3', 'login-btn');
        loginButton.onclick = showModal;
        navbar.appendChild(loginButton);
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    updateLoginStatus();
    alert("You have logged out!");

    const userDisplay = document.querySelector('.logged-in-user');
    if (userDisplay) {
        userDisplay.remove();
    }
    
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    updateLoginStatus();
});



