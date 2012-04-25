var nofWords = 10;
var wordLenghts = 8;

onmessage = function(event) {

  var used = new Array(nofWords);
  
  for (var i=0; i<used.length; i++) {
    used[i] = Boolean(false);
  }

  debugger;
  tryWord(0, event.data.words, used, event.data.textArray);

};

function tryWord(pos, words, used, inTextArray) {
  var myTextArray = cloneArray(inTextArray);
  for ( var i = 0; i < used.length; i++) {
    if (!used[i]) {
      if (tryFillWord(pos, words[i], myTextArray)) {
        postResult(myTextArray);
        // next word does fit
        used[i] = Boolean(true);
        if (pos < (nofWords - 1)) {
          if (!tryWord(pos + 1, words, used, myTextArray)) {
            // reset used since it was not successfull
            used[i] = Boolean(false);
            myTextArray = cloneArray(inTextArray);
            // is there an other unused word to try with?
            postResult(myTextArray);
            continue;
          } else {
            copyArray(inTextArray, myTextArray);
            return Boolean(true);
          }
        } else {
          console.log("yes, we found the solution");
          copyArray(inTextArray, myTextArray);
          return Boolean(true);
        }
      } else {
        // next word does not fit
        // is there an other unused word to try with?
        continue;
      }
    }
  }
  // no word does fit => fall back
  postResult(myTextArray);
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
  for ( var r = row; i < word.length && r < myTextArray[column].length; r++) {
    if (myTextArray[r][column] == ' ' || myTextArray[r][column] == word[i]) {
      myTextArray[r][column] = word[i];
      i++;
    } else {
      return Boolean(false);
    }
  }
  copyArray(myTextArray, inTextArray);
  return Boolean(true);
}

function tryFillWordHorizontal(row, column, word, inTextArray) {
  var i = 0;
  var myTextArray = cloneArray(inTextArray);
  for ( var c = column; i < word.length && c < myTextArray.length; c++) {
    if (myTextArray[row][c] == ' ' || myTextArray[row][c] == word[i]) {
      myTextArray[row][c] = word[i];
      i++;
    } else {
      return Boolean(false);
    }
  }
  copyArray(myTextArray, inTextArray);
  return Boolean(true);
}

function postResult(textArray) {
  self.postMessage(textArray);
  pause(5);
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

function pause(millis) {
  var date = new Date();
  var curDate = null;
  do {
    curDate = new Date();
  } while (curDate - date < millis)
}



