$ErrorActionPreference = "Stop"

$Target = Join-Path $PSScriptRoot "images\figma"
New-Item -ItemType Directory -Force -Path $Target | Out-Null

# These URLs are short-lived exports returned by the Figma MCP.
# Run this script promptly, then commit the resulting image files to GitHub.
$assets = @(
    @{ File = "figma-logo.png";      Url = "https://www.figma.com/api/mcp/asset/2fed1754-a720-4877-963e-c18f13337924" },
    @{ File = "hero.png";            Url = "https://www.figma.com/api/mcp/asset/628a279e-df73-4708-ade5-b1c129be9b72" },
    @{ File = "packaging.png";       Url = "https://www.figma.com/api/mcp/asset/3aad1a31-445c-4954-b6c5-b58e60904a98" },
    @{ File = "whole-sticks.png";    Url = "https://www.figma.com/api/mcp/asset/042b48c9-d5c5-4be9-be71-b60e0e0294f4" },
    @{ File = "bacon.png";           Url = "https://www.figma.com/api/mcp/asset/71ef4d3a-22eb-4e05-87a4-2f06b89efc4c" },
    @{ File = "product-shared.png";  Url = "https://www.figma.com/api/mcp/asset/afbd4786-b9e8-4dd2-a417-879d3dd85313" },
    @{ File = "form-photo.jpg";      Url = "https://www.figma.com/api/mcp/asset/e0c6db38-0c24-4aac-8b03-db32fa8a4cca" },
    @{ File = "gift-product.png";    Url = "https://www.figma.com/api/mcp/asset/96a7fc60-00f5-42a6-b2eb-b5b03439f428" },
    @{ File = "gift-bg.jpg";         Url = "https://www.figma.com/api/mcp/asset/fd48aa47-7e9f-4b72-b410-9cb11f1a2699" },
    @{ File = "gift-decorative.png"; Url = "https://www.figma.com/api/mcp/asset/d21a81c3-0d07-490d-9ae5-d43ee07eaed4" },
    @{ File = "faq-photo.jpg";       Url = "https://www.figma.com/api/mcp/asset/fb8ea3a6-4a8b-4322-be3e-9d2246b46022" }
)

foreach ($asset in $assets) {
    $output = Join-Path $Target $asset.File
    Write-Host "Downloading $($asset.File) ..."
    Invoke-WebRequest -Uri $asset.Url -OutFile $output -UseBasicParsing
    if (-not (Test-Path $output)) {
        throw "Asset download failed: $($asset.File)"
    }
}

Write-Host ""
Write-Host "Figma assets downloaded to $Target" -ForegroundColor Green
Write-Host "Commit these files with index.html, assets/styles.css and assets/site.js." -ForegroundColor Green
