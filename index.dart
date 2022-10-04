/**
 * 実行には、config/default.yaml ファイルを作成する必要があります。
 * Azure Console Computer Vision の概要ページよりエンドポイント・キー情報を参照し、
 * default.yamlファイルに設定してください。
 * 初回起動時には、事前に dart pub get 実行が必要です。
 * 実行コマンドは、 dart index.dart です。

```default.yaml
endpoint: "https://.../"
apiKey: "xxxxxxxxxxxxxxxxxxx"
pngFile: "xxxxxxxx.png"
```
*/

import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:yaml/yaml.dart';
import 'package:http/http.dart' as http;

final yamlFile = File('config/default.yaml');
final config = loadYaml(yamlFile.readAsStringSync());
final analyzeUrl = "${config['endpoint']}vision/v3.2/read/analyze?language=ja";
final apiKey = config['apiKey'];
final pngFile = config['pngFile'];

Future<List<String>> analyze(Uint8List pngData) async {
  final resultLocation = await http.post(Uri.parse(analyzeUrl),
      headers: {
        "Content-Type": "image/png",
        "Ocp-Apim-Subscription-Key": apiKey,
      },
      body: pngData);
  final location = resultLocation.headers["operation-location"];
  List<dynamic> resultLines;
  while (true) {
    await new Future.delayed(new Duration(milliseconds: 200));
    final resultValueString = await http.get(
      Uri.parse(location),
      headers: {"Ocp-Apim-Subscription-Key": apiKey},
    );
    final resultValue = jsonDecode(resultValueString.body);
    if (resultValue['status'] != "succeeded") continue;
    resultLines = resultValue['analyzeResult']['readResults'][0]['lines']
        .map((line) => line['text'].toString())
        .toList();
    break;
  }
  return resultLines.cast<String>();
}

void main() async {
  final pngData = File(pngFile).readAsBytesSync();
  final lines = await analyze(pngData);
  lines.forEach((line) {
    print(line);
  });
}
