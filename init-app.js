const fs = require('fs');
const { execSync } = require('child_process');

const readmePath = './README.md';
const tempReadmePath = './README.md.bak';

// Copiar README.md a un archivo temporal
if (fs.existsSync(readmePath)) {
  fs.copyFileSync(readmePath, tempReadmePath);
}

// Ejecutar el comando para crear la aplicación NestJS
execSync('docker-compose run --rm app nest new . -p npm --directory .', { stdio: 'inherit' });

// Restaurar README.md desde el archivo temporal
if (fs.existsSync(tempReadmePath)) {
  fs.copyFileSync(tempReadmePath, readmePath);
  fs.unlinkSync(tempReadmePath); // Eliminar el archivo temporal
}

// Agregar comandos adicionales al package.json
const packageJsonPath = './package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

packageJson.scripts['docker:build'] = 'docker-compose up --build';
packageJson.scripts['docker:start'] = 'docker-compose up';
packageJson.scripts['docker:stop'] = 'docker-compose down';
packageJson.scripts['docker:rebuild'] = 'npm run docker:stop && npm run docker:build';
packageJson.scripts['docker:nest'] = 'docker-compose run --rm app nest';

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Eliminar el archivo init-app.js después de ejecutarlo
fs.unlinkSync(__filename);

// Eliminar el archivo de respaldo README.md.bak si existe
if (fs.existsSync(tempReadmePath)) {
  fs.unlinkSync(tempReadmePath);
}