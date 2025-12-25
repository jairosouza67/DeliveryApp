-- BebeMais - Schema do Banco de Dados
-- Execute este SQL no Supabase SQL Editor
-- https://supabase.com/dashboard/project/hcgntbskqevibpehyvrr/sql/new

-- ======================
-- TABELA DE PRODUTOS
-- ======================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Política: Produtos são públicos para leitura
CREATE POLICY "Produtos são públicos para leitura" ON public.products
  FOR SELECT USING (true);

-- Política: Qualquer um pode inserir/atualizar (para testes)
CREATE POLICY "Permitir todas operações" ON public.products
  FOR ALL USING (true);

-- ======================
-- TABELA DE CLIENTES
-- ======================
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  cpf_cnpj TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clientes públicos" ON public.customers FOR ALL USING (true);

-- ======================
-- TABELA DE PEDIDOS (quotes)
-- ======================
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_id UUID REFERENCES public.customers(id),
  items JSONB DEFAULT '[]'::jsonb,
  total_value NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pedidos públicos" ON public.quotes FOR ALL USING (true);

-- ======================
-- TABELA DE FORNECEDORES
-- ======================
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  cnpj TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Fornecedores públicos" ON public.suppliers FOR ALL USING (true);

-- ======================
-- TABELA DE ROLES
-- ======================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Roles públicos" ON public.user_roles FOR ALL USING (true);

-- ======================
-- TABELA DE LEMBRETES
-- ======================
CREATE TABLE IF NOT EXISTS public.renewal_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID REFERENCES public.quotes(id) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  reminder_date DATE NOT NULL,
  renewal_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.renewal_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lembretes públicos" ON public.renewal_reminders FOR ALL USING (true);

-- ======================
-- FUNÇÃO has_role
-- ======================
CREATE OR REPLACE FUNCTION public.has_role(_role public.app_role, _user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
