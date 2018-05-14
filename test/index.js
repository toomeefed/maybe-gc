import test from 'ava';
import gc from '..';

const result = [];

const instance = gcType => ({
  gcType,
  gc: () => result.push(gcType),
});

const count = name => result.filter(k => k === name).length;

test('gc case', async (t) => {
  gc(instance('gc type 1'), '2s', '1s');
  gc(instance('gc type 2'), 1000);
  gc(instance(''), 1000);
  gc(instance('0'));

  const value = await new Promise((resolve) => {
    setTimeout(() => {
      const [res1, res2, res3, res4] = [
        count('gc type 1') === 2,
        count('gc type 2') === 4,
        count('') === 4,
        count('0') === 0,
      ];
      resolve(res1 && res2 && res3 && res4);
    }, 4200);
  });

  t.true(value);
});
