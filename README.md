# One Hundred Books 

An interactive guide to the Norwegian Book Club's 100 greatest books of all time list from 2002. You can browse every title with cover art, a short summary, and a link to the ethical Bookshop.org to buy any of the books if interested.

Live site: https://onehundredbooks.org

<img width="560" height="623" alt="screenshot of one hundred book website" src="https://github.com/user-attachments/assets/43b6087e-14b0-4a70-819c-1ff0a826ad55" />

## Why I built this

When working as a bookseller at Foyles, I came across this list and the urge grew to have a small physical bookstore that only stocked 100 books and served coffee. Unfortunately this idea never came to pass. After training as a programmer, I decided it was a good little starter project to get my teeth into.

## Features 

- Browse all 100 books from the 2002 Norwegian Book Clubs list
- Cover art and summary for each book
- Map featuring the rough location of where the book was written
- Date of publication
- Responsive layout that works on desktop and mobile

## Tech Stack

- Front end - React, JavaScript, HTML, CSS
- Build tooling - Vite, ESLint
- Hosting - Vercel
- Domain - https://onehundredbooks.org

## Getting started

You'll need Node.js installed.

```js
git clone https://github.com/gavinhousley/one-hundred-books.git
cd one-hundred-books
npm install
npm run dev
```

Then open the local URL Vite prints in your terminal (usually https://localhost:5173).
To create a production build:

```js
npm run build
npm run preview
```

## Project structure

- src/          # React components, styles and book data
- scripts/      # A pretender script to give each book page an actual URL, book cover helper, and a typewriter script that simulates the overview text arriving one word at a time
- index.html    # App entry point
- vite.config.js
- vercel.json   # Vercel deployment config

## Data

The books were chosen based on recommended translations, but are of course all subjectively chosen. At times the versions were quite difficult to choose from, or even extremely limited in English language versions. The site is essentially anchored to an affiliate page I have as part of Bookshop.org's affiliate program. The cover images have come from there. The introductions have come from wikipedia descriptions.

## What I learned

- Initially there were a few different views for the display of the project - all of the books mapped out and all of the books in a progressive timeline. As interesting as this was, the user interface just wasn't very inviting or well designed. So for simplicity I decided to strip it right back to basics.
- Handling a data set of 100 items cleanly
- Deploying with Vercel and connecting a custom domain
- Making the layout work for desktop and mobile

## Stretch goals

- To re-implement the timeline option - and figure a way to display this graphically that doesn't get in the way of the covers, especially on mobile
- To bring the larger map view back into the project so that people can browse all books by location
- To have accounts on the page so that people can mark which books they've read, and also leave reviews or comments.

## About the list
The Norwegian Book Clubs list was published in 2002 after a vote among 100 authors from 54 countries.

## Author

Gavin Housley - [Portfolio](https://gavinhousley.com) - [LinkedIn](https://linkedin/in/gavinhousley) - [Github](https://github.com/gavinhousley)





