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
  const { owner: providedOwner, password: providedPassword } = decodeCredentials(authBasis);
  const { owner: storedOwner, password: storedPassword } = decodeCredentials(userData.password);

  if (providedPassword !== storedPassword) {
    return Response.json("Message: Invalid password", {
      status: 403,
    });
  }

  // Compare owners, but be lenient with IPv6 vs IPv4 mapped IPv6
  const normalizeIp = (ip: string) => {
    if (ip === "::1" || ip === "127.0.0.1") return "localhost";
    if (ip.startsWith("::ffff:")) return ip.slice(7);
    return ip;
  };

  if (normalizeIp(providedOwner) !== normalizeIp(storedOwner)) {
      return Response.json("Message: Owner mismatch", {
          status: 403,
      })
  }

  if (!userData.token) {
    return Response.json(null);
  }

  cacheInstance.del(pin.toLocaleLowerCase());
  return NextResponse.json(userData.token);
}
