type ServerResponse = {
  serverData: any;
  accessTokenWasExpiredSoWeCreatedAnotherOne: boolean;
  newAccessToken: string | undefined;
};

export default function parseServerResponse(serverResponse: ServerResponse) {
  if (serverResponse.accessTokenWasExpiredSoWeCreatedAnotherOne) {
    localStorage.setItem("accessToken", serverResponse.newAccessToken!);
  }
  return serverResponse.serverData;
}
