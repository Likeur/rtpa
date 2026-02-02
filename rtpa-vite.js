#!/usr/bin/env node

//v@2.0.0
const { select, input, confirm } = require("@inquirer/prompts");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

console.log(
  `
        *******       ************   ********         **
        *********     ************   **********      *****
        ***    ***         ***       ***    ***     *** ***
        *********          ***       *********     ***   ***
        *******            ***       ******       *********** // Simple HTML/CSS
        ***  ***           ***       ***          *********** // Angular
        ***   ***          ***       ***          ***     *** // vite
        ***    ***         ***       ***          ***     *** (@by likeur)
        ***                ***       ********     *********** // Astro
        ***      ***       ***       ***  ***         ***     // Nuxt


    `
);
console.log("✨ Welcome to the Ready Tailwindcss Project Assistant Tool!");

/**
 * Creates a GitHub repository and pushes the code to it.
 * @param {string} projectName The name of the project.
 * @param {string} projectPath The absolute path of the project.
 * @param {string} gitHubToken The GitHub Personal Access Token.
 * @param {boolean} isPrivate Indicates if the repository should be private.
 */
async function createAndPushToGitHub(
  projectName,
  projectPath,
  gitHubToken,
  isPrivate
) {
  try {
    console.log("\n⏳ Creating repository on GitHub...");

    const response = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers: {
        Authorization: `token ${gitHubToken}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        name: projectName,
        private: isPrivate,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create GitHub repository: ${response.status} - ${errorText}`
      );
    }

    const repoData = await response.json();
    const repoUrl = repoData.clone_url;
    const userName = repoData.owner.login; // Added to get user name

    console.log("✅ GitHub repository created successfully!");

    console.log("⏳ Preparing first commit...");
    execSync("git add .");
    execSync('git commit -m "feat: initial project setup"');

    console.log("⏳ Pushing project to GitHub...");
    execSync(`git remote add origin ${repoUrl}`);
    execSync("git branch -M main");
    execSync("git push -u origin main");

    console.log(`\n🎉 Project pushed to GitHub successfully!`);
    console.log(
      `🔗 Your repository is available at: ${repoUrl.replace(".git", "")}`
    );
  } catch (error) {
    console.error(
      "❌ An error occurred while connecting to GitHub:",
      error.message
    );
    console.log(
      "\n❗ The project was created locally. You can push it manually later."
    );
  }
}

/**
 * Working on this
 * Creates a simple HTML/CSS project with Tailwind CSS CLI.
 * @param {string} projectName The name of the project.
 * @param {string} projectPath The absolute path of the project.
 */
