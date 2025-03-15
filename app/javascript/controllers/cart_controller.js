import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="cart"
export default class extends Controller {
  initialize() {
    console.log("cart controller initialized");
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart) {
      return;
    }

    //for (const item of cart) <=>
    //for (let i = 0; i < cart.length; i++) {
    //const item = cart[i] }
    let total = 0;
    for (const item of cart) {
      total += item.price * item.quantity;

      // Tạo div chứa thông tin sản phẩm
      const div = document.createElement("div");
      div.classList.add("mt-2", "p-2", "border", "rounded");

      div.innerText = `Item: ${item.name} - $${item.price / 100.0} - Size: ${item.size} - Quantity: ${item.quantity}`;

      // Nút xóa sản phẩm
      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Remove";
      deleteButton.value = item.id;
      deleteButton.classList.add("btn", "btn-danger", "btn-sm", "ms-2");
      deleteButton.addEventListener("click", this.removeFromCart);

      div.appendChild(deleteButton);
      this.element.prepend(div);
    }

    // Hiển thị tổng tiền
    const totalEl = document.createElement("div");
    totalEl.classList.add("fw-bold", "mt-3", "mb-3");
    totalEl.innerText = `Total: $${total / 100.0}`;

    let totalContainer = document.getElementById("total");
    totalContainer.appendChild(totalEl);
  }

  clear() {
    localStorage.removeItem("cart") 
    window.location.reload()
  }

  removeFromCart(even) {
    const cart = JSON.parse(localStorage.getItem("cart"))
    const id = even.target.value
    const index = cart.findIndex(item => id.id === id)
    cart.splice(index, 1)
    localStorage.setItem("cart", JSON.stringify(cart))
    window.location.reload()
  }

  checkout() {
    console.log("checkout");
    const cart = JSON.parse(localStorage.getItem("cart"))
    const payload = {
      authenticity_token: "",
      cart: cart
    }

    const csrfToken = document.querySelector("meta[name='csrf-token']").content

    fetch("/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
      },
      body: JSON.stringify(payload)
    }).then(response => {
      if (response.ok) {
          response.json().then(body => {
            window.location.href = body.url
        })
      } else {
        response.json().then(body => {
          const errorEl = document.createElement("div")
          errorEl.innerText = `There was an error processing your order. ${body.error}`
          let errorContainer = document.getElementById("errorContainer")
          errorContainer.appendChild(errorEl)
        })
      }
    })
  }
}
