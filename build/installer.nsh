!macro customInit
  nsExec::ExecToLog 'taskkill /IM DiscordLyrics.exe /F /T'
  Sleep 500
!macroend

!macro customInstallMode
  StrCpy $isForceCurrentInstall "1"
!macroend
