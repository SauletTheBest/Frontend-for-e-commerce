const cyberpunkStyles = `
    body { 
        background-color: #1d1f27; 
        color: #00fff6; 
        font-family: 'Courier New', Courier, monospace; 
    } 
    .login-modal { 
        background: #282c34; 
        color: #00fff6; 
        padding: 20px; 
        border-radius: 10px; 
        width: 320px; 
        text-align: center; 
        box-shadow: 0px 0px 15px #ff00ff; 
        display: none; 
    } 
    .modal-overlay { 
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        background: rgba(0, 0, 0, 0.7); 
        display: none; 
        z-index: 1000; 
    } 
    .admin-panel { 
        display: none; 
        background: #282c34; 
        color: #00fff6; 
        padding: 20px; 
        border-radius: 8px; 
        width: 90%; 
        margin: auto; 
        box-shadow: 0 0 15px #ff00ff; 
    } 
    .user-table { 
        width: 100%; 
        border-collapse: collapse; 
    } 
    .user-table th, .user-table td { 
        padding: 10px; 
        border: 1px solid #00fff6; 
        text-align: left; 
    } 
    .edit-btn, .delete-btn { 
        color: #00fff6; 
        background-color: transparent; 
        border: none; 
        cursor: pointer; 
    } 
    .edit-btn:hover, .delete-btn:hover { 
        color: #ff00ff; 
    } 
    .add-user-btn { 
        background-color: #ff00ff; 
        color: white; 
        padding: 10px; 
        border: none; 
        border-radius: 4px; 
        cursor: pointer; 
    } 
    .add-user-btn:hover { 
        background-color: #00fff6; 
    } 
    .error { 
        color: red; 
    } 
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = cyberpunkStyles;
document.head.appendChild(styleSheet);

function getUsersFromStorage() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        try {
            const usersObject = JSON.parse(storedUsers);
            return Object.values(usersObject);
        } catch (error) {
            console.error("Error parsing user data:", error);
            return [];
        }
    }
    return [];
}

function saveUsersToStorage(users) {
    const usersObject = {};
    users.forEach(user => {
        usersObject[user.username] = user;
    });
    localStorage.setItem('users', JSON.stringify(usersObject));
}

function openAdminPanel() {
    renderUserTable();
    document.querySelector('.admin-panel').style.display = 'block';
}

function closeAdminPanel() {
    document.querySelector('.admin-panel').style.display = 'none';
}

function renderUserTable() {
    const users = getUsersFromStorage();
    console.log("Users:", users);
    const userTable = document.querySelector('#userTableBody');
    userTable.innerHTML = '';

    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" value="${user.username}" onchange="editUser(${index}, 'username', this.value)"></td>
            <td><input type="text" value="${user.firstName}" onchange="editUser(${index}, 'firstName', this.value)"></td>
            <td><input type="text" value="${user.lastName}" onchange="editUser(${index}, 'lastName', this.value)"></td>
            <td><input type="text" value="${user.email}" onchange="editUser(${index}, 'email', this.value)"></td>
            <td><input type="password" value="${user.password}" onchange="editUser(${index}, 'password', this.value)"></td>
            <td>
                <button class="edit-btn" onclick="confirmDeleteUser(${index})">Delete</button>
            </td>
        `;
        userTable.appendChild(row);
    });
}

function editUser(index, field, value) {
    let users = getUsersFromStorage();
    users[index][field] = value;
    saveUsersToStorage(users);
    displayMessage(`User "${users[index].username}" updated.`);
}

function confirmDeleteUser(index) {
    let users = getUsersFromStorage();
    if (confirm(`Are you sure you want to delete user "${users[index].username}"?`)) {
        deleteUser(index);
    }
}

function deleteUser(index) {
    let users = getUsersFromStorage();
    users.splice(index, 1);
    saveUsersToStorage(users);
    renderUserTable();
    displayMessage("User deleted.");
}

function addUser() {
    const newUser = {
        username: prompt("Enter username"),
        firstName: prompt("Enter first name"),
        lastName: prompt("Enter last name"),
        email: prompt("Enter email"),
        password: prompt("Enter password")
    };

    if (validateUser(newUser)) {
        let users = getUsersFromStorage();
        users.push(newUser);
        saveUsersToStorage(users);
        renderUserTable();
        displayMessage("New user added.");
    }
}

function validateUser(user) {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!user.username || !user.firstName || !user.lastName || !user.email || !user.password) {
        alert("All fields are required.");
        return false;
    }
    if (!emailRegex.test(user.email)) {
        alert("Please enter a valid email.");
        return false;
    }
    return true;
}

function displayMessage(message) {
    const messageBox = document.querySelector('#messageBox');
    messageBox.textContent = message;
    setTimeout(() => messageBox.textContent = '', 3000);
}

document.body.innerHTML = `
    <div class="modal-overlay" onclick="closeAdminPanel()"></div>
    <div class="admin-panel">
        <h2>Admin panel</h2>
        <button class="add-user-btn" onclick="addUser()">Add User</button>
        <table class="user-table">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="userTableBody"></tbody>
        </table>
        <div id="messageBox" style="color: #ff00ff; font-weight: bold; margin-top: 10px;"></div>
    </div>
`;

openAdminPanel();
