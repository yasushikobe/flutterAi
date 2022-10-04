/**
 * 実行には、config/default.yaml ファイルを作成する必要があります。
 * Azure Console Computer Vision の概要ページよりエンドポイント・キー情報を参照し、
 * default.yamlファイルに設定してください。
 * 初回起動時には、事前に npm install 実行が必要です。
 * 実行コマンドは、 node index.mjs です。

```default.yaml
endpoint: "https://.../"
apikey: "xxxxxxxxxxxxxxxxxxx"
pngFile: "xxxxxxxx.png"
```
*/

import { readFile } from "fs/promises";
import axios from "axios";
import { setTimeout } from "timers/promises";
import config from "config";
async function main() {
  const analyzeUrl = `${config.endpoint}vision/v3.2/read/analyze`;
  const binData = await readFile(config.pngFile);
  const resultLocation = await axios.post(analyzeUrl, binData, {
    headers: {
      "Content-Type": "image/png",
      "Ocp-Apim-Subscription-Key": config.apikey,
    },
  });
  const location = resultLocation.headers["operation-location"];
  let resultLines = [];
  while (true) {
    await setTimeout(200);
    const resultValue = await axios.get(location, {
      headers: { "Ocp-Apim-Subscription-Key": config.apikey },
    });
    if (resultValue.data.status !== "succeeded") continue;
    resultLines = resultValue.data.analyzeResult.readResults[0].lines.map(
      (line) => line.text
    );
    break;
  }
  console.log(resultLines);
}
main();
