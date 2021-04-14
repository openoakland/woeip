Feature("CodeceptJS demo");

Scenario("check Welcome page on site", ({ I }) => {
  I.amOnPage("/");
  I.see("Welcome to West Oakland Air Quality!");
});
