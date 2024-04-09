import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { generateRandomHexColor } from '../src/utils/colors';

const prisma = new PrismaClient();

const main = async () => {
  const users = [];
  const events = [];

  let user = {
    firstname: 'Super',
    lastname: 'Programer',
    email: 'super@programer.com',
    password: bcrypt.hashSync('superprogramer', 5),
    avatar: '',
  } satisfies Prisma.UserCreateInput;
  let randomColor = generateRandomHexColor(
    `${user.firstname} ${user.lastname}`,
  );
  user.avatar = `https://ui-avatars.com/api/?rounded=true&background=${randomColor}&color=fff&name=${user.firstname[0]}+${user.lastname[0]}`;

  const event = {
    name: 'Nouvel an 2024',
    cover: 'assets/event-default-cover-2.jpg',
    description: faker.lorem.sentences(8),
    start_date: new Date('2023-12-31 19:00'),
    end_date: new Date('2024-01-01 14:00'),
  } satisfies Prisma.EventCreateInput;

  const event2 = {
    name: 'Week-end Pâques 2024',
    cover: 'assets/event-default-cover-3.jpg',
    description: faker.lorem.sentences(8),
    start_date: new Date('2024-03-29 18:30'),
    end_date: new Date('2024-04-01 17:00'),
  } satisfies Prisma.EventCreateInput;

  let dbUser = await prisma.user.upsert({
    where: {
      email: user.email,
    },
    update: {},
    create: {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: user.password,
      avatar: user.avatar,
      events: {
        create: [event, event2],
      },
    },
  });
  users.push(dbUser);

  /////////////

  user = {
    firstname: 'Plants',
    lastname: 'Friend',
    email: 'plants@friend.com',
    password: bcrypt.hashSync('plantsfriend', 5),
    avatar: '',
  } satisfies Prisma.UserCreateInput;
  randomColor = generateRandomHexColor(`${user.firstname} ${user.lastname}`);
  user.avatar = `https://ui-avatars.com/api/?rounded=true&background=${randomColor}&color=fff&name=${user.firstname[0]}+${user.lastname[0]}`;

  dbUser = await prisma.user.upsert({
    where: {
      email: user.email,
    },
    update: {},
    create: user,
  });
  users.push(dbUser);

  /////////////

  for (let i = 0; i < 20; i++) {
    const user = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.lorem.word(8),
      avatar: '',
    } satisfies Prisma.UserCreateInput;
    const randomColor = generateRandomHexColor(
      `${user.firstname} ${user.lastname}`,
    );
    user.avatar = `https://ui-avatars.com/api/?rounded=true&background=${randomColor}&color=fff&name=${user.firstname[0]}+${user.lastname[0]}`;

    const dbUser = await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {},
      create: user,
    });
    users.push(dbUser);
  }

  /////////////

  ////////////

  // prisma.user.update({
  //   where: {
  //     id: users[0].id,
  //   },
  //   data: {
  //     events: {
  //       connect: {
  //         id: dbEvent.id,
  //       },
  //     },
  //   },
  // });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
