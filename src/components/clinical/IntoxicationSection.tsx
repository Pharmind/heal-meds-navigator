
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useIntoxications } from '@/hooks/useSupabaseData';

const IntoxicationSection = () => {
  const { data: intoxications, isLoading, error } = useIntoxications();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-heal-green-600" />
        <span className="ml-2 text-heal-green-600">Carregando dados de intoxicações...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Erro ao carregar dados de intoxicações.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Intoxicações e Antídotos</h2>
        <p className="text-gray-600">Principais intoxicações e seus respectivos antídotos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="text-red-600" size={24} />
            Protocolos de Antídotos
          </CardTitle>
          <CardDescription>
            {intoxications?.length || 0} protocolos de intoxicação cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {intoxications?.map((item) => (
              <div key={item.id} className="border rounded-lg p-6 space-y-4 bg-gradient-to-r from-red-50 to-orange-50">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-lg text-gray-800">
                    Intoxicação por: {item.intoxicationAgent}
                  </h4>
                  <Badge variant="destructive">Urgente</Badge>
                </div>
                
                <div className="grid gap-4">
                  <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
                    <span className="font-medium text-heal-green-700 block mb-1">Antídoto:</span>
                    <p className="text-gray-800">{item.antidote}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
                    <span className="font-medium text-heal-green-700 block mb-1">Posologia:</span>
                    <p className="text-gray-800">{item.antidoteDosage}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                    <span className="font-medium text-heal-green-700 block mb-1">Preparo e Administração:</span>
                    <p className="text-gray-800">{item.preparationAdministration}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="font-medium text-heal-green-700 block mb-1">Bibliografia:</span>
                    <p className="text-sm text-gray-600">{item.bibliography}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {(!intoxications || intoxications.length === 0) && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum protocolo de intoxicação encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IntoxicationSection;
