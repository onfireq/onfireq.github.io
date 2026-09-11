declare module "wavedrom" {
  export type WaveDromSource = Record<string, unknown>;
  export type WaveDromSkin = Record<string, unknown>;

  export function renderAny(
    index: number,
    source: WaveDromSource,
    skin: WaveDromSkin,
    notFirstSignal?: boolean,
  ): unknown;

  export const waveSkin: WaveDromSkin;
  export const onml: {
    stringify(tree: unknown): string;
  };
}

declare module "wavedrom/skins/dark.js" {
  import type { WaveDromSkin } from "wavedrom";

  const darkSkin: WaveDromSkin;
  export default darkSkin;
}
