const handleLogout = async () => {
  try {
    await firebase.auth().signOut()
    localStorage.removeItem("user_session")
    window.location.reload()
  } catch(error) {
    alert("Xảy ra lỗi khi đăng xuất")
    console.error(error)
  }
}

const handleUserSessionOnMenu = () => {
  let user = JSON.parse(localStorage.getItem("user_session"))
  
  const now = new Date().getTime();
  
  const loginBtn = document.getElementById("login-btn")
  const userNamelbl = document.getElementById("user-name-logined")
  const logoutBtn = document.getElementById("logout-btn") 
  
  logoutBtn.addEventListener("click", handleLogout)
  
  if (now < user?.expiry) {
    userNamelbl.innerText = user.user.email
    userNamelbl.classList.remove("hidden")
    logoutBtn.classList.remove("hidden")
    loginBtn.classList.add("hidden")
  } else {
    userNamelbl.classList.add("hidden")
    logoutBtn.classList.add("hidden")
    loginBtn.classList.remove("hidden")
  }
}

handleUserSessionOnMenu()

const getListProducts = () => {
  const url = "http://localhost:3000/products"

  fetch(url)
    .then(response => response.json())
    .then(data => {
      showProductsOnPage(data)
    })
    .catch(error => {
      console.error(error)
    })
}

const resetSearch = (button) => {
  button.disabled = true;
  button.textContent = "Loading...";
  button.classList.add("disable-button");
  getListProducts();
}

const showProductsOnPage = (products, isSearchProduct = false) => {
  const containerProducts = document.querySelector(".products-content");
  
  if (products.length === 0) {
    containerProducts.innerHTML = 
      isSearchProduct 
        ? "<div style='margin: 0 auto; text-align: center;'><strong>No results product found</strong><button style='border: white; color: white; background-color: #2196f3;' onClick='resetSearch(this)'>Reset search</button></div>" 
        : "<strong style='margin: 0 auto; text-align: center;'>No available products now. We will update soon.</strong>";
    return;
  }
  
  containerProducts.innerHTML = "";
  
  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <div class="product-info">
        <strong>${product.title}</strong>
        <p>${product.price} $</p>
      </div>
      <div class="product-action">
        <button class="btn-themvaogio">Them vao gio</button>
        <button class="btn-chitiet">Xem chi tiet</button>
      </div>
    `;
    
    containerProducts.appendChild(productCard);
  });
}

getListProducts();

function debounce(fn, delay) {
  let timer;

  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  }
}


// Searching products
const searchProducts = () => {
  // Show lazy loading when searching products...

  const iconLoading = `
    <svg width='24' height='24' fill="hsl(228, 97%, 42%)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
        <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/>
      </path>
    </svg>
  `;

  document.querySelector(".products-content").innerHTML = `
    <div class="loading-search-product-section">
      ${iconLoading}
      <p>Searching...</p>
    </div>
  `;

  // remove redundant space, convert to lowercase and remove special characters
  const searchInput = document.getElementById("product-search-input").value.trim().toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "");

  console.log("keyword search", searchInput);

  fetch(`http://localhost:3000/products/search?keyword=${searchInput}`)
    .then(response => response.json())
    .then(data => {
      showProductsOnPage(data, true);
    })
    .catch(error => {
      console.error("Search product error on Client side:", error);
      showProductsOnPage([], true);
    });
}

document.getElementById("product-search-input").addEventListener("input", debounce(searchProducts, 500));
document.getElementById("product-search-input").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    debounce(searchProducts, 500);
  }
});

