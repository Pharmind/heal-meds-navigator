
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TreatmentEstimation, useSaveTreatmentEstimation } from '@/hooks/useTreatmentEstimations';
import { Search, Edit3, Save, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { stockUnits } from './constants';

interface EstimationConsultationProps {
  estimations: TreatmentEstimation[];
  hospitalUnit: string;
  onEstimationUpdated?: () => void;
}

const EstimationConsultation = ({ estimations, hospitalUnit, onEstimationUpdated }: EstimationConsultationProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEstimation, setEditingEstimation] = useState<TreatmentEstimation | null>(null);
  const [editForm, setEditForm] = useState<Partial<TreatmentEstimation>>({});
  
  const saveMutation = useSaveTreatmentEstimation();

  // Filtrar estimativas por busca
  const filteredEstimations = estimations.filter(estimation =>
    estimation.antimicrobialName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (estimation: TreatmentEstimation) => {
    setEditingEstimation(estimation);
    setEditForm({
      dosePerPatient: estimation.dosePerPatient,
      activePatients: estimation.activePatients,
      estimatedDays: estimation.estimatedDays,
      currentStock: estimation.currentStock,
      stockUnit: estimation.stockUnit
    });
  };

  const handleSaveEdit = () => {
    if (!editingEstimation || !editForm) return;

    console.log('🔄 Atualizando estimativa:', editingEstimation.antimicrobialName);

    saveMutation.mutate({
      estimationDate: editingEstimation.estimationDate,
      hospitalUnit: editingEstimation.hospitalUnit,
      antimicrobialName: editingEstimation.antimicrobialName,
      dosePerPatient: editForm.dosePerPatient || 0,
      activePatients: editForm.activePatients || 0,
      estimatedDays: editForm.estimatedDays || 7,
      currentStock: editForm.currentStock || 0,
      stockUnit: editForm.stockUnit || 'mg',
      dailyTotalConsumption: editForm.dosePerPatient || 0,
      daysRemaining: 0, // Será recalculado
      alertLevel: 'normal', // Será recalculado
      stockCoverageDays: 0, // Será recalculado
    }, {
      onSuccess: () => {
        setEditingEstimation(null);
        setEditForm({});
        onEstimationUpdated?.();
      }
    });
  };

  const handleCancelEdit = () => {
    setEditingEstimation(null);
    setEditForm({});
  };

  const getAlertColor = (alertLevel: string) => {
    switch (alertLevel) {
      case 'crítico': return 'bg-red-500 text-white';
      case 'baixo': return 'bg-orange-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="text-purple-600" size={20} />
          Consultar e Atualizar Estimativas
        </CardTitle>
        <CardDescription>
          Busque e edite estimativas já cadastradas para {hospitalUnit}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campo de Busca */}
        <div className="space-y-2">
          <Label>Buscar Antimicrobiano</Label>
          <Input
            placeholder="Digite o nome do antimicrobiano..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Lista de Estimativas */}
        <div className="space-y-4">
          {filteredEstimations.length === 0 && (
            <Alert>
              <Search className="h-4 w-4" />
              <AlertDescription>
                {searchTerm ? 'Nenhuma estimativa encontrada para esta busca.' : 'Nenhuma estimativa cadastrada para este setor hoje.'}
              </AlertDescription>
            </Alert>
          )}

          {filteredEstimations.map((estimation) => (
            <Card key={estimation.id} className="border-l-4 border-l-purple-400">
              <CardContent className="pt-4">
                {editingEstimation?.id === estimation.id ? (
                  // Modo de Edição
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg">{estimation.antimicrobialName}</h4>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveEdit}
                          disabled={saveMutation.isPending}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save size={16} className="mr-1" />
                          {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          size="sm"
                        >
                          <X size={16} className="mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Dose Total Diária ({editForm.stockUnit || 'mg'})</Label>
                        <Input
                          type="number"
                          value={editForm.dosePerPatient || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, dosePerPatient: Number(e.target.value) }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Pacientes Ativos</Label>
                        <Input
                          type="number"
                          value={editForm.activePatients || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, activePatients: Number(e.target.value) }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dias Estimados</Label>
                        <Input
                          type="number"
                          value={editForm.estimatedDays || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, estimatedDays: Number(e.target.value) }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Estoque Atual</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={editForm.currentStock || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, currentStock: Number(e.target.value) }))}
                            className="flex-1"
                          />
                          <Select 
                            value={editForm.stockUnit || 'mg'} 
                            onValueChange={(value) => setEditForm(prev => ({ ...prev, stockUnit: value }))}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {stockUnits.map(unit => (
                                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Modo de Visualização
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-lg">{estimation.antimicrobialName}</h4>
                        <Badge className={getAlertColor(estimation.alertLevel)}>
                          {estimation.daysRemaining.toFixed(1)} dias restantes
                        </Badge>
                      </div>
                      <Button
                        onClick={() => handleEdit(estimation)}
                        variant="outline"
                        size="sm"
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <Edit3 size={16} className="mr-1" />
                        Editar
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-blue-50 p-3 rounded border">
                        <div className="text-gray-600 text-xs">Pacientes</div>
                        <div className="font-semibold text-blue-700">{estimation.activePatients}</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded border">
                        <div className="text-gray-600 text-xs">Consumo Diário</div>
                        <div className="font-semibold text-purple-700">
                          {estimation.dailyTotalConsumption.toLocaleString('pt-BR')} {estimation.stockUnit}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded border">
                        <div className="text-gray-600 text-xs">Estoque</div>
                        <div className="font-semibold text-gray-700">
                          {estimation.currentStock.toLocaleString('pt-BR')} {estimation.stockUnit}
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded border">
                        <div className="text-gray-600 text-xs">Cobertura</div>
                        <div className="font-semibold text-green-700">{estimation.stockCoverageDays} dias</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EstimationConsultation;
