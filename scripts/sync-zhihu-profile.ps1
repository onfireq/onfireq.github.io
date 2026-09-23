$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'zhihu-profile.ps1')
$uri = 'https://www.zhihu.com/api/v4/members/bai-ri-meng-you-54-77?include=follower_count,voteup_count,thanked_count,favorited_count'
try {
    $profile = Invoke-RestMethod -TimeoutSec 20 -Uri $uri
} catch {
    $message = $_.Exception.Message.Replace('%', '%25').Replace("`r", '%0D').Replace("`n", '%0A')
    Write-Output "::error::Zhihu profile request failed: $message"
    throw
}
$snapshot = ConvertTo-ZhihuProfileSnapshot $profile
$outputDirectory = Join-Path $PSScriptRoot '../public'
$outputPath = Join-Path $outputDirectory 'zhihu-profile.json'
[IO.File]::WriteAllText($outputPath, ($snapshot | ConvertTo-Json) + "`n")
$snapshot | ConvertTo-Json -Compress
