# Script PowerShell para atualizar URLs da API

param(
    [string]$NewApiUrl = "https://ubatuba-reage-backend.vercel.app/api"
)

Write-Host "`n╔══════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                          ║" -ForegroundColor Cyan
Write-Host "║                  🔄 ATUALIZAR URLs DA API                               ║" -ForegroundColor Cyan
Write-Host "║                                                                          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$OldUrl = "http://localhost:3000/api"

$files = @(
    "admin\js\login.js",
    "admin\js\noticias.js",
    "admin\js\dashboard.js",
    "admin\js\categorias.js",
    "admin\js\newsletter.js"
)

Write-Host "🔍 Arquivos a serem atualizados:" -ForegroundColor Yellow
foreach ($file in $files) {
    Write-Host "   • $file" -ForegroundColor Gray
}

Write-Host "`n📝 Substituindo:" -ForegroundColor Yellow
Write-Host "   De: $OldUrl" -ForegroundColor Red
Write-Host "   Para: $NewApiUrl`n" -ForegroundColor Green

$count = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $newContent = $content -replace [regex]::Escape($OldUrl), $NewApiUrl
        
        if ($content -ne $newContent) {
            Set-Content -Path $file -Value $newContent -NoNewline
            Write-Host "✅ $file atualizado" -ForegroundColor Green
            $count++
        } else {
            Write-Host "⚠️  $file já estava atualizado ou URL não encontrada" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ $file não encontrado" -ForegroundColor Red
    }
}

Write-Host "`n╔══════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                                          ║" -ForegroundColor Green
Write-Host "║                  ✅ ATUALIZAÇÃO CONCLUÍDA!                              ║" -ForegroundColor Green
Write-Host "║                                                                          ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "📊 Resultado:" -ForegroundColor Cyan
Write-Host "   • Arquivos atualizados: $count de $($files.Count)" -ForegroundColor White
Write-Host "`n🚀 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Fazer commit das mudanças" -ForegroundColor Gray
Write-Host "   2. Deploy do frontend na Vercel" -ForegroundColor Gray
Write-Host "   3. Testar o sistema em produção`n" -ForegroundColor Gray
