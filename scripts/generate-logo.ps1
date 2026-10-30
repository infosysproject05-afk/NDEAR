# Generates the app logo assets from one GDI+ drawing at multiple sizes.
# Run from the repository root with: powershell -File scripts/generate-logo.ps1
Add-Type -AssemblyName System.Drawing

$assets = Join-Path $PSScriptRoot '..\app\assets'
$ink = [System.Drawing.ColorTranslator]::FromHtml('#211936')
$violet = [System.Drawing.ColorTranslator]::FromHtml('#6845D9')
$lavender = [System.Drawing.ColorTranslator]::FromHtml('#B39AF9')
$paper = [System.Drawing.ColorTranslator]::FromHtml('#F8F5FF')
$muted = [System.Drawing.ColorTranslator]::FromHtml('#C7B9F2')

function RoundedRect([single]$x, [single]$y, [single]$w, [single]$h, [single]$r) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc(($x + $w - $d), $y, $d, $d, 270, 90)
  $path.AddArc(($x + $w - $d), ($y + $h - $d), $d, $d, 0, 90)
  $path.AddArc($x, ($y + $h - $d), $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function FillRound($g, $color, [single]$x, [single]$y, [single]$w, [single]$h, [single]$r) {
  $path = RoundedRect $x $y $w $h $r
  $brush = New-Object System.Drawing.SolidBrush($color)
  $g.FillPath($brush, $path)
  $brush.Dispose()
  $path.Dispose()
}

function DrawMark($g) {
  # A pair of saved credentials, with a clear verification seal.
  $state = $g.Save()
  $g.TranslateTransform(245, 256)
  $g.RotateTransform(-13)
  FillRound $g $lavender 0 0 580 425 55
  $g.Restore($state)

  FillRound $g $violet 231 321 597 431 60
  FillRound $g $paper 251 341 557 391 45

  FillRound $g $violet 303 402 248 26 13
  FillRound $g $muted 303 453 202 22 11
  FillRound $g $muted 303 495 154 22 11

  $seal = New-Object System.Drawing.SolidBrush($violet)
  $g.FillEllipse($seal, 547, 466, 199, 199)
  $seal.Dispose()
  $check = New-Object System.Drawing.Pen($paper, 28)
  $check.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $check.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $check.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $points = [System.Drawing.PointF[]]@(
    (New-Object System.Drawing.PointF(591, 562)),
    (New-Object System.Drawing.PointF(630, 600)),
    (New-Object System.Drawing.PointF(698, 526))
  )
  $g.DrawLines($check, $points)
  $check.Dispose()
}

function SaveLogo([string]$name, [int]$width, [int]$height, [int]$markSize, [bool]$background) {
  $bitmap = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  if ($background) { $g.Clear($ink) } else { $g.Clear([System.Drawing.Color]::Transparent) }
  $g.TranslateTransform(($width - $markSize) / 2, ($height - $markSize) / 2)
  $g.ScaleTransform($markSize / 1024, $markSize / 1024)
  DrawMark $g
  $g.Dispose()
  $bitmap.Save((Join-Path $assets $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

SaveLogo 'icon.png' 1024 1024 880 $true
SaveLogo 'adaptive-icon.png' 587 587 440 $false
SaveLogo 'favicon.png' 48 48 46 $true
SaveLogo 'splash.png' 1284 2778 490 $true
SaveLogo 'wallet.png' 679 540 520 $false
