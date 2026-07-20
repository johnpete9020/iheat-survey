import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tedlwfgygqgkufblirks.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZGx3Zmd5Z3Fna3VmYmxpcmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NTI0MzksImV4cCI6MjEwMDAyODQzOX0.lHUJEVdzSI8iarjc5GQct5BSFQobZ6gqPRS-yqc3PQ8';

export const supabase = createClient(supabaseUrl, supabaseKey);