// Your specific tasks
const allTasks = [
    "CCACHR Task",
    "Trusted Translations",
    "SRVTRF sercode",
    "Assumptions Script",
    "CHKGEN sercode",
    "QRPC",
    "FEEGEN sercode",
    "PMI SCRIPT",
    "Payoff Script",
    "Setup a PTP",
    "Escrow Waiver Script",
    "Imaged a document to sci",
    "SLRECA task",
    "Recognize Someone",
    "Outbound Dialer Call",
    "Reissued a check",
    "SII Script",
    "Matic/Retention offer completed",
    "CCADCH",
    "Wrike Request",
    "Added an A3P",
    "ESCANA Task",
    "CCINFO used",
    "Guided brw to doc center or forms"
];

// Pre-generate 50 different card layouts
const preGeneratedCards = [];

function generateAllCardLayouts() {
    const cards = [];
    
    // Create 50 different shuffled arrangements
    for (let cardNum = 0; cardNum < 50; cardNum++) {
        const shuffled = [...allTasks];
        
        // Use different seed for each card
        let seed = (cardNum + 1) * 12345;
        
        // Fisher-Yates shuffle with different seed for each card
        for (let i = shuffled.length - 1; i > 0; i--) {
            seed = (seed * 9301 + 49297) % 233280;
            const random = (Math.sin(seed) * 10000) - Math.floor(Math.sin(seed) * 10000);
            const j = Math.floor(Math.abs(random) * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        cards.push(shuffled);
    }
    
    return cards;
}

function getDeviceId() {
    // Try to get existing device ID from localStorage
    let deviceId = localStorage.getItem('bingo_device_id');
    
    if (!deviceId) {
        // Create a unique device ID based on browser fingerprint
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Device fingerprint', 2, 2);
        
        const fingerprint = canvas.toDataURL() + 
                         navigator.userAgent + 
                         screen.width + 
                         screen.height + 
                         new Date().getTimezoneOffset();
        
        // Create hash from fingerprint
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            const char = fingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        deviceId = 'device_' + Math.abs(hash);
        localStorage.setItem('bingo_device_id', deviceId);
    }
    
    return deviceId;
}

function generatePlayerTasks() {
    // Use device ID instead of name to determine card
    const deviceId = getDeviceId();
    
    // Create hash from device ID to determine which of the 50 cards they get
    let hash = 0;
    for (let i = 0; i < deviceId.length; i++) {
        const char = deviceId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    
    // Make sure hash is positive and map it to 0-49 range
    hash = Math.abs(hash);
    const cardNumber = hash % 50;
    
    console.log(`Device assigned card #${cardNumber + 1} out of 50`);
    
    // Return the pre-generated card for this device
    return preGeneratedCards[cardNumber] || allTasks;
}

let currentPlayer = '';
let playerTasks = [];
let gameState = {};
let isGameStarting = false;

function saveGameState(playerName, gameState) {
    try {
        const deviceId = getDeviceId();
        const saveKey = `bingo_progress_${deviceId}`;
        const saveData = {
            gameState: gameState,
            lastPlayerName: playerName,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem(saveKey, JSON.stringify(saveData));
        console.log('Saved progress for device:', deviceId);
    } catch (error) {
        console.log('LocalStorage not available, using session storage');
    }
}

function loadGameState() {
    try {
        const deviceId = getDeviceId();
        const saveKey = `bingo_progress_${deviceId}`;
        const saved = localStorage.getItem(saveKey);
        if (saved) {
            const saveData = JSON.parse(saved);
            console.log('Loaded saved progress for device:', deviceId);
            return saveData.gameState;
        }
    } catch (error) {
        console.log('LocalStorage not available');
    }
    return null;
}

function showRules() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    
    if (!firstName || !lastName) {
        alert('Please enter both your first and last name.');
        return;
    }
    
    // Store the name for later use
    currentPlayer = `${firstName} ${lastName}`;
    
    // Show rules screen
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('rulesScreen').style.display = 'block';
}

function goBackToWelcome() {
    document.getElementById('rulesScreen').style.display = 'none';
    document.getElementById('welcomeScreen').style.display = 'block';
}

function checkRulesAgreement() {
    const checkboxes = document.querySelectorAll('.rule-checkbox');
    const continueBtn = document.getElementById('continueBtn');
    
    let allChecked = true;
    checkboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            allChecked = false;
        }
    });
    
    continueBtn.disabled = !allChecked;
}

