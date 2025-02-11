import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import "./App.css";
import { ImageView } from "./ImageView";

function App() {
  const [imagePath, setImagePath] = useState<string | null>(null);

  async function handleDrop(path: string) {
    console.log(await invoke("get_image_file_list", { path }));
  }

  // ファイルをドロップしたときのイベントを設定
  useEffect(() => {
    const unlisten = listen<{ paths: string[] }>(
      "tauri://drag-drop",
      (event) => {
        console.log("drag-drop", event.payload);
        setImagePath(event.payload.paths[0]);
        handleDrop(event.payload.paths[0]);
      }
    );
    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  return <ImageView path={imagePath} />;
}

export default App;
