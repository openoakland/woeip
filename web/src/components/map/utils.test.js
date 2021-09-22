import {
  apiUrl,
  apiUrlCollectionById,
  apiUrlCollections,
} from "../../api.util";
import {
  getCollectionFileByLink,
  getCollectionsOnDate,
  getPollutantsByCollectionId,
  parsePollutant,
  parsePollutants,
  THROWN_CODE,
} from "./utils";
import axios from "axios";
import moment from "moment-timezone";
import { server, rest } from "../../serverHandlers";

describe("get collections from a specific date", () => {
  it("should successfully receive a list of collections from the data", async () => {
    const { collectionsOnDate, thrownCode } = await getCollectionsOnDate(
      moment(),
      axios.CancelToken.source()
    );
    expect(collectionsOnDate).toEqual([1, 2, 3]);
    expect(thrownCode).toEqual(THROWN_CODE.NONE);
  });

  it("should handle corrupt data response", async () => {
    server.use(
      rest.get(apiUrlCollections(), (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      })
    );
    const { collectionsOnDate, thrownCode } = await getCollectionsOnDate(
      moment(),
      axios.CancelToken.source()
    );
    expect(collectionsOnDate).toEqual([]);
    expect(thrownCode).toEqual(THROWN_CODE.FAILED);
  });

  it("should handle error responses", async () => {
    server.use(
      rest.get(apiUrlCollections(), (_req, res, ctx) => {
        return res(ctx.status(503));
      })
    );

    const { collectionsOnDate, thrownCode } = await getCollectionsOnDate(
      moment(),
      axios.CancelToken.source()
    );
    expect(collectionsOnDate).toEqual([]);
    expect(thrownCode).toEqual(THROWN_CODE.FAILED);
  });

  it("should handle network error", async () => {
    server.use(
      rest.get(apiUrlCollections(), (_req, res, _ctx) => res.networkError())
    );

    const { collectionsOnDate, thrownCode } = await getCollectionsOnDate(
      moment(),
      axios.CancelToken.source()
    );
    expect(collectionsOnDate).toEqual([]);
    expect(thrownCode).toEqual(THROWN_CODE.FAILED);
  });

  it("should handle canceling a request", async () => {
    const cancelTokenSource = axios.CancelToken.source();
    cancelTokenSource.cancel();
    const { collectionsOnDate, thrownCode } = await getCollectionsOnDate(
      moment(),
      cancelTokenSource
    );
    expect(collectionsOnDate).toEqual([]);
    expect(thrownCode).toEqual(THROWN_CODE.CANCELED);
  });
});

