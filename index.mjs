/**
 * 実行には、config/default.yaml ファイルを作成する必要があります。
 * Azure Console Computer Vision の概要ページよりエンドポイント・キー情報を参照し、
 * default.yamlファイルに設定してください。
 * 初回起動時には、事前に npm install 実行が必要です。
 * 実行コマンドは、 node index.mjs です。

```default.yaml
endpoint: "https://.../"
apiKey: "xxxxxxxxxxxxxxxxxxx"
pngFile: "xxxxxxxx.png"
```
*/

import { readFile } from "fs/promises";
import { setTimeout } from "timers/promises";
import axios from "axios";
import config from "config";
const analyzeUrl = `${config.endpoint}vision/v3.2/read/analyze?language=ja`;
const apiKey = config.apiKey;
const pngFile = config.pngFile;

async function analyze(pngData) {
  const resultLocation = await axios.post(analyzeUrl, pngData, {
    headers: {
      "Content-Type": "image/png",
      "Ocp-Apim-Subscription-Key": apiKey,
    },
  });
  const location = resultLocation.headers["operation-location"];
  let resultLines = [];
  while (true) {
    await setTimeout(200);
    const resultValue = await axios.get(location, {
      headers: { "Ocp-Apim-Subscription-Key": apiKey },
    });
    if (resultValue.data.status !== "succeeded") continue;
    resultLines = resultValue.data.analyzeResult.readResults[0].lines.map(
      (line) => line.text
    );
    break;
  }
  return resultLines;
}

const pngData = await readFile(pngFile);
let result = await analyze(pngData);
console.log(result);
