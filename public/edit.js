/// クライアントサイド

let id;

// 特定のタスクを取得
const getOneTaskFromSeverAndIndertThemToEditScreen = async () => {
  // windowオブジェクトのlocationプロパティ（locationプロパティもオブジェクト）
  // console.log(window.location);

  // クエリパラメータを取得
  const queryparameter = window.location.search;
  // console.log(queryparameter);

  // クエリパラメータからid部分を取得（by URLSearchParamsのインスタンスメソッドget）
  id = new URLSearchParams(queryparameter).get("id");
  // console.log(id);

  // パス叩き
  const oneDataFromSever = await axios.get(`/tasks/${id}`);

  const { data: oneTaskFromSever } = oneDataFromSever;
  const { _id, completed, name } = oneTaskFromSever;

  // idと名前と完了未完了を編集画面に反映
  const taskEditIdDOM = document.querySelector(".task-edit-id");
  taskEditIdDOM.textContent = _id;
  const taskEditNameDOM = document.querySelector(".task-edit-name");
  taskEditNameDOM.value = name;
  const taskEditCompletedDOM = document.querySelector(".task-edit-completed");
  taskEditCompletedDOM.checked = completed;
};

getOneTaskFromSeverAndIndertThemToEditScreen();

// タスクの編集
const singleTaskFormDOM = document.querySelector(".single-task-form");
singleTaskFormDOM.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();

    // 編集後のタスク名を取得
    const taskEditNameDOM = document.querySelector(".task-edit-name");
    const inputedEditedTaskNameByClient = taskEditNameDOM.value;
    // タスクの完了未完了を取得
    const taskEditCompletedDOM = document.querySelector(".task-edit-completed");
    const isCheked = taskEditCompletedDOM.checked;

    // パス叩き
    axios.patch(`/tasks/${id}`, {
      name: inputedEditedTaskNameByClient,
      completed: isCheked,
    });

    // ブラウザ内臓のjsファイルにルートパスをgetで叩かせている。（このjsファイルから叩かれるわけではない。）
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
});
