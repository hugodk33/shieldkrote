import { layout } from './layout'

export function formGameTable(data?: any): string {
  const isEdit = !!data?.id
  const t = data || {}
  return layout(isEdit ? 'Editar Mesa' : 'Nova Mesa', `
    <div class="max-w-2xl mx-auto p-6">
      <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-6">
        <h1 class="text-2xl font-bold text-amber-100 mb-6">${isEdit ? 'Editar Mesa' : 'Nova Mesa'}</h1>
        <form method="POST" action="${isEdit ? `/api/tables/${t.id}` : '/api/tables'}" class="space-y-5">
          ${isEdit ? `<input type="hidden" name="id" value="${t.id}"/>` : ''}
          <div>
            <label class="block text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-1.5">Título</label>
            <input name="title" value="${t.title || ''}" required
              class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"/>
          </div>
          <div>
            <label class="block text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-1.5">Sistema</label>
            <input name="system" value="${t.system || ''}"
              class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"/>
          </div>
          <div>
            <label class="block text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-1.5">Introdução / Descrição</label>
            <textarea name="intro" rows="4"
              class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500">${t.intro || ''}</textarea>
          </div>
          <div class="flex items-center gap-3 pt-2">
            <button type="submit"
              class="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
              ${isEdit ? 'Salvar Alterações' : 'Criar Mesa'}
            </button>
            <a href="/" class="text-zinc-400 hover:text-zinc-300 text-sm transition-colors">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `)
}
