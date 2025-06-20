
-- Primeiro, vamos limpar a tabela de materiais para evitar conflitos
TRUNCATE TABLE public.materials;

-- Agora inserir todos os materiais médicos na tabela materials
INSERT INTO public.materials (mv_code, name, observation) VALUES

-- Materiais diversos
('90160', 'ÁCIDO PERACÉTICO 5% - 5L', 'Unidade: CAIXA'),
('37781', 'ADAPTADOR DE ASPIRAÇÃO MECONIAL', 'Unidade: UNIDADE'),
('90154', 'ADAPTADOR E COLETOR EM BICO P/ FLUXÔMETRO DE OXIGÊNIO VERDE', 'Unidade: UNIDADE'),
('5062', 'AGULHA ATRAUMÁTICA P/ RAQUI ANESTESIA 26G X 3 1/2', 'Unidade: UNIDADE'),
('5060', 'AGULHA ATRAUMÁTICA P/ RAQUI ANESTESIA 27G X 3 1/2', 'Unidade: UNIDADE'),
('32734', 'AGULHA P/ ANESTESIA 30G CURTA CAIXA C/ 100 UN', 'Unidade: UNIDADE'),
('3395', 'ATADURA ELÁSTICA', 'Unidade: UNIDADE'),
('86997', 'AVENTAL CIRÚRGICO DESC ESTÉRIL SM/S NM S2G IMPERM TAM ÚNICO', 'Unidade: CAIXA'),
('75730', 'AVENTAL/CAMISOLA DESC. TNT GR 30 1,40X1,00 M PCT C/ 10', 'Unidade: PACOTE'),
('MAT001', 'BALÃO DILATAÇÃO 10 G 24.5 UM', 'Unidade: UNIDADE'),
('MAT002', 'BALÃO DILATAÇÃO 13.5/15/18 MM', 'Unidade: UNIDADE'),
('MAT003', 'BALÃO EXTRATOR DE CÁLCULO BILIAR 13MM', 'Unidade: UNIDADE'),
('MAT004', 'BANDAGEM ELÁSTICA ADESIVA TENSOPLAST 5CM - 7.5 X 4.5 CM', 'Unidade: UNIDADE'),
('32105', 'BOBINA TERMOSSENSÍVEL 5TMM X 30M', 'Unidade: UNIDADE'),
('87277', 'BOLSA COLOSTOMIA DRENÁVEL TRANSPARENTE 10-70MM C/ FILTRO', 'Unidade: UNIDADE'),
('37461', 'BOLSA DE COLOSTOMIA 50MM', 'Unidade: UNIDADE'),
('65312', 'BOLSA PRESSURIZADA C/ C/ FLUOR E MANÔMETRO 1000ML', 'Unidade: UNIDADE'),
('MAT005', 'BOTA DE UNHA 10.2CM X 5.1 MM CURVADO', 'Unidade: UNIDADE'),
('50431', 'CAIXA P/ DESCARTE DE MATERIAL PERFUROCORTANTE 03 LITROS', 'Unidade: UNIDADE'),
('445', 'CAIXA P/ DESCARTE DE MATERIAL PERFUROCORTANTE 07 LITROS', 'Unidade: UNIDADE'),
('10070', 'CAIXA P/ DESCARTE DE MATERIAL PERFUROCORTANTE 13 LITROS', 'Unidade: UNIDADE'),
('5624', 'CAL SODADA GRANULADA 4.5KG', 'Unidade: GALÃO'),
('58333', 'CAMPO CIRÚRGICO FENESTRADO AZUL ROYAL 50 X 50 CM', 'Unidade: UNIDADE'),
('58331', 'CAMPO CIRÚRGICO FENESTRADO 30M AZUL 080 75 X 75 CM', 'Unidade: UNIDADE'),
('60858', 'CANETA DESCARTÁVEL ESTÉRIL P/ BISTURI ELETRÔNICO', 'Unidade: UNIDADE'),
('81229', 'CANETA PARA MARCAÇÃO DE PELE P/ O VERDE TEPLA', 'Unidade: UNIDADE'),
('3898', 'CÂNULA DE GUEDEL N° 1', 'Unidade: UNIDADE'),
('3899', 'CÂNULA DE GUEDEL N° 2', 'Unidade: UNIDADE'),
('3900', 'CÂNULA DE GUEDEL N° 3', 'Unidade: UNIDADE'),
('3901', 'CÂNULA DE GUEDEL N° 4', 'Unidade: UNIDADE'),
('3902', 'CÂNULA DE GUEDEL N° 5', 'Unidade: UNIDADE'),
('87521', 'CÂNULA DE TRAQUEOSTOMIA PVC C/ BALÃO N° 3.5', 'Unidade: UNIDADE'),
('6303', 'CÂNULA DE TRAQUEOSTOMIA PVC DESC ESTÉRIL C/ BALÃO N° 5.0', 'Unidade: UNIDADE'),
('16519', 'CÂNULA DE TRAQUEOSTOMIA PVC DESC ESTÉRIL C/ BALÃO N° 6.5', 'Unidade: UNIDADE'),
('5506', 'CÂNULA DE TRAQUEOSTOMIA PVC DESC ESTÉRIL C/ BALÃO N° 7.5', 'Unidade: UNIDADE'),
('5507', 'CÂNULA DE TRAQUEOSTOMIA PVC DESC ESTÉRIL C/ BALÃO N° 8.0', 'Unidade: UNIDADE'),
('16959', 'CÂNULA DE TRAQUEOSTOMIA PVC DESC ESTÉRIL C/ BALÃO N° 8.5', 'Unidade: UNIDADE'),
('25423', 'CÂNULA DE TRAQUEOSTOMIA PVC DESC. C/ BALÃO N° 5.5', 'Unidade: UNIDADE'),
('16958', 'CÂNULA DE TRAQUEOSTOMIA PVC DESC. C/ ESTÉRIL C/ BALÃO N° 9', 'Unidade: UNIDADE'),
('58821', 'CÂNULA DE TRAQUEOSTOMIA PVC LONGA C/ BALÃO N° 10', 'Unidade: UNIDADE'),
('42856', 'CÂNULA ENDOTRAQUEAL DESC. N° 6.5 C/ BALÃO', 'Unidade: UNIDADE'),
('15334', 'CÂNULA ENDOTRAQUEAL DESC. C/ BALÃO N° 3.0', 'Unidade: UNIDADE');
