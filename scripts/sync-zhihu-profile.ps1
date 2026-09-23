$ErrorActionPreference = 'Stop'
$uri = 'https://www.zhihu.com/api/v4/members/bai-ri-meng-you-54-77?include=thanked_count'
$profile = Invoke-RestMethod -TimeoutSec 20 -Uri $uri
if ($profile.url_token -ne 'bai-ri-meng-you-54-77' -or
    $null -eq $profile.thanked_count -or
    $profile.thanked_count -isnot [long] -or
    $profile.thanked_count -lt 0) {
    throw 'The public Zhihu profile did not return a valid likes-received count.'
}
$snapshot = [ordered]@{
    schemaVersion = 1
    updatedAt = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
    receivedLikes = $profile.thanked_count
}
$outputDirectory = Join-Path $PSScriptRoot '../public'
$outputPath = Join-Path $outputDirectory 'zhihu-profile.json'
[IO.File]::WriteAllText($outputPath, ($snapshot | ConvertTo-Json) + "`n")
$snapshot | ConvertTo-Json -Compress
