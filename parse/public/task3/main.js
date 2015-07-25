//window.AudioContext = window.AudioContext || window.webkitAudioContext;
//var context = new AudioContext();
//
//var audio = document.getElementById('audio');
//
//var source = context.createMediaElementSource(audio);
//source.connect(context.destination);
//
//var createFilter = function (frequency) {
//  var filter = context.createBiquadFilter();
//
//  filter.type = 'peaking'; // тип фильтра
//  filter.frequency.value = frequency; // частота
//  filter.Q.value = 1; // Q-factor
//  filter.gain.value = 0;
//
//  return filter;
//};