var FILE = 0;
var DIR = 1;
var NOFILE = 'No such file or directory';
var NOTDIR = 'Not a directory';
var ISDIR = 'Is a directory';
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

var currentPath = '/';

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
  if (e.which == 37 || e.which == 39 || e.which == 38 || e.which == 40) {
    e.preventDefault();
    return;
  }
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
  document.getElementById('console-container').appendChild(document.createElement('br'));
  document.getElementById('console-container').appendChild(constructLine());
}

function constructLine() {
  var line = document.createElement('span');
  line.className = 'line';
  var prompt = document.createElement('span');
  prompt.className = 'prompt';
  prompt.innerHTML = 'david@david-home:' + currentPath + '$&nbsp;';
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
  // document.getElementById('console-container').appendChild(document.createElement('br'));
  if (args[0] in commands) {
    var stdout = 'ERROR';
    try {
      stdout = commands[args[0]].run(args);
    } catch (e) {
      stdout = args[0] + ': ' + e;
    }
    stdout = htmlify('\n' + stdout);
    output.innerHTML = stdout;
  } else {
    output.innerHTML = args[0] + ': command not found';
  }
  document.getElementById('console-container').appendChild(output);
}

var commands = {
  help: {
    help: 'Print this help text.',
    run: function(args) {
      if (args.length == 1) {
        var txt = '';
        for (command in commands) {
          txt += command + ' - ' + commands[command].help + '\n';
        }
        return txt;
      } else {
        return commands[args[1]].help + '\n';
      }
    }
  },
  cat: {
    help: 'Print the contents of a file.',
    run: function(args) {
      if (args.length != 2) {
        throw 'Usage: cat [file]';
      }
      return get(args[1], FILE).data;
      // var file = files['info.txt'];
      // if (file.type != FILE) {
      //   return 'Cannot print directory.';
      // } else {
      //   return file.data;
      // }
    }
  },
  cd: {
    help: 'Change location to a folder.',
    run: function(args) {
      if (args.length != 2) {
        throw 'Usage: cd [folder]';
      }
      var tmppath = compilePath(args[1]);
      get(tmppath, DIR); //throws if invalid
      currentPath = tmppath;
      return '';
    }
  },
  ls: {
    help: 'List the files in the current folder.',
    run: function(args) {
      var currentDir = get(currentPath, DIR);
      var out = '';
      for (name in currentDir.files) {
        out += name + (currentDir.files[name].type == DIR ? '/' : '') + '\t';
      }
      return out;
    }
  },
  pwd: {
    help: 'Print the current path',
    run: function(args) {
      return currentPath;
    }
  },
  signup: {
    help: 'Sign up for the amazingest club in Millburn High School!',
    run: function(args) {
      if (args.length != 4) {
        throw 'Usage: signup [First Name] [Last Name] [email]';
      }
      firebase.database().ref('/signups').push({
        fname: args[1],
        lname: args[2],
        email: args[3]
      });
      return 'Thank you, ' + args[1] + '!';
    }
  }

};

var files = {
  type: DIR,
  files: {
    'info.txt': {
      type: FILE,
      data: 'memes are pretty cool gotta be honest'
    },
    'meme': {
      'type': DIR,
      files: {
        'meme.txt': {
          type: FILE,
          data: 'memes are really really good'
        }
      }
    }
  }
};

function compilePath(pathstr) {
  var path = pathstr.split('/');
  var stack = path[0] == '' ? '/'.split('/') : currentPath.split('/');
  if (stack[stack.length - 1] == '') stack.pop();
  for (var i = 0; i < path.length; i++) {
    var current = path[i];
    if (current == '' || current == '.') continue;
    if (current == '..') {
      stack.pop();
      continue;
    }
    stack.push(current);
  }
  stack.push('');
  return stack.join('/');
}

function get(pathstr, desiredType) {
  if (typeof desiredType != 'number') desiredType = FILE;
  var path = compilePath(pathstr).split('/');
  var current = files;
  // console.log(files);
  for (var i = 1; i < path.length - 1; i++) {
    console.log(current.type);
    if (current.type == DIR) {
      console.log(current[path[i]]);
      if (path[i] in current.files) current = current.files[path[i]];
      else throw pathstr + ': ' + NOFILE;
    } else if (current.type == FILE) {
      throw pathstr + ': ' + NOTDIR;
    }
  }
  if (current.type != desiredType) {
    if (current.type == DIR) throw pathstr + ': ' + ISDIR;
    else if (current.type == FILE) throw pathstr + ': ' + NOTDIR;
  } else {
    return current;
  }
}

function htmlify (str) {
  return str.replace(new RegExp('\n', 'g'), '<br>').replace(new RegExp('\t', 'g'), '&nbsp;&nbsp;&nbsp;&nbsp;');
}