$(function() {
  window.Equalizer = {
    get: function(ctx, panel) {
      var eq = new EQ(ctx, panel);
      return eq.equalize();
    }
  };

  var EQ = function(ctx, panel) {
    var _this = this;
    this.ctx = ctx;
    this.panel = panel;
    var frequencies = [];
    this.frequenciesHash = {};

    panel.find('.eq-block__range').each(function(i, el) {
      var hz = +el.dataset.value;
      frequencies.push(hz);
      _this.frequenciesHash[hz] = { el: el, $el: $(el) };
    });
    this.frequencies = frequencies;

    this.addListeners();
  };

  EQ.presets = {
    classic: {
      32: 5,
      64: 4,
      125: 3,
      250: 2,
      500: -2,
      1000: -2,
      2000: 0,
      4000: 2,
      8000: 3,
      16000: 3
    },
    jazz: {
      32: 4,
      64: 3,
      125: 1,
      250: 2,
      500: -2,
      1000: -2,
      2000: 0,
      4000: 1,
      8000: 2,
      16000: 3
    },
    pop: {
      32: -2,
      64: -1,
      125: 0,
      250: 2,
      500: 4,
      1000: 4,
      2000: 2,
      4000: 0,
      8000: -1,
      16000: -2
    },
    rock: {
      32: 5,
      64: 4,
      125: 3,
      250: 1,
      500: -1,
      1000: -1,
      2000: 0,
      4000: 2,
      8000: 3,
      16000: 4
    }
  };

  EQ.prototype.addListeners = function() {
    var _this = this;
    var select = $('.eq-type');
    var reset = function() {
      for(var key in _this.frequenciesHash) {
        _this.frequenciesHash[key].filter.gain.value = 0;
        _this.frequenciesHash[key].el.value = 0;
      }
      select.val(0);
    };

    var applyPreset = function(preset) {
      for(var key in preset) {
        _this.frequenciesHash[key].filter.gain.value = preset[key];
        _this.frequenciesHash[key].el.value = preset[key];
      }
    };

    this.panel.find('.eq-reset').click(function() {
      reset();
    });


    for(var key in this.frequenciesHash) {
      this.frequenciesHash[key].$el.on('change', function(e) {
        var el = e.target;
        var hz = +el.dataset.value;
        var val = el.value;
        _this.frequenciesHash[hz].filter.gain.value = val;
        select.val(0);
      });
    }

    select.on('change', function(e) {
      var val = e.target.value;
      if (val === '0') {
        reset();
      } else {
        var preset = EQ.presets[val];
        if (preset) {
          applyPreset(preset);
        }
      }
    });
  };

  EQ.prototype.createFilters = function () {
    var _this = this;
    var filters = this.frequencies.map(function(frequency, i) {
        var filter = _this.ctx.createBiquadFilter();

        filter.type = 'peaking'; // тип фильтра
        filter.frequency.value = frequency; // частота
        filter.Q.value = 1; // Q-factor
        filter.gain.value = 0;

        _this.frequenciesHash[frequency].filter = filter;

        return filter;
      });

    filters.reduce(function (prev, curr) {
      prev.connect(curr);
      return curr;
    });

    return filters;
  };

  EQ.prototype.equalize = function () {
    var filters = this.createFilters();
    // источник цепляем к первому фильтру
    // а последний фильтр - к выходу
    return [filters[0], filters[filters.length - 1]];
  };
});