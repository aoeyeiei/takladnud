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
const facilityCards = document.querySelector("#facility-cards");
const foodRecommendations = document.querySelector("#food-recommendations");
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
    foodRecommendations.replaceChildren();
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "เพิ่มตลาดก่อน แล้วร้านแนะนำจะแสดงที่นี่";
    foodRecommendations.append(empty);
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
  else marketList.querySelector(".market-item").click();
}

async function loadMap(code) {
  const query = new URLSearchParams({ booking_date: mapDate.value });
  const [{ data }, shopsResponse, recommendationsResponse] = await Promise.all([
    api(`/public/markets/${encodeURIComponent(code)}/map?${query}`),
    api(`/public/markets/${encodeURIComponent(code)}/shops?booking_date=${encodeURIComponent(mapDate.value)}&limit=50`),
    api(`/public/markets/${encodeURIComponent(code)}/recommendations?booking_date=${encodeURIComponent(mapDate.value)}`)
  ]);
  marketTitle.textContent = data.market.name;
  marketAddress.textContent = data.market.address || "เลือกแผงเพื่อดูร้านที่เปิดจอง";
  mapArea.replaceChildren();
  mapArea.classList.add("has-layout");
  mapArea.innerHTML = '<div class="map-decoration map-title-tag">TAKHLADNAT · MARKET GUIDE</div><div class="map-decoration map-north">N ↑</div><div class="map-park"><span>สวนเล็ก · พักใจ</span></div><div class="map-zone-label zone-food">FOOD LANE</div><div class="map-zone-label zone-craft">LOCAL GOODS</div><div class="map-decoration map-gate">ประตูทางเข้าหลัก ✿</div>';
  const booths = data.booths;
  if (!booths.length) {
    const empty = document.createElement("div");
    empty.className = "map-empty";
    empty.innerHTML = '<span class="empty-illustration">⌖</span><h3>ยังไม่มีแผงในแผนผัง</h3><p>โปรดเพิ่มข้อมูลแผงตลาดก่อนเปิดให้จอง</p>';
    mapArea.append(empty);
  } else {
    booths.forEach((booth, index) => {
      const button = document.createElement("button");
      button.className = `booth ${booth.status === "confirmed" ? "booked" : booth.status === "unavailable" ? "unavailable" : ""}`;
      button.textContent = booth.booth_code;
      button.dataset.boothCode = booth.booth_code;
      button.title = booth.shop_name ? `${booth.booth_code} · ${booth.shop_name}` : `${booth.booth_code} · ${booth.status === "available" ? "ว่าง" : "ปิดใช้งาน"}`;
      const x = booth.map_x == null ? 10 + (index % 6) * 14 : Number(booth.map_x);
      const y = booth.map_y == null ? 12 + Math.floor(index / 6) * 18 : Number(booth.map_y);
      button.style.left = `${Math.max(2, Math.min(92, x))}%`;
      button.style.top = `${Math.max(2, Math.min(88, y))}%`;
      button.addEventListener("click", () => showToast(booth.shop_name ? `${booth.booth_code} · ${booth.shop_name}` : `${booth.booth_code} · ${booth.status === "available" ? "แผงว่าง" : "ปิดใช้งาน"}`));
      mapArea.append(button);
    });
  }
  renderFacilities(data.facilities || []);
  renderShopCards(shopsResponse.data);
  renderFoodRecommendations(recommendationsResponse.data, code);
}

