// mongooseライブラリのインポート及びインスタンス化
const mongoose = require("mongoose");

// mongooseと接続
const connectDB = (url) => {
  mongoose
    .connect(url)
    .then(() => {
      console.log("データベースと接続しました");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB;
