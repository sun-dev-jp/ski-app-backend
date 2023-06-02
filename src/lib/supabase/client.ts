import { createClient } from '@supabase/supabase-js'
import { Database } from '../../../supabase/schema';
import * as dotenv from 'dotenv';

dotenv.config();


// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_API_KEY!
);

export default supabase;
