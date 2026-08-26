/* =========================================================
   ESPORTO — PLAYER + ADMIN DASHBOARD
   FRONTEND DEMO VERSION
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEYS = {
  player: "esporto_player",
  tournaments: "esporto_tournaments",
  registrations: "esporto_registrations",
  transactions: "esporto_transactions",
  results: "esporto_results",
  admin: "esporto_admin_logged"
};


/* =========================================================
   DEFAULT DATA
========================================================= */

function getData(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    return fallback;
  }
}


function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}


/* =========================================================
   PLAYER
========================================================= */

let player = getData(STORAGE_KEYS.player, null);

let tournaments = getData(STORAGE_KEYS.tournaments, []);

let registrations = getData(
  STORAGE_KEYS.registrations,
  []
);

let transactions = getData(
  STORAGE_KEYS.transactions,
  []
);

let results = getData(
  STORAGE_KEYS.results,
  []
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  renderPlayer();

  renderWallet();

  renderDashboardTransactions();

  renderMyTournaments();

  renderAdminData();

});


/* =========================================================
   AUTH MODAL
========================================================= */

function openAuth(type) {

  const modal =
    document.getElementById("authModal");

  if (!modal) return;

  modal.classList.add("active");

  if (type === "signup") {
    showSignup();
  } else {
    showLogin();
  }

}


function closeAuth() {

  const modal =
    document.getElementById("authModal");

  if (modal) {
    modal.classList.remove("active");
  }

}


function showLogin() {

  document.getElementById("loginBox").style.display =
    "block";

  document.getElementById("signupBox").style.display =
    "none";

}


function showSignup() {

  document.getElementById("loginBox").style.display =
    "none";

  document.getElementById("signupBox").style.display =
    "block";

}


/* =========================================================
   PLAYER SIGNUP
========================================================= */

function signupPlayer(event) {

  event.preventDefault();

  const name =
    document.getElementById("signupName").value.trim();

  const mobile =
    document.getElementById("signupMobile").value.trim();

  const password =
    document.getElementById("signupPassword").value;

  if (!/^\d{10}$/.test(mobile)) {

    alert(
      "Please enter a valid 10 digit mobile number."
    );

    return;
  }


  if (password.length < 6) {

    alert(
      "Password must contain at least 6 characters."
    );

    return;
  }


  player = {

    id:
      "PLAYER-" +
      Date.now(),

    name: name,

    mobile: mobile,

    password: password,

    wallet: 0,

    wins: 0,

    tournaments: 0,

    points: 0,

    createdAt:
      new Date().toISOString()

  };


  saveData(
    STORAGE_KEYS.player,
    player
  );


  closeAuth();

  renderPlayer();

  renderWallet();

  alert(
    "Player account created successfully!"
  );

}


/* =========================================================
   PLAYER LOGIN
========================================================= */

function loginPlayer(event) {

  event.preventDefault();

  const mobile =
    document.getElementById("loginMobile").value.trim();

  const password =
    document.getElementById("loginPassword").value;


  const savedPlayer =
    getData(STORAGE_KEYS.player, null);


  if (!savedPlayer) {

    alert(
      "No player account found. Please create an account first."
    );

    return;
  }


  if (
    savedPlayer.mobile !== mobile ||
    savedPlayer.password !== password
  ) {

    alert(
      "Incorrect mobile number or password."
    );

    return;
  }


  player = savedPlayer;

  closeAuth();

  renderPlayer();

  renderWallet();

  renderMyTournaments();

  alert(
    "Welcome back, " +
    player.name +
    "!"
  );

}


/* =========================================================
   PLAYER LOGOUT
========================================================= */

function logoutPlayer() {

  player = null;

  localStorage.removeItem(
    STORAGE_KEYS.player
  );

  renderPlayer();

  renderWallet();

  renderMyTournaments();

  alert(
    "You have been logged out."
  );

}


/* =========================================================
   PLAYER UI
========================================================= */

