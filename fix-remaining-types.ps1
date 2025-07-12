$content = Get-Content 'c:\Trae\ParaFort\shared\schema.ts'
$content = $content -replace '^(export type Insert.* = z\.infer<typeof insert.*Schema>;)', '// $1'
Set-Content 'c:\Trae\ParaFort\shared\schema.ts' $content
Write-Host "Fixed remaining Insert type definitions"