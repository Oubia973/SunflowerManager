export function computeGemsRatio(gemsPack, usdSfl) {
  const pack = Number(gemsPack) || 0;
  const usdFlower = Number(usdSfl) || 0;
  if (pack <= 0 || usdFlower <= 0) return 0;

  const packUsdMap = {
    100: 0.9,
    650: 4.54,
    1350: 9.09,
    2800: 18.19,
    7400: 45.49,
    15500: 90.99,
    200000: 909.99,
  };

  const packUsd = packUsdMap[pack];
  if (!packUsd) return 0;

  return (packUsd / usdFlower) / pack;
}
