import { layout } from './layout'

export function formCharacter(data?: any): string {
  const isEdit = !!data?.character?.id
  const ch = data?.character || {}
  const s = ch.sheet || {}
  const t = data?.table
  const tableId = t?.id || data?.table_id || ''

  if (isEdit) {
    const chId = ch.id || ''
    const chName = s.name || ch.name || ''
    const chBio = s.bio || ''
    const chBackstory = s.backstory || ''
    const chPoints = s.points ?? 150
    const chSt = s.st ?? 10
    const chDx = s.dx ?? 10
    const chIq = s.iq ?? 10
    const chHt = s.ht ?? 10

    const hasAdv = JSON.stringify(ch.advantages || []).replace(/'/g, "\\'")
    const hasDis = JSON.stringify(ch.disadvantages || []).replace(/'/g, "\\'")
    const hasSk = JSON.stringify(ch.skills || []).replace(/'/g, "\\'")
    const hasItems = JSON.stringify(ch.items || []).replace(/'/g, "\\'")

    return layout('Edit Character', `
    <div class="max-w-6xl mx-auto p-4">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-amber-100">${t?.title || 'Game'}</h1>
          <p class="text-zinc-400 text-sm">Edit Character</p>
        </div>
        <button id="editSaveBtn" class="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">Save Changes</button>
      </div>

      <input type="hidden" id="editCharId" value="${chId}"/>

      <div class="sticky top-14 z-40 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-700/50 -mx-4 px-4 py-3 mb-6">
        <div class="flex items-center justify-center gap-6 max-w-3xl mx-auto">
          <div class="text-2xl font-bold text-amber-400 whitespace-nowrap" id="editBudgetDisplay">0 / ${chPoints}</div>
          <div class="flex-1 max-w-md">
            <div class="w-full bg-zinc-800 rounded-full h-3">
              <div id="editBudgetBar" class="bg-amber-500 h-3 rounded-full transition-all" style="width:0%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Identity -->
        <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-5">
          <h2 class="text-lg font-semibold text-amber-100 mb-4">Identity</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Name</label>
              <input id="editName" value="${chName}"
                class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"/>
            </div>
            <div>
              <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Bio</label>
              <input id="editBio" value="${chBio}"
                class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"/>
            </div>
          </div>
          <div class="mt-3">
            <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Backstory</label>
            <textarea id="editBackstory" rows="2"
              class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500">${chBackstory}</textarea>
          </div>
        </div>

        <!-- Attributes -->
        <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-5">
          <h2 class="text-lg font-semibold text-amber-100 mb-4">Attributes</h2>
          <div class="grid grid-cols-2 gap-y-5 gap-x-6">
            <div class="flex flex-col items-center">
              <label class="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">ST</label>
              <div class="flex items-center gap-2">
                <button onclick="editAdjAttr('st', -1)" class="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-lg font-bold flex items-center justify-center leading-none">−</button>
                <span id="editAttrST" class="w-10 text-center text-lg font-bold text-amber-100">${chSt}</span>
                <button onclick="editAdjAttr('st', 1)" class="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-lg font-bold flex items-center justify-center leading-none">+</button>
              </div>
            </div>
            <div class="flex flex-col items-center">
              <label class="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">DX</label>
              <div class="flex items-center gap-2">
                <button onclick="editAdjAttr('dx', -1)" class="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-lg font-bold flex items-center justify-center leading-none">−</button>
                <span id="editAttrDX" class="w-10 text-center text-lg font-bold text-amber-100">${chDx}</span>
                <button onclick="editAdjAttr('dx', 1)" class="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-lg font-bold flex items-center justify-center leading-none">+</button>
              </div>
            </div>
            <div class="flex flex-col items-center">
              <label class="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">IQ</label>
              <div class="flex items-center gap-2">
                <button onclick="editAdjAttr('iq', -1)" class="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-lg font-bold flex items-center justify-center leading-none">−</button>
                <span id="editAttrIQ" class="w-10 text-center text-lg font-bold text-amber-100">${chIq}</span>
                <button onclick="editAdjAttr('iq', 1)" class="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-lg font-bold flex items-center justify-center leading-none">+</button>
              </div>
            </div>
            <div class="flex flex-col items-center">
              <label class="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">HT</label>
              <div class="flex items-center gap-2">
                <button onclick="editAdjAttr('ht', -1)" class="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-lg font-bold flex items-center justify-center leading-none">−</button>
                <span id="editAttrHT" class="w-10 text-center text-lg font-bold text-amber-100">${chHt}</span>
                <button onclick="editAdjAttr('ht', 1)" class="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-lg font-bold flex items-center justify-center leading-none">+</button>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-zinc-700/40">
            <label class="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">HP</label>
            <div id="editHp" class="bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-400 font-mono text-center">${chHt}</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div class="space-y-6">
          <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-5">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-amber-100">Advantages</h2>
              <span class="text-sm text-zinc-500" id="editAdvCount">0 selected</span>
            </div>
            <div id="editAdvantagesList" class="space-y-2 max-h-60 overflow-y-auto"></div>
          </div>

          <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-5">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-amber-100">Items</h2>
              <span class="text-sm text-zinc-500" id="editItemCount">0 selected</span>
            </div>
            <div id="editItemsList" class="space-y-2 max-h-60 overflow-y-auto"></div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-5">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-amber-100">Disadvantages</h2>
              <span class="text-sm text-zinc-500" id="editDisCount">0 selected</span>
            </div>
            <div id="editDisadvantagesList" class="space-y-2 max-h-60 overflow-y-auto"></div>
          </div>

          <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-5">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-amber-100">Skills</h2>
              <span class="text-sm text-zinc-500" id="editSkCount">0 selected</span>
            </div>
            <div id="editSkillsList" class="space-y-2 max-h-60 overflow-y-auto"></div>
          </div>
        </div>
      </div>
    </div>

    <input type="hidden" id="editTableId" value="${tableId}" />

    <script>
    const editTableId = document.getElementById('editTableId').value
    const editSelections = { advantages: [], disadvantages: [], skills: [], items: [] }
    let editAvailableData = { advantages: [], disadvantages: [], skills: [], items: [] }

    const editPresetAdv = ${hasAdv}
    const editPresetDis = ${hasDis}
    const editPresetSk = ${hasSk}
    const editPresetItems = ${hasItems}

    async function editLoadAvailable() {
      const [adv, dis, sk, items] = await Promise.all([
        fetch('/game-table-advantages/' + editTableId).then(r => r.json()),
        fetch('/game-table-disadvantages/' + editTableId).then(r => r.json()),
        fetch('/game-table-skills/' + editTableId).then(r => r.json()),
        fetch('/game-table-items/' + editTableId).then(r => r.json()),
      ])
      editAvailableData = { advantages: adv, disadvantages: dis, skills: sk, items }
      editPreselect()
      editRenderAll()
    }

    function editPreselect() {
      editPresetAdv.forEach((a) => {
        editSelections.advantages.push({ id: a.advantage_id || a.id, name: a.name || '', cost_points: a.cost_points || 0, effect: a.effect || '' })
      })
      editPresetDis.forEach((d) => {
        editSelections.disadvantages.push({ id: d.disadvantage_id || d.id, name: d.name || '', cost_points: d.cost_points || 0, effect: d.effect || '' })
      })
      editPresetSk.forEach((s) => {
        editSelections.skills.push({ id: s.skill_id || s.id, name: s.skill_name || s.name || '', cost_points: s.cost_points || 1, effect: s.effect || '' })
      })
      editPresetItems.forEach((i) => {
        editSelections.items.push({ id: i.item_id || i.id, name: i.name || '' })
      })
    }

    if (editTableId) editLoadAvailable()

    function editRenderAll() {
      editRenderCheckboxList('editAdvantagesList', editAvailableData.advantages, editSelections.advantages, 'advantages', 'editAdvCount')
      editRenderCheckboxList('editDisadvantagesList', editAvailableData.disadvantages, editSelections.disadvantages, 'disadvantages', 'editDisCount')
      editRenderSkillList()
      editRenderItemsList()
      editUpdateBudget()
    }

    function editRenderCheckboxList(containerId, available, selected, type, countId) {
      const container = document.getElementById(containerId)
      if (!container) return
      container.innerHTML = available.map(item => {
        const isSelected = selected.some(s => s.id === item.id)
        return \`
          <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-700/30 cursor-pointer \${isSelected ? 'bg-zinc-700/40 border border-amber-500/30' : 'border border-transparent'}">
            <input type="checkbox" \${isSelected ? 'checked' : ''}
              onchange="editToggleSelection('\${type}', '\${item.id}', '\${(item.name || 'Unnamed').replace(/'/g, "\\\\'")}', \${item.cost_points ?? 0}, this.checked)"
              class="w-4 h-4 rounded border-zinc-600 text-amber-500 focus:ring-amber-500 bg-zinc-900"/>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-zinc-200 truncate">\${item.name || 'Unnamed'}</div>
              <div class="text-xs text-zinc-500 truncate">\${(item.description || '').substring(0, 80)}</div>
            </div>
            <span class="text-xs font-mono text-zinc-400 shrink-0">\${item.cost_points != null ? (item.cost_points >= 0 ? '+' : '') + item.cost_points : '±0'}</span>
          </label>
        \`
      }).join('')
      const countEl = document.getElementById(countId)
      if (countEl) countEl.textContent = selected.length + ' selected'
    }

    function editToggleSelection(type, id, name, cost, checked) {
      const list = editSelections[type]
      if (checked) {
        list.push({ id, name, cost_points: cost })
      } else {
        const idx = list.findIndex(s => s.id === id)
        if (idx >= 0) list.splice(idx, 1)
      }
      editRenderAll()
    }

    function editRenderSkillList() {
      const container = document.getElementById('editSkillsList')
      if (!container) return
      container.innerHTML = editAvailableData.skills.map(sk => {
        const sel = editSelections.skills.find(s => s.id === sk.id)
        const pts = sel ? sel.cost_points : 0
        return \`
          <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-700/30 \${sel ? 'bg-zinc-700/40 border border-amber-500/30' : 'border border-transparent'}">
            <input type="checkbox" \${sel ? 'checked' : ''}
              onchange="editToggleSkill('\${sk.id}', '\${(sk.name || 'Unnamed').replace(/'/g, "\\\\'")}', this.checked)"
              class="w-4 h-4 rounded border-zinc-600 text-amber-500 focus:ring-amber-500 bg-zinc-900"/>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-zinc-200">\${sk.name || 'Unnamed'}</div>
              <div class="text-xs text-zinc-500">\${sk.predefinition_type || ''} \${sk.predefinition_difficulty ? '· ' + sk.predefinition_difficulty : ''}</div>
            </div>
            <div class="flex items-center gap-1">
              <button onclick="editAdjSkill('\${sk.id}', -1)" class="w-6 h-6 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-bold flex items-center justify-center">\u2212</button>
              <span class="text-sm font-mono text-amber-400 w-6 text-center" id="editSkPts_\${sk.id}">\${pts}</span>
              <button onclick="editAdjSkill('\${sk.id}', 1)" class="w-6 h-6 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-bold flex items-center justify-center">+</button>
            </div>
          </div>
        \`
      }).join('')
      const countEl = document.getElementById('editSkCount')
      if (countEl) countEl.textContent = editSelections.skills.length + ' selected'
    }

    function editToggleSkill(id, name, checked) {
      if (checked) {
        editSelections.skills.push({ id, name, cost_points: 1, effect: '' })
      } else {
        const idx = editSelections.skills.findIndex(s => s.id === id)
        if (idx >= 0) editSelections.skills.splice(idx, 1)
      }
      editRenderAll()
    }

    function editAdjSkill(id, delta) {
      const sel = editSelections.skills.find(s => s.id === id)
      if (!sel) return
      sel.cost_points = Math.max(0, (sel.cost_points || 0) + delta)
      editRenderAll()
    }

    function editRenderItemsList() {
      const container = document.getElementById('editItemsList')
      if (!container) return
      container.innerHTML = editAvailableData.items.map(item => {
        const sel = editSelections.items.some(s => s.id === item.id)
        return \`
          <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-700/30 cursor-pointer \${sel ? 'bg-zinc-700/40 border border-amber-500/30' : 'border border-transparent'}">
            <input type="checkbox" \${sel ? 'checked' : ''}
              onchange="editToggleItem('\${item.id}', '\${(item.name || 'Unnamed').replace(/'/g, "\\\\'")}', this.checked)"
              class="w-4 h-4 rounded border-zinc-600 text-amber-500 focus:ring-amber-500 bg-zinc-900"/>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-zinc-200 truncate">\${item.name || 'Unnamed'}</div>
              <div class="text-xs text-zinc-500 truncate">\${item.category || ''} \${item.weight != null ? '· ' + item.weight + ' lbs' : ''}</div>
            </div>
          </label>
        \`
      }).join('')
      const countEl = document.getElementById('editItemCount')
      if (countEl) countEl.textContent = editSelections.items.length + ' selected'
    }

    function editToggleItem(id, name, checked) {
      if (checked) {
        editSelections.items.push({ id, name })
      } else {
        const idx = editSelections.items.findIndex(s => s.id === id)
        if (idx >= 0) editSelections.items.splice(idx, 1)
      }
      editRenderAll()
    }

    const editTotalPoints = ${chPoints}
    const editAttrBase = 10
    const editAttrCosts = { st: 10, dx: 20, iq: 20, ht: 10 }
    const editAttrValues = { st: ${chSt}, dx: ${chDx}, iq: ${chIq}, ht: ${chHt} }

    function editCalcSpentPoints() {
      const attrCost = (editAttrValues.st - editAttrBase) * editAttrCosts.st +
                       (editAttrValues.dx - editAttrBase) * editAttrCosts.dx +
                       (editAttrValues.iq - editAttrBase) * editAttrCosts.iq +
                       (editAttrValues.ht - editAttrBase) * editAttrCosts.ht
      const advCost = editSelections.advantages.reduce((s, a) => s + (a.cost_points || 0), 0)
      const disCost = editSelections.disadvantages.reduce((s, d) => s + (d.cost_points || 0), 0)
      const skCost = editSelections.skills.reduce((s, sk) => s + (sk.cost_points || 0), 0)
      return attrCost + advCost + disCost + skCost
    }

    function editAdjAttr(attr, delta) {
      if (delta > 0 && editCalcSpentPoints() + editAttrCosts[attr] > editTotalPoints) return
      const newVal = editAttrValues[attr] + delta
      if (newVal < 1 || newVal > 50) return
      editAttrValues[attr] = newVal
      document.getElementById('editAttr' + attr.toUpperCase()).textContent = newVal
      if (attr === 'ht') document.getElementById('editHp').textContent = newVal
      editUpdateBudget()
    }

    function editUpdateBudget() {
      const spent = editCalcSpentPoints()
      const display = document.getElementById('editBudgetDisplay')
      if (display) display.textContent = spent + ' / ' + editTotalPoints
      const bar = document.getElementById('editBudgetBar')
      if (bar) bar.style.width = Math.min(100, (spent / editTotalPoints) * 100) + '%'
    }

    document.getElementById('editSaveBtn').addEventListener('click', async () => {
      const btn = document.getElementById('editSaveBtn')
      btn.disabled = true
      btn.textContent = 'Saving...'

      const payload = {
        id: document.getElementById('editCharId').value,
        table_id: editTableId,
        user_id: '',
        sheet: {
          name: document.getElementById('editName').value,
          bio: document.getElementById('editBio').value,
          backstory: document.getElementById('editBackstory').value,
          points: editTotalPoints,
          hp: editAttrValues.ht,
          st: editAttrValues.st,
          dx: editAttrValues.dx,
          iq: editAttrValues.iq,
          ht: editAttrValues.ht,
        },
        advantages: editSelections.advantages.map(a => ({
          advantage_id: a.id,
          name: a.name,
          cost_points: a.cost_points,
          effect: ''
        })),
        disadvantages: editSelections.disadvantages.map(d => ({
          disadvantage_id: d.id,
          name: d.name,
          cost_points: d.cost_points,
          effect: ''
        })),
        skills: editSelections.skills.map(s => ({
          skill_id: s.id,
          cost_points: s.cost_points,
          effect: ''
        })),
        items: editSelections.items.map(i => ({ item_id: i.id })),
        damages: [],
        armors: [],
        peculiarities: []
      }

      try {
        const res = await fetch('/game-table-character', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const result = await res.json()
        if (result.success) {
          btn.textContent = 'Saved!'
          btn.className = 'mt-4 w-full bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors'
          setTimeout(() => { window.location.href = '/game-table-character-viewer/' + payload.id }, 800)
        } else {
          alert('Error: ' + (result.error || 'Unknown'))
          btn.disabled = false
          btn.textContent = 'Save Changes'
        }
      } catch (err) {
        alert('Network error: ' + err.message)
        btn.disabled = false
        btn.textContent = 'Save Changes'
      }
    })
    </script>
    `, t?.id)
  }

  return layout('New Character', `
<div class="max-w-6xl mx-auto p-4">
  <div class="sticky top-14 z-40 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-700/50 -mx-4 px-4 py-3 mb-6">
    <div class="flex items-center justify-center gap-6 max-w-3xl mx-auto">
      <div class="text-md font-bold text-amber-400 whitespace-nowrap" id="budgetDisplay">0 / 150</div>
      <div class="flex-1 max-w-md">
        <div class="w-full bg-zinc-800 rounded-full h-3">
          <div id="budgetBar" class="bg-amber-500 h-3 rounded-full transition-all" style="width:0%"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-between mb-6 mt-6">
    <div>
      <h1 class="text-2xl font-bold text-amber-100">${t?.title || 'Game'}</h1>
      <p class="text-zinc-400 text-sm">New Character</p>
    </div>
    <button id="saveBtn" class="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">Create Character</button>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Identity -->
    <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-5">
      <h2 class="text-lg font-semibold text-amber-100 mb-4">Identity</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Name</label>
          <input id="chName" value=""
            class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"/>
        </div>
        <div>
          <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Bio</label>
          <input id="chBio" value=""
            class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"/>
        </div>
      </div>
      <div class="mt-3">
        <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Backstory</label>
        <textarea id="chBackstory" rows="2"
          class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"></textarea>
      </div>
      <div class="mt-4 pt-4 border-t border-zinc-700/40">
        <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">Type</label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="charType" value="pc" checked onchange="toggleCharType()"
              class="w-4 h-4 border-zinc-600 text-amber-500 focus:ring-amber-500 bg-zinc-900"/>
            <span class="text-zinc-200 text-sm">Player Character</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="charType" value="npc" onchange="toggleCharType()"
              class="w-4 h-4 border-zinc-600 text-amber-500 focus:ring-amber-500 bg-zinc-900"/>
            <span class="text-zinc-200 text-sm">NPC</span>
          </label>
        </div>
      </div>
      <div id="playerSelectGroup" class="mt-3">
        <label class="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Assign to Player</label>
        <select id="chUserId"
          class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500">
          <option value="">-- Select a player --</option>
        </select>
      </div>
    </div>

    <!-- Attributes -->
    <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-5">
      <h2 class="text-lg font-semibold text-amber-100 mb-4">Attributes</h2>
      <div class="grid grid-cols-2 gap-y-5 gap-x-6">
        <div class="flex flex-col items-center">
          <label class="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">ST</label>
          <div class="flex items-center gap-2">
            <button onclick="adjAttr('st', -1)" class="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-lg font-bold flex items-center justify-center leading-none">−</button>
            <span id="attrST" class="w-10 text-center text-lg font-bold text-amber-100">10</span>
            <button onclick="adjAttr('st', 1)" class="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-lg font-bold flex items-center justify-center leading-none">+</button>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <label class="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">DX</label>
          <div class="flex items-center gap-2">
            <button onclick="adjAttr('dx', -1)" class="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-lg font-bold flex items-center justify-center leading-none">−</button>
            <span id="attrDX" class="w-10 text-center text-lg font-bold text-amber-100">10</span>
            <button onclick="adjAttr('dx', 1)" class="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-lg font-bold flex items-center justify-center leading-none">+</button>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <label class="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">IQ</label>
          <div class="flex items-center gap-2">
            <button onclick="adjAttr('iq', -1)" class="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-lg font-bold flex items-center justify-center leading-none">−</button>
            <span id="attrIQ" class="w-10 text-center text-lg font-bold text-amber-100">10</span>
            <button onclick="adjAttr('iq', 1)" class="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-lg font-bold flex items-center justify-center leading-none">+</button>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <label class="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">HT</label>
          <div class="flex items-center gap-2">
            <button onclick="adjAttr('ht', -1)" class="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-lg font-bold flex items-center justify-center leading-none">−</button>
            <span id="attrHT" class="w-10 text-center text-lg font-bold text-amber-100">10</span>
            <button onclick="adjAttr('ht', 1)" class="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-lg font-bold flex items-center justify-center leading-none">+</button>
          </div>
        </div>
      </div>
      <div class="mt-4 pt-4 border-t border-zinc-700/40">
        <label class="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">HP</label>
        <div id="chHp" class="bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-400 font-mono text-center">10</div>
      </div>
    </div>
  </div>

  <!-- Remaining sections in 2 columns -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
    <div class="space-y-6">
      <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-amber-100">Advantages</h2>
          <span class="text-sm text-zinc-500" id="advCount">0 selected</span>
        </div>
        <div id="advantagesList" class="space-y-2 max-h-60 overflow-y-auto"></div>
      </div>

      <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-amber-100">Items</h2>
          <span class="text-sm text-zinc-500" id="itemCount">0 selected</span>
        </div>
        <div id="itemsList" class="space-y-2 max-h-60 overflow-y-auto"></div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-amber-100">Disadvantages</h2>
          <span class="text-sm text-zinc-500" id="disCount">0 selected</span>
        </div>
        <div id="disadvantagesList" class="space-y-2 max-h-60 overflow-y-auto"></div>
      </div>

      <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-amber-100">Skills</h2>
          <span class="text-sm text-zinc-500" id="skCount">0 selected</span>
        </div>
        <div id="skillsList" class="space-y-2 max-h-60 overflow-y-auto"></div>
      </div>

      <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-5">
        <h2 class="text-lg font-semibold text-amber-100 mb-3">Peculiarities (Quirks)</h2>
        <p class="text-xs text-zinc-500 mb-2">One per line. Format: <code>Name: cost_points: effect</code></p>
        <textarea id="chPeculiarities" rows="4" placeholder="Bad Temper: -5: -2 reaction rolls when provoked.&#10;Night Owl: -5: +1 alertness after midnight."
          class="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-2.5 text-zinc-100 font-mono text-sm focus:outline-none focus:border-amber-500"></textarea>
      </div>
    </div>
  </div>
</div>

<input type="hidden" id="tableId" value="${tableId}" />
<input type="hidden" id="userId" value="${data?.user_id || ''}" />

<script>
const tableId = document.getElementById('tableId').value
const selections = { advantages: [], disadvantages: [], skills: [], items: [] }
let availableData = { advantages: [], disadvantages: [], skills: [], items: [], users: [] }

async function loadAvailable() {
  const [adv, dis, sk, items, pec, users] = await Promise.all([
    fetch('/game-table-advantages/' + tableId).then(r => r.json()),
    fetch('/game-table-disadvantages/' + tableId).then(r => r.json()),
    fetch('/game-table-skills/' + tableId).then(r => r.json()),
    fetch('/game-table-items/' + tableId).then(r => r.json()),
    fetch('/game-table-peculiarities/' + tableId).then(r => r.json()),
    fetch('/users').then(r => r.json()),
  ])
  availableData = {
    advantages: adv?.advantages || adv || [],
    disadvantages: dis?.disadvantages || dis || [],
    skills: sk || [],
    items: items?.items || items || [],
    peculiarities: pec?.peculiarites || (Array.isArray(pec) ? pec : []),
    users: users || []
  }
  populatePlayerSelect(availableData.users)
  renderAll()
}
if (tableId) loadAvailable()

function populatePlayerSelect(users) {
  const sel = document.getElementById('chUserId')
  if (!sel) return
  sel.innerHTML = '<option value="">-- Select a player --</option>' + users
    .filter(u => u.type !== 2)
    .map(u => '<option value="' + u.id + '">' + (u.username || u.email || u.id) + '</option>')
    .join('')
}

function toggleCharType() {
  const isNpc = document.querySelector('input[name="charType"]:checked')?.value === 'npc'
  document.getElementById('playerSelectGroup').style.display = isNpc ? 'none' : 'block'
}

function renderAll() {
  renderCheckboxList('advantagesList', availableData.advantages, selections.advantages, 'advantages', 'advCount')
  renderCheckboxList('disadvantagesList', availableData.disadvantages, selections.disadvantages, 'disadvantages', 'disCount')
  renderSkillList()
  renderItemsList()
  updateBudget()
}

function renderCheckboxList(containerId, available, selected, type, countId) {
  const container = document.getElementById(containerId)
  if (!container) return
  container.innerHTML = available.map(item => {
    const isSelected = selected.some(s => s.id === item.id)
    return \`
      <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-700/30 cursor-pointer \${isSelected ? 'bg-zinc-700/40 border border-amber-500/30' : 'border border-transparent'}">
        <input type="checkbox" \${isSelected ? 'checked' : ''}
          onchange="toggleSelection('\${type}', '\${item.id}', '\${(item.name || 'Unnamed').replace(/'/g, "\\\\'")}', \${item.cost_points ?? 0}, this.checked)"
          class="w-4 h-4 rounded border-zinc-600 text-amber-500 focus:ring-amber-500 bg-zinc-900"/>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-zinc-200 truncate">\${item.name || 'Unnamed'}</div>
          <div class="text-xs text-zinc-500 truncate">\${(item.description || '').substring(0, 80)}</div>
        </div>
        <span class="text-xs font-mono text-zinc-400 shrink-0">\${item.cost_points != null ? (item.cost_points >= 0 ? '+' : '') + item.cost_points : '±0'}</span>
      </label>
    \`
  }).join('')
  const countEl = document.getElementById(countId)
  if (countEl) countEl.textContent = selected.length + ' selected'
}

function toggleSelection(type, id, name, cost, checked) {
  const list = selections[type]
  if (checked) {
    list.push({ id, name, cost_points: cost })
  } else {
    const idx = list.findIndex(s => s.id === id)
    if (idx >= 0) list.splice(idx, 1)
  }
  renderAll()
}

function renderSkillList() {
  const container = document.getElementById('skillsList')
  if (!container) return
  container.innerHTML = availableData.skills.map(sk => {
    const sel = selections.skills.find(s => s.id === sk.id)
    const pts = sel ? sel.cost_points : 0
    return \`
      <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-700/30 \${sel ? 'bg-zinc-700/40 border border-amber-500/30' : 'border border-transparent'}">
        <input type="checkbox" \${sel ? 'checked' : ''}
          onchange="toggleSkill('\${sk.id}', '\${(sk.name || 'Unnamed').replace(/'/g, "\\\\'")}', this.checked)"
          class="w-4 h-4 rounded border-zinc-600 text-amber-500 focus:ring-amber-500 bg-zinc-900"/>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-zinc-200">\${sk.name || 'Unnamed'}</div>
          <div class="text-xs text-zinc-500">\${sk.predefinition_type || ''} \${sk.predefinition_difficulty ? '· ' + sk.predefinition_difficulty : ''}</div>
        </div>
        <div class="flex items-center gap-1">
          <button onclick="adjSkill('\${sk.id}', -1)" class="w-6 h-6 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-bold flex items-center justify-center">\u2212</button>
          <span class="text-sm font-mono text-amber-400 w-6 text-center" id="skPts_\${sk.id}">\${pts}</span>
          <button onclick="adjSkill('\${sk.id}', 1)" class="w-6 h-6 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-bold flex items-center justify-center">+</button>
        </div>
      </div>
    \`
  }).join('')
  const countEl = document.getElementById('skCount')
  if (countEl) countEl.textContent = selections.skills.length + ' selected'
}

function toggleSkill(id, name, checked) {
  if (checked) {
    selections.skills.push({ id, name, cost_points: 1, effect: '' })
  } else {
    const idx = selections.skills.findIndex(s => s.id === id)
    if (idx >= 0) selections.skills.splice(idx, 1)
  }
  renderAll()
}

function adjSkill(id, delta) {
  const sel = selections.skills.find(s => s.id === id)
  if (!sel) return
  sel.cost_points = Math.max(0, (sel.cost_points || 0) + delta)
  renderAll()
}

function renderItemsList() {
  const container = document.getElementById('itemsList')
  if (!container) return
  container.innerHTML = availableData.items.map(item => {
    const sel = selections.items.some(s => s.id === item.id)
    return \`
      <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-700/30 cursor-pointer \${sel ? 'bg-zinc-700/40 border border-amber-500/30' : 'border border-transparent'}">
        <input type="checkbox" \${sel ? 'checked' : ''}
          onchange="toggleItem('\${item.id}', '\${(item.name || 'Unnamed').replace(/'/g, "\\\\'")}', this.checked)"
          class="w-4 h-4 rounded border-zinc-600 text-amber-500 focus:ring-amber-500 bg-zinc-900"/>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-zinc-200 truncate">\${item.name || 'Unnamed'}</div>
          <div class="text-xs text-zinc-500 truncate">\${item.category || ''} \${item.weight != null ? '· ' + item.weight + ' lbs' : ''}</div>
        </div>
      </label>
    \`
  }).join('')
  const countEl = document.getElementById('itemCount')
  if (countEl) countEl.textContent = selections.items.length + ' selected'
}

function toggleItem(id, name, checked) {
  if (checked) {
    selections.items.push({ id, name })
  } else {
    const idx = selections.items.findIndex(s => s.id === id)
    if (idx >= 0) selections.items.splice(idx, 1)
  }
  renderAll()
}

const totalPoints = 150
const attrBase = 10
const attrValues = { st: 10, dx: 10, iq: 10, ht: 10 }
const attrCosts = { st: 10, dx: 20, iq: 20, ht: 10 }

function calcSpentPoints() {
  const attrCost = (attrValues.st - attrBase) * attrCosts.st +
                   (attrValues.dx - attrBase) * attrCosts.dx +
                   (attrValues.iq - attrBase) * attrCosts.iq +
                   (attrValues.ht - attrBase) * attrCosts.ht
  const advCost = selections.advantages.reduce((s, a) => s + (a.cost_points || 0), 0)
  const disCost = selections.disadvantages.reduce((s, d) => s + (d.cost_points || 0), 0)
  const skCost = selections.skills.reduce((s, sk) => s + (sk.cost_points || 0), 0)
  return attrCost + advCost + disCost + skCost
}

function adjAttr(attr, delta) {
  if (delta > 0 && calcSpentPoints() + attrCosts[attr] > totalPoints) return
  const newVal = attrValues[attr] + delta
  if (newVal < 1 || newVal > 50) return
  attrValues[attr] = newVal
  document.getElementById('attr' + attr.toUpperCase()).textContent = newVal
  if (attr === 'ht') document.getElementById('chHp').textContent = newVal
  updateBudget()
}

function updateBudget() {
  const spent = calcSpentPoints()
  const display = document.getElementById('budgetDisplay')
  if (display) display.textContent = spent + ' / ' + totalPoints
  const bar = document.getElementById('budgetBar')
  if (bar) bar.style.width = Math.min(100, (spent / totalPoints) * 100) + '%'
}

document.getElementById('saveBtn').addEventListener('click', async () => {
  const btn = document.getElementById('saveBtn')
  btn.disabled = true
  btn.textContent = 'Saving...'

  const isNpc = document.querySelector('input[name="charType"]:checked')?.value === 'npc'
  const payload = {
    table_id: tableId,
    user_id: isNpc ? '' : document.getElementById('chUserId').value,
    sheet: {
      name: document.getElementById('chName').value,
      bio: document.getElementById('chBio').value,
      backstory: document.getElementById('chBackstory').value,
      points: totalPoints,
      hp: attrValues.ht,
      st: attrValues.st,
      dx: attrValues.dx,
      iq: attrValues.iq,
      ht: attrValues.ht,
    },
    advantages: selections.advantages.map(a => ({
      advantage_id: a.id,
      name: a.name,
      cost_points: a.cost_points,
      effect: ''
    })),
    disadvantages: selections.disadvantages.map(d => ({
      disadvantage_id: d.id,
      name: d.name,
      cost_points: d.cost_points,
      effect: ''
    })),
    skills: selections.skills.map(s => ({
      skill_id: s.id,
      cost_points: s.cost_points,
      effect: ''
    })),
    items: selections.items.map(i => ({ item_id: i.id })),
    peculiarities: document.getElementById('chPeculiarities').value.split('\n').filter(Boolean).map(line => {
      const parts = line.split(':').map(s => s.trim())
      return { name: parts[0] || '', cost_points: parseInt(parts[1]) || 0, effect: parts[2] || '' }
    })
  }

  try {
    const res = await fetch('/game-table-character', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const result = await res.json()
    if (result.success) {
      btn.textContent = 'Created!'
      btn.className = 'mt-4 w-full bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors'
      setTimeout(() => { window.location.href = '/game-table-character-viewer/' + result.character_id }, 800)
    } else {
      alert('Error: ' + (result.error || 'Unknown'))
      btn.disabled = false
      btn.textContent = 'Create Character'
    }
  } catch (err) {
    alert('Network error: ' + err.message)
    btn.disabled = false
    btn.textContent = 'Create Character'
  }
})
</script>
`, t?.id)
}
