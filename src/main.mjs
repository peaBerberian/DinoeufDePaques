import {
  imgDinoPatteGauche,
  imgDinoPatteDroite,
  imgCactus,
} from "./images.mjs";

const KEY_CODES_POUR_SAUTER = [13, 32, 38];
const KEY_CODES_POUR_QUITTER = [37];

const HAUTEUR_DU_CANVAS = 350;
const LARGEUR_DU_CANVAS = 1000;
const DECALAGE_GAUCHE_COMMENCE_DINO = 30;
const DECALAGE_BAS_FINIT_DINO = 30;

const DINO_INTERVAL_POUR_CHANGER_DE_PATTE_MIN_MS = 400;
const DINO_INTERVAL_POUR_CHANGER_DE_PATTE_MAX_MS = 20;
const DINO_SAUT_ANIMATION_ETAPE_MS = 15;
const PAYSAGE_INTERVAL_DEFILEMENT_VITESSE_MIN_PIX_PER_MS = 2;
const PAYSAGE_INTERVAL_DEFILEMENT_VITESSE_MAX_PIX_PER_MS = 15;
const TEMPS_MS_AVANT_VITESSE_MAX = 120000;
const DINO_MAX_HAUTEUR_SAUT = 180;
const DINO_SAUT_INCREMENT_MAX = 40;
const DINO_SAUT_INCREMENT_MIN = 3;
const UNITE_DE_TEMPS_MS = 10;

const POSITION_Y_SOL = HAUTEUR_DU_CANVAS - (DECALAGE_BAS_FINIT_DINO + 30);

/**
 * @type {AbortController}
 */
const controlleurDAnnulation = new AbortController();

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
controlleurDAnnulation.signal.addEventListener("abort", () => {
  conteneurToile.parentElement.removeChild(conteneurToile);
});

let jeuEnCours = false;
let tempsDebutDeJeu;
let tempsDerniereIteration;
let estDinoSurSaPatteGauche = true;
let directionSautEnHaut = true;
let positionSautDino = null;
let restantMsPatteAnim = DINO_INTERVAL_POUR_CHANGER_DE_PATTE_MIN_MS;
let restantMsSauteAnim = DINO_SAUT_ANIMATION_ETAPE_MS;
let lesCactus = [];
const lesLignesDuSol = [];

function nouveauJeu() {
  jeuEnCours = true;
  tempsDebutDeJeu = undefined;
  tempsDerniereIteration = undefined;
  estDinoSurSaPatteGauche = true;
  directionSautEnHaut = true;
  positionSautDino = null;
  restantMsPatteAnim = DINO_INTERVAL_POUR_CHANGER_DE_PATTE_MIN_MS;
  restantMsSauteAnim = DINO_SAUT_ANIMATION_ETAPE_MS;
  lesCactus.length = 0;
  lesLignesDuSol.length = 0;
  genereDesCactus(800, 1);
  genereLesLignesDuSol(0);
  window.requestAnimationFrame(nouvelleIteration);
}

const attendsLeChargementDeLaPage = new Promise((resolve) => {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    resolve();
  } else {
    resolve();
  }
});

Promise.all([
  attendsLeChargementDeLImage(imgDinoPatteGauche),
  attendsLeChargementDeLImage(imgDinoPatteDroite),
  attendsLeChargementDeLImage(imgCactus),
  attendsLeChargementDeLaPage,
]).then(() => {
  if (controlleurDAnnulation.signal.aborted) {
    return;
  }
  document.body.appendChild(conteneurToile);
  const onKeyDown = (evt) => {
    if (KEY_CODES_POUR_QUITTER.includes(evt.keyCode)) {
      controlleurDAnnulation.abort();
    } else if (KEY_CODES_POUR_SAUTER.includes(evt.keyCode)) {
      evt.preventDefault();
      evt.stopPropagation();
      evt.stopImmediatePropagation();
      surActionSaut();
    }
  };

  // afficheLeCiel();
  // afficheLeDesert();
  afficheLeScore(0);
  afficheLeSol();
  afficheLeDino();

  document.addEventListener("keydown", onKeyDown);
  toile.addEventListener("click", surActionSaut);
  controlleurDAnnulation.signal.addEventListener("abort", () => {
    document.removeEventListener("keydown", onKeyDown);
    toile.removeEventListener("click", surActionSaut);
  });

  contexte.font = "24px monospace";
  contexte.fillStyle = "#000000";
  contexte.fillText('Jump ("space", "up", or "enter") to start', 10, 80);
  contexte.fillText('Press "left" to exit', 10, 120);
});

