import express from 'express';
const app = express()

app.set('view engine', 'pug');
app.set('views', './views');

let lista_wycieczek = {
  '1': {
    nazwa: 'Wycieczka w góry',
    streszczenie: 'Krótki opis wycieczki w góry. Donec blandit rhoncus massa sit amet interdum. Duis augue magna, cursus ornare purus vitae, tristique fermentum libero. Vestibulum finibus enim vel neque vulputate, quis feugiat metus consectetur. Suspendisse ipsum risus, sodales ac efficitur quis, facilisis sed erat.',
    cena: 42.00,
    zdiecie: 'Rysy,_szczyt.jpg',
    tytul_opisu: 'Opis wycieczki w góry',
    opis: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec blandit rhoncus massa sit amet interdum. Duis augue magna, cursus ornare purus vitae, tristique fermentum libero. Vestibulum finibus enim vel neque vulputate, quis feugiat metus consectetur. Suspendisse ipsum risus, sodales ac efficitur quis, facilisis sed erat.', 'Długi przykładowy tekst opisu wycieczki w góry. Donec blandit rhoncus massa sit amet interdum. Duis augue magna, cursus ornare purus vitae, tristique fermentum libero. Vestibulum finibus enim vel neque vulputate, quis feugiat metus consectetur. Suspendisse ipsum risus, sodales ac efficitur quis, facilisis sed erat.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec blandit rhoncus massa sit amet interdum. Duis augue magna, cursus ornare purus vitae, tristique fermentum libero. Vestibulum finibus enim vel neque vulputate, quis feugiat metus consectetur. Suspendisse ipsum risus, sodales ac efficitur quis, facilisis sed erat.', 'Jeszcze więcej tekstu opisu wycieczki w góry. Donec blandit rhoncus massa sit amet interdum. Duis augue magna, cursus ornare purus vitae, tristique fermentum libero. Vestibulum finibus enim vel neque vulputate, quis feugiat metus consectetur. Suspendisse ipsum risus, sodales ac efficitur quis, facilisis sed erat.'],
  },
  '2': {
    nazwa: 'Wycieczka gdzieś indziej',
    streszczenie: 'Nunc mattis nunc quis ipsum tristique, eu bibendum enim aliquet. Morbi gravida finibus magna, quis efficitur neque tincidunt at. Aenean aliquam eu velit a elementum.',
    cena: 215.00,
    zdiecie: 'Jez.-Osowskie-4-1024x750.jpg',
    tytul_opisu: 'Opis wycieczki 2',
    opis: ['Wymyślaniem opisów normalnie zają by się pewnie ktoś inny (Dział marketingu ???)', 'paragraf 1', 'paragraf 2', 'paragraf 3', 'paragraf 4', 'paragraf 5'],
  },
  '3': {
    nazwa: 'Jeszcze jedna wycieczka',
    streszczenie: 'Suspendisse sed nibh fringilla, aliquet justo ac, venenatis elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent blandit feugiat felis, vel interdum nibh varius ac.',
    cena: 100.10,
    zdiecie: 'Jez.-Osowskie-4-1024x750.jpg',
    tytul_opisu: 'Opis wycieczki 3',
    opis: ['Oto jest pragraf 1', 'Oto jest pragraf 2', 'Oto jest pragraf 3', 'Oto jest pragraf 4', 'Oto jest pragraf 5', 'Oto jest pragraf 6', 'Oto jest paragraf 7', 'Oto jest paragraf 8', 'Oto jest paragraf 9', 'Oto jest paragraf 10'],
  },
};

app.get('*', (req, res, next) => {
  let day = (new Date).getDate();
  let month = (new Date).getMonth();
  let year = (new Date).getFullYear();
  let date_text = day + '/' + month + '/' + year;
  console.log(date_text);
  res.locals.date = date_text;
  next()
});

app.get('/date', function (req, res) {
  res.send(res.locals.date);
});

app.get('/test_view', function (req, res) {
  res.render('test_view');
});

app.get('/glowna', function (req, res) {
  res.locals.lista_wycieczek = lista_wycieczek;
  res.locals.tab_name = 'glowna';
  res.render('glowna');
});

app.get('/wycieczka/:id', function (req, res) {
  res.locals.lista_wycieczek = lista_wycieczek;
  res.locals.id_wycieczki = req.params.id;
  res.locals.tab_name = 'wycieczka';
  res.render('wycieczka');
});

app.get('/formularz/:id', function (req, res) {
  res.locals.tab_name = 'formularz';
  res.render('formularz');
});

app.use(express.static('.'));

app.listen(8080);
