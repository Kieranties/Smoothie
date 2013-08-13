﻿param(
    [Parameter(Mandatory=$true,Position=0)]
    [string]$apiKey,
    [Parameter(Mandatory=$true,Position=1)]
    [string]$apiSecret,
    [ValidateScript({ Test-Path $_ })]
    [string]$workingDirectory = ".."
)

# Set the api details
$rtm = "$workingDirectory\js\rtm.js"
$newRtm = Get-Content $rtm | % {
    $_ -replace '##APIKEY##',$apiKey `
       -replace '##APISECRET##', $apiSecret
}
Set-Content -Value $newRtm -Path $rtm