import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).trim().split('\n');
const forbidden = tracked.filter(file => /(^|\/)(node_modules|dist|coverage|\.cache)\//.test(file) || /(^|\/)\.env($|\.)/.test(file) && !file.endsWith('.env.example'));
const errors = forbidden.map(file => 'Tracked generated/environment file: ' + file);
function walk(directory) {
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) walk(file);
    else if (/\.[jt]sx?$/.test(file)) {
      const source = readFileSync(file, 'utf8');
      if (/mockData|Math\.random\(|FDIC|100% money.back|funds released from escrow/i.test(source)) errors.push('Unsupported runtime data/claim: ' + file);
      if (/import\s*\{[^}]*use(?:Auth|Toast|Socket)[^}]*\}\s*from\s*['"][^'"]*(?:Auth|Toast|Socket)Context/.test(source)) errors.push('Outdated hook import: ' + file);
    }
  }
}
walk('client/src');
if (existsSync('client/src/data/mockData.js')) errors.push('Runtime mockData.js still exists');
console.log(errors.length ? errors.join('\n') : 'Repository hygiene checks passed.');
process.exitCode = errors.length ? 1 : 0;
