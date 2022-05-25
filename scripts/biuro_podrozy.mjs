import express from 'express';
import bodyParser from 'body-parser';
import { Transaction } from 'sequelize';
import { body, validationResult} from 'express-validator';

// const { trips } = await import('./database.mjs');
import { trips, requests, sequelize } from './database.mjs';

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

console.log('running');

app.use(express.static('.'));

app.use(bodyParser.urlencoded({ extended: false }));

// app.get('*', (req, res, next) => {
//   const day = (new Date()).getDate();
//   const month = (new Date()).getMonth();
//   const year = (new Date()).getFullYear();
//   const dateText = `${day}/${month}/${year}`;
//   console.log(dateText);
//   res.locals.date = dateText;
//   next();
// });

app.get('/date', (req, res) => {
  res.send(res.locals.date);
});

app.get('/test_view', (req, res) => {
  res.render('test_view');
});

app.get('/glowna', async (req, res) => {
  const tripsTable = await trips.findAll();
  // for (let i = 0; i < tripsTable.length; i += 1) {
  //   console.log(tripsTable[i].name);
  // }

  res.locals.listaWycieczek = tripsTable;
  res.locals.tab_name = 'glowna';
  res.render('glowna');
});

app.get('/wycieczka/:name/:popup_message?', async (req, res) => {
  res.locals.wycieczka = await trips.findByPk(req.params.name);
  res.locals.tab_name = 'wycieczka';
  res.locals.popup_message = req.params.popup_message;
  res.render('wycieczka');
});

app.get('/formularz/:id', (req, res) => {
  res.locals.tab_name = 'formularz';
  res.render('formularz');
});

app.post(
  '/formularz/:id',
  body('email').isEmail().withMessage('Niepoprawny email'),
  body('name').isLength({ min: 1, max: 40 }).withMessage('Imię musi mieć od 1 do 40 znaków'),
  body('surname').isLength({ min: 1, max: 40 }).withMessage('Nazwisko musi mieć od 1 do 40 znaków'),
  body('ile_osob').isInt({ min: 1 }).withMessage('Ilość osób musi być większa od 0'),
  async (req, res) => {
    res.locals.tab_name = 'formularz';
    res.locals.errorDescription = null;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      res.locals.errorDescription = errors.array().at(0).msg;
      res.render('formularz');
      return;
    }

    console.log(req.params.id);
    console.log(req.body.name);
    console.log(req.body.surname);
    console.log(req.body.ile_osob);
    console.log(req.body.email);

    const transaction = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    const trip = await trips.findByPk(req.params.id, { transaction });
    if (trip === null) {
      transaction.rollback();
      res.locals.errorDescription = `Nie znaleziono wycieczki o podanym id (${req.params.id}).`;
      res.render('formularz');
      return;
    }
    if (trip.amount < req.body.ile_osob) {
      transaction.rollback();
      res.locals.errorDescription = `Nie ma wystarczającej ilości miejsc na wycieczce. Pozostało ${trip.amount} miejsc.`;
      res.render('formularz');
      return;
    }
    console.log(trip.amount);
    console.log(req.body.ile_osob);
    console.log(trip.amount - req.body.ile_osob);
    await trip.update({
      amount: trip.amount - req.body.ile_osob,
    }, { transaction });
    await requests.create({
      tripName: req.params.id,
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      amount: req.body.ile_osob,
    }, { transaction });

    res.redirect(`/wycieczka/${req.params.id}/${'Pomyślnie zarezerwowano wycieczkę!'}`);
  },
);

app.listen(8080);
