const vidas = document.getElementById('tableroVidas');

const azul = document.getElementById('azul');
const violeta = document.getElementById('violeta');
const naranja = document.getElementById('naranja');
const verde = document.getElementById('verde');
const btnEmpezar = document.getElementById('btnEmpezar');

const notaDo = document.getElementById('notaDo');
const notaFa = document.getElementById('notaFa');
const notaLa = document.getElementById('notaLa');
const notaMi = document.getElementById('notaMi');
const notaRe = document.getElementById('NotaRe');
const notaSi = document.getElementById('notaSi');
const notaSol = document.getElementById('notaSol');

const ULTIMO_NIVEL = 10;

const audios = [notaDo, notaFa, notaLa, notaMi, notaRe, notaSi, notaSol];

class Juego {
  constructor() {
    this.elegirColor = this.elegirColor.bind(this);
    this.iluminarSecuencia = this.iluminarSecuencia.bind(this);
    this.iluminarColor = this.iluminarColor.bind(this);
    this.apagarColor = this.apagarColor.bind(this);

    this.tableroNivel = document.getElementById('tableroNivel');
    this.estadoNivel = document.getElementById('estadoNivel');

    this.visibleTableroNivel();
    this.crearTableroVidas();

    this.vidas = vidas;

    this.inicializar();
    this.generarSecuencia();

    setTimeout(this.siguieteNivel, 500);
  }

  inicializar() {
    this.toggleBtnEmpezar();
    this.siguieteNivel = this.siguieteNivel.bind(this);
    this.nivel = 1;
    this.estadoNivel.textContent = this.nivel;
    this.colores = {
      azul,
      violeta,
      naranja,
      verde
    };
  }

  toggleBtnEmpezar() {
    if (btnEmpezar.classList.contains('hide')) {
      btnEmpezar.classList.remove('hide');
    } else {
      btnEmpezar.classList.add('hide');
    }
  }

  generarSecuencia() {
    this.secuencia = new Array(ULTIMO_NIVEL)
      .fill(0)
      .map(n => Math.floor(Math.random() * 4));

    this.secuenciaAudios = this.secuencia.map(n => audios[n]);
  }

  siguieteNivel() {
    this.subnivel = 0;
    this.estadoNivel.textContent = this.nivel;
    this.iluminarSecuencia();
    this.agregarEventosClick();
  }

  transformarNumeroAColor(numero) {
    const colores = {
      0: 'azul',
      1: 'violeta',
      2: 'naranja',
      3: 'verde'
    };

    for (const index in colores) {
      if (parseInt(index) === numero) {
        return colores[index];
      }
    }
  }

  transformarColorANumero(colorTransformar) {
    const colores = {
      azul: 0,
      violeta: 1,
      naranja: 2,
      verde: 3
    };

    for (const color in colores) {
      if (color === colorTransformar) {
        return colores[color];
      }
    }
  }

  iluminarSecuencia() {
    for (let i = 0; i < this.nivel; i++) {
      const color = this.transformarNumeroAColor(this.secuencia[i]);
      setTimeout(() => this.reproducirSonido(color), 1000 * i);
      setTimeout(() => this.iluminarColor(color), 1000 * i);
    }
  }

  iluminarColor(color) {
    this.colores[color].classList.add('light');
    setTimeout(() => this.apagarColor(color), 350);
    /* setTimeout(() => this.apagarColor(color), 350); */
  }
  reproducirSonido(color) {
    const audioNumero = this.transformarColorANumero(color);
    this.secuenciaAudios[audioNumero].play();

    setTimeout(() => {
      this.secuenciaAudios[audioNumero].pause();
      this.secuenciaAudios[audioNumero].currentTime = 0;
    }, 450);
  }
  apagarColor(color) {
    this.colores[color].classList.remove('light');
  }

  agregarEventosClick() {
    for (const color in this.colores) {
      this.colores[color].addEventListener('click', this.elegirColor);
    }
  }

  eliminarEventosClick() {
    for (const color in this.colores) {
      this.colores[color].removeEventListener('click', this.elegirColor);
    }
  }

  elegirColor(ev) {
    const nombreColor = ev.target.dataset.color;
    const numeroColor = this.transformarColorANumero(nombreColor);
    this.reproducirSonido(nombreColor);
    this.iluminarColor(nombreColor);

    if (numeroColor === this.secuencia[this.subnivel]) {
      this.subnivel++;
      if (this.subnivel === this.nivel) {
        this.nivel++;

        this.eliminarEventosClick();

        if (this.nivel === ULTIMO_NIVEL + 1) {
          this.ganoElJuego();
        } else {
          swal({
            title: `Level ${this.nivel - 1} complete`,
            text: 'Click on the button to continue',
            icon: 'success'
          }).then(() => this.siguieteNivel());
        }
      }
    } else {
      this.perdioElJuego();
    }
  }
  ganoElJuego() {
    swal('Congratulations, You won').then(() => this.inicializar());
  }

  perdioElJuego() {
    this.eliminarVida();
    const vidasActuales = this.cantidadVidas();

    if (vidasActuales > 0) {
      swal('Try Again', 'Click on the button!', 'info').then(() => {
        /*  setTimeout(this.iluminarSecuencia, 400) */
        this.subnivel = 0;
        this.iluminarSecuencia();
      });
    } else {
      swal('You lost', 'Click on the button', 'error').then(
        () => {
          this.ocultarTableroNivel();
          this.eliminarEventosClick();
          this.inicializar();
        }
      );
    }
  }

  crearTableroVidas() {
    const TOTAL_VIDAS = 3;
    const corazon = document.createElement('img');
    corazon.src = './imagenes/corazon.png';
    corazon.className = 'oportunidades';
    corazon.alt = 'Corazón';

    for (let i = 0; i < TOTAL_VIDAS; i++) {
      vidas.insertAdjacentHTML('afterbegin', corazon.outerHTML);
    }
  }

  visibleTableroNivel() {
    this.tableroNivel.style.visibility = 'visible';
  }

  ocultarTableroNivel() {
    this.tableroNivel.style.visibility = 'hidden';
  }

  eliminarVida() {
    this.vidas.children[0].remove();
  }

  cantidadVidas() {
    return this.vidas.children.length;
  }
}

function empezarJuego() {
  let juego = new Juego();
}
