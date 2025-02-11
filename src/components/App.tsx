import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import "./App.css";
import { ImageView } from "./ImageView";

function App() {
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [imageFileList, setImageFileList] = useState<string[]>([]);

  // ファイルがドロップされたときの処理
  async function handleDrop(path: string) {
    const fileList = (await invoke("get_image_file_list", {
      path,
    })) as string[];
    setImageFileList(fileList);

    if (fileList.find((file) => file === path)) {
      // ドロップされたファイルが画像だったときは、そのまま表示する
      setImagePath(path);
    } else {
      // 画像以外がドロップされたときは、当該フォルダの中の先頭の画像を表示する
      // 画像ファイルがない場合は何もしない
      if (fileList.length > 0) {
        setImagePath(fileList[0]);
      }
    }
  }

  // キーボード操作のイベントハンドラ
  function keyDownHandler(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowRight": {
        const currentIndex = imageFileList.indexOf(imagePath!);
        if (currentIndex < imageFileList.length - 1) {
          setImagePath(imageFileList[currentIndex + 1]);
        }
        break;
      }
      case "ArrowLeft": {
        const currentIndex = imageFileList.indexOf(imagePath!);
        if (currentIndex > 0) {
          setImagePath(imageFileList[currentIndex - 1]);
        }
        break;
      }
    }
  }

  // ファイルをドロップしたときのイベントを設定
  useEffect(() => {
    const unlisten = listen<{ paths: string[] }>(
      "tauri://drag-drop",
      (event) => {
        handleDrop(event.payload.paths[0]);
      }
    );
    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  return (
    <div onKeyDown={keyDownHandler} tabIndex={0}>
      <ImageView path={imagePath} />
    </div>
  );
}

export default App;
