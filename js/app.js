$(document).ready(function () {
  loadHeaders();
  loadCards();
});

function loadHeaders() {
  $('#header-title').text(CARDS['title']);
  $('#card-header-left').text(CARDS['left-category']);;
  $('#card-header-right').text(CARDS['right-category']);;
}

function loadCards() {
  cards = CARDS['cards'];

  cards.forEach(card => {
    left = card['left'];
    right = card['right'];
    notes = card['notes'];

    var row = `
      <div class='table-row'>
        <div class='card-column left'>${left}</div>
        <div class='card-column right'>${right}</div>
        <div class='card-column notes'>${notes}</div>
      </div>
    `;

    $('#card-table > .body:last-child').append(row);
  });
}

function hideAll() {

}

function showAll() {

}

function hideLeft() {

}

function showLeft() {

}