function nouvelleIteration(temps) {
  if (controlleurDAnnulation.signal.aborted) {
    return;
  }
  if (tempsDebutDeJeu === undefined) {
    tempsDebutDeJeu = temps;
  }

  let tempsRestantAEcouler =
    tempsDerniereIteration === undefined ? 0 : temps - tempsDerniereIteration;
  tempsDerniereIteration = temps;

  while (tempsRestantAEcouler > 0) {
    const delta =
      tempsRestantAEcouler < UNITE_DE_TEMPS_MS
        ? tempsRestantAEcouler
        : UNITE_DE_TEMPS_MS;
    tempsRestantAEcouler -= delta;
    const tempsIterationEnCours = tempsDerniereIteration - tempsRestantAEcouler;
    const tempsDepuisDebut = tempsIterationEnCours - tempsDebutDeJeu;
    const tempsPourChangerDePatte =
      Math.min(tempsDepuisDebut / TEMPS_MS_AVANT_VITESSE_MAX, 1) *
        (DINO_INTERVAL_POUR_CHANGER_DE_PATTE_MAX_MS -
          DINO_INTERVAL_POUR_CHANGER_DE_PATTE_MIN_MS) +
      DINO_INTERVAL_POUR_CHANGER_DE_PATTE_MIN_MS;
    if (positionSautDino !== null) {
      restantMsSauteAnim -= delta;
      if (restantMsSauteAnim <= 0) {
        if (positionSautDino >= DINO_MAX_HAUTEUR_SAUT) {
          directionSautEnHaut = false;
          positionSautDino = DINO_MAX_HAUTEUR_SAUT;
        }
        const ratio =
          (DINO_MAX_HAUTEUR_SAUT - positionSautDino) / DINO_MAX_HAUTEUR_SAUT;
        let diff = Math.ceil(DINO_SAUT_INCREMENT_MAX * ratio);
        if (diff < DINO_SAUT_INCREMENT_MIN) {
          diff = DINO_SAUT_INCREMENT_MIN;
        }
        if (directionSautEnHaut) {
          positionSautDino += diff;
          positionSautDino = Math.min(positionSautDino, DINO_MAX_HAUTEUR_SAUT);
        } else {
          if (positionSautDino - diff <= 0) {
            directionSautEnHaut = true;
            positionSautDino = null;
            restantMsPatteAnim = tempsPourChangerDePatte;
            estDinoSurSaPatteGauche = !estDinoSurSaPatteGauche;
          } else {
            positionSautDino -= diff;
          }
        }
        restantMsSauteAnim += DINO_SAUT_ANIMATION_ETAPE_MS;
      }
    }

    if (restantMsPatteAnim !== null) {
      restantMsPatteAnim -= delta;
      if (restantMsPatteAnim <= 0) {
        estDinoSurSaPatteGauche = !estDinoSurSaPatteGauche;
        restantMsPatteAnim += tempsPourChangerDePatte;
      }
    }

    const vitesse =
      Math.min(tempsDepuisDebut / TEMPS_MS_AVANT_VITESSE_MAX, 1) *
        (PAYSAGE_INTERVAL_DEFILEMENT_VITESSE_MAX_PIX_PER_MS -
          PAYSAGE_INTERVAL_DEFILEMENT_VITESSE_MIN_PIX_PER_MS) +
      PAYSAGE_INTERVAL_DEFILEMENT_VITESSE_MIN_PIX_PER_MS;

    bougeLesCactus(vitesse);
    bougeLesLignesDuSol(vitesse);

    if (verifieLesCollisionsEntreDinoEtLesCactus()) {
      metAJourLAffichage(tempsDepuisDebut);
      afficheLeGamové();
      jeuEnCours = false;
      return;
    }
  }
  metAJourLAffichage(temps - tempsDebutDeJeu);
  window.requestAnimationFrame(nouvelleIteration);
}

