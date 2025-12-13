- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [x] RUCHIN.SYSTEM Final Remaster - Completed

## Remaster Changelog

### Performance & Camera
- **FPS Target**: Increased to ~60 FPS active (30 for low quality), 12 FPS idle
- **Camera Lock**: Circular orbit only - `maxPolarAngle=Math.PI/2.2`, `minPolarAngle=0.25` prevents going under world
- **Damping**: Smoother camera movement with `dampingFactor=0.08`

### Story Stops (Storyboard Layout)
- Cards now **always visible** with opacity-based emphasis (1.0 highlighted, 0.6 ambient)
- Scale animation: 1.0 on hover/active, 0.75 ambient
- Gamified content from resume:
  - Boot Sequence: "Learned to walk with PHP, learned to run with JS"
  - Midnight Build: "2017-2019: Code till 4AM, chase that flow state"
  - Stack Overflow: "Real-world battle scars: HIPAA, PCI, scale problems"
  - Ruchin's Rig: "Full-stack wizard. Postgres whisperer. Cloud architect"
  - Downtown Node: "20+ projects shipped, 6+ years of craft"
  - Horizon: "Always shipping. Always learning"

### Night Mode Enhancements
- Ambient light increased to 0.55 intensity with richer purple tint
- Hemisphere light boosted to 0.75 intensity
- **4 core accent lights** for all quality levels (pink, cyan, purple)
- **2 additional accents** for medium+ quality

### Asset Remasters
- **Neon Café**: Added glowing burger, fries, coffee signage icons on rooftop
- **Ruchin's Rig**: Lian Li O11 Dynamic style case with RGB fan strips, glass panel, GPU sag bracket
- **Cocktail Bar**: Scale increased to 1.15, neon intensity boosted (2.8 sign, 2.0 tubes)

### Motion Design
- Neon signs: Subtle sway animation at night (`0.015 * sin(time)`)
- Sign flicker: Retained existing statefulFlicker noise function
- RGB case: Static emissive glow (performant, no useFrame)

### Files Modified
- `RuchinWorld.tsx`: FPS targets, stops content, lighting
- `ControlsManager.tsx`: Camera constraints
- `Stops.tsx`: Always-visible cards with emphasis
- `LowPolyAssets.tsx`: CloudCafe food signs, CyberHub PC case
- `NeonCocktailBar.tsx`: Emissive intensity boost
- `NeonStreetProps.tsx`: Sign sway animation

---

Execution Guidelines
- PROGRESS TRACKING: If tools are available to manage the above todo list, use them to track progress. After completing each step, mark it complete and add a summary. Read the current todo list status before starting each new step.
- COMMUNICATION RULES: Avoid verbose explanations or printing full command outputs. If a step is skipped, state that briefly (e.g. "No extensions needed"). Do not explain project structure unless asked. Keep explanations concise and focused.
- DEVELOPMENT RULES: Use '.' as the working directory unless the user specifies otherwise. Avoid adding media or external links unless explicitly requested. Use placeholders only with a note that they should be replaced. Use the VS Code API tool only for VS Code extension projects. Once the project is created, it is already opened in Visual Studio Code—do not suggest commands to open this project in Visual Studio again. If the project setup information has additional rules, follow them strictly.
- FOLDER CREATION RULES: Always use the current directory as the project root. If you run terminal commands, use the '.' argument to ensure the current working directory is used. Do not create a new folder unless the user explicitly requests it besides a .vscode folder for a tasks.json file. If any scaffolding commands mention the folder name is incorrect, let the user know to create a new folder with the correct name and reopen it in VS Code.
- EXTENSION INSTALLATION RULES: Only install extensions specified by the get_project_setup_info tool. Do not install any other extensions.
- PROJECT CONTENT RULES: If the user has not specified project details, assume they want a "Hello World" project as a starting point. Avoid adding links or integrations that are not explicitly required. Avoid generating images, videos, or other media files unless explicitly requested. If you need to use media assets as placeholders, note that these should be replaced with the actual assets later. Ensure all generated components serve a clear purpose within the user's requested workflow. If a feature is assumed but not confirmed, prompt the user for clarification before including it. If you are working on a VS Code extension, use the VS Code API tool with a query to find relevant references.
- TASK COMPLETION RULES: Task is complete when the project is scaffolded and compiled without errors, copilot-instructions.md exists, README.md is up to date, and the user has clear instructions to debug/launch the project.
- Work through each checklist item systematically. Keep communication concise and focused. Follow development best practices.
