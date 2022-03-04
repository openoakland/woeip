import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import moment from "moment-timezone";
import { PropTypes } from "prop-types";

import {
  Container,
  TrashButton,
  Segment,
  Header,
  LinkedHeader,
  Divider,
  WarningMessage,
  FileIcon,
  FlexRowCenterDiv,
  FlexColumnDiv,
  List,
} from "../ui";

import {
  messageForFileCount,
  messageForMissingFileType,
  messageForMismatchedTimes,
  messageForInvalidTime,
  identFiles,
  extractFileMetaContent,
  getDustrakStart,
  getGpsStart,
  getDustrakSerial,
  getDustrakEnd,
} from "./utils";

/**
 * @property {Array<File>} files Array of files uploaded by user
 * @property {function} setFiles Change the array of files
 * @property {function} proceedToConfirm Overload setPhase with 'confirm' value
 * @property {function} setDustrakStart To be used for display on the confirmation page and in session meta data
 * @property {function} setDustrakEnd To be used for display on the confirmation page and in session meta data
 * @property {function} setDustrakSerial To be used for display on the confirmation page
 */
export const UploadDrop = ({
  files,
  setFiles,
  setDustrakStart,
  setDustrakEnd,
  setDustrakSerial,
  proceedToConfirm,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);
    },
    multiple: true,
  });

  /**
   * Based on the files dropped into the app, check whether they're valid
   * Generate an error message if they are not
   * Exit the process as soon as an error situation is found
   * There are no error messages if there are no files
   * @modifies {errorMessage} sets a message specific to the situation
   * @modifies {dustrakStart} dustrak start time is used for user feedback on confirmation page
   * @modifies {dustrakEnd} dustrak end time is used for user feedback on confirmation page
   * @modifies {dustrakSerial} dustrak serial is used for user feedback on confirmation page
   */
  useEffect(() => {
    (async () => {
      /**
       * State must always be set in the same order
       * To satisfy this, we create default values that have the correct type for their associated states.
       * But the defualt values evaluate to falsy or invalid, to be handled by downstream logic
       * We can then always set state in the same order, with default or meaningful values
       */
      let potentialMessage = "";
      let potentialDustrakStart = moment("");
      let potentialDustrakEnd = moment("");
      let potentialDustrakSerial = "";
      const fileCount = files.length;
      if (fileCount > 0) {
        potentialMessage = messageForFileCount(fileCount);
        if (!potentialMessage) {
          const [gpsFile, dustrakFile] = identFiles(files);
          potentialMessage = messageForMissingFileType([gpsFile, dustrakFile]);

          if (!potentialMessage) {
            const [dustrakTextLines, gpsTextLines] = await Promise.all([
              extractFileMetaContent(dustrakFile),
              extractFileMetaContent(gpsFile),
            ]);
            const dustrakStart = getDustrakStart(dustrakTextLines);
            const dustrakEnd = getDustrakEnd(dustrakTextLines, dustrakStart);
            const gpsStart = getGpsStart(gpsTextLines);
            potentialMessage = messageForInvalidTime(
              dustrakStart,
              dustrakEnd,
              gpsStart
            );

            if (!potentialMessage) {
              potentialMessage = messageForMismatchedTimes(
                dustrakStart,
                gpsStart
              );
              /**
               * Pass the dustrak start and serial values to the variable meant to update their properties
               * At this point, values needed to grab dustrak data are initiated and likely have valid values
               * Even if the values are invalid, they are at least the correct type and can be handled by downstream logic
               */
              potentialDustrakStart = dustrakStart;
              potentialDustrakEnd = dustrakEnd;
              potentialDustrakSerial = getDustrakSerial(dustrakTextLines);
            }
          }
        }
      }
      setErrorMessage(potentialMessage);
      setDustrakStart(potentialDustrakStart);
      setDustrakEnd(potentialDustrakEnd);
      setDustrakSerial(potentialDustrakSerial);
    })();
  }, [
    files,
    setErrorMessage,
    setDustrakStart,
    setDustrakEnd,
    setDustrakSerial,
  ]);

  /**
   * When the user has upload two valid files, change to the confirmation page
   * @modifies {prop} sets parent property of "phase" to value of "confirm"
   */
  useEffect(() => {
    (files.length === 2) & !errorMessage && proceedToConfirm();
  }, [files, errorMessage, proceedToConfirm]);

  /**
   * Remove a file from the list by its index
   * @param {ClickEvent} event interest in the data-args property as it holds the index
   * @modifies {Array<FileWithPath>} removes the desired file
   */
  const removeFile = (event) => {
    // convert string data arg to number index
    const removeIndex = +event.currentTarget.dataset.arg;
    setFiles(files.filter((_, i) => i !== removeIndex));
  };

  /**
   * Generate a list of files formatted for display
   * @returns {Array<React Elements>}
   */
  const pendingFiles = files.map((file, i) => (
    <List.Item key={`${file.path}-${i}`}>
      {file.path} <TrashButton data-arg={i} onClick={removeFile} />
    </List.Item>
  ));

  return (
    <Container textAlign="center">
      <Container textAlign="left">
        <h2>Step 1. Upload your session files</h2>
      </Container>
      <Segment placeholder raised {...getRootProps({ refKey: "ref" })}>
        <FlexRowCenterDiv>
          <FlexColumnDiv>
            <FileIcon />
            .log
          </FlexColumnDiv>

          <FlexColumnDiv>
            <FileIcon />
            .csv
          </FlexColumnDiv>
        </FlexRowCenterDiv>
        <Header as="h3" fitted="true">
          Drag a pair of DusTrak and GPS files here
        </Header>
        <Divider horizontal>or</Divider>
        <label htmlFor="gps-dustrak-dropzone">
          <LinkedHeader>Find files on your computer</LinkedHeader>
        </label>
        <input {...getInputProps()} id="gps-dustrak-dropzone" />
      </Segment>
      {errorMessage && <WarningMessage>{errorMessage}</WarningMessage>}
      {pendingFiles.length > 0 && (
        <Container>
          <h5>Pending Files</h5>
          <Divider fitted />
          <List>{pendingFiles}</List>
        </Container>
      )}
    </Container>
  );
};

UploadDrop.propTypes = {
  files: PropTypes.array.isRequired,
  setFiles: PropTypes.func.isRequired,
  proceedToConfirm: PropTypes.func.isRequired,
  setDustrakStart: PropTypes.func.isRequired,
  setDustrakEnd: PropTypes.func.isRequired,
  setDustrakSerial: PropTypes.func.isRequired,
};
