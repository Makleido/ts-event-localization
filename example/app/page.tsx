import ExampleClientComponent from "@/src/components/ExampleComponent";
import LanguageSwitch from "@/src/components/LanguageSwitch";
import { getServerTranslation } from "@/src/localization/useServerTranslation";

export default async function Home() {
  const { translate, lang } = await getServerTranslation("example");

  const exampleVariable = "exampleText";

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="p-4 rounded-2xl shadow-lg">
        <p>{translate("exampleText")}</p>
        <p>{translate(exampleVariable)}</p>
        <p>{translate("exampleVariable", { count: 3 })}</p>
        <p>{translate("exampleConditional", { count: 1 })}</p>
        <p>{translate("exampleConditional", { count: 3 })}</p>
      </div>
      <ExampleClientComponent lang={lang} />
      <LanguageSwitch lang={lang} />
    </div>
  );
}
