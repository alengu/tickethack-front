const apiUrl = "https://tickethack-back-gray.vercel.app";

//reinit de la page
document.querySelector("#default-result-image").style.display = "flex";

let elmtArrival = document.querySelector("#search-arrival");
let elmtDeparture = document.querySelector("#search-departure");
let elmtDate = document.querySelector("#search-date");

document.querySelector("#trip-search-button").addEventListener("click", () => {
  let arrival = elmtArrival.value;
  let departure = elmtDeparture.value;
  let date = new Date(elmtDate.value);
  date = date.toISOString();
  searchTrips(arrival, departure, date);
});

async function addTripToCart() {
  try {
    await fetch(`${apiUrl}/carts/add-trip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tripID: this.parentNode.getAttribute("trip-id"),
      }),
    });

    document.location.href = "cart.html";
  } catch (exception) {}
}

const addEventBookTrip = () => {
  document.querySelectorAll(".book-button").forEach((elmt) => {
    elmt.addEventListener("click", addTripToCart);
  });
};

const cleanResults = () => {
  document.querySelectorAll(".result-row").forEach((elemt) => elemt.remove());
};

function searchTrips(arrival, departure, date) {
  document.querySelector("#default-result").style.display = "none";
  cleanResults();
  showLoader();

  fetch(
    `${apiUrl}/trips?arrival=${arrival}&departure=${departure}&date=${date}`
  )
    .then((response) => response.json())
    .then((data) => {
      document.querySelector("#result-not-found").style.display = "none";

      let elmtResultTemplate = document.createElement("div");
      elmtResultTemplate.classList.add("result");

      //récupération de tous les trajets pour la recherche donnée

      // cas avec aucun résultat
      if (data.length === 0) {
        console.log("case data.length = 0");
        hideLoader();
        document.querySelector("#result-not-found").style.display = "flex";
      } else {
        //cas avec au moins un résultat
        for (let i = 0; i < data.length; i++) {
          //on clone n fois le modèle
          elmtResult = elmtResultTemplate.cloneNode(true);
          let formattedDate = moment(data[i].date).format("HH:MM");
          elmtResult.setAttribute("trip-id", data[i]._id);
          elmtResult.innerHTML = `<div class="result-trip">${data[i].departure} > ${data[i].arrival}</div>
            <div class="result-trip-time">${formattedDate}</div>
            <div class="result-trip-price">${data[i].price}€</div>
            <button class="book-button">Book</button>`;

          // on l'affiche

          elmtResult.style.display = "flex";

          if (i === data.length - 1) {
            elmtResult.classList.add("last-result");
          }
          //on append à la results-box
          elmtResult.classList.add("result-row");
          document.querySelector(".results-box").appendChild(elmtResult);
          // pour le dernier enfant, il faut préciser last-result
        }
        hideLoader();
        addEventBookTrip();
      }
    })
    .catch((error) => {
      console.log(error);
      hideLoader();
      document.querySelector("#result-not-found").style.display = "flex";
      document.querySelector("#default-result").style.display = "none";
    }); // cas d'erreur de la query - resultat not found
}

const showLoader = () => {
  document.querySelector("#loader").style.display = "flex";
};

const hideLoader = () => {
  document.querySelector("#loader").style.display = "none";
};
