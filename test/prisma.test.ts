import * as dotenv from 'dotenv';
import { create } from '../lib/prisma';

dotenv.config();

describe('Lambda_Authorizer_Function', (): void => {
  it.skip('response policy', async () => {

    const expected = {
      name: "あいうえお"
    };

    const result = await create()

    const { id, ...resultWithoutId } = result; 

    expect(resultWithoutId).toEqual(expected);

  });
});

