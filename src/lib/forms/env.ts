function readEnv(name: string): string | undefined {
  const fromMeta = import.meta.env[name];
  if (typeof fromMeta === "string" && fromMeta.trim() !== "") return fromMeta;

  try {
    const fromProcess = globalThis.process?.env?.[name];
    if (typeof fromProcess === "string" && fromProcess.trim() !== "") {
      return fromProcess;
    }
  } catch {
    // `process` is unavailable on some edge runtimes
  }

  return undefined;
}

/** Read a required env var or throw a clear configuration error. */
export function requireEnv(name: string): string {
  const value = readEnv(name);
  if (!value) {
    throw new Error(`Missing ${name}. Add it to your .env file.`);
  }
  return value;
}

export function optionalEnv(name: string): string | undefined {
  return readEnv(name);
}
