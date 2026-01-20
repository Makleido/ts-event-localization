// Import language files
import en from "../en/en.json";
import example from "../en/example.json";

// Add your language files to this type
export type Translations = typeof example & typeof en;

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

// When strict typing is needed use this
export type TranslationKeys = NestedKeyOf<Translations>;

// If you want to be lenient and use variables or custom strings, use this
export type LooseTranslationKeys = TranslationKeys | (string & {});
