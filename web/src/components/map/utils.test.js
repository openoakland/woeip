import { apiUrlCollections } from "../../api.util";
import { getCollectionsOnDate } from "./utils";
import axios from "axios";
import moment from "moment-timezone";
import { server, rest } from "../../serverHandlers";

describe("get collections from a specific date", () => {
  it.only("should successfully receive a list of collections from the data", async () => {
    const {collectionsOnDate, errorMessage} = await getCollectionsOnDate(
      moment(),
      axios.CancelToken.source()
    );
    expect(collectionsOnDate).toEqual([1, 2, 3]);
    expect(errorMessage).toEqual('');
  });

  it("should handle corrupt data response", async () => {
    server.use(
      rest.get(apiUrlCollections(), (req, res, ctx) => {
        return res(ctx.status(200));
      })
    );
    const {collectionsOnDate, errorMessage } = await getCollectionsOnDate(
      moment(),
      axios.CancelToken.source()
    );
    expect(collectionsOnDate).toEqual([]);
    expect(errorMessage).toMatch('Failed to get collections');
  });

  it.todo("should handle error responses");
  it.todo("should handle network error");
  it.todo("");
});
