export async function searchOpenFDA(barcodeOrName: string) {
  if (!barcodeOrName || !barcodeOrName.trim()) return null;
  const cleanTerm = barcodeOrName.trim();

  try {
    const isNumeric = /^[0-9-]+$/.test(cleanTerm);
    let query = "";

    if (isNumeric) {
      // Barcode / NDC search
      query = `openfda.package_ndc:"${cleanTerm}"+OR+openfda.product_ndc:"${cleanTerm}"`;
    } else {
      // Plain name search (e.g. "Amoxicillin", "Advil", "Tylenol")
      query = `openfda.brand_name:"${cleanTerm}"+OR+openfda.generic_name:"${cleanTerm}"+OR+openfda.substance_name:"${cleanTerm}"`;
    }

    const res = await fetch(
      `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(query)}&limit=1`,
      { cache: "no-store", headers: { Accept: "application/json" } }
    );

    if (!res.ok) {
      // Fallback search with loose query if exact field search yielded nothing
      const looseRes = await fetch(
        `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(cleanTerm)}&limit=1`,
        { cache: "no-store", headers: { Accept: "application/json" } }
      );
      if (!looseRes.ok) return null;
      const looseData = await looseRes.json();
      const first = looseData.results?.[0];
      if (!first) return null;
      return {
        brandName: first.openfda?.brand_name?.[0] || first.openfda?.generic_name?.[0] || cleanTerm,
        genericName: first.openfda?.generic_name?.[0] || "",
        purpose: first.purpose?.[0] || first.indications_and_usage?.[0] || "",
        warnings: first.warnings?.[0] || first.warnings_and_cautions?.[0] || "",
        raw: first,
      };
    }

    const data = await res.json();
    const result = data.results?.[0];
    if (!result) return null;

    return {
      brandName: result.openfda?.brand_name?.[0] || result.openfda?.generic_name?.[0] || cleanTerm,
      genericName: result.openfda?.generic_name?.[0] || "",
      purpose: result.purpose?.[0] || result.indications_and_usage?.[0] || "",
      warnings: result.warnings?.[0] || result.warnings_and_cautions?.[0] || "",
      raw: result,
    };
  } catch (error) {
    console.warn("openFDA API query error:", error);
    return null;
  }
}
