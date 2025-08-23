# RTPA - Ready Tailwind CSS Project Assistant Creation Tool

RTPA (Ready Tailwind Project Assistant) is a command-line tool designed to simplify the creation of new web projects with **Tailwind CSS** already setup. It supports setting up both simple HTML/CSS projects, modern **Vite.js** based projects such as vanilla Js and **Angular** based project, with automatic Tailwind CSS integration while offering the option to automatically publish it directly to your github.

[![npm downloads](https://img.shields.io/npm/dt/rtpa)](https://www.npmjs.com/package/rtpa)
![Rtpa](https://img.shields.io/badge/tailwind-css-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![Licence](https://img.shields.io/badge/licence-MIT-green?style=for-the-badge)

## Features

* **Fast Project Creation:** Launch a new :

    - Simple **HTML/CSS** project.

    - Modern project with **Vite (Vanilla JS)**.

    - Project with the **Angular framework**.

* **Tailwind CSS Integration:** Automatically configures Tailwind CSS v4 for your project adapted on your choosen type.

* **Automatic configuration of a linter and a formatter** (ESLint and Prettier), ensuring code quality and consistency from the start.

* **Command Line Arguments:** Specify project type and name directly from the command line.

* **Git Initialization:** Automatically initializes a local Git repository.

* **GitHub Integration (Optional):** Initializes a GitHub repository and pushes your code (requires a GitHub PAT).

## Installation

To use RTPA, you need Node.js and npm (or Yarn/pnpm) installed on your machine.

### Global Installation (Optionnal)

Using npm : you can install it globally:

```bash
npm install -g rtpa
```
```bash
yarn global add rtpa
```
```bash
pnpm install -g rtpa
```

## Usage
You can use RTPA in several ways:

1. **interactive mode**
Run the command without any arguments to choose the project type and name via interactive prompts:

```bash
rtpa
```

2. **Direct project creation**
Use the `--js` or `--angular` flags to directly specify the project type. You can also provide the project name immediately after the flag.

- Create a **simple html/css** project:

```bash
rtpa --simple project-name
```

- Create a **Vite Vanilla Js** project:

```bash
rtpa --js project-name
```

- Create an **Angular** project

```bash
rtpa --angular project-name
```

if `project-name` is omitted, the tool will prompt you for it.
Exemple `rtpa --js my-vite-app`

### Usage with npx (Without global installation)

If you prefer not to install the tool globally, you can use npx to run it directly. This will download and execute the tool without installing it permanently on your system.

To use ``npx``, simply prepend ``npx`` to the command:
```bash
npx rtpa
```

The interactive shell will then guide you through the project creation process. You can also use the command-line arguments with npx:

```bash
npx rtpa --simple [project-name]
```
```bash
npx rtpa --js [project-name]
```
```bash
npx rtpa --angular [project-name]
```

## Linter and Formatter Configuration

After your project is created, the tool will ask if you want to integrate a linter and a formatter. If you choose to, it will automatically install ESLint and Prettier and set up their basic configuration files (``.eslintrc.js`` and ``.prettierrc.json``). This ensures code consistency and helps catch errors early in the development process.

## Github Configuration

When prompted by the tool, you can choose to link your project to a new GitHub repository. You will need to provide a GitHub Personal Access Token (PAT) with repo permission for the tool to create and push the repository on your behalf.

### How to get your personnal token (PAT) ? :

- clic here [personal token settings](https://github.com/settings/tokens).

- clic on "Generate new token".

- Choose token(classic)

- give an explicit name to the token (`ex: cli-tailwind-tool`).

- give `repo` permission by checking the repo option.

- Clic on "Generate token" and copy and paste your token somewhere accessible because you'll not see it again (save it wisely in a personal file).


## Quick Start After Creation
Once your project is created, follow the instructions displayed in your terminal.

### For a Simple HTML/CSS Project:
1. Navigate to your project folder: cd [project-name]
2. Launch the Tailwind CSS compiler in watch mode: npm run start
3. Open your index.html file in a web browser to see your live changes.

### For a Vite.js Project:
1. Navigate to your project folder: cd [project-name]
2. Launch the Vite development server: npm run dev
3. Open your browser to the local address indicated by Vite (usually http://localhost:5173/).

## Contribution
Contributions are welcome! Feel free to open issues or submit pull requests.


## Note : 

your token is not saved in the code or send somewhere, in order to keep your github account secure.


coded with love by @likeur