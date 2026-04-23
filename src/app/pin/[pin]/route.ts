import { UserData } from "@/type";
import { decodeCredentials } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pin: string }> }
) {
  const { pin } = await params;
  const userData = cacheInstance.get<UserData>(pin.toLocaleLowerCase());

  if (!userData) {
    return NextResponse.json("Message: Token Expired", {
      status: 404,
    });
  }

  const auth = req.headers.get("authorization");

  if (!auth) {
    return Response.json("", {
      status: 404,
    });
  }

  const [, authBasis] = auth?.split(" ");
  const { owner, password } = decodeCredentials(authBasis);

  // userData.password is the encoded credentials string "owner:password"
  // we need to decode it or compare it properly.
  // Actually, src/app/pin/route.ts sets:
  // password: encodeCredentials(owner, password)
  // So userData.password IS the base64 string.

  // To be safe and correct, let's decode the stored one too or compare the base64
  if (userData.password !== authBasis) {
    return Response.json("", {
      status: 403,
    });
  }

  // Also verify IP if owner was set
  if (userData.owner && userData.owner !== owner) {
      return Response.json("", {
          status: 403,
      })
  }

  if (!userData.token) {
    return Response.json(null);
  }

  cacheInstance.del(pin.toLocaleLowerCase());
  return NextResponse.json(userData.token);
}
