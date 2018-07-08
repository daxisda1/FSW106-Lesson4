const express = require('express');
const sqlite = require('sqlite3').verbose();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const db = new sqlite.Database('./Chinook_Sqlite_AutoIncrementPKs.sqlite');

const query = `SELECT * from Artist LIMIT 100`;

const app = express();

app.use(bodyParser.urlencoded({ extended: false}))
app.engine('hbs', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'hbs');

app.get('/albums', (req, res) => {
  let albums = [];
  db.each(`
  SELECT Title as Album, Name as Artist 
  FROM Album 
  JOIN Artist USING(ArtistId)
  `, (err, row) => {
    if( err ) throw err;
    console.log(row)
    albums.push(row);
  })
  res.render('albums', {albums})
})


app.get('/artists', (req, res) => {
  let artists = [];
  db.each(`
  SELECT *
  FROM Artist 
  ORDER BY ArtistId DESC
  `, (err, row) => {
    if( err ) throw err;
    artists.push(row);
  })
  res.render('artists', {artists})
})
app.post('/artists', (req, res) => {
  
  db.run(`INSERT INTO Artist (Name) VALUES('${req.body.name}')`, (err, row) => {
    if( err ) throw err;
    res.redirect('/artists');
  })
})

app.get('/tracks', (req, res) => {
  let tracks = [];
  db.each(`
  SELECT t.Name Track, t.Milliseconds Length
  FROM Track t
  ORDER BY Milliseconds DESC
  `, (err, row) => {
    if( err ) throw err;
    tracks.push(row);
  })
  res.render('tracks', {tracks})
})

app.post('/tracks', (req, res) => {
  let tracks = [];
  db.each(`
  SELECT t.Name Track, t.Milliseconds Length
  FROM Track t
  WHERE t.Milliseconds > ${req.body.minutes * (60 * 1000) + req.body.seconds * 1000}
  ORDER BY Milliseconds DESC
  LIMIT 1000
  `, (err, row) => {
    if( err ) throw err;
    tracks.push(row);
  })
  res.render('tracks', {tracks})
})

app.listen(3000, () => console.log('hello it works!'));