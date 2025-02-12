import { useCallback, useEffect, useState } from "react";
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
    setImageFileList(() => [...fileList]);

    if (fileList.find((file) => file === path)) {
      // ドロップされたファイルが画像だったときは、そのまま表示する
      setImagePath(() => path);
    } else {
      // 画像以外がドロップされたときは、当該フォルダの中の先頭の画像を表示する
      // 画像ファイルがない場合は何もしない
      if (fileList.length > 0) {
        setImagePath(() => fileList[0]);
      }
    }
  }

  // キーが押されたときの処理
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key;
      const currentIndex = imageFileList.indexOf(imagePath!);
      console.log(key, currentIndex, imageFileList, imagePath);

      switch (key) {
        case "ArrowRight":
          if (currentIndex < imageFileList.length - 1) {
            setImagePath(imageFileList[currentIndex + 1]);
          }
          break;
        case "ArrowLeft":
          if (currentIndex > 0) {
            setImagePath(imageFileList[currentIndex - 1]);
          }
          break;
      }
    },
    [imageFileList, imagePath]
  );

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

  // キー押下のイベントを設定
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return <ImageView path={imagePath} />;
}

export default App;
