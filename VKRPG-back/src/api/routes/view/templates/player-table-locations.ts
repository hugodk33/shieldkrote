import { layout } from './layout'

export function playerTableLocations(data: any): string {
  const table = data.table
  const locations = data.locations ?? []
  const tableId = table?.id || ''
  const characterUrl = data.characterUrl

  return layout(`${table?.title || 'Locations'} — Locations`, `
    <div class="max-w-4xl mx-auto p-6">
      <div class="flex gap-1 border-b border-zinc-700/50 mb-6">
        <a href="/table/${tableId}" class="px-4 py-2.5 text-sm font-medium transition-colors text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent">Act</a>
        <a href="/player/game_table_scenes/${tableId}" class="px-4 py-2.5 text-sm font-medium transition-colors text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent">Timeline</a>
        <details class="relative">
          <summary class="px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent cursor-pointer list-none flex items-center gap-1">Table<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></summary>
          <div class="absolute top-full left-0 mt-1 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 z-50">
            <a href="/player/game_table_items/${tableId}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Items</a>
            <a href="/player/game_table_advantages/${tableId}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Advantages</a>
            <a href="/player/game_table_disadvantages/${tableId}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Disadvantages</a>
            <a href="/player/game_table_skills/${tableId}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Skills</a>
            <a href="/player/game_table_characters/${tableId}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Characters</a>
            <a href="/player/game_table_locations/${tableId}" class="block px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700/50 text-sm">Locations</a>
          </div>
        </details>
        ${characterUrl ? `<a href="${characterUrl}" class="px-4 py-2.5 text-sm font-medium transition-colors text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent">Character</a>` : ''}
      </div>
      <h1 class="text-2xl font-bold text-amber-100 mb-6">${table?.title || 'Table'} — Locations</h1>

      ${locations.length === 0 ? `
        <p class="text-zinc-500 italic">No locations registered for this table.</p>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${locations.map((l: any) => `
            <div class="bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-4 py-3">
              <div class="flex items-center gap-2 mb-1">
                <svg class="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span class="text-zinc-200 font-medium">${l.name || 'Unnamed'}</span>
              </div>
              ${l.region ? `<p class="text-xs text-zinc-500 ml-6">${l.region}${l.subRegion ? ', ' + l.subRegion : ''}</p>` : ''}
              ${l.address ? `<p class="text-xs text-zinc-500 ml-6">${l.address}</p>` : ''}
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `, table?.id)
}
