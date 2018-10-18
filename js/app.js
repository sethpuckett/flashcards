$(document).ready(function () {
  loadHeaders();
  loadCards();
});

function loadHeaders() {
  $("#header-title").text(CARDS['title']);
  $('#card-header-left').text(CARDS['left-category']);;
  $('#card-header-right').text(CARDS['right-category']);;
}

function loadCards() {
  cards = CARDS['cards'];

  cards.forEach(card => {
    left = card['left'];
    right = card['right'];
    notes = card['notes'];

    var tr = `<tr><td class='left'>${left}</td><td class='right'>${right}</td><td class='notes'>${notes}</td></tr>`;
    $('#card-table > tbody:last-child').append(tr);
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
