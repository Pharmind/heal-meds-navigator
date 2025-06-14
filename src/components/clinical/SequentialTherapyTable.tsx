
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowRight, Loader2, Search, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

interface SequentialTherapyMedication {
  id: string;
  medication_name: string;
  iv_dosage: string;
  iv_posology: string;
  oral_dosage: string;
  oral_posology: string;
}

const SequentialTherapyTable = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: medications, isLoading, error } = useQuery({
    queryKey: ['sequential-therapy-medications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sequential_therapy_medications')
        .select('*')
        .order('medication_name');
      
      if (error) throw error;
      return data as SequentialTherapyMedication[];
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-blue-700">Carregando medicamentos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Erro ao carregar medicamentos. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const filteredMedications = medications?.filter(med => 
    searchTerm === '' || 
    med.medication_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-heal-green-800">
            <ArrowRight className="text-heal-green-600" size={24} />
            Tabela de Conversão IV → VO
          </CardTitle>
          <CardDescription>
            Medicamentos padronizados com equivalências para terapia sequencial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Campo de busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Buscar medicamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Informações importantes */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Observações importantes:</strong>
              <br />
              * Medicamentos com dosagem especial - verificar protocolos específicos
              <br />
              ** Conversão para medicamento diferente - avaliar equivalência terapêutica
            </AlertDescription>
          </Alert>

          {/* Tabela */}
          {filteredMedications.length > 0 ? (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-heal-green-100">
                  <TableRow className="hover:bg-heal-green-100">
                    <TableHead className="font-semibold text-heal-green-800">Medicamento</TableHead>
                    <TableHead className="font-semibold text-heal-green-800 text-center">Via IV</TableHead>
                    <TableHead className="font-semibold text-heal-green-800 text-center">
                      <ArrowRight className="mx-auto" size={16} />
                    </TableHead>
                    <TableHead className="font-semibold text-heal-green-800 text-center">Via Oral</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedications.map((medication) => (
                    <TableRow key={medication.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-heal-green-800">
                        {medication.medication_name}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {medication.iv_dosage}
                          </Badge>
                          <div className="text-xs text-gray-600">
                            {medication.iv_posology}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <ArrowRight className="mx-auto text-heal-green-600" size={16} />
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="space-y-1">
                          <Badge variant="secondary" className="text-xs">
                            {medication.oral_dosage}
                          </Badge>
                          <div className="text-xs text-gray-600">
                            {medication.oral_posology}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'Nenhum medicamento encontrado para o termo pesquisado.' : 'Nenhum medicamento encontrado.'}
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">💡 Dicas Importantes:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
              <li>Sempre considere a biodisponibilidade do medicamento</li>
              <li>Monitore a resposta clínica após a conversão</li>
              <li>Ajuste doses conforme função renal/hepática</li>
              <li>Considere interações medicamentosas</li>
              <li>Documente a justificativa da conversão</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SequentialTherapyTable;
