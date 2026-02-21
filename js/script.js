// Wait for DOM to be fully loaded 67
document.addEventListener('DOMContentLoaded', function() {
  // Accessibility announcer function
  function announce(message) {
    const announcer = document.getElementById("screen-reader-announcer");
    announcer.textContent = message;
  }

  // Matrix rain effect
  const canvas = document.getElementById("matrix-canvas");
  const ctx = canvas.getContext("2d"); 

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const katakana = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const fontSize = 16;
  let columns = Math.floor(width / fontSize);

  const drops = new Array(columns).fill(1);

  // Create offscreen canvas for better performance
  const offscreenCanvas = document.createElement('canvas');
  const offscreenCtx = offscreenCanvas.getContext('2d');
  
  // Frame rate control variables
  let lastFrameTime = 0;
  const targetFPS = 60;
  const frameInterval = 1000 / targetFPS;
  let animationFrameId;
  
  // Performance monitoring
  let frameCount = 0;
  let lastFPSUpdate = 0;
  let currentFPS = 0;
  
  // Track matrix state and current color for theme changes
  let matrixEnabled = true;
  let matrixColor = "#33FF33";

  function startMatrix() {
    if (!matrixEnabled || animationFrameId) return;
    lastFrameTime = performance.now();
    animationFrameId = requestAnimationFrame(drawMatrix);
  }

  function stopMatrix() {
    if (!animationFrameId) return;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  function drawMatrix(timestamp) {
    // Request next frame first for smoother animation
    animationFrameId = requestAnimationFrame(drawMatrix);

    // Frame rate limiting
    const elapsed = timestamp - lastFrameTime;
    if (elapsed < frameInterval) return;
    
    // Calculate actual FPS
    frameCount++;
    if (timestamp - lastFPSUpdate >= 1000) {
      currentFPS = Math.round((frameCount * 1000) / (timestamp - lastFPSUpdate));
      frameCount = 0;
      lastFPSUpdate = timestamp;
    }
    
    // Update last frame time with the time that's consistent with the desired frame rate
    lastFrameTime = timestamp - (elapsed % frameInterval);
    
    // Resize offscreen canvas if needed
    if (offscreenCanvas.width !== width || offscreenCanvas.height !== height) {
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
    }
    
    // Draw to offscreen canvas first
    offscreenCtx.fillStyle = "rgba(0, 0, 0, 0.1)";
    offscreenCtx.fillRect(0, 0, width, height);
    
    // Use the current theme color for matrix rain
    offscreenCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || matrixColor;
    offscreenCtx.font = `${fontSize}px 'Share Tech Mono', monospace`;
    
    for (let i = 0; i < drops.length; i++) {
      const text = katakana.charAt(Math.floor(Math.random() * katakana.length));
      offscreenCtx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    
    // Copy from offscreen canvas to visible canvas
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(offscreenCanvas, 0, 0);
  }
  
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    
    // Reset drops array with proper length
    drops.length = columns;
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }
  });
  // Start matrix animation
  startMatrix();
/* Function to pause/resume matrix animation--- Old>>>
  function toggleMatrixAnimation(enabled) {
    if (enabled && !animationFrameId) {
      lastFrameTime = performance.now();
      animationFrameId = requestAnimationFrame(drawMatrix);
    } else if (!enabled && animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  } */
  
  // new  matrix --on matrix --onf function with better performance and state management
  function toggleMatrixAnimation(enabled) {
    matrixEnabled = enabled;

  if (matrixEnabled) {
    startMatrix();
  } else {
    stopMatrix();
  }
}
  



  // Pause animation when tab is not visible to save resources
  document.addEventListener('visibilitychange', () => {
    toggleMatrixAnimation(!document.hidden);
  });

  // Glitch effect function
  function triggerGlitch() {
    const glitchOverlay = document.getElementById("glitch-overlay");
    glitchOverlay.style.opacity = "1";
    
    // Random glitch position
    const xPos = Math.random() * 100;
    const yPos = Math.random() * 100;
    
    glitchOverlay.style.background = `
      linear-gradient(
        ${Math.random() * 360}deg,
        rgba(51, 255, 51, ${Math.random() * 0.3}),
        transparent ${50 + Math.random() * 20}%
      )
    `;
    
    setTimeout(() => {
      glitchOverlay.style.opacity = "0";
    }, 150);
  }

  // Periodically trigger glitch effects
  setInterval(triggerGlitch, 3000 + Math.random() * 5000);

  // Terminal typing effect
  const terminal = document.getElementById("terminal");
  const cursor = document.getElementById("cursor");

  const lines = [
    "void@root ~",
    "└─$ sudo kill -9 $(pgrep -u 🫵) --0xdeadbeef --overwrite --darknet-flush --final-breach",
    "[🫵.nullified] // access revoked, shadows fragmented, no backups, no mercy",
    "",
    "--==[𝔾𝕝𝟙𝕥𝕔𝕙𝟘𝕧𝟛𝕣𝕣𝟙𝕕𝟛 v.0x𝟼𝟹𝟹 | σʜ∂ωʀᴏᴏᴛ17]==--",
    "--==[payload: %bTn>7j@vP$e0>yF`f;!F$LS]#d;Oz1^Vkx*6/4r;#&<|U3A,,zVKUp9j+]<P",
    "--==[checksum: MzY3ZTQ4ZjUyYTIxNjU4NjNkZjEzZjZmYzMyYmNmMzY= | eol]==--",
    "",
    "Initializing system..."
  ];

  let lineIndex = 0;
  let charIndex = 0;

  function typeLine() {
    if (lineIndex >= lines.length) {
      cursor.style.display = "none";
      startProgressBar();
      return;
    }

    const line = lines[lineIndex];
    if (charIndex < line.length) {
      terminal.textContent += line.charAt(charIndex);
      charIndex++;
      terminal.scrollTop = terminal.scrollHeight; // keep scroll down
      setTimeout(typeLine, 4);
    } else {
      terminal.textContent += "\n";
      terminal.scrollTop = terminal.scrollHeight; // keep scroll down
      lineIndex++;
      charIndex = 0;
      setTimeout(typeLine, 60);
    }
  }

  // Progress bar animation
  function startProgressBar() {
    const progressBar = document.getElementById("main-progress");
    const progressText = progressBar.querySelector(".progress-text");
    let progress = 0;
    
    const progressInterval = setInterval(() => {
      progress += Math.random() * 5;
      if (progress > 100) progress = 100;
      
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${Math.floor(progress)}%`;
      
      // Update ARIA attributes for accessibility
      progressBar.parentElement.setAttribute("aria-valuenow", Math.floor(progress));
      
      
      if (progress === 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          addTerminalLine("System initialized successfully.");
          addTerminalLine("Gl1tch0v3rr1d3 terminal ready.");
          addTerminalLine("Type \"help\" for available commands.");
          announce("System initialized. Command input is now available.");
          enableCommandInput(); // Enable command input here
          activatePet();
        }, 500);
      }
     /* else {
      console.error("Progress bar error: " + progress);
    } */
    }, 200); 
   
  }

  // Add a line to the terminal
  function addTerminalLine(text) {
    const terminalContent = terminal.textContent;
    terminal.textContent = terminalContent + "\n" + text;
    terminal.scrollTop = terminal.scrollHeight;
  }

  // Enable command input after initialization
  function enableCommandInput() {
    const commandInput = document.getElementById("command-input");
    const commandButton = document.getElementById("command-button");
    
    commandInput.disabled = false;
    commandButton.disabled = false;
    
    // Focus on input
    commandInput.focus();
    
    // Add event listeners
    commandButton.addEventListener("click", executeCommand);
    commandInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        executeCommand();
      }
    });
    
    // Setup command history
    setupCommandHistory();
    
    // Update status bar time
    updateStatusTime();
    setInterval(updateStatusTime, 1000);
  }

  // Update status bar time
  function updateStatusTime() {
    const statusTime = document.getElementById("status-time");
    const now = new Date();
    statusTime.textContent = now.toLocaleTimeString();
  }

  // Execute command
  function executeCommand() {
    const commandInput = document.getElementById("command-input");
    const command = commandInput.value.trim();
    
    if (command === "") return;
    
    // Add command to terminal
    addTerminalLine(`void@root ~ └ ${command}`);
    
    // Add to command history
    addToCommandHistory(command);
    
    // Process command
    processCommand(command);
    
    // Clear input
    commandInput.value = "";
    commandInput.focus();
  }

  // Sound system
  let soundEnabled = true;
  
  function playSound(soundId) {
    if (!soundEnabled) return;
    
    const sound = document.getElementById(soundId);
    if (sound) {
      // Reset sound to beginning if already playing
      sound.currentTime = 0;
      sound.play().catch(e => console.log("Sound play error:", e));
    }
  }
  
  // Command processor
  function processCommand(command) {
    // Trigger glitch effect on command execution
    triggerGlitch();
    
    // Play keypress sound
    playSound("sound-keypress");
    
    // Pet reaction to commands
    if (petVisible) {
      reactToPetCommand(command);
    }
    
    // Easter egg: BSOD for dangerous command
    if (command === "sudo rm -rf /" || command === "sudo rm -rf /*") {
      playSound("sound-error");
      showBSOD();
      return;
    }
    
    // Easter egg: Hidden backdoor
    if (command === "override_access --silent" || command === "backdoor") {
      playSound("sound-success");
      showBackdoorAccess();
      return;
    }
    
    // Sound control commands
    if (command === "sound --off") {
      soundEnabled = false;
      addTerminalLine("Sound effects disabled");
      return;
    }
    
    if (command === "sound --on") {
      soundEnabled = true;
      addTerminalLine("Sound effects enabled");
      playSound("sound-success");
      return;
    }
    
    if (command === "play --rick") {
      playSound("sound-rick");
      addTerminalLine("Never gonna give you up...");
      return;
    }
    
    // Theme switching commands
    if (command === "theme --red") {
      setTheme("red");
      addTerminalLine("Theme switched to RED");
      return;
    }
    
    if (command === "theme --blue") {
      setTheme("blue");
      addTerminalLine("Theme switched to BLUE");
      return;
    }
    
    if (command === "theme --green" || command === "theme --default") {
      setTheme("default");
      addTerminalLine("Theme switched to DEFAULT (green)");
      return;
    }
    
    // Pet game command
    if (command === "pet --game=snake") {
      startSnakeGame();
      return;
    }
    
    switch(command) {
      case "help":
        addTerminalLine("Available commands:");
        addTerminalLine("  help       - Show this help message");
        addTerminalLine("  clear/cls(new)      - Clear terminal");
        addTerminalLine("  status     - Show system status");
        addTerminalLine("  scan       - Scan for vulnerabilities");
        addTerminalLine("  hack       - Attempt to hack the system");
        addTerminalLine("  matrix     - Toggle matrix rain effect");
        addTerminalLine("  glitch     - Trigger glitch effect");
        addTerminalLine("  pet        - Toggle digital pet");
        addTerminalLine("  whoami     - Display current user");
        addTerminalLine("  theme --red/--blue/--green - Switch color theme");
        addTerminalLine("  pet --game=snake - Play Snake mini-game");
        addTerminalLine("  sound --on/--off - Toggle sound effects");
        break;
        
      case "clear", "cls":
        terminal.textContent = "";
        announce("Terminal cleared");
        break;
        
      case "status":
        addTerminalLine("System Status:");
        addTerminalLine("  CPU: 32% | Memory: 1.2GB/4GB | Network: Active");
        addTerminalLine("  Security Level: Maximum");
        addTerminalLine("  Encryption: AES-256");
        addTerminalLine("  Last Login: " + new Date().toLocaleString());
        break;
        
      case "scan":
        addTerminalLine("Initiating vulnerability scan...");
        runProgressOperation("Scanning system", () => {
          addTerminalLine("Scan complete. Results:");
          addTerminalLine("  Found 3 potential vulnerabilities:");
          addTerminalLine("  - CVE-2023-1337: Medium risk");
          addTerminalLine("  - PORT-22: SSH exposed");
          addTerminalLine("  - USER-ADMIN: Default credentials");
        });
        break;
        
      case "hack":
        addTerminalLine("UNAUTHORIZED ACCESS ATTEMPT DETECTED");
        addTerminalLine("SECURITY PROTOCOLS ENGAGED");
        
        // Multiple glitch effects
        for (let i = 0; i < 5; i++) {
          setTimeout(triggerGlitch, i * 200);
        }
        
        setTimeout(() => {
          addTerminalLine("Access denied. This incident has been reported.");
        }, 1500);
        break;
        
      case "matrix":
       const matrixCanvas = document.getElementById("matrix-canvas");
          if (matrixCanvas.style.display === "none") {
          matrixCanvas.style.display = "block";
          addTerminalLine("Matrix rain effect enabled.");
        } else {
          matrixCanvas.style.display = "none";
          addTerminalLine("Matrix rain effect disabled.");
        }
        break;
        
      case "glitch":
        addTerminalLine("Triggering system glitch...");
        
        // Multiple intense glitch effects
        for (let i = 0; i < 10; i++) {
          setTimeout(triggerGlitch, i * 100);
        }
        
        setTimeout(() => {
          addTerminalLine("Glitch sequence complete.");
        }, 1500);
        break;
        
      case "pet":
        const petContainer = document.getElementById("pet-container");
        if (petContainer.style.display === "none") {
          petVisible = true;
          petContainer.style.display = "block";
          addTerminalLine("Digital pet activated.");
          activatePet(); // Restart pet functions
        } else {
          petVisible = false;
          petContainer.style.display = "none";
          addTerminalLine("Digital pet deactivated.");
        }
        break;
        
      case "whoami":
        addTerminalLine("Current user: void@root");
        addTerminalLine("Access level: ADMINISTRATOR");
        addTerminalLine("Session: " + Math.random().toString(36).substring(2, 15));
        break;

      case "matrix --on":
        toggleMatrixAnimation(true);
        addTerminalLine("Matrix rain enabled.");
        break;

      case "matrix --off":
        toggleMatrixAnimation(false);
        addTerminalLine("Matrix rain disabled.");
         break;
        
      // Easter egg: Hidden command
      case "matrix reloaded":
        addTerminalLine("Entering the Matrix...");
        document.body.style.animation = "glitch 0.3s infinite";
        setTimeout(() => {
          document.body.style.animation = "";
          addTerminalLine("There is no spoon.");
        }, 3000);
        break;

        
      // Easter egg: Hidden command
      case "42":
        addTerminalLine("The Answer to the Ultimate Question of Life, the Universe, and Everything.");
        break;
        
      default:
        addTerminalLine(`Command not recognized: ${command}`);
        addTerminalLine("Type \"help\" for available commands.");
    }
  }
  
  // Pet reaction to commands
  function reactToPetCommand(command) {
    const petMouth = document.querySelector(".pet-mouth");
    const petEyes = document.querySelectorAll(".pet-eye");
    
    // Reset previous expressions
    petMouth.className = "pet-mouth";
    petEyes.forEach(eye => eye.className = eye.classList.contains("left") ? "pet-eye left" : "pet-eye right");
    
    // Jump animation for certain commands
    if (["hack", "glitch", "scan"].includes(command)) {
      document.getElementById("pet").style.animation = "float 0.5s ease-in-out";
      setTimeout(() => {
        document.getElementById("pet").style.animation = "";
      }, 500);
    }
    
    // Command-specific reactions
    switch(command) {
      case "hack":
        petMouth.classList.add("surprised");
        petEyes.forEach(eye => eye.classList.add("alert"));
        showPetSpeech("Unauthorized access detected!", "Alert");
        break;
        
      case "scan":
        petMouth.classList.add("suspicious");
        petEyes.forEach(eye => eye.classList.add("suspicious"));
        showPetSpeech("Scanning for vulnerabilities...", "Scan");
        break;
        
      case "clear","cls":
        petMouth.classList.add("happy");
        showPetSpeech("All clean now!", "Clean");
        break;
        
      case "help":
        petMouth.classList.add("happy");
        petEyes.forEach(eye => eye.classList.add("happy"));
        showPetSpeech("I'm here to help! Try 'pet --game=snake' for fun!", "Helper");
        break;
    }
  }
  
  // Run progress operation with progress bar
  function runProgressOperation(operationName, callback) {
    const progressContainer = document.createElement("div");
    progressContainer.className = "progress-container";
    progressContainer.setAttribute("aria-label", `${operationName} progress`);
    progressContainer.setAttribute("role", "progressbar");
    progressContainer.setAttribute("aria-valuenow", "0");
    progressContainer.setAttribute("aria-valuemin", "0");
    progressContainer.setAttribute("aria-valuemax", "100");
    
    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    
    const progressText = document.createElement("div");
    progressText.className = "progress-text";
    progressText.textContent = "0%";
    
    progressBar.appendChild(progressText);
    progressContainer.appendChild(progressBar);
    terminal.appendChild(progressContainer);
    terminal.scrollTop = terminal.scrollHeight;
    
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 5;
      if (progress > 100) progress = 100;
      
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${Math.floor(progress)}%`;
      
      // Update ARIA attributes for accessibility
      progressContainer.setAttribute("aria-valuenow", Math.floor(progress));
      
      if (progress === 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          // Remove progress bar
          terminal.removeChild(progressContainer);
          
          // Execute callback
          if (callback) callback();
        }, 500);
      }
    }, 100);
  }
  
  // Theme switching function
  function setTheme(theme) {
    const root = document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('theme-red', 'theme-blue');
    
    // Add the appropriate theme class
    if (theme === 'red') {
      root.classList.add('theme-red');
    } else if (theme === 'blue') {
      root.classList.add('theme-blue');
    }
    // Default theme (green) has no class
    
    // Update matrix color based on theme
    updateMatrixColor(theme);
    
    // Announce theme change for screen readers
    announce(`Theme changed to ${theme}`);
  }
  
  // Update matrix rain color based on theme
  function updateMatrixColor(theme) {
    switch(theme) {
      case 'red':
        matrixColor = '#FF3333';
        break;
      case 'blue':
        matrixColor = '#3333FF';
        break;
      default:
        matrixColor = '#33FF33';
    }
  }
  // Digital pet variables and functions
  let petVisible = true;
  let petMood = 100; // 0-100, higher is happier
  let petEnergy = 100; // 0-100, higher is more energetic
  let petInitialized = false;
  let petMoodIntervalId = null;
