import { trips, requests } from './database.mjs';

await trips.sync({ force: true });
await requests.sync({ force: true });

const mountainTrip = trips.build({
  name: 'Mountain Trip',
  desc: 'A trip to the mountains. It is a great trip. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  short_desc: 'A trip to the mountains. It is a great trip. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  image: 'http://127.0.0.1:8080/images/mountain.jpg',
  price: 42.00,
  start_date: '2022-08-07',
  end_date: '2022-09-07',
  amount: 10,
});
await mountainTrip.save();

const lakeTrip = trips.build({
  name: 'Lake Trip',
  desc: 'It is a great trip. Nunc mattis nunc quis ipsum tristique, eu bibendum enim aliquet. Morbi gravida finibus magna, quis efficitur neque tincidunt at. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Morbi gravida finibus magna, quis efficitur neque tincidunt at. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  short_desc: 'Nunc mattis nunc quis ipsum tristique, eu bibendum enim aliquet. Morbi gravida finibus magna, quis efficitur neque tincidunt at. Nunc mattis nunc quis ipsum tristique, eu bibendum enim aliquet. Morbi gravida finibus magna, quis efficitur neque tincidunt at.',
  image: 'http://127.0.0.1:8080/images/lake.jpg',
  price: 12.50,
  start_date: '2022-04-06',
  end_date: '2022-12-06',
  amount: 22,
});
await lakeTrip.save();

const anotherLakeTrip = trips.build({
  name: 'Another Lake Trip',
  desc: 'It is a great trip. Nunc mattis nunc quis ipsum tristique, eu bibendum enim aliquet. Morbi gravida finibus magna, quis efficitur neque tincidunt at. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Morbi gravida finibus magna, quis efficitur neque tincidunt at. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  short_desc: 'Nunc mattis nunc quis ipsum tristique, eu bibendum enim aliquet. Morbi gravida finibus magna, quis efficitur neque tincidunt at. Nunc mattis nunc quis ipsum tristique, eu bibendum enim aliquet. Morbi gravida finibus magna, quis efficitur neque tincidunt at.',
  image: 'http://127.0.0.1:8080/images/lake.jpg',
  price: 12.50,
  start_date: '2022-04-06',
  end_date: '2022-12-06',
  amount: 22,
});
await anotherLakeTrip.save();

const mountainRequest1 = requests.build({
  tripName: 'Mountain Trip',
  name: 'Tomasz',
  surname: 'Kubica',
  email: 'tomasz_kubica@email.com',
  amount: 2,
});
await mountainRequest1.save();

const mountainRequest2 = requests.build({
  tripName: 'Mountain Trip',
  name: 'John',
  surname: 'Adams',
  email: 'JhonAdams@gmail.com',
  amount: 1,
});
await mountainRequest2.save();
