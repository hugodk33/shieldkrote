import { layout } from './layout'

function radarChart(st: number, dx: number, iq: number, ht: number, size = 64): string {
  const cx = size / 2, cy = size / 2, r = size * 0.4
  const angles = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]
  const max = 20
  const pts = [st, dx, iq, ht].map((v, i) => {
    const pct = Math.min(1, (v ?? 10) / max)
    const a = (angles[i] ?? 0) - Math.PI / 2
    return `${cx + r * pct * Math.cos(a)},${cy + r * pct * Math.sin(a)}`
  }).join(' ')
  const grid = [0.25, 0.5, 0.75, 1].map(pct =>
    angles.map(a => {
      const angle = a - Math.PI / 2
      return `${cx + r * pct * Math.cos(angle)},${cy + r * pct * Math.sin(angle)}`
    }).join(' ')
  )
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="shrink-0">
      ${grid.map(g => `<polygon points="${g}" fill="none" stroke="#3f3f46" stroke-width="0.5"/>`).join('')}
      <polygon points="${pts}" fill="rgba(251,191,36,0.15)" stroke="#f59e0b" stroke-width="1.2"/>
      ${angles.map((a, i) => {
        const v = [st, dx, iq, ht][i] ?? 10
        const pct = Math.min(1, v / max)
        const angle = a - Math.PI / 2
        const px = cx + r * pct * Math.cos(angle)
        const py = cy + r * pct * Math.sin(angle)
        const lx = cx + r * Math.cos(angle)
        const ly = cy + r * Math.sin(angle)
        return `<line x1="${cx}" y1="${cy}" x2="${lx}" y2="${ly}" stroke="#3f3f46" stroke-width="0.5"/>
          <circle cx="${px}" cy="${py}" r="2" fill="#f59e0b"/>`
      }).join('')}
    </svg>
  `
}

export function gameTableCharacters(data: any): string {
  const table = data.table
  const characters = data.characters ?? []
  const tableId = table?.id || ''

  return layout(`${table?.title || 'Characters'} — Characters`, `
    <div class="max-w-5xl mx-auto p-4 md:p-6">
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
      <h1 class="text-2xl font-bold mb-1">${table?.title || 'Characters'}</h1>
      ${table?.intro ? `<p class="text-zinc-400 text-sm mb-6">${table.intro}</p>` : ''}

      ${characters.length === 0 ? `
        <div class="bg-zinc-800 rounded p-6 text-center text-zinc-400">No characters in this table.</div>
      ` : `
        <div class="flex flex-col gap-2">
          ${characters.map((ch: any) => {
            const s = ch.sheet
            return `
              <a href="/game-table-character-viewer/${ch.id}"
                 class="bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/40 hover:border-zinc-600/60 rounded-xl px-5 py-4 transition-colors no-underline">
                <div class="flex items-center gap-4">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-baseline gap-2">
                      <span class="text-zinc-100 font-semibold text-lg">${s?.name || ch.name || 'Unnamed'}</span>
                      <span class="text-zinc-500 text-xs">${ch.user?.username ?? ''}</span>
                    </div>
                    ${s ? radarChart(s.st ?? 10, s.dx ?? 10, s.iq ?? 10, s.ht ?? 10) : ''}
                    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm">
                      ${s ? `
                        <span class="text-red-400">ST ${s.st ?? '-'}</span>
                        <span class="text-emerald-400">DX ${s.dx ?? '-'}</span>
                        <span class="text-blue-400">IQ ${s.iq ?? '-'}</span>
                        <span class="text-purple-400">HT ${s.ht ?? '-'}</span>
                        <span class="text-zinc-500">&middot;</span>
                        <span class="text-red-400/80">HP ${s.hp ?? '-'}</span>
                        <span class="text-emerald-400/80">FP ${s.fatigue ?? '-'}</span>
                      ` : '<span class="text-zinc-600 text-xs italic">No sheet</span>'}
                    </div>
                  </div>
                </div>
              </a>
            `
          }).join('')}
        </div>
      `}
    </div>
  `, table?.id)
}
