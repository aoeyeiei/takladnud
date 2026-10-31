const api = (path, options = {}) => fetch(`/api/v1${path}`, {
  credentials: "same-origin",
  headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  ...options
}).then(async (response) => {
  if (response.status === 204) return null;
  const body = await response.json();
  if (!response.ok) throw new Error(body.error?.message || "ดำเนินการไม่สำเร็จ");
  return body;
});

const marketList = document.querySelector("#market-list");
const mapArea = document.querySelector("#map-area");
const shopCards = document.querySelector("#shop-cards");
const marketTitle = document.querySelector("#market-title");
const marketAddress = document.querySelector("#market-address");
const mapDate = document.querySelector("#map-date");
const categoryFilter = document.querySelector("#category-filter");
const searchInput = document.querySelector("#shop-search");
const dialog = document.querySelector("#auth-dialog");
const authForm = document.querySelector("#auth-form");
let markets = [];
let selectedMarket = null;
let authMode = "login";
let searchTimer;
let currentShop = null;
const shopDialog = document.querySelector("#shop-dialog");

const localDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
mapDate.value = localDate();

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2800);
}

function openAuth(mode = "login") {
  authMode = mode;
  document.querySelectorAll("[data-auth-tab]").forEach((tab) => tab.classList.toggle("active", tab.dataset.authTab === mode));
  document.querySelector(".register-fields").classList.toggle("hidden", mode !== "register");
  document.querySelector("#auth-title").textContent = mode === "login" ? "ยินดีต้อนรับกลับ" : "เริ่มต้นเป็นร้านค้า";
  authForm.querySelector("[type=submit]").innerHTML = mode === "login" ? "เข้าสู่ระบบ <span>→</span>" : "สมัครร้านค้า <span>→</span>";
  authForm.elements.password.autocomplete = mode === "login" ? "current-password" : "new-password";
  document.querySelector("#auth-message").textContent = "";
  dialog.showModal();
}

document.querySelector(".password-toggle").addEventListener("click", (event) => {
  const input = authForm.elements.password;
  input.type = input.type === "password" ? "text" : "password";
  event.currentTarget.textContent = input.type === "password" ? "แสดงรหัสผ่าน" : "ซ่อนรหัสผ่าน";
});
document.querySelector("#account-button").addEventListener("click", () => currentShop ? openShopPanel() : openAuth());
document.querySelector("#hero-shop-login").addEventListener("click", () => openAuth());
document.querySelector("#cta-login").addEventListener("click", () => openAuth());
document.querySelectorAll("[data-auth-tab]").forEach((tab) => tab.addEventListener("click", () => openAuth(tab.dataset.authTab)));

document.querySelector("#auth-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(authForm);
  const payload = { email: form.get("email"), password: form.get("password") };
  if (authMode === "register") {
    if (form.get("password") !== form.get("password_confirm")) return document.querySelector("#auth-message").textContent = "รหัสผ่านและการยืนยันไม่ตรงกัน";
    payload.contact_name = form.get("contact_name");
    payload.phone = form.get("phone");
    payload.shop = { name: form.get("shop_name"), category_id: Number(form.get("category_id")) };
    if (!payload.shop.category_id) return document.querySelector("#auth-message").textContent = "กรุณาเลือกหมวดหมู่ร้าน";
  }
  const submit = authForm.querySelector("[type=submit]");
  submit.disabled = true;
  try {
    const result = await api(`/auth/${authMode === "login" ? "login" : "register"}`, { method: "POST", body: JSON.stringify(payload) });
    dialog.close();
    submit.disabled = false;
    currentShop = result.data;
    document.querySelector("#account-button").textContent = result.data.name;
    showToast(authMode === "login" ? "เข้าสู่ระบบแล้ว" : "สมัครร้านค้าสำเร็จ");
    if (selectedMarket) await loadMap(selectedMarket.public_code);
    await openShopPanel();
  } catch (error) {
    document.querySelector("#auth-message").textContent = error.message;
    submit.disabled = false;
  }
});

async function loadCategories() {
  const { data } = await api("/public/categories");
  data.forEach((category) => {
    const option = new Option(category.name, category.id);
    categoryFilter.add(option.cloneNode(true));
    document.querySelector("#register-category").add(option.cloneNode(true));
    document.querySelector("#profile-category").add(new Option(category.name, category.id));
  });
}