function renderPlayer() {

  const nameElement =
    document.getElementById(
      "dashboardPlayerName"
    );

  const mobileElement =
    document.getElementById(
      "dashboardPlayerMobile"
    );

  const walletElement =
    document.getElementById(
      "dashboardWallet"
    );

  const winsElement =
    document.getElementById(
      "dashboardWins"
    );

  const tournamentElement =
    document.getElementById(
      "dashboardTournaments"
    );

  const pointsElement =
    document.getElementById(
      "dashboardPoints"
    );


  if (!player) {

    if (nameElement)
      nameElement.textContent = "Player";

    if (mobileElement)
      mobileElement.textContent =
        "Login to view your account";

    if (walletElement)
      walletElement.textContent =
        "₹0.00";

    if (winsElement)
      winsElement.textContent = "0";

    if (tournamentElement)
      tournamentElement.textContent = "0";

    if (pointsElement)
      pointsElement.textContent = "0";

    return;
  }


  if (nameElement)
    nameElement.textContent =
      player.name;


  if (mobileElement)
    mobileElement.textContent =
      "Mobile: " +
      player.mobile;


  if (walletElement)
    walletElement.textContent =
      "₹" +
      Number(player.wallet || 0).toFixed(2);


  if (winsElement)
    winsElement.textContent =
      player.wins || 0;


  if (tournamentElement)
    tournamentElement.textContent =
      player.tournaments || 0;


  if (pointsElement)
    pointsElement.textContent =
      player.points || 0;


  const headerBalance =
    document.getElementById(
      "headerBalance"
    );

  if (headerBalance) {

    headerBalance.textContent =
      "₹" +
      Number(player.wallet || 0).toFixed(2);

  }

}


/* =========================================================
   WALLET
========================================================= */

function openWallet() {

  const modal =
    document.getElementById(
      "walletModal"
    );

  if (!modal) return;

  if (!player) {

    alert(
      "Please login or create a player account first."
    );

    openAuth("login");

    return;
  }


  renderWallet();

  modal.classList.add("active");

}


function closeWallet() {

  const modal =
    document.getElementById(
      "walletModal"
    );

  if (modal)
    modal.classList.remove("active");

}


/* =========================================================
   ADD MONEY
========================================================= */

function openAddMoney() {

  if (!player) {

    closeWallet();

    openAuth("login");

    return;
  }


  const modal =
    document.getElementById(
      "addMoneyModal"
    );

  if (modal)
    modal.classList.add("active");

}


function closeAddMoney() {

  const modal =
    document.getElementById(
      "addMoneyModal"
    );

  if (modal)
    modal.classList.remove("active");

}


/*
   DEMO ONLY

   This does NOT charge real money.
*/

function addDemoMoney(event) {

  event.preventDefault();

  if (!player) {

    alert(
      "Please login first."
    );

    return;
  }


  const amount =
    Number(
      document.getElementById(
        "demoAmount"
      ).value
    );


  if (
    !amount ||
    amount <= 0 ||
    amount > 10000
  ) {

    alert(
      "Enter an amount between ₹1 and ₹10,000."
    );

    return;
  }


  player.wallet =
    Number(player.wallet || 0) +
    amount;


  saveData(
    STORAGE_KEYS.player,
    player
  );


  transactions.push({

    id:
      "TX-" +
      Date.now(),

    playerId:
      player.id,

    type:
      "credit",

    amount:
      amount,

    description:
      "Demo wallet balance",

    date:
      new Date().toISOString()

  });


  saveData(
    STORAGE_KEYS.transactions,
    transactions
  );


  document.getElementById(
    "demoAmount"
  ).value = "";


  closeAddMoney();

  renderPlayer();

  renderWallet();

  renderDashboardTransactions();

  alert(
    "Demo balance added: ₹" +
    amount
  );

}


/* =========================================================
   WALLET RENDER
========================================================= */

