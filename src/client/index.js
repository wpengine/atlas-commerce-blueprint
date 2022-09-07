import { getClient } from '@faustjs/next';

import { generatedSchema, scalarsEnumsHash } from './schema.generated';

export const client = getClient({
  schema: generatedSchema,
  scalarsEnumsHash,
  normalization: false,
});

export function serverClient(req) {
  return getClient({
    schema: generatedSchema,
    scalarsEnumsHash,
    context: req,
    normalization: false,
  });
}

export * from './schema.generated';
