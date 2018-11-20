var decks = [];

$(document).ready(function () {

  var TOPIC_SPREADSHEET_KEY = '159Xdlkq_k9gr5kUt_ICNHOlVmqWXxTwxR3LBemNMKAU';

  Tabletop.init({
    key: TOPIC_SPREADSHEET_KEY,
    callback: loadAllDecks,
    simpleSheet: true
  });

  $("#btn-hide-all").on('click', hideAll);
  $("#btn-show-all").on('click', showAll);
  $("#btn-hide-left").on('click', hideLeft);
  $("#btn-hide-right").on('click', hideRight);
  $("#card-table").on('click', '.card', toggleCard);
  $("#card-table").on('click', ".btn-remove", removeRow);
  $("#card-table").on('click', ".btn-unremove", unremoveRow);
  $("#btn-show-deck-notes").on('click', showDeckNotes);

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
  window.scrollTo(0, 0);
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
  row = getSelectedRow();
  if (row == null) return;
  row.scrollIntoView({ behavior: 'smooth' });
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
  deck = decks.find(function(el) { return el.key === tabletop.key; });

  $('#header-title').text($('#sel-deck').find(':selected').text());
  $('#card-header-left').text(left);
  $('#card-header-right').text(right);
  $('#btn-hide-left').text(`Hide ${left}`);
  $('#btn-hide-right').text(`Hide ${right}`);

  if (deck.notes != null && deck.notes != '') {
    $('#deck-notes').empty();
    $('#deck-notes').append(`<p>${deck.notes}</p>`);
    $('#deck-notes-container').show();
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

  hideRight();
  hideNotes();
  hideDeckNotes();
  selectFirstRow();
  showKeyGuide();
  setInstructions('Hide or reveal cards using buttons, keyboard shortcuts, or by clicking on them. Words you know can be removed from the list using the "X" button or by using the keyboard shortcut.');
  showFlaschardContainer();
}

function hideAll() {
  $('.card p').hide();
}

function showAll() {
  $('.card p').show();
}

function hideLeft() {
  $('.card.right p').show()
  $('.card.left p').hide();
}

function hideRight() {
  $('.card.left p').show();
  $('.card.right p').hide();
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
    selectNextRow();
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

function setInstructions(text) {
  $('#user-guide #instructions').text(text);
}

function showKeyGuide() {
  $('#user-guide #keys').show();
}

function showFlaschardContainer() {
  $('#flashcard-container').show();
}

function showDeckNotes() {
  $('#btn-show-deck-notes').hide();
  $('#deck-notes').show();
}

function hideDeckNotes() {
  $('#btn-show-deck-notes').show();
  $('#deck-notes').hide();
}