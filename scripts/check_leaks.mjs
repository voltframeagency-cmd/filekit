async function main() {
  const msRes = await fetch("http://localhost:3000/ms/strip-exif");
  const msHtml = await msRes.text();
  console.log("=== /ms/strip-exif ===");
  console.log("has English Select Photo:", msHtml.includes("Select Photo to Strip"));
  console.log("has Malay Pilih Foto:", msHtml.includes("Pilih Foto untuk Memadamkan Metadata"));
  const msH1 = msHtml.match(/<h1[^>]*>([^<]+)<\/h1>/);
  console.log("H1:", msH1 ? msH1[1] : "not found");
  const msPill = msHtml.match(/text-blue-200[^>]*>([^<]+)<\/span>/);
  console.log("Category Pill:", msPill ? msPill[1] : "not found");

  const viRes = await fetch("http://localhost:3000/vi/compress-pdf-to-size");
  const viHtml = await viRes.text();
  console.log("\n=== /vi/compress-pdf-to-size ===");
  console.log("has English Drop PDF:", viHtml.includes("Drop your PDF document here"));
  const viH1 = viHtml.match(/<h1[^>]*>([^<]+)<\/h1>/);
  console.log("H1:", viH1 ? viH1[1] : "not found");
  const viPill = viHtml.match(/text-blue-200[^>]*>([^<]+)<\/span>/);
  console.log("Category Pill:", viPill ? viPill[1] : "not found");
}

main().catch(console.error);
