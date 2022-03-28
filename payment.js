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
  reduce(id, qty=1){
    CART.contents = CART.contents.map(item=>{
        if(item.id === id)
            item.quantity = item.quantity - qty;
        return item;
    });
    CART.contents.forEach(async item=>{
        if(item.id === id && item.quantity === 0)
            await CART.remove(id);
    });
    
    CART.sync()
},
remove(id){
    CART.contents = CART.contents.filter(item=>{
        if(item.id !== id)
            return true;
    });
    
    CART.sync()
},
empty(){
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
    itemPrice += `<div class="product__wrapper__price">${item.price*item.quantity}</div>`;
    itemQuantity += `<input class="item-list__quantity" type="number" value="${item.quantity}">`;

    itemData += `<div class="item-list"> 
                    ${itemImg}
                    ${itemPrice}
                    ${itemQuantity}
                    <button class="item-list__remove">Remove</button>
                </div>`;

    itemSection.insertAdjacentHTML('beforeend', itemData);
  });
}


// function incrementCart(ev){
//     ev.preventDefault();
//     let id = parseInt(ev.target.getAttribute('data-id'));
//     CART.increase(id, 1);
//     let controls = ev.target.parentElement;
//     let qty = controls.querySelector('span:nth-child(2)');
//     let item = CART.find(id);
//     if(item){
//         qty.textContent = item.qty;
//     }else{
//         document.getElementById('cart').removeChild(controls.parentElement);
//     }
// }

// function decrementCart(ev){
//     ev.preventDefault();
//     let id = parseInt(ev.target.getAttribute('data-id'));
//     CART.reduce(id, 1);
//     let controls = ev.target.parentElement;
//     let qty = controls.querySelector('span:nth-child(2)');
//     let item = CART.find(id);
//     if(item){
//         qty.textContent = item.qty;
//     }else{
//         document.getElementById('cart').removeChild(controls.parentElement);
//     }
// }