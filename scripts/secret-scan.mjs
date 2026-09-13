import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// Findings contain locations and rule names only, never matching values.
const rules = [
  ['database credential', /mongodb(?:\+srv)?:\/\/[^\s:/]+:[^\s@]+@/i],
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['provider key', /(?:AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{30,}|sk_live_[A-Za-z0-9]{16,})/],
  ['JWT value', /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{20,}/],
  ['secret assignment', /(?:JWT_(?:ACCESS|REFRESH)_SECRET|RAZORPAY_KEY_SECRET|RAZORPAY_WEBHOOK_SECRET)\s*[:=]\s*["']?(?!\s*$|replace-|process\.|env\.|z\.|crypto\.|randomBytes|["']?\s*$)[A-Za-z0-9_+\/-]{12,}/i],
];
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 });
const exclude = p => /(^|\/)(node_modules|dist|\.git)\/|(?:package-lock\.json|secret-scan\.mjs)$/.test(p);
const findings = [];
const scan = (label, source) => source.split(/\r?\n/).forEach((line, i) => {
  for (const [rule, pattern] of rules) if (pattern.test(line)) findings.push({ location: `${label}:${i + 1}`, rule });
});
for (const path of git('ls-files', '--cached', '--others', '--exclude-standard').split('\n').filter(Boolean)) {
  if (exclude(path)) continue;
  try { scan(path, readFileSync(path, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
const currentFindings = findings.length;
if (process.argv.includes('--history')) {
  const seen = new Set();
  for (const commit of git('rev-list', '--all').trim().split('\n').filter(Boolean)) {
    for (const row of git('ls-tree', '-r', commit).split('\n').filter(Boolean)) {
      const match = row.match(/^\d+ blob ([a-f0-9]+)\t(.+)$/);
      if (!match || exclude(match[2]) || seen.has(match[1])) continue;
      seen.add(match[1]);
      scan(`${commit.slice(0, 12)}:${match[2]}`, git('cat-file', 'blob', match[1]));
    }
  }
}
console.log(JSON.stringify({ currentFindings, historyFindings: findings.length - currentFindings, findings }, null, 2));
process.exitCode = currentFindings ? 1 : 0;
