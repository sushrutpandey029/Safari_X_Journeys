// this code is for web authentication

// export const isAuthenticated = (req, res, next) => {
//     if (req.session.user) {
//         return next(); // User is logged in, proceed to the requested page
//     }
//     return res.status(401).redirect('/'); // Redirect to login page if not authenticated
// };




// this code is for api 
export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    
    return res.status(401).json({
        success: false,
        message: "Unauthorized: Please login to access this resource"
    });
};

