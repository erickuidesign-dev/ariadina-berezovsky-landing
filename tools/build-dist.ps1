# Ariadina Berezovsky | gera a pasta dist/ pronta para deploy
# Copia só os arquivos que o site usa. Rode de novo sempre que mudar algo no site:
#   powershell -ExecutionPolicy Bypass -File tools\build-dist.ps1
# Depois suba o CONTEÚDO de dist/ para a hospedagem (index.html fica na raiz).

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $root 'dist'

if (Test-Path -LiteralPath $dist) { Remove-Item -LiteralPath $dist -Recurse -Force }
New-Item -ItemType Directory -Path $dist | Out-Null

$css = 'tokens', 'icons', 'landing', 'como-funciona', 'servicos', 'sobre', 'faq', 'agenda', 'rodape'
$js  = 'icons', 'como-funciona', 'servicos', 'sobre', 'depoimentos-data', 'faq', 'agenda-config', 'agenda', 'rodape', 'main'

New-Item -ItemType Directory -Path (Join-Path $dist 'css'), (Join-Path $dist 'js'), (Join-Path $dist 'assets\fotos') | Out-Null
Copy-Item -LiteralPath (Join-Path $root 'index.html') -Destination $dist
foreach ($n in $css) { Copy-Item -LiteralPath (Join-Path $root "css\$n.css") -Destination (Join-Path $dist 'css') }
foreach ($n in $js)  { Copy-Item -LiteralPath (Join-Path $root "js\$n.js")   -Destination (Join-Path $dist 'js') }

# Fotos: só as que o index.html referencia
$html = [IO.File]::ReadAllText((Join-Path $root 'index.html'), [Text.Encoding]::UTF8)
$fotos = [regex]::Matches($html, 'assets/fotos/([\w\-]+\.jpg)') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
foreach ($f in $fotos) { Copy-Item -LiteralPath (Join-Path $root "assets\fotos\$f") -Destination (Join-Path $dist 'assets\fotos') }

# Confere se todo css/js ligado no index existe no dist
$faltando = [regex]::Matches($html, '(?:href|src)="((?:css|js)/[^"?]+)') | ForEach-Object { $_.Groups[1].Value } |
  Where-Object { -not (Test-Path -LiteralPath (Join-Path $dist $_)) }
if ($faltando) { throw "Faltam no dist: $($faltando -join ', ')" }

$total = (Get-ChildItem -LiteralPath $dist -Recurse -File | Measure-Object Length -Sum)
"dist pronto: {0} arquivos, {1:N0} KB" -f $total.Count, ($total.Sum / 1KB)
