
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  useTherapeuticGroups,
  useReferenceMedications,
  useAddTherapeuticGroup,
  useAddReferenceMedication,
  useAddTherapeuticAlternative,
  useAllTherapeuticAlternatives
} from '@/hooks/useTherapeuticAlternatives';

const TherapeuticAlternativesManagement = () => {
  const { toast } = useToast();
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newMedicationName, setNewMedicationName] = useState('');
  const [newMedicationIngredient, setNewMedicationIngredient] = useState('');
  const [newMedicationClass, setNewMedicationClass] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedMedicationId, setSelectedMedicationId] = useState('');
  const [alternativeName, setAlternativeName] = useState('');
  const [alternativeIngredient, setAlternativeIngredient] = useState('');
  const [dosage, setDosage] = useState('');
  const [route, setRoute] = useState('');
  const [equivalentDose, setEquivalentDose] = useState('');
  const [considerations, setConsiderations] = useState('');
  const [contraindications, setContraindications] = useState('');
  const [availability, setAvailability] = useState<'disponivel' | 'indisponivel' | 'controlado'>('disponivel');

  const { data: groups, isLoading: loadingGroups } = useTherapeuticGroups();
  const { data: medications, isLoading: loadingMedications } = useReferenceMedications();
  const { data: alternatives, isLoading: loadingAlternatives } = useAllTherapeuticAlternatives();

  const addGroupMutation = useAddTherapeuticGroup();
  const addMedicationMutation = useAddReferenceMedication();
  const addAlternativeMutation = useAddTherapeuticAlternative();

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do grupo é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      await addGroupMutation.mutateAsync({
        name: newGroupName,
        description: newGroupDescription || null,
      });

      toast({
        title: "Sucesso",
        description: "Grupo terapêutico adicionado com sucesso",
      });

      setNewGroupName('');
      setNewGroupDescription('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar grupo terapêutico",
        variant: "destructive",
      });
    }
  };

  const handleAddMedication = async () => {
    if (!newMedicationName.trim() || !selectedGroupId) {
      toast({
        title: "Erro",
        description: "Nome do medicamento e grupo são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      await addMedicationMutation.mutateAsync({
        name: newMedicationName,
        therapeutic_group_id: selectedGroupId,
        active_ingredient: newMedicationIngredient || null,
        therapeutic_class: newMedicationClass || null,
      });

      toast({
        title: "Sucesso",
        description: "Medicamento de referência adicionado com sucesso",
      });

      setNewMedicationName('');
      setNewMedicationIngredient('');
      setNewMedicationClass('');
      setSelectedGroupId('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar medicamento de referência",
        variant: "destructive",
      });
    }
  };

  const handleAddAlternative = async () => {
    if (!alternativeName.trim() || !dosage.trim() || !route.trim() || !selectedMedicationId) {
      toast({
        title: "Erro",
        description: "Campos obrigatórios: nome, dosagem, via e medicamento de referência",
        variant: "destructive",
      });
      return;
    }

    try {
      await addAlternativeMutation.mutateAsync({
        reference_medication_id: selectedMedicationId,
        alternative_name: alternativeName,
        active_ingredient: alternativeIngredient || null,
        dosage,
        administration_route: route,
        equivalent_dose: equivalentDose || null,
        considerations: considerations || null,
        contraindications: contraindications || null,
        availability,
      });

      toast({
        title: "Sucesso",
        description: "Alternativa terapêutica adicionada com sucesso",
      });

      // Limpar formulário
      setAlternativeName('');
      setAlternativeIngredient('');
      setDosage('');
      setRoute('');
      setEquivalentDose('');
      setConsiderations('');
      setContraindications('');
      setAvailability('disponivel');
      setSelectedMedicationId('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar alternativa terapêutica",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-heal-green-800 mb-2">Gerenciamento da Base de Dados</h3>
        <p className="text-gray-600">Adicione novos grupos, medicamentos de referência e alternativas terapêuticas</p>
      </div>

      <Tabs defaultValue="alternatives" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alternatives">Alternativas</TabsTrigger>
          <TabsTrigger value="medications">Medicamentos</TabsTrigger>
          <TabsTrigger value="groups">Grupos</TabsTrigger>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        </TabsList>

        <TabsContent value="alternatives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="text-green-600" size={24} />
                Adicionar Alternativa Terapêutica
              </CardTitle>
              <CardDescription>
                Adicione uma nova alternativa para um medicamento de referência existente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Medicamento de Referência *</Label>
                  <Select value={selectedMedicationId} onValueChange={setSelectedMedicationId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o medicamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {medications?.map((med) => (
                        <SelectItem key={med.id} value={med.id}>
                          {med.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="alternativeName">Nome da Alternativa *</Label>
                  <Input
                    id="alternativeName"
                    value={alternativeName}
                    onChange={(e) => setAlternativeName(e.target.value)}
                    placeholder="Ex: Paracetamol"
                  />
                </div>
                <div>
                  <Label htmlFor="alternativeIngredient">Princípio Ativo</Label>
                  <Input
                    id="alternativeIngredient"
                    value={alternativeIngredient}
                    onChange={(e) => setAlternativeIngredient(e.target.value)}
                    placeholder="Ex: Paracetamol"
                  />
                </div>
                <div>
                  <Label htmlFor="dosage">Dosagem *</Label>
                  <Input
                    id="dosage"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="Ex: 500-1000mg 6/6h"
                  />
                </div>
                <div>
                  <Label htmlFor="route">Via de Administração *</Label>
                  <Input
                    id="route"
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    placeholder="Ex: VO/IV"
                  />
                </div>
                <div>
                  <Label htmlFor="equivalentDose">Dose Equivalente</Label>
                  <Input
                    id="equivalentDose"
                    value={equivalentDose}
                    onChange={(e) => setEquivalentDose(e.target.value)}
                    placeholder="Ex: 750mg = 500mg dipirona"
                  />
                </div>
                <div>
                  <Label>Disponibilidade</Label>
                  <Select value={availability} onValueChange={(value: 'disponivel' | 'indisponivel' | 'controlado') => setAvailability(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disponivel">Disponível</SelectItem>
                      <SelectItem value="indisponivel">Indisponível</SelectItem>
                      <SelectItem value="controlado">Controlado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="considerations">Considerações Clínicas</Label>
                <Textarea
                  id="considerations"
                  value={considerations}
                  onChange={(e) => setConsiderations(e.target.value)}
                  placeholder="Ex: Hepatotoxicidade em doses elevadas. Máximo 4g/dia."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="contraindications">Contraindicações</Label>
                <Textarea
                  id="contraindications"
                  value={contraindications}
                  onChange={(e) => setContraindications(e.target.value)}
                  placeholder="Ex: Hepatopatia grave"
                  rows={2}
                />
              </div>

              <Button 
                onClick={handleAddAlternative} 
                className="w-full"
                disabled={addAlternativeMutation.isPending}
              >
                {addAlternativeMutation.isPending ? 'Adicionando...' : 'Adicionar Alternativa'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="text-blue-600" size={24} />
                Adicionar Medicamento de Referência
              </CardTitle>
              <CardDescription>
                Adicione um novo medicamento que servirá como referência para alternativas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="medicationName">Nome do Medicamento *</Label>
                  <Input
                    id="medicationName"
                    value={newMedicationName}
                    onChange={(e) => setNewMedicationName(e.target.value)}
                    placeholder="Ex: Dipirona"
                  />
                </div>
                <div>
                  <Label>Grupo Terapêutico *</Label>
                  <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups?.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="medicationIngredient">Princípio Ativo</Label>
                  <Input
                    id="medicationIngredient"
                    value={newMedicationIngredient}
                    onChange={(e) => setNewMedicationIngredient(e.target.value)}
                    placeholder="Ex: Metamizol"
                  />
                </div>
                <div>
                  <Label htmlFor="medicationClass">Classe Terapêutica</Label>
                  <Input
                    id="medicationClass"
                    value={newMedicationClass}
                    onChange={(e) => setNewMedicationClass(e.target.value)}
                    placeholder="Ex: Analgésico/Antipirético"
                  />
                </div>
              </div>

              <Button 
                onClick={handleAddMedication} 
                className="w-full"
                disabled={addMedicationMutation.isPending}
              >
                {addMedicationMutation.isPending ? 'Adicionando...' : 'Adicionar Medicamento'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="text-purple-600" size={24} />
                Adicionar Grupo Terapêutico
              </CardTitle>
              <CardDescription>
                Crie uma nova categoria para organizar medicamentos similares
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="groupName">Nome do Grupo *</Label>
                <Input
                  id="groupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ex: Analgésicos e Antipiréticos"
                />
              </div>
              <div>
                <Label htmlFor="groupDescription">Descrição</Label>
                <Textarea
                  id="groupDescription"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Ex: Medicamentos para alívio da dor e febre"
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleAddGroup} 
                className="w-full"
                disabled={addGroupMutation.isPending}
              >
                {addGroupMutation.isPending ? 'Adicionando...' : 'Adicionar Grupo'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="text-purple-600" size={20} />
                  Grupos Terapêuticos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{groups?.length || 0}</div>
                <p className="text-sm text-gray-600">categorias disponíveis</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="text-blue-600" size={20} />
                  Medicamentos de Referência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{medications?.length || 0}</div>
                <p className="text-sm text-gray-600">medicamentos base</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  Alternativas Cadastradas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{alternatives?.length || 0}</div>
                <p className="text-sm text-gray-600">alternativas disponíveis</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Grupos Terapêuticos Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {groups?.map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{group.name}</span>
                      {group.description && (
                        <p className="text-sm text-gray-600">{group.description}</p>
                      )}
                    </div>
                    <Badge variant="outline">
                      {medications?.filter(med => med.therapeutic_group_id === group.id).length || 0} medicamentos
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TherapeuticAlternativesManagement;
