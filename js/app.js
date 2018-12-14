var decks = [];

document.addEventListener("DOMContentLoaded", function() {
  setTheme(DEFAULT_THEME);
  Tabletop.init({
    key: TOPIC_SPREADSHEET_KEY,
    callback: loadAllDecks
  });

  sel("#btn-hide-all").addEventListener('click', hideAll);
  sel("#btn-show-all").addEventListener('click', showAll);
  sel("#btn-show-left").addEventListener('click', showLeftColumn);
  sel("#btn-show-right").addEventListener('click', showRightColumn);
  addDelegatedEventListener("#card-table", 'click', '.card', toggleCard);
  addDelegatedEventListener("#card-table", 'click', '.btn-remove', removeRow);
  addDelegatedEventListener("#card-table", 'click', '.btn-unremove', unremoveRow);
  sel("#btn-show-deck-notes").addEventListener('click', showDeckNotes);
  sel('#btn-toggle-theme').addEventListener('click', toggleTheme);
  sel('#btn-hide-guide').addEventListener('click', hideGuide);
  sel('#btn-load-deck').addEventListener('click', deckSelected);
  sel('#btn-shuffle').addEventListener('click', shuffleAndMoveToTop);

  document.addEventListener('keypress', handleKey);
});

function handleKey(e) {
  switch(e.key) {
    case 'a':
      toggleSelectedLeft();
      break;
    case 's':
      toggleSelectedRight();
      break;
    case 'd':
      toggleSelectedNotes();
      break;
    case 'f':
      removeAndSelectNext();
      break;
    case 'g':
      undoLastRemove();
      break;
    case 'e':
      selectPreviousRow();
      break;
    case 'r':
      selectNextRow();
      break;
    case 'q':
      shuffleAndMoveToTop();
      break;
    case 'z':
      showLeftColumn();
      break;
    case 'x':
      showRightColumn();
      break;
    case 'c':
      hideAll();
      break;
    case 'v':
      showAll();
      break;
  }
}

function toggleSelectedLeft() {
  row = getSelectedRow();
  if (row == null) return;

  toggleCard.call(row.querySelector('.left'));
}

function toggleSelectedRight() {
  row = getSelectedRow();
  if (row == null) return;

  toggleCard.call(row.querySelector('.right'));
}

function toggleSelectedNotes() {
  row = getSelectedRow();
  if (row == null) return;

  toggleCard.call(row.querySelector('.notes'));
}

function removeAndSelectNext() {
  currentRow = getSelectedRow();

  if (currentRow != null) {
    removeRow.call(currentRow.querySelector('.btn-remove'));
  }

  scrollToSelectedRow();
}

function undoLastRemove() {
  row = sel('#card-table > .body.removed > .table-row:last-child');
  if (row == null) return;
  unremoveRow.call(row.querySelector('.btn-unremove'), null, getSelectedRow());
  selectPreviousRow();
}

function shuffleAndMoveToTop() {
  shuffleDeck();
  selectFirstRow();
  scrollToSelectedRow();
}

function selectNextRow() {
  row = getSelectedRow();

  if (row == null) {
    var firstRow = sel('#card-table > .body.active').children[0];
    sel(firstRow).classList.add('selected');
  } else {
    var nextRow = row.nextElementSibling;
    if (nextRow != null) {
      row.classList.remove('selected');
      nextRow.classList.add('selected');
    }
  }

  scrollToSelectedRow();
}

function selectFirstRow() {
  rows = selAll('.table-row');
  rows.forEach(function(row) {
    row.classList.remove('selected');
  });
  var firstRow = sel('#card-table > .body.active').children[0];
  firstRow.classList.add('selected');
  scrollToSelectedRow();
}

function selectRow() {
  row = findParent(this, '.table-row');
  $('.table-row').removeClass('selected');
  $(row).addClass('selected');
}

function selectPreviousRow() {
  row = getSelectedRow();

  if (row == null) {
    var firstRow = sel('#card-table > .body.active').children[0];
    firstRow.classList.add('selected');
  } else {
    var prevRow = row.previousElementSibling;
    if (prevRow != null) {
      row.classList.remove('selected');
      prevRow.classList.add('selected');
    }
  }

  scrollToSelectedRow();
}

function getSelectedRow() {
  rows = sel('#card-table > .body.active').querySelectorAll('.selected');
  if (rows.length > 0) {
    return rows[0];
  }

  return null;
}