async function loadMarkets() {
  const { data } = await api("/public/markets");
  markets = data;
  marketList.replaceChildren();
  if (!markets.length) {
    marketList.innerHTML = '<p class="muted">ยังไม่มีข้อมูลตลาดในระบบ<br>แผนผังจะพร้อมแสดงเมื่อมีการตั้งค่าตลาดและแผง</p>';
    return;
  }
  markets.forEach((market) => {
    const button = document.createElement("button");
    button.className = "market-item";
    button.innerHTML = `<span class="market-marker">⌖</span><span><b></b><small></small></span>`;
    button.querySelector("b").textContent = market.name;
    button.querySelector("small").textContent = market.address || "ตลาดชุมชน";
    button.addEventListener("click", () => {
      selectedMarket = market;
      document.querySelectorAll(".market-item").forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      loadMap(market.public_code);
    });
    marketList.append(button);
  });
  const requestedCode = new URLSearchParams(window.location.search).get("market");
  const requestedIndex = markets.findIndex((market) => market.public_code === requestedCode);
  if (requestedIndex >= 0) marketList.querySelectorAll(".market-item")[requestedIndex].click();
  else if (markets.length === 1) marketList.querySelector(".market-item").click();
}

async function loadMap(code) {
  const query = new URLSearchParams({ booking_date: mapDate.value });
  const [{ data }, shopsResponse] = await Promise.all([
    api(`/public/markets/${encodeURIComponent(code)}/map?${query}`),
    api(`/public/markets/${encodeURIComponent(code)}/shops?booking_date=${encodeURIComponent(mapDate.value)}&limit=50`)
  ]);
  marketTitle.textContent = data.market.name;
  marketAddress.textContent = data.market.address || "เลือกแผงเพื่อดูร้านที่เปิดจอง";
  mapArea.replaceChildren();
  const booths = data.booths;
  if (!booths.length) {
    mapArea.innerHTML = '<div class="map-empty"><span class="empty-illustration">⌖</span><h3>ยังไม่มีแผงในแผนผัง</h3><p>โปรดเพิ่มข้อมูลแผงตลาดก่อนเปิดให้จอง</p></div>';
  } else {
    booths.forEach((booth, index) => {
      const button = document.createElement("button");
      button.className = `booth ${booth.status === "confirmed" ? "booked" : booth.status === "unavailable" ? "unavailable" : ""}`;
      button.textContent = booth.booth_code;
      button.title = booth.shop_name ? `${booth.booth_code} · ${booth.shop_name}` : `${booth.booth_code} · ${booth.status === "available" ? "ว่าง" : "ปิดใช้งาน"}`;
      const x = booth.map_x == null ? 10 + (index % 6) * 14 : Number(booth.map_x);
      const y = booth.map_y == null ? 12 + Math.floor(index / 6) * 18 : Number(booth.map_y);
      button.style.left = `${Math.max(2, Math.min(92, x))}%`;
      button.style.top = `${Math.max(2, Math.min(88, y))}%`;
      button.addEventListener("click", () => showToast(booth.shop_name ? `${booth.booth_code} · ${booth.shop_name}` : `${booth.booth_code} · ${booth.status === "available" ? "แผงว่าง" : "ปิดใช้งาน"}`));
      mapArea.append(button);
    });
  }
  renderShopCards(shopsResponse.data);
}

function renderShopCards(shops) {
  shopCards.replaceChildren();
  shops.forEach((shop) => {
    const card = document.createElement("article");
    card.className = "shop-card";
    const title = document.createElement("b");
    title.textContent = shop.name;
    const detail = document.createElement("span");
    detail.textContent = `${shop.category_name || "ร้านค้า"} · แผง ${shop.booth_code}`;
    card.append(title, detail);
    shopCards.append(card);
  });
}

async function loadShopSearch() {
  if (!selectedMarket) return;
  const params = new URLSearchParams({ booking_date: mapDate.value, q: searchInput.value.trim(), limit: "50" });
  if (categoryFilter.value) params.set("category_id", categoryFilter.value);
  try {
    const { data } = await api(`/public/markets/${encodeURIComponent(selectedMarket.public_code)}/shops?${params}`);
    renderShopCards(data);
  } catch (error) { showToast(error.message); }
}

