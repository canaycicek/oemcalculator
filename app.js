// Storage Controller
const StorageController = (function (){
    


})();

// Product Controller
const ProductController = (function (){
    
    // private
    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        products : [],
        selectedProduct: null,
        totalPrice: 0
    }

    // public
    return{
        getProducts: function () {
            return data.products;
        },
        getData: function () {
            return data;
        },
        getProductById: function(id) {
            let product = null;

            data.products.forEach(function(prd) {
                if(prd.id == id){
                    product = prd
                }
            });

            return product
        },
        setCurrentProduct : function(product) {
            data.selectedProduct = product
        },
        getCurrentProduct : function() {
            return data.selectedProduct
        },
        addProduct: function (name, price) {
            let id;

            if(data.products.length > 0){
                id = data.products[data.products.length - 1].id + 1;
            }else{
                id = 1;
            }

            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);
            return newProduct
        },
        updateProduct : function(name, price) {
            let product = null;

            data.products.forEach(function(prd){
                if(prd.id == data.selectedProduct.id){
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd
                }
            })

            return product
        },
        deleteProduct : function(product) {
            data.products.forEach(function(prd, index) {
                if(prd.id == product.id ){
                    data.products.splice(index,1)
                }
            })
        },
        getTotal : function() {
            let total = 0;

            data.products.forEach(function(product) {
                total += product.price;
            });

            data.totalPrice = total;
            return data.totalPrice;
        }
    }
})();


// UI Controller
const UIController = (function (){

    const Selectors = {
        productList : "#item-list",
        productListItems : "#item-list tr",
        productName : "#productName",
        productPrice : "#productPrice",
        addBtn : ".addBtn",
        list : ".list",
        total : ".total",
        totalTl : "#total-tl",
        totalDolar : "#total-dolar",
        saveBtn : ".saveBtn",
        deleteBtn : ".deleteBtn",
        cancelBtn : ".cancelBtn",
        changeBtn : ".changeBtn"
    }
    
    return {
        createProductList: function (products) {
            let html = ``
            
            products.forEach(prd => {
                html += `
                    <tr>
                        <th>${prd.id}</th>
                        <td>${prd.name}</td>
                        <td>${prd.price} $</td>
                        <td class="text-right">
                            <i class="far fa-edit"></i>
                        </td>
                    </tr>
                `
            });
            

            document.querySelector(Selectors.productList).innerHTML = html;
        },

        getSelectors : function () {
            return Selectors;
        },

        addProduct : function (prd) {
            var item = `
                <tr>
                    <th>${prd.id}</th>
                    <td>${prd.name}</td>
                    <td>${prd.price} $</td>
                    <td class="text-right">
                        <i class="far fa-edit" style="cursor:pointer;"></i>
                    </td>
                </tr>
            `;
            document.querySelector(Selectors.productList).innerHTML += item
        },

        updateProduct: function(prd) {
            
            let updatedItem = null;

            let items = document.querySelectorAll(Selectors.productListItems)
            items.forEach(function(item) {
                if(item.classList.contains("bg-warning")){
                    item.children[1].textContent = prd.name
                    item.children[2].textContent = prd.price + " $";
                    updatedItem = item
                }
            })

            return updatedItem

        },

        clearInputs : function () {
            document.querySelector(Selectors.productName).value = "";
            document.querySelector(Selectors.productPrice).value = "";
        },

        clearWarnings : function() {
            const list = document.querySelectorAll(Selectors.productListItems)
            list.forEach(function(tr){
                if(tr.contains("bg-warning")){
                    tr.classList.remove("bg-warning")
                }
            });
        },

        clearItem : function (item) {
            document.querySelector(item).classList.add("d-none")
        },

        addItem : function (item) {
            document.querySelector(item).classList.remove("d-none")
        },

        showTotal : function(total) {
            document.querySelector(Selectors.totalDolar).textContent = total
            document.querySelector(Selectors.totalTl).textContent = total * 28,26 
        },

        addProductToForm: function() {
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name
            document.querySelector(Selectors.productPrice).value = selectedProduct.price
        },

        deleteProduct: function () {
            let items = document.querySelectorAll(Selectors.productListItems)
            items.forEach(function(item){
                if(item.classList.contains("bg-warning")){
                    item.remove()
                }
            });
        },

        addingState : function () {
            UIController.clearInputs()
            document.querySelector(Selectors.addBtn).style.display = "inline";
            document.querySelector(Selectors.saveBtn).style.display = "none";
            document.querySelector(Selectors.deleteBtn).style.display = "none";
            document.querySelector(Selectors.cancelBtn).style.display = "none";
        },

        editState : function (tr) {

            const parent = tr.parentNode;

            for(let i = 0; i < parent.children.length; i++){
                parent.children[i].classList.remove("bg-warning")
            }
 
            tr.classList.add("bg-warning")
            document.querySelector(Selectors.addBtn).style.display = "none";
            document.querySelector(Selectors.saveBtn).style.display = "inline";
            document.querySelector(Selectors.deleteBtn).style.display = "inline";
            document.querySelector(Selectors.cancelBtn).style.display = "inline";
        }
    }
})();


