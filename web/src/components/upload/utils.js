import axios from "axios";
import { apiUrlDevices } from "../../api.util";

/**
 * Shape of device data stored in database
 * @typedef Device
 * @property {string} name
 * @property {string} serial
 * @property {string} firmware
 */

/**
 * Retrieve all of the devices
 * @returns {Array<Device>}
 */
export const getDevices = async () => {
  return (await axios.get(apiUrlDevices())).data;
};

/**
 * Find device by serial
 * @param {Array<Device>} devices from the api
 * @param {string} serial the serial number of the uploaded device
 * @returns {Device || Object} the device of interest or an empty object
 */
export const findDevice = (devices, serial) =>
  devices.find((device) => device.serial === serial) || {};
