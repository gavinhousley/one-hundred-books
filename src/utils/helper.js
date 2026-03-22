const eraLabel = (year) => {
  if (year < 0) return `${Math.abs(year)} BC`;
  if (year < 1000) return `${year} AD`;
  return `${year}`;
};

const getCentury = (year) => {
  const c = Math.ceil(Math.abs(year) / 100);
  const suffix = c === 1 ? "st" : c === 2 ? "nd" : c === 3 ? "rd" : "th";

  if (year < 0) return `${c}${suffix} Century BC`;
  return `${c}${suffix} Century`;
};

function project(lat, lng) {
  const x = ((lng + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 507;
  return { x, y };
}

export { eraLabel, getCentury, project };
