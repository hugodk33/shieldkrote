import { layout } from './layout'

function locationCard(loc: any): string {
  if (!loc) return ''
  return `
    <p class="text-sm text-zinc-500 mt-2">
      <span class="text-blue-400">${loc.name}</span>
      ${loc.region ? `&middot; ${loc.region}${loc.subRegion ? `, ${loc.subRegion}` : ''}` : ''}
      ${loc.address ? `&middot; ${loc.address}` : ''}
    </p>
  `
}

function entityBadge(id: string, name: string, subtitle: string, moment?: number): string {
  const url = `/game-table-character-viewer/${id}${moment != null ? `?moment=${moment}` : ''}`
  return `
    <a href="${url}"
       class="inline-flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 rounded px-3 py-1.5 text-sm transition-colors">
      <span class="w-2 h-2 rounded-full bg-blue-500"></span>
      <div>
        <div class="font-medium text-zinc-200">${name}</div>
        <div class="text-xs text-zinc-500">${subtitle}</div>
      </div>
    </a>
  `
}

function modifierTag(m: any): string {
  if (!m) return ''
  const parts: string[] = []
  if (m.mod_hp != null) parts.push(`<span class="text-red-400 font-medium">${m.mod_hp >= 0 ? '+' : ''}${m.mod_hp} HP</span>`)
  if (m.mod_st != null) parts.push(`<span class="text-red-400 font-medium">${m.mod_st >= 0 ? '+' : ''}${m.mod_st} ST</span>`)
  if (m.mod_dx != null) parts.push(`<span class="text-emerald-400 font-medium">${m.mod_dx >= 0 ? '+' : ''}${m.mod_dx} DX</span>`)
  if (m.mod_iq != null) parts.push(`<span class="text-blue-400 font-medium">${m.mod_iq >= 0 ? '+' : ''}${m.mod_iq} IQ</span>`)
  if (m.mod_ht != null) parts.push(`<span class="text-purple-400 font-medium">${m.mod_ht >= 0 ? '+' : ''}${m.mod_ht} HT</span>`)
  if (m.mod_fatigue != null) parts.push(`<span class="text-blue-400 font-medium">${m.mod_fatigue >= 0 ? '+' : ''}${m.mod_fatigue} FP</span>`)
  if (m.hp != null) parts.push(`<span class="text-red-400 font-medium">HP&rarr;${m.hp}</span>`)
  if (m.damage_value != null) parts.push(`<span class="text-red-400 font-medium">${m.damage_value}</span>`)
  if (m.skill_value != null) parts.push(`<span class="text-amber-400 font-medium">Skill: ${m.skill_value}</span>`)
  if (m.item_quantity != null) parts.push(`<span class="text-amber-400 font-medium">Qty: ${m.item_quantity}</span>`)
  if (m.item_weight != null) parts.push(`<span class="text-amber-400 font-medium">Wt: ${m.item_weight}</span>`)
  if (!parts.length) return ''
  return `<div class="flex flex-wrap gap-2 mt-1 ml-7 text-xs">${parts.join('')}</div>`
}

function actionRow(a: any, moment?: number): string {
  const charId = a.character?.id || ''
  const charName = a.character?.name || a.character?.username || 'Unknown'
  const charUrl = charId ? `/game-table-character-viewer/${charId}${moment != null ? `?moment=${moment}` : ''}` : ''
  return `
    <div class="flex items-start gap-3 py-1.5">
      <span class="text-xs text-zinc-600 w-4 mt-0.5">${a.queue}.</span>
      <div class="flex-1">
        <span class="text-sm text-zinc-300">
          ${charUrl ? `<a href="${charUrl}" class="text-zinc-200 hover:text-blue-400">${charName}</a>` : charName}
          ${a.description ? `&mdash; ${a.description}` : ''}
        </span>
        ${a.dice_roll ? `<span class="text-xs text-zinc-400 ml-1">${a.dice_roll}${a.result ? ` = ${a.result}` : ''}</span>` : ''}
        ${modifierTag(a.modifier)}
      </div>
    </div>
  `
}

