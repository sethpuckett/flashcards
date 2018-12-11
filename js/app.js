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

function addDelegatedEventListener(selector, eventType, delegatedSelector, callback) {
  sel(selector).addEventListener(eventType, function(event) {
    var el = event.target;
    for (;;) {
      if(el.matches(delegatedSelector)) {
        return callback.apply(el);
      } else if (el.parentElement != null) {
        el = el.parentElement;
      } else {
        break;
      }
    }
  });
}

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

  toggleCard.call($(row).find('.left')[0]);
}

function toggleSelectedRight() {
  row = getSelectedRow();
  if (row == null) return;

  toggleCard.call($(row).find('.right')[0]);
}

function toggleSelectedNotes() {
  row = getSelectedRow();
  if (row == null) return;

  toggleCard.call($(row).find('.notes')[0]);
}

function removeAndSelectNext() {
  currentRow = getSelectedRow();

  if (currentRow != null) {
    removeRow.call($(currentRow).find('.btn-remove')[0]);
  }

  scrollToSelectedRow();
}

function undoLastRemove() {
  row = $('#card-table > .body.removed > .table-row:last-child')[0];
  if (row == null) return;
  unremoveRow.call($(row).find('.btn-unremove')[0], null, getSelectedRow());
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
    var firstRow = $('#card-table > .body.active').children()[0];
    $(firstRow).addClass('selected');
  } else {
    var nextRow = $(row).next()[0];
    if (nextRow != null) {
      $(row).removeClass('selected');
      $(nextRow).addClass('selected');
    }
  }

  scrollToSelectedRow();
}

function selectFirstRow() {
  $('.table-row').removeClass('selected');
  var firstRow = $('#card-table > .body.active').children()[0];
  $(firstRow).addClass('selected');
  scrollToSelectedRow();
}

function selectRow() {
  row = $(this).parents('.table-row')[0];
  $('.table-row').removeClass('selected');
  $(row).addClass('selected');
}

function selectPreviousRow() {
  row = getSelectedRow();

  if (row == null) {
    var firstRow = $('#card-table > .body.active').children()[0];
    $(firstRow).addClass('selected');
  } else {
    var prevRow = $(row).prev()[0];
    if (prevRow != null) {
      $(row).removeClass('selected');
      $(prevRow).addClass('selected');
    }
  }

  scrollToSelectedRow();
}

function getSelectedRow() {
  rows = $('#card-table > .body.active').find('.selected');
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

    var option = `<option value='${sheetName}'>${sheetName}</option>`;
    $('#sel-deck').append(option);
  });
}

function deckSelected() {
  deckName = $('#sel-deck').find(':selected').val();
  loadDeck(deckName);
}

function loadDeck(deckName) {
  deck = decks.find(function(d) {
    return d.name === deckName;
  });
  if (deck == null) {
    return;
  }

  $('#card-table > .body.active').empty();
  $('#card-table > .body.removed').empty();

  var left = deck.cards.columnNames[0];
  var right = deck.cards.columnNames[1];
  var title = deck.name;

  $('#header-title').text(title);
  $('#card-header-left').text(left);
  $('#card-header-right').text(right);
  $('#btn-show-left').text(`Show ${left}`);
  $('#btn-show-right').text(`Show ${right}`);

  if (deck.notes != null && deck.notes != '') {
    loadDeckNotes(deck.notes);
  } else {
    $('#deck-notes-container').hide();
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

    $('#card-table > .body.active').append(row);
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
  $('.card p').hide();
}

function showAll() {
  $('.card p').show();
}

function showLeftColumn() {
  $('.card.right p').hide()
  $('.card.left p').show();
}

function showRightColumn() {
  $('.card.left p').hide();
  $('.card.right p').show();
}

function hideNotes() {
  $('.card.notes p').hide();
}

function toggleCard() {
  $(this).find('p').toggle();
  selectRow.call(this);
}

function removeRow() {
  var selectedRow = getSelectedRow();
  var removedRow =  $(this).parent()[0];

  if (selectedRow == removedRow) {
    // if next row is not available it means final row is selected. Keep selection on final item
    var nextRow = $(row).next()[0];
    if (nextRow != null) {
      selectNextRow();
    } else {
      selectPreviousRow();
    }
  }

  $(this).text('^');
  $(this).removeClass('btn-remove');
  $(this).addClass('btn-unremove');
  $(removedRow).detach().appendTo('#card-table > .body.removed');
}

function unremoveRow(_event, afterSibling) {
  $(this).text('x');
  $(this).removeClass('btn-unremove');
  $(this).addClass('btn-remove');
  if (afterSibling == null) {
    $(this).parent().detach().appendTo('#card-table > .body.active');
  } else {
    var row = $(this).parent();
    $(row).detach();
    $(row).insertBefore(afterSibling);
  }
}

function shuffleDeck() {
  cards = $('#card-table > .body.active').children();
  shuffle(cards);
  $('#card-table > .body.active').empty();
  $('#card-table > .body.active').append(cards);
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
  $('#user-guide #start-instructions').hide();
  $('#user-guide #app-instructions').show();
}

function showKeyGuide() {
  $('#user-guide #keys-container').show();
}

function showFlaschardContainer() {
  $('#flashcard-container').show();
}

function loadDeckNotes(notes) {
  $('#deck-notes-content').empty();
  $('#deck-notes-content').append(`<p>${notes}</p>`);
  $('#deck-notes-container').show();
}

function showDeckNotes() {
  $('#btn-show-deck-notes').hide();
  $('#deck-notes').show();
}

function hideDeckNotes() {
  $('#btn-show-deck-notes').show();
  $('#deck-notes').hide();
}

function showCardButtons() {
  $('#card-buttons').show();
}

function toggleTheme() {
  if ($('html').hasClass('light')) {
    setTheme('dark');
  } else {
    setTheme('light')
  }
}

function setTheme(theme) {
  $("html").removeClass('light');
  $("body").removeClass('light');
  $("html").removeClass('dark');
  $("body").removeClass('dark');

  $("html").addClass(theme);
  $("body").addClass(theme);

  if (theme == 'light') {
    $("#btn-toggle-theme").text('Switch to Dark Theme');
  } else {
    $("#btn-toggle-theme").text('Switch to Light Theme');
  }
}

function showGuide() {
  $('#user-guide').show();
}

function hideGuide() {
  $('#user-guide').hide();
}

function sel(query) {
  return document.querySelector(query);
}