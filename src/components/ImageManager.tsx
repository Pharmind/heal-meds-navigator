
import React, { useState } from 'react';
import { Upload, Link, X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageManagerProps {
  currentImageUrl?: string;
  onImageUpdate: (imageUrl: string | null) => void;
  itemId: string;
  itemName: string;
}

const ImageManager = ({ currentImageUrl, onImageUpdate, itemId, itemName }: ImageManagerProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo de imagem válido.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Criar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${itemId}-${Date.now()}.${fileExt}`;
      const filePath = `diet-images/${fileName}`;

      // Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('diet-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('diet-images')
        .getPublicUrl(filePath);

      // Atualizar o banco de dados
      const { error: updateError } = await supabase
        .from('diets')
        .update({ image_url: publicUrl })
        .eq('id', itemId);

      if (updateError) {
        throw updateError;
      }

      onImageUpdate(publicUrl);
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });

    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Limpar o input
      event.target.value = '';
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;

    try {
      // Atualizar o banco de dados
      const { error } = await supabase
        .from('diets')
        .update({ image_url: urlInput.trim() })
        .eq('id', itemId);

      if (error) {
        throw error;
      }

      onImageUpdate(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
      toast({
        title: "Sucesso",
        description: "URL da imagem atualizada com sucesso!",
      });

    } catch (error) {
      console.error('Erro ao atualizar URL:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar a URL. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveImage = async () => {
    try {
      const { error } = await supabase
        .from('diets')
        .update({ image_url: null })
        .eq('id', itemId);

      if (error) {
        throw error;
      }

      onImageUpdate(null);
      toast({
        title: "Sucesso",
        description: "Imagem removida com sucesso!",
      });

    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover a imagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Imagem atual */}
      {currentImageUrl && (
        <div className="relative group">
          <img 
            src={currentImageUrl} 
            alt={itemName}
            className="w-full h-32 object-cover rounded-md cursor-pointer"
          />
          
          {/* Overlay com ações */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center gap-2">
            {/* Botão para expandir */}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                  <ZoomIn size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>{itemName}</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center">
                  <img 
                    src={currentImageUrl} 
                    alt={itemName}
                    className="max-w-full max-h-96 object-contain rounded-md"
                  />
                </div>
              </DialogContent>
            </Dialog>

            {/* Botão para remover */}
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={handleRemoveImage}
              className="bg-red-500/90 hover:bg-red-600"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Botões de ação */}
      <div className="flex gap-2">
        {/* Upload de arquivo */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <Button 
            variant="outline" 
            size="sm" 
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            <Upload size={16} />
            {isUploading ? 'Enviando...' : 'Upload'}
          </Button>
        </div>

        {/* URL */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex items-center gap-2"
        >
          <Link size={16} />
          URL
        </Button>
      </div>

      {/* Input para URL */}
      {showUrlInput && (
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Cole a URL da imagem aqui..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1"
          />
          <Button size="sm" onClick={handleUrlSubmit}>
            Salvar
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              setShowUrlInput(false);
              setUrlInput('');
            }}
          >
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageManager;
