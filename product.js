let productContainer = document.getElementsByClassName("product")[0];
let productAdd = document.getElementsByClassName("product__wrapper__add");
let productData;

const CART = {
  KEY: "JStest",
  contents: [],
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
  add(id) {
    console.log("String " , id);
    if (CART.find(id)) {
      CART.increase(id, 1);
    } else {
      let obj = {
        id: productData[id-1].id,
        src: productData[id-1].src,
        alt: productData[id-1].alt,
        price: productData[id-1].price,
        quantity: 1
      };
      CART.contents.push(obj);

      CART.sync();
    }
  },
  increase(id, qty=1){
    CART.contents = CART.contents.map(item=>{
        if(item.id === id)
            item.quantity = item.quantity + qty;
        return item;
    });
    
    CART.sync()
},
};

let product = new XMLHttpRequest();
product.open("GET", "http://localhost:3001/product");
product.onload = function () {
  productData = JSON.parse(product.responseText);
  
  renderHTML(productData);
};
product.send();

function renderHTML(productData) {
  for (let i = 0; i < productData.length; i++) {
    const element = productData[i];
    let productImg = "",
      productName = "",
      productPrice = "",
      data = "";

    productImg += `<img class="product__wrapper__img" src="https://source.unsplash.com/${element.src}" alt="${element.alt}" />`;
    productName += `<div class="product__wrapper__name">${element.alt}</div>`;
    productPrice += `<div class="product__wrapper__price">${element.price}</div>`;

    data += `<div class="product__wrapper">
              ${productImg}
              <a class="product__wrapper__add add-cart">Add to cart</a>
              ${productName}
              ${productPrice}
            </div>`;

    productContainer.insertAdjacentHTML("beforeend", data);
  }

  for (let i = 0; i < productAdd.length; i++) {
    const element = productAdd[i];
    element.setAttribute('data-id', productData[i].id);
    console.log(element);
    element.addEventListener("click", addProduct);
  }
}

function addProduct(element){
  element.preventDefault();
  let id = parseInt(element.target.getAttribute('data-id'));
  console.log(id);
  CART.add(id, 1);
}