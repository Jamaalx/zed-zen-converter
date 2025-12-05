; Custom NSIS installer script for ZED-ZEN Media Converter
; This adds professional touches to the installer

!macro customHeader
  ; Set installer colors
  !define MUI_BGCOLOR "FFFFFF"
  !define MUI_TEXTCOLOR "333333"
!macroend

!macro preInit
  ; Pre-installation checks
  SetRegView 64
!macroend

!macro customInit
  ; Custom initialization
!macroend

!macro customInstall
  ; Create additional shortcuts
  CreateShortCut "$DESKTOP\ZED-ZEN Media Converter.lnk" "$INSTDIR\ZedZen-Converter.exe"

  ; Register file associations (optional)
  ; WriteRegStr HKCR ".zedzen" "" "ZedZenConverter.File"
!macroend

!macro customUnInstall
  ; Clean up shortcuts
  Delete "$DESKTOP\ZED-ZEN Media Converter.lnk"

  ; Clean up registry entries if any
  ; DeleteRegKey HKCR ".zedzen"
!macroend
