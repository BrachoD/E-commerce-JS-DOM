class Product {
    //Product class with its attributes and properties.
    constructor(id, productName, img, category, stock, price, available) {
        this.id = id
        this.productName = productName
        this.img = img
        this.category = category
        this.stock = stock
        this.price = price
        this.available = available
    }

    //This method decreases the stock by 1 when a product is added to the cart. If the stock reaches 0 it won't let you add it to the cart.
    sell() {
        this.stock--

        if (this.stock == 0) {
            this.available = false
        }
    }

    //This method increases the stock by 1 when the product is returned, this is applied when you clear the cart.
    return() {
        this.stock++

        if (this.stock > 0) {
            this.available = true
        }
    }
}

const greenShoes = new Product(1, "Green Shoes", "./assets/images/green-shoes.jpg", "Footwear", 3, 30, true)
const greenShirt = new Product(2, "Green Shirt", "./assets/images/green-shirt.jpg", "Upper Body", 2, 10, true)
const redShoes = new Product(3, "Red Shoes", "./assets/images/red-shoes.jpg", "Footwear", 5, 15, true)
const redShirt = new Product(4, "Red Shirt", "./assets/images/red-shirt.jpg", "Upper Body", 4, 5, true)
const blueShoes = new Product(5, "Blue Shoes", "./assets/images/blue-shoes.jpg", "Footwear", 2, 50, true)
const blueShirt = new Product(6, "Blue Shirt", "./assets/images/blue-shirt.jpg", "Upper Body", 1, 15, true)
const blueJeans = new Product(7, "Blue Jeans", "./assets/images/blue-jeans.jpg", "Lower Body", 4, 25, true)
const shorts = new Product(8, "Shorts", "./assets/images/shorts.jpg", "Lower Body", 2, 20, true)
const blackJeans = new Product(9, "Black Jeans", "./assets/images/black-jeans.jpg", "Lower Body", 3, 30, true)


let productList = []

if (JSON.parse(localStorage.getItem("productListBackup"))) {

    JSON.parse(localStorage.getItem("productListBackup")).forEach(product => {
        productToAppend = new Product(product.id, product.productName, product.img, product.category, product.stock, product.price, product.available)
        productList.push(productToAppend)
    })

}
else {
    productList = [greenShoes, greenShirt, redShoes, redShirt, blueShoes, blueShirt, blueJeans, shorts, blackJeans]
}


let shoppingCartDOM = document.getElementById("shopping-cart")
let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || []

drawShoppingCart(shoppingCart)
drawProducts(productList)

/*Rendering function*/
function drawProducts(productsArray) {

    let productListContainer = document.getElementById("productList")
    productListContainer.innerHTML = ""

    productsArray.forEach(product => {
        let productCard = document.createElement("div")
        productCard.className = "card"
        productCard.innerHTML = `
    <img src=${product.img} class="card-img-list card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${product.productName}</h5>
                    <p class="card-text">Category: ${product.category}</p>
                    <p class="card-text">Units in stock: ${product.stock} units</p>
                    <h6 class="card-title"><strong>Price: $${product.price}</strong></h6>

                    <a id="${product.id}" class="btn btn-primary">Add to cart</a>
                </div>
    `
        productListContainer.appendChild(productCard)
        let button = document.getElementById(product.id)
        button.addEventListener("click", addToCart)

    })

}

/*Searching function*/
let searchBar = document.getElementById("searching-bar")
searchBar.addEventListener("input", filterProducts)

function filterProducts(e) {
    let filteredArray = productList.filter(product => product.productName.toLowerCase().includes(searchBar.value.toLowerCase()))
    drawProducts(filteredArray)
}

function addToCart(e) {
    let productFound = productList.find(product => product.id === Number(e.target.id))
    if (productFound.available) {

        if (shoppingCart.some(({ id }) => id == productFound.id)) {
            let pos = shoppingCart.findIndex(product => product.id == productFound.id)
            shoppingCart[pos].quantity++
            shoppingCart[pos].subtotal = shoppingCart[pos].price * shoppingCart[pos].quantity
        } else {

            shoppingCart.push({
                id: productFound.id,
                productName: productFound.productName,
                category: productFound.category,
                img: productFound.img,
                price: productFound.price,
                quantity: 1,
            })
        }
        productFound.sell()
        drawProducts(productList)
        localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart))
        localStorage.setItem("productListBackup", JSON.stringify(productList))
        drawShoppingCart(shoppingCart)
    }
    else {
        alert("There are no more units in stock for this item!")
    }
}

