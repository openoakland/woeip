import {
  apiUrl,
  apiUrlCollectionById,
  apiUrlCollections,
} from "../../api.util";
import {
  BLANK_ACTIVE_COLLECTION,
  comparePollutantValues,
  getCollectionFileByLink,
  getCollections,
  getCollectionsOnDate,
  getAllDates,
  getFirstCollection,
  getPollutantsByCollectionId,
  getThrownCode,
  mergePollutants,
  parsePollutant,
  parsePollutants,
  spatializePollutants,
  THROWN_CODE,
} from "./utils";
import axios from "axios";
import moment from "moment-timezone";
import { server, rest, testData } from "../../serverHandlers";

describe("get a list of dates with at least one collection", () => {
  it("should successfully receive a list of dates from the api", async () => {
    const { listOfDates, thrownCode } = await getAllDates(
      axios.CancelToken.source()
    );
    expect(listOfDates).toEqual(testData['collectionDates'])
  });
});

describe("get collections from a specific date", () => {
  it("should successfully receive a list of collections from the data", async () => {
    const { collectionsOnDate, thrownCode } = await getCollectionsOnDate(
      moment(),
      axios.CancelToken.source()
    );
    expect(collectionsOnDate).toEqual(testData['collections']);
    expect(thrownCode).toEqual(THROWN_CODE.NONE);
  });
});

describe("get any data from the collections table", () => {
  const collectionsFns = {
    getCollections: {
      fn: getCollections,
      args: [{}], // args: params (and cancelTokenSource)
      dataKey: "collections" // returned object has key "collections" (and "thrownCode")
    },
    getCollectionsOnDate: {
      fn: getCollectionsOnDate,
      args: [moment()], // args: formattedDate (and cancelTokenSource)
      dataKey: "collectionsOnDate" // returned object has key "collectionsOnDate" (and "thrownCode")
    },
    getAllDates: {
      fn: getAllDates,
      args: [], // args: none except cancelTokenSource
      dataKey: "listOfDates" // returned object has key "listOfDates" (and "thrownCode")
    }
  };
  for (let fnName in collectionsFns) {
    const fn = collectionsFns[fnName].fn;
    const args = collectionsFns[fnName].args;
    const dataKey = collectionsFns[fnName].dataKey;

    it(`should handle corrupt data response in ${fnName}`, async () => {
      server.use(
        rest.get(apiUrlCollections(), (_req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        })
      );
      const returned = await fn(
        ...args,
        axios.CancelToken.source()
      );
      expect(returned[dataKey]).toEqual([]);
      expect(returned["thrownCode"]).toEqual(THROWN_CODE.FAILED);
    });

    it(`should handle error responses in ${fnName}`, async () => {
      server.use(
        rest.get(apiUrlCollections(), (_req, res, ctx) => {
          return res(ctx.status(503));
        })
      );

      const returned = await fn(
        ...args,
        axios.CancelToken.source()
      );
      expect(returned[dataKey]).toEqual([]);
      expect(returned["thrownCode"]).toEqual(THROWN_CODE.FAILED);
    });

    it(`should handle network error in ${fnName}`, async () => {
      server.use(
        rest.get(apiUrlCollections(), (_req, res, _ctx) => res.networkError())
      );

      const returned = await fn(
        ...args,
        axios.CancelToken.source()
      );
      expect(returned[dataKey]).toEqual([]);
      expect(returned["thrownCode"]).toEqual(THROWN_CODE.FAILED);
    });

    it(`should handle canceling a request in ${fnName}`, async () => {
      const cancelTokenSource = axios.CancelToken.source();
      cancelTokenSource.cancel();
      const returned = await fn(
        ...args,
        cancelTokenSource
      );
      expect(returned[dataKey]).toEqual([]);
      expect(returned["thrownCode"]).toEqual(THROWN_CODE.CANCELED);
    });
  };
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
  it("should return a 'canceled' code when caused by canceling", async () => {
    let thrownCode;
    const source = axios.CancelToken.source();
    source.cancel();
    server.use(rest.get("/"), (req, res, ctx) => {
      return res(ctx.status(200));
    });
    try {
      await axios.get("/", { cancelToken: source.token });
    } catch (thrown) {
      thrownCode = getThrownCode(thrown);
    }
    expect(thrownCode).toEqual(THROWN_CODE.CANCELED);
  });

  it("should return a 'failed' code when unrelated to canceling", () => {
    let thrownCode;
    try {
      throw new Error("failed");
    } catch (thrown) {
      thrownCode = getThrownCode(thrown);
    }
    expect(thrownCode).toEqual(THROWN_CODE.FAILED);
  });
});

