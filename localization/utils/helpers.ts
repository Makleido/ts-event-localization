import { ELanguageType } from "./languageType";

/**
 * Translates a language code string to its corresponding ELanguageType enum value.
 * @param lang the language code to translate to enum if can
 * @returns
 */
export function convertLangToEnum(lang: string) {
  switch (lang) {
    case "en":
      return ELanguageType.EN;
    default:
      return ELanguageType.EN;
  }
}
