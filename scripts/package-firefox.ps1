$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "zip-helpers.ps1")

$projectRoot = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $projectRoot "dist"
$releasePath = Join-Path $projectRoot "release"
$zipPath = Join-Path $releasePath "spectrum-scoop-firefox.zip"
$xpiPath = Join-Path $releasePath "spectrum-scoop-firefox.xpi"
$firefoxManifestPath = Join-Path $PSScriptRoot "manifest.firefox.json"
$distManifestPath = Join-Path $distPath "manifest.json"

Set-Location $projectRoot
npm run build
# $ErrorActionPreference doesn't apply to native commands in Windows PowerShell
if ($LASTEXITCODE -ne 0) { throw "Build failed (exit code $LASTEXITCODE)" }

# Swap in the Firefox manifest
Copy-Item -LiteralPath $firefoxManifestPath -Destination $distManifestPath -Force

if (!(Test-Path $releasePath)) {
  New-Item -ItemType Directory -Path $releasePath | Out-Null
}

New-ExtensionZip -SourceDir $distPath -ZipPath $zipPath
Copy-Item -LiteralPath $zipPath -Destination $xpiPath -Force

Write-Host "Created $zipPath"
Write-Host "Created $xpiPath"
Write-Host "Note: dist/ now holds the Firefox build. Run 'npm run build' before loading it in Chrome."
