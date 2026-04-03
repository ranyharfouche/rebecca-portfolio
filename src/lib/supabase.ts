import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mszwzpogamcnrjyfbffn.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zend6cG9nYW1jbnJqeWZiZmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIxMzgzNiwiZXhwIjoyMDkwNzg5ODM2fQ.mWfbrApuc1X-3RPcuTIugRL9OV2EoFfHbavecmgKofY'

export const supabase = createClient(supabaseUrl, supabaseServiceKey)
