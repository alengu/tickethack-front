//reinit de la page 
document.querySelector("#default-result-image").style.display = "flex";

let elmtArrival = document.querySelector("#search-arrival");
let elmtDeparture = document.querySelector("#search-departure");
let elmtDate = document.querySelector("#search-date");
let elmtresultTemplate = document.createElement("div");
elmtresultTemplate.classList.add("result");

let arrival = elmtArrival.value;
let departure = elmtDeparture.value;
let date = new Date(elmtDate.value);
date.toISOString()
console.log(date);


fetch(`http://localhost:3000/trips?${arrival}&${departure}&${date}`)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    //récupération de tous les trajets pour la recherche donnée
        //reset visuel
        document.querySelector("result").textContent = "";
        document.querySelector("result").style.display = "none";
        document.querySelector("result").className = "";
        document.querySelector('#default-result').style.display="none"
    // cas avec aucun résultat
    if (data.statusCode === 400) {
        document.querySelector('#result-not-found').style.display="flex"
    }
    else { //cas avec au moins un résultat

        for (let i = 0; i<data.length;i++){
            //on clone n fois le modèle
            elmtresult=elmtresultTemplate.cloneNode(true)
            elmtresult.setAttribute("trip-id",data[i]._id)
            elmtresult.innerTHML=+ `<p class="result-trip">${data[i].departure} > ${data[i].arrival}</p>
          <p class="result-trip-time">${data[i].date}</p>
          <p class="result-trip-price">${data[i].price}</p>
          <button class="book-button">Book</button>`
        }
            //on append à la results-box
            document.querySelector("results-box").appendChild(elmtresult)
     
    }
    
  });
