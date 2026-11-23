import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
export const isPhoto = (name: string) => /\.(jpe?g|png|webp|avif)$/i.test(name);

export function photoDetails(image: string) {
  const filename = path.parse(image).name;
  const [name, priceText = "", sizeText = "", suffix = ""] = filename.split("_");
  const color = suffix.startsWith("color-") ? suffix.slice(6) : null;
  const key = color ? `${name}_${priceText}` : filename;
  return { name, priceText, sizeText, color, key };
}

async function git(...args: string[]) {
  const { stdout } = await run("git", args, { cwd: process.cwd(), maxBuffer: 8 * 1024 * 1024 });
  return stdout;
}

async function keysAt(commit: string) {
  const files = await git("ls-tree", "-rz", "--name-only", commit, "--", "public/imagenes");
  const photos = files.split("\0").filter(file => /^public\/imagenes\/[^/]+$/.test(file) && isPhoto(file));
  return new Set(photos.map(file => photoDetails(path.posix.basename(file)).key));
}

export async function latestAdditions(images: string[]): Promise<Set<string>> {
  const current = new Set(images.map(image => photoDetails(image).key));
  try {
    const log = await git("log", "--first-parent", "--format=%H", "--", "public/imagenes");
    let newer = current;
    for (const commit of log.trim().split(/\s+/).filter(Boolean)) {
      const older = await keysAt(commit);
      const added = [...newer].filter(key => !older.has(key));
      if (added.length) return new Set(added.filter(key => current.has(key)));
      newer = older;
    }
    // En un clon superficial no conocemos el lote anterior a la primera revisión visible.
    if ((await git("rev-parse", "--is-shallow-repository")).trim() === "false") {
      return new Set([...newer].filter(key => current.has(key)));
    }
  } catch {
    // El catálogo también se puede compilar desde una copia sin historial Git.
  }
  return new Set();
}
