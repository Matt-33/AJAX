// DOM
const regionsSelect = document.getElementById('regions');
const departementsSelect = document.getElementById('departements');
const showCommunesButton = document.getElementById('show-communes');
const communesList = document.getElementById('communes-list');

// Charger les régions
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://geo.api.gouv.fr/regions')
        .then(response => response.json())
        .then(regions => {
            regions.forEach(region => {
                const option = document.createElement('option');
                option.value = region.code;
                option.textContent = region.nom;
                regionsSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des régions :', error));
});


regionsSelect.addEventListener('change', () => {
    const regionCode = regionsSelect.value;

    if (regionCode) {
        departementsSelect.disabled = false;
        departementsSelect.innerHTML = '<option value="">Sélectionnez un département</option>';

        // Obtenir les départements de la région
        fetch(`https://geo.api.gouv.fr/regions/${regionCode}/departements`)
            .then(response => response.json())
            .then(departements => {
                departements.forEach(departement => {
                    const option = document.createElement('option');
                    option.value = departement.code;
                    option.textContent = departement.nom;
                    departementsSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Erreur lors du chargement des départements :', error));
    } else {
        departementsSelect.disabled = true;
    }
});

showCommunesButton.addEventListener('click', () => {
    const departementCode = departementsSelect.value;

    if (departementCode) {
        communesList.innerHTML = '';
        fetch(`https://geo.api.gouv.fr/departements/${departementCode}/communes`)
            .then(response => response.json())
            .then(communes => {
                // Trier les communes par population
                communes.sort((a, b) => (b.population || 0) - (a.population || 0));
                communes.forEach(commune => {
                    const li = document.createElement('li');
                    li.textContent = `${commune.nom} (Population: ${commune.population || 'Non renseignée'})`;
                    communesList.appendChild(li);
                });
            })
            .catch(error => console.error('Erreur lors du chargement des communes :', error));
    }
});

departementsSelect.addEventListener('change', () => {
    showCommunesButton.disabled = !departementsSelect.value;
});
