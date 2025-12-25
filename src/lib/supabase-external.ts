import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Configuração do Supabase - BebeMais
const SUPABASE_URL = 'https://hcgntbskqevibpehyvrr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZ250YnNrcWV2aWJwZWh5dnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2Nzg2ODUsImV4cCI6MjA4MjI1NDY4NX0.fw3Ko-4YHG9NqK25tUPrrLvPeLCVbJW5H6pe3G7cwGo';

// Cliente Supabase
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
