document.addEventListener("DOMContentLoaded", function () {
    const cinemaList = document.getElementById("cinema-list");
    const showCinemasBtn = document.getElementById("show-cinemas");
    const showNearbyCinemasBtn = document.getElementById("show-nearby-cinemas");
  
    const apiUrl = "https://data.culture.gouv.fr/api/records/1.0/search/?dataset=etablissements-cinematographiques&q=&rows=20";
  
    function displayCinemas() {
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          let cinemas = data.records.map(record => record.fields);
          cinemas.sort((a, b) => b.effectif_salle - a.effectif_salle);
  
          cinemaList.innerHTML = '';
  
          cinemas.forEach(cinema => {
            const listItem = document.createElement("li");
            const name = cinema.nom || "Nom non disponible";
            const address = cinema.adresse || "Adresse non disponible";
            const city = cinema.commune || "Ville non disponible";
            const seats = cinema.fauteuils || "Capacité non disponible";
  
            listItem.innerHTML = `<strong>${name}</strong><br>Adresse: ${address}<br>Ville: ${city}<br>Nombre de fauteuils: ${seats}`;
            cinemaList.appendChild(listItem);
          });
        })
        .catch(error => console.error("Erreur lors de la récupération des cinémas:", error));
    }
  
    function displayNearbyCinemas() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          const nearbyUrl = `https://data.culture.gouv.fr/api/records/1.0/search/?dataset=etablissements-cinematographiques&geofilter.distance=${latitude},${longitude},5000`;
  
          fetch(nearbyUrl)
            .then(response => response.json())
            .then(data => {
              let cinemas = data.records.map(record => record.fields);
  
              cinemas.sort((a, b) => b.effectif_salle - a.effectif_salle);
  
              cinemaList.innerHTML = '';

              cinemas.forEach(cinema => {
                const listItem = document.createElement("li");
                const name = cinema.nom || "Nom non disponible";
                const address = cinema.adresse || "Adresse non disponible";
                const city = cinema.commune || "Ville non disponible";
                const seats = cinema.fauteuils || "Capacité non disponible";
  
                listItem.innerHTML = `<strong>${name}</strong><br>Adresse: ${address}<br>Ville: ${city}<br>Nombre de fauteuils: ${seats}`;
                cinemaList.appendChild(listItem);
              });
            })
            .catch(error => console.error("Erreur lors de la récupération des cinémas proches:", error));
        }, error => {
          console.error("Erreur lors de la géolocalisation:", error);
        });
      } else {
        alert("La géolocalisation n'est pas supportée par votre navigateur.");
      }
    }
  
    showCinemasBtn.addEventListener("click", displayCinemas);
    showNearbyCinemasBtn.addEventListener("click", displayNearbyCinemas);
  });