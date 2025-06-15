
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MultiprofessionalRound } from '@/types/multiprofessionalRound';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  User, 
  Calendar, 
  MapPin, 
  Activity, 
  Heart, 
  Pill, 
  Target, 
  AlertCircle, 
  Home, 
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface RoundViewModalProps {
  round: MultiprofessionalRound | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RoundViewModal: React.FC<RoundViewModalProps> = ({
  round,
  isOpen,
  onClose
}) => {
  if (!round) return null;

  const BooleanIndicator = ({ value, label }: { value: boolean; label: string }) => (
    <div className="flex items-center gap-2">
      {value ? (
        <CheckCircle size={16} className="text-green-600" />
      ) : (
        <XCircle size={16} className="text-red-600" />
      )}
      <span className="text-sm">{label}</span>
    </div>
  );

  const StatusBadge = ({ value }: { value: string | null }) => {
    if (!value) return <span className="text-gray-400">Não informado</span>;
    
    const color = value === 'Preservada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    return <Badge className={color}>{value}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity size={20} />
            Detalhes do Round - {format(new Date(round.round_date), 'dd/MM/yyyy', { locale: ptBR })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Paciente */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User size={18} />
                Identificação do Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Nome:</span> {round.patient?.patient_name || 'Não informado'}
                </div>
                <div>
                  <span className="font-medium">Tipo de Round:</span> 
                  <Badge variant="outline" className="ml-2">{round.round_type}</Badge>
                </div>
                <div>
                  <span className="font-medium">Setor:</span> {round.patient?.sector || 'Não informado'}
                </div>
                <div>
                  <span className="font-medium">Leito:</span> {round.patient?.bed || 'Não informado'}
                </div>
                {round.patient?.birth_date && (
                  <div>
                    <span className="font-medium">Data de Nascimento:</span> {format(new Date(round.patient.birth_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                )}
                {round.patient?.hospitalization_days && (
                  <div>
                    <span className="font-medium">Dias de Internação:</span> {round.patient.hospitalization_days}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Atual */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity size={18} />
                Status Atual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <BooleanIndicator value={round.dvas_usage} label="DVAs em uso" />
                <BooleanIndicator value={round.sedation_analgesia} label="Sedoanalgesia" />
                <BooleanIndicator value={round.antibiotic_therapy} label="Antibioticoterapia" />
                <BooleanIndicator value={round.tev_prophylaxis} label="Profilaxia TEV" />
                <BooleanIndicator value={round.lamg_prophylaxis} label="Profilaxia LAMG" />
              </div>
              
              {(round.dvas_usage_obs || round.sedation_analgesia_obs || round.antibiotic_therapy_obs) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">Observações:</h4>
                    {round.dvas_usage_obs && (
                      <p className="text-sm"><strong>DVAs:</strong> {round.dvas_usage_obs}</p>
                    )}
                    {round.sedation_analgesia_obs && (
                      <p className="text-sm"><strong>Sedoanalgesia:</strong> {round.sedation_analgesia_obs}</p>
                    )}
                    {round.antibiotic_therapy_obs && (
                      <p className="text-sm"><strong>Antibioticoterapia:</strong> {round.antibiotic_therapy_obs}</p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Avaliação Funcional */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart size={18} />
                Avaliação Funcional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Função Renal:</span> 
                  <StatusBadge value={round.renal_function} />
                  {round.renal_function_obs && (
                    <p className="text-sm text-gray-600 mt-1">{round.renal_function_obs}</p>
                  )}
                </div>
                <div>
                  <span className="font-medium">Função Hepática:</span> 
                  <StatusBadge value={round.hepatic_function} />
                  {round.hepatic_function_obs && (
                    <p className="text-sm text-gray-600 mt-1">{round.hepatic_function_obs}</p>
                  )}
                </div>
                <div>
                  <span className="font-medium">Função Pulmonar:</span> 
                  <StatusBadge value={round.pulmonary_function} />
                  {round.pulmonary_function_obs && (
                    <p className="text-sm text-gray-600 mt-1">{round.pulmonary_function_obs}</p>
                  )}
                </div>
                <div>
                  <span className="font-medium">Evacuação:</span> 
                  <StatusBadge value={round.evacuation} />
                  {round.evacuation_obs && (
                    <p className="text-sm text-gray-600 mt-1">{round.evacuation_obs}</p>
                  )}
                </div>
                <div>
                  <span className="font-medium">Diurese:</span> 
                  <StatusBadge value={round.diuresis} />
                  {round.diuresis_obs && (
                    <p className="text-sm text-gray-600 mt-1">{round.diuresis_obs}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Farmacoterapia */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Pill size={18} />
                Farmacoterapia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <BooleanIndicator value={round.severe_drug_interaction} label="Interação medicamentosa grave" />
                <BooleanIndicator value={round.adequate_administration_route} label="Via de administração adequada" />
                <BooleanIndicator value={round.drug_allergy} label="Alergia medicamentosa" />
                <BooleanIndicator value={round.updated_lab_data} label="Dados laboratoriais atualizados" />
              </div>

              {round.antibiotic_therapy && (
                <>
                  <Separator />
                  <h4 className="font-medium">Antibioticoterapia:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <BooleanIndicator value={round.indication_compliance} label="Indicação em conformidade" />
                    <BooleanIndicator value={round.adequate_spectrum} label="Espectro adequado" />
                    <BooleanIndicator value={round.correct_dosage} label="Posologia correta" />
                    <BooleanIndicator value={round.treatment_time_defined} label="Tempo de tratamento definido" />
                  </div>
                  {round.antibiotic_action && (
                    <div>
                      <span className="font-medium">Ação necessária:</span> 
                      <Badge variant="outline" className="ml-2">{round.antibiotic_action}</Badge>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Metas Terapêuticas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target size={18} />
                Metas Terapêuticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <BooleanIndicator value={round.adequate_glycemic_control} label="Controle glicêmico adequado" />
                {round.adequate_glycemic_control_obs && (
                  <p className="text-sm text-gray-600 ml-6">{round.adequate_glycemic_control_obs}</p>
                )}
                
                <BooleanIndicator value={round.adequate_sedation_level} label="Nível de sedação adequado" />
                {round.adequate_sedation_level_obs && (
                  <p className="text-sm text-gray-600 ml-6">{round.adequate_sedation_level_obs}</p>
                )}
                
                <BooleanIndicator value={round.sedation_can_be_reduced} label="Sedação pode ser reduzida" />
                {round.sedation_can_be_reduced_obs && (
                  <p className="text-sm text-gray-600 ml-6">{round.sedation_can_be_reduced_obs}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Problemas Ativos */}
          {round.active_problems && round.active_problems.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle size={18} />
                  Problemas Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {round.active_problems.map((problem, index) => (
                    <div key={problem.id || index} className="border rounded p-3 space-y-2">
                      <div>
                        <span className="font-medium">Problema {index + 1}:</span> {problem.problem_description}
                      </div>
                      {problem.expected_result && (
                        <div>
                          <span className="font-medium">Resultado Esperado:</span> {problem.expected_result}
                        </div>
                      )}
                      {problem.status && (
                        <div>
                          <span className="font-medium">Status:</span> 
                          <Badge variant="outline" className="ml-2">{problem.status}</Badge>
                        </div>
                      )}
                      {problem.observations && (
                        <div>
                          <span className="font-medium">Observações:</span> {problem.observations}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Planejamento de Alta */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Home size={18} />
                Planejamento de Alta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <BooleanIndicator value={round.discharge_estimate} label="Há estimativa de alta" />
                <BooleanIndicator value={round.discharge_criteria_met} label="Critérios de alta atingidos" />
              </div>
              {round.discharge_pending_issues && (
                <>
                  <Separator />
                  <div>
                    <span className="font-medium">Pendências para alta:</span>
                    <p className="text-sm text-gray-600 mt-1">{round.discharge_pending_issues}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Ações do Round */}
          {(round.pharmacy_actions || round.medicine_actions || round.nursing_actions || round.physiotherapy_actions || round.nutrition_actions) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users size={18} />
                  Ações do Round
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {round.pharmacy_actions && (
                  <div>
                    <span className="font-medium text-blue-600">Ações Farmácia:</span>
                    <p className="text-sm text-gray-600 mt-1">{round.pharmacy_actions}</p>
                  </div>
                )}
                {round.medicine_actions && (
                  <div>
                    <span className="font-medium text-red-600">Ações Medicina:</span>
                    <p className="text-sm text-gray-600 mt-1">{round.medicine_actions}</p>
                  </div>
                )}
                {round.nursing_actions && (
                  <div>
                    <span className="font-medium text-green-600">Ações Enfermagem:</span>
                    <p className="text-sm text-gray-600 mt-1">{round.nursing_actions}</p>
                  </div>
                )}
                {round.physiotherapy_actions && (
                  <div>
                    <span className="font-medium text-purple-600">Ações Fisioterapia:</span>
                    <p className="text-sm text-gray-600 mt-1">{round.physiotherapy_actions}</p>
                  </div>
                )}
                {round.nutrition_actions && (
                  <div>
                    <span className="font-medium text-orange-600">Ações Nutrição:</span>
                    <p className="text-sm text-gray-600 mt-1">{round.nutrition_actions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Rodapé */}
          {(round.present_professionals || round.next_evaluation) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar size={18} />
                  Informações do Round
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {round.present_professionals && (
                  <div>
                    <span className="font-medium">Profissionais Presentes:</span>
                    <p className="text-sm text-gray-600 mt-1">{round.present_professionals}</p>
                  </div>
                )}
                {round.next_evaluation && (
                  <div>
                    <span className="font-medium">Próxima Avaliação:</span> {format(new Date(round.next_evaluation), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
