# Notely Client

A modern, feature-rich note-taking application built with React, TypeScript, and Tailwind CSS. Notely provides a seamless experience for creating, organizing, and sharing notes with a clean, intuitive interface.

## ✨ Features

### Core Functionality
- **Rich Text Editor**: Full-featured editor with Summernote integration
- **User Authentication**: Secure signup and login system with JWT
- **Note Management**: Create, read, update, and delete notes
- **Public & Private Notes**: Toggle note visibility
- **Trash System**: Recover deleted notes from trash

### User Experience
- **Responsive Design**: Works on all devices
- **Dark/Light Mode**: Built-in theme support
- **Real-time Updates**: Instant note syncing
- **Search & Filter**: Quickly find your notes
- **Markdown Support**: Write using Markdown syntax

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS 4.1.17** - Styling
- **React Router DOM** - Navigation

### State Management
- **Zustand** - Global State
- **TanStack Query** - Server State
- **Axios** - HTTP Client

### UI Components
- **shadcn/ui** - Component Library
- **Radix UI** - Accessible Primitives
- **Lucide React** - Icons
- **Sonner** - Toast Notifications

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/mbuvi254/notely_client.git](https://github.com/mbuvi254/notely_client.git)
   cd notely_client


npm install


npm run dev


#project structure
src/
├── components/    # Reusable UI components
│   ├── common/    # Common components (Loaders, etc.)
│   └── ui/        # shadcn/ui components
├── pages/         # Page components
│   ├── Dashboard/ # Authenticated routes
│   └── notely/    # Public pages
├── Store/         # State management
│   ├── noteStore.tsx
│   └── userStore.tsx
├── lib/           # Utility functions
│   ├── api.ts     # API client
│   └── utils.ts   # Helper functions
└── types/         # TypeScript types


🤝 Contributing
Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
shadcn/ui for the beautiful components
Tailwind CSS for the utility-first CSS framework
Vite for the amazing development experience
