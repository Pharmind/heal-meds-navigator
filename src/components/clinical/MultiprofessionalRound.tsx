
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Calendar, Clock, Users, FileText, Download, Edit, Trash2, Stethoscope } from 'lucide-react';
import { useMultiprofessionalRounds } from '@/hooks/useMultiprofessionalRounds';

const MultiprofessionalRound = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const {
    rounds,
    createRound,
    updateRound,
    deleteRound,
    downloadRoundPDF,
    isLoading
  } = useMultiprofessionalRounds();

  const [formData, setFormData] = useState({
    patient_name: '',
    medical_record: '',
    date: new Date().toISOString().split('T')[0],
    participants: '',
    main_issues: '',
    clinical_evolution: '',
    medication_review: '',
    next_steps: '',
    observations: ''
  });

  const [editingRound, setEditingRound] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingRound) {
        await updateRound(editingRound.id, formData);
        setEditingRound(null);
      } else {
        await createRound(formData);
      }
      
      // Reset form
      setFormData({
        patient_name: '',
        medical_record: '',
        date: new Date().toISOString().split('T')[0],
        participants: '',
        main_issues: '',
        clinical_evolution: '',
        medication_review: '',
        next_steps: '',
        observations: ''
      });
    } catch (error) {
      console.error('Erro ao salvar round:', error);
    }
  };

  const handleEdit = (round: any) => {
    setFormData({
      patient_name: round.patient_name,
      medical_record: round.medical_record,
      date: round.date,
      participants: round.participants,
      main_issues: round.main_issues,
      clinical_evolution: round.clinical_evolution,
      medication_review: round.medication_review,
      next_steps: round.next_steps,
      observations: round.observations || ''
    });
    setEditingRound(round);
    setActiveTab('create');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      await deleteRound(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2 flex items-center justify-center gap-2">
          <Stethoscope className="text-heal-green-700" size={32} />
          Decisões Clínicas - Round Multiprofissional
        </h2>
        <p className="text-gray-600">
          Registro de pacientes e decisões farmacêuticas do round multiprofissional
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === 'create' ? 'default' : 'outline'}
          onClick={() => setActiveTab('create')}
          className="flex items-center gap-2"
        >
          <UserPlus size={16} />
          {editingRound ? 'Editar Registro' : 'Novo Paciente'}
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'outline'}
          onClick={() => setActiveTab('history')}
          className="flex items-center gap-2"
        >
          <FileText size={16} />
          Registros Salvos
        </Button>
      </div>

      {activeTab === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="text-blue-600" size={24} />
              {editingRound ? 'Editar Decisões Clínicas' : 'Registrar Novo Paciente - Decisões Clínicas'}
            </CardTitle>
            <CardDescription>
              Registre as informações do paciente e as decisões clínicas tomadas no round multiprofissional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações do Paciente */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Users size={18} />
                  Informações do Paciente
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome do Paciente *</label>
                    <input
                      type="text"
                      value={formData.patient_name}
                      onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome completo do paciente"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Prontuário/Registro *</label>
                    <input
                      type="text"
                      value={formData.medical_record}
                      onChange={(e) => setFormData({ ...formData, medical_record: e.target.value })}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Número do prontuário"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Data do Round *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Participantes do Round *</label>
                    <input
                      type="text"
                      value={formData.participants}
                      onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                      placeholder="Ex: Dr. João (Médico), Ana (Enfermeira), Carlos (Farmacêutico)"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Decisões Clínicas */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Stethoscope size={18} />
                  Decisões Clínicas do Farmacêutico
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Questões Principais Discutidas *</label>
                    <textarea
                      value={formData.main_issues}
                      onChange={(e) => setFormData({ ...formData, main_issues: e.target.value })}
                      rows={3}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="Descreva as principais questões clínicas discutidas sobre o paciente"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Evolução Clínica *</label>
                    <textarea
                      value={formData.clinical_evolution}
                      onChange={(e) => setFormData({ ...formData, clinical_evolution: e.target.value })}
                      rows={3}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="Descreva a evolução clínica do paciente e avaliação farmacêutica"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Revisão de Medicamentos *</label>
                    <textarea
                      value={formData.medication_review}
                      onChange={(e) => setFormData({ ...formData, medication_review: e.target.value })}
                      rows={4}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="Avaliação farmacêutica: adequação de doses, interações, contraindicações, ajustes necessários"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Próximos Passos e Recomendações *</label>
                    <textarea
                      value={formData.next_steps}
                      onChange={(e) => setFormData({ ...formData, next_steps: e.target.value })}
                      rows={3}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="Recomendações farmacêuticas, ajustes propostos, monitoramentos necessários"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Observações Adicionais</label>
                    <textarea
                      value={formData.observations}
                      onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                      rows={2}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="Observações complementares (opcional)"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                  <FileText size={16} />
                  {editingRound ? 'Atualizar Registro' : 'Salvar Decisões Clínicas'}
                </Button>
                {editingRound && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingRound(null);
                      setFormData({
                        patient_name: '',
                        medical_record: '',
                        date: new Date().toISOString().split('T')[0],
                        participants: '',
                        main_issues: '',
                        clinical_evolution: '',
                        medication_review: '',
                        next_steps: '',
                        observations: ''
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="text-green-600" size={24} />
              Registros de Decisões Clínicas
            </CardTitle>
            <CardDescription>
              Histórico de pacientes e decisões farmacêuticas registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rounds.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Stethoscope size={64} className="mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">Nenhum registro encontrado</h3>
                <p>Cadastre o primeiro paciente para começar o registro de decisões clínicas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rounds.map((round) => (
                  <div key={round.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900">{round.patient_name}</h4>
                        <p className="text-sm text-gray-600">Prontuário: {round.medical_record}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(round.date).toLocaleDateString('pt-BR')}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(round)}
                          className="p-2"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadRoundPDF(round.id)}
                          className="p-2"
                        >
                          <Download size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(round.id)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Participantes:</p>
                        <p className="text-gray-600 mb-3">{round.participants}</p>
                        
                        <p className="font-medium text-gray-700 mb-1">Questões Principais:</p>
                        <p className="text-gray-600">{round.main_issues.substring(0, 120)}...</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Revisão de Medicamentos:</p>
                        <p className="text-gray-600 mb-3">{round.medication_review.substring(0, 120)}...</p>
                        
                        <p className="font-medium text-gray-700 mb-1">Próximos Passos:</p>
                        <p className="text-gray-600">{round.next_steps.substring(0, 120)}...</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Registrado em: {new Date(round.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiprofessionalRound;
