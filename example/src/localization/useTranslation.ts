import { useCallback, useEffect, useMemo, useState } from "react";
import { eventEmitter } from "./utils/eventEmitter";
import { ELanguageType } from "./utils/languageType";
import { LooseTranslationKeys } from "./config/types";
import {
  AUTO_REFRESH_ON_LANG_CHANGE,
  LANG_COOKIE_KEY,
} from "./config/constants";
import { convertLangToEnum } from "./utils/helpers";

const setLanguageInCookies = (language: ELanguageType) => {
  if (typeof document !== "undefined") {
    document.cookie = `${LANG_COOKIE_KEY}=${language}; path=/; max-age=31536000`;
  }
};

// Cache to store promises and results for Suspense
const translationCache: Record<
  string,
  { promise?: Promise<any>; data?: any; error?: any }
> = {};

/**
 * Client Side localization hook
 *
 * @param page json files name without extension
 * @description This hook is used to handle localization in the client side. It loads the translations from the json files and sets the language in cookies.
 */
export function useTranslation(initialLanguage?: string, page?: string) {
  const convertedInitialLanguage = convertLangToEnum(initialLanguage || "en");
  const [lang, setLang] = useState<ELanguageType>(convertedInitialLanguage);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const match =
        document.cookie
          .replaceAll(" ", "")
          .split(";")
          .find((cookie) => cookie.startsWith(LANG_COOKIE_KEY + "=")) ?? null;
      const returnVal = match
        ? (match.replace(LANG_COOKIE_KEY + "=", "") as ELanguageType)
        : ELanguageType.EN;
      if (!match) {
        setLanguageInCookies(returnVal);
      }
      setLang(returnVal);
    }
  }, []);

  // Suspense Logic: Throw promise if data is missing
  const fileName = page || lang;
  const cacheKey = `${lang}-${fileName}`;

  if (!translationCache[cacheKey]) {
    translationCache[cacheKey] = {};
  }

  const cacheEntry = translationCache[cacheKey];

  if (!cacheEntry.data && !cacheEntry.error) {
    if (!cacheEntry.promise) {
      cacheEntry.promise = import(`./${lang}/${fileName}.json`)
        .then((module) => {
          cacheEntry.data = module.default;
        })
        .catch((err) => {
          cacheEntry.error = err;
          cacheEntry.data = {}; // Fallback to empty object on error
        });
    }
    throw cacheEntry.promise;
  }

  const translations = cacheEntry.data || {};

  const handleLanguageChange = useCallback(
    (language: ELanguageType, callback?: () => void) => {
      setLang(language);
      setLanguageInCookies(language);
      eventEmitter.emit("languageChange", language);
      if (AUTO_REFRESH_ON_LANG_CHANGE && !callback) {
        setTimeout(() => {
          window.location.reload();
        }, 200);
        return;
      }
      if (callback) {
        callback();
      }
    },
    [],
  );

  /**
   * @param key key to translate, key can be smth or smth.smthElse.smthAgain
   * @description Translates a key to the current language
   * @returns string
   */
  const translate = useCallback(
    (key: LooseTranslationKeys, values?: Record<string, any>) => {
      const resolveKey = (targetKey: string) => {
        const keys = targetKey.split(".");
        let value: any = translations;

        for (const k of keys) {
          if (value && typeof value === "object" && k in value) {
            value = value[k];
          } else {
            return undefined;
          }
        }
        return value;
      };

      const singular = resolveKey(key);
      const plural = resolveKey(`${key}_plural`);
      let value = singular;

      if (values && typeof plural === "string") {
        let countVal = values.count;

        if (typeof countVal !== "number") {
          const getVars = (str: string) =>
            (str.match(/{{(.*?)}}/g) || []).map((m) =>
              m.replace(/{{|}}/g, "").trim(),
            );

          const allVars = new Set([
            ...(typeof singular === "string" ? getVars(singular) : []),
            ...getVars(plural),
          ]);

          for (const varName of allVars) {
            if (typeof values[varName] === "number") {
              countVal = values[varName];
              break;
            }
          }
        }

        if (typeof countVal === "number" && countVal !== 1) {
          value = plural;
        }
      }

      if (typeof value === "string") {
        if (values) {
          return value.replace(/{{(.*?)}}/g, (match, p1) => {
            const key = p1.trim();
            return values[key] !== undefined ? String(values[key]) : match;
          });
        }
        return value;
      }
      return key;
    },
    [translations],
  );

  useEffect(() => {
    const handleGlobalLanguageChange = (newLang: ELanguageType) => {
      setLang(newLang);
    };

    eventEmitter.on("languageChange", handleGlobalLanguageChange);

    return () => {
      eventEmitter.off("languageChange", handleGlobalLanguageChange);
    };
  }, []);

  return useMemo(
    () => ({
      lang,
      translate,
      handleLanguageChange,
    }),
    [lang, translate, handleLanguageChange],
  );
}
