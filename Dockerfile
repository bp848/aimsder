# Node + Python + ffmpeg が入ったベースイメージ
FROM node:20-bullseye

# 必要なシステムパッケージをインストール
# - python3: mastering_cli.py を実行するため
# - ffmpeg, ffprobe: オーディオ解析とマスタリング用
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      python3 \
      ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリ
WORKDIR /app

# 先に package*.json をコピーして npm install のキャッシュを効かせる
COPY package*.json ./

# 依存関係をインストール（devDependencies 含めてOK。tscビルドに必要）
RUN npm install

# 残りのソースコードをコピー
COPY . .

# TypeScript のサーバー部分をビルド
# → dist-server/server/masteringServer.js が生成される
RUN npm run server:build

# 環境変数（Cloud Run で上書きも可能）
ENV NODE_ENV=production
# Cloud Run からのリクエストを受けるポート
ENV MASTERING_SERVER_PORT=8080
# Python / ffmpeg バイナリ（デフォルトでもこの名前なので明示）
ENV PYTHON_BIN=python3
ENV FFMPEG_BIN=ffmpeg
ENV FFPROBE_BIN=ffprobe

# Cloud Run に公開するコンテナポート
EXPOSE 8080

# サーバー起動コマンド
# server/masteringServer.ts → dist-server/server/masteringServer.js を実行
CMD ["node", "dist-server/server/masteringServer.js"]
