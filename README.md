# Flashcards
![App Screenshot](img/app-screenshot-01.png "App Screenshot")

This is a simple flashcard app that is designed to be fast and responsive to keyboard commands.

## Table of Contents
* **[Overview & Purpose](#overview--purpose)**
* **[User Guide](#user-guide)**
* **[Creating Your Own Flashcards](#creating-your-own-flashcards)**
* **[Configuring the Application](#configuring-the-application)**
* **[Help](#help)**

## Overview & Purpose

When I started doing language study I couldn't find a flashcard application or website that worked quite the way I wanted. Here are some of the issues that I encountered with the available offerings:
* Inability to add or edit cards
* Distracting ads and other clutter
* Slow load times
* Minimal or no keyboard support

This application is an attempt to solve these problems with the following features:
* Decks and cards are managed via Google Spreadsheets. This makes it easy to add, remove, and edit cards.
* No ads or other clutter. A minimal UI limits distraction and supports focused study.
* Once a deck is loaded there are no more calls to the server. Switching, hiding, revealing, and shuffling cards is all handled in the browser, meaning the application is quick and responsive.
* Once a deck is loaded all primary functionality is available via keyboard shortcuts. After a small learning curve managing the flashcards via the keyboard is significantly faster than fiddling with a mouse.

## User Guide

### Providing a spreadsheet

Flashcard values are stored in Google Spreadsheets. Published spreadsheets have a key which can be used to load the flashcard values into the application. To load a spreadsheet copy its key into the input box and click `Load Spreadsheet`. If you're having trouble or if you would like more information about creating your own flashcards see the section "[Creating Your Own Flashcards](#creating-your-own-flashcards)". If you don't want to enter the spreadsheet key every time you can bookmark the application after you've loaded a spreadsheet, or configure the application to load a default spreadsheet on startup. There is more information about that in the section "[Configuring the Application](#configuring-the-application)".

### Selecting a Deck

Spreadsheets can contain mulitple decks of flashcards. If a spreadsheet contains only one deck it will be selected automatically when the spreadsheet is loaded. Otherwise you will need to select a deck and press `Load Deck` to begin. This will display all the cards in the deck. By default one column will be hidden and the other column will be visible.

### Commands

When a deck is loaded you can interact with the application via mouse, tap, or keyboard commands.

There are several buttons available on the UI to interact with the deck:
* **Show 'left'**: Reveal all cards in the left column (and hide the right)
* **Show 'right'**: Reveal all cards in the right column (and hide the left)
* **Hide All**: Hide all cards
* **Show All**: Reveal all cards
* **Shuffle Cards**: Shuffle the deck (non-ignored cards only) and move the selection to the first card
* **Show Deck Notes**: Reveal any notes associated with the deck; this button is only visible if there are deck notes associated with the current deck

Individual cards can be managed via the mouse or tap:
* Clicking a card will hide or reveal it
* Clicking the '**X**' button will remove the row from the deck and send it to the list of 'Ignored' cards (at the bottom of the deck)
* Clicking the '**^**' button for an ignored row will send it back into the deck

The fastest way to interact with the flashcards (once you get used to it) is via the keyboard shortcuts:
* **A**: Hide or reveal the left card in the selected row; same as clicking the card
* **S**: Hide or reveal the right card in the selected row; same as clicking the card
* **D**: Hide or reveal the notes card in the selected row; same as clicking the card
* **F**: Remove the selected row from the deck and send it to the list of 'Ignored' cards; same as clicking the '**X**' button
* **G**: Send the last 'Ignored' row back into the deck; this is useful as an 'undo' operation when cards are accidentally ignored
* **H**: Shuffle the deck and move the selection to the first card; same as clicking the **Shuffle Cards** button
* **E**: Change the selection to the previous row
* **R**: Change the selection to the next row
* **Z**: Show 'left' column only; same as clicking the **Show 'left'** button
* **X**: Show 'right' column only; same as clicking the **Show 'right'** button
* **C**: Hide all cards; same as clicking the **Hide All** button
* **V**: Show all cards; same as clicking the **Show All** button

On the bottom-left of the screen is a **Switch Theme** button that allows you to switch between light and dark themes. This is purely cosmetic and has no effect on functionality.

## Creating Your Own Flashcards

Want to make your own flashcards? Great! It's as simple as adding the values to a Google Spreadsheet and making the spreadsheet public.

### Setting up the spreadsheet

The app reads the card values from Google Spreadsheets using `Tabletop.js`. There is a little setup involved and the spreadsheets need to be formatted in a particular way for everything to work correctly. The steps below will help you get started.

1. Go to [Google Drive](https://drive.google.com) and create a new **Google Sheet**.
2. Add as many sheets as you want. Each individual sheet will correspond to a different deck of flashcards. The name of the sheet will be the name of the deck.
3. Each sheet needs 2 columns for values and optionally a third column for `Notes`. Values in the first row are used as headers and are not placed on cards. If you're adding a `Notes` column it **must** be the third column and have the heading `Notes`.
**Example**:
![Creating cards in a spreadsheet](img/app-cards.png "Creatings cards in a spreadsheet")

4. You also have the ability to add `Deck Notes` that will appear at the top of the page when a new deck is loaded. This can be useful for describing the content of decks and providing links to additional resources. To add deck notes add a new sheet to your Google Sheet with the specially reserved name `notes`. This sheet needs 2 columns with the headings `name` and `notes`. Values in the `name` column must match the name of a sheet **exactly**. Values in the note column support html, so feel free to add links, line breaks, bold text, etc.
**Example**:
![Creating deck notes in a spreadsheet](img/app-notes.png "Creatings deck notes in a spreadsheet")

5. Publish your spreadsheet and make it public. Check out the [Getting Started section of the Tabletop.js documentation](https://github.com/jsoma/tabletop#getting-started) for more detailed instructions on this part. The `tldr` steps are here:
    * Publish your spreadsheet to the web.
    * Share your spreadsheet with `anyone with the link`.
    * Copy the url from the `link to share` (or just the key value from the link).
6. To test that everything is working correctly paste the key into the input field in the application and click `Load Spreadsheet`.

And that's it! If everything is setup correctly then upon loading the spreadsheet the dropdown menu should populate with the names of the decks from your spreadsheet. Click `Load Deck` and you should be able to start interacting with your cards.

### Additional Options
You have the ability to include sheets in your Google Sheet that are *not* loaded as decks. This can be useful for decks that aren't ready yet or for development notes. To ignore a sheet change its name so that it begins with "**ignore-**" (e.g. "**ignore-Klingon Grammar Notes**").

## Configuring the application

Feel free to clone or fork the application and modify it to your heart's content. Basic configuration can be managed via the `js/config.js` file.

### Running the application

The app is designed to be simple, so there is no build step. Just open `index.html` in your favorite browser and you're ready to go.

### Configuration Options

Configuration options can be found in `js/config.js`. To make changes just update any of the available values and refresh the page.

* **DEFAULT_SPREADSHEET_KEY**: Key for a public, published Google Spreadsheet containing flashcard values. If this value is present in your configuration then the spreadsheet will be loaded automatically upon application startup.
* **ENABLE_SPREADSHEET_CHANGE**: Whether or not users can enter a new spreadsheet key. If this is set to `false` be sure you've provided a default spreadsheet key! This is useful for eliminating onscreen clutter if you only intend to use a single spreadsheet.
* **DEFAULT_THEME**: Determines which theme should be loaded when the application starts, either `light` or `dark`
* **DEFAULT_VISIBLE_COLUMN**: Determines which column should be visible and which should be hidden when the application starts, either `left` or `right`

## Help

* Found a bug? Feel free to open an issue. (No promises I'll get to it, though)
* Trying to make your own flashcards and something isn't working? Here are some tips:
  * Double check your spelling and your casing. If you're adding deck notes the sheet must be named `notes` and must have 2 columns with headings `name` and `notes`. The values in the `name` column must much the names of your other sheets **exactly**. Casing is important.
  * Did you publish your spreadsheet to the web **and** share it? You need to do both. Check the [Tabletop.js documentation](https://github.com/jsoma/tabletop#getting-started) if you're not sure.
  * Are there extra columns and/or blank rows in your spreadsheet? If so, get rid of them and try again.
* [Here](https://docs.google.com/spreadsheets/d/159Xdlkq_k9gr5kUt_ICNHOlVmqWXxTwxR3LBemNMKAU/edit?usp=sharing) is a link to the Google Sheet I use for Spanish/English flashcards. Feel free to use it as an example.