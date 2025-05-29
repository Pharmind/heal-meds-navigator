
import { Medication, Material, Diet } from '../types/heal';

export const medications: Medication[] = [
  {
    id: '1',
    mvCode: 'MED001',
    name: 'Dipirona Sódica',
    presentation: 'Solução injetável 500mg/ml - Ampola 2ml',
    therapeuticClass: 'Analgésico e Antipirético',
    indication: 'Dor e febre',
    dose: {
      adult: '500-1000mg a cada 6-8h (máximo 4g/dia)',
      pediatric: '10-15mg/kg a cada 6-8h',
      maximum: '4g/dia para adultos'
    },
    doseAdjustment: 'Reduzir dose em insuficiência renal e hepática',
    photosensitive: false,
    administrationRoute: 'EV, IM',
    preparation: {
      reconstitution: 'Não se aplica',
      dilution: 'Diluir em SF 0,9% ou SG 5% - mínimo 100ml',
      healStandard: 'Administrar em 15-30 minutos'
    },
    stability: 'Armazenar em temperatura ambiente. Após diluição: 24h',
    observation: 'Monitorar sinais de hipotensão durante administração EV',
    lastUpdate: '15/12/2024'
  },
  {
    id: '2',
    mvCode: 'MED002',
    name: 'Omeprazol',
    presentation: 'Pó liofilizado 40mg - Frasco-ampola',
    therapeuticClass: 'Inibidor da Bomba de Prótons',
    indication: 'Úlcera péptica, DRGE, síndrome de Zollinger-Ellison',
    dose: {
      adult: '20-40mg uma vez ao dia',
      pediatric: '0,7-3,3mg/kg/dia',
      maximum: '80mg/dia'
    },
    doseAdjustment: 'Não necessário ajuste renal. Reduzir em hepatopatia grave',
    photosensitive: false,
    administrationRoute: 'EV',
    preparation: {
      reconstitution: 'Reconstituir com 10ml de água para injeção',
      dilution: 'Diluir em SF 0,9% ou SG 5% - 100ml',
      healStandard: 'Infundir em 20-30 minutos'
    },
    stability: 'Após reconstituição: 4h. Após diluição: 12h',
    observation: 'Proteger da luz após reconstituição',
    lastUpdate: '10/12/2024'
  },
  {
    id: '3',
    mvCode: 'MED003',
    name: 'Ceftriaxona',
    presentation: 'Pó para solução injetável 1g - Frasco-ampola',
    therapeuticClass: 'Antibiótico Cefalosporina 3ª geração',
    indication: 'Infecções bacterianas graves',
    dose: {
      adult: '1-2g a cada 12-24h',
      pediatric: '50-100mg/kg/dia dividido em 1-2 doses',
      maximum: '4g/dia'
    },
    doseAdjustment: 'Reduzir dose se ClCr < 10ml/min',
    photosensitive: false,
    administrationRoute: 'EV, IM',
    preparation: {
      reconstitution: 'Reconstituir com 10ml de água para injeção',
      dilution: 'Diluir em SF 0,9% ou SG 5% - 50-100ml',
      healStandard: 'Infundir em 30 minutos'
    },
    stability: 'Após reconstituição: 24h geladeira. Após diluição: 24h',
    observation: 'Não misturar com soluções contendo cálcio',
    lastUpdate: '12/12/2024'
  }
];

export const materials: Material[] = [
  {
    id: '1',
    mvCode: 'MAT001',
    name: 'Cateter Venoso Central Duplo Lúmen',
    observation: 'Para acesso venoso central de longa duração'
  },
  {
    id: '2',
    mvCode: 'MAT002',
    name: 'Sonda Nasogástrica 14FR',
    observation: 'Para drenagem e administração de dieta'
  },
  {
    id: '3',
    mvCode: 'MAT003',
    name: 'Equipo Macrogotas',
    observation: 'Para infusão de soluções endovenosas'
  }
];

export const diets: Diet[] = [
  {
    id: '1',
    mvCode: 'DIET001',
    name: 'Dieta Geral',
    observation: 'Dieta livre sem restrições'
  },
  {
    id: '2',
    mvCode: 'DIET002',
    name: 'Dieta Hipossódica',
    observation: 'Dieta com restrição de sódio (2g/dia)'
  },
  {
    id: '3',
    mvCode: 'DIET003',
    name: 'Dieta Diabética',
    observation: 'Dieta para controle glicêmico'
  }
];
