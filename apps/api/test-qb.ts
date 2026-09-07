import { db } from './prisma/db.js';

async function test() {
  const qb = db.orm.public.Comment.where({});
  const proto = Object.getPrototypeOf(qb);
  console.log('--- CollectionImpl Prototype ---');
  console.log(Object.getOwnPropertyNames(proto));
  console.log('--------------------------------');
  await db.close();
}
test().catch(console.error);
