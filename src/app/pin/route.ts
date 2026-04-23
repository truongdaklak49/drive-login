import { getIp } from "@/lib/get-ip";
import {
  encodeCredentials,
  formDataToJson,
  generatePassword,
  generatePin,
} from "@/utils";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const { provider, client_id: clientId, client_secret: clientSecret } = formDataToJson(body);

  const owner = await getIp() ?? "127.0.0.1";

  const password = generatePassword(128);

  let pin = "";
  let pinExists = 1;

  while (pinExists) {
    pin = generatePin();
    pinExists = Number(cacheInstance.has(pin));
  }

  const data = {
    pin,
    password: encodeCredentials(owner, password),
    provider,
    owner,
    clientId,
    clientSecret,
  };

  cacheInstance.set(pin, data, 120);

  return Response.json(data);
}
