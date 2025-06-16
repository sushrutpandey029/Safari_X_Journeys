export const isAdminLoggedIn = (req, res, next) => {
    const admin = req.session.admin;

    if (!admin) {
        return res.redirect('/login'); // Redirect to login if not logged in
    }

    next(); // Proceed if admin is logged in
};
