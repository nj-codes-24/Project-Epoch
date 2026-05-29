const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/web/.env.local' });
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.log("Missing credentials", { url: !!url, key: !!key });
  process.exit(1);
}

const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('papers').select('*');
  console.log("Error:", error);
  console.log("Papers count:", data?.length);
  console.log("Papers:", JSON.stringify(data, null, 2));
}

check();