function renderFoodRecommendations(recommendations, marketCode) {
  foodRecommendations.replaceChildren();
  if (!recommendations.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "ยังไม่มีร้านอาหารแนะนำในตลาดนี้";
    foodRecommendations.append(empty);
    return;
  }

  recommendations.forEach((recommendation, index) => {
    const card = document.createElement("article");
    card.className = "food-card";
    const imageWrap = document.createElement("div");
    imageWrap.className = "food-image-wrap";
    const image = document.createElement("img");
    image.src = recommendation.image_path;
    image.alt = `ภาพอาหารจาก ${recommendation.name}`;
    image.loading = index < 2 ? "eager" : "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      imageWrap.classList.add("food-image-fallback");
      image.remove();
    }, { once: true });
    const badge = document.createElement("span");
    badge.className = "food-badge";
    badge.textContent = "แนะนำ";
    imageWrap.append(image, badge);

    const details = document.createElement("div");
    details.className = "food-details";
    const category = document.createElement("p");
    category.className = "food-category";
    category.textContent = recommendation.cuisine;
    const title = document.createElement("h3");
    title.textContent = recommendation.name;
    const description = document.createElement("p");
    description.className = "food-description";
    description.textContent = recommendation.description;
    const footer = document.createElement("div");
    footer.className = "food-card-footer";
    const price = document.createElement("span");
    price.className = "food-price";
    price.textContent = recommendation.price_label || `แผง ${recommendation.booth_code}`;
    const locate = document.createElement("button");
    locate.className = "food-locate";
    locate.type = "button";
    locate.textContent = `แผง ${recommendation.booth_code} · ดูแผนที่ →`;
    locate.addEventListener("click", async () => {
      if (!selectedMarket || selectedMarket.public_code !== marketCode) {
        const marketIndex = markets.findIndex((market) => market.public_code === marketCode);
        selectedMarket = markets[marketIndex];
        marketList.querySelectorAll(".market-item").forEach((item, itemIndex) => {
          item.classList.toggle("selected", itemIndex === marketIndex);
        });
        await loadMap(marketCode);
      }
      document.querySelector("#markets").scrollIntoView({ behavior: "smooth" });
      const booth = [...mapArea.querySelectorAll(".booth")].find((item) => item.dataset.boothCode === recommendation.booth_code);
      if (booth) {
        booth.classList.add("booth-highlight");
        booth.focus({ preventScroll: true });
        setTimeout(() => booth.classList.remove("booth-highlight"), 1800);
      }
    });
    footer.append(price, locate);
    details.append(category, title, description, footer);
    if (recommendation.is_demo) {
      const demo = document.createElement("span");
      demo.className = "demo-food-label";
      demo.textContent = "ตัวอย่างร้านในตลาดสาธิต";
      details.append(demo);
    }
    card.append(imageWrap, details);
    foodRecommendations.append(card);
  });
}

function renderFacilities(facilities) {
  facilityCards.replaceChildren();
  facilities.forEach((facility) => {
    const isParking = facility.facility_type.startsWith("parking_");
    const available = Math.max(0, Number(facility.available_count));
    const pin = document.createElement("button");
    pin.className = `facility-pin ${isParking ? "parking" : "seating"}`;
    pin.style.left = `${Number(facility.map_x) || 50}%`;
    pin.style.top = `${Number(facility.map_y) || 50}%`;
    const icon = document.createElement("strong");
    icon.textContent = isParking ? "P" : "⌂";
    const label = document.createElement("span");
    const name = document.createElement("b"); name.textContent = facility.name;
    const count = document.createElement("small");
    count.textContent = facility.status === "closed" ? "ปิดให้บริการ" : `ว่าง ${available}/${facility.capacity} ${isParking ? "คัน" : "ที่นั่ง"}`;
    label.append(name, count); pin.append(icon, label);
    pin.addEventListener("click", () => showToast(`${facility.name} · ${facility.location_label || ""} · ${count.textContent}`));
    mapArea.append(pin);

    const card = document.createElement("article");
    card.className = `facility-card ${isParking ? "parking" : "seating"}`;
    const type = document.createElement("span");
    type.className = "facility-type";
    type.textContent = isParking ? (facility.facility_type === "parking_car" ? "PARKING · CAR" : "PARKING · MOTORCYCLE") : "DINING · SEATING";
    const title = document.createElement("h4"); title.textContent = facility.name;
    const location = document.createElement("p"); location.textContent = `${facility.location_label || ""} · ${facility.description || ""}`;
    const capacity = document.createElement("p"); capacity.className = "capacity-line";
    capacity.textContent = facility.status === "closed" ? "ปิดให้บริการ" : `เหลือ ${available} ${isParking ? "ที่จอด" : "ที่นั่ง"} จาก ${facility.capacity}`;
    card.append(type, title, location, capacity);
    facilityCards.append(card);
  });
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
  foodRecommendations.replaceChildren();
  const message = document.createElement("p");
  message.className = "muted";
  message.textContent = "โหลดร้านแนะนำไม่สำเร็จ กรุณาลองใหม่";
  foodRecommendations.append(message);
  showToast("เชื่อมต่อข้อมูลตลาดไม่สำเร็จ");
});
api("/auth/me").then(({ data }) => { currentShop = data; document.querySelector("#account-button").textContent = data.name; }).catch(() => {});
