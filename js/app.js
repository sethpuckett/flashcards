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
  $("#card-table").on('click', ".btn-ignore", ignoreCard);
  $("#card-table").on('click', ".btn-unignore", unignoreCard);

  $('#btn-load-deck').on('click', deckSelected);
  $('#btn-shuffle').on('click', shuffleDeck);
});

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
  $('#card-table > .body.ignored').empty();

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

    var row = `
      <div class='table-row'>
        <div class='card-column card left'><p>${leftEntry}</p></div>
        <div class='card-column card right'><p>${rightEntry}</p></div>
        <div class='card-column card notes'><p>${notesEntry || ''}</p></div>
        <button class='btn-ignore'>x</button>
      </div>
    `;

    $('#card-table > .body.active').append(row);
  });

  $('.card.right p').hide();
}

function hideAll() {
  $('.card p').fadeOut();
}

function showAll() {
  $('.card p').fadeIn();
}

function hideLeft() {
  $('.card.right p').fadeIn();
  $('.card.left p').fadeOut();
}

function hideRight() {
  $('.card.left p').fadeIn();
  $('.card.right p').fadeOut();
}

function toggleCard() {
  $(this).find('p').fadeToggle();
}

function ignoreCard() {
  $(this).text('^');
  $(this).removeClass('btn-ignore');
  $(this).addClass('btn-unignore');
  $(this).parent().detach().appendTo('#card-table > .body.ignored');
}

function unignoreCard() {
  $(this).text('x');
  $(this).removeClass('btn-unignore');
  $(this).addClass('btn-ignore');
  $(this).parent().detach().appendTo('#card-table > .body.active');
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