function metAJourLAffichage(tempsDepuisDebut) {
  // AFAIRE: Juste ce qui a changé
  nettoieToutLEcran();

  // afficheLeCiel();
  // afficheLeDesert();
  afficheLeScore(tempsDepuisDebut);
  afficheLeSol();
  afficheLesLignesDuSol();
  afficheLesCactus();
  afficheLeDino();
}

// function afficheLeCiel() {
//   contexte.fillStyle = "#87ceeb66";
//   contexte.fillRect(0, 0, LARGEUR_DU_CANVAS, POSITION_Y_SOL);
//   contexte.fillStyle = "#000000";
// }
//
// function afficheLeDesert() {
//   contexte.fillStyle = "#fad5a566";
//   contexte.fillRect(
//     0,
//     POSITION_Y_SOL,
//     LARGEUR_DU_CANVAS,
//     HAUTEUR_DU_CANVAS - POSITION_Y_SOL,
//   );
//   contexte.fillStyle = "#000000";
// }

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
  restantMsPatteAnim = null;
}

function verifieLesCollisionsEntreDinoEtLesCactus() {
  const [dinoX, dinoY] = ouEstLeDino();
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

function afficheLeScore(tempsDepuisDebut) {
  contexte.font = "18px monospace";
  contexte.fillText(
    "Score: " + String(Math.floor(tempsDepuisDebut / 200)),
    10,
    30,
  );
}

function afficheLeGamové() {
  contexte.font = "35px monospace";
  contexte.fillStyle = "#990000";
  contexte.fillText("GAME OVER", 10, 80);
  contexte.font = "24px monospace";
  contexte.fillStyle = "#000000";
  contexte.fillText("jump to restart", 10, 120);
  contexte.fillText('Press "left" to exit', 10, 160);
}

function ouEstLeDino() {
  const xOffset = DECALAGE_GAUCHE_COMMENCE_DINO;
  const yOffset = DECALAGE_BAS_FINIT_DINO + (positionSautDino ?? 0);
  return [xOffset, yOffset];
}

function afficheLeDino() {
  const dinoEnCours = estDinoSurSaPatteGauche
    ? imgDinoPatteGauche
    : imgDinoPatteDroite;
  const [xOffset, yOffset] = ouEstLeDino();
  contexte.drawImage(
    dinoEnCours,
    xOffset,
    HAUTEUR_DU_CANVAS - dinoEnCours.naturalHeight - yOffset,
    dinoEnCours.naturalWidth,
    dinoEnCours.naturalHeight,
  );
}

function bougeLesCactus(vitesse) {
  for (let indice = 0; indice < lesCactus.length; indice++) {
    const cactusPosX = lesCactus[indice];
    const nouvellePosX = cactusPosX - vitesse;
    if (nouvellePosX < -imgCactus.naturalWidth) {
      lesCactus.splice(indice, 1);
      indice--;
      continue;
    }
    lesCactus[indice] = nouvellePosX;
  }

  const dernierCactus = lesCactus[lesCactus.length - 1];
  if (dernierCactus === undefined || dernierCactus <= LARGEUR_DU_CANVAS) {
    genereDesCactus(dernierCactus ?? LARGEUR_DU_CANVAS, vitesse / 2);
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

function bougeLesLignesDuSol(vitesse) {
  for (let indice = 0; indice < lesLignesDuSol.length; indice++) {
    const { x: lignePosX, longueur } = lesLignesDuSol[indice];
    const nouvellePosX = lignePosX - vitesse;
    if (nouvellePosX < -longueur) {
      lesLignesDuSol.splice(indice, 1);
      indice--;
    } else {
      lesLignesDuSol[indice].x = nouvellePosX;
    }
  }

  const derniereLigne = lesLignesDuSol[lesLignesDuSol.length - 1];
  if (derniereLigne === undefined || derniereLigne.x <= LARGEUR_DU_CANVAS) {
    genereLesLignesDuSol(LARGEUR_DU_CANVAS);
  }
}

function afficheLesLignesDuSol() {
  contexte.lineWidth = 1;
  for (let indice = 0; indice < lesLignesDuSol.length; indice++) {
    const { x: lignePosX, y: lignePosY, longueur } = lesLignesDuSol[indice];
    if (lignePosX >= LARGEUR_DU_CANVAS) {
      return;
    }
    contexte.beginPath();
    contexte.moveTo(lignePosX, lignePosY);
    contexte.lineTo(lignePosX + longueur, lignePosY);
    contexte.stroke();
  }
}

function attendsLeChargementDeLImage(img) {
  return new Promise((resolve, reject) => {
    img.addEventListener("load", resolve);
    img.addEventListener("error", reject);
  });
}

function genereDesCactus(decalage, difficulté) {
  let dernierCactus = decalage;
  lesCactus.push(dernierCactus);
  for (let indice = 1; indice <= 3; indice++) {
    let nouveauCactus = dernierCactus + imgCactus.naturalWidth + 590;
    const aleatoire = Math.random();
    if (difficulté >= 3 && aleatoire < 0.3) {
      if (difficulté >= 5 && aleatoire < 0.1) {
        lesCactus.push(nouveauCactus);
        nouveauCactus += imgCactus.naturalWidth + 1;
        lesCactus.push(nouveauCactus);
        nouveauCactus += imgCactus.naturalWidth + 1;
      }
      if (difficulté >= 4 && aleatoire < 0.2) {
        lesCactus.push(nouveauCactus);
        nouveauCactus += imgCactus.naturalWidth + 1;
      }
      lesCactus.push(nouveauCactus);
      nouveauCactus += imgCactus.naturalWidth + 1;
      lesCactus.push(nouveauCactus);
      nouveauCactus += imgCactus.naturalWidth + 1;
      lesCactus.push(nouveauCactus);
      nouveauCactus += imgCactus.naturalWidth + 1;
    } else if (aleatoire > 0.9) {
      if (difficulté >= 2) {
        // trois gros cactus
        lesCactus.push(nouveauCactus);
        nouveauCactus += imgCactus.naturalWidth + 1;
      }
      lesCactus.push(nouveauCactus);
      nouveauCactus += imgCactus.naturalWidth + 1;
    } else if (aleatoire > 0.7) {
      if (difficulté >= 2) {
        // double big cactus!
        lesCactus.push(nouveauCactus);
        nouveauCactus += imgCactus.naturalWidth + 1;
      }
      lesCactus.push(nouveauCactus);
    } else {
      nouveauCactus += 250 * aleatoire;
    }
    lesCactus.push(nouveauCactus);
    dernierCactus = nouveauCactus;
  }
  lesCactus.sort((a, b) => a - b);
}

function genereLesLignesDuSol(decalage) {
  for (let indice = 1; indice <= 1000; indice++) {
    const aleatoire = Math.random();
    const facteurPourDiffusion = (aleatoire * 2 - 1) * 0.7;
    lesLignesDuSol.push({
      x: decalage + indice * 100 * (1 + facteurPourDiffusion),
      y:
        aleatoire * (HAUTEUR_DU_CANVAS - (POSITION_Y_SOL + 5) + 1) +
        (POSITION_Y_SOL + 5),
      longueur: aleatoire * (40 - 1 + 1) + 1,
    });
  }
  lesLignesDuSol.sort((a, b) => a.x - b.x);
}
