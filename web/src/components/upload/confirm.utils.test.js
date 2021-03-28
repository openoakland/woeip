import { getFilesForm } from "./confirm.utils";
import moment from "moment-timezone";

describe("getFilesForm", () => {
  it("should construct a valid files form", () => {
    const firstFile = new File(["hello"], "hello.csv", { type: "text/csv" });
    const secondFile = new File(["goodbye"], "goodbye.log", {
      type: "text/log",
    });

    const dustrakStart = moment();
    const dustrakEnd = moment();
    const filesForm = getFilesForm({
      firstFile,
      secondFile,
      dustrakStart,
      dustrakEnd,
    });
    expect(filesForm.getAll("upload_files")).toHaveLength(2);
    expect(filesForm.get("starts_at")).toEqual(dustrakStart.format());
    expect(filesForm.get("ends_at")).toEqual(dustrakEnd.format());
    expect(filesForm.get("pollutant")).toEqual("1");
  });
});
