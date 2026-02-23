'use server';

export async function verifyS6Password(input: string): Promise<boolean> {
  // Holt das Passwort sicher aus den Umgebungsvariablen des Servers
  // WICHTIG: Kein NEXT_PUBLIC_ Prefix, damit es nicht an den Browser geleakt wird!
  const secretPassword = process.env.S6_GATEKEEPER_PASSWORD;
  
  // Fallback, falls die .env Variable lokal noch nicht gesetzt wurde
  if (!secretPassword) {
    console.warn("S6_GATEKEEPER_PASSWORD ist nicht in der .env konfiguriert.");
    return false; 
  }

  return input === secretPassword;
}