function scrollToSelectedRow() {
  // Don't auto scroll on small screens
  if (window.innerWidth > 767) {
    row = getSelectedRow();
    if (row == null) return;
    row.scrollIntoView({ behavior: 'smooth' });
  }
}

function loadAllDecks(data, tabletop) {
  decks = [];
  var allNotes = tabletop.sheets('notes').all();

  tabletop.foundSheetNames.forEach(function(sheetName) {
    if (sheetName === 'notes') {
      return;
    }

    var noteRow = allNotes.find(function(noteEntry) {
      return noteEntry.name === sheetName;
    });
    notes = noteRow != null ? noteRow.notes : '';
    cards = tabletop.sheets(sheetName)

    decks.push({ 'name': sheetName, 'notes': notes, 'cards': cards });

    sel('#sel-deck').add(new Option(sheetName, sheetName));
  });
}

function deckSelected() {
  dropdown = sel('#sel-deck');
  deckName = dropdown.options[dropdown.selectedIndex].value;
  loadDeck(deckName);
}

function loadDeck(deckName) {
  deck = decks.find(function(d) {
    return d.name === deckName;
  });
  if (deck == null) {
    return;
  }

  sel('#card-table > .body.active').innerHTML = '';
  sel('#card-table > .body.removed').innerHTML = '';

  var left = deck.cards.columnNames[0];
  var right = deck.cards.columnNames[1];
  var title = deck.name;

  sel('#header-title').textContent = title;
  sel('#card-header-left').textContent = left;
  sel('#card-header-right').textContent = right;
  sel('#btn-show-left').textContent = `Show ${left}`;
  sel('#btn-show-right').textContent = `Show ${right}`;

  if (deck.notes != null && deck.notes != '') {
    loadDeckNotes(deck.notes);
  } else {
    sel('#deck-notes-container').style.display = 'none';
  }

  deck.cards.elements.forEach(card => {
    leftEntry = card[left];
    rightEntry = card[right];
    notesEntry = card['notes'];
    if (notesEntry == null) {
      notesEntry = card['Notes'];
    }

    leftSizeClass = '';
    rightSizeClass = '';

    if (leftEntry.length > 40) {
      leftSizeClass = 'card-v-small';
    } else if (leftEntry.length > 20) {
      leftSizeClass = 'card-small';
    }

    if (rightEntry.length > 40) {
      rightSizeClass = 'card-v-small';
    } else if (rightEntry.length > 20) {
      rightSizeClass = 'card-small';
    }

    notesDiv = notesEntry != null && notesEntry != '' ?
      `<div class='card-column card notes'><p>${notesEntry}</p></div>` :
      `<div class='card-column card notes no-content'><p></p></div>`;

    var row = `
      <div class='table-row'>
        <div class='card-column card left ${leftSizeClass}'><p>${leftEntry}</p></div>
        <div class='card-column card right ${rightSizeClass}'><p>${rightEntry}</p></div>
        ${notesDiv}
        <button class='btn-remove'>x</button>
      </div>
    `;
    var rowElement = htmlToElement(row);
    sel('#card-table > .body.active').appendChild(rowElement);
  });

  document.title = title;
  hideNotes();
  hideDeckNotes();
  selectFirstRow();
  showKeyGuide();
  showGuide();
  showCardButtons();
  showAppInstructions();
  showFlaschardContainer();

  if(DEFAULT_VISIBLE_COLUMN === 'right') {
    showRightColumn();
  } else {
    showLeftColumn();
  }
}

function hideAll() {
  cards = selAll('.card p');
  cards.forEach(function(card) {
    card.style.display = 'none';
  })
}

function showAll() {
  cards = selAll('.card p');
  cards.forEach(function(card) {
    card.style.display = '';
  })
}

function showLeftColumn() {
  rightCards = selAll('.card.right p');
  rightCards.forEach(function(rightCard) {
    rightCard.style.display = 'none';
  });

  leftCards = selAll('.card.left p');
  leftCards.forEach(function(leftCard) {
    leftCard.style.display = '';
  });
}

function showRightColumn() {
  rightCards = selAll('.card.right p');
  rightCards.forEach(function(rightCard) {
    rightCard.style.display = '';
  });

  leftCards = selAll('.card.left p');
  leftCards.forEach(function(leftCard) {
    leftCard.style.display = 'none';
  });
}

function hideNotes() {
  noteCards = selAll('.card.notes p');
  noteCards.forEach(function(noteCard) {
    noteCard.style.display = 'none';
  });
}

