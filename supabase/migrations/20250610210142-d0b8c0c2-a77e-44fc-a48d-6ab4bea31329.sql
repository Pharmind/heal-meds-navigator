
-- Adicionar coluna para URL da imagem na tabela diets
ALTER TABLE public.diets 
ADD COLUMN image_url TEXT;

-- Adicionar comentário para documentar o campo
COMMENT ON COLUMN public.diets.image_url IS 'URL da imagem do item da dieta para facilitar identificação visual';
