"use client";

import { LANGUAGE_LIST } from "../constants/constants";
import { useTranslation } from "../localization/useTranslation";
import { convertLangToEnum } from "../localization/utils/helpers";

interface Props {
  lang: string;
}

export default function LanguageSwitch({ lang }: Props) {
  const {
    lang: currentLang,
    handleLanguageChange,
    translate,
  } = useTranslation(lang);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleLanguageChange(convertLangToEnum(e.target.value));
  };

  return (
    <div className="flex flex-col gap-2 mt-10 p-4 rounded-2xl shadow-lg">
      <label htmlFor="language-switch">
        {translate("switchLanguageLabel")}
      </label>
      <select
        id="language-switch"
        value={currentLang}
        onChange={handleSelect}
        className="uppercase border border-solid rounded-md px-3 py-1.5"
      >
        {LANGUAGE_LIST.map((language) => (
          <option
            key={language}
            value={language}
            className="uppercase text-black"
          >
            {language}
          </option>
        ))}
      </select>
    </div>
  );
}
