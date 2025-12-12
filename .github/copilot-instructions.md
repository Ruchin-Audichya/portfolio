- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [ ] Clarify Project Requirements

- [ ] Scaffold the Project

- [ ] Customize the Project

- [ ] Install Required Extensions

- [ ] Compile the Project

- [ ] Create and Run Task

- [ ] Launch the Project

- [ ] Ensure Documentation is Complete

Execution Guidelines
- PROGRESS TRACKING: If tools are available to manage the above todo list, use them to track progress. After completing each step, mark it complete and add a summary. Read the current todo list status before starting each new step.
- COMMUNICATION RULES: Avoid verbose explanations or printing full command outputs. If a step is skipped, state that briefly (e.g. "No extensions needed"). Do not explain project structure unless asked. Keep explanations concise and focused.
- DEVELOPMENT RULES: Use '.' as the working directory unless the user specifies otherwise. Avoid adding media or external links unless explicitly requested. Use placeholders only with a note that they should be replaced. Use the VS Code API tool only for VS Code extension projects. Once the project is created, it is already opened in Visual Studio Code—do not suggest commands to open this project in Visual Studio again. If the project setup information has additional rules, follow them strictly.
- FOLDER CREATION RULES: Always use the current directory as the project root. If you run terminal commands, use the '.' argument to ensure the current working directory is used. Do not create a new folder unless the user explicitly requests it besides a .vscode folder for a tasks.json file. If any scaffolding commands mention the folder name is incorrect, let the user know to create a new folder with the correct name and reopen it in VS Code.
- EXTENSION INSTALLATION RULES: Only install extensions specified by the get_project_setup_info tool. Do not install any other extensions.
- PROJECT CONTENT RULES: If the user has not specified project details, assume they want a "Hello World" project as a starting point. Avoid adding links or integrations that are not explicitly required. Avoid generating images, videos, or other media files unless explicitly requested. If you need to use media assets as placeholders, note that these should be replaced with the actual assets later. Ensure all generated components serve a clear purpose within the user's requested workflow. If a feature is assumed but not confirmed, prompt the user for clarification before including it. If you are working on a VS Code extension, use the VS Code API tool with a query to find relevant references.
- TASK COMPLETION RULES: Task is complete when the project is scaffolded and compiled without errors, copilot-instructions.md exists, README.md is up to date, and the user has clear instructions to debug/launch the project.
- Work through each checklist item systematically. Keep communication concise and focused. Follow development best practices.
