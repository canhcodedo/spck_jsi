const getListProducts = () => {
  const url = "http://localhost:3000/products"

  fetch(url)
    .then(response => response.json())
    .then(data => {
        showProductsOnPage(data)

        // Open - Close modals
        document.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", () => {
              document.getElementById("title-form-product").textContent = "Edit product";
              document.querySelector("#edit-product-id").value = btn.dataset.id;

              // update data product to form Edit product
              // const product = products.find(p => p.id == btn.dataset.id);
              // document.querySelector("#edit-product-name").value = product.name;
              // document.querySelector("#edit-product-price").value = product.price;
              // document.querySelector("#edit-product-description").value = product.description;
              syncProductOnFormEditFields(btn);

              document.querySelector(".modal-create-update-product").style.display = "flex";
            });
        });

        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", () => {
              document.querySelector("#delete-product-id").value = btn.dataset.id;
              document.querySelector(".modal-delete").style.display = "flex";
            });
        });


        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-cancel")) {
              document.querySelector(".modal-delete").style.display = "none";
              document.querySelector(".modal-create-update-product").style.display = "none";
              closeFormProduct();
            }
            
            if (e.target.classList.contains("btn-confirm-delete")) {

                // Update state updating for buttons in modal
                e.target.disabled = true;
                e.target.textContent = "Deleting...";

                document.querySelector(".btn-cancel").disabled = true;

                const productId = document.querySelector("#delete-product-id").value;

                fetch(`http://localhost:3000/products/${productId}`, {
                    method: "DELETE"
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    getListProducts();
                })
                .catch(error => {
                    console.error(error);
                })
                .finally(() => {
                  // Reset state buttons
                  e.target.disabled = false;
                  e.target.textContent = "Delete";
                  document.querySelector(".btn-cancel").disabled = false;

                  document.querySelector(".modal-delete").style.display = "none";
                });

            }
        });
    })
    .catch(error => {
      console.error(error)
    })
}

