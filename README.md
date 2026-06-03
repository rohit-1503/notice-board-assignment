# 📌 Reno Platforms: Notice Board Assignment

A professional full-stack Notice Board application built as part of the Web Development Internship assignment for **Reno Platforms**. This app supports full CRUD operations and follows a strict "Urgent-first" ordering system.

## 🛠️ Tech Stack
* **Frontend**: Next.js 14 (Pages Router - strictly used as per requirements)
* **ORM**: Prisma ORM
* **Database**: TiDB Cloud (MySQL-compatible)
* **Styling**: Tailwind CSS (Responsive for mobile and desktop)
* **Deployment**: Vercel

## ✨ Key Features Implemented
* **Full CRUD Operations**: Users can create, read, update, and delete notices end-to-end.
* **Urgent-First Ordering**: Implemented using Prisma's `orderBy` in the database query. Urgent notices always appear at the top with a visible red "Urgent" badge.
* **Server-Side Validation**: All inputs are validated within API routes (`pages/api/`) before processing, ensuring no empty required fields.
* **Delete Confirmation**: A mandatory confirmation step is triggered before any notice is removed.
* **Responsive UI**: The layout is fully optimized for both mobile and desktop screens.

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | TiDB Cloud MySQL connection string |

## 📂 Project Structure
notice-board/
├── pages/
│   ├── index.js               # Notice listing
│   ├── notices/
│   │   ├── create.js          # Create notice
│   │   └── edit/[id].js       # Edit notice
│   └── api/notices/
│       ├── index.js           # GET all / POST
│       └── [id].js            # GET one / PUT / DELETE
├── components/
│   ├── NoticeCard.js
│   └── NoticeForm.js
├── lib/prisma.js
└── prisma/schema.prisma

## 🚀 How to Run Locally
1.  **Clone the repository**:
```bash
    git clone <your-repository-url>
    cd notice-board
    ```
2.  **Install dependencies**:
```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env` file in the root directory and add your hosted database connection string:
```env
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE?sslaccept=strict"
    ```
4.  **Sync Database Schema**:
```bash
    npx prisma db push
    ```
5.  **Run the Development Server**:
```bash
    npm run dev
    ```
    Access the app at `http://localhost:3000`.

## 🤖 AI Usage Disclosure
* **Prisma & Schema Setup**: Used AI (Gemini/ChatGPT) to structure the initial Prisma schema and resolve the `sys` database system error during the initial TiDB connection.
* **Deployment Debugging**: AI was utilized to troubleshoot Vercel deployment issues, specifically configuring the `postinstall` script in `package.json` to ensure the Prisma Client is generated correctly in the production environment.
* **Architecture**: AI assisted in ensuring the API routes followed correct RESTful methods (GET, POST, PUT, DELETE) as required by the assignment.

## 📈 One Thing I Would Improve
With more time, I would implement **User Authentication** using NextAuth.js. This would ensure that only authorized administrators or staff members have the permission to create, edit, or delete notices, while students/regular users can only view them. This would add a necessary layer of security to the platform.