import { getUsers } from '../src/lambda/users';
import * as dotenv from 'dotenv';

dotenv.config();

const event = {}

describe('users', (): void => {
  it.skip('response getUsers', async () => {
    const expected = {};
    const result = await getUsers(event as any, {} as any, {} as any);

    expect(result).toEqual(expected);
  });
});

