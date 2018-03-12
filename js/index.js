var carat = {
  blink: function() {
    var elem = document.getElementById('carat');
    if (elem.style.visibility == 'visible') {
      elem.style.visibility = 'hidden';
    } else {
      elem.style.visibility = 'visible';
    }
  },
  interval: null
};

carat.elem = document.getElementById('carat');
carat.interval = setInterval(carat.blink, 500);
document.getElementById('console').addEventListener('click', function() {
  document.getElementById('in').focus();
});
document.getElementById('in').addEventListener('input', function() {
  document.getElementById('userinput').innerText = document.getElementById('in').value;
});
document.getElementById('in').addEventListener('keydown', function(e) {
  console.log(e.which);
  if (e.which == 13) {
    var command = document.getElementById('userinput').innerText;
    process(command.split(' '));
    nextLine();
  }
});

function nextLine() {
  document.getElementById('userinput').id = '';
  document.getElementById('in').value = '';
  document.getElementById('carat').parentElement.removeChild(document.getElementById('carat'));
  // document.getElementById('console-container').appendChild(document.createElement('br'));

  // document.getElementById('console-container').appendChild(newCarat);
  document.getElementById('console-container').appendChild(constructLine());
}

function constructLine() {
  var line = document.createElement('span');
  line.className = 'line';
  var prompt = document.createElement('span');
  prompt.className = 'prompt';
  prompt.innerHTML = 'david@david-home:$&nbsp;';
  var userinput = document.createElement('span');
  userinput.id = 'userinput';
  var newCarat = document.createElement('span');
  newCarat.innerHTML = '&block;';
  newCarat.id = 'carat';
  line.appendChild(prompt);
  line.appendChild(userinput);
  line.appendChild(newCarat);
  return line;
}

function process(args) {
  var output = document.createElement('span');
  output.className = 'output';
  output.innerText = 'memes are good';
  document.getElementById('console-container').appendChild(output);
}