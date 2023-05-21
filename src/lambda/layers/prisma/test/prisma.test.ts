import * as dotenv from 'dotenv';
import { createUser } from '../client';

dotenv.config();

// jest.mock('/opt/client', () => ({
//   createUser: jest.fn()
// }));

describe('prisma', (): void => {
  it('response getUser', async () => {

    const expected = {
      id: 1,
      name: "あいうえお"
    };

    const result = await createUser("あああ")

    expect(result).toEqual(expected);

  });
  
});

