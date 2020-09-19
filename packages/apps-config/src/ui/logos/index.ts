// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// anything for a specific chain, most would probably fit into the node category (but allow for chain-specific)
import chainDarwinia from './chains/darwinia.svg';
import chainCrab from './chains/crab.svg';
import chainDev from './chains/dev.svg';

// defaults for the node type, assuming we don't have a specific chain, but rather match on the implementation
import nodeSubstrate from './nodes/substrate-hexagon.svg';

// extensions
import extensionPolkadotJs from './extensions/polkadot-js.svg';

// last-resort fallback, just something empty
import emptyLogo from './empty.svg';

// overrides based on the actual matched chain name
const chainLogos: Record<string, any> = [
  ['darwinia cc1', chainDarwinia],
  ['darwinia', chainDarwinia],
  ['crab network', chainCrab],
  ['darwinia network', chainDarwinia]
].reduce((logos, [chain, logo]): Record<string, any> => ({
  ...logos,
  [chain.toLowerCase()]: logo
}), {});

// overrides based on the actual software node type (all '-' converted to ' ')
const nodeLogos: Record<string, any> = [
  ['node-template', nodeSubstrate],
  ['substrate-node', nodeSubstrate],
  ['crab', chainCrab],
  ['darwinia', chainDarwinia]
].reduce((logos, [node, logo]): Record<string, any> => ({
  ...logos,
  [node.toLowerCase().replace(/-/g, ' ')]: logo
}), {});

// overrides when we pass an explicit logo name
const namedLogos: Record<string, any> = {
  empty: chainDev,
  substrate: nodeSubstrate,
  crab: chainCrab,
  darwinia: chainDarwinia
};

// extension logos
const extensionLogos: Record<string, any> = {
  'polkadot-js': extensionPolkadotJs
};

export {
  chainLogos,
  emptyLogo,
  extensionLogos,
  namedLogos,
  nodeLogos
};
