# 🐍 Snake 3D - Perspectiva CSS

> Una recreación moderna del clásico juego Snake con efectos 3D impresionantes, múltiples estilos visuales y soporte completo para dispositivos móviles.

![Snake 3D Banner](https://img.shields.io/badge/Snake_3D-CSS_Perspective-00ff88?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Mobile Responsive](https://img.shields.io/badge/Mobile-Responsive-00ccff?style=for-the-badge&logo=mobile&logoColor=white)

## ✨ Características Principales

### 🎨 **5 Estilos Únicos de Snake**
- **🔴 Clásico** - El look tradicional con colores rojo y verde
- **💡 Neón** - Efectos de luz brillante con colores verde y azul 
- **🔥 Fuego** - Tonos naranjas y rojos con animación de llamas
- **💎 Cristal** - Azul translúcido con efectos de cristal
- **👑 Dorado** - Oro brillante con efectos de destello

### 🍎 **6 Tipos de Frutas con Efectos Especiales**

| Fruta | Puntos | Probabilidad | Efecto Especial |
|-------|--------|--------------|-----------------|
| 🍎 Manzana | +10 | 40% | Básica - Sin efectos |
| 🍌 Banana | +15 | 20% | Boost temporal de velocidad |
| 🍇 Uva | +20 | 15% | Puntos bonus |
| 🍒 Cereza | +25 | 15% | Doble puntos por 10 segundos |
| 🍊 Naranja | +30 | 8% | Crecimiento extra de serpiente |
| 🍓 Fresa | +50 | 2% | **MEGA BONUS** - ¡Todos los efectos! |

### 🎮 **Controles Multiplataforma**

#### **🖥️ Escritorio:**
- **WASD** o **Flechas del teclado** para movimiento
- **Barra espaciadora** para pausar/reanudar
- **Botones en pantalla** para controles adicionales

#### **📱 Móvil y Tablet:**
- **D-pad virtual** con botones direccionales
- **Gestos de deslizamiento (swipe)** en cualquier dirección
- **Vibración háptica** para retroalimentación
- **Botones táctiles** optimizados para dedos

### 🎪 **Efectos Visuales 3D**
- **Perspectiva CSS** con transformaciones 3D reales
- **Animaciones flotantes** del tablero de juego
- **Partículas explosivas** al consumir frutas
- **Rotación dinámica** basada en el movimiento
- **Indicadores de efectos** en tiempo real
- **Transiciones suaves** entre todos los estados

## 🚀 Instalación y Uso

### **Instalación Simple:**
```bash
# Clona o descarga los archivos
git clone [tu-repositorio]

# O simplemente descarga estos archivos:
# - index.html
# - css.css  
# - js.js
```

### **Ejecución:**
```bash
# Opción 1: Abrir directamente
# Doble clic en index.html

# Opción 2: Servidor local simple
python -m http.server 8000
# Luego ve a: http://localhost:8000

# Opción 3: Live Server (VSCode)
# Clic derecho -> "Open with Live Server"
```

## 🎯 Cómo Jugar

### **🎮 Objetivo:**
- Controla la serpiente para comer frutas y crecer
- Evita chocar con las paredes o contigo mismo
- Consigue la puntuación más alta posible

### **📋 Reglas:**
1. **Movimiento:** La serpiente se mueve continuamente
2. **Crecimiento:** Cada fruta hace que la serpiente crezca
3. **Velocidad:** El juego se acelera progresivamente
4. **Colisiones:** El juego termina si chocas con paredes o tu cola
5. **Puntuación:** Diferentes frutas dan diferentes puntos

### **🏆 Sistema de Puntuación:**
- **Puntuación base:** Según el tipo de fruta (10-50 pts)
- **Multiplicador:** x2 durante el efecto de cereza
- **Bonus especiales:** Efectos únicos por tipo de fruta
- **Mejor puntuación:** Guardada automáticamente

## 🎨 Personalización

### **Cambiar Estilo de Snake:**
1. Usa el selector desplegable "Estilo de Snake"
2. Elige entre: Clásico, Neón, Fuego, Cristal, Dorado
3. El cambio se aplica inmediatamente (incluso durante el juego)

### **Modificar el Código:**

#### **Agregar Nuevos Estilos:**
```css
/* En css.css - Agregar nuevo estilo */
.snake-head.tu-estilo {
    background: linear-gradient(145deg, #color1, #color2);
    /* Tus estilos personalizados */
}

.snake-body.tu-estilo {
    background: linear-gradient(145deg, #color3, #color4);
    /* Tus estilos personalizados */
}
```

#### **Agregar Nuevas Frutas:**
```javascript
// En js.js - Agregar al objeto fruitTypes
nuevaFruta: { 
    points: 40, 
    color: 'nueva-fruta', 
    effect: 'tu-efecto', 
    probability: 0.1,
    description: 'Nueva Fruta (+40 pts, efecto especial)' 
}
```

## 📱 Compatibilidad

### **✅ Navegadores Soportados:**
- **Chrome** 60+ ✅
- **Firefox** 55+ ✅  
- **Safari** 12+ ✅
- **Edge** 79+ ✅
- **Opera** 47+ ✅

### **📱 Dispositivos Móviles:**
- **iOS** (Safari, Chrome) ✅
- **Android** (Chrome, Firefox, Samsung Internet) ✅
- **Tablets** (iPad, Android tablets) ✅

### **🖥️ Resoluciones:**
- **Mínima:** 320px (móviles pequeños) ✅
- **Óptima:** 1920x1080 (Full HD) ✅
- **Máxima:** Sin límite (4K+) ✅

## 🔧 Estructura del Proyecto

```
Snake-3D/
│
├── 📄 index.html          # Estructura HTML principal
├── 🎨 css.css            # Estilos 3D y responsive
├── ⚡ js.js              # Lógica del juego y controles
└── 📖 README.md          # Este archivo
```

### **🔍 Detalles de Archivos:**

#### **index.html (40 líneas)**
- Estructura semántica HTML5
- Meta tags para móviles
- Pantalla de inicio interactiva
- Controles táctiles para móvil
- Overlay de Game Over

#### **css.css (400+ líneas)**
- Efectos 3D con CSS Transform
- 5 estilos únicos de snake
- 6 tipos de frutas animadas
- Responsive design completo
- Animaciones fluidas

#### **js.js (900+ líneas)**
- Lógica del juego orientada a objetos
- Sistema de frutas con efectos
- Controles multiplataforma
- Detección automática de móvil
- Persistencia de puntuación

## ⚡ Características Técnicas

### **🎮 Rendimiento:**
- **60 FPS** en dispositivos modernos
- **Optimización móvil** específica
- **Gestión eficiente** de memoria
- **Animaciones CSS** aceleradas por hardware

### **💾 Persistencia:**
- **Mejor puntuación** guardada en localStorage
- **Configuraciones** persistentes entre sesiones
- **Sin base de datos** requerida

### **🔒 Seguridad:**
- **Sin dependencias externas** (excepto Google Fonts)
- **Código vanilla** sin frameworks
- **Sin solicitudes de red** durante el juego
- **Funciona offline** completamente

## 🎯 Roadmap de Características

### **🔜 Próximas Características:**
- [ ] Sistema de niveles
- [ ] Modo multijugador local
- [ ] Tabla de líderes global
- [ ] Más efectos de partículas
- [ ] Sonidos y música
- [ ] Modo oscuro/claro
- [ ] Logros y trofeos

### **💡 Ideas Futuras:**
- [ ] Modo realidad virtual (WebXR)
- [ ] Inteligencia artificial para snake automática
- [ ] Editor de niveles personalizado
- [ ] Modo battle royale
- [ ] Integración con redes sociales

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Aquí tienes cómo puedes ayudar:

### **🐛 Reportar Bugs:**
1. Describe el problema detalladamente
2. Incluye pasos para reproducir
3. Especifica navegador y dispositivo
4. Adjunta capturas de pantalla si es posible

### **✨ Nuevas Características:**
1. Abre un issue describiendo la característica
2. Discute la implementación
3. Haz fork del proyecto
4. Implementa la característica
5. Crea un pull request

### **🎨 Mejoras de Diseño:**
- Nuevos estilos de snake
- Efectos visuales adicionales
- Mejoras de UX/UI
- Optimizaciones de rendimiento

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT** - mira el archivo `LICENSE` para detalles.

### **✅ Permisos:**
- ✅ Uso comercial
- ✅ Modificación
- ✅ Distribución
- ✅ Uso privado

### **❌ Limitaciones:**
- ❌ Sin garantía
- ❌ Sin responsabilidad del autor

## 👨‍💻 Autor

**Tu Nombre**
- 🌐 [Tu Website](https://tu-website.com)
- 📧 [tu-email@example.com](mailto:tu-email@example.com)
- 🐦 [@tu_twitter](https://twitter.com/tu_twitter)
- 💼 [LinkedIn](https://linkedin.com/in/tu-perfil)

## 🙏 Agradecimientos

- **CSS Tricks** - Por los tutoriales de CSS 3D
- **MDN Web Docs** - Por la documentación completa
- **Google Fonts** - Por la tipografía Orbitron
- **La comunidad web** - Por la inspiración constante

---

## 📸 Capturas de Pantalla

### **🖥️ Vista de Escritorio:**
```
┌─────────────────────────────────────┐
│  🎮 Snake 3D - Perspectiva CSS     │
│                                     │
│  📊 Score: 150  🏆 Best: 340       │
│  🎨 Style: [Neón ▼]                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🟢🟢🟢🟢🟢               │   │
│  │         🍎                  │   │
│  │                             │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ⏸️ Pause  🔄 Restart            │
└─────────────────────────────────────┘
```

### **📱 Vista Móvil:**
```
┌───────────────┐
│ 🎮 Snake 3D   │
│ 📊 150 🏆 340 │
│               │
│ ┌───────────┐ │
│ │  🟢🟢🟢   │ │
│ │      🍎    │ │
│ │           │ │
│ └───────────┘ │
│               │
│    ⬆️         │
│  ⬅️ ⚫ ➡️      │
│    ⬇️         │
│               │
│ ⏸️ Pause 🔄   │
└───────────────┘
```

---

🎮 **¡Disfruta jugando Snake 3D!** 🐍✨

*¿Encontraste un bug o tienes una idea genial? ¡Abre un issue y hablemos!* 💬