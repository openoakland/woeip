/**
 * Fill form with files and meta data
 * @param {import('react-dropzone').FileWithPath} firstFile First and second files will be identified...
 * @param {import('react-dropzone').FileWithPath} secondFile ...by server as gps and dustrak files
 * @param {moment} dustrakStart Starting moment of session, to be stored as formatted string
 * @param {moment} dustrakEnd Ending moment of session, to be stored as formatted string
 * @param {string} pollutantId database id for the type of pollutant, coercible to an integer
 * @param {string} deviceId database id for the type of device, coercible to an interger
 * @returns {FromData} Files and Meta Data, to be send through API and to Database
 */
export const getFilesForm = ({
  firstFile,
  secondFile,
  dustrakStart,
  dustrakEnd,
  pollutantId = "1",
  deviceId,
} = {}) => {
  const filesForm = new FormData();
  filesForm.append("upload_files", firstFile);
  filesForm.append("upload_files", secondFile);
  filesForm.append("starts_at", dustrakStart.format());
  filesForm.append("ends_at", dustrakEnd.format());
  filesForm.append("pollutant", pollutantId);
  filesForm.append("device", deviceId);
  return filesForm;
};
