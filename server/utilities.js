var queries = require('./queries.js');
var memoBuild = memoize(buildFunc);

module.exports.evalAlg = function(userInput, dataType) {
  console.log('U4-evaluating algorithm with server data');

  // TODO: add queries file, get data inputs from database, save in respective variables
  
  var data = queries.getData(dataType);

  /*
  powX represents tests for data size Math.pow(10, X). e.g. 10^3 for 1,000
  skip pow1 because results not accurate for input size < 100
  possibly include pow7 if sizes of ten million are feasible

  TODO: include 60 - 90 second timeout for pow5 and pow6 depending on results
  */

  var pow2 = runTimeAverage(userInput, data[0], 8);
  var pow3 = runTimeAverage(userInput, data[1], 6);
  var pow4 = runTimeAverage(userInput, data[2], 3);
  var pow5 = getRunTime(userInput, data[3]);
  var pow6 = getRunTime(userInput, data[4]);

  return [pow2, pow3, pow4, pow5, pow6];
}

module.exports.getCoords = function(data) {
  console.log('U24-getting d3-readable coordinates from eval data');

  var coords = [];

  // TODO: refactor to include worst and best case : data[i][2], data[i][3]

  for (var i = 0; i < data.length; i++) {
    if (data[i][3] && data[i][4]) {
      coords.push({x_axis: data[i][0], y_axis: data[i][1], worst: data[i][2], best: data[i][3]});  
    } else {
      coords.push({x_axis: data[i][0], y_axis: data[i][1]});
    }
  }

  // returns json: '[{runTime, N, [worst, best case for averaged inputs]}]' for each input size N
  return JSON.stringify(coords);
}

function runTimeAverage(userInput, dbInput, iterations) {
  console.log('U34-calculating runtime average for N = ' + dbInput.length);

  var total = 0;
  var i = 0;
  var averageRun;
  var stats;

  while (i < iterations) {
    stats = getRunTime(userInput, dbInput);
    total += stats[1];
    i++;
  }
  averageRun = total / iterations;

  // TODO: include worst and best case : Math.max(times), Math.min(times) & for getRunTime
  // returns [input size N, average runtime in milliseconds, worst, best]
  return [stats[0], Number(averageRun.toFixed(3))];
}

function getRunTime(userInput, dbInput) {
  console.log('U51-calculating single runtime for N = ' + dbInput.length);

  var userAlg = memoBuild(userInput);
  var time = process.hrtime();
  var result = userAlg(dbInput);
  var diff = process.hrtime(time);
  var runTime = (diff[0] * 1e9 + diff[1]) / 1e6;

  // returns [N, runtime in milliseconds]
  return [dbInput.length, Number(runTime.toFixed(3))];
}

function memoize(func) {
  var cached = {};

  return function() {
    var args = Array.prototype.slice.call(arguments);
    if (!cached[args]) {
      cached[args] = func.apply(this, arguments);
    }

    return cached[args];
  };
};

function buildFunc(userInput) {
  var param = userInput.slice(userInput.indexOf('(') + 1, userInput.indexOf(')'));
  var algName = getFuncName(userInput);
  var algString = userInput.slice(userInput.indexOf('{') + 1, userInput.lastIndexOf('}'));
  var userAlg = new Function(param, algString);

  console.log('U67-created ' + algName + ' algorithm with user input');
  
  return userAlg;
}

function getFuncName(string) {
  var dStop = string.indexOf('=');
  var eStop = string.indexOf('(');
  var funcName;

  if (string.substr(0,3) === 'var') {
    if (string[--dStop] === ' ') {
      funcName = string.slice(4, dStop);
    } else {
      funcName = string.slice(4, ++dStop);
    }
  } else if (string.substr(0, 8) === 'function') {
    if (string[--eStop] === ' ') {
      funcName = string.slice(9, eStop);
    } else {
      funcName = string.slice(9, ++eStop);
    }
  } else {
      alert ('Please use a function expression or declaration\ne.g. `var myFunc = ...` or `function myFunc()...`');
  }

  return funcName;
}

