var Promise = require('bluebird');
var regression = require('regression');
var queries = require('./queries.js');
var child_process = require('child_process');
var fs = require('fs');

(function() {
    var child_process = require("child_process");
    var oldFork = child_process.fork;
    function newFork() {
        console.log('forked child process with args:');
        console.log(arguments);
        var result = oldFork.apply(this, arguments);
        return result;
    }
    child_process.fork = newFork;
})();

module.exports.evalAlg = function(userInput, dataType) {
  return new Promise(function(resolve, reject) {
    var pwd = process.cwd();
    var results;

    var child = child_process.fork(__dirname + '/syncTest.js', {silent: true, cwd: pwd});
    
    var mainTimer = setTimeout(function () {
      child.kill('SIGINT');
      console.log('eval timed out, killed child process');
      resolve('timeout');
    }, 8000);
  
    child.stdout.on('data', function(data) {
      console.log('child process complete, results: ' + data);
      if (data === 'err') {
        resolve(data);
      }

      results = JSON.parse(data);
      clearTimeout(mainTimer);
      resolve(results);
    });

    // write userInput to file async
    fs.writeFile('server/testingBuffers/algorithmBuffer.txt', userInput, function(err) {
      if (err) throw err;
      console.log('wrote file for algorithm');

      child.send('wrote');
    });

  /*
    // to write test inputs to file
    fs.writeFile('server/testInputBuffer.txt', inputs, function(err) {
      if (err) throw err;
      console.log('wrote inputs file async');
    });
  */
    
  });
};

module.exports.getJSONCoords = function(data) {
  console.log('eval -getting json coordinates from eval data');

  // starting value initialize log scale graph
  var coords = [{x_axis: 10, y_axis: 0}];

  for (var i = 0; i < data.length; i++) {
    coords.push({x_axis: data[i][0], y_axis: data[i][1]});
  }

  return JSON.stringify(coords);
};

module.exports.runRegression = function(data, order) {
  order = order || '1';
  var result;
  var coef;
  var equation;

  switch (order) {
    case ('2+'): 
      result = regression('power', data);
      coef = result.equation;
      equation = 'y = ' + coef[0].toExponential(2) + ' x^' + coef[1].toFixed(2);
      break;
    case ('1'): 
      result = regression('linear', data);
      coef = result.equation;
      equation = 'y = ' + coef[0].toExponential(2) + 'x + ' + coef[1].toExponential(2);
      break;
    case ('ln'): 
      result = regression('logarithmic', data);
      coef = result.equation;
      equation = 'y = ' + coef[0].toExponential(2) + ' + ' + coef[1].toExponential(2) + 'ln(x)';
      break;
    default: 
      result = regression('linearThroughOrigin', data);
      coef = result.equation;
      equation = 'y = ' + coef[0].toExponential(2) + 'x';
  }

  console.log('equation from regression: ' + equation);

  return equation;
};
