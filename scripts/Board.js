
// Importation des classes utilisées dans la classe Board
import{ Player } from './Player.js';
import{ Game } from './Game.js';

// Déclaration des constantes qui servent à encapsuler les attributes de la classe Board
const   _board = new WeakMap(),
        _numberOfGamesPlayed = new WeakMap(),
        _setBoard = new WeakMap();

// Déclaration de la classe Board
export class Board {

    constructor(board) {

         // Vérifie que le paramètre reçu est bien un élément HTML
        if(!(board instanceof HTMLElement) || !(board.classList.contains('board'))) throw new Error('Argument must be an HTML Element of class "board"');

        // Déclarations des attributs privés de la classe
        _board.set(this, board); // Élément main du DOM

        _numberOfGamesPlayed.set(this, 0); // Propriété qui stocke le nombre de parties jouées

        _setBoard.set(this, function() { // Méthode qui définit les comportements du "plateau de jeu"
            
            let elSelectPlayersNum = this.board.querySelector('#playersNum'),
                elNextBtn = this.board.querySelector('.nextButton'),
                elSelectionInterface = this.board.querySelector('.selection-block'),
                elNamesList = this.board.querySelector('.names-block'),
                elPlayersList = this.board.querySelector('.list-block'),
                elEndGameModale = this.board.querySelector('#endGame-modale'),
                elStartGameBtn = document.createElement('button'),
                playersNum = 0,
                totalPoints = 0,
                sessionNumberOfGamesPlayed, // variable de session
                sessionPlayers, // variable de session
                players = {}, // Objet qui accueille le nom des joueurs

                // FONCTION QUI GÈRE LE CLICK DE REDÉMARRAGE D'UNE PARTIE
                restartGame = function(modal, startGameBtn, stopGameBtn) {
                    startGameBtn.addEventListener('click', function(evt) {
                        evt.preventDefault();
                        modal.close();

                        let elOptions = Array.from(elSelectPlayersNum.querySelectorAll('option'));

                        // Réinitialisation de l'élément de sélection du nombre de joueurs
                        elOptions.every(function(option) {
                            if(option.index === 0) {
                                option.selected = true;
                                return false;
                            }
                            return true;
                        });

                        elNamesList.innerHTML = ''; // Vidage de la zone de saisie des noms
                        elNextBtn.classList.add('fade'); // Désactivation du bouton suivant 
                        elSelectionInterface.classList.remove('fade'); // Activation de la zone de sélection du nombre de joueurs
                        elPlayersList.innerHTML = ''; // Vidage de la liste de joueurs
                        elSelectionInterface.style.display = 'flex'; // Réaffichage de l'interface de sélection du nombre de joueurs
                        elStartGameBtn.remove(); // Suppression du bouton de démarrage de partie

                    }.bind(this));

                    stopGameBtn.addEventListener('click', function(){

                        modal.close();

                    }.bind(this));
                },

                // FONCTION D'AFFICHAGE DE LA FENÊTRE MODALE DE FIN DE PARTIE. 
                // À CHAQUE CLIC SUR LES BOUTONS PLAY ET STOP D'UN JOUEUR, ON VÉRIFIE QUE LA PARTIE EST TERMINÉE OU NON. SI ELLE L'EST, ON INCRÉMENTE LA PROPRIÉTÉ NUMBEROFGAMESPLAYED, ON STOCKE LA VALEUR DE CELLE-CI DANS LA VARIABLE SESSIONSTORAGE ET ON AFFICHE LA SECTION DE REDÉMARRAGE D'UNE NOUVELLE PARTIE DANS UNE FENÊTRE MODALE.
                // LA FENÊTRE AFFICHE AUSSI LE NOM DES GAGNANTS DE LA PARTIE SI IL Y EN A EU
                displayModal = function(newGame, board) {
                    let elEndGameTemp = document.querySelector('#endGame-temp'), // Récupération du template dont le contenu est injecté dans la fenêtre modale
                    htmlTemp = elEndGameTemp.innerHTML; // Récupération du contenu

                    if(newGame.isGameOver()) {
                        
                        board.numberOfGamesPlayed++;
                        sessionNumberOfGamesPlayed = JSON.stringify(board.numberOfGamesPlayed);
                        sessionStorage.numberOfGamesPlayed = sessionNumberOfGamesPlayed;

                        elEndGameModale.innerHTML = htmlTemp.replaceAll('{numberOfGames}', JSON.parse(sessionStorage.numberOfGamesPlayed)); // Injection du contenu dans la fenêtre modale et remplacement dynamique du nombre de parties jouées


                        if(sessionStorage.winners !== undefined) { // Si il y a eu des gagnants dans cette partie

                            let winners = JSON.parse(sessionStorage.winners); // On récupère le contenu de la variable session

                            // Traitement d'affichage pour plusieurs gagnants
                            if(winners.length > 1) { 
                                let msg = `Les gagnants de cette partie sont: `,
                                    elMsg = document.createElement('ul'),
                                    elWinners = elEndGameModale.querySelector('.end-of-game__winners');
    
                                elMsg.innerHTML = msg;
    
                                elWinners.appendChild(elMsg);
                                winners.forEach(function(winner) {
                                    let elWinner = `<li>${winner}</li>`;
                                    elMsg.insertAdjacentHTML('beforeend', elWinner);
                                });
                            }
                            // Traitement d'affichage pour un seul gagnant
                            else {
                                let msg = `Le gagnant de cette partie est: `,
                                    elMsg = document.createElement('ul'),
                                    elWinner = `<li>${winners[0]}</li>`,
                                    elWinners = elEndGameModale.querySelector('.end-of-game__winners');
                                
                                elMsg.innerHTML = msg;
                                elWinners.appendChild(elMsg);
                                elMsg.insertAdjacentHTML('beforeend', elWinner);
                            }
    
                            // Déclaration des variables contenant les éléments passés en paramètres à la fonction restartGame qui gère les clics des boutons de la fenêtre modale
                            let elRestart = elEndGameModale.querySelector('.end-of-game'),
                                elRestartBtn = elRestart.querySelector('.end-of-game__btns').querySelector('.playAgain'),
                                elStopGameBtn = elRestart.querySelector('.end-of-game__btns').querySelector('.stopGame');
    
                            elEndGameModale.showModal(); 
                            restartGame(elEndGameModale, elRestartBtn, elStopGameBtn); // Fonction qui ajoute les listeners sur les boutons de la fenêtre modale
                        }
                        // Traitement d'affichage pour aucun gagnant
                        else {
                            let msg = `Pas de gagnant sur cette partie`,
                                elMsg = document.createElement('p'),
                                elWinners = elEndGameModale.querySelector('.end-of-game__winners');
                                
                            elMsg.innerHTML = msg;
                            elWinners.appendChild(elMsg);

                            let elRestart = elEndGameModale.querySelector('.end-of-game'),
                                elRestartBtn = elRestart.querySelector('.end-of-game__btns').querySelector('.playAgain'),
                                elStopGameBtn = elRestart.querySelector('.end-of-game__btns').querySelector('.stopGame');
    
                            elEndGameModale.showModal();
                            restartGame(elEndGameModale, elRestartBtn, elStopGameBtn);
                        }
                    }
                };

            // GESTION DE LA SÉLECTION DU NOMBRE DE JOUEURS
            elSelectPlayersNum.addEventListener('change', function() {

                playersNum = parseInt(elSelectPlayersNum.value);
                playersNum !== 0 ? elNextBtn.disabled = false : elNextBtn.disabled = true; // Active le bouton suivant si un nombre de joueur supérieur à 0 est sélectionné
                if(playersNum !== 0) elNextBtn.classList.remove('fade');

            });

            // GESTION DU CLICK SUR LE BOUTON SUIVANT UNE FOIS LE NOMBRE DE JOUEURS SÉLECTIONNÉ
            if(this.numberOfGamesPlayed === 0){ // Le listener n'est ajouté qu'une fois à l'instanciation de l'objet de classe Board
                elNextBtn.addEventListener('click', function(evt) {

                    evt.preventDefault();

                    let i = 1; // Compteur de tour de la boucle While ci-dessous

                    // Injection du texte et de la classe du bouton elStartGameBtn qui lance la partie  
                    elStartGameBtn.innerText = 'Lancer la partie';
                    elStartGameBtn.classList.add('startGame', 'btn', 'btn-black');

                    // Boucle d'insertion des inputs de noms des joueurs générés dynamiquement grâce au template
                    do {
                        let htmlContentPlayerName = document.querySelector('#player-name-temp').innerHTML,
                            generateHtmlContent = new Function('playerId', "return(`"+htmlContentPlayerName+"`)");

                        htmlContentPlayerName = generateHtmlContent(i);
                        elNamesList.innerHTML += htmlContentPlayerName;
                        i++;
                    } while(i <= playersNum);

                    elNextBtn.disabled = true; //Désactivation du bouton suivant
                    elSelectionInterface.classList.add('fade');
                    elNamesList.appendChild(elStartGameBtn); // Insertion du bouton de lancement de partie
                    elStartGameBtn.disabled = true; // Désactivation du bouton par défaut
                    elStartGameBtn.classList.add('fade');
                    elNamesList.style.display = 'flex'; // Affichage de la section contenant les inputs

                    let playersNameList = this.board.querySelector('.names-block').querySelectorAll('.player-name__form'), // liste des inputs de noms de joueurs
                        isFilled = true;

                    // AJOUT DU LISTERNER D'ÉVÈNEMENT QUI GÈRE L'ACTIVATION/DÉSACTIVATION DU BOUTON DE LANCEMENT SI LES CHAMPS DES NOMS DE JOUEURS SONT TOUS REMPLIS OU PAS
                    playersNameList.forEach(function(playerName) {

                        let playerInput = playerName.querySelector('form').querySelector('#input-name');

                        playerInput.addEventListener('input', function() {

                            isFilled = true;
                            players = {}; // Réinitialisation de l'objet qui accueillent les noms des joueurs

                            playersNameList.forEach(function(playerName) {

                                let playerInput = playerName.querySelector('form').querySelector('#input-name'),
                                    playerId = playerInput.dataset.playerid;
                                if(playerInput.value === '') isFilled = false;
                                players[`Joueur ${playerId}`] = playerInput.value; // Ajout du nom du joueur dans l'objet players
                            });

                            isFilled ? elStartGameBtn.disabled = false : elStartGameBtn.disabled = true; // Activation / Désactivation du bouton de lancement de partie en fonction du remplissage des champs contrôlé par le booléen isFilled
                            if(isFilled) elStartGameBtn.classList.remove('fade');
                            else elStartGameBtn.classList.add('fade');
                        });
                    });

                    // GESTION DU BOUTON DE LANCEMENT DE PARTIE
                    if(this.numberOfGamesPlayed === 0){ // Le listener n'est ajouté qu'une fois à l'instanciation de l'objet de classe Board
                        elStartGameBtn.addEventListener('click', function() {

                            let i = 1; // Compteur de tour de la boucle For ci-dessous

                            sessionPlayers = JSON.stringify(players); // Stockage des noms des joueurs dans une variable session
                            sessionStorage.players = sessionPlayers;
                            sessionStorage.removeItem('winners'); // Suppression de la variable session des gagnants de la partie précédente
                                
                            // Boucle d'insertion des zones de jeu générées dynamiquement grâce au template
                            for(let player in players) {
                                
                                let htmlContentPlayerArea = document.querySelector('#player-area-temp').innerHTML,
                                    generateHtmlContent = new Function('playerName', 'playerId', 'totalPoints', "return(`"+htmlContentPlayerArea+"`)");
            
                                htmlContentPlayerArea = generateHtmlContent(players[player], i, totalPoints);
                                elPlayersList.innerHTML += htmlContentPlayerArea;
                                i++;
                            }
                            
                            elSelectionInterface.style.display = 'none'; // Masquage de l'interface de sélection
                            elNamesList.style.display = 'none'; // Masquage de la section de saisie des noms des joueurs

                            let playersAreas = Array.from(this.board.querySelectorAll('.player-area')), //Sélection des zones de jeu générées plus haut
                                newGame = new Game(playersAreas); // Instanciation du nouvel objet de classe Game

                            newGame.initializeGame(); // Méthode de l'objet de classe Game qui sert à donner la main au premier joueur

                            // Boucle qui traverse les zones de jeu de chaque joueur
                            playersAreas.forEach(function(playerArea) {
                                
                                new Player(playerArea).setPlayerBehaviour(newGame); // INSTANCIATION D'UN NOUVEL OBJET DE CLASSE PLAYER ET APPEL DE LA MÉTHODE QUI DÉFINIT LES COMPORTEMENTS DE CHAQUE JOUEUR SUR L'INSTANCE D'OBJET DE CLASSE GAME CRÉÉ PLUS HAUT

                                // COMPORTEMENTS DÉFINIS D'UNE FIN DE PARTIE
                                let elPlayBtn = playerArea.querySelector('.player-area__btns').querySelector('.play-btn'),
                                    elStopBtn = playerArea.querySelector('.player-area__btns').querySelector('.stop-btn');

                                elPlayBtn.addEventListener('click', function(){

                                    displayModal(newGame, this);

                                }.bind(this));

                                // LE MÊME COMPORTEMENT EST DÉFINI POUR LE CLIC SUR LE BOUTON STOP
                                elStopBtn.addEventListener('click', function(){

                                    displayModal(newGame, this);

                                }.bind(this)); 
                            }.bind(this));
                        }.bind(this));
                    }
                }.bind(this));
            }
        });
    }

    // GETTERS ET SETTERS DES PROPRIÉTÉS RENDUES PUBLIQUES
    get board() {
        return _board.get(this);
    }

    get setBoard() {
        return _setBoard.get(this);
    }

    get numberOfGamesPlayed() {
        return _numberOfGamesPlayed.get(this);
    }

    set numberOfGamesPlayed(value) {
        if(typeof value !== 'number' || value < 0) throw new Error('Must be a positive number');
        _numberOfGamesPlayed.set(this, value);
    }
}