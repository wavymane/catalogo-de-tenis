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

// La clave de ficha distingue todas las fotos; para reconocer una edición de inventario
// comparamos también el modelo y su sufijo, sin el precio ni las tallas.
function snapshot(images: string[]) {
  const models = new Map<string, string>();
  for (const image of images) {
    const { key, name, color } = photoDetails(image);
    const suffix = path.parse(image).name.split("_").slice(3).join("_");
    models.set(key, `${name}_${color ? "color" : suffix}`);
  }
  return models;
}

async function snapshotAt(commit: string) {
  const files = await git("ls-tree", "-rz", "--name-only", commit, "--", "public/imagenes");
  const photos = files.split("\0").filter(file => /^public\/imagenes\/[^/]+$/.test(file) && isPhoto(file));
  return snapshot(photos.map(file => path.posix.basename(file)));
}

export async function latestAdditions(images: string[]): Promise<Set<string>> {
  const current = snapshot(images);
  // Sigue la ficha actual hacia atrás si una edición cambió su clave.
  let currentKeys = new Map([...current.keys()].map(key => [key, key]));
  try {
    const log = await git("log", "--first-parent", "--format=%H", "--", "public/imagenes");
    let newer = current;
    for (const commit of log.trim().split(/\s+/).filter(Boolean)) {
      const older = await snapshotAt(commit);
      const removed = new Map<string, string[]>();
      for (const [key, identity] of older) {
        if (newer.has(key)) continue;
        const keys = removed.get(identity) ?? [];
        keys.push(key);
        removed.set(identity, keys);
      }
      const previousKeys = new Map<string, string>();
      const added = new Set<string>();
      let hasAdditions = false;
      for (const [key, identity] of newer) {
        const previous = older.has(key) ? key : removed.get(identity)?.pop();
        const currentKey = currentKeys.get(key);
        if (previous !== undefined) {
          if (currentKey !== undefined) previousKeys.set(previous, currentKey);
        } else {
          hasAdditions = true;
          if (currentKey !== undefined) added.add(currentKey);
        }
      }
      if (hasAdditions) return added;
      currentKeys = previousKeys;
      newer = older;
    }
    // En un clon superficial no conocemos el lote anterior a la primera revisión visible.
    if ((await git("rev-parse", "--is-shallow-repository")).trim() === "false") {
      return new Set(currentKeys.values());
    }
  } catch {
    // El catálogo también se puede compilar desde una copia sin historial Git.
  }
  return new Set();
}
