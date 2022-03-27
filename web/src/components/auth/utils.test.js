import { clearAuthTokenItem, getAuthTokenItem, setAuthTokenItem } from "./utils";

describe("login", () => {
    it.todo("should return a token on success");
    it.todo("should return an empty string on failure");
});

describe("logout", () => {
    it.todo("should return true on success");
    it.todo("should return false on failure");
})

describe("register", () => {
    it.todo("should return token on success");
    it.todo("should return empty string on failure");
})


describe("token local storage manipulation",() => {
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
        expect(authTokenItem).toBe('');
        expect(getItemSpy).toHaveBeenCalledWith("authToken");
    });

    it("should set the auth token in local storage", () => {
        const setItemSpy = jest.spyOn(localStorage, "setItem");
        setAuthTokenItem("fakeToken");
        expect(setItemSpy).toHaveBeenCalledWith("authToken", "fakeToken");
    });
})

