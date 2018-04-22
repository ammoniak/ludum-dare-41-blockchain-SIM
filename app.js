
function Stock()
{
    this.originalMin=0.01;
    this.originalMax=0.5;
    this.pastValues =[];
    this.pastValuesChart=[];
    this.min = this.originalMin;
    this.max = this.originalMax;
    this.value=this.min;
}
Stock.prototype.generateValue = function () {
  var minPercentage = this.min / this.value,
      maxPercentage = this.max / this.value,
      range = maxPercentage - minPercentage,
      change = Math.random() *Math.random() *Math.random() * range + minPercentage;
    //this.value = this.value *change;
    this.value = Math.round(this.value * change * 100) / 100;
    if (isNaN(this.value)) {
        this.value = this.min;
    }
    if (this.value==0){
        this.value = this.min;
    }
  this.pastValues.push(this.value);
  this.pastValuesChart.length=0;
  this.pastValuesChart.push(... this.pastValues.slice(-48));

  return this.value;
};


    var time=0;
    var stockTIme=0;
    var isRunning = false;
    var loopTimer = null;
    var price = 0.000;
    var money=1100;
    var btc=0;
    var pcAvailable=0;
    var pcRunning=0;


    //TODO: group PC properties into Rig-class
    var pc = {
        price:1000,
        sellPrice:600,
        powerUsage:0.2,
        hashingPower:0.01,
        max:20,
        running:0,
        available:0,
    }
    var miningPC = {
        price:5000,
        sellPrice:2000,
        powerUsage:2,
        hashingPower:0.15,
        max:10,
        running:0,
        available:0,
    }
    var asics = {
        price:50000,
        sellPrice:10000,
        powerUsage:10,
        hashingPower:1,
        max:100,
        running:0,
        available:0,
    }
    var rigs = [pc, miningPC,asics];
    var stock = new Stock();
    
$("#toggleRunning").click(toggleRunning);
$("#toggleRunning").click(); // Autostart

$("#sellBTC").click(sellBTC);
$("#buyBTC").click(buyBTC);
$("#sellPC").click((pc),sellRig);
$("#buyPC").click((pc),buyRig);
$("#startPC").click((pc),startRig);
$("#stopPC").click((pc),stopRig);
$("#sellMiningPC").click((miningPC),sellRig);
$("#buyMiningPC").click((miningPC),buyRig);
$("#startMiningPC").click((miningPC),startRig);
$("#stopMiningPC").click((miningPC),stopRig);
$("#sellASICS").click((asics),sellRig);
$("#buyASICS").click((asics),buyRig);
$("#startASICS").click((asics),startRig);
$("#stopASICS").click((asics),stopRig);


    function mainloop() {
        time = time+1;
        stockTIme = stockTIme+10*Math.random();
        $("#timer").text(time);
        price = stock.generateValue();
        //Generate coins
        rigs.forEach(function(rig){
            btc = btc + rig.running * rig.hashingPower;
            money = money - rig.running * rig.powerUsage;
        });

        chart.update();
        
        // random chance of crash
        var d = Math.random();
        if (d<0.02){
            stockTIme = stockTIme * (0.1 + 0.4*Math.random());
            console.log("SCHOCK!");
        }
       else if (d>0.98){
            stockTIme = stockTIme + 50*(Math.random()+1);
            console.log("BOOM!");
        }
        // Update Stock range
        var growthFactor = 1.02;
        stock.min = stock.originalMin * Math.pow(growthFactor,stockTIme);
        stock.max = stock.min * 2+1;//+Math.min(100,Math.max(stock.min*0.1,2));
        console.log("min/max: " + stock.min + "/" + stock.max + "/" + stockTIme);


        $("#price").text(price);
        $("#money").text(money);
        $("#btc").text(btc);
        $("#pcAvailable").text(pc.available);
        $("#pcRunning").text(pc.running);
        $("#pcPrice").text(pc.price);
        $("#pcSellPrice").text(pc.sellPrice);
        $("#MiningPCAvailable").text(miningPC.available);
        $("#MiningPCRunning").text(miningPC.running);
        $("#MiningPCPrice").text(miningPC.price);
        $("#MiningPCSellPrice").text(miningPC.sellPrice);
        $("#ASICSAvailable").text(asics.available);
        $("#ASICSRunning").text(asics.running);
        $("#ASICSPrice").text(asics.price);
        $("#ASICSSellPrice").text(asics.sellPrice);
        $("#buyBTC").prop("disabled",false);
        $("#sellBTC").prop("disabled",false);



    }



    function sellBTC(){
        var amount  = parseFloat($("#sellBTCAmount").val());
        console.log("sell: " + amount);
        if (btc >= amount) {
            btc = btc -amount;
            money = money + amount * price;
            $("#money").text(money);
            $("#btc").text(btc);
            $("#sellBTC").prop("disabled",true);
        }
    }
    function buyBTC(){
        var amount  = parseFloat($("#buyBTCAmount").val());
        console.log("buy: " + amount);
        if (money >= amount) {
            money = money -amount;
            btc = btc + amount / price;
            $("#money").text(money);
            $("#btc").text(btc);
            $("#buyBTC").prop("disabled",true);
        }
    }


    function buyRig(event){
        var rig = event.data;
        if (money>=rig.price && rig.available < rig.max){
            money -= rig.price;
            rig.available +=1;
        }
    }
    function sellRig(event){
        var rig = event.data;
        if (rig.available>0){
            money += rig.sellPrice;
            rig.available -=1;
            if (rig.running<rig.available){
                rig.running = rig.available
            }
        }
    }

    function startRig(event){
        var rig = event.data;
        if (rig.running<rig.available){
            rig.running++;
        }
    }
    function stopRig(event){
        var rig = event.data;
        if (rig.running>0){
            rig.running--;
        }
    }

    function toggleRunning(){
        console.log(loopTimer);
        console.log(isRunning);
        if (isRunning){
            clearInterval(loopTimer);
            isRunning = false;
            console.log("paused");
            $("#toggleRunning").text("Continue");
            $(".pie").addClass("noanim");
            $(".mask").addClass("noanim");
            $(".wrapper").hide();
        } else{
            loopTimer = setInterval(mainloop, 3000);
            isRunning = true;
            console.log("running");
            $("#toggleRunning").text("Pause");
            $(".pie").removeClass("noanim");
            $(".mask").removeClass("noanim");
            $(".wrapper").show();
        }
    }

    var data = {
        // A labels array that can contain any sort of values
        //labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        // Our series array that contains series objects or in this case series data arrays
        series: [
          stock.pastValuesChart
        ]
      };
      
      // Create a new line chart object where as first parameter we pass in a selector
      // that is resolving to our chart container element. The Second parameter
      // is the actual data object.
      var options = { height: 150};
      var chart = new Chartist.Line('.ct-chart', data,options);