function renderWallet() {

  const balanceElement =
    document.getElementById(
      "walletBalance"
    );


  if (!player) {

    if (balanceElement)
      balanceElement.textContent =
        "₹0.00";

    return;
  }


  if (balanceElement) {

    balanceElement.textContent =
      "₹" +
      Number(player.wallet || 0).toFixed(2);

  }


  const list =
    document.getElementById(
      "transactionList"
    );

  if (!list) return;


  const playerTransactions =
    transactions
      .filter(
        tx =>
          tx.playerId === player.id
      )
      .slice()
      .reverse();


  if (
    playerTransactions.length === 0
  ) {

    list.innerHTML =
      `<p class="empty-wallet">
        No transactions yet.
      </p>`;

    return;
  }


  list.innerHTML =
    playerTransactions
      .map(tx => {

        const sign =
          tx.type === "credit"
            ? "+"
            : "-";


        const amountClass =
          tx.type === "credit"
            ? "credit"
            : "debit";


        return `
          <div class="transaction-item">

            <div class="transaction-info">

              <strong>
                ${escapeHTML(tx.description)}
              </strong>

              <small>
                ${formatDate(tx.date)}
              </small>

            </div>

            <div class="transaction-amount ${amountClass}">
              ${sign}₹${Number(tx.amount).toFixed(2)}
            </div>

          </div>
        `;

      })
      .join("");

}


/* =========================================================
   DASHBOARD TRANSACTIONS
========================================================= */

function renderDashboardTransactions() {

  const container =
    document.getElementById(
      "dashboardTransactions"
    );


  if (!container) return;


  if (!player) {

    container.innerHTML =
      `<div class="dashboard-empty">

        <div>🔐</div>

        <p>
          Login to view transactions.
        </p>

      </div>`;

    return;
  }


  const playerTransactions =
    transactions
      .filter(
        tx =>
          tx.playerId === player.id
      )
      .slice()
      .reverse()
      .slice(0, 4);


  if (
    playerTransactions.length === 0
  ) {

    container.innerHTML =
      `<div class="dashboard-empty">

        <div>💳</div>

        <p>
          No wallet transactions yet.
        </p>

      </div>`;

    return;
  }


  container.innerHTML =
    `<div class="dashboard-transactions">

      ${
        playerTransactions
          .map(tx => {

            const sign =
              tx.type === "credit"
                ? "+"
                : "-";


            const cls =
              tx.type === "credit"
                ? "credit"
                : "debit";


            return `
              <div class="dashboard-transaction">

                <div class="dashboard-transaction-info">

                  <strong>
                    ${escapeHTML(tx.description)}
                  </strong>

                  <small>
                    ${formatDate(tx.date)}
                  </small>

                </div>

                <div class="dashboard-transaction-amount ${cls}">
                  ${sign}₹${Number(tx.amount).toFixed(2)}
                </div>

              </div>
            `;

          })
          .join("")
      }

    </div>`;

}


/* =========================================================
   TOURNAMENT JOIN
========================================================= */

let selectedTournament =
  null;


function joinTournament(
  tournamentName,
  entryFee
) {

  if (!player) {

    alert(
      "Please login or create a player account first."
    );

    openAuth("login");

    return;
  }


  selectedTournament = {

    name:
      tournamentName,

    entryFee:
      Number(entryFee)

  };


  document.getElementById(
    "joinTournamentName"
  ).textContent =
    tournamentName;


  document.getElementById(
    "joinEntryFee"
  ).textContent =
    "₹" +
    Number(entryFee).toFixed(2);


  document.getElementById(
    "joinWalletBalance"
  ).textContent =
    "₹" +
    Number(player.wallet || 0).toFixed(2);


  document.getElementById(
    "joinModal"
  ).classList.add("active");

}


function closeJoinModal() {

  document.getElementById(
    "joinModal"
  ).classList.remove("active");

}


