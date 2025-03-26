import { env, randomUUIDv7, sleep } from 'bun';
import { lsof, pstree, type ILsof } from './helper';

const existing: Record<string, Record<ILsof['name'], string>> = {};
const sleepTime =
  (env['SLEEP'] && Number(env['SLEEP']) > 0 && Number(env['SLEEP'])) || 50;

while (true) {
  const _lsof = await lsof();

  const new_proceses = _lsof.filter(
    ({ pid, name }) => !(existing[pid] && existing[pid][name])
  );

  // new connections
  for (const p of new_proceses) {
    sleep(sleepTime);

    existing[p.pid] ??= {};
    existing[p.pid][p.name] = randomUUIDv7();

    console.log(`[${existing[p.pid][p.name]}]`, new Date());
    console.log(
      `[${existing[p.pid][p.name]}]`,
      p['command'],
      p['pid'],
      p['user'],
      p['fd'],
      p['type'],
      p['device'],
      p['size/off'],
      p['node'],
      p['name']
    );
    console.log(
      `[${existing[p.pid][p.name]}]`,
      await pstree(p.pid).catch(() => 'pstree error')
    );
  }

  // deleting old connections
  for (const pid in existing) {
    const runningNames = _lsof
      .filter(({ pid: _pid }) => _pid === pid)
      .map((p) => p.name);

    for (const name in existing[pid]) {
      if (!runningNames.includes(name)) {
        console.log(`[${existing[pid][name]}]`, 'exit');

        delete existing[pid][name];

        if (!Object.keys(existing[pid]).length) {
          delete existing[pid];
        }
      }
    }
  }
}
