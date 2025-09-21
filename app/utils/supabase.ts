import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = 'https://nasfoieybsbrlrfsxrzf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hc2ZvaWV5YnNicmxyZnN4cnpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MTIyNDgsImV4cCI6MjA3Mzk4ODI0OH0.4U157HZts5q2ARrXVjBwup9YiRRjPRiLk-nhMfR7ruM';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;