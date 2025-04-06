import {
  imgDinoPatteGauche,
  imgDinoPatteDroite,
  imgCactus,
} from "./images.mjs";

const HAUTEUR_DU_CANVAS = 500;
const LARGEUR_DU_CANVAS = 1000;
const DECALAGE_GAUCHE_COMMENCE_DINO = 30;
const DECALAGE_BAS_FINIT_DINO = 30;

const DINO_INTERVAL_POUR_CHANGER_DE_PATTE_MS = 200;
const DINO_SAUT_ANIMATION_ETAPE_MS = 15;
const PAYSAGE_INTERVAL_DEFILEMENT_MS = 5;
const DINO_MAX_HAUTEUR_SAUT = 250;
const DINO_SAUT_INCREMENT = 18;

const POSITION_Y_SOL = HAUTEUR_DU_CANVAS - (DECALAGE_BAS_FINIT_DINO + 30);

const conteneurToile = document.createElement("div");
conteneurToile.style.position = "fixed";
conteneurToile.style.top = "0px";
conteneurToile.style.left = "0px";
conteneurToile.style.width = "100%";
conteneurToile.style.textAlign = "center";
conteneurToile.style.zIndex = String(Math.pow(2, 32));

const toile = document.createElement("canvas");
const contexte = toile.getContext("2d");
toile.height = HAUTEUR_DU_CANVAS;
toile.width = LARGEUR_DU_CANVAS;
toile.style.backgroundColor = "#ffffffcc";
toile.style.border = "1px dashed black";
conteneurToile.appendChild(toile);
document.body.appendChild(conteneurToile);

let jeuEnCours = false;
let tempsDebutDeJeu;
let tempsDerniereIteration;
let estDinoSurSaPatteGauche = true;
let directionSautEnHaut = true;
let positionSautDino = null;
let restantPatteAnim = DINO_INTERVAL_POUR_CHANGER_DE_PATTE_MS;
let restantSauteAnim = DINO_SAUT_ANIMATION_ETAPE_MS;
let restantPaysage = PAYSAGE_INTERVAL_DEFILEMENT_MS;
let lesCactus = [];
const lesLignesDuSol = [];

function nouveauJeu() {
  jeuEnCours = true;
  tempsDebutDeJeu = undefined;
  tempsDerniereIteration = undefined;
  estDinoSurSaPatteGauche = true;
  directionSautEnHaut = true;
  positionSautDino = null;
  restantPatteAnim = DINO_INTERVAL_POUR_CHANGER_DE_PATTE_MS;
  restantSauteAnim = DINO_SAUT_ANIMATION_ETAPE_MS;
  restantPaysage = PAYSAGE_INTERVAL_DEFILEMENT_MS;
  lesCactus.length = 0;
  lesLignesDuSol.length = 0;
  genereDesCactus(300);
  genereLesLignesDuSol(0);
  window.requestAnimationFrame(nouvelleIteration);
}

Promise.all([
  attendsLeChargementDeLImage(imgDinoPatteGauche),
  attendsLeChargementDeLImage(imgDinoPatteDroite),
  attendsLeChargementDeLImage(imgCactus),
]).then(() => {
  const KEY_CODES_POUR_SAUTER = [13, 32, 38];
  document.addEventListener("keydown", (evt) => {
    if (KEY_CODES_POUR_SAUTER.includes(evt.keyCode)) {
      evt.preventDefault();
      evt.stopPropagation();
      evt.stopImmediatePropagation();
      surActionSaut();
    }
  });

  afficheLeScore(0);
  afficheLeSol();
  afficheLeDino();

  toile.addEventListener("click", () => surActionSaut());
  contexte.font = "24px monospace";
  contexte.fillStyle = "#000000";
  contexte.fillText('Press "jump" to start', 10, 100);
});

