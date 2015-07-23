/**
 * Реализация API, не изменяйте ее
 * @param {string} url
 * @param {function} callback
 */
function getData(url, callback) {
  var RESPONSES = {
    '/countries': [
      {name: 'Cameroon', continent: 'Africa'},
      {name: 'Fiji Islands', continent: 'Oceania'},
      {name: 'Guatemala', continent: 'North America'},
      {name: 'Japan', continent: 'Asia'},
      {name: 'Yugoslavia', continent: 'Europe'},
      {name: 'Tanzania', continent: 'Africa'}
    ],
    '/cities': [
      {name: 'Bamenda', country: 'Cameroon'},
      {name: 'Suva', country: 'Fiji Islands'},
      {name: 'Quetzaltenango', country: 'Guatemala'},
      {name: 'Osaka', country: 'Japan'},
      {name: 'Subotica', country: 'Yugoslavia'},
      {name: 'Zanzibar', country: 'Tanzania'}
    ],
    '/populations': [
      {count: 138000, name: 'Bamenda'},
      {count: 77366, name: 'Suva'},
      {count: 90801, name: 'Quetzaltenango'},
      {count: 2595674, name: 'Osaka'},
      {count: 100386, name: 'Subotica'},
      {count: 157634, name: 'Zanzibar'}
    ]
  };

  setTimeout(function () {
    var result = RESPONSES[url];
    if (!result) {
      return callback('Unknown url');
    }

    callback(null, result);
  }, Math.round(Math.random * 1000));
}

/**
 * Допущеная ошибка типична для начинающего разработчика. Создается не правильное замыкание.
 * Переменная request изменяется внутри цикла и послднее её значение вызывается в callback,
 * в результате в responses находится только один элемент, а не 3 - что требуется для вывода сообщения в консоль.
 * В дальнейшем нужно быть всегда осторожным при вызове колбеков,
 * внимательно проверять какие переменные используются внутри и какие переменные могут измениться снаружи.
 * По поводу множественных асинхронных запросов. Лучше использовать промисы. Облегчают поддержку, сокращают объем кода.
 */
var requests = ['/countries', '/cities', '/populations'];
var responses = {};

requests.forEach(function(request) {
  var callback = function (error, result) {
    responses[request] = result;
    var l = [];
    for (K in responses)
      l.push(K);

    if (l.length == 3) {
      var c = [], cc = [], p = 0;
      for (i = 0; i < responses['/countries'].length; i++) {
        if (responses['/countries'][i].continent === 'Africa') {
          c.push(responses['/countries'][i].name);
        }
      }

      for (i = 0; i < responses['/cities'].length; i++) {
        for (j = 0; j < c.length; j++) {
          if (responses['/cities'][i].country === c[j]) {
            cc.push(responses['/cities'][i].name);
          }
        }
      }

      for (i = 0; i < responses['/populations'].length; i++) {
        for (j = 0; j < cc.length; j++) {
          if (responses['/populations'][i].name === cc[j]) {
            p += responses['/populations'][i].count;
          }
        }
      }

      console.log('Total population in African cities: ' + p);
    }
  };

  getData(request, callback);
});

var getCountryPopulation = function() {
  var country = window.prompt('Введите название страны');
  if (country !== null) {
    var cities = [], population = {};
    var cnt = 0;

    getData(requests[1], function(err, data) {
      if (!err) {
        cnt++;
        data.forEach(function(city) {
          if (city.country === country) {
            cities.push(city.name);
          }
        });

        if (cnt === 2) {
          completed()
        }
      } else {
        alert('Сервер не доступен. Пожалуйста, попробуйте позже!');
      }
    });

    getData(requests[2], function(err, data) {
      if (!err) {
        cnt++;
        data.forEach(function(pop) {
          population[pop.name] = pop.count;
        });

        if (cnt === 2) {
          completed()
        }
      } else {
        alert('Сервер не доступен. Пожалуйста, попробуйте позже!');
      }
    });

    var completed = function() {
      var total = 0;
      cities.forEach(function(city) {
        total += population[city] || 0;
      });
      if (!total) {
        alert('Страна не найдена');
      } else {
        alert('Население страны ' + country + ' = ' + total);
      }
    }
  }
};

var getCityPopulation = function() {
  var city = window.prompt('Введите название города');
  if (city !== null) {
    getData(requests[2], function(err, data) {
      if (!err) {
        var population;
        if (data.some(function(pop) {
          if (pop.name === city) {
            population = pop.count;
            return true;
          }
        })) {
          alert('Население города ' + city + ' = ' + population);
        } else {
          alert('Город не найден');
        }
      } else {
        alert('Сервер не доступен. Пожалуйста, попробуйте позже!');
      }
    });
  }

};