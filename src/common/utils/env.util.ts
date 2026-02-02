export function env<K extends keyof InternalImportMetaEnv>(key: K, defaultValue?: InternalImportMetaEnv[K]): InternalImportMetaEnv[K] {
  const value = import.meta.env[key]

  if(value === undefined || value === null) {
    return defaultValue as InternalImportMetaEnv[K]
  }

  return value as InternalImportMetaEnv[K]
}
