/**
 * Middleware that redirects to /login if not logged in.
 * and does not make the /login page available if you are 
 * logged in
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function loginRedirects(req, res, next) {
	// Home page is always accessibile
	if (req.path == "/") {
		next()
	}

	if (req.path === "/login") {
		if (req.user) {
			// No need to login again!
			res.redirect("/")
		} else {
			next()
		}
	} else {
		// All other pages are lockeds
		if (req.user) {
			next()
		} else {
			res.redirect("/login")
		}
	}
}

module.exports.loginRedirects = loginRedirects;