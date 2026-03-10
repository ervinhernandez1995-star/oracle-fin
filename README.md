# ⬡ ORACLE FIN — con Google Gemini (GRATIS)

## Requisitos
- Cuenta de Google (ya la tienes ✅)
- Cuenta en GitHub (gratis)
- Cuenta en Vercel (gratis)

---

## PASO 1 — Obtener tu API Key de Gemini (5 minutos, GRATIS)

1. Ve a: **https://aistudio.google.com/app/apikey**
2. Inicia sesión con tu cuenta Google
3. Clic en **"Create API key"**
4. Selecciona **"Create API key in new project"**
5. Copia la clave — empieza con `AIza...`
6. ¡Guárdala! La usarás en el Paso 3

> ✅ Es 100% GRATUITA — sin tarjeta de crédito
> ✅ Incluye Gemini 1.5 Flash con Google Search

---

## PASO 2 — Subir a GitHub

1. Ve a **https://github.com** → inicia sesión o crea cuenta
2. Clic en **"+"** → **"New repository"**
3. Nombre: `oracle-fin` → **Public** → **Create repository**
4. En la nueva página, clic en **"uploading an existing file"**
5. Descomprime el ZIP y arrastra TODOS los archivos al navegador
6. Clic en **"Commit changes"** ✅

---

## PASO 3 — Deploy en Vercel (GRATIS)

1. Ve a **https://vercel.com** → **Sign Up** → **Continue with GitHub**
2. Clic en **"Add New Project"**
3. Selecciona tu repositorio `oracle-fin`
4. Vercel detecta Next.js automáticamente ✅

### ⚠️ IMPORTANTE — Agregar tu API Key antes de Deploy:
En la sección **"Environment Variables"** agrega:
```
NAME:  GEMINI_API_KEY
VALUE: AIza... (tu clave de Google AI Studio)
```

5. Clic en **"Deploy"** 🚀

---

## PASO 4 — ¡Listo!

Vercel te dará una URL como:
**https://oracle-fin-tunombre.vercel.app**

✅ Funciona en cualquier navegador  
✅ Funciona en tu celular  
✅ Tu API key está segura en el servidor  
✅ Gemini busca en Google en tiempo real  
✅ HTTPS incluido y gratuito  

---

## Estructura del proyecto

```
oracle-fin/
├── pages/
│   ├── index.js         ← Interfaz completa
│   └── api/
│       └── analyze.js   ← Llama a Gemini (seguro)
├── package.json
└── next.config.js
```

---

## Límites gratuitos de Gemini

| Plan | Requests/min | Requests/día |
|------|-------------|-------------|
| Gratis | 15 RPM | 1,500/día |

Suficiente para uso personal diario sin pagar nada.
