let productContainer = document.getElementsByClassName('product')[0];


let product = new XMLHttpRequest();
product.open('GET', 'http://localhost:3000/product');
product.onload = function(){
    let productData = JSON.parse(product.responseText);
    // console.log(productData[0]);
    renderHTML(productData);
}
product.send();

console.log(productContainer);

function renderHTML(productData){
    // let data = 
    // for (let i = 0; i < data.length; i++) {
    //     const element = data[i];
        
    // }

    productContainer.insertAdjacentHTML('beforeend', "Hello");
}