function cleanCart() {
    shoppingCart.forEach(productInCart => {
        let productToDelete = productList.find(product => product.id === productInCart.id)
        for (let i = 0; i < productInCart.quantity; i++) {
            productToDelete.return()
        }
    })
    shoppingCart = []
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart))
    localStorage.setItem("productListBackup", JSON.stringify(productList))
    drawShoppingCart(shoppingCart)
    drawProducts(productList)
}

function drawShoppingCart(productsArray) {
    shoppingCartDOM.innerHTML = ""
    let subtotal = 0
    let total = 0
    productsArray.forEach(product => {

        shoppingCartDOM.innerHTML += `
        <div class="card card-cart" style="width: 80%;">

                            <img src="${product.img}" class="card-img-cart card-img-top" alt="...">
                            <div class="card-body">
                                <div>
                                    <h5 class="card-title">${product.productName}</h5>
                                    <p class="card-text">Category: ${product.category}</p>
                                    <h6 class="card-title"><strong>Price per unit: $${product.price}</strong></h6>
                                </div>
                                <div>
                                    <h6 class="card-title"><strong>Quantity:</strong></h6>
                                    <p class="card-text">${product.quantity} units</p>
                                </div>
                                <div>
                                    <h6 class="card-title"><strong>Sub-total: $${product.quantity * product.price}</strong></h6>
                                    <h6 class="card-title"><strong>Total(+tax): $${(product.quantity * product.price * 1.07).toFixed(2)}</strong></h6>
                                </div>
                            </div>

                        </div>
        `
        subtotal += product.quantity * product.price
        total += product.quantity * product.price * 1.07
    })

    shoppingCartDOM.innerHTML += `
                <div class="card" style="width: 80%;">
                <div class="card-body">
                    <div>
                        <h6 class="card-title"><strong>Sub-total:</strong></h6>
                        <p class="card-text">$${subtotal.toFixed(2)}</p>
                    </div>
                    <div>
                        <h6 class="card-title"><strong>Total(+tax):</strong></h6>
                        <p class="card-text">$${total.toFixed(2)}</p>
                    </div>
                </div>
                <a id="clean-cart" class="btn btn-danger">Delete shopping cart!</a>
                <a id="place-order" class="btn btn-success">Place order!</a>
            </div> 
    `

    let button = document.getElementById("place-order")
    button.addEventListener("click", placeOrder)

    button = document.getElementById("clean-cart")
    button.addEventListener("click", cleanCart)
}



function placeOrder(e) {
    alert("Thank you for your purchase!")
    shoppingCart = []
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart))
    localStorage.setItem("productListBackup", JSON.stringify(productList))
    drawShoppingCart(shoppingCart)
    drawProducts(productList)

}

/*Sorting functions*/
let buttonMinMax = document.getElementById("btnMinMax")
buttonMinMax.addEventListener("click", sortMinToMax)

function sortMinToMax() {
    productList.sort(function (a, b) {
        return a.price - b.price
    })
    drawProducts(productList)
}

let buttonMaxMin = document.getElementById("btnMaxMin")
buttonMaxMin.addEventListener("click", sortMaxToMin)

function sortMaxToMin() {
    productList.sort(function (a, b) {
        return b.price - a.price
    })
    drawProducts(productList)
}

let buttonAz = document.getElementById("btnAz")
buttonAz.addEventListener("click", sortAz)

function sortAz() {
    productList.sort(function (a, b) {
        if (a.productName < b.productName) {
            return -1
        }
        if (a.productName > b.productName) {
            return 1
        }
        return 0
    })
    drawProducts(productList)
}

let buttonReset = document.getElementById("btnReset")
buttonReset.addEventListener("click", resetSort)

function resetSort() {
    productList.sort(function (a, b) {
        return a.id - b.id
    })
    drawProducts(productList)
}