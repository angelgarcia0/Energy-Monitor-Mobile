# Monitor de Consumo Electrico

Aplicación móvil de **EnergyMonitor** (Expo / React Native): consumo de los hogares en tiempo real, alertas, dispositivos por Bluetooth y notificaciones push.

## Integrantes:

- Juan Esteban Cortes Parra
- Miguel Angel Garcia Artunduaga

## Programa de formacion

Analisis y desarrollo de software(ADSO)

## Ficha:

3145556

---

## Requisitos

- Node.js 20 o superior y npm.
- El **gateway del backend** corriendo en el puerto `8080` (ver `energy-monitor-backend` / `energy-monitor-infra`).
- Cuenta en [expo.dev](https://expo.dev) solo para generar builds con EAS.
- Android Studio (build local Android) o Xcode (iOS).

## Instalación

```bash
npm ci
copy .env.example .env    # en macOS/Linux: cp .env.example .env
```

## Variables `EXPO_PUBLIC_*`

Se leen de `.env` (ver `.env.example`, que ya documenta cada una). Todas viajan **dentro del APK**: nunca llevar secretos.

| Variable | Para qué sirve | Por defecto |
|---|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | Origen del backend **sin** `/api/v1`. | `http://localhost:8080` |
| `EXPO_PUBLIC_EAS_PROJECT_ID` | Id del proyecto de Expo, necesario para pedir token de push. Sin él, Ajustes → Notificaciones avisa de que push no está configurado. | vacío (push desactivado) |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Client ID OAuth de tipo **Web** para entrar con Google. Vacío = el botón de Google queda deshabilitado. | vacío |

`EXPO_PUBLIC_API_BASE_URL` según dónde se ejecute la app:

| Dónde corre la app | Valor |
|---|---|
| Web o simulador de iOS | `http://localhost:8080` |
| Emulador de Android | `http://10.0.2.2:8080` |
| Teléfono físico | `http://<IP-del-PC>:8080` (misma red) |

> `EXPO_ACCESS_TOKEN` **no** es una variable de esta app: la usa el backend y jamás debe escribirse aquí.

## Ejecutar

```bash
npm start          # Expo Dev Tools / Metro
npm run android    # build nativa local de Android (expo run:android)
npm run ios        # build nativa local de iOS (expo run:ios)
```

El enlace **Bluetooth** (`react-native-ble-plx`) es nativo: no funciona en Expo Go, hay que usar una build de desarrollo (`expo run:android` o el perfil `development` de EAS con `expo-dev-client`).

## Construir el APK (EAS)

```bash
npx eas login                       # una vez por máquina
npx eas build --platform android --profile preview
```

- `preview` → APK de distribución interna (instalable a mano), definido en `eas.json`.
- `production` → para tienda.
- La build sale en [expo.dev](https://expo.dev) → proyecto → **Builds**.

La CI (`.github/workflows/ci-cd.yml`) lanza este mismo build automáticamente en cada push a `main`, siempre que exista el secreto de repositorio `EXPO_TOKEN`.

## Pruebas y calidad

```bash
npx tsc --noEmit   # tipos
npm run lint        # eslint (expo lint)
npm test            # jest
```

Los mismos tres pasos corre la CI en cada PR y en cada push a `dev` o `main`.

## Documentación

Los manuales, el catálogo de endpoints y el protocolo de pruebas (MOV-01…MOV-12) viven en el repositorio de documentación del proyecto.