describe("get first collection from a list of collections", () => {
  it("should get the only collection in a list of one", () => {
    const inputCollections = [
      {
        id: 1,
        starts_at: "2014-07-17T19:40:35Z",
        ends_at: "2014-07-17T20:33:35Z",
        collection_files: [
          "http://api.lvh.me/collection_files/2",
          "http://api.lvh.me/collection_files/1",
        ],
      },
    ];
    expect(getFirstCollection(inputCollections)).toStrictEqual(
      inputCollections[0]
    );
  });

  it("should get the first collection in a list of two", () => {
    const inputCollections = [
      {
        id: 1,
        starts_at: "2014-07-17T19:40:35Z",
        ends_at: "2014-07-17T20:33:35Z",
        collection_files: [
          "http://api.lvh.me/collection_files/2",
          "http://api.lvh.me/collection_files/1",
        ],
      },
      {
        id: 8,
        starts_at: "2014-07-17T19:40:35Z",
        ends_at: "2014-07-17T20:33:35Z",
        collection_files: [
          "http://api.lvh.me/collection_files/12",
          "http://api.lvh.me/collection_files/11",
        ],
      },
    ];

    expect(getFirstCollection(inputCollections)).toStrictEqual(
      inputCollections[1]
    );
  });

  it("should return the blank collection in an empty list", () =>
    expect(getFirstCollection([])).toStrictEqual(BLANK_ACTIVE_COLLECTION));

  it("should return the blank collection in an undefined list", () =>
    expect(getFirstCollection(undefined)).toStrictEqual(
      BLANK_ACTIVE_COLLECTION
    ));
});

describe("spatializePollutants", () => {
  it("should format the pollutant readings as into geojson", () => {
    const pollutants = [
      {
        value: "0.05",
        latitude: "1.5",
        longitude: "2.7",
      },
    ];
    const spatializedPollutants = spatializePollutants(pollutants);
    expect(spatializedPollutants.type).toEqual("FeatureCollection");
    expect(spatializedPollutants.features[0].type).toEqual("Feature");
    expect(spatializedPollutants.features[0].properties.value).toEqual(
      pollutants[0].value
    );
    expect(spatializedPollutants.features[0].geometry.type).toEqual("Point");
    expect(spatializedPollutants.features[0].geometry.coordinates[0]).toEqual(
      pollutants[0].longitude
    );
    expect(spatializedPollutants.features[0].geometry.coordinates[1]).toEqual(
      pollutants[0].latitude
    );
  });

  it("should handle an empty pollutants array", () => {
    const pollutants = [];
    const spatializedPollutants = spatializePollutants(pollutants);
    expect(spatializedPollutants.type).toEqual("FeatureCollection");
    expect(spatializedPollutants.features).toHaveLength(0);
  });
});

describe("mergePollutants", () => {
  const pollutantOne = {
    id: 1, //id field only exists in test data
    latitude: 1,
    longitude: 2,
    value: 0.1,
  };

  const pollutantTwo = {
    id: 2, //id field only exists in test data
    latitude: 1,
    longitude: 2,
    value: 0.2,
  };

  const pollutantThree = {
    id: 3, //id field only exists in test data
    latitude: 2,
    longitude: 1,
    value: 0.2,
  };

  const pollutantFour = {
    id: 4, //id field only exists in test data
    latitude: 1,
    longitude: 2,
    value: 0.2,
  };

  it("should merge pollutants at the same location, keeping the higher valued pollutant", () => {
    const merged = mergePollutants([
      pollutantOne,
      pollutantTwo,
      pollutantThree,
    ]);
    expect(merged).toHaveLength(2);
    expect(merged[0].id).toEqual(2);
    expect(merged[1].id).toEqual(3);
  });

  it("should return the later pollutant reading when two values are equal", () => {
    const merged = mergePollutants([pollutantOne, pollutantTwo, pollutantFour]);
    expect(merged).toHaveLength(1);
    expect(merged[0].id).toEqual(4);
  });
});

describe("comparePollutants", () => {
  const pollutantOne = {
    id: 1, //id field only exists in test data
    latitude: 1,
    longitude: 2,
    value: 0.1,
  };

  const pollutantTwo = {
    id: 2, //id field only exists in test data
    latitude: 1,
    longitude: 2,
    value: 0.2,
  };

  it("should keep the pollutant with the higher reading", () => {
    const higher = comparePollutantValues(pollutantOne, pollutantTwo);
    expect(higher).toEqual(pollutantTwo);
  });

  it("should handle when the first reading is undefined", () => {
    const higher = comparePollutantValues(undefined, pollutantOne);
    expect(higher).toEqual(pollutantOne);
  });
});
