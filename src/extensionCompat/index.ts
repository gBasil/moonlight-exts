import type { CompatNatives } from './natives';

const natives = moonlight.getNatives('extensionCompat') as CompatNatives;

export const { patches, styles, webpackModules } = await natives.getPluginData();
