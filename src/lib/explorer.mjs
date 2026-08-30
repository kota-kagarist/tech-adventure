function normalize(value) {
  return String(value ?? '').toLocaleLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu, '');
}

export function filterTechnologies(technologies, filters = {}) {
  const query = normalize(filters.query);

  return technologies.filter((technology) => {
    const searchable = normalize([
      technology.id,
      technology.name,
      technology.shortDescription,
      technology.role,
      ...(technology.aliases ?? []),
      ...(technology.tags ?? [])
    ].join(' '));

    return (!query || searchable.includes(query))
      && (!filters.category || technology.category === filters.category)
      && (!filters.ecosystem || technology.ecosystem?.includes(filters.ecosystem))
      && (!filters.maturity || technology.maturity === filters.maturity)
      && (!filters.importance || technology.importance === filters.importance);
  });
}
