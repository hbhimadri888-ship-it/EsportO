/* =====================================
   ESPORTO PLAYER SYSTEM
   Demo / Frontend Version
===================================== */


/* =====================================
   STORAGE KEYS
===================================== */

const PLAYERS_KEY = "esportoPlayers";
const CURRENT_USER_KEY = "esportoCurrentUser";


/* =====================================
   BASIC HELPERS
===================================== */

function getPlayers() {
  try {
    return JSON.parse(localStorage.getItem(PLAYERS_KEY)) || {};
  } catch (error) {
    return {};
  }
}


function savePlayers(players) {
  localStorage.setItem(
    PLAYERS_KEY,
    JSON.stringify(players)
  );
}


function getCurrentUser() {
  try {
    return JSON.parse(
      localStorage.getItem(CURRENT_USER_KEY)
    );
  } catch (error) {
    return null;
  }
}


function saveCurrentUser(user) {
  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(user)
  );
}


function removeCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}


function formatMoney(amount) {
  return "₹" + Number(amount || 0).toFixed(2);
}


function getDateTime() {
  return new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}


/* =====================================
   PLAYER DATA
===================================== */

function createDefaultPlayer(name, mobile, password) {

  return {
    name: name,
    mobile: mobile,
    password: password,

    balance: 0,

    wins: 0,

    points: 0,

    tournaments: [],

    transactions: [],

    createdAt: getDateTime()
  };
}


/* =====================================
   INITIAL PAGE LOAD
===================================== */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    updateUI();

    updateDashboard();

    updateWalletUI();

    setupMobileInputs();

  }
);


/* =====================================
   MOBILE INPUT
===================================== */

function setupMobileInputs() {

  const mobileInputs = document.querySelectorAll(
    'input[type="tel"]'
  );

  mobileInputs.forEach(function (input) {

    input.addEventListener(
      "input",
      function () {

        this.value = this.value
          .replace(/\D/g, "")
          .slice(0, 10);

      }
    );

  });

}


/* =====================================
   AUTH MODAL
===================================== */

function openAuth(mode = "login") {

  const modal =
    document.getElementById("authModal");

  if (!modal) return;

  modal.classList.add("active");

  if (mode === "signup") {
    showSignup();
  } else {
    showLogin();
  }

}


function closeAuth() {

  const modal =
    document.getElementById("authModal");

  if (!modal) return;

  modal.classList.remove("active");

}


function showSignup() {

  const loginBox =
    document.getElementById("loginBox");

  const signupBox =
    document.getElementById("signupBox");

  if (loginBox) {
    loginBox.style.display = "none";
  }

  if (signupBox) {
    signupBox.style.display = "block";
  }

}


function showLogin() {

  const loginBox =
    document.getElementById("loginBox");

  const signupBox =
    document.getElementById("signupBox");

  if (loginBox) {
    loginBox.style.display = "block";
  }

  if (signupBox) {
    signupBox.style.display = "none";
  }

}


/* =====================================
   CREATE PLAYER ACCOUNT
===================================== */

function signupPlayer(event) {

  event.preventDefault();

  const name =
    document.getElementById("signupName").value.trim();

  const mobile =
    document.getElementById("signupMobile").value.trim();

  const password =
    document.getElementById("signupPassword").value;

  if (name.length < 2) {

    alert("Please enter a valid player name.");

    return;

  }


  if (!/^\d{10}$/.test(mobile)) {

    alert(
      "Please enter a valid 10 digit mobile number."
    );

    return;

  }


  if (password.length < 6) {

    alert(
      "Password must be at least 6 characters."
    );

    return;

  }


  const players = getPlayers();


  if (players[mobile]) {

    alert(
      "An account already exists with this mobile number."
    );

    showLogin();

    document.getElementById(
      "loginMobile"
    ).value = mobile;

    return;

  }


  const player =
    createDefaultPlayer(
      name,
      mobile,
      password
    );


  players[mobile] = player;

  savePlayers(players);

  saveCurrentUser(player);


  alert(
    "Account created successfully! Welcome to EsportO."
  );


  document.getElementById(
    "signupName"
  ).value = "";

  document.getElementById(
    "signupMobile"
  ).value = "";

  document.getElementById(
    "signupPassword"
  ).value = "";


  closeAuth();

  updateUI();

  updateDashboard();

  updateWalletUI();


  scrollToDashboard();

}


/* =====================================
   PLAYER LOGIN
===================================== */

