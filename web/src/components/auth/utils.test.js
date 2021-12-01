import axios from "axios";
import { login, register, verify, checkAuthenticated, loadUser, logout } from "./utils";
import { apiUrlCreateJWTToken, apiUrlVerifyToken, apiUrlLoadUser, apiUrlRegister, apiUrlVerifyActivation } from "../../api.util";
import { rest, server } from "../../serverHandlers";


describe("logs out the user", () => {
  it("should successfully log-out",  () => {
    let access = localStorage.setItem("access", "test");
    logout();
    access = localStorage.getItem("access");
    expect(access).toEqual(null);
  });
});

describe("logs in the user", () => {
  it("should successfully log-in",   async () => {
    server.use(
      rest.post(apiUrlVerifyToken(), (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            code: "valid_token",
          }),
        )
      })
    );

    const authenticated = await checkAuthenticated("token");
    expect(authenticated).toEqual(true);

    server.use(
      rest.post(apiUrlCreateJWTToken(), (req, res, ctx) => {
        sessionStorage.setItem("access", "true");
        return res(
          ctx.status(200),
          ctx.json({
            access: "access_token",
          }),
        )
      })
    );

    server.use(
      rest.get(apiUrlLoadUser(), (req, res, ctx) => {
        return res(
          ctx.status(200)
        )
      })
    );

    await loadUser("token");

    const user = await login("email", "password");
    expect(user).toBe(true);
  });
});

describe("registers the user", () => {
  it("should successfully register",   async () => {
    const body = {
      email: "email",
      first_name: "first_name",
      last_name: "last_name",
      password: "password",
      re_password: "re_password"
    };

    server.use(
      rest.post(apiUrlRegister(), (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            email: body.email,
            first_name: body.first_name,
            last_name: body.last_name
          })
        )
      })
    );

    const user = await register(body.first_name, body.last_name, body.email, body.password, body.re_password);
    expect(user.success.email).toEqual(body.email);
    expect(user.success.first_name).toEqual(body.first_name);
    expect(user.success.last_name).toEqual(body.last_name);
  });
});

describe("verifies the user", () => {
  it("should successfully verify",   async () => {
    server.use(
      rest.post(apiUrlVerifyActivation(), (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            email: "email"
          })
        );
      })
    );
    const user = await verify("uid", "token");
    expect(user.success.email).toEqual("email");
  });
});