function createSimpleHtmlCssProject(projectName, projectPath) {
  console.log(`\nCréation du projet '${projectName}'...`);

  process.chdir(projectPath);

  // npm init
  console.log("📦 Initialisation de npm...");
  execSync("npm init -y");

  // dependancy installation
  let dependencies = ["tailwindcss @tailwindcss/cli"];
  console.log("🔧 Installation des dépendances de développement...");
  execSync(`npm install -D ${dependencies.join(" ")}`, { stdio: "inherit" });

  // Creation of base file structure
  fs.mkdirSync(path.join(projectPath, "css"));
  fs.mkdirSync(path.join(projectPath, "img"));

  // Creation of the input.css file
  fs.writeFileSync(
    path.join(projectPath, "css", "input.css"),
    `@import "tailwindcss"`
  );


  // Adding script
  const scriptName = "start";
  const scriptCommand =
    "npx @tailwindcss/cli -i ./css/input.css -o ./css/output.css --watch";

  // path to package.json
  const packageJsonPath = path.join(process.cwd(), "package.json");

  try {
    const packageJsonData = fs.readFileSync(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonData);

    // verify if scripts section exist, if not we create one
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    // add new script for running tailwindcss server
    packageJson.scripts[scriptName] = scriptCommand;

    // rewrite package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log(
      `\n✅ Le script "${scriptName}" a été ajouté à votre package.json.`
    );
  } catch (error) {
    console.error("❌ Erreur lors de la modification de package.json :", error);
  }

  // index.html file
  fs.writeFileSync(
    path.join(projectPath, "index.html"),
    `<!doctype html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${projectName}</title>
            <link rel="stylesheet" href="css/output.css">
        </head>
        <body class="p-4 h-screen flex items-center justify-center">
    <main class="container mx-auto px-4 flex flex-col items-center gap-4">
      <p class="text-center bg-blue-600/10 text-sm p-1 px-3 rounded-full text-blue-600">Template Rtpa simple html for ${projectName}</p>
      <h1 class="text-center text-3xl lg:text-5xl font-bold lg:w-[60%]">
         Focus on shipping what matter the most. Happy coding to you mate.
      </h1>
      <p class="text-zinc-500">
        coded with love by
        <a href="https://github.com/Likeur" class="underline text-blue-500"
          >Likeur</a
        >
      </p>
    </main>
        </body>
        </html>`
  );
  //first execution of the @tailwindcss/cli script to generate the output.css file
  execSync(`npx @tailwindcss/cli -i ./css/input.css -o ./css/output.css`, { stdio: "inherit" });

  console.log(
    "\n✅ Simple HTML/CSS project with Tailwind CSS created successfully!"
  );
  console.log("🚀 To get started, follow these steps:");
  console.log(`1. Navigate to the folder: \`cd ${projectName}\``);
  console.log("2. Launch the development server: `npm run start`");
  console.log("3. Open your `index.html` in the browser and start coding!");
}

/**
 * Creates a Vite.js project with Tailwind CSS.
 * @param {string} projectName The name of the project.
 * @param {string} projectPath The absolute path of the project.
 */
function createViteTailwindProject(projectName, projectPath) {
  console.log("📦 Creating Vite project (Vanilla JavaScript)...");
  execSync(`npm create vite@latest ${projectName} -- --template vanilla`, {
    stdio: "inherit",
  });

  // Change directory to the newly created Vite project
  process.chdir(projectPath);

  let dependencies = ["tailwindcss @tailwindcss/vite"];
  console.log("🔧 Installing development dependencies (@tailwindcss/vite)...");
  execSync(`npm install -D ${dependencies.join(" ")}`, {
    cwd: projectPath,
    stdio: "inherit",
  });

  // Create vite.config.js at the project root
  console.log("📝 Creating vite.config.js...");
  const viteConfigContent = `import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
`;
  fs.writeFileSync(path.join(projectPath, "vite.config.js"), viteConfigContent);
  console.log("✅ vite.config.js created successfully!");

  // modifying src/style.css
  const cssDirPath = path.join(projectPath, "src");
  //   if (!fs.existsSync(cssDirPath)) {
  //     fs.mkdirSync(cssDirPath);
  //   }
  fs.writeFileSync(path.join(cssDirPath, "style.css"), `@import "tailwindcss"`);

  // Modify index.html to include the new CSS link and example content

  // index.html file
  fs.writeFileSync(
    path.join(projectPath, "index.html"),
    `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="./dist/output.css" rel="stylesheet" />
    <title>${projectName}</title>
  </head>
  <body class="p-4 h-screen flex items-center justify-center">
    <main class="container mx-auto px-4 flex flex-col items-center gap-4">
      <p class="text-center bg-blue-600/10 text-sm p-1 px-3 rounded-full text-blue-600">Template Rtpa vite for ${projectName}</p>
      <h1 class="text-center text-3xl lg:text-5xl font-bold lg:w-[60%]">
         Focus on shipping what matter the most. Happy coding to you mate.
      </h1>
      <p class="text-zinc-500">
        coded with love by
        <a href="https://github.com/Likeur" class="underline text-blue-500"
          >Likeur</a
        >
      </p>
    </main>

    <script type="module" src="./src/main.js"></script>
  </body>
</html>
`
  );

  console.log("\n✅ Vite.js project with Tailwind CSS created successfully!");
  console.log("🚀 To get started, follow these steps:");
  console.log(`1. Navigate to the folder: \`cd ${projectName}\``);
  console.log("2. Launch the development server: `npm run dev`");
  console.log(
    "3. Open your browser at the address indicated by Vite (usually `http://localhost:5173/`)."
  );
}

