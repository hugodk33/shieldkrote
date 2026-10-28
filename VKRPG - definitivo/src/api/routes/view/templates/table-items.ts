import { layout } from './layout'

export function tableItems(data: any): string {
  const table = data.table
  const items = data.items ?? []
  const tableId = table?.id || ''

  return layout(`${table?.title || 'Items'} — Items`, `
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
      <h1 class="text-2xl font-bold text-amber-100 mb-6">${table?.title || 'Table'} — Items</h1>

      ${items.length === 0 ? `
        <p class="text-zinc-500 italic">No items registered for this table.</p>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${items.map((i: any) => `
            <div class="bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-4 py-3">
              <div class="flex justify-between items-start mb-1">
                <span class="text-zinc-200 font-medium">${i.name || 'Unnamed'}</span>
                ${i.weight ? `<span class="text-zinc-500 text-xs">${i.weight} kg</span>` : ''}
              </div>
              ${i.category || i.quality || i.condition ? `
                <div class="flex flex-wrap gap-x-3 text-xs text-zinc-500 mb-1">
                  ${i.category ? `<span>${i.category}</span>` : ''}
                  ${i.quality ? `<span>${i.quality}</span>` : ''}
                  ${i.condition ? `<span>${i.condition}</span>` : ''}
                </div>
              ` : ''}
              ${i.description ? `<p class="text-zinc-500 text-xs">${i.description}</p>` : ''}
              <div class="mt-2 flex gap-2">
                <a href="/form/item/${i.id}" class="text-xs text-amber-400 hover:text-amber-300">Edit</a>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `, table?.id)
}
