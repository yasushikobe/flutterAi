# Azure AI

## Vision Studio を使ってみる。

- https://portal.vision.cognitive.azure.com に接続します。  

  ![fig1](attach/20220925182021.png)  
  <br/>

- `Sign in to Azure` より Sign in を進めます。  

  ![fig1](attach/20220925182143.png)  
  ログインができました。  
  複数のAzureアカウントを持っている方は、実行対象のアカウントに変更します。  
  <br/>

- `Extract text from images` を選択します。  

  ![fig1](attach/20220925182421.png)  
  この画面の中では、`RESOURCE`を選択します。 存在しない方は、作成を進めます。  
  この例では、`ocrPractice`というリソースが選択されています。  
  <br/>

- OCR対象のファイルを準備します。

  ![fig1](attach/20220925182639.png)  
  このファイルを、Vision StudioのDrag and dropエリアにドラッグをします。  
  <br/>

- OCR Scan結果が表示されます。  
  
  ![fig1](attach/20220925182842.png)  
  <br/>

- Result JSON Dataを観察してみましょう。  
  
  ![fig1](attach/20220925183431.png)  
  [result.json](./result.json)
  このように、行・列情報、信頼度、テキスト情報が構造化されて返却されています。  

