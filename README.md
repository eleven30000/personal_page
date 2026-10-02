# 許宸華 Chen-Hua HSU – Personal Website

> AI/ML Engineer focused on Multimodal AI, Vision-Language Models, and Edge AI.

## 🌐 Live Site

Hosted on GitHub Pages: `https://<your-username>.github.io/<repo-name>/`

## 📁 Project Structure

```
personal_page/
├── index.html        # 首頁 Home
├── about.html        # 關於我 About
├── projects.html     # 作品集 Projects
├── contact.html      # 聯絡 Contact
├── css/
│   └── style.css     # 全站樣式
├── js/
│   └── main.js       # 互動效果
├── assets/
│   └── images/       # 圖片資源
└── README.md
```

## 🚀 本地預覽

直接在瀏覽器開啟 `index.html`（`file://` 協定即可，無需建置）：

```bash
# 或用任何靜態伺服器，例如 VS Code Live Server
```

## 📦 Git 版本控制

```bash
git init
git add .
git commit -m "initial commit"
```

## 🌍 部署到 GitHub Pages

1. 在 GitHub 建立新 repo（建議命名為 `<username>.github.io` 以取得最簡短的網址）
2. 設定遠端倉庫並推送：

```bash
git remote add origin https://github.com/<username>/<repo-name>.git
git branch -M main
git push -u origin main
```

3. GitHub Repo → **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: `main` / `/(root)`
   - 點 Save，等 1~2 分鐘即可上線

## 🛠️ Tech Stack

- Plain HTML5 + CSS3 + Vanilla JavaScript（無框架，易維護）
- Google Fonts (Inter, JetBrains Mono)
- GitHub Pages（免費靜態網站托管）
