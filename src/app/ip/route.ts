import { NextRequest } from "next/server";
import { getIp } from "../../lib/get-ip";

export async function GET(req: NextRequest) {
  const ip = await getIp();
  console.log(ip);
  return new Response(ip ?? "127.0.0.1", {
    status: 200,
  });
}
