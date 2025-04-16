
const userID = getCookie("token");
const connectedUserName=getCookie("username")

if (userID) {
  document.querySelector("#user-connected-name").style.display = "flex";
  document.querySelector("#user-connected-name").textContent =
  connectedUserName;
}

const apiUrl = "https://tickethack-back-gray.vercel.app";

const generateTripElement = (trip) => {
  const tripDate = moment(trip.date);
  const dateNow = moment();
  const duration = moment.duration(dateNow.diff(tripDate));

  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  const htmlDuration =
    duration > 0 ? `Departure in ${days}j ${hours}h ${minutes}min` : "Passed";

  return `
    <div class="trip-row">
        <div class="result-trip">${trip.departure} > ${trip.arrival}</div>
        <div class="result-trip-time">${tripDate.format("HH:MM")}</div>
        <div class="result-trip-price">${trip.price}€</div>
        <div class="result-trip-departure">${htmlDuration}</div>
    </div>`;
};

const generateBookingElement = (booking) =>
  booking.trips.reduce((acc, trip) => (acc += generateTripElement(trip)), "");

const hideResults = () => {
  document.querySelector("#booking-section-content-results").style.display =
    "none";

  document.querySelector("#booking-section-content-no-results").style.display =
    "flex";
};

const showResults = () => {
  document.querySelector("#booking-section-content-results").style.display =
    "block";

  document.querySelector("#booking-section-content-no-results").style.display =
    "none";
};

const showLoader = () => {
  document.querySelector("#booking-section-content-results").style.display =
    "none";

  document.querySelector("#booking-section-content-no-results").style.display =
    "none";
  document.querySelector("#loader").style.display = "flex";
};

const hideLoader = () => {
  document.querySelector("#loader").style.display = "none";
};

const isResultsEmpty = () => {
  return document.querySelectorAll("trip-row").length === 0;
};

const getBookings = async () => {
  try {
    showLoader();
    const responseGetBookings = await fetch(`${apiUrl}/bookings`);
    const bookings = await responseGetBookings.json();
    console.log(bookings);
    bookings.forEach((booking) => {
      if (booking.trips.length > 0) {
        hideLoader();
        document.querySelector("#booking-list").innerHTML =
          generateBookingElement(booking);
        showResults();
      } else {
        hideLoader();
        hideResults();
      }
    });
  } catch (e) {
    console.log(e);
    hideLoader();
    hideResults();
  }
};

getBookings();
