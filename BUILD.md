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
npm run make
```

Installerul va fi generat în `out/make/`.

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
signtool sign /tr http://timestamp.digicert.com /td sha256 /fd sha256 /a "out\make\nsis\x64\ZedZenConverter Setup.exe"
```

---

## Structura output-ului

După `npm run make`, vei găsi:

```
out/
├── make/
│   ├── nsis/
│   │   └── x64/
│   │       └── ZedZenConverter Setup.exe  ← NSIS Installer (recomandat)
│   ├── squirrel.windows/
│   │   └── x64/
│   │       └── ZedZen-Media-Converter-Setup.exe  ← Squirrel Installer
│   └── zip/
│       └── win32/
│           └── x64/
│               └── ZED-ZEN Media Converter-win32-x64.zip  ← ZIP portabil
```

---

## Verificare semnătură

După semnare, verifică că totul e OK:

```cmd
signtool verify /pa /v "out\make\nsis\x64\ZedZenConverter Setup.exe"
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
| `npm run make` | Creează installer-ele |
| `npm run publish` | Publică (necesită configurare GitHub) |
