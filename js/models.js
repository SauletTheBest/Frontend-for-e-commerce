const cardStyle = `
    /* Tooltip Style */
    .additional-info {
        position: absolute;
        bottom: 90%;
        left: 50%;
        transform: translateX(-50%);
        width: 350px;
        background-color: rgba(17, 17, 17, 0.9);
        color: #ff00ff;
        font-family: 'VT323', monospace;
        font-size: 1.1rem;
        line-height: 1.6;
        text-shadow: 0 0 7px #ff00ff, 0 0 15px #00ff99;
        border-top: 1px solid #00ff99;
        padding: 15px;
        margin-top: 1px;
        border-radius: 20px;
        display: none;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        box-shadow: 0 0 10px #00ff99, 0 0 20px #ff00ff;
        z-index: 10;
    }

    /* Tooltip Arrow */
    .additional-info::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 10px;
        border-style: solid;
        border-color: #ff00ff transparent transparent transparent;
    }

    /* Tooltip Title */
    .tooltip-title {
        font-weight: bold;
        color: #00ff99;
        margin-bottom: 8px;
        text-transform: uppercase;
        text-shadow: 0 0 5px #00ff99, 0 0 10px #ff00ff;
    }
    @keyframes moveToCart {
    0% { transform: translateY(0); opacity: 1; }
    100% { transform: translate(300px, -300px); opacity: 0; } /* Скорректируйте направление */
}

    .flying-car {
    position: absolute;
    width: 50px;
    height: auto;
    animation: moveToCart 1s forwards;
}

    .purchase-container {
    background-color: #4d01b9;
    border: 2px solid #ff0099;
    padding: 20px;
    width: 90%;
    max-width: 500px;
    border-radius: 10px;
    box-shadow: 0 0 20px #ff0099;
    }
    .purchase-container h2 {
    text-align: center;
    color: #ff0099;
    }
    .form-group {
    margin-bottom: 15px;
    }
    label {
    color: #f2f2f2;
    }
    select, input[type="number"], input[type="text"] {
    width: 100%;
    padding: 8px;
    background-color: #333;
    color: #f2f2f2;
    border: 1px solid #ff0099;
    border-radius: 5px;
    }
    .btn-purchase, .btn-back {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    }
    .btn-purchase {
    background-color: #ff0099;
    color: #fff;
    border: none;
    }
    .btn-purchase:hover {
    background-color: #ff66b2;
    }
    .btn-back {
    background-color: #333;
    color: #f2f2f2;
    border: 1px solid #ff0099;
    }
    .btn-back:hover {
    background-color: #555;
    }
`;


document.head.insertAdjacentHTML('beforeend', `<style>${cardStyle}</style>`);

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const tooltip = document.createElement('div');
        tooltip.classList.add('additional-info');
        tooltip.innerHTML = `
            <div class="tooltip-title">${card.querySelector('.card-title').innerText}</div>
            ${card.getAttribute('data-info').split('|').map(info => `<div>${info.trim()}</div>`).join('')}
        `;
        card.appendChild(tooltip);

        card.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
            setTimeout(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateX(-50%) translateY(-5px)';
            }, 10);
        });


        card.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateX(-50%) translateY(0)';
            setTimeout(() => {
                tooltip.style.display = 'none';
            }, 300);
        });
    });
});
// ---------------------------------------------------------------------------------------------------------->

function openPurchasePage(carPrice, carName) {
    const purchaseContainer = document.createElement('div');
    purchaseContainer.classList.add('purchase-container');
    purchaseContainer.innerHTML = `
        <h2>${carName}</h2>
        <form id="purchaseForm">
            <div class="form-group">
                <label for="quantity">Quantity:</label>
                <input type="number" id="quantity" min="1" value="1" required>
            </div>
            <div class="form-group">
                <label for="edition">Select Edition:</label>
                <select id="edition" required>
                    <option value="standard">Standard Edition</option>
                    <option value="sport">Sport Edition</option>
                    <option value="luxury">Luxury Edition</option>
                </select>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="additionalEquipment"> Additional Equipment ($150)
                </label>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="tireAssembly"> Tire Assembly ($50)
                </label>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="annualSubscription"> Annual Subscription for Technical Inspection ($200)
                </label>
            </div>
            <input type="hidden" id="carSelect" value="${carPrice}">
            <button type="button" id = "buy-buttom" class="btn-purchase" onclick="confirmPurchase()">Add to card</button>
            <button type="button" class="btn-back" onclick="redirectToOffers()">Back to Offers</button>
        </form>
    `;


    purchaseContainer.style.position = 'fixed';
    purchaseContainer.style.top = '50%';
    purchaseContainer.style.left = '50%';
    purchaseContainer.style.transform = 'translate(-50%, -50%)';

    document.body.appendChild(purchaseContainer);

    const styleElement = document.createElement('style');
    styleElement.textContent = cyberpunkPageStyles;
    document.head.appendChild(styleElement);
}

function redirectToOffers() {
    window.location.href = '../HTML/models.html';
}

function confirmPurchase() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const edition = document.getElementById('edition').value;
    const additionalEquipment = document.getElementById('additionalEquipment').checked;
    const tireAssembly = document.getElementById('tireAssembly').checked;
    const annualSubscription = document.getElementById('annualSubscription').checked;
    const carPrice = parseInt(document.getElementById('carSelect').value);

    let totalCost = carPrice * quantity;
    if (edition === 'sport') totalCost += 100;
    if (edition === 'luxury') totalCost += 200;
    if (additionalEquipment) totalCost += 150;
    if (tireAssembly) totalCost += 50;
    if (annualSubscription) totalCost += 200;

    const purchaseData = {
        carName: document.querySelector('h2').textContent,
        quantity,
        edition,
        additionalEquipment: additionalEquipment ? 'Yes' : 'No',
        tireAssembly: tireAssembly ? 'Yes' : 'No',
        annualSubscription: annualSubscription ? 'Yes' : 'No',
        totalCost: `$${totalCost}`
    };
    
    localStorage.setItem('purchaseData', JSON.stringify(purchaseData));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(purchaseData);
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-count').textContent = cart.length;
}

function createCartIcon() {
    const cartIcon = document.createElement('div');
    cartIcon.id = 'cart-icon';
    cartIcon.innerHTML = `
        🛒
        <span id="cart-count">0</span>
    `;

    cartIcon.onclick = function() {
        window.open('../HTML/cart.html', '_blank');  
    };

    document.body.appendChild(cartIcon);
    updateCartCount();

    const styleElement = document.createElement('style');
    styleElement.textContent = `
        #cart-icon {
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-size: 24px;
            color: #fff;
            cursor: pointer;
            background-color: #333;
            padding: 10px;
            border-radius: 50%;
            z-index: 1000;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            animation: float 3s ease-in-out infinite;
        }

        #cart-count {
            position: absolute;
            top: -10px;
            right: -10px;
            background-color: red;
            color: white;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 14px;
        }

        @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0); }
        }
    `;
    document.head.appendChild(styleElement);
}

createCartIcon();

document.getElementById("buy-buttom").addEventListener("click", () => {
    alert("Button clicked!");
});