$dirs = @('C:\Users\mahdi\Downloads', 'C:\Users\mahdi\Documents')
$sensitivePattern = 'passport|tax|bank|medical|ssn|statement|w2|1040|legal|password|auth|credit|identity|license|paystub|confidential|secret|financial|resume|cv|invoice|receipt|contract'

$dest = 'C:\Users\mahdi\FileKit-Private-Fixtures'
if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Force -Path $dest | Out-Null }

$allPdfs = Get-ChildItem -Path $dirs -Filter *.pdf -Recurse -ErrorAction SilentlyContinue | Where-Object {
    $_.Name -notmatch $sensitivePattern -and $_.Length -gt 1000 -and $_.Length -lt 100MB
}

Write-Host "Found total eligible non-sensitive PDFs: $($allPdfs.Count)"

$sorted = $allPdfs | Sort-Object Length
$selected = @()
if ($sorted.Count -le 20) {
    $selected = $sorted
} else {
    $step = [math]::Floor($sorted.Count / 20)
    for ($i = 0; $i -lt 20; $i++) {
        $idx = [math]::Min($i * $step, $sorted.Count - 1)
        $selected += $sorted[$idx]
    }
}

$counter = 1
foreach ($file in $selected) {
    $id = "LOCAL-$('{0:D3}' -f $counter)"
    $targetPath = Join-Path $dest "$id.pdf"
    Copy-Item -Path $file.FullName -Destination $targetPath -Force
    Write-Host "Copied $id (Size: $($file.Length) bytes)"
    $counter++
}
