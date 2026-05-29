const { createClient } = require('@supabase/supabase-js');

const url = "https://uddmxgmvregxjxptqmjy.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkZG14Z212cmVneGp4cHRxbWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MTI4ODUsImV4cCI6MjA5NTE4ODg4NX0.kRwj_TvLNYwYlIap-kjEEcqCVBrQtfiaccc6zzJ36JA";

const supabase = createClient(url, key);

async function test() {
  const email = `test${Date.now()}@example.com`;
  
  console.log("Signing up...");
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: 'password123'
  });
  
  if (authError) {
    console.log("Signup error:", authError);
    return;
  }
  
  console.log("Logged in user:", authData.user?.id);
  
  const { data, error } = await supabase
    .from('papers')
    .select('*, tools(*)')
    .eq('category', 'Artificial Intelligence')
    .eq('is_active', true);
    
  console.log("Query error:", error);
  console.log("Returned rows:", data?.length);
  if (data?.length === 0) {
    console.log("0 rows returned! Let's try without tools(*)...");
    const { data: data2 } = await supabase.from('papers').select('*');
    console.log("All papers directly:", data2?.length);
  }
}

test();
