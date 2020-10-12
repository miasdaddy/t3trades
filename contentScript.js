setInterval(function () {
    chrome.storage.local.set({ trades: getTrades() });

}, 5000);

//3FHSFLWGIMHDQIPW

function getTrades() {
    var result = [];

    var parentNode = document.evaluate('//div[@id="positionsContainer"]', document.body, null, XPathResult.ANY_TYPE, null).iterateNext();
    if (parentNode) {
        var items = parentNode.querySelectorAll("li");
        for (var i = 0; i < items.length; i++) {
            var strTrader = items[i].closest("#trader_1") ? "Scott" : "Dan";
            var ticker = items[i].querySelectorAll('span')[0].textContent;
            var group = items[i].getAttribute('ng-repeat').split(" ")[0].replace("Position", "");
            var historyTrades = items[i].querySelectorAll('p');
            for (var j = 0; j < historyTrades.length; j++) {
                var objTrade = new Object();
                objTrade.trader = strTrader;
                objTrade.ticker = ticker;
                objTrade.time = historyTrades[j].textContent.split(" ")[0];

                objTrade.group = group;

                var temp = historyTrades[j].textContent;
                if (temp.includes("SELL")) objTrade.type = "SELL";
                if (temp.includes("BUY")) objTrade.type = "BUY";
                if (temp.includes("COVER")) objTrade.type = "COVER";
                if (temp.includes("SHORT")) objTrade.type = "SHORT";
                if (temp.includes("OVERNIGHT")) objTrade.type = "OVN";

                objTrade.price = 100;
                objTrade.option = items[i].querySelectorAll('span')[1].textContent;
                result.push(objTrade);
            }
        }
    }

    return result;
}