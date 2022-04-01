let checkoutOrder = document.getElementsByClassName("item-container__cart-tbody")[0];
let checkoutCount = document.getElementsByClassName("count")[0];
let checkoutFName = document.getElementsByClassName("first-name")[0];
let checkoutLName = document.getElementsByClassName("last-name")[0];
let checkoutA = document.getElementsByClassName("address")[0];
let checkoutFirstName = document.getElementById("billing-first-name");
let checkoutLastName = document.getElementById("billing-last-name");
let checkoutAddress = document.getElementById("billing-address");

let checkoutButton = document.getElementById("checkoutPage");
let checkoutContainer = document.getElementById("containerCheckout");
let checkoutText = document.getElementById("finalText");

let count = 0;

const CART = {
    KEY: "JStest",
    contents: [],
    init() {
        let content = localStorage.getItem(CART.KEY);
        if (content) {
            CART.contents = JSON.parse(content);
        }

        CART.sync();
    },
    async sync() {
        let cart = JSON.stringify(CART.contents);
        await localStorage.setItem(CART.KEY, cart);
    },
    empty() {
      CART.contents = [];
      CART.sync()
    },
}

document.addEventListener("DOMContentLoaded", () => {
    CART.init();
    showCheckout();
});

function showCheckout() {
    CART.contents.forEach((item) => {
        let itemPrice = "",
            itemQuantity = "",
            itemName = "",
            itemData = "";

        itemName += `<td class="item-list__name">${item.alt}</td>`
        itemPrice += `<td class="item-list__price">${item.price * item.quantity}</td>`;
        itemQuantity += `<td>${item.quantity}</td>`;

        itemData += `<tr class="item-container__cart-total">
                      ${itemName}
                      ${itemQuantity}
                      ${itemPrice}
                    </tr>`;

        count += item.price*item.quantity;
        checkoutOrder.insertAdjacentHTML('beforeend', itemData);
    });

    checkoutCount.insertAdjacentHTML('beforeend', count);

    checkoutFirstName.addEventListener('change', updateFirstName);
    checkoutLastName.addEventListener('change', updateLastName);
    checkoutAddress.addEventListener('change', updateAddress);

    checkoutButton.addEventListener('click', finalStep);
}

function updateFirstName(element){
    let data = "";
    let lastName = element.target.value;
    data += `${lastName}`;

    checkoutFName.insertAdjacentHTML('beforeend', data);
}

function updateLastName(element){
    let data = "";
    let firstName = element.target.value;
    data += `${firstName}`;

    checkoutLName.insertAdjacentHTML('beforeend', data);
}

function updateAddress(element){
    let data = "";
    let address = element.target.value;
    data += `${address}`;

    checkoutA.insertAdjacentHTML('beforeend', data);
}

function finalStep(element){
    CART.empty();
    checkoutOrder.innerHTML = "";
    checkoutContainer.style.display = "none";
    checkoutText.style.opacity = "1";
}