const geoButton = document.getElementById('geo-button');
const addressResult = document.getElementById('address-result');

geoButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        addressResult.textContent = 'Localisation en cours...';
        
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        addressResult.textContent = 'La géolocalisation n\'est pas supportée par votre navigateur.';
    }
});

function successCallback(position) {
    const { latitude, longitude } = position.coords;
    addressResult.textContent = `Coordonnées récupérées : Latitude ${latitude}, Longitude ${longitude}. Recherche de l'adresse en cours...`;

    fetch(`https://api-adresse.data.gouv.fr/reverse/?lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                const address = data.features[0].properties.label;
                addressResult.textContent = `Votre adresse est : ${address}`;
            } else {
                addressResult.textContent = 'Aucune adresse trouvée pour ces coordonnées.';
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de l\'adresse :', error);
            addressResult.textContent = 'Erreur lors de la récupération de l\'adresse.';
        });
}

function errorCallback(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            addressResult.textContent = 'Vous avez refusé la demande de géolocalisation.';
            break;
        case error.POSITION_UNAVAILABLE:
            addressResult.textContent = 'Les informations de localisation ne sont pas disponibles.';
            break;
        case error.TIMEOUT:
            addressResult.textContent = 'La demande de localisation a expiré.';
            break;
        default:
            addressResult.textContent = 'Une erreur inconnue est survenue.';
            break;
    }
}