const express = require("express");
const app = express();
const postBank = require('./postBank.js');
// app.get("/", (req, res) => res.send("Hello World!"));
const morgan = require('morgan')

const path = require('path')
app.use(express.static('public'))

app.use(morgan('dev'));




app.get("/", (req, res) => {

  const list = postBank.list();

  html = `<!DOCTYPE html>
  <html>
  <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
  <div class="news-list">
    <header><img src="/logo.png"/>Wizard News</header>
    ${list.map(post => `
      <div class='news-item'>
        <p>
          <span class="news-position">${post.id}. ▲</span><a href="/posts/${post.id}">${post.title}</a>
          <small>(by ${post.name})</small>
        </p>
        
        <small class="news-info">
          ${post.upvotes} upvotes | ${post.date}
        </small>
      </div>`
    ).join('')}
  </div>
</body>
</html>`;

res.send(html);
});

app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);

  if (!post.id) {
    res.status("404");
    throw new Error('Sorry no post found');
  }

  html = `<!DOCTYPE html>
  <html>
  <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
  <div class="news-list">
    <header><img src="/logo.png"/>Wizard News</header>
      <div class='news-item'>
        <p>
          <span class="news-position">${post.id}. ▲</span>${post.title}
          <small>(by ${post.name})</small>
          <h3>${post.content}</h3>
        </p>
        <small class="news-info">
          ${post.upvotes} upvotes | ${post.date}
        </small>
      </div>
  </div>
</body>
</html>`
// }


  res.send(html);
});

app.use((err, req, res, next) => {
  res.send(`
        <h1>Uh oh!</h1>
        <p>${err.message}</p>
    `);
});




const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
