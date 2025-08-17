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
        *******            ***       ******       ***********
        ***  ***           ***       ***          *********** 
        ***   ***          ***       ***          ***     ***
        ***    ***         ***       ***          ***     *** (@by likeur)
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
 * Creates a simple HTML/CSS project with Tailwind CSS CLI.
 * @param {string} projectName The name of the project.
 * @param {string} projectPath The absolute path of the project.
 */
function createSimpleHtmlCssProject(projectName, projectPath) {
  console.log("📦 Initializing npm...");
  execSync("npm init -y", { cwd: projectPath });

  // Install Tailwind CSS CLI
  let dependencies = ["tailwindcss @tailwindcss/cli"];
  console.log("🔧 Installing development dependencies (Tailwind CSS CLI)...");
  execSync(`npm install -D ${dependencies.join(" ")}`, {
    cwd: projectPath,
    stdio: "inherit",
  });

  // Create base file structure
  fs.mkdirSync(path.join(projectPath, "css"));
  fs.mkdirSync(path.join(projectPath, "img"));

  // Create the input.css file
  fs.writeFileSync(
    path.join(projectPath, "css", "input.css"),
    `@import "tailwindcss";`
  );

  // Initialize tailwindcss output.css file
  execSync("npx @tailwindcss/cli -i ./css/input.css -o ./css/output.css", {
    cwd: projectPath,
  });

  // Add script to package.json
  const scriptName = "start";
  const scriptCommand =
    "npx @tailwindcss/cli -i ./css/input.css -o ./css/output.css --watch";

  const packageJsonPath = path.join(projectPath, "package.json");
  try {
    const packageJsonData = fs.readFileSync(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonData);

    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    packageJson.scripts[scriptName] = scriptCommand;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(
      `\n✅ The script "${scriptName}" has been added to your package.json.`
    );
  } catch (error) {
    console.error("❌ Error modifying package.json:", error.message);
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

async function main() {
  try {
    let projectType;
    let projectNameFromArgs = null;
    const args = process.argv.slice(2); // Get command line arguments

    // Check for flags and potential project name
    const viteFlagIndex = args.indexOf("--vite");
    const simpleFlagIndex = args.indexOf("--simple");

    if (viteFlagIndex !== -1) {
      projectType = "vite";
      // Check if there's an argument after --vite that's not another flag
      if (
        args.length > viteFlagIndex + 1 &&
        !args[viteFlagIndex + 1].startsWith("--")
      ) {
        projectNameFromArgs = args[viteFlagIndex + 1];
      }
      console.log(
        "Directly creating a Vite.js project as requested by '--vite' argument."
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
        "Directly creating a Simple HTML/CSS project as requested by '--simple' argument."
      );
    } else {
      // If no specific argument, prompt the user for project type
      projectType = await select({
        message: "Which type of project do you want to create?",
        choices: [
          {
            name: "Simple HTML/CSS Project (with Tailwind CSS CLI)",
            value: "simple",
            description:
              "Creates a static HTML/CSS project with Tailwind CSS and the CLI Watcher.",
          },
          {
            name: "Vite.js (Vanilla JS) Project + Tailwind CSS",
            value: "vite",
            description:
              "Creates a modern project with Vite.js and configures Tailwind CSS via PostCSS.",
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
          projectType === "vite"
            ? "my-vite-tailwind-project"
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
      fs.mkdirSync(projectPath); // Create project folder for simple type
      createSimpleHtmlCssProject(projectName, projectPath);
    } else if (projectType === "vite") {
      // Vite handles folder creation, so we don't call fs.mkdirSync here
      createViteTailwindProject(projectName, projectPath);
    } else {
      console.error("Unrecognized project type.");
      process.exit(1);
    }

    // Initialize git and connect to GitHub (common to both project types)
    console.log("🌱 Initializing Git repository...");
    execSync("git init", { cwd: projectPath }); // Ensure git init is in the new project path

    const gitignoreContent = `/node_modules\n/dist\n/.env\n`; // Added /dist and /.env for Vite projects
    fs.writeFileSync(path.join(projectPath, ".gitignore"), gitignoreContent);

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
      } else if (projectType === "vite") {
        console.log("\n✅ Project created successfully!");
        console.log("🚀 To get started, follow these steps:");
        console.log(`1. Navigate to the folder: \`cd ${projectName}\``);
        console.log("2. Launch the development server: `npm run dev`");
        console.log(
          "3. Open your browser at the address indicated by Vite (usually `http://localhost:5173/`)."
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
