'use strict';

var fromUser = '.from-user';
var fromWatson = '.from-watson';
var latest = '.latest';
var ENDPOINT = '/api/converse';

// Display a user or Watson message that has just been sent/received
function displayMessage(payload, isUser) {
  var messageDiv = buildMessageDomElement(payload, isUser);
  var chatBoxElement = document.querySelector('#scrollingChat');
  var previousLatest = chatBoxElement.querySelector((isUser ? fromUser : fromWatson) + latest);
  // Previous "latest" message is no longer the most recent
  if (previousLatest) {
    previousLatest.classList.remove('latest');
  }

  chatBoxElement.appendChild(messageDiv);
  // Class to start fade in animation
  messageDiv.classList.add('load');
  // Move chat to the most recent messages when new messages are added
  scrollToChatBottom();
}

// Constructs new DOM element from a message payload
function buildMessageDomElement(payload, isUser) {
  var text = isUser ? payload.text : payload.output.answer;

  var messageDiv = document.createElement('div');
  messageDiv.classList.add('segments');

  var textDiv = document.createElement('div');
  textDiv.classList.add(isUser ? 'from-user' : 'from-watson');
  textDiv.classList.add('latest');
  messageDiv.appendChild(textDiv);

  var innerDiv = document.createElement('div');
  innerDiv.classList.add('message-inner');
  textDiv.appendChild(innerDiv);

  var textP = document.createElement('p');
  textP.classList.add('padding');
  innerDiv.appendChild(textP);
  textP.innerHTML = text;

  return messageDiv;
}

// Scroll to the bottom of the chat window (to the most recent messages)
// Note: this method will bring the most recent user message into view,
//   even if the most recent message is from Watson.
//   This is done so that the "context" of the conversation is maintained in the view,
//   even if the Watson message is long (i.e. has KE documents).
function scrollToChatBottom() {
  var scrollingChat = document.querySelector('#scrollingChat');
  var messages = scrollingChat.children;
  var lastMessage = messages[messages.length - 1];

  // If the most recent message is from Watson, move
  var top = false;
  var scrollEl = lastMessage.querySelector(fromWatson + latest);
  if (scrollEl) {
    top = true;
  }

  // Scroll to the latest message sent by the user
  scrollEl = scrollingChat.querySelector(fromUser + latest);
  if (scrollEl) {
    scrollEl.scrollIntoView({
      behavior: 'smooth', // Only supported by Firefox, but including doesn't break other browsers
      block: (top ? 'start' : 'end')
    });
  }
}

// Handles the submission of input
function inputKeyDown(event, inputBox) {
  // Submit on enter key, dis-allowing blank messages
  if (event && event.keyCode === 13 && inputBox.value) {
    // Send the user message
    sendRequest(inputBox.value);

    // Clear input box for further messages
    inputBox.value = '';
  }
}
// do not remove otherwise eslint will fail 🐷
inputKeyDown();

function displayPayload(payload) {
  var payloadDiv = buildPayloadDomElement(payload);
  var payloadElement = document.querySelector('#payload-response');
  while (payloadElement.lastChild) {
    payloadElement.removeChild(payloadElement.lastChild);
  }
  payloadElement.appendChild(payloadDiv);
}

function buildPayloadDomElement(payload) {
  var containerDiv = document.createElement('div');
  containerDiv.classList.add('responsive-columns-wrapper');
  var payloadDiv = document.createElement('div');
  payloadDiv.classList.add('responsive-column');
  payloadDiv.classList.add('pre-wrapper');
  containerDiv.appendChild(payloadDiv);
  var pre = document.createElement('pre');
  payloadDiv.appendChild(pre);
  var preText = document.createTextNode('Payload from Watson:');
  pre.appendChild(preText);
  var payloadPrettyString = jsonPrettyPrint(payload);
  pre.insertAdjacentHTML('beforeend', '\n' + payloadPrettyString);
  return containerDiv;
}

function jsonPrettyPrint(json) {
  if (!json) {
    return '';
  }
  var convert = JSON.stringify(json, null, 2);

  convert = convert.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  convert = convert.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function(match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  return convert;
}

function sendRequest(text) {
  var payload = { text: text};
  displayMessage(payload, true);
  $.get(ENDPOINT, { text: text }).always(function(response) {
    displayMessage(response, false);
    displayPayload(response);
  });
}


/* James UI Code */

function loadQuote(count, countLimit, callback) {
  if (count !== countLimit) {
    callback(count);
    setTimeout(function() {
      loadQuote(count + 1, countLimit, callback);
    }, 1000);
  } else {
    return null;
  }
}

setTimeout(function() {
  $('.jeff-quote').addClass('jeff-quote_hidden');
}, 3000);

$(document).click(function() {
  $('.jeff-quote').addClass('jeff-quote_hidden');
  $('.jeff-quote').hide();
});

$(document).on('click', '.banner--service-icon-container', function(e) {
  e.stopPropagation();
  /* show jeff quote */
  $('.jeff-quote').show();
  $('.jeff-quote').removeClass('jeff-quote_hidden');
  /* reset jeff quote */
  $('.jeff-quote--' + 2).removeClass('jeff-quote--' + 2 + '_show');
  $('.jeff-quote--' + 3).removeClass('jeff-quote--' + 3 + '_show');
  setTimeout(function() {
    loadQuote(1, 4, function(count) {
      $('.jeff-quote--' + count).addClass('jeff-quote--' + count + '_show');
    });
  }, 200);
  setTimeout(function() {
    $('.jeff-quote').addClass('jeff-quote_hidden');
  }, 3000);
});

$(document).on('click', '.payload-column', function(e) {
  e.stopPropagation();
  $('.payload-column').toggleClass('payload-column_expanded');
});

loadQuote(1, 4, function(count) {
  $('.jeff-quote--' + count).addClass('jeff-quote--' + count + '_show');
});
