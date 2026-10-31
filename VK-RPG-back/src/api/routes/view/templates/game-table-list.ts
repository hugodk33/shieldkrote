export function gameTableCards(): string {
  return `
    <div class="mb-12" style="display: none;">
      <h1 class="text-4xl font-bold text-amber-100 mb-3">VKRPG</h1>
      <p class="text-zinc-400 text-lg">A platform for playing games and telling stories.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" style="display: none;">
      <a href="/tables"
         class="block bg-zinc-800/60 border border-zinc-700/50 rounded-xl p-6 hover:border-amber-700/50 transition-colors group">
        <div class="text-3xl mb-2">🎲</div>
        <h2 class="text-xl font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">Narrator</h2>
        <p class="text-zinc-500 text-sm mt-1">Manage your tables, scenes, and characters. Guide the story.</p>
      </a>
      <a href="/table"
         class="block bg-zinc-800/60 border border-zinc-700/50 rounded-xl p-6 hover:border-emerald-700/50 transition-colors group">
        <div class="text-3xl mb-2">⚔️</div>
        <h2 class="text-xl font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">Player</h2>
        <p class="text-zinc-500 text-sm mt-1">View your characters, track your progress, and play the game.</p>
      </a>
    </div>`
}
