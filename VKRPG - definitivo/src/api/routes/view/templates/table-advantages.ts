import { layout } from './layout'

export function tableAdvantages(data: any): string {
  const table = data.table
  const advantages = data.advantages ?? []
  const tableId = table?.id || ''

  return layout(`${table?.title || 'Advantages'} — Advantages`, `
    <div class="max-w-4xl mx-auto p-6">
      <div class="flex gap-1 border-b border-zinc-700/50 mb-6">
        <a href="/session/${tableId}" class="px-4 py-2.5 text-sm font-medium transition-colors text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent">Act</a>
        <a href="/view/game_table_scenes/${tableId}" class="px-4 py-2.5 text-sm font-medium transition-colors text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent">Timeline</a>
        <a href="/form/character/new?table_id=${tableId}" class="px-4 py-2.5 text-sm font-medium transition-colors text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent">New Character</a>
        <details class="relative">
          <summary class="px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent cursor-pointer list-none flex items-center gap-1">Table<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></summary>
          <div class="absolute top-full left-0 mt-1 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 z-50">
            <a href="/view/game_table_items/${tableId}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Items</a>
            <a href="/view/game_table_advantages/${tableId}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Advantages</a>
            <a href="/view/game_table_disadvantages/${tableId}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Disadvantages</a>
            <a href="/view/game_table_skills/${tableId}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Skills</a>
            <a href="/view/game_table_characters/${tableId}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Characters</a>
            <a href="/view/game_table_locations/${tableId}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Locations</a>
          </div>
        </details>
      </div>
      <h1 class="text-2xl font-bold text-amber-100 mb-6">${table?.title || 'Table'} — Advantages</h1>

      ${advantages.length === 0 ? `
        <p class="text-zinc-500 italic">No advantages registered for this table.</p>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${advantages.map((a: any) => `
            <div class="bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-4 py-3">
              <div class="flex justify-between items-start mb-1">
                <span class="text-zinc-200 font-medium">${a.name || 'Unnamed'}</span>
                <span class="text-emerald-400 text-xs font-semibold">${a.cost_points ?? ''}</span>
              </div>
              ${a.category ? `<span class="text-xs text-zinc-500">${a.category}${a.subcategory ? ` / ${a.subcategory}` : ''}</span>` : ''}
              ${a.description ? `<p class="text-zinc-500 text-xs mt-1">${a.description}</p>` : ''}
              <div class="mt-2">
                <a href="/form/advantage/${a.id}" class="text-xs text-amber-400 hover:text-amber-300">Edit</a>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `, table?.id)
}
