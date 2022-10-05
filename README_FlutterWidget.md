# Flutter Widget

## STEP1: 初期雛形作成

ソースコードはこちら  
https://github.com/yasushikobe/flutter_ai/tree/v0.1

Android Studioを起動します。  

![fig1](attach/20221005110045.png)  

`New Flutter Project` を選択します。  

![fig1](attach/20221005110137.png)  

`Flutter`, `Flutter SDK path`を選び、`Next`を押下。

![fig1](attach/20221005110249.png)  

key|val
---|---
Project name|flutter_ai
Project location|任意のフォルダを設定します。
Project type|Application
Organization|あなたが所属している、唯一のドメインを指定します。<br/>（独自ドメインが一般的）
Android language|Kotlin
iOS language|Swift
Platforms|Android, iOS<br/>（開発がMacの場合は両方、Windowsの場合はAndroidのみ)

上記設定後、`Finish`を押下。

![fig1](attach/20221005110651.png)  

Android Emulatorを起動し、デバッグボタンを押下する。  

![fig1](attach/20221005110827.png)  

初期サンプルアプリケーションが起動できました。  

## STEP2: カメラ撮影機能追加

ソースコードはこちら  
https://github.com/yasushikobe/flutter_ai/tree/v0.2

### 開発概説

カメラプラグインを導入します。  

![fig1](attach/20221005113505.png)  

android設定にカメラを許可設定を追加します。

![fig1](attach/20221005113832.png)  

iOS設定にカメラを許可設定を追加します。

![fig1](attach/20221005113735.png)  

アプリケーションコードを作成します。（下記、[ソースコード解説](ソースコード解説)を参照)

![fig1](attach/20221005113940.png)  

デバイスを選択し、デバッグボタンを押下します。  

![fig1](attach/20221005114114.png)  

android emulatorが起動します。  

![fig1](attach/20221005114140.png)  

右下のボタンを押すとカメラが起動されます。

![fig1](attach/20221005114526.png)  

撮影された画像が画面に反映されます。  
(Emulatorの場合、縦横判定ができない制限があります。)

![fig1](attach/20221005114551.png)  

### ソースコード解説

#### <u>パッケージの取り込み</u>

Flutter開発用に前もって準備された部品群を取り込みます。  

```dart
//ファイル入出力
import 'dart:io';
//画面構成部品
import 'package:flutter/material.dart';
//カメラ部品
import 'package:image_picker/image_picker.dart';
```

#### <u>main 関数</u>

アプリの開始関数です。  
アプリケーションクラスを生成し、runApp メソッドに渡します。  

```dart
void main() {
  runApp(const MyApp());
}
```

#### <u>アプリケーションクラス</u>

アプリケーションクラスの定義です。  
状態を持たないクラスの場合は、StatelessWidgetを継承します。  
`build()`が必須定義のメソッドです。  
下記記述では、amber色のアプリケーション枠が描画され、アプリタイトルが設定されます。  
ページ詳細は、ページクラスに記述されます。  

```dart
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FlutterAI',
      theme: ThemeData(
        primarySwatch: Colors.amber,
      ),
      home: const MyHomePage(title: 'FlutterAI'),
    );
  }
}
```

#### <u>ページクラス</u>

ページ構成を管理します。
StatefulWidgetから継承されているため、状態を持つことが許されます。  
createState()関数にて状態クラスを作成しています。  

```dart
class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}
```

#### <u>ページ状態クラス</u>

ページの状態を管理します。  
下記例では、カメラ制御のコンポーネントと、撮影された画像データを状態（変数）として保持します。  
保持された状態は、初期起動時とsetState()関数実行時に、build()関数が実行されます。  
build()関数では、その状態に合わせた画面描画を行います。  
Scaffoldクラス内部では、画面コンポーネントが階層構造で管理されます。  
それぞれの画面コンポーネントでは、ユーザ操作に合わせたイベント処理を定義できます。  
下記の例では、 FloatingActionButtonを押されたときに、 pickImage() 関数が呼び出されます。  
pickImage()関数では、カメラ撮影画像データを取得し、状態変数を更新し、画面再描画を行います。  

```dart
class _MyHomePageState extends State<MyHomePage> {
  final picker = ImagePicker();
  File? _image;

  Future pickImage() async {
    final XFile? pickedFile =
        await picker.pickImage(source: ImageSource.camera);
    setState(() {
      if (pickedFile != null) {
        _image = File(pickedFile.path);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('FlutterAI'),
      ),
      body: Center(
        child: _image == null
            ? const Text('No image selected.')
            : Image.file(_image!),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: pickImage,
        child: const Icon(Icons.add_a_photo),
      ),
    );
  }
}

```

## STEP3: OCR解析呼び出し

