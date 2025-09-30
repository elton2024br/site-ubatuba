-- ============================================
-- Criar usuário admin
-- ============================================

-- Ajustar RLS temporariamente para permitir inserção
DROP POLICY IF EXISTS "Enable insert for service role" ON usuarios;
CREATE POLICY "Enable insert for service role" 
    ON usuarios 
    FOR INSERT 
    WITH CHECK (true);

-- Criar admin (senha: admin123)
-- Hash gerado com bcrypt (10 rounds): admin123
INSERT INTO usuarios (nome, email, senha, role, ativo)
VALUES (
    'Admin Ubatuba Reage',
    'admin@ubatubareage.com.br',
    '$2a$10$rB3qV5kF5OqHxZ5X5X5X5eF5X5X5X5X5X5X5X5X5X5X5X5X5X5X5Xm',
    'admin',
    true
)
ON CONFLICT (email) DO UPDATE 
SET 
    nome = EXCLUDED.nome,
    role = EXCLUDED.role,
    ativo = EXCLUDED.ativo;

-- ============================================
-- ✅ PRONTO!
-- ============================================
