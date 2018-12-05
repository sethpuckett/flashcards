# Seth's Flashcards

My name is Seth and these are my flashcards. This application is designed to be simple to use, fast, and responsive to keyboard commands.

## Overview & Purpose

When I started doing language study I couldn't find a flashcard application or website that worked quite the way I wanted. Here are some of the issues that I encountered with the available offerings:
* Inability to add or edit cards
* Distracting ads and other clutter
* Slow load times
* Minimal or no keyboard support

Seth's Flashcards supports the following features to solve these problems:
* Decks and cards are managed via Google Spreadsheets. This makes it easy to add, remove, and edit cards en masse.
* No ads or other clutter. A minimal UI limits distraction and supports focused study.
* Once a deck is loaded there are no more calls to the server. Switching, hiding, revealing, and shuffling cards is all handled client side, meaning the application is quick and responsive.
* Once a deck is loaded all primary functionality is available via keyboard shortcuts (using one hand). After a small learning curve managing the flashcards via the keyboard is significantly faster than fiddling with a mouse.

## User Guide

### Basic Operation

When the app loads the first step is to select a deck from the dropdown list and click the 'Load Deck' button. This will load all the cards in the deck. By default one column will be hidden and the other column will be visible.

There are several UI buttons available to interact with the deck
* **Show 'left'**: Reveal all cards in the left column (and hide the right)
* **Shot 'right'**: Reveal all cards in the right column (and hide the left)
* **Hide All**: Hide all cards
* **Show All**: Reveal all cards
* **Shuffle Cards**: Shuffle the deck (non-ignored cards only) and move the selection to the first card
* **Show Deck Notes**: Reveal any notes associated with the deck; this button is only visible if there are deck notes associated with the current deck

Individual cards can be managed via the mouse:
* Clicking a card will hide or reveal it
* Clicking the '**X**' button will remove the row from the deck and send it to the list of 'Ignored' cards (at the bottom of the deck)
* Clicking the '**^**' button for an ignored row will send it back into the deck

The fastest way to interact with the flashcards (once you get used to it) is via the keyboard shortcuts:
* **A**: Hide or reveal the left card in the selected row; same as clicking the card
* **S**: Hide or reveal the right card in the selected row; same as clicking the card
* **D**: Hide or reveal the notes card in the selected row; same as clicking the card
* **F**: Remove the selected row from the deck and send it to the list of 'Ignored' cards; same as clicking the '**X**' button
* **G**: Send the last 'Ignored' row back into the deck; this is useful as an 'undo' operation when cards are accidentally ignored
* **Q**: Shuffle the deck and move the selection to the first card; same as clicking the **Shuffle Cards** button
* **E**: Change the selection to the previous row
* **R**: Change the selection to the next row
* **Z**: Show 'left' column only; same as clicking the **Show 'left'** button
* **X**: Show 'right' column only; same as clicking the **Show 'right'** button
* **C**: Hide all cards; same as clicking the **Hide All** button
* **V**: Show all cards; same as clicking the **Show All** button

On the bottom-left of the screen is a **Switch Theme** button that allows you to switch between light and dark themes. This is purely cosmetic and has no effect on functionality.

The app technically works in mobile & other small browsers and responds to touch commands, but it is really intended for use with large screens and a keyboard.

## Forking / Creating Your Own Flashcards

* Coming Soon