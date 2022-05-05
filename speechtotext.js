var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    if (!final_transcript) {
      return;
    }
  };

  var listen = 0;
  var cancel = 0;

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        switch (event.results[i][0].transcript) {
            case "hey AI":
                TTS("How can I help?", 'en-us');
                listen=1;
                cancel=0;
                break;
            case "hey":
                TTS("How can I help?", 'en-us');
                listen=1;
                cancel=0;
                break;
            case "hey I":
                TTS("How can I help?", 'en-us');
                listen=1;
                cancel=0;
                break;
            case "hey emo":
                TTS("Listening!", 'en-us');
                listen=1;
                cancel=0;
                break;
            case "hey robot":
                TTS("Hello!", 'en-us');
                listen=1;
                cancel=0;
                break;
            case "stop listening":
                if (cancel==1) {
                    TTS("Ok, bye!", 'en-us');
                    cancel=0;
                    listen=0;
                    recognition.stop();
                }
                TTS("Are you sure?", 'en-us');
                cancel=1;
                listen=0;
                break;
            case "yes":
                if (cancel==1) {
                    TTS("Ok, bye!", 'en-us');
                    cancel=0;
                    listen=0;
                    recognition.stop();
                }
                break;
            case "yeah":
                if (cancel==1) {
                    TTS("Ok, bye!", 'en-us');
                    cancel=0;
                    listen=0;
                    recognition.stop();
                }
                break;
            case "no":
                if (cancel==1) {
                TTS("Ok", 'en-us');
                cancel=0;
                listen=0;
                }
                break;
            case "nah":
                if (cancel==1) {
                    TTS("Ok", 'en-us');
                    cancel=0;
                    listen=0;
                }
                break;
            default:
                if (cancel==1) {
                    TTS("Ok", 'en-us');
                    cancel=0;
                    listen=0;
                }
                if (listen==1) {
                    document.getElementById("promptArea").innerText=event.results[i][0].transcript;
                    cancel=0;
                    listen=0;
                    submit();
                }
                break;      
        }
        final_transcript += event.results[i][0].transcript;
      } else {
        if (event.results[i][0].transcript == "cancel") {
            document.getElementById("promptArea").value="";
            TTS("Ok!", 'en-us');
            listen=0;
            cancel=0;
        }
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    final_span = linebreak(final_transcript);
    interim_span = linebreak(interim_transcript);
    if (final_transcript || interim_transcript) {
      showButtons('inline-block');
    }
  };
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  start_timestamp = event.timeStamp;
}