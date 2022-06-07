
// Importation de la classe utilisée dans la classe Game. Elle sert à générer le tableau représentant le jeu de cartes.
import{ Cards } from './Cards.js';

// Déclaration des constantes qui servent à encapsuler les attributs de la classe Game
const   _deck = new WeakMap(),
        _arrPlayers = new WeakMap(),
        _round = new WeakMap(),
        _pickCard = new WeakMap(),
        _initializeGame = new WeakMap(),
        _isGameOver = new WeakMap();

export class Game {

    constructor(arrPlayers) { // Reçoit en paramètre le tableau contenant les zones de jeu de chaque joueur (classe Board - 129)

        let deckReceived = Cards.getDeck(); // Méthode statique de la classe Cards qui génère le tableau contenant toutes les cartes du jeu

        // Vérification de l'intégrité des données reçues
        if(Object.getPrototypeOf(deckReceived).constructor !== Array && deckReceived.length !== 52) throw new Error('Expecting an array of 52 elements');
        if(Object.getPrototypeOf(arrPlayers).constructor !== Array && arrPlayers.length > 6) throw new Error('Expecting an array of maximum 6 elements');

        _deck.set(this, deckReceived); // Tableau des cartes

        _arrPlayers.set(this, arrPlayers); //  Tableau des zones de jeu des joueurs

        _round.set(this, 1); // Tour de jeu

        // Méthode qui donne la main au premier joueur au démarrage d'une nouvelle partie (classe Board - 131)
        _initializeGame.set(this, function() {
            this.arrPlayers.forEach(function(player, index) {
                if(index !== 0) player.classList.add('fade');
            }.bind(this));
        });

        // Méthode qui retourne une carte du tableau de cartes (deck) de manière aléatoire (appelée par référence dans la classe Player - 136) avec sa valeur en points
        _pickCard.set(this, function() {

            let cardPicked = this.deck[Math.floor(Math.random() * this.deck.length)], // Variable qui reçoit l'objet carte
                pointsScale = {
                    'As': 11,
                    'Jack': 10,
                    'Queen': 10,
                    'King': 10
                };
            
            // Boucle qui associe le nombre de points correspondant si la carte tirée est une tête 
            for(let head in pointsScale) {
                if(cardPicked['Value'] == head) {
                    cardPicked['Points'] = pointsScale[head];
                    break;
                }
                cardPicked['Points'] = cardPicked['Value']; // si ce n'est pas une tête, le nombre de points correspond à sa valeur nominale
            }

            // Une fois la carte tirée, on la retire du tableau de cartes
            this.deck.forEach(function(card, index) {
                if(cardPicked == card) this.deck.splice(index, 1);
            }.bind(this));
            
            return cardPicked; // retourne la carte
        });

        // Méthode qui évalue l'état de la partie (finie ou non) en fonction du nombre de joueurs restant. Retourne un booléen.
        _isGameOver.set(this, function() {

            let isOver = false,
                playersRemaining = this.arrPlayers.length;

            this.arrPlayers.forEach(function(player) {
                if(player.classList.contains('isOut')) playersRemaining--;
            }.bind(this));

            if(playersRemaining < 1) isOver = true; // retourne true si il ne reste aucun joueur à pouvoir jouer.

            return isOver;
        })

    }

    get deck() {
        return _deck.get(this);
    }

    get arrPlayers() {
        return _arrPlayers.get(this);
    }
    
    get round() {
        return _round.get(this);
    }

    set round(value) {
        if(typeof value !== 'number' || value < 0) throw new Error('Must be a positive number');
        _round.set(this, value);
    }

    get pickCard() {
        return _pickCard.get(this);
    }

    get initializeGame() {
        return _initializeGame.get(this);
    }

    get isGameOver() {
        return _isGameOver.get(this);
    }

   

  

}