function nouvelleIteration(temps) {
  if (tempsDebutDeJeu === undefined) {
    tempsDebutDeJeu = temps;
  }

  const delta =
    tempsDerniereIteration === undefined ? 0 : temps - tempsDerniereIteration;
  tempsDerniereIteration = temps;

  restantPaysage -= delta;
  if (restantPaysage <= 0) {
    restantPaysage += PAYSAGE_INTERVAL_DEFILEMENT_MS;
  }

  if (positionSautDino !== null) {
    restantSauteAnim -= delta;
    if (restantSauteAnim <= 0) {
      if (positionSautDino >= DINO_MAX_HAUTEUR_SAUT) {
        directionSautEnHaut = false;
        positionSautDino -= DINO_SAUT_INCREMENT;
      } else if (directionSautEnHaut) {
        positionSautDino += DINO_SAUT_INCREMENT;
      } else if (positionSautDino - DINO_SAUT_INCREMENT <= 0) {
        directionSautEnHaut = true;
        positionSautDino = null;
        restantPatteAnim = DINO_INTERVAL_POUR_CHANGER_DE_PATTE_MS;
        estDinoSurSaPatteGauche = !estDinoSurSaPatteGauche;
      } else {
        positionSautDino -= DINO_SAUT_INCREMENT;
      }
      restantSauteAnim += DINO_SAUT_ANIMATION_ETAPE_MS;
    }
  }

  if (restantPatteAnim !== null) {
    restantPatteAnim -= delta;
    if (restantPatteAnim <= 0) {
      estDinoSurSaPatteGauche = !estDinoSurSaPatteGauche;
      restantPatteAnim += DINO_INTERVAL_POUR_CHANGER_DE_PATTE_MS;
    }
  }

  bougeLesCactus();
  bougeLesLignesDuSol();

  // AFAIRE: Juste ce qui a changé
  nettoieToutLEcran();

  afficheLeScore(temps - tempsDebutDeJeu);
  afficheLeSol();
  afficheLesLignesDuSol();
  afficheLesCactus();
  afficheLeDino();
  if (verifieLesCollisionsEntreDinoEtLesCactus()) {
    afficheLeGamové();
    jeuEnCours = false;
    return;
  }
  window.requestAnimationFrame(nouvelleIteration);
}

function afficheLeSol() {
  contexte.beginPath();
  contexte.moveTo(0, POSITION_Y_SOL);
  contexte.lineTo(LARGEUR_DU_CANVAS, POSITION_Y_SOL);
  contexte.lineWidth = 2;
  contexte.stroke();
}

function nettoieToutLEcran() {
  contexte.clearRect(0, 0, LARGEUR_DU_CANVAS, HAUTEUR_DU_CANVAS);
}

function surActionSaut() {
  if (!jeuEnCours) {
    nouveauJeu();
    return;
  }
  if (positionSautDino !== null) {
    // Déjà en train de sauter
    return;
  }
  positionSautDino = 0;
  restantPatteAnim = null;
}

function verifieLesCollisionsEntreDinoEtLesCactus() {
  const [dinoX, dinoY] = ilEstOuLeDino();
  for (const cactusPositionX of lesCactus) {
    if (cactusPositionX < 10) {
      // I hacked tolerances everywhere based on feeling
      continue;
    }
    if (dinoY > 65 && directionSautEnHaut) {
      continue; // J'ai ton dos ;)
    }
    if (cactusPositionX + 20 - (dinoX + imgDinoPatteGauche.naturalWidth) <= 0) {
      if (
        dinoY - (DECALAGE_BAS_FINIT_DINO + (imgCactus.naturalHeight - 30)) <=
        0
      ) {
        return true;
      }
    }
  }
  return false;
}

function afficheLeScore(tempsDepuisDebus) {
  contexte.font = "24px monospace";
  contexte.fillText(
    "Score: " + String(Math.floor(tempsDepuisDebus / 200)),
    10,
    30,
  );
}

function afficheLeGamové() {
  contexte.font = "35px monospace";
  contexte.fillStyle = "#990000";
  contexte.fillText("GAME OVER", 10, 70);
  contexte.font = "24px monospace";
  contexte.fillStyle = "#000000";
  contexte.fillText('Press "jump" to restart', 10, 100);
}

function ilEstOuLeDino() {
  const xOffset = DECALAGE_GAUCHE_COMMENCE_DINO;
  const yOffset = DECALAGE_BAS_FINIT_DINO + (positionSautDino ?? 0);
  return [xOffset, yOffset];
}

