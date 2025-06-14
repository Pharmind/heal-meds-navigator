
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Calendar, Clock, Users, FileText, Download, Edit, Trash2 } from 'lucide-react';
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
    setFormData(round);
    setEditingRound(round);
    setActiveTab('create');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este round?')) {
      await deleteRound(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Round Multiprofissional</h2>
        <p className="text-gray-600">Registro e acompanhamento de rounds multiprofissionais</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === 'create' ? 'default' : 'outline'}
          onClick={() => setActiveTab('create')}
          className="flex items-center gap-2"
        >
          <FileText size={16} />
          {editingRound ? 'Editar Round' : 'Novo Round'}
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'outline'}
          onClick={() => setActiveTab('history')}
          className="flex items-center gap-2"
        >
          <Clock size={16} />
          Histórico
        </Button>
      </div>

      {activeTab === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="text-blue-600" size={24} />
              {editingRound ? 'Editar Round Multiprofissional' : 'Novo Round Multiprofissional'}
            </CardTitle>
            <CardDescription>
              Registre as discussões e decisões do round multiprofissional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome do Paciente</label>
                  <input
                    type="text"
                    value={formData.patient_name}
                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prontuário</label>
                  <input
                    type="text"
                    value={formData.medical_record}
                    onChange={(e) => setFormData({ ...formData, medical_record: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Data do Round</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Participantes</label>
                  <input
                    type="text"
                    value={formData.participants}
                    onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                    placeholder="Ex: Dr. João (Médico), Ana (Enfermeira), Carlos (Farmacêutico)"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Questões Principais Discutidas</label>
                <textarea
                  value={formData.main_issues}
                  onChange={(e) => setFormData({ ...formData, main_issues: e.target.value })}
                  rows={3}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Evolução Clínica</label>
                <textarea
                  value={formData.clinical_evolution}
                  onChange={(e) => setFormData({ ...formData, clinical_evolution: e.target.value })}
                  rows={3}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Revisão de Medicamentos</label>
                <textarea
                  value={formData.medication_review}
                  onChange={(e) => setFormData({ ...formData, medication_review: e.target.value })}
                  rows={3}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Próximos Passos</label>
                <textarea
                  value={formData.next_steps}
                  onChange={(e) => setFormData({ ...formData, next_steps: e.target.value })}
                  rows={3}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Observações Adicionais</label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  rows={2}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {editingRound ? 'Atualizar Round' : 'Salvar Round'}
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
              <Clock className="text-green-600" size={24} />
              Histórico de Rounds
            </CardTitle>
            <CardDescription>
              Rounds multiprofissionais registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rounds.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>Nenhum round registrado ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rounds.map((round) => (
                  <div key={round.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{round.patient_name}</h4>
                        <p className="text-sm text-gray-600">Prontuário: {round.medical_record}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          <Calendar size={12} className="mr-1" />
                          {new Date(round.date).toLocaleDateString('pt-BR')}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(round)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadRoundPDF(round.id)}
                        >
                          <Download size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(round.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Participantes:</strong> {round.participants}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Questões principais:</strong> {round.main_issues.substring(0, 100)}...
                    </p>
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
