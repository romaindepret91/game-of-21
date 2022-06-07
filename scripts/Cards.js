
// CLASSE CONTENANT UNE UNIQUE MÉTHODE STATIQUE QUI RENVOIE UN TABLEAU D'OBJETS, CHAQUE OBJET REPRÉSENTANT UNE CARTE DU JEU
export class Cards {

    static getDeck() {
        
        let suits = ['spades', 'diamonds', 'clubs', 'hearts'],
            values = ['As', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'],
            deck = [];

        suits.forEach(function(suit) {
            values.forEach(function(value) {
                let card = {Suit: suit, Value: value};
                deck.push(card);
            })
        })

        return deck;
        
    }
}