function activatePet() {
    const pet = document.getElementById("pet");
    const petContainer = document.getElementById("pet-container");
    const petMenu = document.getElementById("pet-menu");
    const petSpeech = document.getElementById("pet-speech");
    if (petInitialized) return;
    petInitialized = true;


    // Show welcome message
    setTimeout(() => {
      showPetSpeech("Hello! I'm your digital assistant. Click me for options!", "Welcome");
    }, 2000);
    
    // Pet click handler
    petContainer.addEventListener("click", () => {
      // Toggle pet menu
      if (petMenu.style.display === "block") {
        petMenu.style.display = "none";
      } else {
        petMenu.style.display = "block";
        
        // Position menu based on viewport
        if (window.innerWidth < 768) {
          petMenu.style.bottom = "110px";
          petMenu.style.right = "20px";
        } else {
          petMenu.style.bottom = "110px";
          petMenu.style.right = "40px";
        }
      }
      
      // Play pet sound
      playSound("sound-pet");
    });
    
    // Pet menu actions
    document.querySelectorAll(".pet-action").forEach(action => {
      action.addEventListener("click", () => {
        const actionType = action.getAttribute("data-action");
        
        switch(actionType) {
          case "help":
            showPetSpeech("Try typing 'help' in the terminal for available commands!", "Help");
            petMood += 5;
            break;
            
          case "hack":
            showPetSpeech("I can help you hack! Try the 'scan' command first to find vulnerabilities.", "Hack Assistant");
            petMood += 10;
            break;
            
          case "play":
            showPetSpeech("Let's play a game! Type 'pet --game=snake' to start Snake!", "Play Time");
            petMood += 15;
            petEnergy -= 10;
            break;
            
          case "hide":
            petContainer.style.display = "none";
            petMenu.style.display = "none";
            petVisible = false;
            addTerminalLine("Digital pet hidden. Type 'pet' to show again.");
            break;
        }
        
        // Close menu after action
        petMenu.style.display = "none";
      });
    });
    
    // Pet speech close button
    document.querySelector(".pet-speech-close").addEventListener("click", () => {
      petSpeech.classList.remove("show");
    });    // Periodic pet mood and energy updates
    if (!petMoodIntervalId) {
      petMoodIntervalId = setInterval(() => {
        if (!petVisible) return;

        // Decrease mood and energy over time
        petMood = Math.max(0, petMood - 1);
        petEnergy = Math.max(0, petEnergy - 0.5);

        // Update pet appearance based on mood and energy
        updatePetAppearance();

        // Random pet actions
        if (Math.random() < 0.05) {
          randomPetAction();
        }
      }, 10000);
    }
  }
  
  // Show pet speech bubble
  function showPetSpeech(message, title = "") {
    if (!petVisible) return;
    
    const petSpeech = document.getElementById("pet-speech");
    const petSpeechTitle = document.querySelector(".pet-speech-title");
    const petSpeechContent = document.querySelector(".pet-speech-content");
    
    petSpeechTitle.textContent = title;
    petSpeechContent.textContent = message;
    
    petSpeech.classList.add("show");
    
    // Auto-hide after a while
    setTimeout(() => {
      petSpeech.classList.remove("show");
    }, 5000);
  }
  
  // Update pet appearance based on mood and energy
  function updatePetAppearance() {
    const petMouth = document.querySelector(".pet-mouth");
    const petEyes = document.querySelectorAll(".pet-eye");
    
    // Reset classes
    petMouth.className = "pet-mouth";
    petEyes.forEach(eye => eye.className = eye.classList.contains("left") ? "pet-eye left" : "pet-eye right");
    
    // Apply mood-based appearance
    if (petMood > 80) {
      petMouth.classList.add("happy");
      petEyes.forEach(eye => eye.classList.add("happy"));
    } else if (petMood > 50) {
      // Default neutral expression
    } else if (petMood > 20) {
      petMouth.classList.add("sad");
    } else {
      petMouth.classList.add("angry");
      petEyes.forEach(eye => eye.classList.add("suspicious"));
    }
    
    // Apply energy-based effects
    if (petEnergy < 30) {
      // Slow down animations when tired
      document.querySelectorAll(".pet-leg").forEach(leg => {
        leg.style.animationDuration = "1s";
      });
    } else {
      // Normal animation speed
      document.querySelectorAll(".pet-leg").forEach(leg => {
        leg.style.animationDuration = "0.5s";
      });
    }
  }
  
  // Random pet actions
  function randomPetAction() {
    if (!petVisible) return;
    
    const actions = [
      { message: "Did you know you can change the theme? Try 'theme --red'!", title: "Tip" },
      { message: "I'm scanning the network... Everything looks secure!", title: "Security" },
      { message: "01001000 01101001 00100001", title: "Binary" },
      { message: "I'm getting hungry... feed me some data!", title: "Hungry" },
      { message: "Try the Snake game! It's fun!", title: "Game Time" }
    ];
    
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    showPetSpeech(randomAction.message, randomAction.title);
  }

  // Snake Game Implementation
  let snakeGame = {
    canvas: null,
    ctx: null,
    snake: [],
    food: null,
    direction: 'right',
    nextDirection: 'right',
    gameSpeed: 100,
    tileSize: 10,
    gameLoopInterval: null,
    score: 0,
    isPaused: false,
    
    // Initialize the game
    init: function() {
      this.canvas = document.getElementById('snake-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resetGame();
      this.setupEventListeners();
      this.gameLoop();
    },
    
    // Reset game state
    resetGame: function() {
      this.snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
      ];
      this.generateFood();
      this.direction = 'right';
      this.nextDirection = 'right';
      this.score = 0;
      this.updateScore();
      this.isPaused = false;
      document.getElementById('snake-pause').textContent = 'Pause';
    },
    
    // Generate food at random position
    generateFood: function() {
      const maxX = Math.floor(this.canvas.width / this.tileSize) - 1;
      const maxY = Math.floor(this.canvas.height / this.tileSize) - 1;
      
      // Generate random position
      let foodX = Math.floor(Math.random() * maxX) + 1;
      let foodY = Math.floor(Math.random() * maxY) + 1;
      
      // Check if food is on snake
      let onSnake = false;
      for (let i = 0; i < this.snake.length; i++) {
        if (this.snake[i].x === foodX && this.snake[i].y === foodY) {
          onSnake = true;
          break;
        }
      }
      
      // If food is on snake, generate again
      if (onSnake) {
        this.generateFood();
      } else {
        this.food = {x: foodX, y: foodY};
      }
    },
    
    // Update score display
    updateScore: function() {
      document.getElementById('snake-score').textContent = `Score: ${this.score}`;
    },
    
    // Main game loop
    gameLoop: function() {
      if (this.gameLoopInterval) {
        clearInterval(this.gameLoopInterval);
        
      }
      
      this.gameLoopInterval = setInterval(() => {
        if (!this.isPaused) {
          this.update();
          this.draw();
        }
      }, this.gameSpeed);
    },
    
    // Update game state
    update: function() {
      // Update direction
      this.direction = this.nextDirection;
      
      // Create new head based on direction
      const head = {x: this.snake[0].x, y: this.snake[0].y};
      
      switch(this.direction) {
        case 'up':
          head.y -= 1;
          break;
        case 'down':
          head.y += 1;
          break;
        case 'left':
          head.x -= 1;
          break;
        case 'right':
          head.x += 1;
          break;
      }
      
      // Check for collisions
      if (this.checkCollision(head)) {
        this.gameOver();
        return;
      }
      
      // Add new head
      this.snake.unshift(head);
      
      // Check if snake ate food
      if (head.x === this.food.x && head.y === this.food.y) {
        this.score += 10;
        this.updateScore();
        this.generateFood();
        playSound("sound-game");
      } else {
        // Remove tail if no food eaten
        this.snake.pop();
      }
    },
    
    // Check for collisions
    checkCollision: function(head) {
      // Check wall collision
      if (head.x < 0 || head.y < 0 || 
          head.x >= this.canvas.width / this.tileSize || 
          head.y >= this.canvas.height / this.tileSize) {
        return true;
      }
      
      // Check self collision
      for (let i = 0; i < this.snake.length; i++) {
        if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
          return true;
        }
      }
      
      return false;
    },
    
    // Game over
    gameOver: function() {
      clearInterval(this.gameLoopInterval);
      playSound("sound-error");
      
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
      this.ctx.font = '20px "VT323", monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 10);
      this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
      this.ctx.fillText('Press any key to restart', this.canvas.width / 2, this.canvas.height / 2 + 50);
      
      // Set up one-time event listener for restart
      const restartHandler = (e) => {
        this.resetGame();
        this.gameLoop();
        window.removeEventListener('keydown', restartHandler);
      };
      
      window.addEventListener('keydown', restartHandler);
    },
    
    // Draw game state
    draw: function() {
      // Clear canvas
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw snake
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
      this.ctx.fillStyle = primaryColor;
      
      for (let i = 0; i < this.snake.length; i++) {
        this.ctx.fillRect(
          this.snake[i].x * this.tileSize, 
          this.snake[i].y * this.tileSize, 
          this.tileSize, 
          this.tileSize
        );
        
        // Add pixel effect to snake
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.strokeRect(
          this.snake[i].x * this.tileSize, 
          this.snake[i].y * this.tileSize, 
          this.tileSize, 
          this.tileSize
        );
      }
      
      // Draw food
      const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color');
      this.ctx.fillStyle = secondaryColor;
      this.ctx.fillRect(
        this.food.x * this.tileSize, 
        this.food.y * this.tileSize, 
        this.tileSize, 
        this.tileSize
      );
      
      // Add glow effect to food
      this.ctx.shadowColor = secondaryColor;
      this.ctx.shadowBlur = 10;
      this.ctx.fillRect(
        this.food.x * this.tileSize, 
        this.food.y * this.tileSize, 
        this.tileSize, 
        this.tileSize
      );
      this.ctx.shadowBlur = 0;
    },
    
    // Set up event listeners
    setupEventListeners: function() {
      // Keyboard controls
      window.addEventListener('keydown', (e) => {
        if (!this.isPaused) {
          switch(e.key) {
            case 'ArrowUp':
              if (this.direction !== 'down') {
                this.nextDirection = 'up';
              }
              break;
            case 'ArrowDown':
              if (this.direction !== 'up') {
                this.nextDirection = 'down';
              }
              break;
            case 'ArrowLeft':
              if (this.direction !== 'right') {
                this.nextDirection = 'left';
              }
              break;
            case 'ArrowRight':
              if (this.direction !== 'left') {
                this.nextDirection = 'right';
              }
              break;
          }
        }
        
        // Prevent arrow keys from scrolling the page
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault();
        }
      });
      
      // Pause button
      document.getElementById('snake-pause').addEventListener('click', () => {
        this.isPaused = !this.isPaused;
        document.getElementById('snake-pause').textContent = this.isPaused ? 'Resume' : 'Pause';
      });
      
      // Exit button
      document.getElementById('snake-exit').addEventListener('click', () => {
        clearInterval(this.gameLoopInterval);
        document.getElementById('snake-game').style.display = 'none';
        addTerminalLine("Snake game exited. Final score: " + this.score);
      });
    }
  };
  
  // Start Snake Game
  function startSnakeGame() {
    addTerminalLine("Starting Snake mini-game...");
    addTerminalLine("Use arrow keys to control the snake.");
    addTerminalLine("Eat the food to grow and earn points.");
    
    // Play game sound
    playSound("sound-game");
    
    // Show game container
    const gameContainer = document.getElementById('snake-game');
    gameContainer.style.display = 'flex';
    
    // Initialize game
    setTimeout(() => {
      snakeGame.init();
    }, 100);
    
    // Make pet react
    if (petVisible) {
      const petMouth = document.querySelector(".pet-mouth");
      const petEyes = document.querySelectorAll(".pet-eye");
      
      petMouth.className = "pet-mouth happy";
      petEyes.forEach(eye => eye.classList.add("happy"));
      
      showPetSpeech("Let's play Snake! Use arrow keys to control.", "GAME TIME");
    }
  }

  // BSOD Easter Egg
  function showBSOD() {
    // Create BSOD overlay
    const bsod = document.createElement("div");
    bsod.style.position = "fixed";
    bsod.style.top = "0";
    bsod.style.left = "0";
    bsod.style.width = "100vw";
    bsod.style.height = "100vh";
    bsod.style.backgroundColor = "#0078d7";
    bsod.style.color = "white";
    bsod.style.padding = "20% 10%";
    bsod.style.boxSizing = "border-box";
    bsod.style.fontFamily = "Segoe UI, sans-serif";
    bsod.style.fontSize = "1.5rem";
    bsod.style.zIndex = "9999";
    bsod.style.display = "flex";
    bsod.style.flexDirection = "column";
    bsod.style.alignItems = "center";
    bsod.style.justifyContent = "center";
    bsod.style.textAlign = "center";
    
    bsod.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 2rem;">:(</div>
      <div style="margin-bottom: 1rem;">Your PC ran into a problem and needs to restart.</div>
      <div style="margin-bottom: 2rem;">We're just collecting some error info, and then we'll restart for you.</div>
      <div style="margin-bottom: 1rem;">0% complete</div>
      <div style="font-size: 0.8rem; margin-top: 3rem;">
        <p>For more information about this issue and possible fixes, visit https://gl1tch0v3rr1d3.com/stop</p>
        <p>If you call a support person, give them this info:</p>
        <p>Stop code: CRITICAL_PROCESS_DIED</p>
      </div>
    `;
    
    document.body.appendChild(bsod);
    
    // Simulate progress
    let progress = 0;
    const progressText = bsod.querySelector("div:nth-child(4)");
    
    const progressInterval = setInterval(() => {
      progress += Math.random() * 5;
      if (progress > 100) progress = 100;
      
      progressText.textContent = `${Math.floor(progress)}% complete`;
      
      if (progress === 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          document.body.removeChild(bsod);
          // Auto-clear terminal and show reboot sequence
          simulateReboot();
        }, 1000);
      }
    }, 200);
  }
  
  // Simulate system reboot after BSOD
  function simulateReboot() {
    // Clear terminal
    terminal.textContent = "";
    
    // Disable command input during reboot
    const commandInput = document.getElementById("command-input");
    const commandButton = document.getElementById("command-button");
    commandInput.disabled = true;
    commandButton.disabled = true;
    
    // Show reboot sequence
    const rebootLines = [
      "System halted due to critical error.",
      "Initiating emergency recovery protocol...",
      "Checking file system integrity...",
      "Recovering system files...",
      "Restoring terminal environment...",
      "Loading kernel modules...",
      "Initializing system services...",
      "Mounting virtual filesystems...",
      "Starting network services...",
      "Performing security checks...",
      "System recovery complete.",
      "",
      "Gl1tch0v3rr1d3 Terminal v2.0",
      "Reboot successful. All systems operational.",
      "",
      "WARNING: Dangerous command execution detected.",
      "This incident has been logged.",
      "",
      "Type 'help' for available commands."
    ];
    
    // Display reboot lines with typing effect
    let lineIndex = 0;
    
    function typeRebootLine() {
      if (lineIndex < rebootLines.length) {
        addTerminalLine(rebootLines[lineIndex]);
        lineIndex++;
        setTimeout(typeRebootLine, 300);
      } else {
        // Re-enable command input after reboot
        commandInput.disabled = false;
        commandButton.disabled = false;
        commandInput.focus();
        
        // Announce reboot completion for screen readers
        announce("System rebooted successfully after critical error.");
      }
    }
    
    // Start typing reboot sequence
    typeRebootLine();
  }
  
  
  // Backdoor access easter egg
  function showBackdoorAccess() {
    addTerminalLine("BACKDOOR ACCESS GRANTED");
    addTerminalLine("Welcome to the shadow system, administrator.");
    addTerminalLine("");
    addTerminalLine("Available backdoor commands:");
    //addTerminalLine("  - matrix reloaded");
    addTerminalLine("  - 42");
    addTerminalLine("");
    addTerminalLine("Accessing hidden files...");
    
    // Multiple glitch effects
    for (let i = 0; i < 3; i++) {
      setTimeout(triggerGlitch, i * 300);
    }
  }
  
  // Command history implementation
  let commandHistory = [];
  let historyIndex = -1;
  
  function setupCommandHistory() {
    const commandInput = document.getElementById("command-input");
    
    // Add event listener for arrow keys
    commandInput.addEventListener("keydown", function(e) {
      // Up arrow - previous command
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          commandInput.value = commandHistory[historyIndex];
        }
      }
      
      // Down arrow - next command
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          commandInput.value = commandHistory[historyIndex];
        } else if (historyIndex === 0) {
          historyIndex = -1;
          commandInput.value = "";
        }
      }
    });
  }
  
  function addToCommandHistory(command) {
    // Add command to beginning of history
    commandHistory.unshift(command);
    
    // Limit history size
    if (commandHistory.length > 50) {
      commandHistory.pop();
    }
    
    // Reset index
    historyIndex = -1;
  }

  // Start the typing effect when the page loads
  typeLine();
});


