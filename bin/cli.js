#!/usr/bin/env node

const { execSync } = require("child_process");

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: "inherit" });
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};

const repoName = process.argv[2];
const repoUrl = `git clone https://github.com/iiDon/express-starter-ts ${repoName}`;
const installDependencies = `cd ${repoName} && yarn`;

console.log(`Creating new project: ${repoName}`);
const checkedOut = runCommand(repoUrl);

if (!checkedOut) process.exit(1);

console.log(`Installing dependencies`);

const installed = runCommand(installDependencies);

if (!installed) process.exit(1);

console.log(`Project created successfully`);

