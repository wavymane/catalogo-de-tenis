const palette: Record<string, string> = {
  "azul oscuro": "#172d54", beige: "#ddc8a5", rojo: "#ce2536",
  azul: "#3263ac", blanco: "#ffffff", cian: "#00ffff", fucsia: "#e30086", gris: "#929292",
  negro: "#181818", piel: "#ddb996", rosa: "#f4a7c4", salmón: "#fa907d", verde: "#438053",
  café: "#8b4513", morado: "#800080", amarillo: "#ffff00", "verde oscuro": "#2e8b57"
};

type Props = { name: string; selected: boolean; onSelect: () => void };

export default function ColorSwatch({ name, selected, onSelect }: Props) {
  const tones = name.toLowerCase().split(" con ").map(part => palette[part]);
  let background = tones[0];
  if (tones.length > 1 && tones.every(Boolean)) {
    const stops = tones.length === 2 ? `${tones[0]} 30%, ${tones[1]} 70%` : tones.join(", ");
    background = `linear-gradient(135deg, ${stops})`;
  }

  return <button type="button" aria-label={`Color: ${name}`} title={name}
    aria-pressed={selected} onClick={onSelect} style={{ background }}
    className="relative grid size-10 place-items-center rounded-full border border-neutral-400 ring-2 ring-transparent ring-offset-2 ring-offset-white aria-pressed:ring-neutral-900">
    {!background && <span aria-hidden="true">?</span>}
    <svg aria-hidden="true" viewBox="0 0 20 20"
      className={`absolute size-5 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${selected ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
      <circle cx="10" cy="10" r="9" fill="#fff" stroke="#222" />
      <path d="m5.5 10 3 3 6-6" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>;
}
