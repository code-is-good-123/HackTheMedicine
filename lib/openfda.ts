export async function searchOpenFDA(barcodeOrName: string) {
  try {
    // Attempt search by NDC code or drug name
    const query = isNaN(Number(barcodeOrName)) 
      ? `openfda.brand_name:"${barcodeOrName}"+openfda.generic_name:"${barcodeOrName}"`
      : `openfda.package_ndc:"${barcodeOrName}"`;

    const res = await fetch(`https://api.fda.gov/drug/label.json?search=${encodeURIComponent(query)}&limit=1`);
    if (!res.ok) return null;

    const data = await res.json();
    const result = data.results?.[0];

    return {
      brandName: result?.openfda?.brand_name?.[0] || barcodeOrName,
      genericName: result?.openfda?.generic_name?.[0],
      purpose: result?.purpose?.[0],
      warnings: result?.warnings?.[0],
      raw: result,
    };
  } catch (error) {
    return null;
  }
}