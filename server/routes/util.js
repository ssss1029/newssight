/**
 * Middleware that redirects to /login if not logged in.
 * and does not make the /login page available if you are 
 * logged in
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function loginRedirects(req, res, next) {
	// Not implemented or used right now.
	next();
}

module.exports.loginRedirects = loginRedirects;