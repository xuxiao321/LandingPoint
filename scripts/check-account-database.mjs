import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const db = new PGlite();
const userA = '11111111-1111-4111-8111-111111111111';
const userB = '22222222-2222-4222-8222-222222222222';
try {
  await db.exec(`create role anon; create role authenticated;
    create schema auth; create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth,public to anon,authenticated;
    grant execute on function auth.uid() to anon,authenticated;`);
  await db.query('insert into auth.users(id) values($1),($2)', [userA, userB]);
  const migration = await readFile('supabase/migrations/20260907_accounts_and_community.sql', 'utf8');
  await db.exec(migration);
  await db.exec(migration); // Re-running must not overwrite data or fail on policies.
  async function asUser(id) { await db.exec('reset role'); await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]); await db.exec('set role authenticated'); }
  await asUser(userA);
  await db.query('insert into public.account_saved_cities(user_id,city_slug) values($1,$2)', [userA, 'london']);
  await db.query('insert into public.account_preferences(user_id,preferences) values($1,$2)', [userA, JSON.stringify({ budget: 3000 })]);
  await db.query('insert into public.account_drafts(user_id,city_slug,kind,content) values($1,$2,$3,$4)', [userA, 'london', 'experience', '{"notes":"private"}']);
  await assert.rejects(db.query('insert into public.account_saved_cities(user_id,city_slug) values($1,$2)', [userB, 'london']));
  const review = await db.query(`insert into public.city_reviews(user_id,city_slug,display_name,residency,duration,body) values($1,'london','Resident','Current resident','1–3 years','A sufficiently detailed account of city life and transport.') returning id`, [userA]);
  const reviewId = review.rows[0].id;
  await asUser(userB);
  for (const table of ['account_saved_cities', 'account_preferences', 'account_drafts']) {
    assert.equal((await db.query(`select * from public.${table}`)).rows.length, 0, `${table}: cross-user read blocked`);
  }
  assert.equal((await db.query('delete from public.city_reviews where id=$1 returning id', [reviewId])).rows.length, 0);
  assert.equal((await db.query('select * from public.city_reviews')).rows.length, 1);
  await db.query('insert into public.review_reports(review_id,user_id,reason) values($1,$2,$3)', [reviewId, userB, 'Spam']);
  await asUser(userA);
  assert.equal((await db.query('select * from public.review_reports')).rows.length, 0);
  await db.exec('reset role; set role anon');
  assert.equal((await db.query('select * from public.city_reviews')).rows.length, 1);
  await assert.rejects(db.query('select * from public.account_preferences'));
  await assert.rejects(db.query('delete from public.city_reviews'));
  await assert.rejects(db.query('select * from public.review_reports'));
  await asUser(userA);
  assert.equal((await db.query('delete from public.city_reviews where id=$1 returning id', [reviewId])).rows.length, 1);
  // Deleted writes still count against the hourly budget.
  for (let i = 0; i < 19; i++) {
    await db.query(`insert into public.city_reviews(user_id,city_slug,display_name,residency,duration,body) values($1,$2,'Resident','Visitor','Under 3 months','A sufficiently detailed account of city life and transport.')`, [userA, `city-${i}`]);
  }
  await assert.rejects(db.query(`insert into public.city_reviews(user_id,city_slug,display_name,residency,duration,body) values($1,'over-limit','Resident','Visitor','Under 3 months','A sufficiently detailed account of city life and transport.')`, [userA]), /Too many submissions/);
  console.log('Database migration replay, private RLS, public reviews, author-only deletion, private reports and persistent write limits passed.');
} finally { await db.close(); }
