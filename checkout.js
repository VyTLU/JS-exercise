let checkoutOrder = document.getElementsByClassName("item-container__cart-tbody")[0];
let checkoutCount = document.getElementsByClassName("count")[0];
let checkoutFName = document.getElementsByClassName("first-name")[0];
let checkoutLName = document.getElementsByClassName("last-name")[0];
let checkoutA = document.getElementsByClassName("address")[0];
let checkoutFirstName = document.getElementById("billing-first-name");
let checkoutLastName = document.getElementById("billing-last-name");
let checkoutAddress = document.getElementById("billing-address");
let checkoutBar = document.getElementById("progressBarCheckout");
let badgeCart = document.getElementById("lblCartCount");


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
    CART.sync();
  },
};

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

    itemName += `<th class="item-list__name">${item.alt}</th>`;
    itemPrice += `<td class="item-list__price">${
      item.price * item.quantity
    }</td>`;
    itemQuantity += `<th>${item.quantity}</th>`;

    itemData += `<tr class="item-container__cart-total">
                      ${itemName}
                      ${itemQuantity}
                      ${itemPrice}
                    </tr>`;

    count += item.price * item.quantity;
    checkoutOrder.insertAdjacentHTML("beforeend", itemData);
  });

  checkoutCount.insertAdjacentHTML("afterend", `<th>${Math.round(count * 100) / 100}</th>`);

  if (CART.contents.length) {
    badgeCart.innerHTML = CART.contents.length;
  }

  checkoutFirstName.addEventListener("change", updateFirstName);
  checkoutLastName.addEventListener("change", updateLastName);
  checkoutAddress.addEventListener("change", updateAddress);

  checkoutButton.addEventListener("click", finalStep);
}

function updateFirstName(element) {
  let data = "";
  let lastName = element.target.value;
  data += `<th>${lastName}</th>`;

  checkoutFName.insertAdjacentHTML("afterend", `<th>${data}</th>`);
}

function updateLastName(element) {
  let data = "";
  let firstName = element.target.value;
  data += `<th>${firstName}</th>`;

  checkoutLName.insertAdjacentHTML("afterend", `<th>${data}</th>`);
}

function updateAddress(element) {
  let data = "";
  let address = element.target.value;
  data += `<th>${address}</th>`;

  checkoutA.insertAdjacentHTML("afterend", `<th>${data}</th>`);
}

function finalStep(element) {
  CART.empty();
  checkoutBar.style.display = "none";

  checkoutText.style.display = "flex";
  badgeCart.innerHTML = "";
}
