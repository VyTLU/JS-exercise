let productQuantity = document.getElementsByClassName("item-list__quantity");
let productRemove = document.getElementsByClassName("item-list__remove");
let badgeCart = document.getElementById("lblCartCount");
let productTotals = document.getElementById("cartTotAmount");

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
  find(id) {
    let match = CART.contents.filter((item) => {
      return item.id == id;
    });
    if (match && match[0]) return match[0];
  },
  update(id, value){
    CART.contents = CART.contents.map(item => {
      if (item.id === id)
        item.quantity = value;
      return item;
    });
    CART.contents.forEach(async item => {
      if (item.id === id && item.quantity === 0)
        await CART.remove(id);
    });

    CART.sync()
  },
  remove(id) {
    CART.contents = CART.contents.filter(item => {
      if (item.id !== id)
        return true;
    });

    CART.sync()
  }
};

document.addEventListener("DOMContentLoaded", () => {
  CART.init();
  showCart();
});

function showCart() {
  let itemSection = document.getElementsByClassName("item-container__info")[0];
  CART.contents.forEach((item) => {
    let itemImg = "",
      itemPrice = "",
      itemQuantity = "",
      itemName = "",
      itemData = "";

    itemImg += `<img width="40" height-"40" class="item-list__photo" src="https://source.unsplash.com/${item.src}" alt="${item.alt}" />`;
    itemName += `<td class="item-list__name">${item.alt}</td>`
    itemPrice += `<td class="item-list__price">${item.price * item.quantity}</td>`;
    itemQuantity += `<input type="number" id="quantity_${item.id}" class="item-list__quantity" step="1" min="0" value="${item.quantity}" placeholder inputmode="numeric">`;

    itemData += `<tbody>
                  <tr class="item-list"> 
                    <td class="item-list__remove">
                      <a class="badge badge-warning badge-pill" id="lblCartRemove">x</a>
                    </td>
                    <td>${itemImg}</td>
                    ${itemName}
                    <td>${item.price}</td>
                    <td>
                      ${itemQuantity}
                    </td>
                    ${itemPrice}
                  </tr>
                </tbody>`;

    itemSection.insertAdjacentHTML('beforeend', itemData);

    
  });

  if (CART.contents.length) {
    badgeCart.innerHTML = CART.contents.length;
  }

  for (let i = 0; i < productQuantity.length; i++) {
    const element = productQuantity[i];
    element.setAttribute('data-id', CART.contents[i].id);
    element.addEventListener('change', updateCart);
  }

  for (let i = 0; i < productRemove.length; i++) {
    const element = productRemove[i];
    element.setAttribute('data-id', CART.contents[i].id);
    element.addEventListener('click', removeCart);
  }

  totals();
}

function updateCart(element){
  element.preventDefault();
  let id = parseInt(element.target.getAttribute('data-id'));
  console.log(element.target);
  let value = parseInt(element.target.value);
  console.log(value);
  CART.update(id, value);

  let item = CART.find(id);
  if (!item){
    element.target.parentElement.parentElement.remove();
  }
  updateTotal(id, element);
}

function removeCart(element) {
  element.preventDefault();
  console.log(element.target);
  let id = parseInt(element.target.parentElement.getAttribute('data-id'));
  console.log(id);
  CART.remove(id);
  element.target.parentElement.parentElement.remove();
  totals();
}

function updateTotal(id, element) {
  let item = CART.find(id);
  if (item) {
    let total = item.price * item.quantity;

    let prc = element.target.parentElement.parentElement.querySelector(".item-list__price");
    prc.textContent = Math.round(total * 100) / 100;
  }
  totals();
}

function totals(){
  let temp = 0;
  for (let i = 0; i < CART.contents.length; i++) {
    let element = CART.contents[i];
    temp += element.price*element.quantity;
  }
  productTotals.innerHTML = Math.round(temp * 100) / 100;
}