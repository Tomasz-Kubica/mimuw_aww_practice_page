const express = require('express')
const app = express()

app.get('/strona-testowa', function (req, res) {
  let x = 0;
  for(let i = 0; i < 1_000_000_000; i++) x += Math.random();
  res.send('Hello from \'strona testowa\'\n x = ' + x);
})

app.post('/strona-testowa', function (req, res) {
  res.status(400).send('Bad request');
})

app.get('/wycieczka/:nr', function (req, res) {
  res.send('Wycieczka numer ' + req.params.nr);
})

app.get('/wycieczka/:nr/tydzien/:tydz', function (req, res) {
  res.send('Wycieczka numer ' + req.params.nr + ' w tygodniu ' + req.params.tydz);
})

app.get('/wycieczka-q', function (req, res) {
  let nr = req.query.nr;
  let tydzien = req.query.tydzien;
  if (nr && tydzien) {
    res.send('Wycieczka numer ' + req.query.nr + ' w tygodniu ' + req.query.tydzien);
  } else {
    res.status(400).send('Bad request');
  }
})

app.listen(8080)
