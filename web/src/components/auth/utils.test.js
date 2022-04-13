import { server, rest } from "../../serverHandlers";
import {
  clearAuthTokenItem,
  getAuthTokenItem,
  login,
  logout,
  register,
  setAuthTokenItem,
} from "./utils";
import {
  apiUrlAuthLogin,
  apiUrlAuthLogout,
  apiUrlAuthRegister,
} from "../../api.util";

describe("login", () => {
  it("should return a token on success", async () => {
    server.use(
      rest.post(apiUrlAuthLogin(), (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ key: "fakeToken" }));
      })
    );
    const { token } = await login("user@place.com", "password");
    expect(token).toBe("fakeToken");
  });

  it("should return an empty string on failure", async () => {
    server.use(
      rest.post(apiUrlAuthLogin(), (_req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    const { token } = await login("user@place.com", "password");
    expect(token).toBe("");
  });
});

describe("logout", () => {
  it("should return true on success", async () => {
    server.use(
      rest.post(apiUrlAuthLogout(), (_req, res, ctx) => {
        return res(ctx.status(200));
      })
    );
    const { succeeded } = await logout("fakeToken");
    expect(succeeded).toBe(true);
  });

  it("should return false on failure", async () => {
    server.use(
      rest.post(apiUrlAuthLogout(), (_req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    const { succeeded } = await logout("fakeToken");
    expect(succeeded).toBe(false);
  });
});

describe("register", () => {
  it("should return token on success", async () => {
    server.use(
      rest.post(apiUrlAuthRegister(), (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ key: "fakeToken" }));
      })
    );

    const { token } = await register("user@place.com", "password", "password");
    expect(token).toBe("fakeToken");
  });

  it("should return empty string on failure", async () => {
    server.use(
      rest.post(apiUrlAuthRegister(), (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    const { token } = await register();
    expect(token).toBe("");
  });
});

describe("token local storage manipulation", () => {
  beforeEach(() => {
    const fakeLocalStorage = (function () {
      let store = {};

      return {
        getItem: function (key) {
          return store[key] || null;
        },
        setItem: function (key, value) {
          store[key] = value.toString();
        },
        removeItem: function (key) {
          delete store[key];
        },
        clear: function () {
          store = {};
        },
      };
    })();

    Object.defineProperty(window, "localStorage", {
      value: fakeLocalStorage,
    });
  });

  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it("should remove auth token from local storage", () => {
    const removeItemSpy = jest.spyOn(localStorage, "removeItem");
    clearAuthTokenItem();
    expect(removeItemSpy).toHaveBeenCalledWith("authToken");
  });

  it("should retrieve an auth token from local storage", () => {
    const getItemSpy = jest.spyOn(localStorage, "getItem");
    const authTokenItem = getAuthTokenItem();
    expect(authTokenItem).toBe("");
    expect(getItemSpy).toHaveBeenCalledWith("authToken");
  });

  it("should set the auth token in local storage", () => {
    const setItemSpy = jest.spyOn(localStorage, "setItem");
    setAuthTokenItem("fakeToken");
    expect(setItemSpy).toHaveBeenCalledWith("authToken", "fakeToken");
  });
});
