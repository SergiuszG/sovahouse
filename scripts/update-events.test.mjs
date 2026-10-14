import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { main, fetchHtml } from './update-events.mjs';

const museum = 'Muzeum Regionalne w Pułtusku';
const event = (id, date, extra = {}) => ({
  id, title: `Wystawa ${id}`, date, place: 'Pułtusk', source: museum, ...extra,
});
const html = (wordpress, title, day) =>
  `<${wordpress ? 'article' : 'h3'} class="tribe-events"><a href="https://example.com/${day}">${title}</a> ${day} października 2026</${wordpress ? 'article' : 'h3'}>`;
const pages = [html(false, 'Koncert organowy', 20), html(true, 'Spotkanie autorskie', 21), html(true, 'Wystawa muzealna', 22)];
const urls = ['https://pultusk.pl/events/', 'https://mckispultusk.pl/', 'https://muzeum.pultusk.pl/'];
const tlsError = () => new TypeError('fetch failed', {
  cause: Object.assign(new Error('self-signed certificate in certificate chain'), { code: 'SELF_SIGNED_CERT_IN_CHAIN' }),
});

async function fixture(t, contents = '[]\n') {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'sova-events-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const filePath = path.join(dir, 'events.json');
  await fs.writeFile(filePath, contents);
  const logs = [];
  return { filePath, now: new Date('2026-10-14T12:00:00Z'), logger: {
    log: (message) => logs.push(message), warn: (message) => logs.push(message),
  }, logs };
}

for (const failedIndex of [0, 1, 2]) {
  test(`TLS failure of source ${failedIndex + 1} does not block the others or lose cached events`, async (t) => {
    const cached = [event('cached', '2026-10-25'), event('ongoing', '2026-10-01', { endDate: '2026-10-30' }), event('expired', '2026-10-01')];
    const options = await fixture(t, JSON.stringify(cached));
    const calls = [];
    const result = await main({ ...options, fetchImpl: async (url, init) => {
      calls.push(url);
      assert.ok(init.signal instanceof AbortSignal);
      assert.equal(init.dispatcher, undefined);
      const index = urls.indexOf(url);
      if (index === failedIndex) throw tlsError();
      return new Response(pages[index]);
    } });
    assert.deepEqual(calls, urls);
    assert.equal(result.length, 4);
    assert.deepEqual(result.filter((e) => ['cached', 'ongoing'].includes(e.id)), [cached[1], cached[0]]);
    assert.ok(!result.some((e) => e.id === 'expired'));
    assert.deepEqual(JSON.parse(await fs.readFile(options.filePath, 'utf8')), result);
    assert.ok(options.logs.some((line) => line.includes(urls[failedIndex]) && line.includes('SELF_SIGNED_CERT_IN_CHAIN')));
    assert.ok(options.logs.some((line) => line.includes('2/3')));
  });
}

test('HTTP error and body-read failure are isolated; zero parsed events is still success', async (t) => {
  const cached = [event('cached', '2026-10-25')];
  const options = await fixture(t, JSON.stringify(cached));
  const result = await main({ ...options, fetchImpl: async (url) => {
    if (url === urls[0]) return new Response('', { status: 503 });
    if (url === urls[1]) return { ok: true, text: async () => { throw new Error('body disconnected'); } };
    return new Response('<html>No events</html>');
  } });
  assert.deepEqual(result, cached);
  assert.ok(options.logs.some((line) => line.includes('503')));
  assert.ok(options.logs.some((line) => line.includes('body disconnected')));
});

test('total outage fails without changing even expired cached data', async (t) => {
  const original = JSON.stringify([event('expired', '2026-10-01')], null, 4) + '\n';
  const options = await fixture(t, original);
  let calls = 0;
  await assert.rejects(main({ ...options, fetchImpl: async () => { calls++; throw tlsError(); } }), /Wszystkie źródła zawiodły/);
  assert.equal(calls, 3);
  assert.equal(await fs.readFile(options.filePath, 'utf8'), original);
});

for (const invalid of ['{broken', '{}', '[null]', '[{"title":"bad","place":"Pułtusk","date":"invalid"}]']) {
  test(`invalid cache is not overwritten: ${invalid}`, async (t) => {
    const options = await fixture(t, invalid);
    await assert.rejects(main({ ...options, fetchImpl: async () => assert.fail('must not fetch') }));
    assert.equal(await fs.readFile(options.filePath, 'utf8'), invalid);
  });
}

test('successful update sorts, deduplicates and initializes a missing cache', async (t) => {
  const options = await fixture(t);
  await fs.unlink(options.filePath);
  const fetchImpl = async (url) => new Response(pages[urls.indexOf(url)]);
  const first = await main({ ...options, fetchImpl });
  const second = await main({ ...options, fetchImpl });
  assert.equal(first.length, 3);
  assert.deepEqual(first.map((e) => e.date), ['2026-10-20', '2026-10-21', '2026-10-22']);
  assert.deepEqual(second, first);
});

test('a stalled HTTP source times out and the updater continues', async (t) => {
  const server = http.createServer(() => {});
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => { server.closeAllConnections(); server.close(); });
  const url = `http://127.0.0.1:${server.address().port}/`;
  await assert.rejects(fetchHtml(url, { timeoutMs: 50 }), { name: 'TimeoutError' });
  const options = await fixture(t);
  const result = await main({ ...options, timeoutMs: 50, fetchImpl: (source, init) =>
    source === urls[1] ? fetch(url, init) : Promise.resolve(new Response(pages[urls.indexOf(source)])) });
  assert.equal(result.length, 2);
  assert.ok(options.logs.some((line) => line.includes('TimeoutError')));
});
