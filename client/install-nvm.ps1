Invoke-WebRequest -Uri https://github.com/coreybutler/nvm-windows/releases/latest/download/nvm-setup.exe -OutFile $env:USERPROFILE\nvm-setup.exe
Start-Process -FilePath $env:USERPROFILE\nvm-setup.exe -Wait
nvm version
nvm install 20
nvm use 20