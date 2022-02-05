import { useState, useEffect } from "react";
import moment from "moment-timezone";

import { UploadDrop } from "./drop";
import { UploadConfirm } from "./confirm";
import { Container } from "../ui";
import { findDevice, getDevices } from "./utils";
import { getAccessToken } from "../auth/utils";

export const Upload = () => {
  const [files, setFiles] = useState([]);
  const [phase, setPhase] = useState("drop"); //"drop" or "confirm" page
  const [dustrakStart, setDustrakStart] = useState(moment(""));
  const [dustrakEnd, setDustrakEnd] = useState(moment(""));
  const [dustrakSerial, setDustrakSerial] = useState("");
  const [device, setDevice] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const devices = await getDevices(getAccessToken());
        setDevice(findDevice(devices, dustrakSerial));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [dustrakSerial]);

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
          device={device}
          files={files}
          dustrakStart={dustrakStart}
          dustrakEnd={dustrakEnd}
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
