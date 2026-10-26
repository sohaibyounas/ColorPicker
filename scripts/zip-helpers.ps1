Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem

# Compress-Archive in Windows PowerShell 5.1 writes entries with "\" separators,
# which browser stores reject. Build the zip by hand with "/" separators instead.
function New-ExtensionZip {
  param(
    [Parameter(Mandatory)] [string] $SourceDir,
    [Parameter(Mandatory)] [string] $ZipPath
  )

  $root = (Resolve-Path -LiteralPath $SourceDir).Path.TrimEnd('\')
  if (Test-Path -LiteralPath $ZipPath) {
    Remove-Item -LiteralPath $ZipPath
  }

  $zip = [System.IO.Compression.ZipFile]::Open($ZipPath, [System.IO.Compression.ZipArchiveMode]::Create)
  try {
    Get-ChildItem -LiteralPath $root -Recurse -File | ForEach-Object {
      $entryName = $_.FullName.Substring($root.Length + 1) -replace '\\', '/'
      [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
        $zip, $_.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal
      ) | Out-Null
    }
  }
  finally {
    $zip.Dispose()
  }
}
