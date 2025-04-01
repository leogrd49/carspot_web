/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PG_USER: string
    readonly VITE_PG_HOST: string
    readonly VITE_PG_DATABASE: string
    readonly VITE_PG_PASSWORD: string
    readonly VITE_PG_PORT: string
    readonly VITE_PG_SSL: string
    // Ajoutez ici d'autres variables d'environnement si nécessaire
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
