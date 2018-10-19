$(document).ready(function () {
  loadHeaders();
  loadCards();

  $("#btn-hide-all").on('click', hideAll);
  $("#btn-show-all").on('click', showAll);
  $("#btn-hide-left").on('click', hideLeft);
  $("#btn-hide-right").on('click', hideRight);
  $(".card").on('click', toggleCard);
  $("#card-table").on('click', ".btn-ignore", ignoreCard);
  $("#card-table").on('click', ".btn-unignore", unignoreCard);
});

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