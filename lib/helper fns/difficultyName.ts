// Namnen i tabellen difficulties är på engelska, eftersom seed-filerna letar
// upp svårighetsgraden med dem. Därför översätts de här och inte i databasen.
const swedishNames: Record<string, string> = {
  beginner: 'Lätt',
  intermediate: 'Medel',
  hard: 'Svår',
};

export const difficultyName = (name: string) => swedishNames[name] ?? name;