function loginPlayer(event) {

  event.preventDefault();

  const mobile =
    document.getElementById("loginMobile").value.trim();

  const password =
    document.getElementById("loginPassword").value;


  if (!/^\d{10}$/.test(mobile)) {

    alert(
      "Please enter your 10 digit mobile number."
    );

    return;

  }


  const players = getPlayers();

  const player = players[mobile];


  if (!player) {

    alert(
      "No EsportO account found with this mobile number."
    );

    return;

  }


  if (player.password !== password) {

    alert(
      "Incorrect password. Please try again."
    );

    return;

  }


  saveCurrentUser(player);


  document.getElementById(
    "loginPassword"
  ).value = "";


  closeAuth();

  updateUI();

  updateDashboard();

  updateWalletUI();


  alert(
    "Login successful. Welcome back, " +
    player.name +
    "!"
  );


  scrollToDashboard();

}


/* =====================================
   LOGOUT
===================================== */

function logoutPlayer() {

  const user = getCurrentUser();

  if (!user) return;


  const confirmLogout =
    confirm(
      "Are you sure you want to logout?"
    );


  if (!confirmLogout) return;


  removeCurrentUser();


  updateUI();

  updateDashboard();

  updateWalletUI();


  alert(
    "You have been logged out."
  );


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =====================================
   UPDATE HEADER
===================================== */

function updateUI() {

  const authArea =
    document.getElementById("authArea");

  const headerBalance =
    document.getElementById("headerBalance");

  const user = getCurrentUser();


  if (headerBalance) {

    headerBalance.textContent =
      user
        ? formatMoney(user.balance)
        : "₹0";

  }


  if (!authArea) return;


  if (!user) {

    authArea.innerHTML = `
      <button
        class="btn small"
        onclick="openAuth('login')"
      >
        Login
      </button>
    `;

    return;

  }


  authArea.innerHTML = `
    <div class="player-badge">

      <span class="player-name">
        ${escapeHTML(user.name)}
      </span>

      <button
        class="logout-btn"
        onclick="logoutPlayer()"
      >
        Logout
      </button>

    </div>
  `;

}


/* =====================================
   UPDATE DASHBOARD
===================================== */

function updateDashboard() {

  const user = getCurrentUser();


  const dashboardName =
    document.getElementById(
      "dashboardPlayerName"
    );

  const dashboardMobile =
    document.getElementById(
      "dashboardPlayerMobile"
    );

  const dashboardWallet =
    document.getElementById(
      "dashboardWallet"
    );

  const dashboardWins =
    document.getElementById(
      "dashboardWins"
    );

  const dashboardTournaments =
    document.getElementById(
      "dashboardTournaments"
    );

  const dashboardPoints =
    document.getElementById(
      "dashboardPoints"
    );


  if (!user) {

    if (dashboardName) {
      dashboardName.textContent =
        "Player";
    }

    if (dashboardMobile) {
      dashboardMobile.textContent =
        "Login to view your account";
    }

    if (dashboardWallet) {
      dashboardWallet.textContent =
        "₹0.00";
    }

    if (dashboardWins) {
      dashboardWins.textContent =
        "0";
    }

    if (dashboardTournaments) {
      dashboardTournaments.textContent =
        "0";
    }

    if (dashboardPoints) {
      dashboardPoints.textContent =
        "0";
    }

    renderMyTournaments([]);

    renderDashboardTransactions([]);

    return;

  }


  if (dashboardName) {

    dashboardName.textContent =
      user.name;

  }


  if (dashboardMobile) {

    dashboardMobile.textContent =
      maskMobile(user.mobile);

  }


  if (dashboardWallet) {

    dashboardWallet.textContent =
      formatMoney(user.balance);

  }


  if (dashboardWins) {

    dashboardWins.textContent =
      user.wins || 0;

  }


  if (dashboardTournaments) {

    dashboardTournaments.textContent =
      (user.tournaments || []).length;

  }


  if (dashboardPoints) {

    dashboardPoints.textContent =
      user.points || 0;

  }


  renderMyTournaments(
    user.tournaments || []
  );


  renderDashboardTransactions(
    user.transactions || []
  );

}


/* =====================================
   MASK MOBILE NUMBER
===================================== */

function maskMobile(mobile) {

  if (!mobile) return "";

  return (
    mobile.substring(0, 2) +
    "******" +
    mobile.substring(8)
  );

}


/* =====================================
   DASHBOARD TOURNAMENTS
===================================== */

function renderMyTournaments(tournaments) {

  const container =
    document.getElementById(
      "myTournaments"
    );

  if (!container) return;


  if (!tournaments || tournaments.length === 0) {

    container.innerHTML = `
      <div class="dashboard-empty">

        <div>
          🎮
        </div>

        <p>
          You haven't joined any tournaments yet.
        </p>

        <a
          href="#tournaments"
          class="btn small"
        >
          Find Tournament
        </a>

      </div>
    `;

    return;

  }


  container.innerHTML =
    tournaments
      .slice()
      .reverse()
      .map(function (tournament) {

        return `
          <div class="my-tournament-card">

            <div class="my-tournament-info">

              <strong>
                ${escapeHTML(
                  tournament.name
                )}
              </strong>

              <small>
                Entry ${formatMoney(
                  tournament.entryFee
                )}
                •
                ${escapeHTML(
                  tournament.joinedAt
                )}
              </small>

            </div>

            <span class="tournament-status">
              JOINED
            </span>

          </div>
        `;

      })
      .join("");

}


/* =====================================
   DASHBOARD TRANSACTIONS
===================================== */

function renderDashboardTransactions(
  transactions
) {

  const container =
    document.getElementById(
      "dashboardTransactions"
    );

  if (!container) return;


  if (!transactions || transactions.length === 0) {

    container.innerHTML = `
      <div class="dashboard-empty">

        <div>
          💳
        </div>

        <p>
          No wallet transactions yet.
        </p>

      </div>
    `;

    return;

  }


  container.innerHTML =
    transactions
      .slice()
      .reverse()
      .slice(0, 5)
      .map(function (transaction) {

        const isCredit =
          transaction.type === "credit";

        return `
          <div class="dashboard-transaction">

            <div class="dashboard-transaction-info">

              <strong>
                ${escapeHTML(
                  transaction.title
                )}
              </strong>

              <small>
                ${escapeHTML(
                  transaction.date
                )}
              </small>

            </div>

            <div
              class="
                dashboard-transaction-amount
                ${isCredit
                  ? "credit"
                  : "debit"}
              "
            >
              ${isCredit ? "+" : "-"}
              ${formatMoney(
                transaction.amount
              )}
            </div>

          </div>
        `;

      })
      .join("");

}


/* =====================================
   WALLET
===================================== */

function openWallet() {

  const user = getCurrentUser();


  if (!user) {

    alert(
      "Please login or create a player account first."
    );

    openAuth("login");

    return;

  }


  updateWalletUI();


  const modal =
    document.getElementById(
      "walletModal"
    );

  if (modal) {

    modal.classList.add("active");

  }

}


function closeWallet() {

  const modal =
    document.getElementById(
      "walletModal"
    );

  if (modal) {

    modal.classList.remove("active");

  }

}


/* =====================================
   WALLET UI
===================================== */

function updateWalletUI() {

  const user = getCurrentUser();


  const walletBalance =
    document.getElementById(
      "walletBalance"
    );


  if (walletBalance) {

    walletBalance.textContent =
      user
        ? formatMoney(user.balance)
        : "₹0.00";

  }


  const transactionList =
    document.getElementById(
      "transactionList"
    );


  if (!transactionList) return;


  if (!user || !user.transactions.length) {

    transactionList.innerHTML = `
      <p class="empty-wallet">
        No transactions yet.
      </p>
    `;

    return;

  }


  transactionList.innerHTML =
    user.transactions
      .slice()
      .reverse()
      .map(function (transaction) {

        const isCredit =
          transaction.type === "credit";


        return `
          <div class="transaction-item">

            <div class="transaction-info">

              <strong>
                ${escapeHTML(
                  transaction.title
                )}
              </strong>

              <small>
                ${escapeHTML(
                  transaction.date
                )}
              </small>

            </div>

            <div
              class="
                transaction-amount
                ${isCredit
                  ? "credit"
                  : "debit"}
              "
            >
              ${isCredit ? "+" : "-"}
              ${formatMoney(
                transaction.amount
              )}
            </div>

          </div>
        `;

      })
      .join("");

}


/* =====================================
   ADD MONEY MODAL
===================================== */

function openAddMoney() {

  const user = getCurrentUser();


  if (!user) {

    closeWallet();

    openAuth("login");

    return;

  }


  const modal =
    document.getElementById(
      "addMoneyModal"
    );


  if (modal) {

    modal.classList.add("active");

  }

}


function closeAddMoney() {

  const modal =
    document.getElementById(
      "addMoneyModal"
    );


  if (modal) {

    modal.classList.remove("active");

  }

}


/* =====================================
   ADD DEMO MONEY
===================================== */

function addDemoMoney(event) {

  event.preventDefault();


  const user = getCurrentUser();


  if (!user) {

    closeAddMoney();

    openAuth("login");

    return;

  }


  const amount =
    Number(
      document.getElementById(
        "demoAmount"
      ).value
    );


  if (!amount || amount <= 0) {

    alert(
      "Please enter a valid amount."
    );

    return;

  }


  if (amount > 10000) {

    alert(
      "Maximum demo balance addition is ₹10,000."
    );

    return;

  }


  const players = getPlayers();


  user.balance =
    Number(user.balance || 0) +
    amount;


  user.transactions =
    user.transactions || [];


  user.transactions.push({

    type: "credit",

    title: "Demo Wallet Top-up",

    amount: amount,

    date: getDateTime()

  });


  players[user.mobile] = user;


  savePlayers(players);

  saveCurrentUser(user);


  document.getElementById(
    "demoAmount"
  ).value = "";


  closeAddMoney();

  updateUI();

  updateDashboard();

  updateWalletUI();


  alert(
    formatMoney(amount) +
    " demo balance added to your wallet."
  );


  openWallet();

}


/* =====================================
   JOIN TOURNAMENT
===================================== */

let selectedTournament = null;


function joinTournament(
  tournamentName,
  entryFee
) {

  const user = getCurrentUser();


  if (!user) {

    alert(
      "Please create or login to your EsportO player account first."
    );

    openAuth("login");

    return;

  }


  selectedTournament = {

    name: tournamentName,

    entryFee: Number(entryFee)

  };


  const nameElement =
    document.getElementById(
      "joinTournamentName"
    );

  const feeElement =
    document.getElementById(
      "joinEntryFee"
    );

  const balanceElement =
    document.getElementById(
      "joinWalletBalance"
    );


  if (nameElement) {

    nameElement.textContent =
      tournamentName;

  }


  if (feeElement) {

    feeElement.textContent =
      formatMoney(entryFee);

  }


  if (balanceElement) {

    balanceElement.textContent =
      formatMoney(user.balance);

  }


  const modal =
    document.getElementById(
      "joinModal"
    );


  if (modal) {

    modal.classList.add("active");

  }

}


function closeJoinModal() {

  const modal =
    document.getElementById(
      "joinModal"
    );


  if (modal) {

    modal.classList.remove("active");

  }


  selectedTournament = null;

}


/* =====================================
   CONFIRM TOURNAMENT JOIN
===================================== */

function confirmTournamentJoin() {

  const user = getCurrentUser();


  if (!user) {

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


  const entryFee =
    selectedTournament.entryFee;


  const tournamentName =
    selectedTournament.name;


  if (Number(user.balance) < entryFee) {

    alert(
      "Insufficient wallet balance.\n\n" +
      "Required: " +
      formatMoney(entryFee) +
      "\n" +
      "Available: " +
      formatMoney(user.balance)
    );

    return;

  }


  const alreadyJoined =
    (user.tournaments || [])
      .some(function (tournament) {

        return (
          tournament.name ===
          tournamentName
        );

      });


  if (alreadyJoined) {

    alert(
      "You have already joined this tournament."
    );

    closeJoinModal();

    return;

  }


  const players = getPlayers();


  user.balance =
    Number(user.balance) -
    entryFee;


  user.tournaments =
    user.tournaments || [];


  user.tournaments.push({

    name: tournamentName,

    entryFee: entryFee,

    status: "JOINED",

    joinedAt: getDateTime()

  });


  user.transactions =
    user.transactions || [];


  user.transactions.push({

    type: "debit",

    title:
      "Tournament Entry — " +
      tournamentName,

    amount: entryFee,

    date: getDateTime()

  });


  players[user.mobile] = user;


  savePlayers(players);

  saveCurrentUser(user);


  closeJoinModal();

  updateUI();

  updateDashboard();

  updateWalletUI();


  alert(
    "Tournament joined successfully! 🎮"
  );


  scrollToDashboard();

}


/* =====================================
   REGISTRATION FORM
===================================== */

function submitForm(event) {

  event.preventDefault();


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


  if (
    !name ||
    !game ||
    !contact ||
    !tournament
  ) {

    alert(
      "Please complete all registration fields."
    );

    return;

  }


  alert(
    "Registration submitted successfully!\n\n" +
    "Tournament: " +
    tournament
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

}


/* =====================================
   SCROLL TO DASHBOARD
===================================== */

function scrollToDashboard() {

  const dashboard =
    document.getElementById(
      "dashboard"
    );


  if (!dashboard) return;


  setTimeout(function () {

    dashboard.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }, 300);

}


/* =====================================
   SECURITY / HTML ESCAPE
===================================== */

function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }


  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =====================================
   CLOSE MODALS BY BACKDROP
===================================== */

document.addEventListener(
  "click",
  function (event) {

    const authModal =
      document.getElementById(
        "authModal"
      );

    const walletModal =
      document.getElementById(
        "walletModal"
      );

    const addMoneyModal =
      document.getElementById(
        "addMoneyModal"
      );

    const joinModal =
      document.getElementById(
        "joinModal"
      );


    if (
      event.target === authModal
    ) {

      closeAuth();

    }


    if (
      event.target === walletModal
    ) {

      closeWallet();

    }


    if (
      event.target === addMoneyModal
    ) {

      closeAddMoney();

    }


    if (
      event.target === joinModal
    ) {

      closeJoinModal();

    }

  }
);


/* =====================================
   ESC KEY CLOSE
===================================== */

document.addEventListener(
  "keydown",
  function (event) {

    if (event.key !== "Escape") {
      return;
    }

    closeAuth();

    closeWallet();

    closeAddMoney();

    closeJoinModal();

  }
);