function confirmTournamentJoin() {

  if (!player) {

    closeJoinModal();

    openAuth("login");

    return;
  }


  if (!selectedTournament) {

    alert(
      "Tournament information not found."
    );

    return;
  }


  const fee =
    Number(
      selectedTournament.entryFee
    );


  if (
    Number(player.wallet || 0) < fee
  ) {

    alert(
      "Insufficient wallet balance. Please add balance first."
    );

    return;
  }


  const alreadyJoined =
    registrations.some(
      registration =>
        registration.playerId === player.id &&
        registration.tournament ===
          selectedTournament.name
    );


  if (alreadyJoined) {

    alert(
      "You have already joined this tournament."
    );

    closeJoinModal();

    return;
  }


  player.wallet =
    Number(player.wallet || 0) -
    fee;


  player.tournaments =
    Number(player.tournaments || 0) +
    1;


  saveData(
    STORAGE_KEYS.player,
    player
  );


  registrations.push({

    id:
      "REG-" +
      Date.now(),

    playerId:
      player.id,

    playerName:
      player.name,

    mobile:
      player.mobile,

    tournament:
      selectedTournament.name,

    entryFee:
      fee,

    status:
      "Registered",

    date:
      new Date().toISOString()

  });


  saveData(
    STORAGE_KEYS.registrations,
    registrations
  );


  transactions.push({

    id:
      "TX-" +
      Date.now(),

    playerId:
      player.id,

    type:
      "debit",

    amount:
      fee,

    description:
      "Tournament entry — " +
      selectedTournament.name,

    date:
      new Date().toISOString()

  });


  saveData(
    STORAGE_KEYS.transactions,
    transactions
  );


  closeJoinModal();

  renderPlayer();

  renderWallet();

  renderDashboardTransactions();

  renderMyTournaments();

  renderAdminData();


  alert(
    "Tournament joined successfully!"
  );

}


/* =========================================================
   MY TOURNAMENTS
========================================================= */

function renderMyTournaments() {

  const container =
    document.getElementById(
      "myTournaments"
    );


  if (!container) return;


  if (!player) {

    container.innerHTML =
      `<div class="dashboard-empty">

        <div>🔐</div>

        <p>
          Login to view your tournaments.
        </p>

        <button
          class="btn small"
          onclick="openAuth('login')"
        >
          Login
        </button>

      </div>`;

    return;
  }


  const myRegistrations =
    registrations
      .filter(
        registration =>
          registration.playerId ===
          player.id
      )
      .slice()
      .reverse();


  if (
    myRegistrations.length === 0
  ) {

    container.innerHTML =
      `<div class="dashboard-empty">

        <div>🎮</div>

        <p>
          You haven't joined any
          tournaments yet.
        </p>

        <a
          href="#tournaments"
          class="btn small"
        >
          Find Tournament
        </a>

      </div>`;

    return;
  }


  container.innerHTML =
    `<div class="my-tournaments">

      ${
        myRegistrations
          .map(registration => {

            return `
              <div class="my-tournament-card">

                <div class="my-tournament-info">

                  <strong>
                    ${escapeHTML(
                      registration.tournament
                    )}
                  </strong>

                  <small>
                    Entry ₹${Number(
                      registration.entryFee
                    ).toFixed(2)}
                    •
                    ${formatDate(
                      registration.date
                    )}
                  </small>

                </div>

                <span class="tournament-status">
                  ${escapeHTML(
                    registration.status
                  )}
                </span>

              </div>
            `;

          })
          .join("")
      }

    </div>`;

}


/* =========================================================
   REGISTER FORM
========================================================= */

function submitForm(event) {

  event.preventDefault();


  if (!player) {

    alert(
      "Please create/login to your player account first."
    );

    openAuth("signup");

    return;
  }


  const name =
    document.getElementById(
      "name"
    ).value.trim();


  const game =
    document.getElementById(
      "game"
    ).value.trim();


  const contact =
    document.getElementById(
      "contact"
    ).value.trim();


  const tournament =
    document.getElementById(
      "tournament"
    ).value;


  if (!tournament) {

    alert(
      "Please select a tournament."
    );

    return;
  }


  registrations.push({

    id:
      "REG-" +
      Date.now(),

    playerId:
      player.id,

    playerName:
      name || player.name,

    mobile:
      player.mobile,

    game:
      game,

    contact:
      contact,

    tournament:
      tournament,

    entryFee:
      0,

    status:
      "Registration Pending",

    date:
      new Date().toISOString()

  });


  saveData(
    STORAGE_KEYS.registrations,
    registrations
  );


  document.getElementById(
    "name"
  ).value = "";

  document.getElementById(
    "game"
  ).value = "";

  document.getElementById(
    "contact"
  ).value = "";

  document.getElementById(
    "tournament"
  ).value = "";


  renderMyTournaments();

  renderAdminData();


  alert(
    "Registration submitted successfully!"
  );

}


