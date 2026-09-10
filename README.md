# MantencionesPC

Aplicación Ionic Angular para gestionar mantenciones y reparaciones de computadores en Web y Android.

## Estado actual

- Ionic 9, Angular 22, TypeScript 6 y Capacitor 8.
- Firebase modular SDK integrado directamente, sin AngularFire por incompatibilidad actual con Angular 22.
- Login por correo, registro, Google y recuperación de contraseña.
- Modelos tipados para usuarios, servicios, solicitudes, equipos y pagos.
- AuthGuard y AdminGuard preparados para roles mediante custom claims.
- Servicios base para Firestore, Storage y contacto por WhatsApp.
- Reglas iniciales en `firestore.rules` y `storage.rules`.

## Configuración Firebase

1. Crea un proyecto en Firebase Console.
2. Activa Authentication con Email/Password y Google.
3. Crea Firestore Database y Storage.
4. Registra una aplicación Web y copia sus valores en `src/environments/environment.ts` y `environment.prod.ts`.
5. Publica las reglas con Firebase CLI: `firebase deploy --only firestore:rules,storage`.
6. Para otorgar administración, asigna el custom claim `admin: true` desde un backend confiable o Firebase Admin SDK. Nunca desde el formulario público.

## Ejecutar

```bash
npm install
npm start
```

Para Android, cuando esté instalado Android Studio y el SDK:

```bash
npx cap add android
npm run build
npx cap sync android
npx cap open android
```

El proyecto requiere Node `24.15.0+` para Angular 22.