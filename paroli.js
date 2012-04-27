var dimension = 11;
var nofWords = 10;
var wordLenghts = 8;
var gTextArray = null;
var interval = null;
  
$(document).ready(function() {
  buildTable();
  buildTableForm();
  buildWordsForm();
  buildSolveButton();
});

function startSolving() {
  var used = new Array(nofWords);
  var words = handleUserWordInput();
  var hints = handleUserHintInput();
  var textArray = buildTextArray(hints);

  var worker = new Worker("tryworker.js");
  
  worker.onmessage = function(event) {
    if ($.isArray(event.data)) {
      storeResult(event.data);
    }
    else {
      // we are done
      clearInterval(interval);
    }
  };
  
  worker.postMessage(
      {
        words: words,
        textArray: textArray
      }
  );
  
  interval = setInterval("displayResult()", 5);
  
}

function handleUserWordInput() {
  // check words and save in cooky
  var words = new Array(nofWords);
  
  for (var i=0; i<nofWords; i++) {
    var textinput = $('input[name="w'+i+'"]');
    var word = textinput.val();
    textinput.removeClass('ok error');
    if (word.length<wordLenghts) {
      textinput.addClass('error');
    }
    else {
      textinput.addClass('ok');
      words[i] = word;
    }
  }
  
  $.cookie('words', $.toJSON( words ));
  
  return words;
}

function handleUserHintInput() {
  var formArray = buildFormArray();
  var hints = new Array();

  for (var x=0; x<formArray.length; x++) {
    for (var y=0; y<formArray[x].length; y++) {
      var letter = $('input[name="r'+y+'c'+x+'"]').val();
      if (formArray[y][x]=='x' && letter!=null && letter!='') {
        hints.push(new Hint(y, x, letter));
      }
    }
  }
  
  $.cookie('hints', $.toJSON( hints ));
  
  return hints;
}

function storeResult(inTextArray) {
  gTextArray = inTextArray;
}

function showResult(textArray) {
  for (var c=0; c<textArray.length; c++) {
    for (var r=0; r<textArray[c].length; r++) {
      if(textArray[r][c]!='!') {
        $('input[name="r'+r+'c'+c+'"]').val(textArray[r][c]);
      }
    }
  }
}

function displayResult() {
  if (gTextArray!=null) {
    showResult(gTextArray);
  }
}

function buildTable() {

  $('#table-div').append($('<table/>').attr('id', 'paroli-table'));

  // Set-up rows and data (columns)
  var tr = $('<tr/>');
  var td = $('<td/>');

  for (var i=0; i<=dimension; i++) {
    var tempTd = td.clone();
    tempTd.attr('id', 'c' + i);
    tr.append(tempTd);
  }

  for (var i = 0; i <= dimension; i++) {
    var tempTr = tr.clone();
    tempTr.attr('id', 'r' + i);
    $('#paroli-table').append(tempTr);
  }

}

function buildTableForm() {
  var formArray = buildFormArray();
  var h = $.cookie('hints');
  var hints = $.evalJSON(h);

  for (var x=0; x<formArray.length; x++) {
    for (var y=0; y<formArray[x].length; y++) {
      if (formArray[y][x]=='x') {
        $('#paroli-table > tbody > tr#r'+y+' > td#c'+x).append( $('<input type=text size="1" maxLength="1" name="r'+y+'c'+x+'">'));
      }
    }
  }
  
  if (hints!=null) {
    for (var i=0; i<hints.length; i++) {
      $('input[name="r'+hints[i].row+'c'+hints[i].column+'"]').val(hints[i].letter);
    }
  }
  
}

function buildWordsForm() {
  var c = $.cookie('words');
  var words = $.evalJSON(c);
  for (var i=0; i<nofWords; i++) {
    $('#words-div').append($('<p><input class="ok" type="text" size="'+wordLenghts+'" maxLength="'+wordLenghts+'" name="w'+i+'"/></p>'));
    if (words!=null && words[i] != null) {
      $('input[name="w'+i+'"]').val(words[i]);
    }
  }
}

function buildSolveButton() {
  $('#paroli-form').append($('<input type="button" name="paroli-solve" value="L&ouml;sen" />'));
  $('input[name="paroli-solve"]').click(function() {
    startSolving();
  });
}

function buildTextArray(hints) {
  var textArray = buildFormArray();
  for (var x=0; x<textArray.length; x++) {
    for (var y=0; y<textArray[x].length; y++) {
      if (textArray[y][x]=='x') {
        textArray[y][x]=' ';
      }
      else {
        textArray[y][x]='!';
      }
    }
  }
  
  if (hints!=null) {
    for (var i=0; i<hints.length; i++) {
      textArray[hints[i].row][hints[i].column] = hints[i].letter;
    }
  }
  
  return textArray;
}

function buildFormArray() {
  var textArray = [
    [' ', ' ', ' ', 'x', ' ', 'x', ' ', 'x', ' ', ' ', ' '],
    [' ', ' ', ' ', 'x', ' ', 'x', ' ', 'x', ' ', ' ', ' '],
    [' ', ' ', ' ', 'x', ' ', 'x', ' ', 'x', ' ', ' ', ' '],
    [' ', ' ', ' ', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' '],
    [' ', ' ', ' ', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' '],
    [' ', ' ', ' ', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    [' ', ' ', ' ', ' ', 'x', ' ', 'x', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', 'x', ' ', 'x', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', 'x', ' ', 'x', ' ', ' ', ' ', ' ']
  ];
  return textArray;
}

function Hint(row, column, letter) {
  this.row = row;
  this.column = column;
  this.letter = letter;
}