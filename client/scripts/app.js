// YOUR CODE HERE:
var app = {};

app.init = function() {
  app.username;
  app.fetch();
  app.getRooms();

  setInterval(app.refresh, 10000);
};

app.submit = function() {
  console.log('submit');
  
  if (!$('#formText').val()) { 
    console.log('invalid');
    return; 
  }

  var message = {
    username: $('#formUsername').val() ? $('#formUsername').val()
     : clean(getParameterByName('username')),
    text: clean($('#formText').val()),
    //roomname: '4chan'
  };

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json; charset=utf-8',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  }).done(function() {
    app.refresh();
  });
};


app.fetch = app.refresh = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    data: {order: '-createdAt', limit: '100'},
    contentType: 'application/json; charset=utf-8',
    success: function (data) {
      console.log('chatterbox: Messages received');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message', data);
    }
  }).done(function(data) {
    console.log(data);

    var createMessage = function(data) {
      var username = $('<strong></strong>').text(clean(data.username));
      var text = $('<p></p>').text(clean(data.text));
      
      return [username, text];
    };

    $('.messages').empty();

    data.results.forEach(function(data) {
      $('.messages').append(createMessage(data));  
    });
  });
};

app.getRooms = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    contentType: 'application/json; charset=utf-8;',
    success: function (data) {
      console.log('chatterbox: Rooms receieved');
    }
  })
}


// ESCAPING UTILITIES

var ESC_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;'
};

var clean = function(s, forAttribute) {
  if (!s) { return; }
  return s.replace(forAttribute ? /[&<>'"]/g : /[&<>]/g, function(c) {
    return ESC_MAP[c];
  });
};

// UTILITY FUNCTION

var getParameterByName = function(name, url) {
  if (!url) {
    url = window.location.href;
  }

  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  var results = regex.exec(url);
  if (!results) {
    return null;
  } else if (!results[2]) {
    return '';
  }

  app.username = clean(decodeURIComponent(results[2].replace(/\+/g, ' ')));

  return app.username;
};



app.init();
