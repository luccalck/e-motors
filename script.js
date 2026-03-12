document.addEventListener('DOMContentLoaded', () => {
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart-btn')) return;
      const link = card.getAttribute('data-link');
      if (link) window.location.href = link;
    });
  });

  const slides = document.querySelectorAll('.carousel-slide');
  let currentSlide = 0;
  if (slides.length > 0) {
    const nextSlide = () => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    };
    setInterval(nextSlide, 5000);
  }

  let cart = [];
  const cartOverlay = document.getElementById('cartOverlay');
  const btnOpenCart = document.getElementById('cartButton');
  const btnCloseCart = document.getElementById('closeCart');
  const cartList = document.getElementById('cartList');
  const cartCount = document.getElementById('cartCount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTotal = document.getElementById('cartTotal');
  const btnCheckout = document.getElementById('checkoutButton');
  const btnsAddToCart = document.querySelectorAll('.add-to-cart-btn');

  const formatCurrency = (value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const loadCart = () => {
    try {
      const stored = localStorage.getItem("emotors:cart");
      if (stored) cart = JSON.parse(stored);
    } catch (e) {}
  };

  const saveCart = () => localStorage.setItem("emotors:cart", JSON.stringify(cart));

  const updateCartUI = () => {
    if (!cartCount) return; 
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    cartList.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartList.innerHTML = `<li class="cart-empty-msg">Sua garagem está vazia 🛵</li>`;
    } else {
      cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "cart-item";
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        li.innerHTML = `
          <img class="cart-item__image" src="${item.image}" alt="${item.name}">
          <div class="cart-item__info">
            <strong>${item.name}</strong>
            <span>${formatCurrency(item.price)}</span>
            <div class="cart-qty">
              <button type="button" class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
              <span>${item.quantity}</span>
              <button type="button" class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
            </div>
          </div>
          <div class="cart-item__actions">
            <strong>${formatCurrency(itemTotal)}</strong>
            <button type="button" class="remove-btn" onclick="removeItem(${index})">Remover</button>
          </div>
        `;
        cartList.appendChild(li);
      });
    }

    if (cartSubtotal) cartSubtotal.textContent = formatCurrency(total);
    if (cartTotal) cartTotal.textContent = formatCurrency(total);
    saveCart();
  };

  window.changeQty = (index, delta) => {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCartUI();
  };

  window.removeItem = (index) => {
    cart.splice(index, 1);
    updateCartUI();
  };

  const openCart = () => cartOverlay.classList.add('is-visible');
  const closeCart = () => cartOverlay.classList.remove('is-visible');

  if (btnOpenCart) btnOpenCart.addEventListener('click', openCart);
  if (btnCloseCart) btnCloseCart.addEventListener('click', closeCart);
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) closeCart();
    });
  }

  btnsAddToCart.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      const image = btn.getAttribute('data-image');

      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, price, image, quantity: 1 });
      }

      updateCartUI();
      openCart();
    });
  });

  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      if (cart.length === 0) return;
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      alert(`Processando a reserva do seu veículo no valor de ${formatCurrency(total)}... \nObrigado por escolher a E-Motors!`);
      cart = [];
      updateCartUI();
      closeCart();
    });
  }

  window.addEventListener("storage", (e) => {
    if (e.key === "emotors:cart") {
      loadCart();
      updateCartUI();
    }
  });

  loadCart();
  updateCartUI();
});

window.changeMainImage = (thumbnail) => {
  const gallery = thumbnail.closest('.detail-gallery');
  const mainImg = gallery.querySelector('.detail-image img');
  mainImg.src = thumbnail.src;
  
  const thumbs = gallery.querySelectorAll('.thumbnail');
  thumbs.forEach(t => t.classList.remove('active'));
  thumbnail.classList.add('active');
};
