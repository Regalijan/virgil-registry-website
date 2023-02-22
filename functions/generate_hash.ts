export default async function (token: string): Promise<string> {
  const tokenHash = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(token)
  );

  return Array.from(new Uint8Array(tokenHash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
