// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Reemplaza estos valores con tus credenciales de Supabase
const supabaseUrl = 'https://socrjpknusvhszvscugr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY3JqcGtudXN2aHN6dnNjdWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzMjQwMzYsImV4cCI6MjA2MTkwMDAzNn0.JsPcaHpQMt8gjslDrhetU4e7ila1zM98oK3Ofc-atec';

export const supabase = createClient(supabaseUrl, supabaseKey);

