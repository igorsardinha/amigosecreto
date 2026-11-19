import { cookies } from "next/headers";

const COOKIE_NAME = "superadmin_session";

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET || "admin123";
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value === getAdminSecret();
}

export async function setAdminSession(secret: string): Promise<boolean> {
  if (secret === getAdminSecret()) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    });
    return true;
  }
  return false;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
