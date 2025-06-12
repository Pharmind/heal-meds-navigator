
import React from 'react';
import { ZoomIn } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface DietImageDialogProps {
  imageUrl: string;
  dietName: string;
  children: React.ReactNode;
}

const DietImageDialog = ({ imageUrl, dietName, children }: DietImageDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ZoomIn size={20} />
            {dietName}
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <img 
            src={imageUrl} 
            alt={dietName}
            className="max-w-full max-h-96 object-contain rounded-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const errorDiv = target.nextElementSibling as HTMLElement;
              if (errorDiv) errorDiv.style.display = 'flex';
            }}
          />
          <div 
            className="hidden w-full h-96 bg-gray-100 rounded-md items-center justify-center"
          >
            <p className="text-gray-500">Erro ao carregar imagem</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DietImageDialog;
