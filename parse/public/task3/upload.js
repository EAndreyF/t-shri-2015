$(function() {
  Audio.init();
});

var Audio = {
  init: function() {
    var input = $('.upload__input');
    input.on('change', Audio.load);

    var body = $('body');
    body.on('dragenter', Audio.dragenter);
    body.on('dragover', Audio.dragover);
    body.on('drop', Audio.drop);
  },

  dragenter: function(e) {
    $('.dropzone').show();
    e.stopPropagation();
    e.preventDefault();
  },

  dragover: function(e) {
    e.stopPropagation();
    e.preventDefault();
  },

  drop: function(e) {
    $('.dropzone').hide();
    var file = e.originalEvent.dataTransfer.files[0];
    Audio.changeFile(file);
    e.stopPropagation();
    e.preventDefault();
  },

  changeFile: function(file) {
    Audio.readFile(file)
      .then(function(data) {
        Audio.update(data);
      }, function(err) {
        if (err) {
          alert(err);
        }
      });
  },

  update: function(fileData) {
    var aa = $('.audio')[0];
    aa.src = fileData;
    aa.play();
  },

  readFile: function(file) {
    var res = $.Deferred();
    if (file) {
      var reader = new window.FileReader();

      reader.onloadend = function () {
        if (/^data:audio\//.test(reader.result)) {
          res.resolve(reader.result);
        } else {
          res.reject('Не верный формат файла');
        }
      };

      reader.readAsDataURL(file);
    } else {
      res.reject();
    }

    return res;
  },

  load: function() {
    var input = $('.upload__input');
    var file = input[0].files[0];
    Audio.changeFile(file);
  }
};