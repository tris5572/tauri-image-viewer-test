import { convertFileSrc } from "@tauri-apps/api/core";

type Props = {
  /**
   * 画像のパス
   */
  path: string | null;
};

/**
 * 画像を表示するコンポーネント
 *
 * 画像のパスを渡すことで表示する
 */
export function ImageView(props: Props) {
  return (
    <div className="h-dvh bg-stone-900 flex justify-center items-center">
      {props.path ? (
        <img className="max-h-dvh" src={convertFileSrc(props.path)} />
      ) : (
        <div className="text-stone-200">
          画像またはフォルダをドロップしてください
        </div>
      )}
    </div>
  );
}
