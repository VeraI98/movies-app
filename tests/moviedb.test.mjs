import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function api(fetch, key = 'test-key') {
  const source = ts.transpileModule(fs.readFileSync('app/lib/moviedb.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  vm.runInNewContext(source, {
    exports,
    fetch,
    process: { env: { NEXT_PUBLIC_MOVIEDB_API_KEY: key } },
  });
  return exports;
}

test('search encodes the query and forwards cancellation', async () => {
  const controller = new AbortController();
  let request;
  const client = api(async (url, options) => {
    request = { url: new URL(url), options };
    return { ok: true, json: async () => ({ results: [] }) };
  });
  await client.fetchMovies('A & B 한국', 3, controller.signal);
  assert.equal(request.url.searchParams.get('query'), 'A & B 한국');
  assert.equal(request.url.searchParams.get('page'), '3');
  assert.equal(request.options.signal, controller.signal);
});

test('rated movies forwards pagination and cancellation', async () => {
  const controller = new AbortController();
  const client = api(async (url, options) => {
    assert.equal(new URL(url).pathname, '/3/guest_session/guest/rated/movies');
    assert.equal(new URL(url).searchParams.get('page'), '2');
    assert.equal(options.signal, controller.signal);
    return { ok: true, json: async () => ({ results: [] }) };
  });
  await client.fetchRatedMovies('guest', 2, controller.signal);
});

test('rating writes and removal use distinct HTTP methods', async () => {
  const requests = [];
  const client = api(async (_, options) => {
    requests.push(options);
    return { ok: true };
  });
  await client.addRating(1, 7.5, 'guest');
  await client.addRating(1, 0, 'guest');
  assert.equal(requests[0].method, 'POST');
  assert.equal(JSON.parse(requests[0].body).value, 7.5);
  assert.equal(requests[1].method, 'DELETE');
  assert.equal(requests[1].body, undefined);
});

test('guest session preserves the expiry returned by TMDB', async () => {
  const client = api(async () => ({
    ok: true,
    json: async () => ({ guest_session_id: 'guest', expires_at: '2030-01-01 00:00:00 UTC' }),
  }));
  const session = await client.createGuestSession();
  assert.equal(session.id, 'guest');
  assert.equal(session.expiresAt, '2030-01-01 00:00:00 UTC');
});

test('HTTP failures surface instead of becoming empty results', async () => {
  const client = api(async () => ({ ok: false, status: 503 }));
  await assert.rejects(client.fetchMovies('test'), /503/);
  await assert.rejects(client.addRating(1, 5, 'guest'), /503/);
});

test('missing API key gives a useful configuration error', async () => {
  const client = api(() => {
    throw new Error('fetch must not run');
  }, '');
  await assert.rejects(client.fetchMovies('test'), /NEXT_PUBLIC_MOVIEDB_API_KEY/);
});
