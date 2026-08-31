/* =========================================================
   ESPORTO — HOME PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEYS = {

  tournaments:
    "esporto_tournaments",

  registrations:
    "esporto_registrations"

};


/* =========================================================
   GET DATA
========================================================= */

function getData(key, fallback){

  try{

    const data =
      localStorage.getItem(key);

    return data
      ? JSON.parse(data)
      : fallback;

  }catch(error){

    return fallback;

  }

}


/* =========================================================
   LOAD DATA
========================================================= */

let tournaments =
  getData(
    STORAGE_KEYS.tournaments,
    []
  );

let registrations =
  getData(
    STORAGE_KEYS.registrations,
    []
  );


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function(){

    renderTournaments();

    renderPlatformStats();

    renderHeroTournament();

  }
);


/* =========================================================
   TOURNAMENTS
========================================================= */

function renderTournaments(){

  const grid =
    document.getElementById(
      "tournamentGrid"
    );

  const empty =
    document.getElementById(
      "noTournaments"
    );

  if(!grid) return;


  const openTournaments =
    tournaments.filter(
      tournament =>
        tournament.status === "Open"
    );


  if(openTournaments.length === 0){

    grid.innerHTML = "";

    if(empty)
      empty.style.display =
        "block";

    return;

  }


  if(empty)
    empty.style.display =
      "none";


  grid.innerHTML =
    openTournaments
      .slice()
      .reverse()
      .map(
        tournament => {

          const registered =
            registrations.filter(
              registration =>
                registration.tournament ===
                tournament.name
            ).length;


          return `

            <div class="tournament-card">

              <div class="tournament-top">

                <span class="game-tag">
                  ${escapeHTML(
                    tournament.game
                  )}
                </span>

                <span class="open-tag">
                  OPEN
                </span>

              </div>


              <h3>
                ${escapeHTML(
                  tournament.name
                )}
              </h3>


              <p class="tournament-game">
                ${escapeHTML(
                  tournament.game
                )}
                • Competitive Tournament
              </p>


              <div class="tournament-info">

                <div>

                  <small>
                    Prize Pool
                  </small>

                  <strong class="tournament-prize">
                    ₹${Number(
                      tournament.prizePool || 0
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>


                <div>

                  <small>
                    Entry
                  </small>

                  <strong>
                    ₹${Number(
                      tournament.entryFee || 0
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>


                <div>

                  <small>
                    Players
                  </small>

                  <strong>
                    ${registered}/${Number(
                      tournament.slots || 0
                    )}
                  </strong>

                </div>


                <div>

                  <small>
                    Status
                  </small>

                  <strong>
                    LIVE
                  </strong>

                </div>

              </div>


              <div class="tournament-footer">

                <span class="tournament-date">
                  ${formatDate(
                    tournament.date
                  )}
                </span>

                <button
                  class="join-btn"
                  onclick="openTournament(
                    '${escapeAttribute(
                      tournament.name
                    )}'
                  )"
                >
                  JOIN →
                </button>

              </div>

            </div>

          `;

        }
      )
      .join("");

}


/* =========================================================
   TOURNAMENT CLICK
========================================================= */

function openTournament(name){

  const tournament =
    tournaments.find(
      item =>
        item.name === name
    );


  if(!tournament)
    return;


  window.location.href =
    "player.html";

}


/* =========================================================
   HERO TOURNAMENT
========================================================= */

function renderHeroTournament(){

  const name =
    document.getElementById(
      "heroTournamentName"
    );

  const game =
    document.getElementById(
      "heroTournamentGame"
    );

  const prize =
    document.getElementById(
      "heroPrize"
    );

  const slots =
    document.getElementById(
      "heroSlots"
    );


  const openTournaments =
    tournaments.filter(
      tournament =>
        tournament.status === "Open"
    );


  if(openTournaments.length === 0){

    if(name)
      name.textContent =
        "Coming Soon";

    if(game)
      game.textContent =
        "New tournaments will appear here.";

    if(prize)
      prize.textContent =
        "₹0";

    if(slots)
      slots.textContent =
        "0";

    return;

  }


  const tournament =
    openTournaments[0];


  if(name)
    name.textContent =
      tournament.name;


  if(game)
    game.textContent =
      tournament.game;


  if(prize)
    prize.textContent =
      "₹" +
      Number(
        tournament.prizePool || 0
      ).toLocaleString("en-IN");


  if(slots){

    const registered =
      registrations.filter(
        registration =>
          registration.tournament ===
          tournament.name
      ).length;

    slots.textContent =
      registered +
      "/" +
      Number(
        tournament.slots || 0
      );

  }

}


/* =========================================================
   PLATFORM STATS
========================================================= */

function renderPlatformStats(){

  const active =
    tournaments.filter(
      tournament =>
        tournament.status === "Open"
    ).length;


  const totalRegistrations =
    registrations.length;


  const games = new Set();


  tournaments.forEach(
    tournament => {

      if(tournament.game){

        games.add(
          tournament.game
        );

      }

    }
  );


  const activeElement =
    document.getElementById(
      "activeTournamentCount"
    );

  const registrationsElement =
    document.getElementById(
      "totalRegistrationCount"
    );

  const gamesElement =
    document.getElementById(
      "gameCount"
    );


  if(activeElement)
    activeElement.textContent =
      active;


  if(registrationsElement)
    registrationsElement.textContent =
      totalRegistrations;


  if(gamesElement){

    gamesElement.textContent =
      Math.max(
        games.size,
        3
      ) + "+";

  }


  const miniPlayers =
    document.getElementById(
      "heroMiniPlayers"
    );

  const miniTournaments =
    document.getElementById(
      "heroMiniTournaments"
    );

  const miniGames =
    document.getElementById(
      "heroMiniGames"
    );


  if(miniPlayers)
    miniPlayers.textContent =
      totalRegistrations;


  if(miniTournaments)
    miniTournaments.textContent =
      tournaments.length;


  if(miniGames)
    miniGames.textContent =
      Math.max(
        games.size,
        3
      ) + "+";

}


/* =========================================================
   DATE
========================================================= */

function formatDate(date){

  if(!date)
    return "Date TBA";


  const parsed =
    new Date(date);


  if(
    Number.isNaN(
      parsed.getTime()
    )
  ){

    return "Date TBA";

  }


  return parsed.toLocaleString(
    "en-IN",
    {
      day:"2-digit",
      month:"short",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit"
    }
  );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value){

  if(
    value === null ||
    value === undefined
  ){

    return "";

  }


  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   ESCAPE ATTRIBUTE
========================================================= */

function escapeAttribute(value){

  return String(value)
    .replace(
      /\\/g,
      "\\\\"
    )
    .replace(
      /'/g,
      "\\'"
    );

}


/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMobileMenu(){

  const menu =
    document.getElementById(
      "mobileMenu"
    );

  if(!menu)
    return;

  menu.classList.toggle(
    "active"
  );

}


function closeMobileMenu(){

  const menu =
    document.getElementById(
      "mobileMenu"
    );

  if(menu)
    menu.classList.remove(
      "active"
    );

}


/* =========================================================
   STORAGE CHANGE
   Updates homepage when admin creates tournament
========================================================= */

window.addEventListener(
  "storage",
  function(){

    tournaments =
      getData(
        STORAGE_KEYS.tournaments,
        []
      );

    registrations =
      getData(
        STORAGE_KEYS.registrations,
        []
      );

    renderTournaments();

    renderPlatformStats();

    renderHeroTournament();

  }
);