const showProductsOnPage = (products) => {
  const containerProducts = document.querySelector("table");
  
  if (products.length === 0) {
    containerProducts.innerHTML = 
    `
      <tr>
        <td colspan="5" style="text-align: center;">No current products. Add more products by click on button 'New'</td>
      </tr>
    `;
    return;
  }
  
  containerProducts.innerHTML = "";

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Price</th>
      <th>Description</th>
      <th>Image</th>
      <th>Action</th>
    </tr>
  `;

  const tbody = document.createElement("tbody");
  
  products.forEach(product => {
    const productRow = document.createElement("tr");

    const productName = document.createElement("td");
    productName.textContent = product.title;

    const productPrice = document.createElement("td");
    productPrice.textContent = product.price;
    
    const productDescription = document.createElement("td");
    productDescription.textContent = product.description;
    
    const productImage = document.createElement("td");
    productImage.innerHTML = `<img class="product-image" src="${product.image}" alt="${product.name}">`;
    
    const productAction = document.createElement("td");
    productAction.classList.add("action-cell");

    const btnEdit = document.createElement("button");
    btnEdit.classList.add("btn-edit")
    btnEdit.dataset.id = product._id;
    btnEdit.innerHTML = `<img class="action-icon" src="./src/img/icon_edit.png" alt="Edit">`;
    
    const btnDelete = document.createElement("button");
    btnDelete.classList.add("btn-delete")
    btnDelete.dataset.id = product._id;
    btnDelete.innerHTML = `<img class="action-icon" src="./src/img/icon_delete.png" alt="Delete">`;

    productAction.appendChild(btnEdit);
    productAction.appendChild(btnDelete);

    productRow.appendChild(productName);
    productRow.appendChild(productPrice);
    productRow.appendChild(productDescription);
    productRow.appendChild(productImage);
    productRow.appendChild(productAction);
    
    tbody.appendChild(productRow);
  });
  
  containerProducts.appendChild(thead);
  containerProducts.appendChild(tbody);
}

getListProducts();


// Trigger open form new product
document.querySelector(".btn-new-product").addEventListener("click", () => {
  document.getElementById("title-form-product").textContent = "Add new product";
  document.querySelector(".modal-create-update-product").style.display = "flex";
});

document.querySelector(".form-product").addEventListener("submit", (e) => {

    const productName = document.querySelector("#product-name").value;
    const productPrice = document.querySelector("#product-price").value;
    const productDescription = document.querySelector("#product-description").value;
    const productImage = document.querySelector("#product-image").files[0];

    e.preventDefault();
    const formData = new FormData();

    formData.append("file", productImage);
    console.log(new Date().toISOString());

    console.log(...formData)

    fetch("http://localhost:3000/upload", {
      method: "POST", 
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("url image upload success to cloudinary", result)


        const idProduct = document.getElementById("edit-product-id").value;
        const title = document.querySelector("#title-form-product").textContent;
        const method = title === "Add new product" ? "POST" : "PUT";
        const url = title === "Add new product" ? "http://localhost:3000/products/" : "http://localhost:3000/products/" + idProduct;

        // fetch api to create new products
        fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: productName,
            price: productPrice,
            description: productDescription,
            image: result.data.secure_url,
          }),
        })
        .then((response) => response.json())
        .then((result) => {
          closeFormProduct();
          getListProducts();
          console.log("Product created successfully!", result)
        })
        .catch((error) => {
          console.error("Error creating product:", error)
        })

      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });

});


function syncProductOnFormEditFields(buttonEditProduct) {
  // get the closet parent tr has buttonEditProduct and then get all td elements inside this tr

  // The closest() method starts at the element itself, then the anchestors (parent, grandparent, ...) until a match is found.
  // The closest() method returns null() if no match is found.
  const tr = buttonEditProduct.closest("tr");

  const tds = tr.querySelectorAll("td");
  
  // get the product id from the first td
  const productName = tds[0].textContent;
  
  // get the product name from the second td
  const productPrice = tds[1].textContent;
  
  // get the product price from the third td
  const productDescription = tds[2].textContent;
  
  // get the product description from the fourth td
  const productImageUrl = tds[3].querySelector("img").src;
  
  // // get the product image from the fifth td
  // const productImage = tds[4].querySelector("img").src;
  
  // set the form values
  document.querySelector("#product-name").value = productName;
  document.querySelector("#product-price").value = productPrice;
  document.querySelector("#product-description").value = productDescription;
  document.querySelector("#preview-image").src = productImageUrl;
  document.querySelector("#preview-image").style.display = "block";
  document.querySelector("#placeholder-upload-image").style.display = "none";
}


// create function to reset form fields after create or update success
function closeFormProduct() {
  document.querySelector("#edit-product-id").value = "";
  document.querySelector("#product-name").value = "";
  document.querySelector("#product-price").value = "";
  document.querySelector("#product-description").value = "";
  document.querySelector("#product-image").value = "";
  document.querySelector("#placeholder-upload-image").style.display = "block";
  document.querySelector("#preview-image").style.display = "none";
  document.querySelector(".modal-create-update-product").style.display = "none";
}


// Upload and show image file
document.getElementById("btn-upload-file").addEventListener("click", function() {
  document.getElementById("product-image").click();
});

document.getElementById("product-image").addEventListener("change", function() {
  const file = this.files[0];
  if (file) {
    document.getElementById("placeholder-upload-image").style.display = "none";

    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById("preview-image").src = e.target.result;
      document.getElementById("preview-image").style.display = "block";
    }
    reader.readAsDataURL(file);
  } else {
    document.getElementById("placeholder-upload-image").style.display = "block";
    document.getElementById("preview-image").src = "";
    document.getElementById("preview-image").style.display = "none";
  }
})

const popUpSuccess = () => {
  ``
}