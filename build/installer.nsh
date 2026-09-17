; Persist the language chosen in the installer's language selector so the
; app can honor it at first launch (see main.js). LCID 1041 = Japanese,
; everything else falls back to English.
!macro customInstall
  ${if} $LANGUAGE == 1041
    FileOpen $0 "$INSTDIR\lang.txt" w
    FileWrite $0 "ja"
  ${else}
    FileOpen $0 "$INSTDIR\lang.txt" w
    FileWrite $0 "en"
  ${endif}
  FileClose $0
!macroend
