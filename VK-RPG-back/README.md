# VKRPG

> A platform for playing games and telling stories.

This project includes a **frontend sample** — a set of HTML views rendered server-side via TypeScript template functions — to demonstrate the UI layout and flow. The frontend is not yet the final design; it serves as a proof of concept that will be expanded and refined as the project evolves.

*More details about the project will be added here as development progresses.*

```
      ___
    /\\6 /\\
   /  \\/  \\
  | 5 || 4 |
   \\  /\\  /
    \\/  \\/
     3
```

> *A D6 rolled a 3.*

## Installation

```bash
npm install
```

## Database

```bash
npm run migration
npm run seed
```

## Routes

### View Routes (HTML pages)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Home — list game tables |
| GET | `/view/game_table_scenes/:id` | Scenes for a game table |
| GET | `/view/game_table_characters/:id` | Characters in a game table |
| GET | `/game-table-character-viewer/:id` | Character sheet viewer |
| GET | `/form/game-table/new` | Create a game table |
| GET | `/form/game-table/:id` | Edit a game table |
| GET | `/form/character/new` | Create a character |
| GET | `/form/character/:id` | Edit a character |
| GET | `/form/npc/new` | Create an NPC |
| GET | `/form/npc/:id` | Edit an NPC |
| GET | `/form/item/new` | Create an item |
| GET | `/form/item/:id` | Edit an item |
| GET | `/form/advantage/new` | Create an advantage |
| GET | `/form/advantage/:id` | Edit an advantage |
| GET | `/form/disadvantage/new` | Create a disadvantage |
| GET | `/form/disadvantage/:id` | Edit a disadvantage |
| GET | `/tables/:narratorId` | Narrator dashboard |
| GET | `/table/:userId` | Player dashboard |

### API Routes (JSON)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/create-user` | Create a user |
| GET | `/users` | List all users |
| GET | `/users/search/:searchTerm` | Search users |
| PUT | `/users/edit/:id` | Edit a user |
| POST | `/create-game-table` | Create a game table |
| GET | `/game-tables` | List all game tables |
| GET | `/game-table/:id` | Find a game table |
| GET | `/game-table-scenes/:id` | Scenes for a game table |
| PUT | `/game-table/edit/:id` | Edit a game table |
| GET | `/game-table-skills/:id` | Skills for a game table |
| GET | `/game-table-advantages/:id` | Advantages for a game table |
| GET | `/game-table-peculiarities/:id` | Peculiarities for a game table |
| GET | `/game-table-items/:id` | Items for a game table |
| GET | `/game-table-npcs/:id` | NPCs for a game table |
| GET | `/game-table-npc/:id` | Find an NPC |
| POST | `/game-table-character` | Create a character |
| PUT | `/game-table-character` | Edit a character |
| GET | `/game-table-character/:id` | Find a character |
| GET | `/game-table-characters/:id` | Characters for a game table |
