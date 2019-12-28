const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
var port;
var parser;

$(document).ready(function() {
  SerialPort.list((err, ports) => {
    console.log(ports);
  
    if (ports.length === 0) {
      $('#ports').append(new Option("Không có cổng nào", ""))
    }
    ports.forEach((e) => {
      $('#ports').append(`<option value="${e.comName}">${e.comName}</option>`);
    }) 
  })
});

function updatePort(portSelected)
{
  //$('#buttonUpdate').attr("disabled", true);
  
  console.log(portSelected);
  port = new SerialPort(portSelected, { baudRate: 9600 });
  parser = port.pipe(new Readline({ delimiter: '\n' }));

  parser.on('data', sensor => {
    getNewSeries(lastDate, {
      data: sensor
    })
    chart.updateSeries([{
      data: data
    }])
  });
}



var lastDate = 0;
var data = []
var TICKINTERVAL = 1000
let XAXISRANGE = 9000
function getDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    while (i < count) {
        var x = baseval;
        var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        data.push({
            x, y
        });
        lastDate = baseval
        baseval += TICKINTERVAL;
        i++;
    }
}

getDayWiseTimeSeries(new Date(Date.now()).getTime(), 10, {
    min: 0,
    max: 0
})

function getNewSeries(baseval, yrange) {
    var newDate = baseval + TICKINTERVAL;
    lastDate = newDate

    for(var i = 0; i< data.length - 10; i++) {
        // IMPORTANT
        // we reset the x and y of the data which is out of drawing area
        // to prevent memory leaks
        data[i].x = newDate - XAXISRANGE - TICKINTERVAL
        data[i].y = 0
    }
    
    data.push({
        x: newDate,
        y: yrange.data
    })
    
}

function resetData(){
    // Alternatively, you can also reset the data at certain intervals to prevent creating a huge series 
    data = data.slice(data.length - 10, data.length);
}

var options = {
    chart: {
        height: 350,
        type: 'line',
        animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
                speed: 1000
            }
        },
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    series: [{
        data: data
    }],
    title: {
        text: 'Biểu Đồ Mật Độ Bụi Trong Không Khí (µg/m3)',
        align: 'left'
    },
    markers: {
        size: 0
    },
    xaxis: {
        type: 'time',
        //range: XAXISRANGE,
        labels: {
          formatter: function (value, timestamp) {
            var date_now = new Date(timestamp);
            return (date_now.getMinutes() + ":" + date_now.getSeconds());// The formatter function overrides format property
          }, 
        }
    },
    yaxis: {
        max: 50
    },
    legend: {
        show: false
    },
}

var chart = new ApexCharts(
    document.querySelector("#chart"),
    options
);

chart.render();






