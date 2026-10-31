import { layout } from './layout'

export function formAdvantage(data?: any): string {
  const isEdit = !!data?.id
  const a = data || {}
  return layout(isEdit ? 'Editar Vantagem' : 'Nova Vantagem', `
    <div class="max-w-2xl mx-auto p-6">
      <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-6">
        <h1 class="text-2xl font-bold text-amber-100 mb-6">${isEdit ? 'Editar Vantagem' : 'Nova Vantagem'}</h1>
        <form method="POST" action="${isEdit ? `/api/advantages/${a.id}` : '/api/advantages'}" class="space-y-5">
          ${isEdit ? `<input type="hidden" name="id" value="${a.id}"/>` : ''}
          <input type="hidden" name="table_id" value="${data?.table_id || ''}"/>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Nome</label>
              <input name="name" value="${a.name || ''}" required
                class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"/>
            </div>
            <div>
              <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Custo (pontos)</label>
              <input name="cost_points" type="number" value="${a.cost_points ?? ''}"
                class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"/>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Categoria</label>
              <input name="category" value="${a.category || ''}"
                class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"
                placeholder="ex: Física, Mental, Social"/>
            </div>
            <div>
              <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Subcategoria</label>
              <input name="subcategory" value="${a.subcategory || ''}"
                class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"
                placeholder="ex: Combate, Magia"/>
            </div>
          </div>

          <div>
            <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Descrição</label>
            <textarea name="description" rows="4"
              class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500">${a.description || ''}</textarea>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button type="submit"
              class="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
              ${isEdit ? 'Salvar Alterações' : 'Criar Vantagem'}
            </button>
            <a href="/" class="text-zinc-400 hover:text-zinc-300 text-sm transition-colors">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `)
}
