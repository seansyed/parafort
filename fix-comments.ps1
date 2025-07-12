$lines = Get-Content 'c:\Trae\ParaFort\shared\schema.ts'
$inComment = $false

for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match '^// \\export.*\{$') {
        $inComment = $true
        $lines[$i] = $lines[$i] -replace '^// \\export', '// export'
    }
    elseif ($inComment -and $lines[$i] -match '^\}\);$') {
        $lines[$i] = '// ' + $lines[$i]
        $inComment = $false
    }
    elseif ($inComment -and $lines[$i] -match '^  ') {
        $lines[$i] = '//' + $lines[$i]
    }
}

Set-Content 'c:\Trae\ParaFort\shared\schema.ts' -Value $lines