let productContainer = document.getElementsByClassName("product__container")[0];
let productAdd = document.getElementsByClassName("product__wrapper__add");
let badgeCart = document.getElementById("lblCartCount");
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
    if (CART.find(id)) {
      CART.increase(id, 1);
    } else {
      let obj = {
        id: productData[id - 1].id,
        src: productData[id - 1].src,
        alt: productData[id - 1].alt,
        price: productData[id - 1].price,
        quantity: 1,
      };
      CART.contents.push(obj);

      CART.sync();
    }
  },
  increase(id, qty = 1) {
    CART.contents = CART.contents.map((item) => {
      if (item.id === id) item.quantity = item.quantity + qty;
      return item;
    });

    CART.sync();
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

    data += `<div class="product__wrapper col-4">
              ${productImg}
              <a class="product__wrapper__add">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="product__wrapper__add__svg">
               <path fill="currentColor"
                  d="M96 0C107.5 0 117.4 8.19 119.6 19.51L121.1 32H541.8C562.1 32 578.3 52.25 572.6 72.66L518.6 264.7C514.7 278.5 502.1 288 487.8 288H170.7L179.9 336H488C501.3 336 512 346.7 512 360C512 373.3 501.3 384 488 384H159.1C148.5 384 138.6 375.8 136.4 364.5L76.14 48H24C10.75 48 0 37.25 0 24C0 10.75 10.75 0 24 0H96zM128 464C128 437.5 149.5 416 176 416C202.5 416 224 437.5 224 464C224 490.5 202.5 512 176 512C149.5 512 128 490.5 128 464zM512 464C512 490.5 490.5 512 464 512C437.5 512 416 490.5 416 464C416 437.5 437.5 416 464 416C490.5 416 512 437.5 512 464z">
                </path>
              </a>
              ${productName}
              ${productPrice}
            </div>`;

    productContainer.insertAdjacentHTML("beforeend", data);
  }

  for (let i = 0; i < productAdd.length; i++) {
    const element = productAdd[i];
    console.log(element);
    element.setAttribute("data-id", productData[i].id);
    element.addEventListener("click", addProduct);
  }
}

function addProduct(element) {
  element.preventDefault();
  let id = parseInt(element.target.getAttribute("data-id")||element.target.parentElement.getAttribute("data-id")||element.target.parentElement.parentElement.getAttribute("data-id"));
  CART.add(id, 1);
  if (CART.find(id)) {
    badgeCart.innerHTML = CART.contents.length;
  }
}