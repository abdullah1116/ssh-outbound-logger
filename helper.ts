import { $ } from 'bun';

export async function lsof() {
  return (await $`lsof -Pn -p ^1 -i :22`.text().catch(() => ''))
    .split('\n')
    .slice(1)
    .filter((raw) => raw && !raw.includes('*:22') && !raw.includes(':22->'))
    .map((raw) => {
      const headers = [
        'command',
        'pid',
        'user',
        'fd',
        'type',
        'device',
        'size/off',
        'node',
        'name',
      ];

      return raw.split(/ +/g).reduce((carry: any, value, index) => {
        if (headers[index]) {
          carry[headers[index]] = value;
        }

        return carry;
      }, {});
    }) as ILsof[];
}

export interface ILsof {
  command: string;
  pid: string;
  user: string;
  fd: string;
  type: string;
  device: string;
  'size/off': string;
  node: string;
  name: string;
}

export async function pstree(pid: string) {
  return $`pstree -sap ${pid}`.text();
}