/**
 * Creates an Angular project with Tailwind CSS v4.
 * @param {string} projectName The name of the project.
 * @param {string} projectPath The absolute path of the project.
 */
function createAngularTailwindProject(projectName, projectPath) {
  console.log("📦 Creating Angular project...");

  // Check if Angular CLI is installed
  try {
    execSync("ng v", { stdio: "ignore" });
  } catch (error) {
    console.warn(`
❗ Angular CLI is not installed globally. Please install it first:
   npm install -g @angular/cli
   Then run this tool again.
`);
    process.exit(1);
  }

  // Create new Angular project
  execSync(
    `ng new ${projectName} --style=css --inline-style --skip-git --package-manager=npm`,
    {
      stdio: "inherit",
    }
  );

  process.chdir(projectPath);

  // Install Tailwind CSS dependencies
  console.log("🔧 Installing Tailwind CSS dependencies for Angular...");
  execSync("npm install tailwindcss @tailwindcss/postcss postcss --force", {
    cwd: projectPath,
    stdio: "inherit",
  });

  // Create .postcssrc.json file
  console.log("⚙️ Creating .postcssrc.json file for PostCSS configuration...");
  const postcssrcContent = `{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}`;
  fs.writeFileSync(path.join(projectPath, ".postcssrc.json"), postcssrcContent);
  console.log("✅ .postcssrc.json created successfully!");

  // modifying src/style.css
  const cssDirPath = path.join(projectPath, "src");
  //   if (!fs.existsSync(cssDirPath)) {
  //     fs.mkdirSync(cssDirPath);
  //   }
  fs.writeFileSync(path.join(cssDirPath, "styles.css"), `@import "tailwindcss"`);
  console.log("✅ Tailwind CSS import added to src/styles.css.");


  console.log(
    "\n✅ Angular project with Tailwind CSS v4 created successfully!"
  );
  console.log("🚀 To get started, follow these steps:");
  console.log(`1. Navigate to the folder: \`cd ${projectName}\``);
  console.log(
    "2. Launch the development server: `npm run start` or `ng serve`"
  );
  console.log(
    "3. Open your browser at the address indicated by Angular (usually `http://localhost:4200/`)."
  );
}

/**
 * Creates an Astro project with Tailwind CSS v4.
 * @param {string} projectName The name of the project.
 * @param {string} projectPath The absolute path of the project.
 */
function createAstroTailwindProject(projectName, projectPath) {
  console.log("📦 Creating Astro project...");

  // Create new Astro project
  // using --template minimal to start fresh, --no-install to install dependencies manually later, --no-git to handle git separately, --yes to skip prompts
  execSync(
    `npm create astro@latest ${projectName} -- --template minimal --no-install --no-git --yes`,
    {
      stdio: "inherit",
    }
  );

  process.chdir(projectPath);

  // Install dependencies (including astro)
  console.log("📦 Installing dependencies...");
  execSync("npm install", {
    cwd: projectPath,
    stdio: "inherit",
  });

  // Install Tailwind CSS dependencies
  console.log("🔧 Installing Tailwind CSS dependencies for Astro...");
  execSync("npm install tailwindcss @tailwindcss/vite", {
    cwd: projectPath,
    stdio: "inherit",
  });

  // Update astro.config.mjs
  console.log("⚙️ Configuring astro.config.mjs...");
  const astroConfigContent = `import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite : {
    plugins: [tailwindcss()],
  },
});
`;
  fs.writeFileSync(path.join(projectPath, "astro.config.mjs"), astroConfigContent);

  // Create src/styles.css
  const srcDirPath = path.join(projectPath, "src");
  console.log("📝 Creating global styles...");
  fs.writeFileSync(path.join(srcDirPath, "styles.css"), `@import "tailwindcss";`);

  // Update src/pages/index.astro
  console.log("📝 Updating index.astro...");
  const indexAstroContent = `---
import '../styles.css';
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>${projectName}</title>
	</head>
	<body class="p-4 h-screen flex items-center justify-center bg-gray-50">
		<main class="container mx-auto px-4 flex flex-col items-center gap-4">
			<p class="text-center bg-orange-600/10 text-sm p-1 px-3 rounded-full text-orange-600">
				Template Rtpa Astro for ${projectName}
			</p>
			<h1 class="text-center text-3xl lg:text-5xl font-bold lg:w-[60%] text-gray-900">
				Focus on shipping what matter the most. Happy coding to you mate.
			</h1>
			<p class="text-zinc-500">
				coded with love by
				<a href="https://github.com/Likeur" class="underline text-orange-500">Likeur</a>
			</p>
		</main>
	</body>
</html>
`;
  fs.writeFileSync(path.join(srcDirPath, "pages", "index.astro"), indexAstroContent);

  console.log(
    "\n✅ Astro project with Tailwind CSS v4 created successfully!"
  );
  console.log("🚀 To get started, follow these steps:");
  console.log(`1. Navigate to the folder: \`cd ${projectName}\``);
  console.log(
    "2. Launch the development server: `npm run dev`"
  );
  console.log(
    "3. Open your browser at the address indicated by Astro (usually `http://localhost:4321/`)."
  );
}

