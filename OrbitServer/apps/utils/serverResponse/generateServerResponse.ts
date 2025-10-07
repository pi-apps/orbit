import { Request } from "express";

type ServerResponse = {
  serverData: any;
  accessTokenWasExpiredSoWeCreatedAnotherOne: boolean;
  newAccessToken: string | undefined;
  //env: any;
  //requestHeaders: any;
};
export default function generateServerResponse(
  req: Request,
  data: any
): ServerResponse {
  return {
    serverData: data,
    accessTokenWasExpiredSoWeCreatedAnotherOne:
      req.accessTokenWasExpiredSoWeCreatedAnotherOne,
    newAccessToken: req.newAccessToken,
    //requestHeaders: req.headers,
    //env: process.env.GMAIL_PASSWORD,
  };
}
