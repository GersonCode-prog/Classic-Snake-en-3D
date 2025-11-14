class Snake3D {
    constructor() {
        this.board = document.getElementById('gameBoard');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.gameOverOverlay = document.getElementById('gameOverOverlay');
        this.finalScoreElement = document.getElementById('finalScore');
        this.snakeStyleSelector = document.getElementById('snakeStyle');
        this.startScreen = document.getElementById('startScreen');
        this.mobileControls = document.getElementById('mobileControls');
        
        // Detectar si es dispositivo móvil
        this.isMobile = this.detectMobile();
        
        this.gridSize = 20;
        this.cellSize = 30;
        
        this.snake = [
            { x: 10, y: 10, direction: 'right' },
            { x: 9, y: 10, direction: 'right' },
            { x: 8, y: 10, direction: 'right' }
        ];
        
        this.direction = 'right';
        this.nextDirection = 'right';
        this.snakeStyle = 'classic';
        
        // Tipos de frutas con sus efectos
        this.fruitTypes = {
            apple: { 
                points: 10, 
                color: 'apple', 
                effect: null, 
                probability: 0.4,
                description: 'Manzana (+10 pts)' 
            },
            banana: { 
                points: 15, 
                color: 'banana', 
                effect: 'speed', 
                probability: 0.2,
                description: 'Banana (+15 pts, +velocidad)' 
            },
            grape: { 
                points: 20, 
                color: 'grape', 
                effect: 'bonus', 
                probability: 0.15,
                description: 'Uva (+20 pts)' 
            },
            cherry: { 
                points: 25, 
                color: 'cherry', 
                effect: 'double', 
                probability: 0.15,
                description: 'Cereza (+25 pts, doble por 10s)' 
            },
            orange: { 
                points: 30, 
                color: 'orange', 
                effect: 'grow', 
                probability: 0.08,
                description: 'Naranja (+30 pts, crece extra)' 
            },
            strawberry: { 
                points: 50, 
                color: 'strawberry', 
                effect: 'mega', 
                probability: 0.02,
                description: 'Fresa (¡MEGA BONUS!)' 
            }
        };
        
        this.activeEffects = {
            doublePoints: 0,
            speedBoost: 0
        };
        
        this.food = this.generateFood();
        this.score = 0;
        this.highScore = localStorage.getItem('snake3d_highscore') || 0;
        this.gameRunning = false;
        this.gameInitialized = false;
        this.gameInterval = null;
        this.speed = 200;
        
        this.setupEventListeners();
        this.setupMobileControls();
        this.updateHighScore();
        
        // NO llamamos a render() ni startGame() aquí
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }
    
    setupMobileControls() {
        if (!this.isMobile) return;
        
        // Configurar controles direccionales
        const dpadButtons = document.querySelectorAll('.dpad-btn');
        dpadButtons.forEach(btn => {
            const direction = btn.getAttribute('data-direction');
            if (direction) {
                // Usar touchstart para respuesta más rápida en móvil
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (this.gameRunning && this.gameInitialized && this.isValidDirection(direction)) {
                        this.nextDirection = direction;
                        // Vibración táctil si está disponible
                        if (navigator.vibrate) {
                            navigator.vibrate(50);
                        }
                    }
                }, { passive: false });
                
                // También mantener click para compatibilidad
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (this.gameRunning && this.gameInitialized && this.isValidDirection(direction)) {
                        this.nextDirection = direction;
                    }
                });
            }
        });
        
        // Configurar botones de acción móviles
        const mobilePauseBtn = document.getElementById('mobilePauseBtn');
        const mobileRestartBtn = document.getElementById('mobileRestartBtn');
        
        if (mobilePauseBtn) {
            mobilePauseBtn.addEventListener('click', () => {
                if (this.gameInitialized) {
                    this.togglePause();
                }
            });
        }
        
        if (mobileRestartBtn) {
            mobileRestartBtn.addEventListener('click', () => {
                if (this.gameInitialized) {
                    this.restartGame();
                }
            });
        }
        
        // Gestos de deslizamiento como alternativa
        this.setupSwipeControls();
    }
    
    setupSwipeControls() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        const gameBoard = this.board;
        const minSwipeDistance = 30; // Distancia mínima para reconocer un swipe
        
        gameBoard.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        }, { passive: false });
        
        gameBoard.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (!this.gameRunning || !this.gameInitialized) return;
            
            const touch = e.changedTouches[0];
            endX = touch.clientX;
            endY = touch.clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Determinar dirección del swipe
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Swipe horizontal
                if (Math.abs(deltaX) > minSwipeDistance) {
                    const direction = deltaX > 0 ? 'right' : 'left';
                    if (this.isValidDirection(direction)) {
                        this.nextDirection = direction;
                        if (navigator.vibrate) {
                            navigator.vibrate(30);
                        }
                    }
                }
            } else {
                // Swipe vertical
                if (Math.abs(deltaY) > minSwipeDistance) {
                    const direction = deltaY > 0 ? 'down' : 'up';
                    if (this.isValidDirection(direction)) {
                        this.nextDirection = direction;
                        if (navigator.vibrate) {
                            navigator.vibrate(30);
                        }
                    }
                }
            }
        }, { passive: false });
        
        // Prevenir scroll en el área del juego
        gameBoard.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
    }
    
    setupEventListeners() {
        // Controles de teclado
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning || !this.gameInitialized) return;
            
            const key = e.key.toLowerCase();
            let newDirection = null;
            
            switch (key) {
                case 'arrowup':
                case 'w':
                    newDirection = 'up';
                    break;
                case 'arrowdown':
                case 's':
                    newDirection = 'down';
                    break;
                case 'arrowleft':
                case 'a':
                    newDirection = 'left';
                    break;
                case 'arrowright':
                case 'd':
                    newDirection = 'right';
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePause();
                    break;
            }
            
            if (newDirection && this.isValidDirection(newDirection)) {
                this.nextDirection = newDirection;
                e.preventDefault();
            }
        });
        
        // Botón de iniciar desde controles
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (!this.gameInitialized) {
                    this.initializeGame();
                } else {
                    this.startGame();
                }
            });
        }
        
        // Botones de control
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartGame();
        });
        
        // Selector de estilo de snake
        this.snakeStyleSelector.addEventListener('change', (e) => {
            this.snakeStyle = e.target.value;
            if (this.gameInitialized) {
                this.render(); // Re-renderizar para aplicar el nuevo estilo
            }
        });
    }
    
    initializeGame() {
        // Ocultar pantalla de inicio
        this.startScreen.style.display = 'none';
        this.board.style.display = 'block';
        
        // Mostrar controles móviles si es necesario
        if (this.isMobile && this.mobileControls) {
            this.mobileControls.style.display = 'flex';
        }
        
        // Mostrar controles del juego
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const restartBtn = document.getElementById('restartBtn');
        
        if (startBtn) startBtn.style.display = 'none';
        if (pauseBtn) pauseBtn.style.display = 'inline-block';
        if (restartBtn) restartBtn.style.display = 'inline-block';
        
        // Inicializar el juego
        this.gameInitialized = true;
        this.render();
        this.startGame();
    }
    
    isValidDirection(newDirection) {
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        
        return opposites[newDirection] !== this.direction;
    }
    
    generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        
        // Determinar tipo de fruta basado en probabilidades
        const rand = Math.random();
        let cumulative = 0;
        
        for (const [type, data] of Object.entries(this.fruitTypes)) {
            cumulative += data.probability;
            if (rand <= cumulative) {
                newFood.type = type;
                newFood.data = data;
                break;
            }
        }
        
        // Fallback a manzana si no se seleccionó nada
        if (!newFood.type) {
            newFood.type = 'apple';
            newFood.data = this.fruitTypes.apple;
        }
        
        return newFood;
    }
    
    moveSnake() {
        this.direction = this.nextDirection;
        const head = { ...this.snake[0] };
        
        // Actualizar dirección de la cabeza
        head.direction = this.direction;
        
        // Mover la cabeza
        switch (this.direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }
        
        // Verificar colisiones con paredes
        if (head.x < 0 || head.x >= this.gridSize || 
            head.y < 0 || head.y >= this.gridSize) {
            this.gameOver();
            return;
        }
        
        // Verificar colisiones consigo mismo
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Verificar si comió comida
        if (head.x === this.food.x && head.y === this.food.y) {
            this.consumeFood();
        } else {
            // Actualizar direcciones del cuerpo para seguimiento suave
            for (let i = this.snake.length - 1; i > 0; i--) {
                this.snake[i].direction = this.snake[i - 1].direction;
            }
            this.snake.pop();
        }
        
        // Actualizar efectos activos
        this.updateActiveEffects();
    }
    
    consumeFood() {
        const fruitData = this.food.data;
        let points = fruitData.points;
        
        // Aplicar efecto de doble puntos si está activo
        if (this.activeEffects.doublePoints > 0) {
            points *= 2;
        }
        
        this.score += points;
        this.updateScore();
        this.createFoodParticles(this.food.x, this.food.y, fruitData.color);
        
        // Aplicar efectos especiales de la fruta
        this.applyFruitEffect(fruitData.effect);
        
        // Mostrar mensaje del tipo de fruta
        this.showFruitMessage(fruitData.description);
        
        this.food = this.generateFood();
        
        // Aumentar velocidad gradualmente (solo si no hay speed boost activo)
        if (this.speed > 100 && this.activeEffects.speedBoost === 0) {
            this.speed -= 2;
            clearInterval(this.gameInterval);
            this.startGameLoop();
        }
    }
    
    applyFruitEffect(effect) {
        switch (effect) {
            case 'speed':
                // Boost de velocidad temporal
                this.activeEffects.speedBoost = 300; // 30 segundos a 100ms por frame
                this.speed = Math.max(this.speed - 50, 80);
                clearInterval(this.gameInterval);
                this.startGameLoop();
                break;
                
            case 'double':
                // Doble puntos por 10 segundos
                this.activeEffects.doublePoints = 100;
                break;
                
            case 'grow':
                // La serpiente crece un segmento extra
                const tail = this.snake[this.snake.length - 1];
                this.snake.push({ ...tail });
                break;
                
            case 'mega':
                // Efecto mega: todos los efectos
                this.activeEffects.doublePoints = 150;
                this.activeEffects.speedBoost = 200;
                this.speed = Math.max(this.speed - 30, 90);
                
                // Agregar dos segmentos extra
                const megaTail = this.snake[this.snake.length - 1];
                this.snake.push({ ...megaTail });
                this.snake.push({ ...megaTail });
                
                clearInterval(this.gameInterval);
                this.startGameLoop();
                break;
        }
    }
    
    updateActiveEffects() {
        // Decrementar efectos activos
        if (this.activeEffects.doublePoints > 0) {
            this.activeEffects.doublePoints--;
        }
        
        if (this.activeEffects.speedBoost > 0) {
            this.activeEffects.speedBoost--;
            if (this.activeEffects.speedBoost === 0) {
                // Restaurar velocidad normal
                this.speed = Math.min(this.speed + 50, 200);
                clearInterval(this.gameInterval);
                this.startGameLoop();
            }
        }
    }
    
    showFruitMessage(description) {
        // Crear elemento de mensaje temporal
        const message = document.createElement('div');
        message.className = 'fruit-message';
        message.textContent = description;
        message.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #00ff88;
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            font-size: 1.2rem;
            text-shadow: 0 0 10px #00ff88;
            z-index: 1000;
            pointer-events: none;
            opacity: 1;
            transition: all 1s ease-out;
        `;
        
        this.board.appendChild(message);
        
        // Animar y eliminar mensaje
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translate(-50%, -70%) scale(1.2)';
        }, 100);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 1100);
    }
    
    createFoodParticles(x, y, fruitType = 'apple') {
        const numParticles = 8;
        const centerX = x * this.cellSize + this.cellSize / 2;
        const centerY = y * this.cellSize + this.cellSize / 2;
        
        // Colores de partículas según el tipo de fruta
        const particleColors = {
            apple: '#ff4757',
            banana: '#ffd700',
            grape: '#6c5ce7',
            cherry: '#e84393',
            orange: '#fd79a8',
            strawberry: '#ff6b6b'
        };
        
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.background = particleColors[fruitType] || '#ffd700';
            
            // Dirección aleatoria para cada partícula
            const angle = (360 / numParticles) * i;
            const distance = Math.random() * 50 + 20;
            const finalX = centerX + Math.cos(angle * Math.PI / 180) * distance;
            const finalY = centerY + Math.sin(angle * Math.PI / 180) * distance;
            
            particle.style.setProperty('--final-x', finalX + 'px');
            particle.style.setProperty('--final-y', finalY + 'px');
            
            this.board.appendChild(particle);
            
            // Eliminar partícula después de la animación
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 800);
        }
    }
    
    render() {
        // Limpiar el tablero
        this.board.innerHTML = '';
        
        // Renderizar serpiente con el estilo seleccionado
        this.snake.forEach((segment, index) => {
            const segmentElement = document.createElement('div');
            const isHead = index === 0;
            
            segmentElement.className = isHead 
                ? `snake-segment snake-head ${this.snakeStyle}` 
                : `snake-segment snake-body ${this.snakeStyle}`;
            
            segmentElement.style.left = segment.x * this.cellSize + 'px';
            segmentElement.style.top = segment.y * this.cellSize + 'px';
            
            // Añadir rotación basada en la dirección para efecto 3D
            let rotation = 0;
            switch (segment.direction) {
                case 'up':
                    rotation = -90;
                    break;
                case 'down':
                    rotation = 90;
                    break;
                case 'left':
                    rotation = 180;
                    break;
                case 'right':
                    rotation = 0;
                    break;
            }
            
            segmentElement.style.transform = `rotateZ(${rotation}deg) translateZ(${isHead ? '15px' : '5px'})`;
            
            // Efecto de seguimiento del cuerpo
            if (index > 0) {
                const prevSegment = this.snake[index - 1];
                if (prevSegment.direction !== segment.direction) {
                    segmentElement.classList.add('turning');
                }
                
                // Gradiente de color del cuerpo
                const opacity = 1 - (index * 0.1);
                segmentElement.style.opacity = Math.max(opacity, 0.3);
            }
            
            // Efectos especiales si hay buffs activos
            if (this.activeEffects.doublePoints > 0) {
                segmentElement.style.boxShadow += ', 0 0 15px rgba(255, 215, 0, 0.5)';
            }
            
            if (this.activeEffects.speedBoost > 0) {
                segmentElement.style.boxShadow += ', 0 0 15px rgba(0, 255, 255, 0.5)';
            }
            
            this.board.appendChild(segmentElement);
        });
        
        // Renderizar comida con el tipo correcto
        const foodElement = document.createElement('div');
        foodElement.className = `food ${this.food.data.color}`;
        foodElement.style.left = this.food.x * this.cellSize + 'px';
        foodElement.style.top = this.food.y * this.cellSize + 'px';
        this.board.appendChild(foodElement);
        
        // Efecto de rotación del tablero basado en el movimiento
        this.updateBoardRotation();
        
        // Mostrar indicadores de efectos activos
        this.renderEffectIndicators();
    }
    
    renderEffectIndicators() {
        // Remover indicadores existentes
        const existingIndicators = this.board.querySelectorAll('.effect-indicator');
        existingIndicators.forEach(indicator => indicator.remove());
        
        const indicators = [];
        
        if (this.activeEffects.doublePoints > 0) {
            indicators.push({
                text: '2X POINTS',
                color: '#ffd700',
                time: this.activeEffects.doublePoints
            });
        }
        
        if (this.activeEffects.speedBoost > 0) {
            indicators.push({
                text: 'SPEED BOOST',
                color: '#00ccff',
                time: this.activeEffects.speedBoost
            });
        }
        
        indicators.forEach((indicator, index) => {
            const element = document.createElement('div');
            element.className = 'effect-indicator';
            element.textContent = indicator.text;
            element.style.cssText = `
                position: absolute;
                top: ${20 + (index * 30)}px;
                right: 20px;
                color: ${indicator.color};
                font-family: 'Orbitron', monospace;
                font-weight: 700;
                font-size: 0.9rem;
                text-shadow: 0 0 10px ${indicator.color};
                z-index: 100;
                opacity: ${indicator.time > 20 ? 1 : 0.5};
                animation: ${indicator.time <= 20 ? 'blink 0.5s infinite' : 'none'};
            `;
            
            this.board.appendChild(element);
        });
    }
    
    updateBoardRotation() {
        let rotationY = 5;
        let rotationX = 15;
        
        switch (this.direction) {
            case 'left':
                rotationY = 15;
                break;
            case 'right':
                rotationY = -5;
                break;
            case 'up':
                rotationX = 25;
                break;
            case 'down':
                rotationX = 5;
                break;
        }
        
        this.board.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    }
    
    startGame() {
        this.gameRunning = true;
        this.startGameLoop();
    }
    
    startGameLoop() {
        this.gameInterval = setInterval(() => {
            if (this.gameRunning) {
                this.moveSnake();
                this.render();
            }
        }, this.speed);
    }
    
    togglePause() {
        this.gameRunning = !this.gameRunning;
        const pauseBtn = document.getElementById('pauseBtn');
        const mobilePauseBtn = document.getElementById('mobilePauseBtn');
        
        const pauseText = this.gameRunning ? 'Pausa' : 'Reanudar';
        const mobilePauseText = this.gameRunning ? '⏸️ Pausa' : '▶️ Reanudar';
        
        if (pauseBtn) pauseBtn.textContent = pauseText;
        if (mobilePauseBtn) mobilePauseBtn.textContent = mobilePauseText;
        
        if (this.gameRunning) {
            this.startGameLoop();
        } else {
            clearInterval(this.gameInterval);
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        clearInterval(this.gameInterval);
        
        // Actualizar mejor puntuación
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snake3d_highscore', this.highScore);
            this.updateHighScore();
        }
        
        // Mostrar pantalla de game over
        this.finalScoreElement.textContent = this.score;
        this.gameOverOverlay.style.display = 'flex';
        
        // Efecto de explosión en la cabeza
        const head = document.querySelector('.snake-head');
        if (head) {
            head.style.animation = 'headPulse 0.2s ease-in-out infinite';
            head.style.background = 'linear-gradient(145deg, #ff1744, #d50000)';
        }
    }
    
    restartGame() {
        this.gameOverOverlay.style.display = 'none';
        
        // Resetear estado del juego
        this.snake = [
            { x: 10, y: 10, direction: 'right' },
            { x: 9, y: 10, direction: 'right' },
            { x: 8, y: 10, direction: 'right' }
        ];
        
        this.direction = 'right';
        this.nextDirection = 'right';
        this.food = this.generateFood();
        this.score = 0;
        this.speed = 200;
        this.gameRunning = true;
        
        // Resetear efectos activos
        this.activeEffects = {
            doublePoints: 0,
            speedBoost: 0
        };
        
        this.updateScore();
        this.render();
        
        // Reiniciar botón de pausa
        document.getElementById('pauseBtn').textContent = 'Pausa';
        
        clearInterval(this.gameInterval);
        this.startGameLoop();
    }
    
    showStartScreen() {
        // Mostrar pantalla de inicio
        this.startScreen.style.display = 'flex';
        this.board.style.display = 'none';
        
        // Ocultar controles móviles
        if (this.mobileControls) {
            this.mobileControls.style.display = 'none';
        }
        
        // Ocultar controles del juego
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('restartBtn').style.display = 'none';
        
        // Resetear estado
        this.gameInitialized = false;
        this.gameRunning = false;
        clearInterval(this.gameInterval);
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    updateHighScore() {
        this.highScoreElement.textContent = this.highScore;
    }
}

// Funciones globales para los botones del overlay
function restartGame() {
    if (window.snakeGame) {
        window.snakeGame.restartGame();
    }
}

function backToMenu() {
    if (window.snakeGame) {
        window.snakeGame.showStartScreen();
        window.snakeGame.gameOverOverlay.style.display = 'none';
    }
}

function startMainGame() {
    if (window.snakeGame) {
        window.snakeGame.initializeGame();
    }
}

// CSS adicional para partículas dinámicas
const style = document.createElement('style');
style.textContent = `
    .particle {
        transform-origin: center;
        animation: particleExplode 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    
    @keyframes particleExplode {
        0% {
            transform: scale(1) translate(0, 0) translateZ(0);
            opacity: 1;
        }
        50% {
            transform: scale(1.5) translate(var(--dx, 0), var(--dy, 0)) translateZ(25px);
            opacity: 0.8;
        }
        100% {
            transform: scale(0) translate(var(--dx, 0), var(--dy, 0)) translateZ(50px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializar el juego cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    window.snakeGame = new Snake3D();
});

// Añadir efectos de sonido (opcional - usando Web Audio API)
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.initAudio();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API no compatible');
        }
    }
    
    playTone(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playEatSound() {
        this.playTone(800, 0.1);
        setTimeout(() => this.playTone(1000, 0.1), 50);
    }
    
    playGameOverSound() {
        this.playTone(200, 0.5, 'sawtooth');
        setTimeout(() => this.playTone(150, 0.5, 'sawtooth'), 200);
        setTimeout(() => this.playTone(100, 0.8, 'sawtooth'), 400);
    }
    
    playMoveSound() {
        this.playTone(400, 0.05, 'square');
    }
}

// Integrar efectos de sonido si están disponibles
if (typeof window !== 'undefined') {
    window.soundEffects = new SoundEffects();
}