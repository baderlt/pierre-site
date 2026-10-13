// Development-only snapshot of the approved localized M4 fixtures. No public adapter changes.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const base = path.resolve(__dirname, '../apps/web/src/lib');
const cache = new Map();
function load(name) {
  const file = path.resolve(base, name.endsWith('.ts') ? name : name + '.ts');
  if (!file.startsWith(base + path.sep)) throw new Error('Fixture imports must stay in lib');
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} }; cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function('require', 'module', 'exports', code)(dep => load(dep), module, module.exports);
  return module.exports;
}
const home = load('home-content'), content = load('public-content'), catalogue = load('catalogue');
const result = Object.fromEntries(['fr', 'en', 'ar'].map(locale => [locale, { home: home.getHomeContent(locale), public: content.publicCopy[locale], about: content.getAboutContent(locale), applications: content.getApplications(locale), products: catalogue.getSamples(locale) }]));
const target = path.resolve(__dirname, '../apps/api/database/fixtures/milestone-4-content.json');
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, JSON.stringify(result, null, 2) + '\n');
console.log('Exported approved development fixtures for three locales.');
