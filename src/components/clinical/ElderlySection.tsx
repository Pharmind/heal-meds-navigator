
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, AlertTriangle, Loader2, Search } from 'lucide-react';
import { useMedications } from '@/hooks/useSupabaseData';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

const ElderlySection = () => {
  const { data: medications, isLoading, error } = useMedications();
  const [searchTerm, setSearchTerm] = useState('');

  // Lista de medicamentos potencialmente inapropriados para idosos baseada nos Critérios de Beers
  const elderlyInappropriateMedications = [
    'diazepam', 'clonazepam', 'lorazepam', 'alprazolam', 'flurazepam',
    'amitriptilina', 'imipramina', 'doxepina', 'clomipramina',
    'indometacina', 'ibuprofeno', 'naproxeno', 'piroxicam',
    'dipirona', 'carisoprodol', 'ciclobenzaprina', 'prometazina',
    'difenidramina', 'hidroxizina', 'cimetidina', 'ranitidina'
  ];

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

  // Filtrar medicamentos padronizados que são potencialmente inapropriados para idosos
  const inappropriateMeds = medications?.filter(med => 
    elderlyInappropriateMedications.some(inappropriate => 
      med.name.toLowerCase().includes(inappropriate.toLowerCase())
    )
  ).filter(med => 
    searchTerm === '' || 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.therapeuticClass.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Medicamentos Inapropriados para Idosos</h2>
        <p className="text-gray-600">Baseado nos Critérios de Beers - Medicamentos Padronizados HEAL</p>
      </div>

      {/* Explicação sobre os Critérios de Beers */}
      <Alert className="border-blue-200 bg-blue-50">
        <Users className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Critérios de Beers</strong> são diretrizes baseadas em evidências que identificam medicamentos 
          potencialmente inapropriados para adultos com 65 anos ou mais. Estes medicamentos podem ter riscos 
          que superam os benefícios, especialmente quando alternativas mais seguras estão disponíveis.
        </AlertDescription>
      </Alert>

      {/* Campo de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Buscar medicamentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Users className="text-blue-600" size={24} />
            Medicamentos Padronizados Potencialmente Inapropriados para Idosos
          </CardTitle>
          <CardDescription className="text-blue-700">
            {inappropriateMeds.length} medicamento(s) identificado(s) na padronização HEAL
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {inappropriateMeds.length > 0 ? (
            <div className="rounded-lg border border-blue-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-blue-100">
                  <TableRow className="hover:bg-blue-100">
                    <TableHead className="font-semibold text-blue-800">Nome do Medicamento</TableHead>
                    <TableHead className="font-semibold text-blue-800">Apresentação</TableHead>
                    <TableHead className="font-semibold text-blue-800">Classe Terapêutica</TableHead>
                    <TableHead className="font-semibold text-blue-800">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inappropriateMeds.map((medication) => (
                    <TableRow key={medication.id} className="hover:bg-blue-50 border-blue-100">
                      <TableCell className="font-medium text-blue-800">
                        {medication.name}
                      </TableCell>
                      <TableCell className="text-blue-700">
                        {medication.presentation}
                      </TableCell>
                      <TableCell className="text-blue-700">
                        {medication.therapeuticClass}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">Evitar em Idosos</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'Nenhum medicamento encontrado para o termo pesquisado.' : 'Nenhum medicamento potencialmente inapropriado encontrado na padronização.'}
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">⚠️ Recomendações Importantes:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
              <li>Sempre considere alternativas mais seguras quando disponíveis</li>
              <li>Avalie o risco-benefício individual de cada paciente</li>
              <li>Monitore cuidadosamente pacientes idosos em uso destes medicamentos</li>
              <li>Considere ajustes de dose baseados na função renal e hepática</li>
              <li>Documente a justificativa clínica quando o uso for necessário</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElderlySection;
