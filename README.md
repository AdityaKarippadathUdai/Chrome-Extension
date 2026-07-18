# 🔖 Link Library

> A modern browser extension for organizing bookmarks into folders with a clean, searchable interface.

Link Library is a lightweight bookmark manager built with **React**, **TypeScript**, **Vite**, **Dexie (IndexedDB)**, and **Zustand**. It provides a fast, local-first experience for saving, organizing, and searching your favorite websites directly inside your browser.

---

## ✨ Features

### 📁 Folder Management

- Create unlimited folders
- Nested folder hierarchy
- Rename folders
- Delete folders
- Folder context menu
- Tree view navigation

---

### 🔗 Bookmark Management

- Save website links
- Edit existing links
- Delete links
- Favorite bookmarks
- Automatic favicon support
- URL validation
- Descriptions
- Tags

---

### 🔍 Search

- Instant search
- Search by title
- Search by URL
- Search by tags

---

### ⭐ Favorites

- Mark bookmarks as favorites
- Quickly access favorite websites
- Toggle favorite status

---

### 🖥 Popup

The popup provides quick access to your library.

Features include:

- Recent bookmarks
- Favorite bookmarks
- Quick search
- Add current tab
- Open full library
- Open settings

---

### 📂 Full Library (Options Page)

The options page provides the complete management interface.

Includes:

- Folder sidebar
- Folder tree
- Bookmark grid
- Bookmark details panel
- CRUD operations
- Search
- Context menus
- Responsive layout

---

### 💾 Local Storage

Everything is stored locally using **IndexedDB**.

No account required.

No cloud synchronization.

No external server.

---

## 🚀 Built With

- React
- TypeScript
- Vite
- Tailwind CSS
- Dexie.js
- Zustand
- Lucide Icons
- Manifest V3

---

# 📦 Installation

## Chrome / Chromium

1. Download the latest release.
2. Extract `dist-chrome.zip`.
3. Open

```
chrome://extensions
```

4. Enable

```
Developer Mode
```

5. Click

```
Load unpacked
```

6. Select

```
dist-chrome
```

The extension is now installed.

---

## Firefox

1. Download the latest release.
2. Extract `dist-firefox.zip`.
3. Open

```
about:debugging
```

4. Select

```
This Firefox
```

5. Click

```
Load Temporary Add-on
```

6. Choose

```
manifest.json
```

inside

```
dist-firefox
```

---

# 🛠 Development

## Clone

```bash
git clone https://github.com/<your-username>/link-library.git

cd link-library
```

---

## Install

```bash
npm install
```

---

## Start Development Server

```bash
npm run dev
```

---

## Type Check

```bash
npx tsc --noEmit
```

---

## Build

```bash
npm run build
```

---

## Project Structure

```
src
├── background
├── components
│   ├── common
│   ├── folders
│   ├── layout
│   └── links
├── db
├── hooks
├── options
├── popup
├── store
├── types
└── utils
```

---

# 📁 Folder Structure

```
Folder
├── Programming
│   ├── React
│   ├── TypeScript
│   └── Node.js
│
├── AI
│   ├── LLMs
│   └── Papers
│
└── Linux
```

---

# 📖 Usage

## Create Folder

- Click **New Folder**
- Enter a name
- Save

---

## Save Link

- Select a folder
- Click **Add Link**
- Fill the form
- Save

---

## Edit Link

- Select a bookmark
- Click **Edit**
- Save changes

---

## Delete Link

- Select bookmark
- Click **Delete**
- Confirm

---

## Favorite Link

Click the ⭐ icon.

---

## Search

Use the search bar at the top.

Search works across

- Title
- URL
- Tags

---

# 💾 Database

The extension uses IndexedDB through Dexie.

Tables

## folders

| Field | Type |
|--------|------|
| id | number |
| parentId | number \| null |
| name | string |
| createdAt | Date |
| updatedAt | Date |

---

## links

| Field | Type |
|--------|------|
| id | number |
| folderId | number |
| title | string |
| url | string |
| description | string |
| favicon | string |
| tags | string[] |
| favorite | boolean |
| createdAt | Date |
| updatedAt | Date |

---

# 🎨 Technologies

| Technology | Purpose |
|------------|----------|
| React | UI |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Dexie | IndexedDB Wrapper |
| Zustand | State Management |
| Lucide | Icons |

---

# 🌐 Browser Support

- ✅ Google Chrome
- ✅ Chromium
- ✅ Brave
- ✅ Microsoft Edge
- ✅ Firefox

---

# 🔒 Privacy

Link Library is completely local-first.

- No analytics
- No tracking
- No advertisements
- No user accounts
- No cloud storage
- No external servers

Your data never leaves your browser.

---

# 📝 Roadmap

- [ ] Drag and drop folders
- [ ] Import bookmarks
- [ ] Export bookmarks
- [ ] Keyboard shortcuts
- [ ] Bookmark preview
- [ ] Multiple themes
- [ ] Dark mode
- [ ] Browser bookmark import
- [ ] Duplicate detection
- [ ] Sort options
- [ ] Folder color customization
- [ ] Sync support
- [ ] Bulk operations

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/my-feature
```

3. Commit your changes

```bash
git commit -m "Add my feature"
```

4. Push

```bash
git push origin feature/my-feature
```

5. Open a Pull Request

---

# 🐞 Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub.

When reporting bugs, include:

- Browser
- Browser version
- Operating system
- Steps to reproduce
- Expected behavior
- Actual behavior

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub. It helps others discover the project and supports future development.