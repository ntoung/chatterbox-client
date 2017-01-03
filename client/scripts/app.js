// YOUR CODE HERE:
var app = {};

var message = {
  username: 'shawndrost',
  text: 'trololo',
  roomname: '4chan'
};

var ESC_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;'
};

var clean = function(s, forAttribute) {
  return s.replace(forAttribute ? /[&<>'"]/g : /[&<>]/g, function(c) {
    return ESC_MAP[c];
  });
};

var obj = $.ajax({
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
});

var messages = $.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: 'https://api.parse.com/1/classes/messages',
  type: 'GET',
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

  data.results.forEach(function(data) {
    $('#messages').append(createMessage(data));  
  });
  
});


var createMessage = function(data) {
  var username = $('<strong></strong>').text(clean(data.username));
  var text = $('<p></p>').text(clean(data.text));
  
  return [username, text];
};
