import { Eye, Pill, Package, UtensilsCrossed, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Medication, Material, Diet } from '../types/heal';
import DietImageDialog from './DietImageDialog';

interface CategoryTableProps {
  category: 'medications' | 'materials' | 'diets';
  medications: Medication[];
  materials: Material[];
  diets: Diet[];
  onMedicationClick: (medication: Medication) => void;
}

const CategoryTable = ({ 
  category, 
  medications, 
  materials, 
  diets, 
  onMedicationClick 
}: CategoryTableProps) => {
  const getCategoryData = () => {
    switch (category) {
      case 'medications':
        return {
          title: 'Medicamentos',
          icon: Pill,
          data: medications,
          columns: ['Código MV', 'Nome', 'Apresentação', 'Classe Terapêutica', 'Ações']
        };
      case 'materials':
        return {
          title: 'Materiais',
          icon: Package,
          data: materials,
          columns: ['Código MV', 'Nome', 'Observação']
        };
      case 'diets':
        return {
          title: 'Dietas',
          icon: UtensilsCrossed,
          data: diets,
          columns: ['Código MV', 'Imagem', 'Nome', 'Observação']
        };
      default:
        return null;
    }
  };

  const categoryData = getCategoryData();
  
  if (!categoryData) return null;

  const { title, icon: Icon, data, columns } = categoryData;

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-heal-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Icon className="text-heal-green-600" size={24} />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum item encontrado</h3>
        <p className="text-gray-500">Não há {title.toLowerCase()} cadastrados no sistema.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header da categoria */}
      <div className="flex items-center gap-3">
        <Icon className="text-heal-green-600" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-heal-green-800">{title}</h2>
          <p className="text-sm text-gray-600">{data.length} {data.length === 1 ? 'item' : 'itens'} encontrado{data.length === 1 ? '' : 's'}</p>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow-md border border-heal-green-200 overflow-hidden">
        <ScrollArea className="h-[600px] w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-heal-green-50">
                {columns.map((column, index) => (
                  <TableHead key={index} className="font-semibold text-heal-green-800">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id} className="hover:bg-heal-green-50">
                  <TableCell className="font-medium">{item.mvCode}</TableCell>
                  
                  {category === 'diets' && (
                    <TableCell>
                      {(item as Diet).imageUrl ? (
                        <DietImageDialog 
                          imageUrl={(item as Diet).imageUrl!} 
                          dietName={item.name}
                        >
                          <div>
                            <img 
                              src={(item as Diet).imageUrl} 
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-md hover:opacity-80 transition-opacity"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const placeholder = target.nextElementSibling as HTMLElement;
                                if (placeholder) placeholder.style.display = 'flex';
                              }}
                            />
                            <div 
                              className="hidden w-12 h-12 bg-gray-100 rounded-md items-center justify-center"
                            >
                              <ImageIcon className="text-gray-400" size={16} />
                            </div>
                          </div>
                        </DietImageDialog>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                          <ImageIcon className="text-gray-400" size={16} />
                        </div>
                      )}
                    </TableCell>
                  )}
                  
                  <TableCell className="font-medium">{item.name}</TableCell>
                  
                  {category === 'medications' && (
                    <>
                      <TableCell className="text-sm text-gray-600">
                        {(item as Medication).presentation}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {(item as Medication).therapeuticClass}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onMedicationClick(item as Medication)}
                          className="flex items-center gap-2 hover:bg-heal-green-100"
                        >
                          <Eye size={16} />
                          <span className="hidden sm:inline">Ver detalhes</span>
                        </Button>
                      </TableCell>
                    </>
                  )}
                  
                  {category === 'materials' && (
                    <TableCell className="text-sm text-gray-600 max-w-xs">
                      <div className="truncate" title={(item as Material).observation}>
                        {(item as Material).observation}
                      </div>
                    </TableCell>
                  )}

                  {category === 'diets' && (
                    <TableCell className="text-sm text-gray-600 max-w-xs">
                      <div className="truncate" title={(item as Diet).observation}>
                        {(item as Diet).observation}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CategoryTable;
