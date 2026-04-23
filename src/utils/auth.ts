"use server";

import { UserData } from "@/type";

export async function getGoogleAuthUrl(
  pin: string,
  redirectUri: string,
) {
  const userData = cacheInstance.get<UserData>(pin.toLowerCase());

  const params = new URLSearchParams();
  const state = pin;

  params.append(
    "client_id",
    userData?.clientId ?? (process.env.GOOGLE_CLIENT_ID as string)
  );
  params.append("redirect_uri", redirectUri);
  params.append("state", state);
  params.append("response_type", "code");
  params.append(
    "scope",
    "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/photoslibrary.readonly profile"
  );
  params.append("access_type", "offline");
  params.append("prompt", "consent");

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
