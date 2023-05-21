import * as dotenv from 'dotenv';
// import { getUser, getUsers, createUser } from '../src/lambda/prisma';
import { handler } from '../src/lambda/prisma';
import { createUser } from '../src/lambda/layers/prisma/client';

dotenv.config();

jest.mock('../src/lambda/layers/prisma/client', () => ({
  createUser: jest.fn()
}));

// jest.mock('/opt/client', () => ({
//   createUser: jest.fn()
// }));

describe('prisma', (): void => {
  // it('response getUser', async () => {

  //   const expected = {
  //     id: 1,
  //     name: "あいうえお"
  //   };

  //   const result = await getUser()

  //   expect(result).toEqual(expected);

  // });

  // it('response getUsers', async () => {

  //   const expected = {
  //     id: 1,
  //     name: "あいうえお"
  //   };

  //   const result = await getUsers()

  //   expect(result).toEqual(expected);

  // });

  it('response create', async () => {
    const expected = {
      name: "あいうえお"
    };

    const result = await handler()

    expect(result).toEqual(expected);

  });

  
});