async function openShopPanel() {
  shopDialog.showModal();
  const marketSelect = document.querySelector("#booking-market");
  marketSelect.replaceChildren(new Option("เลือกตลาด", ""));
  markets.forEach((market) => marketSelect.add(new Option(market.name, market.id)));
  document.querySelector("#booking-date").value = localDate();
  try {
    const [{ data: profile }, bookings] = await Promise.all([api("/shop/profile"), api("/bookings?limit=30")]);
    currentShop = profile;
    const form = document.querySelector("#profile-form");
    Object.entries({ name: profile.name, category_id: profile.category_id || "", description: profile.description || "", public_phone: profile.public_phone || "", public_contact: profile.public_contact || "" }).forEach(([key, value]) => { form.elements[key].value = value; });
    form.elements.is_published.checked = Boolean(profile.is_published);
    const list = document.querySelector("#booking-list");
    list.replaceChildren();
    if (!bookings.data.length) list.innerHTML = '<p class="muted">ยังไม่มีรายการจอง</p>';
    bookings.data.forEach((booking) => {
      const row = document.createElement("div"); row.className = "booking-row";
      const detail = document.createElement("span"); detail.textContent = `${booking.market_name} · แผง ${booking.booth_code} · ${booking.booking_date} · ${booking.status === "confirmed" ? "จองแล้ว" : "ยกเลิกแล้ว"}`;
      row.append(detail);
      if (booking.status === "confirmed") {
        const cancel = document.createElement("button"); cancel.textContent = "ยกเลิก";
        cancel.addEventListener("click", async () => { try { await api(`/bookings/${booking.id}/cancel`, { method: "POST", body: "{}" }); showToast("ยกเลิกการจองแล้ว"); await openShopPanel(); if (selectedMarket) loadMap(selectedMarket.public_code); } catch (error) { showToast(error.message); } });
        row.append(cancel);
      }
      list.append(row);
    });
  } catch (error) { showToast(error.message); }
}

async function loadBookingBooths() {
  const marketId = document.querySelector("#booking-market").value;
  const date = document.querySelector("#booking-date").value;
  const area = document.querySelector("#booking-booths");
  area.replaceChildren();
  if (!marketId || !date) return;
  try {
    const { data } = await api(`/markets/${marketId}/booths?booking_date=${encodeURIComponent(date)}`);
    if (!data.length) { area.innerHTML = '<p class="muted">ตลาดนี้ยังไม่มีข้อมูลแผง</p>'; return; }
    data.forEach((booth) => {
      const button = document.createElement("button");
      button.className = "booth-choice";
      button.textContent = `${booth.booth_code} · ${booth.status === "available" ? "ว่าง" : booth.status === "confirmed" ? "จองแล้ว" : "ปิด"}`;
      button.disabled = booth.status !== "available";
      button.addEventListener("click", async () => {
        button.disabled = true;
        try {
          await api("/bookings", { method: "POST", body: JSON.stringify({ market_id: Number(marketId), booth_id: booth.id, booking_date: date }) });
          showToast(`จองแผง ${booth.booth_code} สำเร็จ`);
          await loadBookingBooths();
          await openShopPanel();
          if (selectedMarket) loadMap(selectedMarket.public_code);
        } catch (error) { showToast(error.message); await loadBookingBooths(); }
      });
      area.append(button);
    });
  } catch (error) { area.textContent = error.message; }
}

document.querySelector("#booking-market").addEventListener("change", loadBookingBooths);
document.querySelector("#booking-date").addEventListener("change", loadBookingBooths);
document.querySelector("#profile-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const body = { name: form.elements.name.value, category_id: Number(form.elements.category_id.value) || null, description: form.elements.description.value, public_phone: form.elements.public_phone.value, public_contact: form.elements.public_contact.value, is_published: form.elements.is_published.checked };
  try { await api("/shop/profile", { method: "PATCH", body: JSON.stringify(body) }); showToast("บันทึกข้อมูลร้านแล้ว"); }
  catch (error) { showToast(error.message); }
});
document.querySelector("#logout-button").addEventListener("click", async () => {
  try { await api("/auth/logout", { method: "POST", body: "{}" }); currentShop = null; shopDialog.close(); document.querySelector("#account-button").textContent = "เข้าสู่ระบบร้านค้า ↗"; showToast("ออกจากระบบแล้ว"); }
  catch (error) { showToast(error.message); }
});

mapDate.addEventListener("change", () => selectedMarket && loadMap(selectedMarket.public_code).catch((error) => showToast(error.message)));
categoryFilter.addEventListener("change", loadShopSearch);
searchInput.addEventListener("input", () => { clearTimeout(searchTimer); searchTimer = setTimeout(loadShopSearch, 250); });

Promise.all([loadCategories(), loadMarkets()]).catch((error) => {
  marketList.innerHTML = `<p class="muted">${error.message}</p>`;
  showToast("เชื่อมต่อข้อมูลตลาดไม่สำเร็จ");
});
api("/auth/me").then(({ data }) => { currentShop = data; document.querySelector("#account-button").textContent = data.name; }).catch(() => {});
