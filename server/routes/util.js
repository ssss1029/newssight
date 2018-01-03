/**
 * Middleware that redirects to /login if not logged in.
 * and does not make the /login page available if you are 
 * logged in
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function loginRedirects(req, res, next) {
	if (req.path === "/login") {
		if (req.user) {
			res.redirect("/")
		} else {
			next()
		}
	} else {
		if (req.user) {
			next()
		} else {
			res.redirect("/login")
		}
	}
}

module.exports.loginRedirects = loginRedirects;