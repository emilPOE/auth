import express from "express";
import homePageController from "../controllers/homePageController";
import registerController from "../controllers/registerController";
import loginController from "../controllers/loginController";
import auth from "../validation/authValidation";
import passport from "passport";
import initPassportLocal from "../controllers/passportLocalController";

initPassportLocal();

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", loginController.checkLoggedIn, homePageController.handleHomepage);
    router.get("/handlePlay", loginController.checkLoggedIn, homePageController.handlePlay);
    router.get("/handleIndex", loginController.checkLoggedIn, homePageController.handleIndex);
    router.get("/handleCreateRoom", loginController.checkLoggedIn, homePageController.handleCreateRoom);
    router.get("/handleRoom", loginController.checkLoggedIn, homePageController.handleRoom);
    router.get("/login", loginController.checkLoggedOut, loginController.getPageLogin);
    router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        successFlash: true,
        failureFlash: true
    }));

    router.get("/register", registerController.checkLoggedOut, registerController.getPageRegister);
    router.post("/register", auth.validateRegister, registerController.createNewUser);
    router.post("/logout", loginController.postLogOut);
    return app.use("/", router);
};
module.exports = initWebRoutes;
