// Createe an 'utils.js' and placed corresponding function here
// Utility functions with no preceding title refer to the default file - 'index' 
import axios from "axios";
import { apiUrlDevices } from "../../api.util";

/**
 * Retrieve all of the devices
 * @returns {Array<Device>}
 */
 export const getDevices = async () => {
    return (await axios.get(apiUrlDevices())).data;
  }

// Refactored findDevice to utility function
// It is a pure function
// We should test it
// Replaced 'null' with empty versions of the types we need
// By consistently having our variables match their expected types,
// we can more efficiently and reliably handle their "error" cases
// Refactored to '.find'
// We're only interested in a single object, rather than creating a list
/**
 * Find the device associated with this user upload
 * @param {Array<Device>} devices from the api
 * @param {string} serial the serial number of the uploaded device
 * @returns {Device || Object} the device of interest or an empty object
 */
export const findDevice = (devices, serial ) => devices.find(device => device.serial === serial) || {}; 
