import { convertFileSrc } from "@tauri-apps/api/core";

type Props = {
  /**
   * 画像のパス
   */
  path: string;
};

/**
 * 画像を表示するコンポーネント
 *
 * 画像のパスを渡すことで表示する
 */
export function ImageView(props: Props) {
  return (
    <div>
      {convertFileSrc(props.path)}
      <img src={convertFileSrc(props.path)} />
    </div>
  );
}
