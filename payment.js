// $(".item-list__photo").click(function(){
//     $(".item-list__price").load("http://localhost:3001/product");
// });
import {product} from './product.js';

if (document.readyState == "loading") {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

let selectedPrduct = [], paymentProduct = [];
function ready(){
    let removeItemButton = document.getElementsByClassName('item-list__remove');
    for (let i = 0; i < removeItemButton.length; i++) {
        let button = removeItemButton[i];
        button.addEventListener('click', removeItem);
    }
}

function removeItem(event){
    let removeButton = event.target;
    removeButton.parentElement.remove();
    updateTotal();
}

function updateTotal(){
    let itemContainer = document.getElementsByClassName('item-container')[0];
    let itemLists = itemContainer.getElementsByClassName('item-list');
    let total = 0;
    for (let i = 0; i < itemLists.length; i++) {
        let itemList = itemLists[i];
        let itemPrice = itemList.getElementsByClassName('item-list__price')[0];
        let itemQuantity = itemList.getElementsByClassName('item-list__quantity')[0];
        let price = parseFloat(itemPrice.innerText);
        let quantity = itemQuantity.value;
        total += (price*quantity);
    }
    document.getElementsByClassName('price-total')[0].innerText = total;
}