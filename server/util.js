
/**
 * Utility files for the server
 */


 /**
  * Exposes a function that takes in an entity (JSON) and sends an 
  * HTTP JSON response using res.json()
  * @param {Object} res Express response object
  * @param {Integer} statusCode HTTP Status Code for response
  */
function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if(entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

module.exports = {
    respondWithResult
}