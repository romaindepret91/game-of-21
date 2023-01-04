<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Romain Depret">
    <meta name="description" content="Programmation d’interface Web 2 - TP1 : Développement d'un jeu inspiré du 21. Application dynamique mettant en oeuvre la POO. ">

    <link rel="stylesheet" href="./styles/css/main.css">

    <script type="module" src="./scripts/main.js" defer></script>
    
    <title>Programmation d’interface Web 2 - TP1</title>
        
</head>
<body>
    <!-- Template qui sert à afficher les champs de saisie des noms des joueurs  -->
    <template id="player-name-temp">
        <div class="player-name__form">
            <form>
                <label for="input-name">Nom du joueur ${playerId}: </label>
                <input type="text" name="input-name" id="input-name" data-playerid="${playerId}">
            </form>
        </div>
    </template>

    <!-- Template qui sert à afficher les zones de jeu des joueurs -->
    <template id="player-area-temp">
        <div class="player-area" data-playerid="${playerId}">
            <h3 class="player-area-name">${playerName}</h3>
            <div class="player-area__btns spacer-top-20">
                <button class="play-btn btn btn-green">Jouer</button>
                <button class="stop-btn btn btn-red">Stop</button>
            </div>
            <ul class="cards-picked spacer-top-20"></ul>
            <p class="result spacer-top-10"><strong>Total: <span class="total-points">${totalPoints}</span></strong></p>
        </div>
    </template>

    <!-- Template utilisé pour afficher la fenêtre modale de fin de partie -->
    <template id="endGame-temp">
        <section class="end-of-game">
            <div class="end-of-game__winners"></div>
            <p class="end-of-game__games spacer-top-10">Vous avez joué <span>{numberOfGames}</span> partie(s)</p>
            <div class="end-of-game__btns spacer-top-10">
                <button class="playAgain btn btn-black">Rejouer</button>
                <button class="stopGame btn btn-black">Annuler</button>
            </div>
        </section>
    </template>

    <header>
        <h1>Le jeu du 21</h1>
    </header>

    <main class="board">

        <section class="selection-block spacer-top-50">

            <h2 class="selection-block__title">Sélectionnez un nombre de joueurs: </h2>

            <form class="selection-block__form">
                
                <select name="playersNum" id="playersNum">
                    <option value="0" selected>Nombre de joueurs...</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                </select>

                <button class="nextButton btn btn-black fade" disabled>Suivant</button>

            </form>

        </section>
        
        <section class="names-block spacer-top-20"></section> <!--Section qui accueille les champs de saisie de nom de chaque joueur générés avec le template player-name-temp-->

        <section class="list-block spacer-top-20"></section><!--Section qui accueille les zones de jeu de nom de chaque joueur générées avec le template player-area-temp-->
    
        <dialog id="endGame-modale"></dialog> <!--Fenêtre modale générée à chaque fin de partie avec le template endGame-temp-->
        
    </main>
    
    
</body>
</html>