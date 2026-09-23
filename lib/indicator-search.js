const bollingerSearchAliases = [
  "保歷加通道",
  "保歷加",
  "保力加通道",
  "保力加",
  "布林帶",
  "布林通道",
  "布林",
  "Bollinger",
  "BOLL",
  "BB",
];

function normalizeSearchText(value) {
  return value.trim().toLocaleLowerCase("zh-HK");
}

export function matchesIndicatorSearch(query, searchableValues) {
  const needle = normalizeSearchText(query);
  if (!needle) return true;

  const haystack = normalizeSearchText(searchableValues.join(" "));
  if (haystack.includes(needle)) return true;

  const isBollingerAlias = bollingerSearchAliases.some((alias) => normalizeSearchText(alias) === needle);
  return isBollingerAlias && bollingerSearchAliases.some((alias) => haystack.includes(normalizeSearchText(alias)));
}

export function matchesBlogSearch(query, searchableValues) {
  return matchesIndicatorSearch(query, searchableValues);
}
