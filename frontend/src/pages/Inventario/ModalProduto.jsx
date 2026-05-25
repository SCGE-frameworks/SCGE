import { useState } from 'react';
import { X } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { criarItem, listarCategorias } from '../../services';

const produtoInicial = {
  sku: '',
  name: '',
  category_id: '',
  quantity: '',
  min_quantity: '',
  unit: 'un',
  location: '',
};

function ModalProduto({ isOpen, onClose, categorias }) {
  const [produto, setProduto] = useState(produtoInicial);

  if (!isOpen) return null;

  const listaCategorias = categorias?.length ? categorias : listarCategorias();

  function alterarCampo(event) {
    setProduto({ ...produto, [event.target.name]: event.target.value });
  }

  function fecharModal() {
    setProduto(produtoInicial);
    onClose();
  }

  function salvarProduto(event) {
    event.preventDefault();

    criarItem({
      sku: produto.sku,
      name: produto.name,
      category_id: Number(produto.category_id),
      quantity: Number(produto.quantity),
      min_quantity: Number(produto.min_quantity),
      unit: produto.unit,
      location: produto.location,
      price: 0,
      is_stagnant: false,
    });

    alert('Produto cadastrado com sucesso!');
    fecharModal();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={salvarProduto} className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Novo Produto</h2>
            <p className="mt-1 text-xs font-medium uppercase text-slate-500">Cadastro de produto</p>
          </div>
          <button type="button" onClick={fecharModal} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Código SKU" name="sku" value={produto.sku} onChange={alterarCampo} placeholder="Ex: PRD-0000" required />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Categoria</label>
              <select name="category_id" value={produto.category_id} onChange={alterarCampo} required className="h-11 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-600">
                <option value="">Selecione...</option>
                {listaCategorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>{categoria.name ?? categoria.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <Input label="Nome do Produto" name="name" value={produto.name} onChange={alterarCampo} placeholder="Ex: RedBull" required />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Quantidade em Estoque" name="quantity" type="number" min="0" value={produto.quantity} onChange={alterarCampo} placeholder="0" required />
            <Input label="Estoque Mínimo" name="min_quantity" type="number" min="0" value={produto.min_quantity} onChange={alterarCampo} placeholder="0" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Unidade de Medida</label>
              <select name="unit" value={produto.unit} onChange={alterarCampo} className="h-11 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-600">
                <option value="un">Unidade (un)</option>
                <option value="cx">Caixa (cx)</option>
                <option value="kg">Quilograma (kg)</option>
                <option value="m">Metro (m)</option>
              </select>
            </div>
            <Input label="Localização no Armazém" name="location" value={produto.location} onChange={alterarCampo} placeholder="Ex: Corredor A" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button type="button" onClick={fecharModal} className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Cancelar
          </button>
          <Button type="submit" variant="primary">
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ModalProduto;
