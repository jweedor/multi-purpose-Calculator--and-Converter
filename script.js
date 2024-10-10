const API_KEY = 'c72debbee5ad1bc33898ffbd';

// Function to fetch real-time currency conversion rates from the API based on selected base currency
async function fetchExchangeRates(baseCurrency) {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`);
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }
        const data = await response.json();
        return data.conversion_rates; // This contains the exchange rates for the base currency
    } catch (error) {
        console.error("Error fetching exchange rates: ", error);
        document.getElementById("currency-result").innerText = "Error fetching exchange rates. Try again later.";
        return null;
    }
}

// Currency Converter function to convert between the selected currencies
async function convertCurrency() {
    let amount = parseFloat(document.getElementById("currency-amount").value);
    let fromCurrency = document.getElementById("from-currency").value.toUpperCase();
    let toCurrency = document.getElementById("to-currency").value.toUpperCase();

    // Input validation
    if (isNaN(amount) || amount <= 0) {
        document.getElementById("currency-result").innerText = "Please enter a valid amount.";
        return;
    }

    // Fetch real-time exchange rates based on the selected 'fromCurrency'
    const conversionRates = await fetchExchangeRates(fromCurrency);
    if (!conversionRates) return;

    // Check if the target currency exists in the fetched rates
    if (!conversionRates[toCurrency]) {
        document.getElementById("currency-result").innerText = "Target currency not supported.";
        return;
    }

    // Perform the conversion
    let result = amount * conversionRates[toCurrency];
    document.getElementById("currency-result").innerText = `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
}

// Compound Interest Calculator
function calculateCompoundInterest() {
    let principal = parseFloat(document.getElementById("principal").value);
    let rate = parseFloat(document.getElementById("rate").value) / 100;
    let years = parseFloat(document.getElementById("years").value);
    let compound = parseInt(document.getElementById("compound").value);

    if (isNaN(principal) || isNaN(rate) || isNaN(years) || isNaN(compound) || principal <= 0 || rate <= 0 || years <= 0 || compound <= 0) {
        document.getElementById("compound-result").innerText = "Please enter valid input values.";
        return;
    }

    let amount = principal * Math.pow((1 + rate / compound), compound * years);
    document.getElementById("compound-result").innerText = `Future Value: $${amount.toFixed(2)}`;
}

// Regular Calculator
let expression = '';

function inputValue(value) {
    expression += value;
    document.getElementById("calculator-display").value = expression;
}

function clearDisplay() {
    expression = '';
    document.getElementById("calculator-display").value = '';
}

function calculate() {
    try {
        let result = eval(expression);
        document.getElementById("calculator-display").value = result;
        expression = '';
    } catch (error) {
        document.getElementById("calculator-display").value = 'Error';
        expression = '';
    }
}

// Conversion logic for various units
const conversionData = {
    length: {
        baseUnit: 'meters',
        units: ['inches', 'centimeters', 'feet', 'meters', 'miles', 'kilometers', 'yards'],
        factors: {
            inches: { meters: 0.0254 },
            centimeters: { meters: 0.01 },
            feet: { meters: 0.3048 },
            meters: { meters: 1 },
            miles: { meters: 1609.34 },
            kilometers: { meters: 1000 },
            yards: { meters: 0.9144 }
        }
    },
    mass: {
        baseUnit: 'kilograms',
        units: ['pounds', 'kilograms', 'ounces', 'grams', 'tons', 'metric tons'],
        factors: {
            pounds: { kilograms: 0.453592 },
            kilograms: { kilograms: 1 },
            ounces: { kilograms: 0.0283495 },
            grams: { kilograms: 0.001 },
            tons: { kilograms: 907.185 },
            'metric tons': { kilograms: 1000 }
        }
    },
    volume: {
        baseUnit: 'liters',
        units: ['gallons', 'liters', 'quarts', 'cups', 'milliliters', 'fluid ounces'],
        factors: {
            gallons: { liters: 3.78541 },
            liters: { liters: 1 },
            quarts: { liters: 0.946353 },
            cups: { liters: 0.236588 },
            milliliters: { liters: 0.001 },
            'fluid ounces': { liters: 0.0295735 }
        }
    },
    temperature: {
        units: ['celsius', 'fahrenheit', 'kelvin'],
        factors: {
            celsius: { fahrenheit: c => (c * 9 / 5) + 32, kelvin: c => c + 273.15 },
            fahrenheit: { celsius: f => (f - 32) * 5 / 9, kelvin: f => (f - 32) * 5 / 9 + 273.15 },
            kelvin: { celsius: k => k - 273.15, fahrenheit: k => (k - 273.15) * 9 / 5 + 32 }
        }
    },
    time: {
        baseUnit: 'seconds',
        units: ['seconds', 'minutes', 'hours', 'days'],
        factors: {
            seconds: { seconds: 1 },
            minutes: { seconds: 60 },
            hours: { seconds: 3600 },
            days: { seconds: 86400 }
        }
    },
    speed: {
        baseUnit: 'meters per second',
        units: ['mph', 'km/h', 'feet per second', 'meters per second'],
        factors: {
            mph: { 'meters per second': 0.44704 },
            'km/h': { 'meters per second': 0.277778 },
            'feet per second': { 'meters per second': 0.3048 },
            'meters per second': { 'meters per second': 1 }
        }
    },
    energy: {
        baseUnit: 'joules',
        units: ['joules', 'calories', 'kilowatt-hours'],
        factors: {
            joules: { joules: 1 },
            calories: { joules: 4.184 },
            'kilowatt-hours': { joules: 3600000 }
        }
    },
    pressure: {
        baseUnit: 'pascals',
        units: ['pascals', 'atmospheres', 'psi', 'bar'],
        factors: {
            pascals: { pascals: 1 },
            atmospheres: { pascals: 101325 },
            psi: { pascals: 6894.76 },
            bar: { pascals: 100000 }
        }
    },
    power: {
        baseUnit: 'watts',
        units: ['horsepower', 'kilowatts', 'watts'],
        factors: {
            horsepower: { watts: 745.7 },
            kilowatts: { watts: 1000 },
            watts: { watts: 1 }
        }
    },
    area: {
        baseUnit: 'square meters',
        units: ['square feet', 'square meters', 'acres', 'hectares', 'square miles', 'square kilometers'],
        factors: {
            'square feet': { 'square meters': 0.092903 },
            'square meters': { 'square meters': 1 },
            acres: { 'square meters': 4046.86 },
            hectares: { 'square meters': 10000 },
            'square miles': { 'square meters': 2589988.11 },
            'square kilometers': { 'square meters': 1000000 }
        }
    }
};

