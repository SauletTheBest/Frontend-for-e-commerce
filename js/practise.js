document.addEventListener("DOMContentLoaded", function () {
    
    const authSection = document.createElement('div');
    authSection.style.position = 'relative';
    authSection.style.width = '200px';
    authSection.style.height = '100px';
    authSection.style.border = '1px solid #00ffcc';

    
    function createButton(id, text, onClick) {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.onclick = onClick;
        
        
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.color = '#1e1e2f';
        button.style.backgroundColor = '#00ffcc';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        return button;
    }

    
    const loginButton = createButton('login-btn', 'Login', openLoginModal);
    loginButton.style.position = 'absolute';
    loginButton.style.top = '0';
    loginButton.style.left = '0';

    const registerButton = createButton('register-btn', 'Register', openRegisterModal);
    registerButton.style.position = 'absolute';
    registerButton.style.bottom = '0';
    registerButton.style.right = '0';

    
    authSection.appendChild(loginButton);
    authSection.appendChild(registerButton);
    document.body.appendChild(authSection);

    
    function openLoginModal() {
        document.getElementById('login-modal').style.display = 'block';
    }

    function openRegisterModal() {
        document.getElementById('register-modal').style.display = 'block';
    }
    function createModal(id, content) {
        const modal = document.createElement('div');
        modal.id = id;
        modal.style.display = 'none'; 
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#333';
        modal.style.color = '#00ffcc';
        modal.style.padding = '20px';
        modal.style.borderRadius = '8px';
        modal.innerHTML = content;
        return modal;
    }

    const registerModal = createModal('register-modal', `
        <h3>Register</h3>
        <input type="text" id="register-username" placeholder="Username" required><br>
        <small>Username: 3-15 chars, letters & numbers only.</small><br>
        <input type="password" id="register-password" placeholder="Password" required><br>
        <small>Password: Min 8 chars, 1 upper, 1 lower, 1 digit.</small><br>
        <button onclick="registerUser()">Register</button>
    `);
    document.body.appendChild(registerModal);

    const loginModal = createModal('login-modal', `
        <h3>Login</h3>
        <input type="text" id="login-username" placeholder="Username" required><br>
        <input type="password" id="login-password" placeholder="Password" required><br>
        <button onclick="loginUser()">Login</button>
    `);
    document.body.appendChild(loginModal);

    const adminPanelModal = createModal('admin-panel-modal', `
        <h3>Admin Panel</h3>
        <table id="user-table">
            <thead><tr><th>Username</th><th>Actions</th></tr></thead>
            <tbody></tbody>
        </table>
    `);
    document.body.appendChild(adminPanelModal);

    
    const toggleAdminPanelButton = createButton('toggle-admin-btn', 'Toggle Admin Panel', toggleAdminPanel);
    toggleAdminPanelButton.style.display = 'none'; 
    authSection.appendChild(toggleAdminPanelButton);

    const logoutButton = createButton('logout-btn', 'Logout', logoutUser);
    logoutButton.style.display = 'none'; 
    authSection.appendChild(logoutButton);

    
    if (localStorage.getItem('loggedInUser')) {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        showUserGreeting(user.username);
        if (user.role === 'admin') showAdminControls();
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (!users.some(user => user.username === 'admin')) {
        users.push({ username: 'admin', password: '123', role: 'admin' });
        localStorage.setItem('users', JSON.stringify(users));
    }
});
