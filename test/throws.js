import { AssertionError } from 'assert';
import test from 'ava';
import gc from '..';

test('gc throws', (t) => {
  gc({ gc() {} }, 2000, 1000); // Trigger rate type resolution

  const { message } = t.throws(() => {
    gc();
  }, AssertionError);

  t.is(message, 'instance.gc must be a function');
});
