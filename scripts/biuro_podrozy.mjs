import express from 'express';
import bodyParser from 'body-parser';
import { Transaction } from 'sequelize';
import { body, validationResult} from 'express-validator';
import bcrypt from 'bcrypt';
import session from 'express-session';

// const { trips } = await import('./database.mjs');
import { trips, requests, users, sequelize } from './database.mjs';

const saltRounds = 10;

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

console.log('running');

app.use(express.static('.'));

app.use(bodyParser.urlencoded({ extended: false }));

app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    sameSite: true,
  },
}));

app.get('/date', (req, res) => {
  res.send(res.locals.date);
});

app.get('/test_view', (req, res) => {
  res.render('test_view');
});

app.get('/glowna/:popup_message?', async (req, res) => {
  const tripsTable = await trips.findAll();
  // for (let i = 0; i < tripsTable.length; i += 1) {
  //   console.log(tripsTable[i].name);
  // }

  res.locals.listaWycieczek = tripsTable;
  res.locals.tab_name = 'glowna';
  res.locals.popup_message = req.params.popup_message;
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
  // body('email').isEmail().withMessage('Niepoprawny email'),
  body('name').isLength({ min: 1, max: 40 }).withMessage('Imię musi mieć od 1 do 40 znaków'),
  body('surname').isLength({ min: 1, max: 40 }).withMessage('Nazwisko musi mieć od 1 do 40 znaków'),
  body('ile_osob').isInt({ min: 1 }).withMessage('Ilość osób musi być większa od 0'),
  async (req, res) => {
    res.locals.tab_name = 'formularz';
    res.locals.errorDescription = null;
    const errors = validationResult(req);
    if (!errors.isEmpty() || req.session.logged_email == null) {
      if (req.session.logged_email == null) {
        res.locals.errorDescription = 'Zaloguj się';
      } else {
        console.log(errors.array());
        res.locals.errorDescription = errors.array().at(0).msg;
      }
      res.render('formularz');
      return;
    }


    console.log(req.params.id);
    console.log(req.body.name);
    console.log(req.body.surname);
    console.log(req.body.ile_osob);
    console.log(req.body.email);

    const transaction = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    const trip = await trips.findByPk(req.params.id, { lock: true, transaction });
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
      email: req.session.logged_email,
      amount: req.body.ile_osob,
    }, { transaction });
    transaction.commit();
    res.redirect(`/wycieczka/${req.params.id}/${'Pomyślnie zarezerwowano wycieczkę!'}`);
  },
);

app.get(
  '/registration', (req, res) => {
    res.locals.tab_name = 'zarejstruj się';
    res.render('registration');
  });

app.post(
  '/registration',
  body('email').isEmail().withMessage('Niepoprawny email'),
  body('name').isLength({ min: 1, max: 40 }).withMessage('Imię musi mieć od 1 do 40 znaków'),
  body('surname').isLength({ min: 1, max: 40 }).withMessage('Nazwisko musi mieć od 1 do 40 znaków'),
  body('password').isLength({ min: 5 }).withMessage('Hasło musi mieć przynajmniej 5 znaków'),
  body('password_repeat').isLength({ min: 5 }).withMessage('Hasło musi mieć przynajmniej 5 znaków'),
  async (req, res) => {
    res.locals.tab_name = 'zarejstruj się';
    const errors = validationResult(req);
    let errorMessage = '';
    if (!errors.isEmpty()) {
      errorMessage = errors.array().at(0).msg;
    } else if (req.body.password !== req.body.password_repeat) {
      errorMessage = 'Powtórzone hasło musi być takie samo jak oryginalne';
    }
    if (errorMessage.length > 0) {
      // console.log(errors.array());
      res.locals.errorDescription = errorMessage;
      res.render('registration');
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await users.create({
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        password: hashedPassword,
      });
    } catch (err) {
      res.locals.errorDescription = 'Nie udało się utworzyć użytkownika';
      res.render('registration');
      return;
    }
    res.redirect(`/glowna/${'Pomyślnie zarejestrowano użytkownika!'}`);
  },
);

app.get(
  '/login', (req, res) => {
    res.locals.tab_name = 'zaloguj się';
    if (req.session.logged_email) {
      res.redirect('/user');
      return;
    }
    res.render('login');
  });

app.post(
  '/login',
  body('email').isEmail().withMessage('Niepoprawny email'),
  body('password').isLength({ min: 5 }).withMessage('Hasło musi mieć przynajmniej 5 znaków'),
  async (req, res) => {
    res.locals.tab_name = 'zaloguj się';
    res.locals.form_email = req.body.email;
    res.locals.form_password = req.body.password;
    const errors = validationResult(req);
    let errorMessage = '';
    if (!errors.isEmpty()) {
      errorMessage = errors.array().at(0).msg;
      res.locals.errorDescription = errorMessage;
      res.render('login');
      return;
    }
    const user = await users.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (user === null) {
      res.locals.errorDescription = 'Nie znaleziono użytkownika o podanym emailu';
      res.render('login');
      return;
    }
    console.log(req.body.password);
    console.log(user.password);
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      res.locals.errorDescription = 'Niepoprawne hasło';
      res.render('login');
      return;
    }
    req.session.logged_email = req.body.email;
    res.redirect('/user');
  },
);

app.get(
  '/logout', (req, res) => {
    res.locals.tab_name = 'wyloguj się';
    req.session.logged_email = null;
    res.redirect('/glowna');
  });

app.get(
  '/user', async (req, res) => {
    res.locals.tab_name = 'użytkownik';
    if (!req.session.logged_email) {
      res.redirect(`/glowna/${'nie zalogowano'}`);
      return;
    }
    const user = await users.findOne({
      where: {
        email: req.session.logged_email,
      },
      include: [{
        model: requests,
      }],
    });
    const requests2 = await requests.findAll({
      where: {
        email: req.session.logged_email,
      },
    });
    console.log(requests2);
    console.log("length: " + requests2.length);
    res.locals.logged_user = user;
    res.locals.requests = requests2; //user['Requests'];
    // console.log(user);
    // console.log(user['Requests']);
    res.render('user');
  });

app.get('/api/wycieczki/all/', async (req, res) => {
  // res.send(await trips.findAll());
  const tripsToSend = {
    trips: [
      {
        image: '',
        name: 'Wycieczka do Krakowa',
        desc: 'Wycieczka do Krakowa normal desc',
        short_desc: 'Wycieczka do Krakowa short desc',
        price: 42,
      }
    ],
  };
  res.send(tripsToSend);
});

app.listen(8080);
