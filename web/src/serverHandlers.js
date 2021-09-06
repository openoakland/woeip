import { rest } from "msw";
import { setupServer } from "msw/node";
import { apiUrlCollections } from "../src/api.util";

const handlers = [
  rest.get(apiUrlCollections(), async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([1, 2, 3]));
  }),
];

const server = setupServer(...handlers);

export { server, rest, handlers };