function startGame() {
    if (isGameStarting) {
        return;
    }
    isGameStarting = true;
    
    playerTasks = generatePlayerTasks();
    
    // Try to load existing progress for this device
    const savedState = loadGameState();
    
    if (savedState) {
        // Use saved progress
        gameState = savedState;
        console.log('Loaded saved progress for', currentPlayer);
    } else {
        // Initialize new game state for all 25 squares
        gameState = {};
        for (let i = 0; i < 25; i++) {
            gameState[i] = { completed: false, number: '' };
        }
        // Free space is always completed
        gameState[12] = { completed: true, number: 'FREE' };
        
        // Save the initial state
        saveGameState(currentPlayer, gameState);
        console.log('Created new game for', currentPlayer);
    }
    
    document.getElementById('rulesScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    document.getElementById('playerName').textContent = currentPlayer;
    
    createBingoBoard();
    updateProgress();
    
    setTimeout(() => {
        isGameStarting = false;
    }, 500);
}

function createBingoBoard() {
    const board = document.getElementById('bingoBoard');
    board.innerHTML = '';
    
    for (let i = 0; i < 25; i++) {
        const square = document.createElement('div');
        square.className = 'bingo-square';
        square.setAttribute('data-index', i);
        
        if (i === 12) {
            // Free space (center) - OTD
            square.className += ' free-space completed';
            square.innerHTML = `
                <div class="task-name">🎯 OTD (Free Space) 🎯</div>
            `;
        } else {
            const taskIndex = i > 12 ? i - 1 : i; // Adjust for free space
            const task = playerTasks[taskIndex];
            const state = gameState[i];
            
            if (state && state.completed) {
                square.className += ' completed';
            }
            
            const numberValue = state ? state.number : '';
            
            square.innerHTML = `
                <div class="task-name">${task}</div>
                <input type="text" 
                       class="number-input" 
                       placeholder="Enter 10-digit number"
                       maxlength="10"
                       value="${numberValue}"
                       oninput="handleNumberInput(${i}, this.value)"
                       pattern="[0-9]*"
                       inputmode="numeric">
            `;
        }
        
        board.appendChild(square);
    }
}

function handleNumberInput(index, value) {
    // Only allow digits
    value = value.replace(/\D/g, '');
    
    // Update the input field
    event.target.value = value;
    
    // Make sure game state exists for this index
    if (!gameState[index]) {
        gameState[index] = { completed: false, number: '' };
    }
    
    // Update game state
    gameState[index].number = value;
    
    // Check if task is completed (10 digits entered)
    const wasCompleted = gameState[index].completed;
    gameState[index].completed = value.length === 10;
    
    // Save progress immediately
    saveGameState(currentPlayer, gameState);
    
    // Update square appearance if completion status changed
    if (wasCompleted !== gameState[index].completed) {
        const square = document.querySelector(`[data-index="${index}"]`);
        if (gameState[index].completed) {
            square.classList.add('completed');
        } else {
            square.classList.remove('completed');
        }
        updateProgress();
    }
}

function updateProgress() {
    const completed = Object.values(gameState).filter(state => state.completed).length;
    const total = 25;
    const percentage = Math.round((completed / total) * 100);
    
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('totalCount').textContent = total;
    document.getElementById('progressPercent').textContent = `${percentage}%`;
    document.getElementById('progressFill').style.width = `${percentage}%`;
    
    // Check for bingo (all tasks completed)
    if (completed === total) {
        setTimeout(() => {
            alert('🎉 BINGO! Congratulations on completing all tasks!');
        }, 500);
    }
}

function newGame() {
    if (confirm('Are you sure you want to reset your bingo card? This will clear all your progress on this device.')) {
        // Clear saved progress for this device
        try {
            const deviceId = getDeviceId();
            const saveKey = `bingo_progress_${deviceId}`;
            localStorage.removeItem(saveKey);
            console.log('Cleared progress for device:', deviceId);
        } catch (error) {
            console.log('LocalStorage not available');
        }
    }
    
    isGameStarting = false;
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('welcomeScreen').style.display = 'block';
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.disabled = true;
    }
}

