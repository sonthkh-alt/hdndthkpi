import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://cxrbeeknbigkrwzotxcz.supabase.co', 'sb_publishable_2kOa1fTwN57an3Gijez9dQ_9QmB2uOx');
async function run() {
  const { data, error } = await supabase.from('app_state').upsert({ id: 'main', data: { test: 1 } });
  console.log('Upsert Error:', error);
  const res = await supabase.from('app_state').select('*');
  console.log('Select Error:', res.error);
  console.log('Select Data:', res.data);
}
run();
