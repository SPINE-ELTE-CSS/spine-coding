// ===== Agreement statistics =====
// Krippendorff's alpha with an arbitrary distance function
// (Krippendorff 2004/2018; Hayes & Krippendorff 2007). Values: null = missing.
// units: array of arrays of values (one array per unit, one value per coder).
const AGR = (() => {
  const nominal = (a, b) => (a === b ? 0 : 1);
  const interval = (a, b) => (a - b) * (a - b);
  // MASI distance for set-valued codes (Passonneau 2006)
  const masi = (A, B) => {
    const a = new Set(A || []), b = new Set(B || []);
    if (a.size === 0 && b.size === 0) return 0;
    let inter = 0; a.forEach(x => { if (b.has(x)) inter++; });
    const union = a.size + b.size - inter;
    const J = union ? inter / union : 1;
    let M;
    if (inter === a.size && inter === b.size) M = 1;
    else if (inter === a.size || inter === b.size) M = 2 / 3;
    else if (inter > 0) M = 1 / 3;
    else M = 0;
    return 1 - J * M;
  };
  const key = v => (Array.isArray(v) ? JSON.stringify([...v].sort()) : JSON.stringify(v));

  function alpha(units, dist) {
    // keep pairable units (>= 2 non-missing values)
    const U = units.map(u => u.filter(v => v !== null && v !== undefined)).filter(u => u.length >= 2);
    if (!U.length) return { alpha: null, n: 0, units: 0 };
    let n = 0; U.forEach(u => (n += u.length));
    // observed disagreement
    let Do = 0;
    U.forEach(u => {
      const m = u.length; let s = 0;
      for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) if (i !== j) s += dist(u[i], u[j]);
      Do += s / (m - 1);
    });
    Do /= n;
    // expected disagreement from pooled values (grouped by distinct value)
    const freq = new Map();
    U.forEach(u => u.forEach(v => { const k = key(v); const e = freq.get(k); if (e) e.c++; else freq.set(k, { v, c: 1 }); }));
    const vals = [...freq.values()];
    let De = 0;
    for (let i = 0; i < vals.length; i++) for (let j = 0; j < vals.length; j++) {
      if (i === j) continue;
      De += vals[i].c * vals[j].c * dist(vals[i].v, vals[j].v);
    }
    De /= n * (n - 1);
    if (De === 0) return { alpha: null, n, units: U.length, Do, De, novar: true }; // no variation: alpha undefined
    return { alpha: 1 - Do / De, n, units: U.length, Do, De };
  }

  // share of agreeing coder pairs within one unit (1 = all agree)
  function unitAgreement(values, dist) {
    const v = values.filter(x => x !== null && x !== undefined);
    if (v.length < 2) return null;
    let pairs = 0, agree = 0;
    for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) {
      pairs++; agree += 1 - Math.min(1, dist(v[i], v[j]));
    }
    return agree / pairs;
  }

  function percentAgreement(units, dist) {
    let s = 0, k = 0;
    units.forEach(u => { const a = unitAgreement(u, dist); if (a !== null) { s += a; k++; } });
    return k ? s / k : null;
  }

  return { alpha, unitAgreement, percentAgreement, nominal, interval, masi, key };
})();

if (typeof module !== 'undefined') module.exports = AGR;
