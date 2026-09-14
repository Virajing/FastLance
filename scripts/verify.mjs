import { spawnSync } from 'node:child_process';
const commands = [
  ['run', 'lint'], ['run', 'build'], ['run', 'test:server'], ['run', 'test:client'], ['run', 'test:e2e'],
  ['audit', '--omit=dev'], ['audit', '--omit=dev', '--prefix', 'client'], ['audit', '--omit=dev', '--prefix', 'server'],
  ['run', 'secret-scan'], ['run', 'check:repository'],
];
const results = [];
for (const args of commands) {
  console.log('\nRunning npm ' + args.join(' '));
  const result = spawnSync(process.execPath, [process.env.npm_execpath, ...args], { stdio: 'inherit', env: process.env });
  results.push({ command: 'npm ' + args.join(' '), exitCode: result.status ?? 1 });
}
console.table(results);
process.exitCode = results.some(result => result.exitCode !== 0) ? 1 : 0;