/**
 * Creates a Nuxt project with Tailwind CSS v4.
 * @param {string} projectName The name of the project.
 * @param {string} projectPath The absolute path of the project.
 */
function createNuxtTailwindProject(projectName, projectPath) {
  console.log("📦 Creating Nuxt project...");

  // Create new Nuxt project
  // Using -y for npx to skip prompts
  // --packageManager npm to avoid selection prompt
  // --gitInit false to avoid git prompt
  // --no-install to skip installation (we do it manually later)
  execSync(
    `npx -y nuxi@latest init ${projectName} --packageManager npm --gitInit false --no-install --force`,
    {
      stdio: "inherit",
    }
  );

  process.chdir(projectPath);

  // Install dependencies
  console.log("📦 Installing dependencies...");
  execSync("npm install", {
    cwd: projectPath,
    stdio: "inherit",
  });

  // Install Tailwind CSS dependencies
  console.log("🔧 Installing Tailwind CSS dependencies for Nuxt...");
  execSync("npm install tailwindcss @tailwindcss/vite", {
    cwd: projectPath,
    stdio: "inherit",
  });

  // Update nuxt.config.ts
  console.log("⚙️ Configuring nuxt.config.ts...");
  const nuxtConfigContent = `// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ['./app/assets/css/main.css'],
});
`;
  fs.writeFileSync(path.join(projectPath, "nuxt.config.ts"), nuxtConfigContent);

  // Create app/assets/css/main.css
  const assetsCssDir = path.join(projectPath, "app", "assets", "css");
  console.log("📝 Creating global styles in app/assets/css...");
  fs.mkdirSync(assetsCssDir, { recursive: true });
  fs.writeFileSync(path.join(assetsCssDir, "main.css"), `@import "tailwindcss";`);

  console.log("📝 Updating app/app.vue...");
  const appVueContent = `<template>
  <div class="p-4 h-screen flex items-center justify-center bg-gray-50">
    <main class="container mx-auto px-4 flex flex-col items-center gap-4">
      <p class="text-center bg-emerald-600/10 text-sm p-1 px-3 rounded-full text-emerald-600">
        Template Rtpa Nuxt for {{ projectName }}
      </p>
      <h1 class="text-center text-3xl lg:text-5xl font-bold lg:w-[60%] text-gray-900">
        Focus on shipping what matter the most. Happy coding to you mate.
      </h1>
      <p class="text-zinc-500">
        coded with love by
        <a href="https://github.com/Likeur" class="underline text-emerald-500">Likeur</a>
      </p>
    </main>
  </div>
</template>

<script setup>
const projectName = "${projectName}";
</script>
`;
  // Ensure app directory exists (it should with recent nuxi versions using compatibility mode or defaults, but good to be safe if strictly enforcing app/)
  const appDir = path.join(projectPath, "app");
  if (!fs.existsSync(appDir)) {
    // If app dir doesn't exist (e.g. older template), we might want to check, but user specifically asked for /app. 
    // Assuming the template generated by nuxi matches user expectations or we are enforcing it. 
    // If nuxi init creates root app.vue, we should PROBABLY move it or just write to app/app.vue.
    // Ideally we should check if app/app.vue exists or root app.vue exists. 
    // But user said "utilise le app.vue qui se trouve dans le dossier /app". implying it exists.
  }

  fs.writeFileSync(path.join(projectPath, "app", "app.vue"), appVueContent);

  console.log(
    "\n✅ Nuxt project with Tailwind CSS v4 created successfully!"
  );
  console.log("🚀 To get started, follow these steps:");
  console.log(`1. Navigate to the folder: \`cd ${projectName}\``);
  console.log(
    "2. Launch the development server: `npm run dev`"
  );
  console.log(
    "3. Open your browser at the address indicated by Nuxt (usually `http://localhost:3000/`)."
  );
}


