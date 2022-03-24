$(document).ready(function () {

    $.getJSON("http://localhost:3000/product", function(data){
        // let total = 0;
        $.each(data, function(key, value){
            let product_img = "", product_price = "", product_add = "", product_data = "";
            // console.log(product_add);
            product_img += `<img src="https://source.unsplash.com/${value.src}" alt="${value.alt}"/>`;
            product_price += `${value.price}`;
            // product_add += `<a class="product__add__link">Add to cart</a>`
            product_data += 
                `<div class="product__img">${product_img}</div>
                <div class="product__price">${product_price}</div>
                <a class="product__add__link">Add to cart</a>`
            // console.log(product_add);
            
            $(product_data).appendTo('.product');
            // $(product_add).appendTo('.product__add');
            // total += parseInt(product_price);
            // console.log(product_add);
            // console.log(product_data);
        });
        // $('.product__total').append(total);
    });

    
});

let addToCart = document.querySelector('.product').querySelectorAll('.product__add_link');
console.log(addToCart);

/* for (let i = 0; i < addToCart.length; i++) {
    addToCart.addEventListener('click', () =>{
        console.log('Add to cart');
    });
    
} */