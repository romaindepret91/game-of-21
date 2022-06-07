
// Déclaration des constantes qui servent à encapsuler les attributes de la classe Player
const   _playerArea = new WeakMap(),
        _playerTotalPoints = new WeakMap(),
        _setPlayerBehaviour = new WeakMap();

export class Player {

    constructor(playerArea) {

        if(!(playerArea.classList.contains('player-area'))) throw new Error('Must be an HTML element of class "player-area"');

        _playerArea.set(this, playerArea); // Zone de jeu de chaque joueur

        _playerTotalPoints.set(this, 0); // Points total de chaque joueur

        // MÉTHODE QUI DÉFINIT LE COMPORTEMENT DE CHAQUE JOUEUR. L'ARGUMENT PASSÉ EN PARAMÈTRE EST L'OBJET INSTANCIÉ PAR LA CLASSE GAME DANS LA MÉTHODE SETBOARD DE LA CLASSE BOARD (AU CLIC SUR LE BOUTON DU LANCEMENT DE PARTIE)
        _setPlayerBehaviour.set(this, function(game) {

            let elPlayBtn = this.playerArea.querySelector('.player-area__btns').querySelector('.play-btn'),
                elStopBtn = this.playerArea.querySelector('.player-area__btns').querySelector('.stop-btn'),
                elTotalPoints = this.playerArea.querySelector('.total-points'),
                pointsLimit = 21,
                winners = [],

                // FONCTION QUI DÉTERMINE LE TOUR DU JOUEUR SUIVANT
                playNextTurn = function(currentPlayer) { // Le paramètre currentPlayer représente le joueur qui vient de jouer

                    if(currentPlayer !== isLastPlayer()) { // Si ce n'est pas le dernier joueur en lice
                        
                        // On effectue le traitement ci-dessous pour déterminer quel joueur est le prochain à jouer
                        game.arrPlayers.every(function(player) {
                            if(player == currentPlayer) { // On trouve le joueur qui vient de jouer
                                currentPlayer.classList.add('fade'); // On gèle sa zone de jeu

                                // Si le currenPlayer est le dernier joueur de la liste, il faut redémarrer une boucle au début de la liste pour déterminer le prochain joueur à jouer
                                if(currentPlayer.dataset.playerid == game.arrPlayers.length) {
                                    game.round++; // On incrémente le numéro de tour

                                    // Nouvelle boucle pour trouver le prochain joueur
                                    game.arrPlayers.every(function(player){
                                        if(!player.classList.contains('isOut')) {
                                            player.classList.remove('fade');
                                            return false;
                                        }
                                        return true;
                                    });
                                }
                                // Si ce n'est pas le dernier joueur de la liste, on commence par chercher le prochain joueur dans le reste de la liste
                                else {
                                    game.arrPlayers.every(function(player) {
                                        if(parseInt(player.dataset.playerid) <= parseInt(currentPlayer.dataset.playerid)) return true; // Tous les joueurs qui précèdent le currentPlayer sont ignorés
                                        if(!player.classList.contains('isOut')) {
                                            player.classList.remove('fade');
                                            return false;
                                        }
                                        // Lorsqu'on arrive à la fin de la liste et que le prochain joueur n'a pas été trouvé, on redémarre une boucle depuis le début de la liste pour le trouver
                                        if(player.dataset.playerid == game.arrPlayers.length) {
                                            game.arrPlayers.every(function(player) {
                                                if(!player.classList.contains('isOut')) {
                                                    player.classList.remove('fade');
                                                    return false;
                                                }
                                                return true;
                                            });
                                        }
                                        return true;
                                    });
                                }
                            }
                            return true;
                        });
                    }
                    else game.round++; // Si il ne reste qu'un joueur en lice, seul le traitement du nombre de tours est effectué
                },

                // FONCTION QUI EFFECTUE LES TRAITEMENTS DE FIN DE PARTIE ET DÉTERMINE LE OU LES GAGNANTS, SI IL Y EN A
                setWinners = function() {

                    let elWin = `<p>Bravo, vous avez gagné!</p>`,
                        maxPoints = 0;
                       
                    // Première boucle qui évalue le score de chaque joueur par rapport au nombre de points max autorisé (21) et le score max éventuellement atteint par un ou plusieurs joueurs
                    game.arrPlayers.forEach(function(player) {
                       
                        let playerScore = parseInt(player.querySelector('.total-points').innerText);

                        if(playerScore <= pointsLimit){
                            
                            if(playerScore > maxPoints) {
                                maxPoints = playerScore;
                            }
                        }
                    });

                    // Deuxième boucle qui évalue le score de chaque joueur, le compare au meilleur score atteint (déterminé dans la boucle précédente), et effectue le traitement des styles adéquate
                    game.arrPlayers.forEach(function(player) {

                        let playerScore = parseInt(player.querySelector('.total-points').innerText),
                            sessionWinners;

                        if(playerScore === maxPoints){
                            if(player.classList.contains('stopped')) player.classList.remove('stopped');
                            player.classList.add('win');
                            player.classList.remove('fade');
                            player.style.borderColor = 'green';
                            player.innerHTML += elWin;
                            winners.push(player.querySelector('.player-area-name').innerHTML);
                            sessionWinners = JSON.stringify(winners);
                            sessionStorage.winners = sessionWinners;
                        }
                        else {
                            if(player.classList.contains('stopped')) player.classList.remove('stopped');
                            player.classList.add('lost');
                            player.style.borderColor = 'red';
                        }
                    });
                },

                // FONCTION QUI DÉTERMINE SI IL NE RESTE QU'UN SEUL JOUEUR À JOUER ET DE QUEL JOUEUR IL S'AGIT EN LE RETOURNANT
                isLastPlayer = function() {

                    let playersRemaining = game.arrPlayers.length,
                        lastPlayer;

                    game.arrPlayers.forEach(function(player) {
                        if(player.classList.contains('isOut')) playersRemaining--;
                        });

                    if(playersRemaining === 1) {
                        game.arrPlayers.forEach(function(player) {
                            if(!player.classList.contains('isOut')) lastPlayer = player;
                            });
                    }
                    return lastPlayer;
                }

            // GESTION DU CLIC SUR LE BOUTON "JOUER". TRAITEMENT:  TIRE UNE CARTE AU HASARD, LA PRÉSENTE AU JOUEUR, ÉVALUE SI IL N'A PAS DÉPASSÉ OU ATTEINT LE NOMBRE DE POINTS MAX. ÉVALUE AUSSI L'ÉTAT DE LA PARTIE (FINIE OU PAS), ET LANCE LA FONCTION APPROPRIÉE (playNextTurn ou setWinners)
            elPlayBtn.addEventListener('click', function(evt) {

                let cardPicked = game.pickCard(), // retourne un objet contenant les données de la carte tirée
                    elCardsPicked = this.playerArea.querySelector('.cards-picked'),
                    currentPlayer = evt.target.parentNode.parentNode, // Variable qui reçoit le noeud DOM identifiant le joueur qui a cliqué 
                    elNewCardPicked = `<li class="newCardPicked"><span class="round">Tour ${game.round}:</span><span class="card"> ${cardPicked['Value']} of ${cardPicked['Suit']} = ${cardPicked['Points']} points</span></li>`;

                this.playerTotalPoints += parseInt(cardPicked['Points']); // Ajout de la valeur de la carte au nombre de points total du joueur

                // Traitement en fonction du total de points du joueur une fois la carte tirée et le total mis à jour
                if(this.playerTotalPoints > pointsLimit) {
                    this.playerArea.classList.add('fade');
                    this.playerArea.classList.add('isOut');
                    this.playerArea.classList.add('lost');
                }
                else if(this.playerTotalPoints === pointsLimit) {
                    this.playerArea.classList.add('fade');
                    this.playerArea.classList.add('isOut');
                    this.playerArea.classList.add('win');
                }

                elTotalPoints.innerHTML = this.playerTotalPoints; // Affichage du nouveau total du joueur

                elCardsPicked.innerHTML += elNewCardPicked; //Affichage de la carte tirée

                // On évalue si le jeu est terminé grâce à la méthode de l'objet instancié de classe Game et appelle la fonction adéquate
                if(!game.isGameOver()) playNextTurn(currentPlayer);
                else setWinners();
            }.bind(this));
                
            // GESTION DU CLIC SUR LE BOUTON D'ARRÊT DE JEU. LE JOUEUR SORT DE LA PARTIE.
            elStopBtn.addEventListener('click', function(evt) {

                let currentPlayer = evt.target.parentNode.parentNode;

                this.playerArea.classList.add('fade');
                this.playerArea.classList.add('isOut');
                this.playerArea.classList.add('stopped');

                if(!game.isGameOver()) playNextTurn(currentPlayer);
                else setWinners();
            }.bind(this));
        });
    }

    get playerArea() {
        return _playerArea.get(this);
    }

    get playerTotalPoints() {
        return _playerTotalPoints.get(this);
    }

    set playerTotalPoints(value) {
        if(typeof value !== 'number' || value < 0) throw new Error('Must be a positive number');
        return _playerTotalPoints.set(this, value);
    }

    get setPlayerBehaviour() {
        return _setPlayerBehaviour.get(this);
    }
}