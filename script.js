document.getElementById('fetch-rates').addEventListener('click', fetchRates);

async function fetchRates() {
    const base = document.getElementById('base-currency').value;
    const loading = document.getElementById('loading');
    const ratesContainer = document.getElementById('rates-container');
    const button = document.getElementById('fetch-rates');

    button.disabled = true;
    setTimeout(() => button.disabled = false, 3000);
    loading.style.display = 'block';
    ratesContainer.innerHTML = '';

    try {
        const response = await fetch(`https://api.frankfurter.app/latest?from=${base}`);
        const data = await response.json();

        loading.style.display = 'none';

        if (data.rates) {
            const rates = data.rates;
            const currencies = Object.keys(rates);

            ratesContainer.innerHTML = `<h2>Exchange Rates (Base: ${base})</h2>`;
            currencies.forEach(currency => {
                ratesContainer.innerHTML += `<p>${currency}: ${rates[currency].toFixed(4)}</p>`;
            });
        } else {
            ratesContainer.innerHTML = '<p>Error fetching rates.</p>';
        }
    } catch (error) {
        loading.style.display = 'none';
        ratesContainer.innerHTML = '<p>Error fetching rates.</p>';
    }
}