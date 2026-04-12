document.getElementById('fetch-rates').addEventListener('click', fetchRates);
document.getElementById('convert-btn').addEventListener('click', convertAmount);
document.getElementById('base-currency').addEventListener('change', resetFetchButton);
document.getElementById('filter-input').addEventListener('input', refreshRatesDisplay);
document.getElementById('sort-select').addEventListener('change', refreshRatesDisplay);
document.getElementById('show-select').addEventListener('change', refreshRatesDisplay);

let currentRates = {};
let currentBase = 'USD';
let apiChecked = false;
let allRatesData = [];

const apiEndpoints = [
    (base) => `https://api.frankfurter.app/latest?from=${base}`,
    (base) => `https://open.er-api.com/v6/latest/${base}`,
    (base) => `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${base.toLowerCase()}.json`
];

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
    ZAR: 'South Africa',
    AED: 'United Arab Emirates',
    AFN: 'Afghanistan',
    ALL: 'Albania',
    AMD: 'Armenia',
    ANG: 'Netherlands Antilles',
    AOA: 'Angola',
    ARS: 'Argentina',
    AZN: 'Azerbaijan',
    BAM: 'Bosnia',
    BBD: 'Barbados',
    BDT: 'Bangladesh',
    BGN: 'Bulgaria',
    BHD: 'Bahrain',
    BIF: 'Burundi',
    BMD: 'Bermuda',
    BND: 'Brunei',
    BOB: 'Bolivia',
    BWP: 'Botswana',
    BZD: 'Belize',
    CLP: 'Chile',
    COP: 'Colombia',
    CRC: 'Costa Rica',
    CUR: 'Turkey',
    CVE: 'Cape Verde',
    DJF: 'Djibouti',
    DOP: 'Dominican Republic',
    DZD: 'Algeria',
    EGP: 'Egypt',
    ERN: 'Eritrea',
    ETB: 'Ethiopia',
    FJD: 'Fiji',
    FKP: 'Falkland Islands',
    GEL: 'Georgia',
    GGP: 'Guernsey',
    GHS: 'Ghana',
    GIP: 'Gibraltar',
    GMD: 'Gambia',
    GNF: 'Guinea',
    GTQ: 'Guatemala',
    GYD: 'Guyana',
    HNL: 'Honduras',
    HRK: 'Croatia',
    HTG: 'Haiti',
    IMP: 'Isle of Man',
    IRR: 'Iran',
    JEP: 'Jersey',
    JMD: 'Jamaica',
    JOD: 'Jordan',
    KES: 'Kenya',
    KGS: 'Kyrgyzstan',
    KHR: 'Cambodia',
    KMF: 'Comoros',
    KPW: 'North Korea',
    KWD: 'Kuwait',
    KYD: 'Cayman Islands',
    KZT: 'Kazakhstan',
    LAK: 'Laos',
    LBP: 'Lebanon',
    LKR: 'Sri Lanka',
    LRD: 'Liberia',
    LSL: 'Lesotho',
    LYD: 'Libya',
    MAD: 'Morocco',
    MDL: 'Moldova',
    MGA: 'Madagascar',
    MKD: 'North Macedonia',
    MMK: 'Myanmar',
    MNT: 'Mongolia',
    MOP: 'Macau',
    MUR: 'Mauritius',
    MVR: 'Maldives',
    MWK: 'Malawi',
    MZN: 'Mozambique',
    NAD: 'Namibia',
    NGN: 'Nigeria',
    NIO: 'Nicaragua',
    NPR: 'Nepal',
    OMR: 'Oman',
    PAB: 'Panama',
    PEN: 'Peru',
    PGK: 'Papua New Guinea',
    PKR: 'Pakistan',
    PYG: 'Paraguay',
    QAR: 'Qatar',
    RSD: 'Serbia',
    RUB: 'Russia',
    RWF: 'Rwanda',
    SAR: 'Saudi Arabia',
    SBD: 'Solomon Islands',
    SCR: 'Seychelles',
    SDG: 'Sudan',
    SLL: 'Sierra Leone',
    SOS: 'Somalia',
    SRD: 'Suriname',
    SSP: 'South Sudan',
    STN: 'São Tomé and Príncipe',
    SYP: 'Syria',
    SZL: 'Eswatini',
    TJS: 'Tajikistan',
    TMT: 'Turkmenistan',
    TND: 'Tunisia',
    TOP: 'Tonga',
    TTD: 'Trinidad and Tobago',
    TWD: 'Taiwan',
    TZS: 'Tanzania',
    UAH: 'Ukraine',
    UGX: 'Uganda',
    UYU: 'Uruguay',
    UZS: 'Uzbekistan',
    VES: 'Venezuela',
    VND: 'Vietnam',
    VUV: 'Vanuatu',
    WST: 'Samoa',
    XAF: 'Central African CFA',
    XCD: 'East Caribbean',
    XOF: 'West African CFA',
    XPF: 'French Pacific',
    YER: 'Yemen',
    ZMW: 'Zambia',
    ZWL: 'Zimbabwe'
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

    let data = null;
    let lastError = null;

    for (let i = 0; i < apiEndpoints.length; i++) {
        try {
            const url = apiEndpoints[i](base);
            const response = await fetch(url);
            data = await response.json();

            if (data.rates || (data[base.toLowerCase()] && data[base.toLowerCase()][base.toLowerCase()] === 1)) {
                break;
            }
        } catch (error) {
            lastError = error;
            continue;
        }
    }

    loading.style.display = 'none';

    if (!data || (!data.rates && !Object.keys(data).some(key => typeof data[key] === 'object' && Object.keys(data[key]).length > 0))) {
        document.getElementById('filter-sort-group').style.display = 'none';
        ratesContainer.innerHTML = '<p>Error fetching rates. All APIs failed.</p>';
        document.getElementById('convert-btn').disabled = true;
        showApiCheckStatus(false);
        return;
    }

    try {
        const rates = data.rates || Object.values(data)[0];
        const currencies = Object.keys(rates);

        currentRates = rates;
        currentBase = base;
        
        allRatesData = [
            { code: base, country: currencyCountries[base] || 'Unknown', rate: 1.0000 },
            ...currencies.map(currency => ({
                code: currency,
                country: currencyCountries[currency] || 'Unknown',
                rate: rates[currency]
            }))
        ];

        document.getElementById('filter-sort-group').style.display = 'flex';
        document.getElementById('filter-input').value = '';
        document.getElementById('sort-select').value = 'desc';
        document.getElementById('show-select').value = '5';
        
        refreshRatesDisplay();
        updateTargetOptions(base, currencies);
        document.getElementById('convert-btn').disabled = false;
        showApiCheckStatus(true);
    } catch (error) {
        document.getElementById('filter-sort-group').style.display = 'none';
        ratesContainer.innerHTML = '<p>Error processing rates.</p>';
        document.getElementById('convert-btn').disabled = true;
        showApiCheckStatus(false);
    }
}

