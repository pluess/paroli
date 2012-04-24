var dimension = 11;
var nofWords = 10;
var wordLenghts = 8;
  
$(document).ready(function() {
  buildTable();
  buildTableForm();
  buildWordsForm();
  buildSolveButton();
});

function startSolving() {
  var words = handleUserInput();
  console.log(buildTextArray().toString());
}

function handleUserInput() {
  // check words and save in cooky
  var words = new Array(nofWords);
  var wordsOk = new Boolean(true);
  
  for (var i=0; i<nofWords; i++) {
    var textinput = $('input[name="w'+i+'"]');
    var word = textinput.val();
    textinput.removeClass('ok error');
    if (word.length<wordLenghts) {
      textinput.addClass('error');
      wordsOk = new Boolean(false);
    }
    else {
      textinput.addClass('ok');
      words[i] = word;
    }
  }
  
  $.cookie('words', $.toJSON( words ));
  
  return words;
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

  for (var x=0; x<formArray.length; x++) {
    for (var y=0; y<formArray[x].length; y++) {
      if (formArray[y][x]=='x') {
        $('#paroli-table > tbody > tr#r'+y+' > td#c'+x).append( $('<input type=text size="1" maxLength="1" name="r'+y+'c'+x+'">'));
      }
    }
  }

}

function buildWordsForm() {
  var c = $.cookie('words');
  var words = $.evalJSON(c);
  for (var i=0; i<nofWords; i++) {
    $('#words-div').append($('<p><input class="ok" type="text" size="'+wordLenghts+'" maxLength="'+wordLenghts+'" name="w'+i+'"/></p>'))
    if (words[i] != null) {
      $('input[name="w'+i+'"]').val(words[i]);
    }
  }
}

function buildSolveButton() {
  $('#paroli-form').append($('<input type="button" name="paroli-solve" value="L&ouml;sen" />'));
  $('input[name="paroli-solve"]').click(function() {
    startSolving();
  })
}

function buildTextArray() {
  // var textArray = [
  //   ['', '', '', '', '', '', '', '', '', '', ''],
  //   ['', '', '', '', '', '', '', '', '', '', ''],
  //   ['', '', '', '', '', '', '', '', '', '', ''],
  //   ['', '', '', '', '', '', '', '', '', '', ''],
  //   ['', '', '', '', '', '', '', '', '', '', ''],
  //   ['', '', '', '', '', '', '', '', '', '', ''],
  //   ['', '', '', '', '', '', '', '', '', '', ''],
  //   ['', '', '', '', '', '', '', '', '', '', ''],
  //   ['', '', '', '', '', '', '', '', '', '', ''],
  //   ['', '', '', '', '', '', '', '', '', '', ''],
  //   ['', '', '', '', '', '', '', '', '', '', ''],
  // ];
  
  var textArray = buildFormArray();
  for (var x=0; x<textArray.length; x++) {
    for (var y=0; y<textArray[x].length; y++) {
      if (textArray[y][x]=='x') {
        textArray[y][x]=' ';
      }
      else {
        textArray[y][x]='x';
      }
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
    [' ', ' ', ' ', ' ', 'x', ' ', 'x', ' ', ' ', ' ', ' '],
  ];
  return textArray;
}