/* =========================================================
   ADMIN LOGIN
========================================================= */

function openAdminLogin() {

  const panel =
    document.getElementById(
      "adminLoginPanel"
    );

  if (panel) {

    panel.style.display =
      panel.style.display === "none"
        ? "block"
        : "none";

  }

}


function closeAdminLogin() {

  const panel =
    document.getElementById(
      "adminLoginPanel"
    );

  if (panel)
    panel.style.display = "none";

}


/*
   DEMO ADMIN LOGIN

   IMPORTANT:
   This is NOT secure production authentication.

   Demo credentials:
   Username: admin
   Password: esporto123
*/

function adminLogin(event) {

  event.preventDefault();


  const username =
    document.getElementById(
      "adminUsername"
    ).value.trim();


  const password =
    document.getElementById(
      "adminPassword"
    ).value;


  if (
    username === "admin" &&
    password === "esporto123"
  ) {

    localStorage.setItem(
      STORAGE_KEYS.admin,
      "true"
    );


    document.getElementById(
      "adminLoginPanel"
    ).style.display =
      "none";


    document.getElementById(
      "adminPanel"
    ).style.display =
      "block";


    renderAdminData();


    alert(
      "Admin login successful."
    );

  } else {

    alert(
      "Invalid admin username or password."
    );

  }

}


function adminLogout() {

  localStorage.removeItem(
    STORAGE_KEYS.admin
  );


  document.getElementById(
    "adminPanel"
  ).style.display =
    "none";


  alert(
    "Admin logged out."
  );

}


/* =========================================================
   ADMIN — CREATE TOURNAMENT
========================================================= */

function createTournament(event) {

  event.preventDefault();


  const name =
    document.getElementById(
      "adminTournamentName"
    ).value.trim();


  const game =
    document.getElementById(
      "adminTournamentGame"
    ).value.trim();


  const entry =
    Number(
      document.getElementById(
        "adminTournamentEntry"
      ).value
    );


  const prize =
    Number(
      document.getElementById(
        "adminTournamentPrize"
      ).value
    );


  const slots =
    Number(
      document.getElementById(
        "adminTournamentSlots"
      ).value
    );


  const date =
    document.getElementById(
      "adminTournamentDate"
    ).value;


  if (
    !name ||
    !game ||
    entry < 0 ||
    prize < 0 ||
    slots < 1 ||
    !date
  ) {

    alert(
      "Please fill all tournament details correctly."
    );

    return;
  }


  const tournament = {

    id:
      "TOUR-" +
      Date.now(),

    name:
      name,

    game:
      game,

    entryFee:
      entry,

    prizePool:
      prize,

    slots:
      slots,

    filledSlots:
      0,

    date:
      date,

    status:
      "Open",

    createdAt:
      new Date().toISOString()

  };


  tournaments.push(
    tournament
  );


  saveData(
    STORAGE_KEYS.tournaments,
    tournaments
  );


  event.target.reset();

  renderAdminData();

  alert(
    "Tournament created successfully!"
  );

}


/* =========================================================
   ADMIN — RENDER DATA
========================================================= */

function renderAdminData() {

  const adminPanel =
    document.getElementById(
      "adminPanel"
    );


  if (!adminPanel) return;


  const isAdmin =
    localStorage.getItem(
      STORAGE_KEYS.admin
    ) === "true";


  if (!isAdmin) {

    adminPanel.style.display =
      "none";

    return;
  }


  adminPanel.style.display =
    "block";


  renderAdminStats();

  renderAdminTournaments();

  renderAdminPlayers();

  renderAdminResults();

}


