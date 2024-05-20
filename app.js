/// サーバーサイド

// Expressライブラリがエクスポートしているexpressメソッドのインポート
const express = require("express");
// expressメソッドの実行（インスタンス生成）
const app = express();
// サーバー起動
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`ポート${PORT}でサーバーを起動しました。`);
});

// index.htmlの読み込み
app.use(express.static("./public"));

// mongoose(データベース)との接続
require('dotenv').config();
const connectDB = require("./mongodb_setting/mongoose");
connectDB(process.env.MONGO_URL);

// タスクデータのデータスキーマ
const TaskSchema = require("./mongodb_setting/task_chema");

// expressでjson形式を用いる
app.use(express.json());

// ルーティング設定
// 全てのタスクを取得（叩かれ方：getTaskFromSeverメソッドの呼び出し）
app.get("/tasks", async (req, res) => {
  try {
    const allDataFromDatabase = await TaskSchema.find({});
    res.status(200).json(allDataFromDatabase);
  } catch (err) {
    res.status(500).json(err);
  }
});

// タスクを新規作成（叩かれ方：送信ボタンを押す＝formDOMのsubmitイベントの発火）
app.post("/tasks", async (req, res) => {
  try {
    const addedDataToDatabase = await TaskSchema.create(req.body);
    res.status(200).json(addedDataToDatabase);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 特定のタスクを取得（叩かれ方：getOneTaskFromSeverAndShowThemToEditScreenメソッドの呼び出し＝編集リンクへ遷移）
app.get("/tasks/:id", async (req, res) => {
  try {
    const oneDataFromDatabase = await TaskSchema.findOne({
      _id: req.params.id,
    });

    // エラーハンドリング1
    if (!oneDataFromDatabase) {
      return res.status(404).json(`_id:${req.params.id}は存在しません`);
    }
    res.status(200).json(oneDataFromDatabase);

    // エラーハンドリング2
  } catch (err) {
    res.status(500).json(err);
  }
});

// タスクの編集（叩かれ方：編集ボタンを押す＝singleTaskFormDOMのsubmitイベントの発火）
app.patch("/tasks/:id", async (req, res) => {
  try {
    const editedDataToDatabase = await TaskSchema.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );

    // エラーハンドリング
    if (!editedDataToDatabase) {
      return res.status(404).json(`_id:${req.params.id}は存在しません`);
    }
    // res.redirect("/tasks");
    res.status(200).json(editedDataToDatabase);
  } catch (err) {
    res.status(500).json(err);
  }
});

// タスクの削除（叩かれ方：削除ボタンを押す＝ tasksDOMのclickイベントの発火）
app.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedDataToDatabase = await TaskSchema.findOneAndDelete({
      _id: req.params.id,
    });

    // エラーハンドリング
    if (!deletedDataToDatabase) {
      return res.status(404).json(`_id:${req.params.id}は存在しません`);
    }

    res.status(200).json(deletedDataToDatabase);
  } catch (err) {
    res.status(500).json(err);
  }
});