// Populate units based on selected type
function populateUnits() {
    const unitType = document.getElementById("unit-type").value;
    const fromSelect = document.getElementById("unit-from");
    const toSelect = document.getElementById("unit-to");

    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

    const units = conversionData[unitType].units;

    units.forEach(unit => {
        let option1 = document.createElement("option");
        let option2 = document.createElement("option");

        option1.value = option2.value = unit;
        option1.text = option2.text = unit.charAt(0).toUpperCase() + unit.slice(1);

        fromSelect.appendChild(option1);
        toSelect.appendChild(option2);
    });
}

// Convert units based on selected values
function convertUnits() {
    const unitType = document.getElementById("unit-type").value;
    const fromUnit = document.getElementById("unit-from").value;
    const toUnit = document.getElementById("unit-to").value;
    const value = parseFloat(document.getElementById("unit-value").value);

    if (isNaN(value)) {
        document.getElementById("unit-result").innerText = "Please enter a valid number.";
        return;
    }

    const baseUnit = conversionData[unitType].baseUnit;
    const factors = conversionData[unitType].factors;

    if (unitType === 'temperature') {
        const fromConversion = factors[fromUnit][baseUnit];
        const toConversion = factors[baseUnit][toUnit];

        const baseValue = fromConversion(value);
        const result = toConversion(baseValue);
        document.getElementById("unit-result").innerText = `${value} ${fromUnit} is equal to ${result.toFixed(2)} ${toUnit}`;
    } else {
        const fromFactor = factors[fromUnit][baseUnit];
        const toFactor = factors[toUnit][baseUnit];

        const baseValue = value * fromFactor;
        const result = baseValue / toFactor;
        document.getElementById("unit-result").innerText = `${value} ${fromUnit} is equal to ${result.toFixed(2)} ${toUnit}`;
    }
}

// Feedback form submission handler
document.getElementById('feedbackForm').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevent default form submission behavior

    // Get form data
    const name = document.getElementById('name').value;
    const feedback = document.getElementById('feedback').value;

    // Validate inputs
    if (name && feedback) {
        try {
            const response = await fetch('http://localhost:3000/submit-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, feedback }),
            });

            if (response.ok) {
                // Add the testimonial
                addTestimonial(name, feedback);

                // Display thank you message
                document.getElementById('thank-you-message').style.display = 'block';
                document.getElementById('feedbackForm').style.display = 'none';

                // Reset the form
                document.getElementById('feedbackForm').reset();
            } else {
                alert('Failed to submit feedback.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback. Please try again later.');
        }
    } else {
        alert('Please fill out both name and feedback.');
    }
});

// Function to close the "Thank you" message when the OK button is clicked
document.getElementById('ok-button').addEventListener('click', function () {
    document.getElementById('thank-you-message').style.display = 'none';
    document.getElementById('feedbackForm').style.display = 'block';
});

// Add testimonials to the testimonial section
function addTestimonial(name, feedback) {
    const testimonialContainer = document.getElementById('testimonials-container');
    const testimonial = document.createElement('div');
    testimonial.classList.add('testimonial');
    testimonial.innerHTML = `<p><strong>${name}</strong> says:</p><p>"${feedback}"</p>`;
    testimonialContainer.appendChild(testimonial);
}