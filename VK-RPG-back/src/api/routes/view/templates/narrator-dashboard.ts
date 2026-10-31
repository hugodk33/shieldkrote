import { layout } from './layout'

export function narratorDashboard(data: any): string {
  const narrator = data?.narrator || {}
  const tables = data?.tables || []

  return layout(`${narrator.name || 'Narrator'} — Dashboard`, `
    <div class="max-w-5xl mx-auto p-6">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-amber-100">Narrator Dashboard</h1>
          <p class="text-zinc-400 text-sm mt-1">${narrator.name || 'Narrator'} — ${tables.length} table${tables.length !== 1 ? 's' : ''}</p>
        </div>
        <a href="/form/game-table/new" class="bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + New Table
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        ${tables.map((t: any) => {
          const npcs = t.npcs || []
          return `
            <div class="bg-zinc-800/60 border border-zinc-700/50 rounded-xl overflow-hidden hover:border-amber-700/50 transition-colors">
              <div class="px-5 py-4 border-b border-zinc-700/40">
                <h2 class="text-lg font-bold text-zinc-100">${t.title || 'Untitled'}</h2>
                ${t.system ? `<span class="text-xs text-zinc-500 uppercase tracking-wider">${t.system}</span>` : ''}
                ${t.intro ? `<p class="text-zinc-400 text-sm mt-1.5 line-clamp-2">${t.intro}</p>` : ''}
              </div>
              <div class="px-5 py-4">
                ${npcs.length > 0 ? `
                  <div class="text-xs text-zinc-500 mb-3">
                    <span class="text-zinc-400">NPCs:</span>
                    ${npcs.slice(0, 4).map((n: any) => `<span class="ml-1">${n.name || n.character_name || '?'}</span>`).join(', ')}
                    ${npcs.length > 4 ? `<span class="ml-1 text-zinc-600">+${npcs.length - 4}</span>` : ''}
                  </div>
                ` : ''}
                <div class="flex flex-col gap-2">
                  <div class="flex gap-2">
                    <a href="/session/${t.id}"
                      class="flex-1 text-center bg-amber-700/60 hover:bg-amber-600 text-amber-100 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                      Session
                    </a>
                  </div>
                  <div class="flex gap-2">
                    <a href="/view/game_table_scenes/${t.id}"
                      class="flex-1 text-center bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                      Scenes
                    </a>
                    <a href="/view/game_table_characters/${t.id}"
                      class="flex-1 text-center bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                      Characters
                    </a>
                    <a href="/form/game-table/${t.id}"
                      class="flex-1 text-center bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                      Edit
                    </a>
                  </div>
                  <div class="flex gap-2">
                    <a href="/view/game_table_items/${t.id}"
                      class="flex-1 text-center bg-zinc-700/50 hover:bg-zinc-600 text-zinc-300 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                      Items
                    </a>
                    <a href="/view/game_table_advantages/${t.id}"
                      class="flex-1 text-center bg-zinc-700/50 hover:bg-zinc-600 text-zinc-300 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                      Advantages
                    </a>
                    <a href="/view/game_table_disadvantages/${t.id}"
                      class="flex-1 text-center bg-zinc-700/50 hover:bg-zinc-600 text-zinc-300 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                      Disadvantages
                    </a>
                  </div>
                </div>
              </div>
            </div>
          `
        }).join('')}
        ${tables.length === 0 ? `
          <div class="col-span-full text-center py-16">
            <p class="text-zinc-500 text-lg mb-2">No tables yet</p>
            <p class="text-zinc-600 text-sm">Create your first table to start the campaign</p>
          </div>
        ` : ''}
      </div>

      <div class="mt-8 text-center">
        <a href="/" class="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">&larr; Back to home</a>
      </div>
    </div>
  `)
}
