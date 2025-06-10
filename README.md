# 🧠 PrepMaster

**PrepMaster** is an interactive platform designed to help software engineers prepare for technical interviews by filtering and practicing real-world coding and system design questions asked by top tech companies like Amazon, Google, Facebook, and Microsoft.

---

## ✨ Features

- 🔍 **Smart Filtering**  
  Filter questions by:
  - ✅ Company (Amazon, Google, etc.)
  - ✅ Topics (System Design, Scalability, HLD, DSA, etc.)
  - ✅ Roles (SDE Intern, SDE-1, SDE-2, Senior SDE)
  - ✅ Round Type (OA, Technical Interview, Design, HR, etc.)
  - ✅ Difficulty Level (Easy, Medium, Hard)
  - ✅ Frequency of being asked (High, Medium, Low)

- 📅 **Question Metadata**
  - Difficulty tags
  - Round type
  - Frequency indicator
  - Date last asked

- 📚 **Real Questions**  
  Each card represents a real question asked in interviews, along with associated metadata to help prioritize what to practice.

---

## 🚀 Tech Stack

- **Frontend**: React + TailwindCSS  
- **State Management**: React Hooks  
- **UI Components**: Custom-built with accessibility and responsiveness in mind

---

## 📁 Folder Structure (suggested)

```bash
Interview-Prep-main/
│
├── public/ # Static files
├── src/
│ └── app/
│ ├── components/ # Core reusable UI components
│ │ └── home.tsx # Main homepage component
│ ├── layout.tsx # Page layout template
│ ├── loading.tsx # Loading screen
│ ├── page.tsx # Landing page (routes to Home)
│ ├── globals.css # Global styles (Tailwind CSS)
│
├── components.json # UI metadata
├── next.config.ts # Next.js configuration
├── package.json # Project dependencies and scripts
├── postcss.config.mjs # PostCSS plugins
├── tailwind.config.ts # Tailwind CSS config
└── tsconfig.json # TypeScript config


