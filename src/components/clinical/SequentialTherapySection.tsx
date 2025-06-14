
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, RotateCcw, Route } from 'lucide-react';
import SequentialTherapyFlowchart from './SequentialTherapyFlowchart';
import SequentialTherapyTable from './SequentialTherapyTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SequentialTherapySection = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Terapia Sequencial</h2>
        <p className="text-gray-600">Fluxograma para conversão IV → VO</p>
      </div>

      <Tabs defaultValue="flowchart" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="flowchart" className="flex items-center gap-2">
            <Route size={16} />
            Fluxograma Interativo
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <ArrowRight size={16} />
            Tabela de Medicamentos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="flowchart">
          <SequentialTherapyFlowchart />
        </TabsContent>
        
        <TabsContent value="table">
          <SequentialTherapyTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SequentialTherapySection;
