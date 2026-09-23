$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'zhihu-profile.ps1')
$valid = @{
    url_token = 'bai-ri-meng-you-54-77'
    follower_count = 18
    voteup_count = 93
    thanked_count = [long]47
    favorited_count = 60
    comment_count = 9
}
$snapshot = ConvertTo-ZhihuProfileSnapshot ([pscustomobject]$valid)
if ($snapshot.followers -ne 18 -or $snapshot.receivedVotes -ne 93 -or
    $snapshot.receivedLikes -ne 47 -or $snapshot.receivedFavorites -ne 60) {
    throw 'Profile metrics were mapped incorrectly.'
}
foreach ($field in @('follower_count', 'voteup_count', 'thanked_count', 'favorited_count')) {
    foreach ($invalid in @($null, -1, '47', 1.5, $true)) {
        $inputProfile = $valid.Clone()
        $inputProfile[$field] = $invalid
        $rejected = $false
        try { $null = ConvertTo-ZhihuProfileSnapshot ([pscustomobject]$inputProfile) }
        catch { $rejected = $true }
        if (-not $rejected) { throw "Accepted invalid $field" }
    }
    $zero = $valid.Clone()
    $zero[$field] = 0
    $null = ConvertTo-ZhihuProfileSnapshot ([pscustomobject]$zero)
}
$wrongUser = $valid.Clone()
$wrongUser.url_token = 'another-user'
$rejected = $false
try { $null = ConvertTo-ZhihuProfileSnapshot ([pscustomobject]$wrongUser) }
catch { $rejected = $true }
if (-not $rejected) { throw 'Accepted another account.' }
Write-Output 'PASS: account identity, all four metrics, missing/invalid counts, and genuine zero.'
