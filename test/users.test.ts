import * as dotenv from 'dotenv';
import { getUsers } from '../src/lambda/users';

dotenv.config();

describe('Lambda_Authorizer_Function', (): void => {
  it('response policy', async () => {

    const expected = {
      
    };

    const result = await getUsers({} as any, {} as any, {} as any);

    // expect(result).toEqual(expected);

  });
});