function afficheLeDino() {
  const dinoEnCours = estDinoSurSaPatteGauche
    ? imgDinoPatteGauche
    : imgDinoPatteDroite;
  const [xOffset, yOffset] = ilEstOuLeDino();
  contexte.drawImage(
    dinoEnCours,
    xOffset,
    HAUTEUR_DU_CANVAS - dinoEnCours.naturalHeight - yOffset,
    dinoEnCours.naturalWidth,
    dinoEnCours.naturalHeight,
  );
}

function bougeLesCactus() {
  for (let indice = 0; indice < lesCactus.length; indice++) {
    const cactusPosX = lesCactus[indice];
    const nouvellePosX = cactusPosX - 10;
    if (nouvellePosX < -imgCactus.naturalWidth) {
      lesCactus.splice(indice, 1);
      indice--;
      continue;
    }
    lesCactus[indice] = nouvellePosX;
  }

  const dernierCactus = lesCactus[lesCactus.length - 1];
  if (dernierCactus === undefined || dernierCactus <= LARGEUR_DU_CANVAS) {
    genereDesCactus(LARGEUR_DU_CANVAS);
  }
}

function afficheLesCactus() {
  for (let indice = 0; indice < lesCactus.length; indice++) {
    const cactusPosX = lesCactus[indice];
    if (cactusPosX >= LARGEUR_DU_CANVAS) {
      return;
    }
    const yOffset = DECALAGE_BAS_FINIT_DINO;
    contexte.drawImage(
      imgCactus,
      cactusPosX,
      HAUTEUR_DU_CANVAS - imgCactus.naturalHeight - yOffset,
      imgCactus.naturalWidth,
      imgCactus.naturalHeight,
    );
  }
}

function bougeLesLignesDuSol() {
  for (let indice = 0; indice < lesLignesDuSol.length; indice++) {
    const { x: lignePosX } = lesLignesDuSol[indice];
    const nouvellePosX = lignePosX - 10;
    if (nouvellePosX < -5) {
      lesLignesDuSol.splice(indice, 1);
      indice--;
      continue;
    }
    lesLignesDuSol[indice].x = nouvellePosX;
  }

  const derniereLigne = lesLignesDuSol[lesLignesDuSol.length - 1];
  if (derniereLigne === undefined || derniereLigne <= LARGEUR_DU_CANVAS) {
    genereLesLignesDuSol(LARGEUR_DU_CANVAS);
  }
}

function afficheLesLignesDuSol() {
  for (let indice = 0; indice < lesCactus.length; indice++) {
    const { x: lignePosX, y: lignePosY, longueur } = lesLignesDuSol[indice];
    if (lignePosX >= LARGEUR_DU_CANVAS) {
      return;
    }
    contexte.beginPath();
    contexte.moveTo(lignePosX, lignePosY);
    contexte.lineTo(lignePosX + longueur, lignePosY);
    contexte.lineWidth = 1;
    contexte.stroke();
  }
}

function attendsLeChargementDeLImage(img) {
  return new Promise((resolve, reject) => {
    img.addEventListener("load", resolve);
    img.addEventListener("error", reject);
  });
}

function genereDesCactus(decalage) {
  let facteurPourDiffusion = (Math.random() * 2 - 1) * 0.3;
  let dernierCactus = decalage + 500 * (1 + facteurPourDiffusion);
  lesCactus.push(dernierCactus);
  for (let indice = 2; indice <= 10; indice++) {
    let newCactus;
    do {
      facteurPourDiffusion = (Math.random() * 2 - 1) * 0.8;
      newCactus = dernierCactus + 300 * (1 + facteurPourDiffusion);
    } while (newCactus - dernierCactus < imgCactus.naturalWidth + 250);
    lesCactus.push(newCactus);
    dernierCactus = newCactus;
  }
}

function genereLesLignesDuSol(decalage) {
  let facteurPourDiffusion = (Math.random() * 2 - 1) * 0.3;
  for (let indice = 1; indice <= 1000; indice++) {
    facteurPourDiffusion = (Math.random() * 2 - 1) * 0.6;
    lesLignesDuSol.push({
      x: decalage + indice * 100 * (1 + facteurPourDiffusion),
      y:
        Math.random() * (HAUTEUR_DU_CANVAS - (POSITION_Y_SOL + 5) + 1) +
        (POSITION_Y_SOL + 5),
      longueur: Math.random() * (20 - 1 + 1) + 1,
    });
  }
}