/**
 * Adds and configures a linter and formatter to the project.
 * @param {string} projectPath The absolute path of the project.
 */
async function addLinterAndFormatter(projectPath) {
  const wantLinting = await confirm({
    message: "Do you want to add a linter (ESLint) and a formatter (Prettier) to your project?",
    default: true,
  });

  if (wantLinting) {
    console.log("\n🔧 Configuring ESLint and Prettier...");

    // Install dependencies
    const devDependencies = ["eslint", "prettier", "eslint-config-prettier"];
    console.log("📦 Installing ESLint and Prettier...");
    execSync(`npm install -D ${devDependencies.join(" ")}`, {
      cwd: projectPath,
      stdio: "inherit",
    });

    // Create .eslintrc.js
    console.log("📝 Creating .eslintrc.js configuration file...");
    const eslintConfigContent = `module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'prettier',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        // Add your custom rules here
    },
};
`;
    fs.writeFileSync(path.join(projectPath, '.eslintrc.js'), eslintConfigContent);

    // Create .prettierrc.json
    console.log("📝 Creating .prettierrc.json configuration file...");
    const prettierConfigContent = `{
    "semi": true,
    "tabWidth": 2,
    "printWidth": 80,
    "singleQuote": true,
    "trailingComma": "es5"
}`;
    fs.writeFileSync(path.join(projectPath, '.prettierrc.json'), prettierConfigContent);

    // Update .gitignore
    const gitignorePath = path.join(projectPath, '.gitignore');
    let gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    gitignoreContent += `
# Linter and Formatter
.eslintcache
`;
    fs.writeFileSync(gitignorePath, gitignoreContent);

    console.log("✅ ESLint and Prettier have been successfully configured!");
  }
}


