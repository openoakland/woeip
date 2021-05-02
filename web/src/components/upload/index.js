import { useState, useEffect } from "react";
import moment from "moment-timezone";

import { UploadDrop } from "./drop";
import { UploadConfirm } from "./confirm";
import { Container } from "../ui";
import { findDevice, getDevices } from "./utils";

export const Upload = () => {
  const [files, setFiles] = useState([]);
  const [phase, setPhase] = useState("drop"); //"drop" or "confirm" page
  const [dustrakStart, setDustrakStart] = useState(moment(""));
  const [dustrakEnd, setDustrakEnd] = useState(moment(""));
  const [dustrakSerial, setDustrakSerial] = useState("");
  // TODO: Place the device in the react state.
  // This is because we the treat device as something that may change and needs to be accessed across the component.
  // Default to empty object
  const [device, setDevice] = useState({})
  // TODO: Remove the whole list of devices from state
  // Because we're really only interested in one device, 
  // we can relegate it to an intermediate variable that we only access within `useEffect`
  // const [devices, setDevices] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // TODO: rename
        // Convention is to use plural to represent lists 
        const devices= await getDevices();
        // TODO: Place it within the useEffect
        // This will allow us to reliably update the state of 'device', if the device list changes
        setDevice(findDevice(devices, dustrakSerial));
      } catch(err) {
        console.error(err);
      }
    })()
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
          // TODO: The next feature we will want is to save the device to the database
          // This feature will require access to the device id, as well.
          // In which case, we should pass the entire device object
          device={device}
          files={files}
          dustrakStart={dustrakStart}
          dustrakEnd={dustrakEnd}
          // TODO: Remove dustrakSerial variable
          // No longer need to pass dustrak serial to confirmation page
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