/* =========================================================
   ADMIN — STATS
========================================================= */

function renderAdminStats() {

  const players =
    new Set(
      registrations.map(
        registration =>
          registration.playerId
      )
    );


  const activeTournaments =
    tournaments.filter(
      tournament =>
        tournament.status === "Open"
    );


  const pendingResults =
    results.filter(
      result =>
        result.status === "Pending Review"
    );


  const playerElement =
    document.getElementById(
      "adminPlayers"
    );


  const tournamentElement =
    document.getElementById(
      "adminTournaments"
    );


  const pendingElement =
    document.getElementById(
      "adminPendingResults"
    );


  const activeElement =
    document.getElementById(
      "adminActiveTournaments"
    );


  if (playerElement)
    playerElement.textContent =
      players.size;


  if (tournamentElement)
    tournamentElement.textContent =
      tournaments.length;


  if (pendingElement)
    pendingElement.textContent =
      pendingResults.length;


  if (activeElement)
    activeElement.textContent =
      activeTournaments.length;

}


/* =========================================================
   ADMIN — TOURNAMENT LIST
========================================================= */

function renderAdminTournaments() {

  const container =
    document.getElementById(
      "adminTournamentList"
    );


  if (!container) return;


  if (
    tournaments.length === 0
  ) {

    container.innerHTML =
      `<div class="dashboard-empty">

        <div>🏆</div>

        <p>
          No tournaments created yet.
        </p>

      </div>`;

    return;
  }


  container.innerHTML =
    tournaments
      .slice()
      .reverse()
      .map(tournament => {

        const registered =
          registrations.filter(
            registration =>
              registration.tournament ===
              tournament.name
          ).length;


        return `
          <div class="admin-list-item">

            <strong>
              ${escapeHTML(
                tournament.name
              )}
            </strong>

            <small>

              ${escapeHTML(
                tournament.game
              )}

              <br>

              Entry:
              ₹${Number(
                tournament.entryFee
              ).toFixed(2)}

              • Prize:
              ₹${Number(
                tournament.prizePool
              ).toFixed(2)}

              <br>

              Slots:
              ${registered}/${tournament.slots}

              <br>

              Date:
              ${formatDate(
                tournament.date
              )}

            </small>


            <span class="admin-status">
              ${escapeHTML(
                tournament.status
              )}
            </span>


            <div class="admin-list-actions">

              <button
                class="admin-action-btn"
                onclick="toggleTournamentStatus(
                  '${tournament.id}'
                )"
              >
                ${
                  tournament.status === "Open"
                    ? "Close"
                    : "Open"
                }
              </button>


              <button
                class="admin-action-btn danger"
                onclick="deleteTournament(
                  '${tournament.id}'
                )"
              >
                Delete
              </button>

            </div>

          </div>
        `;

      })
      .join("");

}


/* =========================================================
   ADMIN — TOURNAMENT STATUS
========================================================= */

function toggleTournamentStatus(
  tournamentId
) {

  const tournament =
    tournaments.find(
      item =>
        item.id === tournamentId
    );


  if (!tournament) return;


  tournament.status =
    tournament.status === "Open"
      ? "Closed"
      : "Open";


  saveData(
    STORAGE_KEYS.tournaments,
    tournaments
  );


  renderAdminData();

}


/* =========================================================
   ADMIN — DELETE TOURNAMENT
========================================================= */

function deleteTournament(
  tournamentId
) {

  const tournament =
    tournaments.find(
      item =>
        item.id === tournamentId
    );


  if (!tournament) return;


  const confirmed =
    confirm(
      "Delete this tournament?"
    );


  if (!confirmed) return;


  tournaments =
    tournaments.filter(
      item =>
        item.id !== tournamentId
    );


  saveData(
    STORAGE_KEYS.tournaments,
    tournaments
  );


  renderAdminData();

}


/* =========================================================
   ADMIN — PLAYERS
========================================================= */