function toggleCard() {
  el = this.querySelector('p');
  if (el.style.display == 'none') {
    el.style.display = '';
  } else {
    el.style.display = 'none';
  }

  selectRow.call(this);
}

function removeRow(event) {
  if (event != null &&event.handled) {
    return;
  }

  var selectedRow = getSelectedRow();
  var removedRow =  this.parentElement;

  if (selectedRow == removedRow) {
    // if next row is not available it means final row is selected. Keep selection on final item
    var nextRow = row.nextElementSibling;
    if (nextRow != null) {
      selectNextRow();
    } else {
      selectPreviousRow();
    }
  }

  this.textContent = '^';
  this.classList.remove('btn-remove');
  this.classList.add('btn-unremove');
  removeElement(removedRow);
  sel('#card-table > .body.removed').appendChild(removedRow);
  if (event != null) {
    event.handled = true;
  }
}

function unremoveRow(event, afterSibling) {
  if (event != null && event.handled) {
    return;
  }

  this.textContent = 'x';
  this.classList.remove('btn-unremove');
  this.classList.add('btn-remove');
  if (afterSibling == null) {
    removeElement(this.parentElement)
    sel('#card-table > .body.active').appendChild(this.parentElement);
  } else {
    var row = this.parentElement;
    removeElement(row);
    sel('#card-table > .body.active').insertBefore(row, afterSibling);
  }
  if (event != null) {
    event.handled = true;
  }
}

function shuffleDeck() {
  cards = Array.from(sel('#card-table > .body.active').children).slice(0);
  shuffle(cards);
  sel('#card-table > .body.active').innerHTML = '';
  cards.forEach(function(card) {
    sel('#card-table > .body.active').appendChild(card);
  });
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function showAppInstructions() {
  sel('#user-guide #start-instructions').style.display = 'none';
  sel('#user-guide #app-instructions').style.display = 'block';
}

function showKeyGuide() {
  sel('#user-guide #keys-container').style.display = 'block';
}

function showFlaschardContainer() {
  sel('#flashcard-container').style.display = 'block';
}

function loadDeckNotes(notes) {
  sel('#deck-notes-content').innerHTML = '';
  sel('#deck-notes-content').appendChild(htmlToElement(`<p>${notes}</p>`));
  sel('#deck-notes-container').style.display = 'block';
}

function showDeckNotes() {
  sel('#btn-show-deck-notes').style.display = 'none';
  sel('#deck-notes').style.display = 'block';
}

function hideDeckNotes() {
  sel('#btn-show-deck-notes').style.display = 'inline-block';
  sel('#deck-notes').style.display = 'none';
}

function showCardButtons() {
  sel('#card-buttons').style.display = 'block';
}

function toggleTheme() {
  if (sel('html').classList.contains('light')) {
    setTheme('dark');
  } else {
    setTheme('light')
  }
}

function setTheme(theme) {
  sel("html").classList.remove('light');
  sel("body").classList.remove('light');
  sel("html").classList.remove('dark');
  sel("body").classList.remove('dark');

  sel("html").classList.add(theme);
  sel("body").classList.add(theme);

  if (theme == 'light') {
    sel("#btn-toggle-theme").textContent = 'Switch to Dark Theme';
  } else {
    sel("#btn-toggle-theme").textContent = 'Switch to Light Theme';
  }
}

function showGuide() {
  sel('#user-guide').style.display = ''
}

function hideGuide() {
  sel('#user-guide').style.display = 'none';
}

function sel(query) {
  return document.querySelector(query);
}

function selAll(query) {
  return document.querySelectorAll(query);
}

function findParent(element, selector) {
  result = null;
  parent = element.parentElement;
  for (;;) {
    if (parent.matches(selector)) {
      result = parent;
      break;
    } else if (parent.parentElement != null) {
      parent = parent.parentElement;
    } else {
      break;
    }
  }
  return result;
}

function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

function removeElement(element) {
  element.parentNode.removeChild(element);
}

function addDelegatedEventListener(selector, eventType, delegatedSelector, callback) {
  sel(selector).addEventListener(eventType, function(event) {
    var el = event.target;
    for (;;) {
      if(el.matches(delegatedSelector)) {
        return callback.apply(el, [event]);
      } else if (el.parentElement != null) {
        el = el.parentElement;
      } else {
        break;
      }
    }
    event.preventDefault();
  });
}