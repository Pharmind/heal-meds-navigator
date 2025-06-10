
import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ImageManager from './ImageManager';
import { Diet } from '@/types/heal';

interface DietEditDialogProps {
  diet: Diet;
  onUpdate: (updatedDiet: Diet) => void;
}

const DietEditDialog = ({ diet, onUpdate }: DietEditDialogProps) => {
  const [currentDiet, setCurrentDiet] = useState(diet);

  const handleImageUpdate = (imageUrl: string | null) => {
    const updatedDiet = { ...currentDiet, imageUrl };
    setCurrentDiet(updatedDiet);
    onUpdate(updatedDiet);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Edit size={16} />
          <span className="hidden sm:inline">Editar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Item da Dieta</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações do item */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-lg mb-2">{currentDiet.name}</h3>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Código MV:</strong> {currentDiet.mvCode}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Observação:</strong> {currentDiet.observation}
            </p>
          </div>

          {/* Gerenciamento de imagem */}
          <div>
            <h4 className="font-medium mb-3">Imagem do Item</h4>
            <ImageManager
              currentImageUrl={currentDiet.imageUrl}
              onImageUpdate={handleImageUpdate}
              itemId={currentDiet.id}
              itemName={currentDiet.name}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DietEditDialog;
