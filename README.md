# モチベーション
TypeScriptとAWSの勉強のために作成

# 実装のポイント
CDK（TypeScript）を使ってインフラのプロビジョニングとバックエンド（Lambda）を構築する
よくある実装として認証・認可、決済、プッシュ通知などを組み込む

## 　認証・認可
マイクロサービスを意識してAPI GatewayとIDaaSを組み合わせ、トークンベースで認証・認可を行う
Lambda AuthorizerでAuth0の署名検証をする

## 決済
外部決済サービスのStripeを組み込み、サブスクリプション決済機能を実装する

## プッシュ通知
AWS SNSを利用する

# その他要件
個人開発として継続して拡張を行っていきたい為コストと可用性を考慮し、サーバレスやマネージメントサービスを積極的に使っていく（結果として幅広く知見を獲得できる）
将来的なアーキテクチャの変更を考え、Amplifyのような統合開発環境は使用せず、サービスごとに切り分けられる構成にする

# アーキテクチャ
https://drive.google.com/file/d/1z5lvflFC52PdTHaQGxmee1XbcBWz67DY/view?usp=sharing

# 今後の検討事項
Next.jsのホスティング先をVercelからCloudFront + Lambda@Edgeに移行したい
CDKのLambdaはServerless Frameworkへ置き換えたほうがテストと管理が行いやすそう
型定義のためのOpenAPIをAPI Gatewayに組み込みたい
Aurora Serverless v2の利用を検討したい
チャットの画像送信機能検討
API Gateway WebSocketの利用検討



# Welcome to your CDK TypeScript project

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`SkiAppBackendStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

