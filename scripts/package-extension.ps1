$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "zip-helpers.ps1")

$projectRoot = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $projectRoot "dist"
$releasePath = Join-Path $projectRoot "release"
$zipPath = Join-Path $releasePath "spectrum-scoop-extension.zip"

Set-Location $projectRoot
npm run build
# $ErrorActionPreference doesn't apply to native commands in Windows PowerShell
if ($LASTEXITCODE -ne 0) { throw "Build failed (exit code $LASTEXITCODE)" }

if (!(Test-Path $releasePath)) {
  New-Item -ItemType Directory -Path $releasePath | Out-Null
}

New-ExtensionZip -SourceDir $distPath -ZipPath $zipPath
Write-Host "Created $zipPath"
