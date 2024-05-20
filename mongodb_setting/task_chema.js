// mongooseライブラリのインポート及びインスタンス化
const mongoose = require("mongoose");

// データ構造の決定
// データ名は自分で決めてよい。データのプロパティや値はmongooseの予約語。
const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "タスク名を入れてください"],
    trim: true,
    maxlength: [20, "タスク名は20文字以内で入力してください"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("task", TaskSchema);
