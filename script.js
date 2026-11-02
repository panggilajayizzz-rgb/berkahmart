// Data produk
const products = [
  { id: 1,  name: "Beras Premium 5 kg",   cat: "Sembako",  price: 72000, icon: "🍚" },
  { id: 2,  name: "Minyak Goreng 1 L",    cat: "Sembako",  price: 18500, icon: "🛢️" },
  { id: 3,  name: "Gula Pasir 1 kg",      cat: "Sembako",  price: 17000, icon: "🧂" },
  { id: 4,  name: "Telur Ayam 1 kg",      cat: "Sembako",  price: 29000, icon: "🥚" },
  { id: 5,  name: "Air Mineral 600 ml",   cat: "Minuman",  price: 3500,  icon: "💧" },
  { id: 6,  name: "Teh Botol 450 ml",     cat: "Minuman",  price: 5500,  icon: "🍵" },
  { id: 7,  name: "Kopi Sachet (10 pcs)", cat: "Minuman",  price: 14000, icon: "☕" },
  { id: 8,  name: "Susu UHT 1 L",         cat: "Minuman",  price: 19500, icon: "🥛" },
  { id: 9,  name: "Mi Instan Goreng",     cat: "Makanan",  price: 3200,  icon: "🍜" },
  { id: 10, name: "Biskuit Kelapa",       cat: "Makanan",  price: 8500,  icon: "🍪" },
  { id: 11, name: "Keripik Singkong",     cat: "Makanan",  price: 9000,  icon: "🥔" },
  { id: 12, name: "Sabun Mandi Batang",   cat: "Kebersihan", price: 4500, icon: "🧼" },
  { id: 13, name: "Deterjen 800 g",       cat: "Kebersihan", price: 21000, icon: "🧺" },
  { id: 14, name: "Pasta Gigi",           cat: "Kebersihan", price: 12500, icon: "🪥" }
];

const rupiah = n => "Rp" + n.toLocaleString("id-ID");
const $ = id => document.getElementById(id);

let cart = {};           // { idProduk: jumlah }
let activeCat = "Semua";
let keyword = "";

// Render filter kategori
function renderFilters() {
  const cats = ["Semua", ...new Set(products.map(p => p.cat))];
  $("filters").innerHTML = cats
    .map(c => `<button class="chip ${c === activeCat ? "active" : ""}" data-cat="${c}">${c}</button>`)
    .join("");
}

// Render produk
function renderProducts() {
  const list = products.filter(p =>
    (activeCat === "Semua" || p.cat === activeCat) &&
    p.name.toLowerCase().includes(keyword)
  );
  $("empty").hidden = list.length > 0;
  $("productGrid").innerHTML = list.map(p => `
    <article class="card">
      <div class="card-img" aria-hidden="true">${p.icon}</div>
      <div class="card-body">
        <span class="card-cat">${p.cat}</span>
        <h3 class="card-name">${p.name}</h3>
        <p class="card-price">${rupiah(p.price)}</p>
        <button class="add" data-id="${p.id}">Tambah ke keranjang</button>
      </div>
    </article>`).join("");
}

// Render keranjang
function renderCart() {
  const ids = Object.keys(cart);
  let total = 0, count = 0;

  $("cartItems").innerHTML = ids.length
    ? ids.map(id => {
        const p = products.find(x => x.id == id);
        const q = cart[id];
        total += p.price * q; count += q;
        return `
          <div class="cart-item">
            <span class="ico">${p.icon}</span>
            <div class="info"><div>${p.name}</div><small>${rupiah(p.price)}</small></div>
            <div class="qty">
              <button data-act="dec" data-id="${id}" aria-label="Kurangi">−</button>
              <span>${q}</span>
              <button data-act="inc" data-id="${id}" aria-label="Tambah">+</button>
            </div>
          </div>`;
      }).join("")
    : `<p class="cart-empty">Keranjang masih kosong. Pilih produk untuk mulai belanja.</p>`;

  $("cartTotal").textContent = rupiah(total);
  $("cartCount").textContent = count;
}

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 2000);
}

function toggleCart(open) {
  $("drawer").classList.toggle("open", open);
  $("overlay").classList.toggle("show", open);
}

// Event
$("filters").addEventListener("click", e => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  activeCat = btn.dataset.cat;
  renderFilters();
  renderProducts();
});

$("search").addEventListener("input", e => {
  keyword = e.target.value.trim().toLowerCase();
  renderProducts();
});

$("productGrid").addEventListener("click", e => {
  const btn = e.target.closest(".add");
  if (!btn) return;
  const id = btn.dataset.id;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  toast("Ditambahkan ke keranjang");
});

$("cartItems").addEventListener("click", e => {
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  const id = btn.dataset.id;
  cart[id] += btn.dataset.act === "inc" ? 1 : -1;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
});

$("openCart").addEventListener("click", () => toggleCart(true));
$("closeCart").addEventListener("click", () => toggleCart(false));
$("overlay").addEventListener("click", () => toggleCart(false));
document.addEventListener("keydown", e => { if (e.key === "Escape") toggleCart(false); });

$("checkout").addEventListener("click", () => {
  if (!Object.keys(cart).length) return toast("Keranjang masih kosong");
  cart = {};
  renderCart();
  toggleCart(false);
  toast("Pesanan diterima. Terima kasih sudah berbelanja!");
});

// Mulai
renderFilters();
renderProducts();
renderCart();