function renderAdminPlayers() {

  const container =
    document.getElementById(
      "adminPlayerList"
    );


  if (!container) return;


  const uniquePlayers = [];


  registrations.forEach(
    registration => {

      const exists =
        uniquePlayers.some(
          playerItem =>
            playerItem.playerId ===
            registration.playerId
        );


      if (!exists) {

        uniquePlayers.push(
          registration
        );

      }

    }
  );


  if (
    uniquePlayers.length === 0
  ) {

    container.innerHTML =
      `<div class="dashboard-empty">

        <div>👥</div>

        <p>
          No players registered yet.
        </p>

      </div>`;

    return;
  }


  container.innerHTML =
    uniquePlayers
      .map(playerItem => {

        const playerRegistrations =
          registrations.filter(
            registration =>
              registration.playerId ===
              playerItem.playerId
          );


        return `
          <div class="admin-list-item">

            <strong>
              ${escapeHTML(
                playerItem.playerName
              )}
            </strong>


            <small>

              Mobile:
              ${escapeHTML(
                playerItem.mobile || "—"
              )}

              <br>

              Tournaments:
              ${playerRegistrations.length}

            </small>


            <span class="admin-status">
              REGISTERED
            </span>

          </div>
        `;

      })
      .join("");

}


/* =========================================================
   ADMIN — RESULTS
========================================================= */

function renderAdminResults() {

  const container =
    document.getElementById(
      "adminResultList"
    );


  if (!container) return;


  const pending =
    results.filter(
      result =>
        result.status ===
        "Pending Review"
    );


  if (
    pending.length === 0
  ) {

    container.innerHTML =
      `<div class="dashboard-empty">

        <div>📸</div>

        <p>
          No pending results.
        </p>

      </div>`;

    return;
  }


  container.innerHTML =
    pending
      .map(result => {

        return `
          <div class="admin-list-item">

            <strong>
              ${escapeHTML(
                result.playerName
              )}
            </strong>

            <small>

              Tournament:
              ${escapeHTML(
                result.tournament
              )}

              <br>

              Submitted:
              ${formatDate(
                result.date
              )}

            </small>


            <span class="admin-status">
              PENDING REVIEW
            </span>


            <div class="admin-list-actions">

              <button
                class="admin-action-btn"
                onclick="approveResult(
                  '${result.id}'
                )"
              >
                Approve
              </button>


              <button
                class="admin-action-btn danger"
                onclick="rejectResult(
                  '${result.id}'
                )"
              >
                Reject
              </button>

            </div>

          </div>
        `;

      })
      .join("");

}


/* =========================================================
   RESULT APPROVE
========================================================= */

function approveResult(resultId) {

  const result =
    results.find(
      item =>
        item.id === resultId
    );


  if (!result) return;


  result.status =
    "Approved";


  saveData(
    STORAGE_KEYS.results,
    results
  );


  alert(
    "Result approved."
  );


  renderAdminData();

}


/* =========================================================
   RESULT REJECT
========================================================= */

function rejectResult(resultId) {

  const result =
    results.find(
      item =>
        item.id === resultId
    );


  if (!result) return;


  result.status =
    "Rejected";


  saveData(
    STORAGE_KEYS.results,
    results
  );


  alert(
    "Result rejected."
  );


  renderAdminData();

}


/* =========================================================
   UTILITY — DATE
========================================================= */

function formatDate(date) {

  if (!date)
    return "—";


  const parsed =
    new Date(date);


  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {

    return "—";

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
   UTILITY — ESCAPE HTML
========================================================= */

function escapeHTML(value) {

  if (value === null ||
      value === undefined) {

    return "";

  }


  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   CLOSE MODALS ON BACKDROP
========================================================= */

document.addEventListener(
  "click",
  function(event) {

    if (
      event.target.classList.contains(
        "auth-modal"
      )
    ) {

      closeAuth();

    }


    if (
      event.target.classList.contains(
        "wallet-modal"
      )
    ) {

      event.target.classList.remove(
        "active"
      );

    }

  }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key !== "Escape")
      return;


    closeAuth();

    closeWallet();

    closeAddMoney();

    closeJoinModal();

  }
);
