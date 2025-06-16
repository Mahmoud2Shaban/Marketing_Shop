$(document).ready(function(){
    //cache jquery selector
    const $menuCartElement =$('.menu-cart');
    const $cartItemsElement =$('.cart-list');    
    const $cartElement =$('.cart');    
    const $mainElement =$('.main');  
    //initialize on empty cart
    let cart = [];
    
    //function to add product to the cart
    function addToCart(productElement){
        const $productElement = $(productElement);
        const productId = $productElement.data('product');
        const productName = $productElement.find('.product-title').text();
        const productPrice = parseFloat($productElement.find('.product-price').text().replace('$',''));
        const productImage = $productElement.find('.product-img').attr('src');

        let existingImg = cart.find(item => item.id === productId);

        if(existingImg){
            //increment quantity if item exists
            existingImg.quantity += 1;
        }else{
            const newItem = {
                id : productId,
                name : productName,
                price : productPrice,
                image : productImage,
                quantity : 1
            };
            //Add newitem to the cart 
            cart.push(newItem);
        }
        //update cart count
        updateCartCount();
        //Re-render Cart items
        renderCartItems();
    }

    // functio to update the cart count displayed in the menu cart


    function updateCartCount(){
        const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
        $menuCartElement.find('.cart-count').text(itemCount);
    }
    // function to render the items on the cart 
    function renderCartItems(){
        //clear the cart items container 
        $cartItemsElement.empty();
        if(cart.length === 0){
            //display image of empty when the cart is empty
            $cartItemsElement.html(`
                <div class="cart-empty">
                    <imag src="images/empty.svg">
                    <p> Your cart is empty</p>
                </div>`)
            // $cartItemsElement.append('<li class="empty-cart
    }else{
        // iterate through the cart and display each item
        $.each(cart, function(index, item){
            const $cartItemElement = $(`<div class="cart-item"></div>`);
            $cartItemElement.html(`
                <img class="cart-item-img" src="${item.image}" alt="${item.name}">
                <div class="cart-item-desc">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-quantity"> 
                        <button class="change-quantity" data-id="${item.id}" data-action="decrement">-</button>
                        ${item.quantity}
                        <button class="change-quantity" data-id="${item.id}" data-action="increment">+</button>
                    </div>
                </div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="cart-item-remove" data-id="${item.id}"><i class="fa solid fa-trash"></i></button>
                `);
                $cartItemsElement.append($cartItemElement);
        });
    }
        //update the order summary / cart action 
        updateOrderSummary();
}
    function updateOrderSummary(){
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.10  ; // Assuming a tax rate of 10%
        const total = subtotal + tax;
        $(`#total-price .cart-amount-value`).text(`$${subtotal.toFixed(2)}`);
        $(`#tax .cart-amount-value`).text(`$${tax.toFixed(2)}`);
        $(`#final-price .cart-amount-value`).text(`$${total.toFixed(2)}`);
    }

    //event handlers
    $(`.add-to-cart`).on('click', function(){
        const productElement = $(this).closest('.product');
        //call the function to add product to the cart
        addToCart(productElement);
    });

    //event listener for adding product to the cart
    $cartItemsElement.on('click', '.change-quantity',function(){
        const itemId = $(this).data('id');
        const action = $(this).data('action');
        const item = cart.find(item => item.id === itemId);

        if(action === 'increment'){
            item.quantity += 1;
        }else if(action === 'decrement' && item.quantity > 1){
            item.quantity -= 1;
        }
        updateCartCount();
        renderCartItems();
    });

    // Event listener for removing the item from cart
    $cartItemsElement.on('click','.cart-item-remove',function(){
        const itemId = $(this).data('id');
        cart = cart.filter(item => item.id !== itemId);

        updateCartCount();
        renderCartItems();
    });

    // Event listener for toggling the cart view
    $menuCartElement.on('click',function(){
        $cartElement.toggleClass('collapsed');
        $mainElement.toggleClass('expanded', $cartElement.hasClass('collapsed'));
    });

    renderCartItems();

});