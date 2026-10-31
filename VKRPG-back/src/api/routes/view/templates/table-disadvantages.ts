import { layout } from './layout'

function disadvantageColors(category?: string): { bg: string, border: string, badge: string } {
  const map: Record<string, { bg: string, border: string, badge: string }> = {
    'Mental':     { bg: '#1e1b4b', border: '#4338ca', badge: 'bg-purple-600/80 text-purple-200' },
    'Physical':   { bg: '#450a0a', border: '#dc2626', badge: 'bg-red-600/80 text-red-200' },
    'Social':     { bg: '#172554', border: '#2563eb', badge: 'bg-blue-600/80 text-blue-200' },
    'Exotic':     { bg: '#083344', border: '#0891b2', badge: 'bg-cyan-600/80 text-cyan-200' },
    'Self-Control': { bg: '#2e1065', border: '#7c3aed', badge: 'bg-indigo-600/80 text-indigo-200' },
  }
  const fallback = { bg: '#27272a', border: '#52525b', badge: 'bg-zinc-600/80 text-zinc-200' }
  return map[category ?? ''] ?? fallback
}

export function tableDisadvantages(data: any): string {
  const table = data.table
  const disadvantages = data.disadvantages ?? []
  const tableId = table?.id || ''

  return layout(`${table?.title || 'Disadvantages'} — Disadvantages`, `
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
      <h1 class="text-2xl font-bold text-amber-100 mb-6">${table?.title || 'Table'} — Disadvantages</h1>

      ${disadvantages.length === 0 ? `
        <p class="text-zinc-500 italic">No disadvantages registered for this table.</p>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${disadvantages.map((d: any) => {
            const colors = disadvantageColors(d.category)
            return `
            <div class="rounded-lg px-4 py-3" style="background: ${colors.bg}; border: 1px solid ${colors.border};">
              <div class="flex justify-between items-start mb-1">
                <span class="text-zinc-100 font-medium">${d.name || 'Unnamed'}</span>
                <span class="text-red-400 text-xs font-semibold">${d.cost_points ?? ''}</span>
              </div>
              ${d.category ? `<span class="inline-block ${colors.badge} text-xs px-2 py-0.5 rounded-full mt-1">${d.category}${d.subcategory ? ` / ${d.subcategory}` : ''}</span>` : ''}
              ${d.effect ? `<p class="text-zinc-400 text-xs mt-2">${d.effect}</p>` : ''}
              ${d.description ? `<p class="text-zinc-500 text-xs mt-1">${d.description}</p>` : ''}
              <div class="mt-3">
                <a href="/form/disadvantage/${d.id}" class="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2">Edit</a>
              </div>
            </div>
          `}).join('')}
        </div>
      `}
    </div>
  `, table?.id)
}
