$lines = Get-Content 'skill-gui.html'
$closeIdx = 0
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '</html>') {
        $closeIdx = $i
        break
    }
}
Write-Host "Found </html> at line $($closeIdx + 1) of $($lines.Count)"
$trimmed = $lines[0..$closeIdx]
$trimmed | Set-Content 'skill-gui.html' -Encoding UTF8
Write-Host "Done. File now has $($trimmed.Count) lines."
