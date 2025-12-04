// lib/supabase.ts

// 1. Importação do Polyfill (Obrigatório para React Native)
// Se der erro aqui, é porque faltou rodar: npm install react-native-url-polyfill
import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

// 2. Credenciais do Projeto TechMarket (Não compartilhe publicamente em apps reais)
const supabaseUrl = 'https://apazvsehqccmoxrmilwp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwYXp2c2VocWNjbW94cm1pbHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjA3MzgsImV4cCI6MjA3OTc5NjczOH0.BGvCugCf1LS3ZS0lONrB_wT62IvgFbttQXsb2VTKRjw';

// 3. Criação e exportação do cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey);