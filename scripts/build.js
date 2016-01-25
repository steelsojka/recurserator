import { exec, mkdir, cp } from 'shelljs';

exec('babel ./lib -d ./');
mkdir('native');
cp('-R', './lib/*', './native');
