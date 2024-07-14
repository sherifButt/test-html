/**
 * Converts a JavaScript Date object into a MySQL timestamp.
 * @param {Date} date - The JavaScript Date object to convert.
 * @return {string} The MySQL timestamp.
 */
function convertToMySqlTimestamp(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-indexed, so add 1.
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}
