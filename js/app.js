$(document).ready(function () {
  loadHeaders();
  loadCards();

  $("#btn-hide-all").on('click', hideAll);
  $("#btn-show-all").on('click', showAll);
  $("#btn-hide-left").on('click', hideLeft);
  $("#btn-hide-right").on('click', hideRight);
  $(".card").on('click', toggleCard);
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
        <div class='card-column card notes'><p>${notes}</p></div>
      </div>
    `;

    $('#card-table > .body:last-child').append(row);
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