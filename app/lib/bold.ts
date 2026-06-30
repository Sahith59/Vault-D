import { currentUser } from "./session";

export async function resolveCallerId() {
  const user = await currentUser();
  return user?.id ?? null;
}
