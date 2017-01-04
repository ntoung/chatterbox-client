// YOUR CODE HERE:
var app = {storage:{messages:[]}};


app.init = function() {
  app.username;
  app.roomname;
  app.fetch();
  app.getRooms();

  setInterval(app.refresh, 10000);

  
};

app.submit = function() {
  console.log('submit' + $('#rooms').val());
  
  if (!$('#formText').val()) { 
    console.log('invalid');
    return; 
  }


  var message = {
    username: $('#formUsername').val() ? $('#formUsername').val()
     : clean(getParameterByName('username')),
    text: clean($('#formText').val()),
    roomname: $('#rooms').val()
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

app.filter = function(options) {
  console.log('chatterbox: filtering');
  if (options === 'rooms') {

    app.roomname = _.filter($('#rooms')[0], function(option) {
      return option.selected;
    }).outerText;

    console.log(app.roomname);


    var filteredRooms = _.filter(app.storage.messages, function(message) {
      console.log(message.roomname + " " + app.roomname);
      return message.roomname === app.roomname;
    });

    debugger;

    app.__displayMessages(filteredRooms);

    // _.each(_.keys(rooms), function(room) {
    //   room = clean(room);

    //   var option = $('<option></option>').attr('value', room).text(room);
    //   $('#rooms').append(option);
    // });
  }
}

app.fetch = function() {
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
    app.storage.messages = data;
    app.__displayMessages(data);
  });
};


app.refresh = function() {
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
    app.storage.messages = data;
    app.__displayMessages(data);
  });
};

app.__displayMessages = function(data) {
  var createMessage = function(data) {
    var username = $('<strong></strong>').text(clean(data.username));
    var text = $('<p></p>').text(clean(data.text));
    
    return [username, text];
  };

  $('.messages').empty();

  data.results.forEach(function(data) {
    $('.messages').append(createMessage(data));  
  });
}

app.getRooms = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    data: {orderBy: '-createdAt', limit: '1000'},
    contentType: 'application/json; charset=utf-8;',
    success: function (data) {
      console.log('chatterbox: Rooms receieved');
    }
  }).done(function(data) {
    var rooms = {};

    data.results.forEach(function(message) {
      if (!rooms[message.roomname]) {
        rooms[message.roomname] = true;
      }
    });

    _.each(_.keys(rooms), function(room) {
      room = clean(room);

      var option = $('<option></option>').attr('value', room).text(room);
      $('#rooms').append(option);
    });

  })
}


// ESCAPING UTILITIES

var ESC_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
  '(': '&#28;',
  ')': '&#29;',
  ':': '&#2A;',
  ';': '&#2B;',
  '.': '&#2E;'

};

var clean = function(s, forAttribute) {
  if (!s) { return; }
  return s.replace(forAttribute ? /[&<>'"();:.]/g : /[&<>();:.]/g, function(c) {
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
