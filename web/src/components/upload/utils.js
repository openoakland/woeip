import axios from "axios";
import { apiUrlDevices } from "../../api.util";

// TODO: Create an 'utils.js' and place the function there
// It should be maintained in parallel with the file where it is used
// Utility functions with no preceding title refer to the default file - 'index' 
/**
 * Retrieve all of the devices
 * @returns {Array<Device>}
 */
 export const getDevices = async () => {
    return (await axios.get(apiUrlDevices())).data;
  }

// TODO: Refactor to utility function
// It is a pure function
// We should test it
// TODO: Replace 'null' with empty versions of the types we need
// By consistently having our variables match their expected types,
// we can more efficiently and reliably handle their "error" cases
// TODO: Refactor to '.find'
// We're only interested in a single object, rather than creating a list
/**
 * Find the device associated with this user upload
 * @param {Array<Device>} devices from the api
 * @param {string} serial the serial number of the uploaded device
 * @returns {Device || Object} the device of interest or an empty object
 */
export const findDevice = (devices, serial ) => devices.find(device => device.serial === serial) || {}; 
