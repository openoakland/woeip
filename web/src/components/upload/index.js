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
  // Place the device in the react state.
  // This is because we the treat device as something that may change and needs to be accessed across the component.
  // Default to empty object
  const [device, setDevice] = useState({})
  // Remove the whole list of devices from state
  // because we're really only interested in one device.
  // We can relegate it to an intermediate variable that we only access within `useEffect`

  useEffect(() => {
    (async () => {
      try {
        // convention is to use plural to represent lists 
        const devices= await getDevices();
        // Placing 'setDevice' within useEffect will allow us to reliably update the state of 'device', 
        // if the device list changes
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
          // The next feature we will want is to save the device to the database
          // This feature will require access to the device id, as well.
          // In which case, we should pass the entire device object
          device={device}
          files={files}
          dustrakStart={dustrakStart}
          dustrakEnd={dustrakEnd}
          // Removed the dustrakSerial variable.
          // It is no longer need to pass dustrak serial to confirmation page
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
