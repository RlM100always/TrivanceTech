$content = Get-Content src/data/blogPosts.ts -Raw

# Use double quotes for the regex to avoid single quote escaping issues
$regex = [regex]"(answer: ')(.*?)('(?=,?\s*[}\]],?))"
$fixed = $regex.Replace($content, {
    param($m)
    $prefix = $m.Groups[1].Value
    $answer = $m.Groups[2].Value
    $suffix = $m.Groups[3].Value
    # Escape apostrophes in the answer
    $answerFixed = $answer -replace "(?<!\\\\)'", "\\'"
    return $prefix + $answerFixed + $suffix
})

Set-Content src/data/blogPosts.ts -Value $fixed -NoNewline