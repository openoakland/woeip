import { rest } from "msw";
import { setupServer } from "msw/node";
import { apiUrlCollections, apiUrlCollectionById } from "../src/api.util";

// make sure to change collectionDates if you change collections
export const testData = {
  collections: [
    {
      id: 1,
      starts_at: "2022-01-01T12:34:56Z",
      ends_at: "2022-01-01T15:43:21Z",
      collection_files: [
        "http://api.fake.site/collection_files/1",
        "http://api.fake.site/collection_files/2",
      ],
    },
    {
      id: 2,
      starts_at: "2022-01-02T12:34:56Z",
      ends_at: "2022-01-02T15:43:21Z",
      collection_files: [
        "http://api.fake.site/collection_files/3",
        "http://api.fake.site/collection_files/4",
      ],
    },
    {
      id: 3,
      starts_at: "2022-01-19T12:34:56Z",
      ends_at: "2022-01-19T15:43:21Z",
      collection_files: [
        "http://api.fake.site/collection_files/5",
        "http://api.fake.site/collection_files/6",
      ],
    },
  ],
  collectionDates: ["2022-01-01", "2022-01-02", "2022-01-19"],
};

const handlers = [
  rest.get(apiUrlCollections(), async (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(testData["collections"]));
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
