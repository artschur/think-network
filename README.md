This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

This project requires **Node.js 18.18.0 or later**. If you don't have the correct version, follow these steps to update:

#### Update Node.js using NVM (Recommended)
If you have **NVM (Node Version Manager)** installed, run:
```bash
nvm install 20
nvm use 20
```

To set this version as default:
```bash
nvm alias default 20
```

If you don’t have NVM, install it with:
```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```

Then restart your terminal.

#### Update Node.js using a Package Manager

- **Ubuntu/Debian (Linux)**:
  ```bash
  sudo apt update && sudo apt install -y nodejs npm
  ```

- **macOS (Homebrew)**:
  ```bash
  brew update && brew install node
  ```

- **Windows**: Download the latest version from [Node.js official website](https://nodejs.org/)

After installation, verify the version:
```bash
node -v
```
Ensure it is **18.18.0 or higher**.

#### Install Bun (Optional)
If you want to use **Bun** as your package manager and runtime, install it following the official instructions:
[https://bun.sh/docs/installation](https://bun.sh/docs/installation)

### VS Code Configuration

To ensure consistent formatting, add the following lines to your **settings.json** file in VS Code:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

To access this file, press `Ctrl + Shift + P`, search for **Settings**, and open the JSON settings editor.

### Run the Development Server

Once Node.js is correctly installed, start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