describe("get pollutants for a specific collection", () => {
  it("should successfully receive pollutants", async () => {
    const { pollutants, thrownCode } = await getPollutantsByCollectionId(
      1,
      axios.CancelToken.source()
    );
    expect(pollutants.pollutant_values).toEqual([
      { time_geo: "Place and time" },
    ]);
    expect(thrownCode).toEqual(THROWN_CODE.NONE);
  });

  it("should handle response with corrupt data", async () => {
    server.use(
      rest.get(apiUrlCollectionById("*"), (_req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    const { pollutants, thrownCode } = await getPollutantsByCollectionId(
      0,
      axios.CancelToken.source()
    );
    expect(pollutants).toEqual({});
    expect(thrownCode).toEqual(THROWN_CODE.FAILED);
  });

  it("should handle server response error", async () => {
    server.use(
      rest.get(apiUrlCollectionById("*"), (_req, res, ctx) => {
        return res(ctx.status(503));
      })
    );

    const { pollutants, thrownCode } = await getPollutantsByCollectionId(
      0,
      axios.CancelToken.source()
    );
    expect(pollutants).toEqual({});
    expect(thrownCode).toEqual(THROWN_CODE.FAILED);
  });

  it("should handle network request error", async () => {
    server.use(
      rest.get(apiUrlCollectionById("*"), (_req, res, _ctx) =>
        res.networkError()
      )
    );

    const { pollutants, thrownCode } = await getPollutantsByCollectionId(
      0,
      axios.CancelToken.source()
    );
    expect(pollutants).toEqual({});
    expect(thrownCode).toEqual(THROWN_CODE.FAILED);
  });

  it("should handle canceling a request", async () => {
    const cancelTokenSource = axios.CancelToken.source();
    cancelTokenSource.cancel();
    const { pollutants, thrownCode } = await getPollutantsByCollectionId(
      0,
      cancelTokenSource
    );
    expect(pollutants).toEqual({});
    expect(thrownCode).toEqual(THROWN_CODE.CANCELED);
  });
});

describe("parse a list of pollutants", () => {
  it("should return a list of two properly parsed pollutants", () => {
    const firstInputPollutant = {
      pollutant: "particulates",
      time_geo: "2014-07-17 19:40:36 (-122.29460333333333, 37.803158333333336)",
      value: 0.008,
    };

    const firstOutputPollutant = {
      timestamp: "2014-07-17 19:40:36",
      longitude: -122.29460333333333,
      latitude: 37.803158333333336,
      name: "particulates",
      value: 0.008,
    };

    const secondInputPollutant = {
      pollutant: "particulates",
      time_geo: "2014-07-17 19:40:37 (-122.29460333333555, 37.744458333333336)",
      value: 0.009,
    };

    const secondOutputPollutant = {
      timestamp: "2014-07-17 19:40:37",
      longitude: -122.29460333333555,
      latitude: 37.744458333333336,
      name: "particulates",
      value: 0.009,
    };

    const inputPollutantValues = {
      pollutant_values: [firstInputPollutant, secondInputPollutant],
    };
    const outputPollutantValues = parsePollutants(inputPollutantValues);
    expect(outputPollutantValues[0]).toStrictEqual(firstOutputPollutant);
    expect(outputPollutantValues[1]).toStrictEqual(secondOutputPollutant);
  });

  it("should return an empty list when source data are undefined", () =>
    expect(parsePollutants(undefined)).toEqual([]));
});

describe("parse each pollutant", () => {
  it("should return a properly parsed pollutant", () => {
    const inputPollutant = {
      pollutant: "particulates",
      time_geo: "2014-07-17 19:40:36 (-122.29460333333333, 37.803158333333336)",
      value: 0.008,
    };

    const outputPollutant = {
      timestamp: "2014-07-17 19:40:36",
      longitude: -122.29460333333333,
      latitude: 37.803158333333336,
      name: "particulates",
      value: 0.008,
    };

    expect(parsePollutant(inputPollutant)).toStrictEqual(outputPollutant);
  });

  it("should return from a malformed pollutant", () =>
    expect(parsePollutant({})).toStrictEqual({
      timestamp: undefined,
      longitude: undefined,
      latitude: undefined,
      name: undefined,
      value: undefined,
    }));

  it("should return from an undefined pollutant", () =>
    expect(parsePollutant(undefined)).toStrictEqual({
      timestamp: undefined,
      longitude: undefined,
      latitude: undefined,
      name: undefined,
      value: undefined,
    }));
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
    const { file, thrownCode } = await getCollectionFileByLink(
      fileLink,
      axios.CancelToken.source()
    );
    expect(file).toEqual(fileFoo);
    expect(thrownCode).toEqual(THROWN_CODE.NONE);
  });

  it("should handle response with corrupt data", async () => {
    const fileLink = apiUrl("link/to/file");
    server.use(
      rest.get(fileLink, (req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    const { file, thrownCode } = await getCollectionFileByLink(
      fileLink,
      axios.CancelToken.source()
    );
    expect(file).toBe(null);
    expect(thrownCode).toEqual(THROWN_CODE.FAILED);
  });

  it("should handle server response error", async () => {
    const fileLink = apiUrl("link/to/file");
    server.use(
      rest.get(fileLink, (req, res, ctx) => {
        return res(ctx.status(503));
      })
    );

    const { file, thrownCode } = await getCollectionFileByLink(
      fileLink,
      axios.CancelToken.source()
    );
    expect(file).toBe(null);
    expect(thrownCode).toEqual(THROWN_CODE.FAILED);
  });

  it("should handle network request error", async () => {
    const fileLink = apiUrl("link/to/file");
    server.use(rest.get(fileLink, (req, res, ctx) => res.networkError()));
    const { file, thrownCode } = await getCollectionFileByLink(
      fileLink,
      axios.CancelToken.source()
    );
    expect(file).toBe(null);
    expect(thrownCode).toEqual(THROWN_CODE.FAILED);
  });

  it("should handle canceling a request", async () => {
    const source = axios.CancelToken.source();
    source.cancel();

    const fileLink = apiUrl("link/to/file");
    server.use(
      rest.get(fileLink, (req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    const { file, thrownCode } = await getCollectionFileByLink(
      fileLink,
      source
    );
    expect(file).toBe(null);
    expect(thrownCode).toEqual(THROWN_CODE.CANCELED);
  });
});

describe("get the code associated with a thrown value on api call", () => {
  it.todo("should return a 'canceled' code when caused by canceling");

  it.todo("should return a 'failed' code when unrelated to canceling");
});

describe("get first collection from a list of collections", () => {
  it.todo("should get the only collection in a list of one");

  it.todo("should get the first collection in a list of two");

  it.todo("should return the blank collection in an empty list");

  it.todo("should return the blank collection in an undefined list");
});