export function gameTableScenes(data: any): string {
  const table = data.table
  const scenes = data.scenes ?? []
  const tableId = table?.id || ''

  const chapters = new Map<number, any[]>()
  for (const scene of scenes) {
    const ch = scene.chapter || 1
    if (!chapters.has(ch)) chapters.set(ch, [])
    chapters.get(ch)!.push(scene)
  }
  const chapterEntries = [...chapters.entries()]

  return layout(`${table?.title || 'Scenes'} &mdash; Scenes`, `
    <div class="max-w-4xl mx-auto p-6">
      <div class="flex gap-1 border-b border-zinc-700/50 mb-6">
        <a href="/session/${tableId}" class="px-4 py-2.5 text-sm font-medium transition-colors text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent">Act</a>
        <a href="/view/game_table_scenes/${tableId}" class="px-4 py-2.5 text-sm font-medium transition-colors text-zinc-200 border-b-2 border-amber-500">Timeline</a>
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
      <h1 class="text-3xl font-bold text-amber-100">${table?.title || 'Scenes'}</h1>
      ${table?.intro ? `<p class="text-zinc-400 mt-1 mb-6">${table.intro}</p>` : '<br />'}

      ${scenes.length === 0 ? `
        <p class="text-zinc-500 italic">No scenes yet.</p>
      ` : chapterEntries.map(([chapter, chapterScenes]) => `
        <div class="mb-12">
          <div class="flex items-center gap-3 mb-6">
            <h2 class="text-2xl font-bold text-amber-100">Chapter ${chapter}</h2>
          </div>
          ${chapterScenes.map((scene: any) => `
            <div class="mb-10">
              <div class="flex items-center gap-3 mb-4">
                <h3 class="text-lg font-semibold text-zinc-200">${scene.title}</h3>
                <button class="px-3 py-1 text-xs font-medium text-amber-400 bg-transparent border border-amber-700/50 rounded-lg hover:bg-amber-900/20 transition-colors">Edit Scene</button>
              </div>
              ${(() => {
                const narrations = scene.narrations ?? []
                if (narrations.length === 0) return '<p class="text-sm text-zinc-500 italic">No narrations.</p>'
                return narrations.map((n: any, ni: number) => `
                  <div class="mb-5 pl-6 border-l-2 border-zinc-700/50">
                    <div class="flex items-baseline gap-2 mb-1">
                      <span class="text-xs text-zinc-500 font-mono">${scene.moment as number + 1}.${ni + 1}</span>
                      ${n.title ? `<span class="text-sm font-medium text-zinc-300">${n.title}</span>` : ''}
                    </div>
                    <p class="text-base text-zinc-300 leading-relaxed">${n.narration}</p>
                    <button class="mt-2 px-2.5 py-1 text-[11px] font-medium text-amber-400/70 bg-transparent border border-amber-800/40 rounded hover:bg-amber-900/15 transition-colors">Edit Narration</button>
                    ${n.location ? locationCard(n.location) : ''}
                    ${(() => {
                      const participants = [
                        ...(n.characters ?? []).map((ch: any) => entityBadge(ch.id, ch.name || ch.username || 'Unknown', 'Player', n.moment)),
                        ...(n.npcs ?? []).map((npc: any) => entityBadge(npc.characterId, npc.name || 'Unknown', npc.status || 'NPC', n.moment))
                      ]
                      return participants.length ? `
                        <div class="flex flex-wrap gap-3 mt-3">
                          ${participants.join('')}
                        </div>
                      ` : ''
                    })()}
                    ${n.actions?.length ? `
                      <div class="mt-3">
                        <p class="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">Actions</p>
                        ${[...n.actions].sort((a: any, b: any) => (a.queue ?? 0) - (b.queue ?? 0)).map(a => actionRow(a, n.moment)).join('')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')
              })()}
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `, table?.id)
}
