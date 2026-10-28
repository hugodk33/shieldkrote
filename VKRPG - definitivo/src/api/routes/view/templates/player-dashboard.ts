import { layout } from './layout'

export function playerDashboard(data: any): string {
  const player = data?.player || {}
  const characters = data?.characters || []
  const tables = data?.tables || []

  const totalItems = characters.reduce((sum: number, c: any) => sum + (c.items?.length || 0), 0)

  return layout(`Painel — ${player.username || 'Jogador'}`, `
    <div class="max-w-5xl mx-auto p-6">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-amber-100">Painel do Jogador</h1>
          <p class="text-zinc-400 text-sm mt-1">${player.username || 'Jogador'} — ${characters.length} personagen${characters.length !== 1 ? 'ns' : 'm'}</p>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-5 mb-8">
        <div class="bg-zinc-800/50 border border-zinc-700/40 rounded-xl px-5 py-4 text-center">
          <p class="text-2xl font-bold text-amber-400">${tables.length}</p>
          <p class="text-zinc-500 text-xs uppercase tracking-wider mt-1">Mesas</p>
        </div>
        <div class="bg-zinc-800/50 border border-zinc-700/40 rounded-xl px-5 py-4 text-center">
          <p class="text-2xl font-bold text-emerald-400">${characters.length}</p>
          <p class="text-zinc-500 text-xs uppercase tracking-wider mt-1">Personagens</p>
        </div>
        <div class="bg-zinc-800/50 border border-zinc-700/40 rounded-xl px-5 py-4 text-center">
          <p class="text-2xl font-bold text-blue-400">${totalItems}</p>
          <p class="text-zinc-500 text-xs uppercase tracking-wider mt-1">Itens</p>
        </div>
      </div>

      <h2 class="text-lg font-bold text-zinc-200 mb-4">Meus Personagens</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${characters.map((ch: any) => {
          const s = ch.sheet || {}
          const table = tables.find((t: any) => t.id === ch.table_id)
          return `
            <div class="bg-zinc-800/60 border border-zinc-700/50 rounded-xl overflow-hidden hover:border-emerald-700/50 transition-colors">
              <div class="px-5 py-4 border-b border-zinc-700/40">
                <h3 class="text-lg font-bold text-zinc-100">${s.name || ch.name || 'Sem nome'}</h3>
                ${table ? `<p class="text-xs text-zinc-500 mt-0.5">${table.title}</p>` : ''}
              </div>
              <div class="px-5 py-4">
                <div class="grid grid-cols-4 gap-2 mb-4">
                  <div class="text-center">
                    <span class="block text-red-400 font-bold">${s.st ?? '-'}</span>
                    <span class="text-zinc-600 text-xs uppercase">ST</span>
                  </div>
                  <div class="text-center">
                    <span class="block text-emerald-400 font-bold">${s.dx ?? '-'}</span>
                    <span class="text-zinc-600 text-xs uppercase">DX</span>
                  </div>
                  <div class="text-center">
                    <span class="block text-blue-400 font-bold">${s.iq ?? '-'}</span>
                    <span class="text-zinc-600 text-xs uppercase">IQ</span>
                  </div>
                  <div class="text-center">
                    <span class="block text-purple-400 font-bold">${s.ht ?? '-'}</span>
                    <span class="text-zinc-600 text-xs uppercase">HT</span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <a href="/game-table-character-viewer/${ch.id}"
                    class="flex-1 text-center bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm font-medium px-3 py-2 rounded-lg transition-colors">
                    Sheet
                  </a>
                  ${table ? `
                    <a href="/session/${table.id}/player"
                      class="flex-1 text-center bg-emerald-700/60 hover:bg-emerald-600 text-emerald-100 text-sm font-medium px-3 py-2 rounded-lg transition-colors">
                      Session
                    </a>
                    <a href="/view/game_table_scenes/${table.id}"
                      class="flex-1 text-center bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm font-medium px-3 py-2 rounded-lg transition-colors">
                      Scenes
                    </a>
                  ` : ''}
                </div>
              </div>
            </div>
          `
        }).join('')}
        ${characters.length === 0 ? `
          <div class="col-span-full text-center py-16">
            <p class="text-zinc-500 text-lg mb-2">Nenhum personagem ainda</p>
            <p class="text-zinc-600 text-sm">Junte-se a uma mesa para criar seu primeiro personagem</p>
          </div>
        ` : ''}
      </div>

      <div class="mt-8 text-center">
        <a href="/" class="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">&larr; Voltar ao início</a>
      </div>
    </div>
  `)
}
