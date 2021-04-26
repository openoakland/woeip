import { useState } from "react";
import moment from "moment-timezone";

import { UploadDrop } from "./drop";
import { UploadConfirm } from "./confirm";
import { Container } from "../ui";

export const Upload = () => {
  const [files, setFiles] = useState([]);
  const [phase, setPhase] = useState("drop"); //"drop" or "confirm" page
  const [dustrakStart, setDustrakStart] = useState(moment(""));
  const [dustrakEnd, setDustrakEnd] = useState(moment(""));
  const [dustrakSerial, setDustrakSerial] = useState("");

  /**
   * Map of each dustrak serial number to its label
   */
  const dustrakSerialToLabel = {
    8530091203: "Device A",
    8530094612: "Device B",
    8530100707: "Device C",
  };

  return (
    <Container>
      {phase === "drop" && (
        <UploadDrop
          files={files}
          setFiles={setFiles}
          proceedToConfirm={() => setPhase("confirm")}
          setDustrakStart={setDustrakStart}
          setDustrakEnd={setDustrakEnd}
          setDustrakSerial={setDustrakSerial}
        />
      )}
      {phase === "confirm" && (
        <UploadConfirm
          dustrakSerialToLabel={dustrakSerialToLabel}
          files={files}
          dustrakStart={dustrakStart}
          dustrakEnd={dustrakEnd}
          dustrakSerial={dustrakSerial}
          clearFiles={() => setFiles([])}
          clearDustrakTimes={() => {
            setDustrakStart(moment(""));
            setDustrakEnd(moment(""));
          }}
          clearDustrakSerial={() => setDustrakSerial("")}
          returnToDrop={() => setPhase("drop")}
        />
      )}
    </Container>
  );
};
