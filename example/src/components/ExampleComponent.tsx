"use client";

import { useTranslation } from "../localization/useTranslation";

interface Props {
  lang: string;
}

export default function ExampleClientComponent({ lang }: Props) {
  const { translate } = useTranslation(lang, "example");

  const exampleVariable = "exampleText";

  return (
    <div className="mt-5 p-4 rounded-2xl shadow-lg">
      <p className="mb-2 underline">{translate("thisWasClient")}</p>
      <p>{translate("exampleText")}</p>
      <p>{translate(exampleVariable)}</p>
      <p>{translate("exampleVariable", { count: 3 })}</p>
      <p>{translate("exampleConditional", { count: 1 })}</p>
      <p>{translate("exampleConditional", { count: 3 })}</p>
    </div>
  );
}
