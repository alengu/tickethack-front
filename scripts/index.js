//reinit de la page 
document.querySelector("#default-result-image").style.display = "flex";

let elmtArrival = document.querySelector("#search-arrival");
let elmtDeparture = document.querySelector("#search-departure");
let elmtDate = document.querySelector("#search-date");
let elmtresultTemplate = document.createElement("div");
elmtresultTemplate.classList.add(".result");


document.querySelector('#trip-search-button').addEventListener('click', ()=> {
    let arrival = elmtArrival.value;
    let departure = elmtDeparture.value;
    let date = new Date(elmtDate.value);
    date = date.toISOString()
    
searchTrips(arrival,departure, date)

})


function searchTrips(arrival, departure,date) {
fetch(`https://tickethack-back-gray.vercel.app/trips?arrival=${arrival}&departure=${departure}&date=${date}`)
  .then((response) => response.json())
  .then((data) => {
    //console.log(data);
    //récupération de tous les trajets pour la recherche donnée
        //reset visuel
        document.querySelector(".result").textContent = "";
        document.querySelector(".result").style.display = "none";
        document.querySelector(".result").className = "";
        document.querySelector('#default-result').style.display="none"
        document.querySelector('#result-not-found').style.display="none";
    // cas avec aucun résultat
    if (data.length === 0){
        console.log("case data.length = 0")
        document.querySelector('#result-not-found').style.display="flex"
        
    }
    else { //cas avec au moins un résultat

        for (let i = 0; i<data.length;i++){
            //on clone n fois le modèle
            elmtresult=elmtresultTemplate.cloneNode(true)
            let formattedDate = moment(data[i].date).format('HH:MM')
            elmtresult.setAttribute("trip-id",data[i]._id)
            elmtresult.innerHTML= `<div class="result-trip">${data[i].departure} > ${data[i].arrival}</div>
            <div class="result-trip-time">${formattedDate}</div>
            <div class="result-trip-price">${data[i].price}€</div>
            <button class="book-button">Book</button>`
            
            // on l'affiche
            elmtresult.style.display="flex"

            if (i===data.length-1) {
                elmtresult.classList.add("last-result")
            }
          //on append à la results-box
          document.querySelector(".results-box").appendChild(elmtresult)
          // pour le dernier enfant, il faut préciser last-result
          
        }
            
     
    }
    
  })
    .catch(error => {
        document.querySelector('#result-not-found').style.display="flex";
        document.querySelector('#default-result').style.display="none"
     }) // cas d'erreur de la query - resultat not found
};
