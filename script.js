$(document).ready(function () {
    const goldInterestRate = 0.05;  // Example annual return rate of 5% for gold
    const stocksInterestRate = 0.07;  // Example annual return rate of 7% for stocks
    let investmentPrompted = false; // Flag to ensure the prompt only occurs once
    let topUpAmount = getCookie("topUpAmount") ? parseFloat(getCookie("topUpAmount")) : 0;  // Get the top-up amount from the cookie
    let balance = getCookie("balance") ? parseFloat(getCookie("balance")) : 300.00;  // Get the balance from the cookie or set to default
    let investmentData = [];  // Array to store investment data
    if (balance === 0) {
        balance = topUpAmount;
    }
    updateBalanceDisplay();
    updateTopUpAmountDisplay();

    // Initialize the chart

    const datapoint = {
    labels: ["2024-02-01", "2024-03-02", "2024-04-03", "2024-05-04"],
    data: [300, 320, 340, 310] // Corresponding balance values for each date
};
    // Initialize the chart with hardcoded data
const ctx = document.getElementById('investmentChart').getContext('2d');
let investmentChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: datapoint.labels,
        datasets: [{
            label: 'Investment Over Time',
            data: datapoint.data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Amount ($)'
                },
                beginAtZero: true
            }
        }
    }
});

    function updateChart() {
        const date = new Date().toLocaleDateString();
        investmentChart.data.labels.push(date);
        investmentChart.data.datasets[0].data.push(balance);
        investmentChart.update();
    }


    $('#request-payback').click(() => handleTransaction("Enter the amount to request for payback:"));
    $('#top-up').click(() => {
        $('#topUpModal').css("display", "block");
    });

    $('#submitTopUp').click(() => {
        

        topUpAmount = parseFloat($('#topUpAmount').val());
        if (!isNaN(topUpAmount) && topUpAmount > 0) {
            setCookie("topUpAmount", topUpAmount, 30); // Set the cookie for 30 days
            updateTopUpAmountDisplay();
            updateBalanceDisplay();
            $('#topUpModal').css("display", "none");
            $('#topUpAmount').val('');
        } else {
            alert("Invalid amount entered.");
        }
    });

    $('.close').click(() => {
        $('#topUpModal').css("display", "none");
        $('#topUpAmount').val('');
    });

    $(window).click((event) => {
        if (event.target.id == 'topUpModal') {
            $('#topUpModal').css("display", "none");
            $('#topUpAmount').val('');
        }
    });

    $('#calculate-gold').click(() => calculateAndDisplayInvestment(goldInterestRate));
    $('#calculate-stocks').click(() => calculateAndDisplayInvestment(stocksInterestRate));
    $('#invest-gold').click(() => invest(goldInterestRate));
    updateChart();  // Update the chart with the new balance
    $('#invest-stocks').click(() => invest(stocksInterestRate));
    updateChart();  // Update the chart with the new balance

      // Workaround for 30-day interval
    //  let daysPassed = 0;
    //  const maxDays = 30;
 
    //  setInterval(() => {
    //      daysPassed++;
    //      if (daysPassed >= maxDays) {
    //          autoTopUp();
    //          endOfMonthPrompt();
    //          daysPassed = 0;
    //      }
    //  }, 86400000);  // Check every day (86400000 milliseconds in a day)
 
    // Check date every day
    setInterval(() => {
        const today = new Date();
        if (today.getDate() === 30) {
            autoTopUp();
            endOfMonthPrompt();
        }
    }, 86400000);  // Check every day (86400000 milliseconds in a day)

    function updateBalanceDisplay() {
        $('#balance').text(balance.toFixed(2));
        setCookie("balance", balance, 30);  // Update the balance cookie whenever the balance is displayed
    }
    function updateTopUpAmountDisplay() {
        $('#AmountToTopUp').text(topUpAmount.toFixed(2));
    }

    function handleTransaction(message) {
        let amount = parseFloat(prompt(message));
        if (!isNaN(amount) && amount > 0) {
            balance += amount;
            updateBalanceDisplay();
        } else {
            alert("Invalid amount entered.");
        }
    }

    function calculateInvestment(principal, rate, years) {
        return principal * Math.pow((1 + rate), years);
    }

    function calculateAndDisplayInvestment(rate) {
        let projection = calculateInvestment(balance, rate, 10);
        let investmentType = (rate === goldInterestRate) ? "gold" : "stocks";
        $('#investment-projection').text(`If you invest $${balance.toFixed(2)} in ${investmentType}, it will be worth $${projection.toFixed(2)} in 10 years.`);
    }

    function invest(rate) {
        if (balance > 0) {
            let projection = calculateInvestment(balance, rate, 10);
            let investmentType = (rate === goldInterestRate) ? "gold" : "stocks";
            $('#investment-projection').text(`You invested $${balance.toFixed(2)} in ${investmentType}. It will be worth $${projection.toFixed(2)} in 10 years.`);
            balance = 0;
            updateBalanceDisplay();
        } else {
            alert("Insufficient balance to invest.");
        }
    }

    function autoTopUp() {
        if (topUpAmount > 0) {
            balance += topUpAmount;
            updateBalanceDisplay();
        } else {
            alert("Please set a top-up amount first.");
        }
    }

    function endOfMonthPrompt() {
        if (!investmentPrompted) {
            let invest = confirm("Would you like to calculate your potential investment earnings?");
            if (invest) {
                calculateAndDisplayInvestment(goldInterestRate);
                calculateAndDisplayInvestment(stocksInterestRate);
            }
            investmentPrompted = true;
        }
    }

    // Function to set a cookie
    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days*24*60*60*1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }


    // Function to get a cookie
    function getCookie(name) {
        const cname = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cname) == 0) {
                return c.substring(cname.length, c.length);
            }
        }}
});
