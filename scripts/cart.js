const apiUrl = "https://tickethack-back-gray.vercel.app";

const generateTripElement = (trip) => {
  return `
    <div class="trip-row">
        <div class="result-trip">${trip.departure} > ${trip.arrival}</div>
        <div class="result-trip-time">${moment(trip.date).format("HH:MM")}</div>
        <div class="result-trip-price">${trip.price}€</div>
        <button class="delete-trip" trip-id="${trip._id}">X</button>
    </div>`;
};

const generateCartElement = (cart) =>
  cart.trips.reduce((acc, trip) => (acc += generateTripElement(trip)), "");

const hideResults = () => {
  document.querySelector("#cart-section-content-results").style.display =
    "none";

  document.querySelector("#cart-section-content-no-results").style.display =
    "flex";
};

const showResults = () => {
  document.querySelector("#cart-section-content-results").style.display =
    "block";

  document.querySelector("#cart-section-content-no-results").style.display =
    "none";
};

const showLoader = () => {
  document.querySelector("#cart-section-content-results").style.display =
    "none";

  document.querySelector("#cart-section-content-no-results").style.display =
    "none";
  document.querySelector("#loader").style.display = "flex";
};

const hideLoader = () => {
  document.querySelector("#loader").style.display = "none";
};

const addIdToPurchaseBtn = (id) => {
  document.querySelector("#cart-book-button").setAttribute("cart-id", id);
};

const setTotal = (totalPrice) => {
  document.querySelector("#total").textContent = totalPrice;
};

const isResultsEmpty = () => {
  return document.querySelectorAll("trip-row").length === 0;
};

const getCart = async () => {
  try {
    showLoader();
    const responseGetCart = await fetch(`${apiUrl}/carts`);
    const cart = await responseGetCart.json();

    if (cart && cart.trips.length > 0) {
      document.querySelector("#cart-list").innerHTML =
        generateCartElement(cart);
      setTotal(cart.totalCart);
      addIdToPurchaseBtn(cart._id);
      hideLoader();
      showResults();
      addEventListenerDelete();
    } else {
      hideLoader();
      hideResults();
    }
  } catch (e) {
    console.log(e);
    hideLoader();
    hideResults();
  }
};

async function deleteTrip() {
  try {
    const responseDeleteCart = await fetch(`${apiUrl}/carts`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tripID: this.getAttribute("trip-id"),
      }),
    });

    await getCart();

    //const cart = await responseDeleteCart.json();

    //setTotal(cart.totalCart);
    //this.parentNode.remove();

    //if (isResultsEmpty()) {
    //  hideResults();
    //}
  } catch (e) {
    console.log(e);
  }
}

const addEventListenerDelete = () => {
  document
    .querySelectorAll(".delete-trip")
    .forEach((elmt) => elmt.addEventListener("click", deleteTrip));
};

async function book() {
  try {
    const responseBook = await fetch(`${apiUrl}/bookings/add-trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartID: this.getAttribute("cart-id"),
      }),
    });

    await responseBook.json();

    document.location.href = "./bookings.html";
  } catch (e) {
    console.log(e);
  }
}

const addEventListenerBook = () => {
  document.querySelector("#cart-book-button").addEventListener("click", book);
};

getCart();
addEventListenerBook();
