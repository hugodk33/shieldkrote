import { layout } from './layout'

export function formNpc(data?: any): string {
  const isEdit = !!data?.npc?.id
  const npc = data?.npc || {}
  const ch = data?.character || {}
  const s = ch.sheet || {}
  return layout(isEdit ? 'Editar NPC' : 'Novo NPC', `
    <div class="max-w-3xl mx-auto p-6">
      <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-6">
        <h1 class="text-2xl font-bold text-amber-100 mb-6">${isEdit ? 'Editar NPC' : 'Novo NPC'}</h1>
        <form method="POST" action="${isEdit ? `/api/npcs/${npc.id}` : '/api/npcs'}" class="space-y-6">
          ${isEdit ? `<input type="hidden" name="id" value="${npc.id}"/>` : ''}
          <input type="hidden" name="table_id" value="${data?.table_id || ''}"/>
          ${isEdit ? `<input type="hidden" name="character_id" value="${ch.id}"/>` : ''}

          <div class="border-b border-zinc-700/40 pb-4">
            <h2 class="text-lg font-semibold text-zinc-300 mb-4">Identidade</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Nome</label>
                <input name="name" value="${s.name || ch.name || ''}" required
                  class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"/>
              </div>
              <div>
                <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Pontos</label>
                <input name="points" type="number" value="${s.points ?? ''}"
                  class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"/>
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Status</label>
              <select name="status"
                class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500">
                <option value="ally" ${npc.status === 'ally' ? 'selected' : ''}>Aliado</option>
                <option value="neutral" ${npc.status === 'neutral' || !npc.status ? 'selected' : ''}>Neutro</option>
                <option value="enemy" ${npc.status === 'enemy' ? 'selected' : ''}>Inimigo</option>
                <option value="boss" ${npc.status === 'boss' ? 'selected' : ''}>Chefe</option>
              </select>
            </div>
          </div>

          <div>
            <h2 class="text-lg font-semibold text-zinc-300 mb-4">Atributos</h2>
            <div class="grid grid-cols-4 gap-3">
              <div>
                <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5 text-center">ST</label>
                <input name="st" type="number" value="${s.st ?? 10}"
                  class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-3 py-2 text-center text-zinc-100 focus:outline-none focus:border-amber-500"/>
              </div>
              <div>
                <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5 text-center">DX</label>
                <input name="dx" type="number" value="${s.dx ?? 10}"
                  class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-3 py-2 text-center text-zinc-100 focus:outline-none focus:border-amber-500"/>
              </div>
              <div>
                <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5 text-center">IQ</label>
                <input name="iq" type="number" value="${s.iq ?? 10}"
                  class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-3 py-2 text-center text-zinc-100 focus:outline-none focus:border-amber-500"/>
              </div>
              <div>
                <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5 text-center">HT</label>
                <input name="ht" type="number" value="${s.ht ?? 10}"
                  class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-3 py-2 text-center text-zinc-100 focus:outline-none focus:border-amber-500"/>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">HP</label>
              <input name="hp" type="number" value="${s.hp ?? 10}"
                class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"/>
            </div>
            <div>
              <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">FP</label>
              <input name="fatigue" type="number" value="${s.fatigue ?? 10}"
                class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"/>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button type="submit"
              class="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
              ${isEdit ? 'Salvar Alterações' : 'Criar NPC'}
            </button>
            <a href="/" class="text-zinc-400 hover:text-zinc-300 text-sm transition-colors">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `)
}
