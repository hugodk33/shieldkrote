import { layout } from './layout'

export function formItem(data?: any): string {
  const isEdit = !!data?.id
  const i = data || {}
  return layout(isEdit ? 'Editar Item' : 'Novo Item', `
    <div class="max-w-2xl mx-auto p-6">
      <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-6">
        <h1 class="text-2xl font-bold text-amber-100 mb-6">${isEdit ? 'Editar Item' : 'Novo Item'}</h1>
        <form method="POST" action="${isEdit ? `/api/items/${i.id}` : '/api/items'}" class="space-y-5">
          ${isEdit ? `<input type="hidden" name="id" value="${i.id}"/>` : ''}
          <input type="hidden" name="table_id" value="${data?.table_id || ''}"/>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Nome</label>
              <input name="name" value="${i.name || ''}" required
                class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"/>
            </div>
            <div>
              <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Categoria</label>
              <input name="category" value="${i.category || ''}"
                class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"
                placeholder="ex: Arma, Armadura, Poção"/>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Tipo</label>
              <input name="type" type="number" value="${i.type ?? ''}"
                class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"/>
            </div>
            <div>
              <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Peso (kg)</label>
              <input name="weight" type="number" step="0.1" value="${i.weight ?? ''}"
                class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"/>
            </div>
            <div>
              <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Dimensões</label>
              <input name="dimensions" value="${i.dimensions || ''}"
                class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"
                placeholder="ex: 30x5cm"/>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Qualidade</label>
              <select name="quality"
                class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500">
                <option value="" ${!i.quality ? 'selected' : ''}>Comum</option>
                <option value="ruim" ${i.quality === 'ruim' ? 'selected' : ''}>Ruim</option>
                <option value="boa" ${i.quality === 'boa' ? 'selected' : ''}>Boa</option>
                <option value="excelente" ${i.quality === 'excelente' ? 'selected' : ''}>Excelente</option>
                <option value="master" ${i.quality === 'master' ? 'selected' : ''}>Master</option>
              </select>
            </div>
            <div>
              <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Condição</label>
              <select name="condition"
                class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500">
                <option value="" ${!i.condition ? 'selected' : ''}>Intacto</option>
                <option value="danificado" ${i.condition === 'danificado' ? 'selected' : ''}>Danificado</option>
                <option value="quebrado" ${i.condition === 'quebrado' ? 'selected' : ''}>Quebrado</option>
                <option value="gasto" ${i.condition === 'gasto' ? 'selected' : ''}>Gasto</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Descrição</label>
            <textarea name="description" rows="3"
              class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500">${i.description || ''}</textarea>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button type="submit"
              class="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
              ${isEdit ? 'Salvar Alterações' : 'Criar Item'}
            </button>
            <a href="/" class="text-zinc-400 hover:text-zinc-300 text-sm transition-colors">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `)
}
