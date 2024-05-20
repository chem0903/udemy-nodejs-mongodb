//// クライアントサイド

// 全てのタスクの取得と表示
const getAllTaskFromSeverAndShowThem = async () => {
  try {
    const allDataFromServer = await axios.get("/tasks");
    // console.log(allDataFromServer);
    const { data: allTasksFromSever } = allDataFromServer;

    // タスクデータ配列の展開
    const HtmlDOMArrayOfAllTasksFromSever = allTasksFromSever.map(
      (taskFromSever) => {
        // console.log(taskFromSever);
        const { completed, _id, name } = taskFromSever;

        // return以下にhtml要素を記述していくなんてReactみたい！！というか文法だけみたら完全にReact。
        // 以下のhtml要素が一つのタスクに相当。
        return ` <div class="single-task ${completed && "task-completed"}">
      <!--                              取り消し線と完了マークをつける⇒cssを充てる⇒htmlタグにクラスを付与する  -->
      <!--                              これにより、completed(checkbox)がtrueなら"task-completed"クラスが付与される  -->
      <h5><span><i class="${completed && "far fa-check-circle"
          }"></i></span>${name}</h5>
      <div class="task-links">
          <!-- 編集リンク -->
          <a href="edit.html?id=${_id}" class="edit-link">
          <!-- href属性に編集画面のhtmlリンクを結びつける。ここはサーバーサイド関係ない。この時、クエリによってidを指定して、どのタスクの編集画面なのか識別する -->
              <i class="fas fa-edit"></i>
          </a>
          <!-- ゴミ箱リンク -->
          <button type="button" class="delete-btn" data-id="${_id}">
              <i class="fas fa-trash"></i>
          </button>
      </div>
    </div>`;
      }
    );

    const tasksDOM = document.querySelector(".tasks");
    tasksDOM.innerHTML = HtmlDOMArrayOfAllTasksFromSever.join(""); // 配列の「,」除去のjoin
  } catch (error) {
    console.log(error);
  }
};

getAllTaskFromSeverAndShowThem();

// タスクの新規作成
const formDOM = document.querySelector(".task-form");
formDOM.addEventListener("submit", async (event) => {
  try {
    // submit eventのデフォルト機能であるリロードは今回不要。
    event.preventDefault();

    const taskInputDOM = document.querySelector(".task-input");
    const inputedCreatedTaskNameByClient = taskInputDOM.value;

    // mongooseで決めたデータスキーマに従って、送信するデータを第二引数に記述。
    await axios.post("/tasks", { name: inputedCreatedTaskNameByClient });
    getAllTaskFromSeverAndShowThem();

    taskInputDOM.value = "";
  } catch (error) {
    console.log(error);
  }
});

// タスクの削除
const tasksDOM = document.querySelector(".tasks");
tasksDOM.addEventListener("click", async (event) => {
  //   console.log(event.target);
  //   console.log(event.target.parentElement);
  if (event.target.parentElement.classList.contains("delete-btn")) {
    // containsはboolean型を戻り値として返す
    try {
      console.log(event.target.parentElement.dataset);
      const id = event.target.parentElement.dataset.id;
      await axios.delete(`/tasks/${id}`);
      getAllTaskFromSeverAndShowThem();
    } catch (error) {
      console.log(error);
    }
  }
});