function formatRate(rate) {
    if (rate >= 1000000) {
        return (rate / 1000000).toFixed(2) + 'M';
    } else if (rate >= 1000) {
        return (rate / 1000).toFixed(2) + 'K';
    } else if (rate < 0.01) {
        return rate.toFixed(6);
    } else {
        return rate.toFixed(4);
    }
}

function refreshRatesDisplay() {
    const filterText = document.getElementById('filter-input').value.toLowerCase();
    const sortOrder = document.getElementById('sort-select').value;
    const showLimit = document.getElementById('show-select').value;

    let filtered = allRatesData.filter(item => 
        item.code.toLowerCase().includes(filterText) || 
        item.country.toLowerCase().includes(filterText)
    );

    let sorted = filtered.sort((a, b) => 
        sortOrder === 'desc' ? b.rate - a.rate : a.rate - b.rate
    );

    let limited = showLimit === 'all' 
        ? sorted 
        : sorted.slice(0, parseInt(showLimit));

    const ratesContainer = document.getElementById('rates-container');
    const baseCountry = currencyCountries[currentBase] || 'Unknown';
    
    ratesContainer.innerHTML = `<h2>Exchange Rates (Base: ${currentBase})</h2>`;
    
    limited.forEach((item, index) => {
        const formattedRate = formatRate(item.rate);
        ratesContainer.innerHTML += `<p class="rate-item" style="animation-delay: ${index * 50}ms;">${item.code}: ${formattedRate} (${item.country})</p>`;
    });
}

function showApiCheckStatus(ok) {
    const apiCheck = document.getElementById('api-check');
    const text = document.getElementById('api-check-text');
    const mainContent = document.getElementById('main-content');

    if (ok) {
        apiCheck.classList.add('success');
        text.textContent = 'API working';
        mainContent.style.display = 'block';
        apiChecked = true;
    } else {
        apiCheck.classList.remove('success');
        text.textContent = 'API not working - Retry';
        mainContent.style.display = 'none';
        apiChecked = false;
    }
}

window.addEventListener('load', () => {
    const apiCheck = document.getElementById('api-check');
    const text = document.getElementById('api-check-text');
    text.textContent = 'Checking if API working...';
    apiCheck.classList.remove('success');

    (async () => {
        let apiWorking = false;

        for (let i = 0; i < apiEndpoints.length; i++) {
            try {
                const url = apiEndpoints[i]('USD');
                const response = await fetch(url);
                const data = await response.json();

                if (data.rates || (data.usd && data.usd.usd === 1)) {
                    apiWorking = true;
                    break;
                }
            } catch (error) {
                continue;
            }
        }

        if (apiWorking) {
            showApiCheckStatus(true);
            fetchRates();
        } else {
            showApiCheckStatus(false);
        }
    })();
});

function resetFetchButton() {
    const button = document.getElementById('fetch-rates');
    button.disabled = false;
}

function updateTargetOptions(base, availableCurrencies) {
    const select = document.getElementById('target-currency');
    select.innerHTML = '';

    const allCurrencies = [base, ...availableCurrencies];
    const uniqueCurrencies = [...new Set(allCurrencies)];

    uniqueCurrencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        select.appendChild(option);
    });

    if (!uniqueCurrencies.includes('USD')) {
        const fastOption = document.createElement('option');
        fastOption.value = 'USD';
        fastOption.textContent = 'USD';
        select.appendChild(fastOption);
    }
}

function convertAmount() {
    const amount = parseFloat(document.getElementById('amount').value);
    const target = document.getElementById('target-currency').value;
    const resultEl = document.getElementById('convert-result');

    if (isNaN(amount) || amount < 0) {
        resultEl.textContent = 'Enter a valid amount.';
        return;
    }

    if (target === currentBase) {
        resultEl.textContent = `${amount.toFixed(2)} ${currentBase} = ${amount.toFixed(2)} ${target}`;
        return;
    }

    if (!currentRates[target]) {
        resultEl.textContent = `No rate for ${target} available. Fetch rates again.`;
        return;
    }

    const converted = amount * currentRates[target];
    resultEl.textContent = `${amount.toFixed(2)} ${currentBase} = ${converted.toFixed(2)} ${target}`;
}