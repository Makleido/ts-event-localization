# Description

This is a alternative for other localization options, if they are not sufficient for one's needs. The main reason this was made, is that i used other localization packages for development, and had many problems, usually because of how they handled the language switching, i didn't like the url path change, and its configuration was tedious, broke so many times, and with nextjs, it usually did not work correcly, the cookie was not set, or rerouting on same page to other language, but same page caused issues like switching pages, the language switched back, middleware was not fired, etc...

This package now uses event emitter to send events when language change is needed, and saves options into cookies. The language change is handled by a exported method from the `useTranslation` hook.

# Usage

## Config

1. Add your languages to the `ELanguageType` enum
2. Update `convertLangToEnum` accordingly
3. When you add a new localization file, add its import to `types.ts` just like how it looks now with `example.json`
4. update the `LANG_COOKIE_KEY` in `constants.ts` if you want to change the key of where the current language is saved in the cookies

## SSR import and init

Import `getServerTranslation` from `useServerTranslation` and get the `translate` exported method like this:

```bash
const { translate } = await getServerTranslation()
```

`getServerTranslation` has a `page` parameter which can define which localization file to use.

## Client side import and init

Import `useTranslation` from `useTranslation` and get the `translate` exported method like this:

```bash
const { translate} = useTranslation()
```

`useTranslation` has a `page` parameter which can deifne which localization file to use.

## Everyday usage example (Next JS)

### SSR

```bash
import { getServerTranslation } from "./useServerTranslation"

export default async function ExampleSSRComponent() {
    const { translate } = await getServerTranslation("example");

    const exampleVariable = "exampleText";

    return (<div>
        {translate("exampleText")}
        {translate(exampleVariable)}
        {translate("exampleVariable", { count: 3 })}
        {translate("exampleConditional", { count: 1 })}
        {translate("exampleConditional", { count: 3 })}
    </div>);
}
```

we currently don't have a default, so we use the example, default currently is "en", or if the language is switched, the other langs enum

It is `getServerTranslation` for SSR as you can't use the `useHook` format there.

### Client side

```bash
"use client";

import { useTranslation } from "./useTranslation"

export default function ExampleClientComponent() {
    const { translate } = useTranslation("example");

    const exampleVariable = "exampleText";

    return (<div>
        {translate("exampleText")}
        {translate(exampleVariable)}
        {translate("exampleVariable", { count: 3 })}
        {translate("exampleConditional", { count: 1 })}
        {translate("exampleConditional", { count: 3 })}
    </div>);
}
```

### Note

- You can use variables, custom strings, and strings from tips to use the translate method.
- The translate method has a variables optional object in the parameters in case you need variables in your text.
- There is a conditional state represented with `_plural` in cases like having one or more items, where we want to say `There is 1 item`, or `There is 2 items`, where the text is almost identical, but the count changes the meaning, there is built in logic for handling numbers with this issue, but can be expanded in the future.
