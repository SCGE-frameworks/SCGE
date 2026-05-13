import PageWrapper from '../../components/PageWrapper';

import { ArrowDownCircle, ArrowUpCircle, AlertTriangle } from 'lucide-react';

const TIPO_CONFIG = {
  IN:         { label: 'ENTRADA', cor: 'bg-green-100 text-green-700 border border-green-200', icone: <ArrowDownCircle size={13} /> },
  OUT:        { label: 'SAÍDA',   cor: 'bg-blue-100 text-blue-700 border border-blue-200',   icone: <ArrowUpCircle size={13} /> },
  ADJUSTMENT: { label: 'AJUSTE',  cor: 'bg-amber-100 text-amber-700 border border-amber-200', icone: <AlertTriangle size={13} /> },
};

const MOTIVOS = ['Reposição Fornecedor', 'Venda Direta', 'Ajuste de Inventário', 'Avaria no Transporte', 'Projeto Interno', 'Outro'];

const ESTOQUE_DISPONIVEL = 142;

const hoje = () => new Date().toISOString().slice(0, 10);

const formatarData = (iso) => {
  const d = new Date(iso);
  return {
    dia:  d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''),
    hora: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  };
};

function Movimentacoes() {
  return (
    <PageWrapper title="Movimentações" description="Gerencie entrada e saída de produtos">
    </PageWrapper>
  );
}

export default Movimentacoes;