async function saveToDevice() {
    try {
        // Create a clean version of the bingo card for saving
        const saveCard = document.createElement('div');
        saveCard.style.cssText = `
            width: 800px;
            background: white;
            padding: 40px;
            font-family: 'Inter', 'Segoe UI', sans-serif;
            position: absolute;
            top: -9999px;
            left: -9999px;
        `;

        // Add header
        const header = document.createElement('div');
        header.style.cssText = `
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
        `;
        header.innerHTML = `
            <h1 style="color: #2d3748; font-size: 2.5em; margin: 0 0 10px 0; font-weight: 700;">Customer Care Bingo Challenge</h1>
            <h2 style="color: #667eea; font-size: 1.5em; margin: 0; font-weight: 600;">${currentPlayer}</h2>
            <p style="color: #4a5568; margin: 10px 0 0 0; font-size: 1.1em;">Progress: ${Object.values(gameState).filter(s => s.completed).length}/25 Tasks Completed</p>
        `;

        // Create bingo board
        const board = document.createElement('div');
        board.style.cssText = `
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 12px;
            margin: 30px 0;
        `;

        // Add squares
        for (let i = 0; i < 25; i++) {
            const square = document.createElement('div');
            square.style.cssText = `
                background: ${gameState[i]?.completed ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
                border: 3px solid ${gameState[i]?.completed ? '#667eea' : '#e2e8f0'};
                border-radius: 16px;
                padding: 16px 12px;
                text-align: center;
                min-height: 160px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                position: relative;
                color: ${gameState[i]?.completed ? 'white' : '#2d3748'};
            `;

            if (i === 12) {
                // Free space
                square.innerHTML = `
                    <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 12px;">🎯 OTD (Free Space) 🎯</div>
                `;
            } else {
                const taskIndex = i > 12 ? i - 1 : i;
                const task = playerTasks[taskIndex];
                const state = gameState[i];
                
                // Add checkmark for completed tasks
                const checkmark = state?.completed ? '<div style="position: absolute; top: 8px; right: 12px; font-size: 18px; font-weight: bold;">✓</div>' : '';
                
                square.innerHTML = `
                    ${checkmark}
                    <div style="font-weight: 600; font-size: 0.9em; margin-bottom: 12px; line-height: 1.3; min-height: 40px; display: flex; align-items: center; justify-content: center;">${task}</div>
                    <div style="background: ${state?.completed ? 'rgba(255,255,255,0.15)' : '#f7fafc'}; border: 2px solid ${state?.completed ? 'rgba(255,255,255,0.3)' : '#e2e8f0'}; border-radius: 12px; padding: 10px 8px; font-family: 'SF Mono', Monaco, monospace; font-weight: 600; font-size: 0.9em; letter-spacing: 1px;">${state?.number || 'Enter 10-digit number'}</div>
                `;
            }

            board.appendChild(square);
        }

        // Add footer
        const footer = document.createElement('div');
        footer.style.cssText = `
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            color: #4a5568;
        `;
        footer.innerHTML = `
            <p style="margin: 0; font-size: 0.9em;">Saved on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p style="margin: 5px 0 0 0; font-size: 0.8em; color: #a0aec0;">Customer Care Bingo Challenge - Track your progress!</p>
        `;

        saveCard.appendChild(header);
        saveCard.appendChild(board);
        saveCard.appendChild(footer);
        document.body.appendChild(saveCard);

        // Use html2canvas to capture the card
        if (typeof html2canvas !== 'undefined') {
            const canvas = await html2canvas(saveCard, {
                backgroundColor: 'white',
                scale: 2,
                useCORS: true,
                allowTaint: false
            });

            // Convert to blob and download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `BingoCard_${currentPlayer.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.png`;
                a.click();
                URL.revokeObjectURL(url);
            }, 'image/png', 1.0);
        } else {
            // Fallback: Open in new window for manual save
            const newWindow = window.open('', '_blank');
            newWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head><title>Bingo Card - ${currentPlayer}</title></head>
                <body style="margin: 0; padding: 20px; background: #f0f0f0;">
                    ${saveCard.outerHTML}
                    <p style="text-align: center; margin-top: 20px; color: #666;">
                        Right-click on the card above and select "Save image as..." to download
                    </p>
                </body>
                </html>
            `);
        }

        document.body.removeChild(saveCard);

    } catch (error) {
        console.error('Error saving card:', error);
        alert('Unable to save automatically. Please take a screenshot of your bingo card.');
    }
}

// Load html2canvas library for better image generation
document.addEventListener('DOMContentLoaded', function() {
    // Generate all 50 cards when page loads
    preGeneratedCards.push(...generateAllCardLayouts());
    console.log('Generated 50 unique bingo card layouts');
    
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const startBtn = document.getElementById('startBtn');
    
    function checkInputs() {
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        startBtn.disabled = !firstName || !lastName;
    }
    
    firstNameInput.addEventListener('input', checkInputs);
    lastNameInput.addEventListener('input', checkInputs);
    
    // Add event listeners for rule checkboxes
    const checkboxes = document.querySelectorAll('.rule-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', checkRulesAgreement);
    });
    
    // Initial state
    startBtn.disabled = true;
    checkInputs();
});
