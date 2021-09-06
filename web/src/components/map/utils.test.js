import { apiUrlCollections } from "../../api.util";
import { getCollectionsOnDate } from "./utils";
import axios from "axios";
import moment from "moment-timezone";
import { server, rest } from "../../serverHandlers";

describe("get collections from a specific date", () => {
  it("should successfully receive a list of collections from the data", async () => {
    const { collectionsOnDate, errorMessage } = await getCollectionsOnDate(
      moment(),
      axios.CancelToken.source()
    );
    expect(collectionsOnDate).toEqual([1, 2, 3]);
    expect(errorMessage).toEqual("");
  });

  it("should handle corrupt data response", async () => {
    server.use(
      rest.get(apiUrlCollections(), (_req, res, ctx) => {
        return res(ctx.status(200));
      })
    );
    const { collectionsOnDate, errorMessage } = await getCollectionsOnDate(
      moment(),
      axios.CancelToken.source()
    );
    expect(collectionsOnDate).toEqual([]);
    expect(errorMessage).toMatch("Failed to get collections");
  });

  it("should handle error responses", async () => {
    server.use(
      rest.get(apiUrlCollections(), (_req, res, ctx) => {
        return res(ctx.status(503));
      })
    );

    const { collectionsOnDate, errorMessage } = await getCollectionsOnDate(
      moment(),
      axios.CancelToken.source()
    );
    expect(collectionsOnDate).toEqual([]);
    expect(errorMessage).toMatch("Error in server response");
  });

  it("should handle network error", async () => {
    server.use(
      rest.get(apiUrlCollections(), (_req, res, _ctx) => res.networkError())
    );

    const { collectionsOnDate, errorMessage } = await getCollectionsOnDate(
      moment(),
      axios.CancelToken.source()
    );
    expect(collectionsOnDate).toEqual([]);
    expect(errorMessage).toMatch("Error in network request");
  });
});
