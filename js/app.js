var decks = [];

$(document).ready(function () {

  setTheme(DEFAULT_THEME);
  Tabletop.init({
    key: TOPIC_SPREADSHEET_KEY,
    callback: loadAllDecks,
    simpleSheet: true
  });

  $("#btn-hide-all").on('click', hideAll);
  $("#btn-show-all").on('click', showAll);
  $("#btn-show-left").on('click', showLeftColumn);
  $("#btn-show-right").on('click', showRightColumn);
  $("#card-table").on('click', '.card', toggleCard);
  $("#card-table").on('click', ".btn-remove", removeRow);
  $("#card-table").on('click', ".btn-unremove", unremoveRow);
  $("#btn-show-deck-notes").on('click', showDeckNotes);
  $('#btn-toggle-theme').on('click', toggleTheme);

  $('#btn-load-deck').on('click', deckSelected);
  $('#btn-shuffle').on('click', shuffleAndMoveToTop);

  $(document).keypress(handleKey);
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

function loadAllDecks(data) {
  decks = [];

  data.forEach(function(deck) {
    var name = deck.name;
    var key = deck.key;
    var notes = deck.notes;

    decks.push({'name': name, 'key': key, 'notes': notes });

    var option = `<option value='${key}'>${name}</option>`;
    $('#sel-deck').append(option);
  });
}

function deckSelected() {
  key = $('#sel-deck').find(':selected').val();
  Tabletop.init({
    key: key,
    callback: loadDeck,
    simpleSheet: true
  });
}

function loadDeck(data, tabletop) {
  $('#card-table > .body.active').empty();
  $('#card-table > .body.removed').empty();

  var left = Object.keys(data[0])[0];
  var right = Object.keys(data[0])[1];
  var title = $('#sel-deck').find(':selected').text();

  deck = decks.find(function(el) { return el.key === tabletop.key; });
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

  data.forEach(card => {
    leftEntry = card[left];
    rightEntry = card[right];
    notesEntry = card['notes'];
    if (notesEntry == null) {
      notesEntry = card['Notes'];
    }

    notesDiv = notesEntry != null && notesEntry != '' ?
      `<div class='card-column card notes'><p>${notesEntry}</p></div>` :
      `<div class='card-column card notes no-content'><p></p></div>`;

    var row = `
      <div class='table-row'>
        <div class='card-column card left'><p>${leftEntry}</p></div>
        <div class='card-column card right'><p>${rightEntry}</p></div>
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
  showCardButtons();
  setInstructions([
    'The currently selected row is outlined in blue. Use keyboard shortcuts to switch.',
    'Hide or reveal cards using keyboard shortcuts (preferred), the buttons above, or by clicking on the cards.',
    'Words can be removed from the list using keyboard shortcuts or by clicking the "X" button.'
  ]);
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

function setInstructions(instructions) {
  $('#user-guide #instructions').empty();
  $('#user-guide #instructions').append("<ul />");
  instructions.forEach(function(text) {
    $('#user-guide #instructions ul').append(`<li>${text}</li>`)
  });
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