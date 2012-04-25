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
  var used = new Array(nofWords);
  for (var i=0; i<used.length; i++) {
    used[i] = Boolean(false);
  }
  var words = handleUserWordInput();
  var hints = handleUserHintInput();
  var textArray = buildTextArray(hints);

  tryWord(0, words, used, textArray);
}

function tryWord(pos, words, used, inTextArray) {
  var myTextArray = cloneArray(inTextArray);
  for (var i=0; i<used.length; i++) {
    if (!used[i]) {
      if (tryFillWord(pos, words[i], myTextArray)) {
        showResult(myTextArray);
        // next word does fit
        used[i] = Boolean(true);
        if (pos<(nofWords-1)) {
          if (!tryWord(pos+1, words, used, myTextArray)) {
            // reset used since it was not successfull
            used[i] = Boolean(false);
            myTextArray = cloneArray(inTextArray);
            // is there an other unused word to try with?
            showResult(myTextArray);
            continue;
          }
          else {
            copyArray(inTextArray, myTextArray);
            return Boolean(true);
          }
        }
        else {
          console.log("yes, we found the solution");
          copyArray(inTextArray, myTextArray);
          return Boolean(true);
        }
      }
      else {
        // next word does not fit
        // is there an other unused word to try with?
        continue;
      }
    }
  }
  // no word does fit => fall back
  showResult(myTextArray);
  return Boolean(false);
}

function tryFillWord(pos, word, textArray) {
  switch (pos) {
  case 0:
    return tryFillWordVertical(0, 3, word, textArray);
    break;
  case 1:
    return tryFillWordVertical(3, 4, word, textArray);
    break;
  case 2:
    return tryFillWordVertical(0, 5, word, textArray);
    break;
  case 3:
    return tryFillWordVertical(3, 6, word, textArray);
    break;
  case 4:
    return tryFillWordVertical(0, 7, word, textArray);
    break;
  case 5:
    return tryFillWordHorizontal(3, 3, word, textArray);
    break;
  case 6:
    return tryFillWordHorizontal(4, 0, word, textArray);
    break;
  case 7:
    return tryFillWordHorizontal(5, 3, word, textArray);
    break;
  case 8:
    return tryFillWordHorizontal(6, 0, word, textArray);
    break;
  case 9:
    return tryFillWordHorizontal(7, 3, word, textArray);
    break;
  }
  
  return Boolean(false);
}

function tryFillWordVertical(row, column, word, inTextArray) {
  var i = 0;
  var myTextArray = cloneArray(inTextArray);
  for (var r=row; i<word.length && r<myTextArray[column].length; r++) {
    if (myTextArray[r][column]==' ' || myTextArray[r][column]==word[i]) {
      myTextArray[r][column]=word[i];
      i++;
    }
    else {
      return Boolean(false);
    }
  }
  copyArray(myTextArray, inTextArray);
  return Boolean(true);
}

function tryFillWordHorizontal(row, column, word, inTextArray) {
  var i = 0;
  var myTextArray = cloneArray(inTextArray);
  for (var c=column; i<word.length && c<myTextArray.length; c++) {
    if (myTextArray[row][c]==' ' || myTextArray[row][c]==word[i]) {
      myTextArray[row][c]=word[i];
      i++;
    }
    else {
      return Boolean(false);
    }
  }
  copyArray(myTextArray, inTextArray);
  return Boolean(true);
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

function showResult(textArray) {
  for (var c=0; c<textArray.length; c++) {
    for (var r=0; r<textArray[c].length; r++) {
      if(textArray[r][c]!='!') {
        $('input[name="r'+r+'c'+c+'"]').val(textArray[r][c]);
      }
    }
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

/**
 * Deep clone of a two dimensional array.
 * 
 * @returns The cloned array.
 */
function cloneArray(srcArray) {
  var destArray = new Array();
  for (var c=0; c<srcArray.length; c++) {
    destArray.push(srcArray[c].slice(0));
  }
  return destArray;
}

/**
 * Copies the values from one array to an other one.
 */
function copyArray(srcArray, destArray) {
  for (var c=0; c<srcArray.length; c++) {
    for (var r=0; r<srcArray[c].length; r++) {
      destArray[c][r] = srcArray[c][r];
    }
  }
}

function Hint(row, column, letter) {
  this.row = row;
  this.column = column;
  this.letter = letter;
}