# Fix theme.liquid - Remove duplicate head, add body structure
$file = 'c:\Users\Torre\Desktop\Techauraz\layout\theme.liquid'
$c = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
$lines = [System.Collections.ArrayList]@($c -split "`n")

Write-Output "Original: $($lines.Count) lines"

# Step 1: Remove duplicate head block (lines 332-523, 0-indexed 331-522)
$lines.RemoveRange(331, 192)
Write-Output "After removing duplicate: $($lines.Count) lines"

# Step 2: Find insertion point (after ta-animations-2026)
$insertAt = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'ta-animations-2026') {
        $insertAt = $i + 1
        break
    }
}
Write-Output "Insert body structure after line: $($insertAt)"

# Step 3: Insert body structure
$bodyBlock = @(
    ""
    "</head>"
    '<body class="gradient">'
    ""
    '  <a class="skip-to-content-link button visually-hidden" href="#MainContent">'
    "    {{ 'accessibility.skip_to_text' | t }}"
    "  </a>"
    ""
    "  {% sections 'header-group' %}"
    ""
    '  <main id="MainContent" class="content-for-layout focus-none" role="main" tabindex="-1">'
    "    {{ content_for_layout }}"
    "  </main>"
    ""
    "  {% sections 'footer-group' %}"
    ""
)

$lines.InsertRange($insertAt, $bodyBlock)
Write-Output "After inserting body: $($lines.Count) lines"

# Step 4: Fix ending - remove ta-sticky-atc, keep ta-a11y-seo
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'ta-sticky-atc') {
        $lines[$i] = '{% render "ta-a11y-seo" %}'
        Write-Output "Fixed ta-sticky-atc at line $($i+1)"
        break
    }
}

# Step 5: Fix closing tags
for ($i = $lines.Count - 1; $i -gt ($lines.Count - 10); $i--) {
    if ($lines[$i] -match '</body>') {
        $lines[$i] = "</body>`r`n</html>"
        Write-Output "Fixed closing tags at line $($i+1)"
        break
    }
}

# Write result
$result = $lines -join "`n"
[System.IO.File]::WriteAllText($file, $result, [System.Text.Encoding]::UTF8)
Write-Output "DONE: $($lines.Count) lines written"
