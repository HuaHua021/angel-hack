$(document).ready(function () {
    let balance = 0.00;
    const goldInterestRate = 0.05;  // Example annual return rate of 5% for gold
    const stocksInterestRate = 0.07;  // Example annual return rate of 7% for stocks
    let investmentPrompted = false; // Flag to ensure the prompt only occurs once
    let topUpAmount = 0;  // Variable to store the top-up amount

    updateBalanceDisplay();

    $('#request-payback').click(() => handleTransaction("Enter the amount to request for payback:"));
    $('#top-up').click(() => handleTransaction("Enter the amount to top up:"));

   

    $('#calculate-gold').click(() => calculateAndDisplayInvestment(goldInterestRate));
    $('#calculate-stocks').click(() => calculateAndDisplayInvestment(stocksInterestRate));

    $('#invest-gold').click(() => invest(goldInterestRate));
    $('#invest-stocks').click(() => invest(stocksInterestRate));

    // Check date every day
    setInterval(() => {
        const today = new Date();
        if (today.getDate() === 30) {
            autoTopUp();
            endOfMonthPrompt();
        }
    }, 100);  // Check every day (86400000 milliseconds in a day)


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
 

    function updateBalanceDisplay() {
        $('#balance').text(balance.toFixed(2));
    }
    function updateBalanceDisplay() {
        $('#topUpAmount').text(topUpAmount.toFixed(2));
    }
    function handleTransaction(message) {
        let amount = parseFloat(prompt(message));
        if (!isNaN(amount) && amount > 0) {
            topUpAmount += amount;
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
});
