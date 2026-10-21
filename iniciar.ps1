$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw 'Instale e abra o Docker Desktop antes de continuar.'
}
docker compose version
if ($LASTEXITCODE -ne 0) { throw 'O Docker Compose v2 precisa estar instalado.' }
docker info | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Abra o Docker Desktop e aguarde a inicializacao.' }
if (-not (Test-Path '.env')) { Copy-Item '.env.example' '.env' }
$abpEnv = [IO.File]::ReadAllText((Join-Path $PSScriptRoot '.env'))
if ($abpEnv -notmatch '(?m)^JWT_SECRET=\S{32,}\r?$') {
    $abpBytes = New-Object byte[] 32
    $abpRandom = [Security.Cryptography.RandomNumberGenerator]::Create()
    try { $abpRandom.GetBytes($abpBytes) } finally { $abpRandom.Dispose() }
    $abpJwt = -join ($abpBytes | ForEach-Object { $_.ToString('x2') })
    $abpEnv = [regex]::Replace($abpEnv, '(?m)^JWT_SECRET=.*\r?\n?', '')
    [IO.File]::WriteAllText((Join-Path $PSScriptRoot '.env'), $abpEnv.TrimEnd() + "`nJWT_SECRET=$abpJwt`n", (New-Object Text.UTF8Encoding $false))
}
docker compose config --quiet
if ($LASTEXITCODE -ne 0) { throw 'Confira as configuracoes do arquivo .env.' }
docker compose up --build -d --wait --wait-timeout 180
if ($LASTEXITCODE -ne 0) { throw 'A inicializacao falhou. Confira docker compose logs.' }
Write-Host 'Projeto pronto. Site: http://localhost:8080 | API: http://localhost:3001/api/saude'
Write-Host 'Se alterou as portas no .env, utilize os valores configurados.'
Write-Host 'Para encerrar: docker compose down'
