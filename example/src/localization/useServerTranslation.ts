"use server";

import { cookies } from "next/headers";
import { convertLangToEnum } from "./utils/helpers";
import { LooseTranslationKeys } from "./config/types";
import { LANG_COOKIE_KEY } from "./config/constants";

/**
 * SSR localization hook
 *
 * @param page json files name without extension
 * @description This function is used to load the localization files on the server side.
 */
export async function getServerTranslation(page?: string) {
  const cookiesInstance = await cookies();
  const lang = convertLangToEnum(
    cookiesInstance.get(LANG_COOKIE_KEY)?.value ?? "en",
  );

  let translations: Record<string, string> = {};
  const fileName = page || lang;
  try {
    const response = await import(`./${lang}/${fileName}.json`);
    translations = response.default;
  } catch {}

  /**
   * @param key key to translate, key can be smth or smth.smthElse.smthAgain
   * @description Translates a key to the current language
   * @returns string
   */
  const translate = (
    key: LooseTranslationKeys,
    values?: Record<string, any>,
  ) => {
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
  };

  return {
    lang,
    translate,
  };
}
