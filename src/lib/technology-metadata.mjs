const maturityLabels = { emerging: '新興', established: '定着', mature: '成熟' };

export function getTechnologyMetadata(technology, ecosystemNames) {
  return {
    maturity: maturityLabels[technology.maturity] ?? technology.maturity,
    importance: technology.importance === 'core' ? 'Core' : 'Major',
    ecosystems: technology.ecosystem.map((id) => ecosystemNames[id] ?? id),
    aliases: technology.aliases
  };
}
