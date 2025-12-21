import { headers } from "next/headers";

export const getIp = async () => {
  const headerList = await headers();
  const forWardedFor = headerList.get("X-Forwarded-For");
  const realIp = headerList.get("x-real-ip");

  if (forWardedFor) {
    return forWardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  return null;
};
