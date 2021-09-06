import { apiUrlCollections } from "../../api.util";
import { getCollectionsOnDate } from "./utils";
import axios from "axios";
import moment from "moment-timezone";
import { server, rest } from "../../serverHandlers";

describe("get collections from a specific date", () => {
  it("should successfully receive a list of collections from the data", async () => {
    const response = await getCollectionsOnDate(
      moment(),
      axios.CancelToken.source()
    );
    expect(response.data).toEqual([1, 2, 3]);
  });
  it.only("should handle corrupt data response", async () => {
    server.use(
      rest.get(apiUrlCollections(), (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      })
    );
    const response = await getCollectionsOnDate(
      moment(),
      axios.CancelToken.source()
    );
    expect(response.data).toBeUndefined();
  });
  it.todo("should handle error responses");
  it.todo("should handle network error");
  it.todo("");
});
