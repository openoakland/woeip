import {
  apiUrl,
  apiUrlCollectionById,
  apiUrlCollections,
} from "../../api.util";
import {
  getCollectionFileByLink,
  getCollectionsOnDate,
  getPollutantsByCollectionId,
  THROWN_CODE,
} from "./utils";
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

  it("should handle canceling a request", async () => {
    const cancelTokenSource = axios.CancelToken.source();
    cancelTokenSource.cancel();
    const { collectionsOnDate, errorMessage } = await getCollectionsOnDate(
      moment(),
      cancelTokenSource
    );
    expect(collectionsOnDate).toEqual([]);
    expect(errorMessage).toMatch("Canceled");
  });
});

describe("get pollutants for a specific collection", () => {
  it("should successfully receive pollutants", async () => {
    const { pollutants, thrownCode } = await getPollutantsByCollectionId(
      1,
      axios.CancelToken.source()
    );
    expect(pollutants.pollutant_values).toEqual([{ time_geo: "Place and time" }]);
    expect(thrownCode).toEqual(THROWN_CODE.NONE);
  });

  it("should handle response with corrupt data", async () => {
    server.use(
      rest.get(apiUrlCollectionById("*"), (_req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    const {
      pollutants,
      thrownCode,
    } = await getPollutantsByCollectionId(0, axios.CancelToken.source());
    expect(pollutants).toEqual({});
    expect(thrownCode).toEqual(THROWN_CODE.FAILED);
  });

  it("should handle server response error", async () => {
    server.use(
      rest.get(apiUrlCollectionById("*"), (_req, res, ctx) => {
        return res(ctx.status(503));
      })
    );

    const {
      pollutants,
      thrownCode,
    } = await getPollutantsByCollectionId(0, axios.CancelToken.source());
    expect(pollutants).toEqual({});
    expect(thrownCode).toEqual(THROWN_CODE.FAILED);
  });

  it("should handle network request error", async () => {
    server.use(
      rest.get(apiUrlCollectionById("*"), (_req, res, _ctx) =>
        res.networkError()
      )
    );

    const {
      pollutants,
      thrownCode,
    } = await getPollutantsByCollectionId(0, axios.CancelToken.source());
    expect(pollutants).toEqual({});
    expect(thrownCode).toEqual(THROWN_CODE.FAILED);
  });

  it("should handle canceling a request", async () => {
    const cancelTokenSource = axios.CancelToken.source();
    cancelTokenSource.cancel();
    const {
      pollutants,
      thrownCode,
    } = await getPollutantsByCollectionId(0, cancelTokenSource);
    expect(pollutants).toEqual({});
    expect(thrownCode).toEqual(THROWN_CODE.CANCELED);
  });
});

describe("get files for a specific collection", () => {
  it("should successfully receive files", async () => {
    const fileLink = apiUrl("/link/to/file");
    const fileFoo = new File(["foo"], "foo.csv", { type: "text/csv" });
    server.use(
      rest.get(fileLink, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.set("Content-Type", "text/csv"),
          ctx.body(fileFoo)
        );
      })
    );
    const { file, errorMessage } = await getCollectionFileByLink(fileLink);
    expect(file).toEqual(fileFoo);
    expect(errorMessage).toEqual("");
  });

  it("should handle response with corrupt data", async () => {
    const fileLink = apiUrl("link/to/file");
    server.use(
      rest.get(fileLink, (req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    const { file, errorMessage } = await getCollectionFileByLink(fileLink);
    expect(file).toBe(null);
    expect(errorMessage).toMatch("Failed to get file");
  });

  it("should handle server response error", async () => {
    const fileLink = apiUrl("link/to/file");
    server.use(
      rest.get(fileLink, (req, res, ctx) => {
        return res(ctx.status(503));
      })
    );

    const { file, errorMessage } = await getCollectionFileByLink(fileLink);
    expect(file).toBe(null);
    expect(errorMessage).toMatch("Error in server response");
  });

  it("should handle network request error", async () => {
    const fileLink = apiUrl("link/to/file");
    server.use(rest.get(fileLink, (req, res, ctx) => res.networkError()));
    const { file, errorMessage } = await getCollectionFileByLink(fileLink);
    expect(file).toBe(null);
    expect(errorMessage).toMatch("Error in network request");
  });
});
