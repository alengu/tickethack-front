const apiUrl = "https://tickethack-back-gray.vercel.app";

const mock = {
  _id: "67fe7e0178717b35f602e967",
  userID: 123456789,
  status: "pending",
  total: 1500,
  trips: [
    {
      _id: "67fe15b5bbca0f4552734d6b",
      departure: "Paris",
      arrival: "Lyon",
      date: "2025-04-15T08:18:53.726Z",
      price: 60,
    },
    {
      _id: "67fe15b5bbca0f4552734d82",
      departure: "Marseille",
      arrival: "Bruxelles",
      date: "2025-04-15T12:35:03.591Z",
      price: 61,
    },
    {
      _id: "67fe15b5bbca0f4552734d83",
      departure: "Paris",
      arrival: "Lyon",
      date: "2025-04-15T12:38:23.516Z",
      price: 144,
    },
  ],
  __v: 0,
};
const generateTripElement = (trip) => {
  return `
    <div class="trip-row">
        <div class="result-trip">${trip.departure} > ${trip.arrival}</div>
        <div class="result-trip-time">${moment(trip.date).format("HH:MM")}</div>
        <div class="result-trip-price">${trip.price}€</div>
        <button class="delete-trip">X</button>
    </div>`;
};

const generateCartElement = (cart) =>
  cart.trips.reduce((acc, trip) => (acc += generateTripElement(trip)), "");

const hideResults = () => {
  document.querySelector("#cart-section-content-results").style.display =
    "none";

  document.querySelector("#cart-section-content-no-results").style.display =
    "block";
};

const showResults = () => {
  document.querySelector("#cart-section-content-results").style.display =
    "block";

  document.querySelector("#cart-section-content-no-results").style.display =
    "none";
};

const addIdToPurchaseBtn = (id) => {
  document.querySelector("#cart-book-button").setAttribute("cart-id", id);
};

const setTotal = (totalPrice) => {
  document.querySelector("#total").textContent = totalPrice;
};

const getCart = async () => {
  try {
    const responseGetCart = await fetch(`${apiUrl}/carts`);
    //const cart = await responseGetCart.json();
    const cart = mock;

    if (cart.trips.length > 0) {
      document.querySelector("#cart-list").innerHTML =
        generateCartElement(cart);
      setTotal(cart.total);
      addIdToPurchaseBtn(cart._id);
      showResults();
      addEventListenerDelete();
    } else {
      hideResults();
    }
  } catch (e) {
    console.log(e);
    hideResults();
  }
};

async function deleteCart() {
  try {
    const responseDeleteCart = await fetch(`${apiUrl}/carts`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: this.getAttribute("trip-id"),
      }),
    });

    await responseDeleteCart.json();
    document.location.href = "bookings.html";
  } catch (e) {
    console.log(e);
  }
}

const addEventListenerDelete = () => {
  document
    .querySelectorAll("delete-trip")
    .forEach((elmt) => elmt.addEventListener("click", deleteCart));
};

async function book() {
  try {
    const responseDeleteCart = await fetch(`${apiUrl}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: this.getAttribute("cart-id"),
      }),
    });

    await responseDeleteCart.json();
    this.parentNode.remove();
  } catch (e) {
    console.log(e);
  }
}

const addEventListenerBook = () => {
  document
    .querySelectorAll("delete-trip")
    .forEach((elmt) => elmt.addEventListener("click", book));
};

getCart();
