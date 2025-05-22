const continent = document.getElementById('continent');
const modal = new bootstrap.Modal(document.getElementById('windowCountry'));
const modalBody = document.getElementById("modal-body-content");
const order = document.getElementById('orderBy');


async function getData(region, order) {
    const url = `https://restcountries.com/v3.1/region/${region}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
       switch (parseInt(order)) {

        case 1: // Abecedně Z-A
          json.sort((a, b) => a.name.common.localeCompare(b.name.common));
          break;
        case 2: // Nejvíc obyvatel
          json.sort((a, b) => b.population - a.population);
          break;
        case 3: // Nejmíň obyvatel
          json.sort((a, b) => a.population - b.population);
          break;
      }
      let blocks = '';
      json.forEach((country) => {

        blocks += `
            <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 p-3">                
                <div class="card bg-primary ">                     
                  <img class="card-img-top mx-auto img-fluid p-2" src="${country.flags.png}" alt="Vlajka" style = "width: 286px;height: 180px;">
                    <div class="card-body">
                      <h4 class="card-title text-white p-3">${country.name.common}</h4>
                      <p class="card-text text-white">Počet obyvatel: ${country.population.toLocaleString('cs-CZ')}</p>
                      <a href="#" class="btn btn-danger card-link" 
                      data-name="${country.name.common}">Informace</a>
                    </div>
                </div>
            </div>            
        `;
      });
      listCountries.innerHTML = blocks;
      document.querySelectorAll('[data-name]').forEach(button => {
        button.addEventListener('click', () => {
          console.log('pokus');
          const countryName = button.getAttribute('data-name');
          modal.show();
          fetch(`https://restcountries.com/v3.1/name/${countryName}`)
          .then(res => res.json())
          .then(data => {
            const country = data[0];
            console.log(country);
            modalBody.innerHTML = `
              <h4>${country.name.common}</h4>
              <p>Hlavní město: ${country.capital}</p>
              <p>Jazyky:  ${Object.values(country.languages).join(', ')}</p>
              <p>Měny: ${country.currencies ? Object.values(country.currencies).map(currency => currency.name).join(', ') : 'Neznámé'}</p>
              <p>Člen UN: ${country.unMember ? 'Ano' : 'Ne'}</p>
            `;

          })
          .catch(error => {
            console.log(`Nastala chyba: ${error}`);
          });
        });

      });

    } catch (error) {
      //console.error(error.message);
    }
  }
  
continent.addEventListener('change', ()=> {
    getData(continent.value, order.value);
});
order.addEventListener('change', ()=> {
    getData(continent.value, order.value);
});

getData('europe', 2);

