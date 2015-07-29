$(function() {
  window.Spectrum = {
    get: function(context, canvas) {
      return new Visualizer(context, canvas);
    }
  };

  var Visualizer = function(context, canvas) {
    this.ctx = context;
    this.canvas = canvas;
    this.setDefault();
  };

  Visualizer.prototype.setDefault = function() {
    this.recNum = 40; // количество прямоугольников
    this.maxDb = 60;
    this.lastMaxHz = this.recNum;
    this.defaultHz = this.recNum;
    console.log('NEW');
  };

  Visualizer.prototype.update = function() {
    this.setDefault();
  };

  Visualizer.prototype.load = function() {
    var analyser = this.ctx.createAnalyser();
    this._drawSpectrum(analyser);
    return analyser;
  };

  Visualizer.prototype.start = function() {
    this.stopped = false; // Окончание остановки, все капы опустились до нулевого значения
    this.stopping = false; // Начало остановки
    requestAnimationFrame(this.drawMeter);
  };

  Visualizer.prototype.stop = function() {
    this.stopping = true;
  };

  Visualizer.prototype._drawSpectrum = function(analyser) {
    var _this = this;
    var canvas = this.canvas;
    var cwidth = canvas.width;
    var cheight = canvas.height;
    var recDif = 1; // расстояние между прямоугольниками
    var recWidth = Math.floor((cwidth + recDif) / this.recNum - recDif); // ширина одного прямоугольника

    var capHeight = 2;
    var capStyle = '#bbb';
    var capYPositionArray = Array.apply(Array, new Array(this.recNum)).map(function() { return 0; }); // Массив, заполненный нулями

    var ctx = canvas.getContext('2d');
    var gradient = ctx.createLinearGradient(0, 0, 0, cheight);
    gradient.addColorStop(1, '#0f0');
    gradient.addColorStop(0.5, '#ff0');
    gradient.addColorStop(0, '#f00');

//    analyser.fftSize = 8192;
    var array = new Uint8Array(analyser.frequencyBinCount);

    var drawMeter = function () {
      console.log('viz');
      var i, j, valueCf;
      analyser.getByteFrequencyData(array);

      var last = array.length; // Последнее не нулевое значение. Чтобы показывать только значащие данные
      while (array[--last] === 0 && last > 0);
      if (last !== 0) { // Если все значения нулевые, то не рисуем ничего
        if (_this.lastMaxHz > last) { // Корректируем количество значащих частот
          last = Math.max(Math.floor(0.9 * _this.lastMaxHz + 0.1 * last), _this.defaultHz);
        }
        _this.lastMaxHz = last;

        var step = Math.floor(_this.lastMaxHz / _this.recNum);

        for (i = 0, j = last; i < j; i++) {
          if (array[i] > _this.maxDb) {
            _this.maxDb = array[i];
          }
        }

        valueCf = (cheight - capHeight) / _this.maxDb;

        ctx.clearRect(0, 0, cwidth, cheight);
        for (i = 0; i < _this.recNum; i++) {
          var value = array[i * step];

          if (value > capYPositionArray[i]) {
            capYPositionArray[i] = value;
          }
          ctx.fillStyle = capStyle;
          ctx.fillRect(i * (recWidth + recDif), cheight - valueCf * (capYPositionArray[i]--) - capHeight, recWidth, capHeight);

          ctx.fillStyle = gradient;
          ctx.fillRect(i * (recWidth + recDif), cheight - valueCf * value, recWidth, cheight);
        }
      } else {
        ctx.clearRect(0, 0, cwidth, cheight);
        valueCf = (cheight - capHeight) / _this.maxDb;
        var flag = 0;
        for (i = 0; i < _this.recNum; i++) {
          capYPositionArray[i] = Math.max(0, capYPositionArray[i] - 1);
          if (capYPositionArray[i]) {
            flag = 1;
          }
          ctx.fillStyle = capStyle;
          ctx.fillRect(i * (recWidth + recDif), cheight - valueCf * capYPositionArray[i] - capHeight, recWidth, capHeight);
        }
        if (!flag && _this.stopping) {
          _this.stopped = true;
        }
      }
      !_this.stopped && requestAnimationFrame(drawMeter);
    };
    this.drawMeter = drawMeter;
  };
});