async function main() {
  try {
    let projectType;
    let projectNameFromArgs = null;
    const args = process.argv.slice(2); // Get command line arguments

    // Check for flags and potential project name
    const viteFlagIndex = args.indexOf("--js");
    const simpleFlagIndex = args.indexOf("--simple");
    const angularFlagIndex = args.indexOf("--angular");
    const astroFlagIndex = args.indexOf("--astro");
    const nuxtFlagIndex = args.indexOf("--nuxt");

    if (viteFlagIndex !== -1) {
      projectType = "js";
      // Check if there's an argument after --js that's not another flag
      if (
        args.length > viteFlagIndex + 1 &&
        !args[viteFlagIndex + 1].startsWith("--")
      ) {
        projectNameFromArgs = args[viteFlagIndex + 1];
      }
      console.log(
        "Directly creating a Vite.js project as requested by '--js' argument."
      );
    } else if (simpleFlagIndex !== -1) {
      projectType = "simple";
      // Check if there's an argument after --simple that's not another flag
      if (
        args.length > simpleFlagIndex + 1 &&
        !args[simpleFlagIndex + 1].startsWith("--")
      ) {
        projectNameFromArgs = args[simpleFlagIndex + 1];
      }
      console.log(
        "Directly creating a Simple HTML/CSS project as requested by '--simple' argument (Not working for now)."
      );
    } else if (angularFlagIndex !== -1) {
      projectType = "angular";
      if (
        args.length > angularFlagIndex + 1 &&
        !args[angularFlagIndex + 1].startsWith("--")
      ) {
        projectNameFromArgs = args[angularFlagIndex + 1];
      }
      console.log(
        "Directly creating an Angular project as requested by '--angular' argument."
      );
    } else if (astroFlagIndex !== -1) {
      projectType = "astro";
      if (
        args.length > astroFlagIndex + 1 &&
        !args[astroFlagIndex + 1].startsWith("--")
      ) {
        projectNameFromArgs = args[astroFlagIndex + 1];
      }
      console.log(
        "Directly creating an Astro project as requested by '--astro' argument."
      );
    } else if (nuxtFlagIndex !== -1) {
      projectType = "nuxt";
      if (
        args.length > nuxtFlagIndex + 1 &&
        !args[nuxtFlagIndex + 1].startsWith("--")
      ) {
        projectNameFromArgs = args[nuxtFlagIndex + 1];
      }
      console.log(
        "Directly creating a Nuxt project as requested by '--nuxt' argument."
      );
    } else {
      // If no specific argument, prompt the user for project type
      projectType = await select({
        message: "Which type of project do you want to create?",
        choices: [
          {
            name: "Simple HTML/CSS Project + Tailwind CSS",
            value: "simple",
            description:
              "Creates a basic HTML/CSS project with Tailwind CSS via CLI.",
          },
          {
            name: "Vite js (Vanilla JS) Project + Tailwind CSS",
            value: "js",
            description:
              "Creates a modern project with Vite.js and configures Tailwind CSS via PostCSS.",
          },
          {
            name: "Angular Project + Tailwind CSS v4",
            value: "angular",
            description:
              "Creates an Angular project and integrates Tailwind CSS v4.",
          },
          {
            name: "Astro Project + Tailwind CSS v4",
            value: "astro",
            description:
              "Creates a complete Astro project configured with Tailwind CSS v4.",
          },
          {
            name: "Nuxt Project + Tailwind CSS v4",
            value: "nuxt",
            description:
              "Creates a complete Nuxt project configured with Tailwind CSS v4.",
          },
        ],
      });
    }

    let projectName;
    if (projectNameFromArgs) {
      // Validate project name from arguments
      if (/^([A-Za-z0-9\-\_])+$/.test(projectNameFromArgs)) {
        projectName = projectNameFromArgs;
        console.log(`Using project name from arguments: '${projectName}'`);
      } else {
        console.error(
          `❌ Error: Invalid project name provided via argument: '${projectNameFromArgs}'. Project name must contain only letters, numbers, hyphens, and underscores.`
        );
        process.exit(1);
      }
    } else {
      // If no project name was provided via arguments, prompt the user
      projectName = await input({
        message: "What is the name of your project?",
        default:
          projectType === "js"
            ? "my-vite-tailwind-project"
            : projectType === "angular"
              ? "my-angular-tailwind-project"
              : projectType === "astro"
                ? "my-astro-tailwind-project"
                : projectType === "nuxt"
                  ? "my-nuxt-tailwind-project"
                  : "my-simple-tailwind-project",
        validate: (value) => {
          if (/^([A-Za-z0-9\-\_])+$/.test(value)) {
            return true;
          }
          return "Project name must contain only letters, numbers, hyphens, and underscores.";
        },
      });
    }

    console.log(`\nCreating project '${projectName}'...`);

    // Check if project folder already exists
    const projectPath = path.join(process.cwd(), projectName);
    if (fs.existsSync(projectPath)) {
      console.error(
        `❌ Error: The folder '${projectName}' already exists. Please choose another name or delete the existing folder.`
      );
      process.exit(1);
    }

    // Project creation logic based on type
    if (projectType === "simple") {
      fs.mkdirSync(projectPath);
      createSimpleHtmlCssProject(projectName, projectPath);
    } else if (projectType === "js") {
      // Vite handles folder creation, so we don't call fs.mkdirSync here
      createViteTailwindProject(projectName, projectPath);
    } else if (projectType === "angular") {
      createAngularTailwindProject(projectName, projectPath);
    } else if (projectType === "astro") {
      createAstroTailwindProject(projectName, projectPath);
    } else if (projectType === "nuxt") {
      createNuxtTailwindProject(projectName, projectPath);
    } else {
      console.error("Unrecognized project type.");
      process.exit(1);
    }

    // Initialize git and connect to GitHub (common to both project types)
    console.log("🌱 Initializing Git repository...");
    execSync("git init", { cwd: projectPath }); // Ensure git init is in the new project path

    const gitignoreContent = `/node_modules\n/dist\n/.env\n`; // Added /dist and /.env for Vite projects
    fs.writeFileSync(path.join(projectPath, ".gitignore"), gitignoreContent);

    // Linter and Formatter
    await addLinterAndFormatter(projectPath);

    const connectToGitHub = await confirm({
      message:
        "Do you want to create a GitHub repository for this project and push the code?",
    });

    if (connectToGitHub) {
      const gitHubToken = await input({
        message:
          'Please enter your GitHub Personal Access Token (PAT). (Requires "repo" permission)',
      });

      const isPrivate = await confirm({
        message: "Do you want the repository to be private?",
        default: true,
      });

      await createAndPushToGitHub(
        projectName,
        projectPath,
        gitHubToken,
        isPrivate
      );
    } else {
      // Display instructions relevant to the chosen project type if not pushing to GitHub
      if (projectType === "simple") {
        console.log("\n✅ Project created successfully!");
        console.log("🚀 To get started, follow these steps:");
        console.log(`1. Navigate to the folder: \`cd ${projectName}\``);
        console.log("2. Launch the development server: `npm run start`");
        console.log(
          "3. Open your `index.html` in the browser and start coding!"
        );
      } else if (projectType === "js") {
        console.log("\n✅ Project created successfully!");
        console.log("🚀 To get started, follow these steps:");
        console.log(`1. Navigate to the folder: \`cd ${projectName}\``);
        console.log("2. Launch the development server: `npm run dev`");
        console.log(
          "3. Open your browser at the address indicated by Vite (usually `http://localhost:5173/`)."
        );
      } else if (projectType === "angular") {
        console.log("\n✅ Project created successfully!");
        console.log("🚀 To get started, follow these steps:");
        console.log(`1. Navigate to the folder: \`cd ${projectName}\``);
        console.log("2. Launch the development server: `npm run start` or `ng serve`");
        console.log(
          "3. Open your browser at the address indicated by Angular (usually `http://localhost:4200/`)."
        );
      } else if (projectType === "astro") {
        console.log("\n✅ Project created successfully!");
        console.log("🚀 To get started, follow these steps:");
        console.log(`1. Navigate to the folder: \`cd ${projectName}\``);
        console.log("2. Launch the development server: `npm run dev`");
        console.log(
          "3. Open your browser at the address indicated by Astro (usually `http://localhost:4321/`)."
        );
      } else if (projectType === "nuxt") {
        console.log("\n✅ Project created successfully!");
        console.log("🚀 To get started, follow these steps:");
        console.log(`1. Navigate to the folder: \`cd ${projectName}\``);
        console.log("2. Launch the development server: `npm run dev`");
        console.log(
          "3. Open your browser at the address indicated by Nuxt (usually `http://localhost:3000/`)."
        );
      }
    }
  } catch (error) {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
      console.error(
        "❌ Error: The current environment does not support interactive prompts. Please run this in a compatible terminal (e.g., Bash, Zsh, PowerShell)."
      );
    } else {
      console.error("❌ An unexpected error occurred:", error);
    }
  }
}

main();
