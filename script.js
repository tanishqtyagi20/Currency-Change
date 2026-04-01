document.getElementById('fetch-rates').addEventListener('click', fetchRates);

const currencyCountries = {
    USD: 'United States',
    EUR: 'European Union',
    GBP: 'United Kingdom',
    INR: 'India',
    JPY: 'Japan',
    CAD: 'Canada',
    AUD: 'Australia',
    CHF: 'Switzerland',
    BRL: 'Brazil',
    CNY: 'China',
    CZK: 'Czech Republic',
    DKK: 'Denmark',
    HKD: 'Hong Kong',
    HUF: 'Hungary',
    IDR: 'Indonesia',
    ILS: 'Israel',
    ISK: 'Iceland',
    KRW: 'South Korea',
    MXN: 'Mexico',
    MYR: 'Malaysia',
    NOK: 'Norway',
    NZD: 'New Zealand',
    PHP: 'Philippines',
    PLN: 'Poland',
    RON: 'Romania',
    SEK: 'Sweden',
    SGD: 'Singapore',
    THB: 'Thailand',
    TRY: 'Turkey',
    ZAR: 'South Africa'
};

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
            const baseCountry = currencyCountries[base] || 'Unknown';
            ratesContainer.innerHTML += `<p>${base}: 1.0000 (${baseCountry})</p>`;
            currencies.forEach(currency => {
                const country = currencyCountries[currency] || 'Unknown';
                ratesContainer.innerHTML += `<p>${currency}: ${rates[currency].toFixed(4)} (${country})</p>`;
            });
        } else {
            ratesContainer.innerHTML = '<p>Error fetching rates.</p>';
        }
    } catch (error) {
        loading.style.display = 'none';
        ratesContainer.innerHTML = '<p>Error fetching rates.</p>';
    }
}