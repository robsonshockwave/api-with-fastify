import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import crypto from 'node:crypto';

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    //   const tables = await knex('sqlite_schema').select('*');

    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    });

    const { amount, title, type } = createTransactionBodySchema.parse(
      request.body
    );

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'debit' ? -1 * amount : amount,
    });

    return response.status(201).send();
  });
}
