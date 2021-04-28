import { useState, useEffect } from "react";
import moment from "moment-timezone";

import { UploadDrop } from "./drop";
import { UploadConfirm } from "./confirm";
import { Container } from "../ui";
import { getDevices } from "./drop.utils";

export const Upload = () => {
  const [files, setFiles] = useState([]);
  const [phase, setPhase] = useState("drop"); //"drop" or "confirm" page
  const [dustrakStart, setDustrakStart] = useState(moment(""));
  const [dustrakEnd, setDustrakEnd] = useState(moment(""));
  const [dustrakSerial, setDustrakSerial] = useState("");
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const deviceList = await getDevices();
        setDevices(deviceList);
      } catch(err) {
        console.error(err);
      }
    })()
  }, [devices]);

  const matchedDevice = devices.filter(device => device.serial === dustrakSerial);
  const deviceName = matchedDevice.length ? matchedDevice[0] : null;

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
          dustrakSerialToLabel={deviceName}
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