// App Controller
const App = (function (ProductCtrl, UICtrl){

    const UISelectors = UIController.getSelectors()
    
    // load Event Listeners
    const loadEventListeners = function () {
        // add product event
        document.querySelector(UISelectors.addBtn).addEventListener("click", productAddSubmit)

        // edit product click
        document.querySelector(UISelectors.productList).addEventListener("click", productEditClick)

        // edit product submit
        document.querySelector(UISelectors.saveBtn).addEventListener("click", editProductSubmit)

        // cancel button click
        document.querySelector(UISelectors.cancelBtn).addEventListener("click", cancelUpdate)

        document.querySelector(UISelectors.deleteBtn).addEventListener("click", deleteProductSubmit)
    }
    
    const productAddSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value
        const productPrice = document.querySelector(UISelectors.productPrice).value

        if(productName !== "" && productPrice !== ""){
            // add product
            const newProduct = ProductCtrl.addProduct(productName, productPrice)
            UICtrl.addItem(UISelectors.list)
            UICtrl.addItem(UISelectors.total)

            // add item to list
            UIController.addProduct(newProduct)

            // get total
            let total = ProductController.getTotal()

            // show total
            UICtrl.showTotal(total)

            // clear inputs
            UIController.clearInputs()

        }else{
            alert ("Hata!!")
        }



        e.preventDefault()
    }

    const productEditClick = function(e) {
        

        if(e.target.matches("i")){


            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent

            let tr = e.target.parentNode.parentNode;

            // get selected product
            const product = ProductCtrl.getProductById(id)

            // set  current product
            ProductCtrl.setCurrentProduct(product)

            // add product to UI
            UICtrl.addProductToForm()


            UICtrl.editState(tr)
        }

        e.preventDefault()
    }

    const editProductSubmit = function(e) {
        
        const productName = document.querySelector(UISelectors.productName).value
        const productPrice = document.querySelector(UISelectors.productPrice).value

        if(productName !== "" && productPrice !== ""){
            // update product
            const updatedProduct = ProductCtrl.updateProduct(productName, productPrice)

            // update ui
            let item = UICtrl.updateProduct(updatedProduct)
            
            // get total
            let total = ProductController.getTotal()

            // show total
            UICtrl.showTotal(total)

            UICtrl.clearWarnings()
            UICtrl.addingState(item)
        }

        e.preventDefault()
    }

    const cancelUpdate = function (e) {
        
        UICtrl.clearWarnings()
        UICtrl.addingState()
        
        e.preventDefault()
    }

    const deleteProductSubmit = function(e) {
     
        // get selected product
        const selectedProduct = ProductCtrl.getCurrentProduct()

        // delete product
        ProductCtrl.deleteProduct(selectedProduct)
        
        // delete ui
        UICtrl.deleteProduct()

        // get total
        let total = ProductController.getTotal()

        // show total
        UICtrl.showTotal(total)

        UICtrl.addingState()

        let data = ProductCtrl.getData().products
        if(data.length == 0){
            UICtrl.clearItem(UISelectors.list)
            UICtrl.clearItem(UISelectors.total)
        }

        e.preventDefault()
    }

    return {
        init: function () {
            console.log("starting app...");

            UICtrl.clearWarnings()
            UICtrl.addingState();
            const products = ProductController.getProducts()

            if(products.length == 0){
                UIController.clearItem(UISelectors.list)
                UIController.clearItem(UISelectors.total)
            }else{
                UIController.addItem(UISelectors.list)
                UIController.addItem(UISelectors.total)
            }

            // load event listeners
            loadEventListeners()
        }
    }


})(ProductController, UIController);

App.init()