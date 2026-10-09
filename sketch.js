/* eslint-disable no-undef, no-unused-vars */

//DECLARACIONES

// Variable donde se almacena el lienzo de p5
let canvas;
// Variable que almacena el alto del lienzo
let canvasHeight = 120;
// Variable que almacena el ancho del lienzo
let canvasWidth;

// Constante donde se almacena la URL desde donde se carga el audio
const URL_AUDIO = "aud/audio.ogg";
// Variable donde se almacena la velocidad a la cual se escucha el audio
let velocidad;
// Variable donde se almacena el volumen a la cual se escucha el audio
let volumen;
// Variable donde se almacena el archivo de audio
let soundFile;

// Variable donde se almacena el objeto que calcula la amplitud del audio
let medidaAmplitud;
// Variable donde se almacena la amplitud actual del audio
let amplitudAudio;
// Variable donde se almacena el diámetro del círculo
let diametroCirculo = 0;

// Variable donde se almacena el efecto de Reverberación
let reverberacion;

// RETOS: posición actual del centro del círculo
let circuloX;
let circuloY;
// RETO 2: posición hacia la que se mueve el círculo (destino del clic)
let destinoX;
let destinoY;
// Si es true el círculo se desplaza con animación (reto 2).
// Si es false salta directamente al punto del clic (reto 1).
const ANIMAR_MOVIMIENTO = true;
// Qué tan rápido se acerca el círculo al destino (entre 0 y 1)
const VELOCIDAD_ANIMACION = 0.1;

// FUNCIÓN DE PRECARGA DE LOS RECURSOS
function preload() {
  // Se los formatos de audio válidos dentro de la aplicación
  soundFormats("ogg");
  // Carga el audio desde la URL y lo almacena en la variable
  soundFile = loadSound(URL_AUDIO);
}

// FUNCIÓN DE CONFIGURACIÓN
function setup() {
  // Asigna el ancho del lienzo
  canvasWidth = windowWidth;
  // Crear un lienzo (área de dibujo) del tamaño de la ventana del navegador Web
  canvas = createCanvas(canvasWidth, canvasHeight);
  // Adiciona el lienzo al div con el atributo id igual a canvas-container
  canvas.parent("canvas-container");
  // Se establece la velocidad y el volumen iniciales del audio
  velocidad = 1.0;
  volumen = 0.5;
  // Inicialmente el audio comienza parado
  soundFile.pause();
  // Crea un objeto encargado de calcular la amplitud del audio reproducido
  medidaAmplitud = new p5.Amplitude();

  // Crea y configura el efecto de reverberación
  reverberacion = new p5.Reverb();
  reverberacion.disconnect();
  reverberacion.process(soundFile, 6, 0.5);
  reverberacion.drywet(1);

  // Posición inicial del círculo: centro del lienzo
  circuloX = windowWidth / 2;
  circuloY = 60;
  destinoX = circuloX;
  destinoY = circuloY;
}

// FUNCIÓN DONDE SE PROGRAMA LA FUNCIONALIDAD
function draw() {
  // Pinta de gris el color de fondo
  background(128, 128, 128);
  // Obtiene la amplitud del audio que se está reproduciendo
  amplitudAudio = medidaAmplitud.getLevel();
  // Convierte la amplitud en el diámetro del círculo que se va a pintar
  diametroCirculo = map(amplitudAudio, 0, 1, 0, 200);

  // RETO 2: acerca poco a poco el círculo a su destino
  if (ANIMAR_MOVIMIENTO) {
    circuloX = lerp(circuloX, destinoX, VELOCIDAD_ANIMACION);
    circuloY = lerp(circuloY, destinoY, VELOCIDAD_ANIMACION);
  } else {
    circuloX = destinoX;
    circuloY = destinoY;
  }

  // Pinta un círculo con el diámetro variable según la amplitud del audio
  fill(255, 0, 0);
  circle(circuloX, circuloY, diametroCirculo);
}

// CAMBIA EL TAMAÑO DEL LIENZO SI LA VENTANA DEL NAVEGADOR WEB CAMBIA DE TAMAÑO
windowResized = function () {
  // Asigna el ancho del lienzo
  canvasWidth = windowWidth;
  // Redimenciona el tamaño del lienzo al tamaño del canvas
  resizeCanvas(canvasWidth, canvasHeight);
};

// FUNCIÓN QUE SE LLAMA AL PRESIONAR UNA TECLA
function keyTyped() {
  // Al presionar la tecla p se inicia o se para la reproducción
  if (key === "p") {
    if (soundFile.isPlaying()) {
      soundFile.pause();
    } else {
      soundFile.play();
    }
    // Con la tecla > se reproduce más rápido el audio
  } else if (key === ">" && soundFile.isPlaying()) {
    velocidad += 0.1;
    soundFile.rate(velocidad);
    // Con la tecla < se reproduce más lento el audio
  } else if (key === "<" && soundFile.isPlaying()) {
    velocidad -= 0.1;
    soundFile.rate(velocidad);
    // Con la tecla + se aumenta el volumen del audio
  } else if (key === "+" && soundFile.isPlaying()) {
    volumen += 0.1;
    soundFile.setVolume(volumen);
    // Con la tecla - se disminuye el volumen del audio
  } else if (key === "-" && soundFile.isPlaying()) {
    volumen -= 0.1;
    soundFile.setVolume(volumen);
  }
}

// FUNCIÓN QUE SE LLAMA AL PRESIONAR CLIC EN EL RATÓN
function mouseClicked() {
  console.log("X:", mouseX, "Y:", mouseY);

  // Verifica si el usuario hizo clic dentro del círculo rojo
  // (se compara con el radio, que es la mitad del diámetro)
  if (dist(circuloX, circuloY, mouseX, mouseY) <= diametroCirculo / 2) {
    // Permite que se escuche el efecto de reverberación
    reverberacion.connect();
  } else {
    // Evita que se escuche el efecto de reverberación
    reverberacion.disconnect();

    // RETOS 1 y 2: si el clic fue dentro del lienzo, el círculo se mueve allí
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
      destinoX = mouseX;
      destinoY = mouseY;
    }
  }
}