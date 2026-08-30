# Ghid Build & Code Signing pentru ZED-ZEN Media Converter

## De ce antivirusurile detectează aplicația ca virus?

Aplicațiile **nesemnate digital** sunt considerate suspecte de:
- Windows SmartScreen
- Antivirusuri (Windows Defender, Kaspersky, Avast, etc.)

**Soluția**: Semnează digital (code signing) aplicația cu un certificat valid.

---

## Pași pentru Build

### 1. Instalare dependențe

```bash
npm install
```

### 2. Build fără Code Signing (pentru testare)

```bash
npm run make          # Windows: installer Squirrel + zip portabil -> out/make/
npm run make:mac      # macOS:   dmg (arhitectura mașinii) -> dist/
npm run make:linux    # Linux:   AppImage + deb -> dist/
```

`make:mac` și `make:linux` rulează `electron-forge package` și apoi împachetează
directorul rezultat cu `electron-builder --prepackaged` (vezi `scripts/dist.js`).

### 3. Build CU Code Signing (pentru distribuție)

#### Pasul A: Obține un certificat Code Signing

**Opțiunea 1 - EV Code Signing (Recomandat, ~300-500€/an)**
- [DigiCert EV Code Signing](https://www.digicert.com/signing/code-signing-certificates)
- [Sectigo EV Code Signing](https://sectigo.com/ssl-certificates-tls/code-signing)
- [GlobalSign EV Code Signing](https://www.globalsign.com/en/code-signing-certificate)

✅ Avantaje EV:
- Elimină IMEDIAT avertismentele SmartScreen
- Încredere maximă din partea antivirusurilor
- Certificatul e pe USB token (securizat)

**Opțiunea 2 - OV Code Signing (~100-200€/an)**
- [Sectigo OV Code Signing](https://sectigo.com/ssl-certificates-tls/code-signing)
- [Comodo Code Signing](https://comodosslstore.com/codesigning.aspx)

⚠️ Dezavantaje OV:
- SmartScreen necesită "reputație" (multe instalări înainte să dispară avertismentul)
- Certificat livrat ca fișier .pfx

#### Pasul B: Configurează variabilele de mediu

**Pentru certificat .pfx (OV):**

Windows CMD:
```cmd
set WINDOWS_CERTIFICATE_FILE=C:\path\to\certificate.pfx
set WINDOWS_CERTIFICATE_PASSWORD=parola-ta-secreta
npm run make
```

Windows PowerShell:
```powershell
$env:WINDOWS_CERTIFICATE_FILE = "C:\path\to\certificate.pfx"
$env:WINDOWS_CERTIFICATE_PASSWORD = "parola-ta-secreta"
npm run make
```

Linux/Mac (cross-compile):
```bash
export WINDOWS_CERTIFICATE_FILE=/path/to/certificate.pfx
export WINDOWS_CERTIFICATE_PASSWORD=parola-ta-secreta
npm run make
```

**Pentru certificat EV pe USB token:**

Folosește SignTool direct după build:
```cmd
signtool sign /tr http://timestamp.digicert.com /td sha256 /fd sha256 /a "out\make\squirrel.windows\x64\ZedZen-Media-Converter-Setup.exe"
```

---

## Build automat & release (GitHub Actions)

- **CI** (`.github/workflows/ci.yml`) – la fiecare push/PR: `npm ci`, `npm run lint`,
  `npm run package` pe Linux, pornește aplicația 20s sub Xvfb și urcă directorul
  împachetat ca artifact (7 zile).
- **Release** (`.github/workflows/release.yml`) – la un tag `v*` (sau manual din
  *Actions → Release → Run workflow*): build pe Windows / macOS (arm64) / Linux și,
  DOAR pentru tag-uri, atașează fișierele la un **GitHub Release în draft**.

Cum scoți o versiune:

```bash
# 1. actualizează "version" în package.json + secțiunea din CHANGELOG.md, apoi:
git tag v1.0.0
git push origin main --tags
# 2. așteaptă workflow-ul Release, apoi publică draftul de pe
#    https://github.com/Jamaalx/zed-zen-converter/releases
```

⚠️ **Build-urile din CI NU sunt semnate** (nici Windows, nici macOS – nu există certificat
sau cont Apple Developer configurat). Sunt funcționale, dar:
- Windows SmartScreen afișează „Windows protected your PC" → *More info → Run anyway*;
- macOS Gatekeeper refuză prima deschidere → click-dreapta → *Open*, sau
  `xattr -d com.apple.quarantine "/Applications/ZED-ZEN Media Converter.app"`.

Când ai un certificat, setează secretele `WINDOWS_CERTIFICATE_FILE` /
`WINDOWS_CERTIFICATE_PASSWORD` (Windows, vezi mai sus) și `CSC_LINK` / `CSC_KEY_PASSWORD`
+ `APPLE_ID` / `APPLE_APP_SPECIFIC_PASSWORD` / `APPLE_TEAM_ID` (macOS, electron-builder)
în *Settings → Secrets* și scoate `CSC_IDENTITY_AUTO_DISCOVERY=false` din workflow.

---

## Structura output-ului

După `npm run make`, vei găsi:

```
out/
├── make/
│   ├── squirrel.windows/
│   │   └── x64/
│   │       └── ZedZen-Media-Converter-Setup.exe  ← Installer Windows
│   └── zip/
│       └── win32/
│           └── x64/
│               └── ZED-ZEN Media Converter-win32-x64.zip  ← ZIP portabil
```

---

## Verificare semnătură

După semnare, verifică că totul e OK:

```cmd
signtool verify /pa /v "out\make\squirrel.windows\x64\ZedZen-Media-Converter-Setup.exe"
```

---

## Alternative GRATUITE (dar mai puțin eficiente)

### 1. Submitere la Microsoft pentru analiză
- Trimite aplicația la: https://www.microsoft.com/en-us/wdsi/filesubmission
- Microsoft va analiza și poate whitelist-ui aplicația

### 2. Submitere la VirusTotal
- Upload la https://www.virustotal.com
- Antivirusurile vor învăța că e sigură (poate dura săptămâni)

### 3. Submitere directă la vendorii AV
- Kaspersky: https://virusdesk.kaspersky.com
- Avast/AVG: https://www.avast.com/false-positive-file-form.php
- ESET: https://support.eset.com/en/kb141

---

## Sfaturi suplimentare

1. **Evită nume suspecte** - Nu numi executabilul `crack.exe`, `keygen.exe`, etc.
2. **Include metadata completă** - Am configurat deja în `forge.config.js`
3. **Folosește HTTPS** pentru download - Browsere-le marchează HTTP ca nesigur
4. **Publică pe GitHub Releases** - Microsoft are încredere în GitHub
5. **Cere utilizatorilor feedback** - Dacă tot primesc avertismente, fă submit la AV vendors

---

## Comenzi utile

| Comandă | Descriere |
|---------|-----------|
| `npm start` | Rulează în mod dezvoltare |
| `npm run package` | Împachetează fără installer |
| `npm run make` | Creează installer-ele Windows (Squirrel + zip) |
| `npm run make:mac` / `npm run make:linux` | dmg, respectiv AppImage + deb, în `dist/` |
| `npm run make:nsis` | Installer NSIS (Windows, alternativ la Squirrel) |
| `npm run lint` | ESLint (rulează și în CI) |
| `npm run publish` | Publică (necesită configurare GitHub) |
