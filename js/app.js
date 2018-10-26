$(document).ready(function () {

  var TOPIC_SPREADSHEET_KEY = '159Xdlkq_k9gr5kUt_ICNHOlVmqWXxTwxR3LBemNMKAU';

  Tabletop.init({
    key: TOPIC_SPREADSHEET_KEY,
    callback: loadAllDecks,
    simpleSheet: true
  });

  loadHeaders();
  loadCards();

  $("#btn-hide-all").on('click', hideAll);
  $("#btn-show-all").on('click', showAll);
  $("#btn-hide-left").on('click', hideLeft);
  $("#btn-hide-right").on('click', hideRight);
  $(".card").on('click', toggleCard);
  $("#card-table").on('click', ".btn-ignore", ignoreCard);
  $("#card-table").on('click', ".btn-unignore", unignoreCard);

  $('#btn-load-deck').on('click', deckSelected);
});

function loadAllDecks(data) {
  data.forEach(function(deck) {
    name = deck.name;
    key = deck.key;
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

function loadDeck(data) {
  var left = Object.keys(data[0])[0];
  var right = Object.keys(data[0])[1];
  $('#header-title').text($('#sel-deck').find(':selected').text());
  $('#card-header-left').text(left);
  $('#card-header-right').text(right);
  $('#btn-hide-left').text(`Hide ${left}`);
  $('#btn-hide-right').text(`Hide ${right}`);
}

function loadHeaders() {
  $('#header-title').text(CARDS['title']);
  $('#card-header-left').text(CARDS['left-category']);
  $('#card-header-right').text(CARDS['right-category']);
  $('#btn-hide-left').text(`Hide ${CARDS['left-category']}`);
  $('#btn-hide-right').text(`Hide ${CARDS['right-category']}`);
}

function loadCards() {
  cards = CARDS['cards'];

  cards.forEach(card => {
    left = card['left'];
    right = card['right'];
    notes = card['notes'];

    var row = `
      <div class='table-row'>
        <div class='card-column card left'><p>${left}</p></div>
        <div class='card-column card right'><p>${right}</p></div>
        <div class='card-column card notes'><p>${notes || ''}</p></div>
        <button class='btn-ignore'>x</button>
      </div>
    `;

    $('#card-table > .body.active').append(row);
  });
}

function hideAll() {
  $('.card p').fadeOut();
}

function showAll() {
  $('.card p').fadeIn();
}

function hideLeft() {
  $('.card.left p').fadeOut();
}

function hideRight() {
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