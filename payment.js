//https://www.figma.com/community/file/888726891176991741
//https://www.behance.net/gallery/80515301/Wavey-beauty-UI
//https://elegantthemesexamples.com/cart-and-checkout/two/
//https://stackoverflow.com/questions/51304169/how-to-put-the-number-at-top-right-corner-of-cart-icon

let productIncrement = document.getElementsByClassName("item-list__increase");
let productDecrement = document.getElementsByClassName("item-list__decrease");
let productRemove = document.getElementsByClassName("item-list__remove");
let badgeCart = document.getElementById("lblCartCount");

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
  increase(id, qty = 1) {
    CART.contents = CART.contents.map(item => {
      if (item.id === id)
        item.quantity = item.quantity + qty;
      return item;
    });

    CART.sync()
  },
  reduce(id, qty = 1) {
    CART.contents = CART.contents.map(item => {
      if (item.id === id)
        item.quantity = item.quantity - qty;
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
  },
  empty() {
    CART.contents = [];
    CART.sync()
  },
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

    itemImg += `<img class="item-list__photo" src="https://source.unsplash.com/${item.src}" alt="${item.alt}" />`;
    itemName += `<td class="item-list__name">${item.alt}</td>`
    itemPrice += `<td class="item-list__price">${item.price * item.quantity}</td>`;
    itemQuantity += `<td id="quantity_${item.id}" class="item-list__quantity">${item.quantity}</td>`;

    itemData += `<tbody>
                  <tr class="item-list"> 
                      <td>${itemImg}
                        <span class="badge badge-warning badge-pill item-list__remove" id="lblCartRemove">x</span>
                      </td>
                      ${itemName}
                      <td>${item.price}</td>
                      <td class="item-list__increase">+</td>
                      ${itemQuantity}
                      <td class="item-list__decrease">-</td>
                      ${itemPrice}
                  </tr>
                </tbody>`;

    itemSection.insertAdjacentHTML('beforeend', itemData);
  });

  for (let i = 0; i < productIncrement.length; i++) {
    const element = productIncrement[i];
    element.setAttribute('data-id', CART.contents[i].id);
    element.addEventListener('click', incrementCart);
  }

  for (let i = 0; i < productDecrement.length; i++) {
    const element = productDecrement[i];
    element.setAttribute('data-id', CART.contents[i].id);
    element.addEventListener('click', decrementCart);
  }

  for (let i = 0; i < productRemove.length; i++) {
    const element = productRemove[i];
    element.setAttribute('data-id', CART.contents[i].id);
    element.addEventListener('click', removeCart);
  }

  // badgeCart.innerHTML = CART.contents.length;
}

function incrementCart(element) {
  element.preventDefault();
  let id = parseInt(element.target.getAttribute('data-id'));
  CART.increase(id, 1);
  let controls = element.target.parentElement;
  let qty = controls.querySelector('span:nth-child(2)');
  let item = CART.find(id);
  qty.textContent = item.quantity;
  updateTotal(id, element);
}

function decrementCart(element) {
  element.preventDefault();
  let id = parseInt(element.target.getAttribute('data-id'));
  CART.reduce(id, 1);
  let controls = element.target.parentElement;
  let qty = controls.querySelector('span:nth-child(2)');
  let item = CART.find(id);
  if (item) {
    qty.textContent = item.quantity;
  } else {
    controls.parentElement.parentElement.remove();
  }
  updateTotal(id, element);
}

function removeCart(element) {
  element.preventDefault();
  let id = parseInt(element.target.getAttribute('data-id'));
  element.target.parentElement.parentElement.remove();
  CART.remove(id);
}

function updateTotal(id, element) {
  let item = CART.find(id);
  if (item) {
    let total = item.price * item.quantity;

    let prc = element.target.parentElement.parentElement.querySelector(".item-list__price");
    prc.textContent = total;
  }
}