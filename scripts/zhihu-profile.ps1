function ConvertTo-ZhihuProfileSnapshot {
    param([Parameter(Mandatory)] $Profile)

    if ($Profile.url_token -ne 'bai-ri-meng-you-54-77') {
        throw 'Unexpected Zhihu profile identity.'
    }
    $fields = [ordered]@{
        followers = 'follower_count'
        receivedVotes = 'voteup_count'
        receivedLikes = 'thanked_count'
        receivedFavorites = 'favorited_count'
    }
    $snapshot = [ordered]@{
        schemaVersion = 2
        updatedAt = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
    }
    foreach ($field in $fields.GetEnumerator()) {
        $value = $Profile.($field.Value)
        if (($value -isnot [int] -and $value -isnot [long]) -or $value -lt 0) {
            throw "Invalid or missing Zhihu count: $($field.Value)"
        }
        $snapshot[$field.Key] = $value
    }
    return $snapshot
}
