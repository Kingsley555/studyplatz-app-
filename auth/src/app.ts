import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@oktickets/common"; // I developed my own custom and general purpose
//middleware and error handler modules and pushed them to npmjs.com
//https://www.npmjs.com/package/@oktickets/common

const app = express();
app.set("trust proxy", true); // traffic been proxy through ingress/nginx
app.use(json());
app.use(
  cookieSession({
    signed: false, // disable encryption
    secure: process.env.NODE_ENV != "test", // must be on Https connection
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
