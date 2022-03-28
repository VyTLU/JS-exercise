// if (document.readyState == "loading") {
//     document.addEventListener('DOMContentLoaded', ready);
// } else {
//     ready();
// }

// let selectedPrduct = [], paymentProduct = [];
// function ready(){
//     let removeItemButton = document.getElementsByClassName('item-list__remove');
//     for (let i = 0; i < removeItemButton.length; i++) {
//         let button = removeItemButton[i];
//         button.addEventListener('click', removeItem);
//     }
// }

// function removeItem(event){
//     let removeButton = event.target;
//     removeButton.parentElement.remove();
//     updateTotal();
// }

// function updateTotal(){
//     let itemContainer = document.getElementsByClassName('item-container')[0];
//     let itemLists = itemContainer.getElementsByClassName('item-list');
//     let total = 0;
//     for (let i = 0; i < itemLists.length; i++) {
//         let itemList = itemLists[i];
//         let itemPrice = itemList.getElementsByClassName('item-list__price')[0];
//         let itemQuantity = itemList.getElementsByClassName('item-list__quantity')[0];
//         let price = parseFloat(itemPrice.innerText);
//         let quantity = itemQuantity.value;
//         total += (price*quantity);
//     }
//     document.getElementsByClassName('price-total')[0].innerText = total;
// }

let productIncrement = document.getElementsByClassName("item-list__increase");
let productDecrement = document.getElementsByClassName("item-list__decrease");
let productRemove = document.getElementsByClassName("item-list__remove");

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
  let itemSection = document.getElementsByClassName("item-container")[0];
  CART.contents.forEach((item) => {
    let itemImg = "",
      itemPrice = "",
      itemQuantity = "",
      itemData = "";

    itemImg += `<img class="item-list__photo" src="https://source.unsplash.com/${item.src}" alt="${item.alt}" />`;
    itemPrice += `<div class="item-list__price">${item.price * item.quantity}</div>`;
    itemQuantity += `<span id="quantity_${item.id}" class="item-list__quantity">${item.quantity}</span>`;

    itemData += `<div class="item-list"> 
                    ${itemImg}
                    ${itemPrice}
                    <div class="">
                      <span class="item-list__increase">+</span>
                      ${itemQuantity}
                      <span class="item-list__decrease">-</span>
                    </div>
                    <button class="item-list__remove">Remove</button>
                </div>`;

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
    controls.parentElement.remove();
  }
  updateTotal(id, element);
}

function removeCart(element) {
  element.preventDefault();
  let id = parseInt(element.target.getAttribute('data-id'));
  element.target.parentElement.remove();
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