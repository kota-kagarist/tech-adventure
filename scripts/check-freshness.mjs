// 技術JSONの lastVerified が古い順に一覧する。使い方: npm run freshness [-- --days 60]
import { readdirSync, readFileSync } from 'node:fs';

const dir = new URL('../src/data/technologies/', import.meta.url);
const argIndex = process.argv.indexOf('--days');
const limitDays = argIndex > -1 ? Number(process.argv[argIndex + 1]) : 60;
const today = new Date();

const rows = readdirSync(dir)
  .filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(readFileSync(new URL(file, dir), 'utf8')))
  .map(({ id, importance, lastVerified, officialUrl }) => ({
    id,
    importance,
    lastVerified,
    officialUrl,
    age: Math.floor((today - new Date(lastVerified)) / 86_400_000),
  }))
  .sort((a, b) => b.age - a.age);

const stale = rows.filter((row) => !(row.age <= limitDays));
console.log(`${rows.length}件中 ${stale.length}件が ${limitDays}日超 (${today.toISOString().slice(0, 10)}時点)`);
for (const row of stale) {
  console.log(`${String(row.age).padStart(4)}日  ${row.lastVerified}  ${row.importance.padEnd(8)} ${row.id}  ${row.officialUrl}`);
}
