import { rest } from "msw";
import { setupServer } from "msw/node";
import { apiUrlCollections, apiUrlCollectionById } from "../src/api.util";

const handlers = [
  rest.get(apiUrlCollections(), async (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json([1, 2, 3]));
  }),

  rest.get(apiUrlCollectionById("*"), (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ pollutant_values: [{ time_geo: "Place and time" }] })
    );
  }),
];

const server = setupServer(...handlers);

export { server, rest, handlers };
