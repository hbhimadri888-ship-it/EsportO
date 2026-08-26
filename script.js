// ========================================
// ESPORTO PLAYER + WALLET SYSTEM
// DEMO VERSION
// ========================================


// ========================================
// HELPER FUNCTIONS
// ========================================

function getPlayer(){

  const data = localStorage.getItem("esportoPlayer");

  if(!data){
    return null;
  }

  try{
    return JSON.parse(data);
  }catch(error){
    return null;
  }
}


function isLoggedIn(){

  return localStorage.getItem("esportoLoggedIn") === "true";

}


// ========================================
// LOGIN / SIGNUP MODAL
// ========================================

function openAuth(type){

  const modal =
    document.getElementById("authModal");

  if(!modal) return;

  modal.classList.add("active");

  if(type === "signup"){
    showSignup();
  }else{
    showLogin();
  }

}


function closeAuth(){

  const modal =
    document.getElementById("authModal");

  if(modal){
    modal.classList.remove("active");
  }

}


function showSignup(){

  const loginBox =
    document.getElementById("loginBox");

  const signupBox =
    document.getElementById("signupBox");

  if(loginBox){
    loginBox.style.display = "none";
  }

  if(signupBox){
    signupBox.style.display = "block";
  }

}


function showLogin(){

  const loginBox =
    document.getElementById("loginBox");

  const signupBox =
    document.getElementById("signupBox");

  if(signupBox){
    signupBox.style.display = "none";
  }

  if(loginBox){
    loginBox.style.display = "block";
  }

}


// ========================================
// MOBILE NUMBER VALIDATION
// ========================================

function validMobile(number){

  return /^[6-9][0-9]{9}$/.test(number);

}


// ========================================
// CREATE PLAYER ACCOUNT
// ========================================

function signupPlayer(event){

  event.preventDefault();

  const name =
    document.getElementById("signupName").value.trim();

  const mobile =
    document.getElementById("signupMobile").value.trim();

  const password =
    document.getElementById("signupPassword").value;


  if(!validMobile(mobile)){

    alert(
      "Please enter a valid 10 digit Indian mobile number."
    );

    return;

  }


  if(password.length < 6){

    alert(
      "Password must contain at least 6 characters."
    );

    return;

  }


  const existingPlayer =
    localStorage.getItem("esportoPlayer");


  if(existingPlayer){

    alert(
      "An account already exists on this browser. Please login."
    );

    showLogin();

    return;

  }


  const player = {

    name:name,

    mobile:mobile,

    password:password,

    joined:
      new Date().toLocaleDateString(),

    wallet:0,

    transactions:[],

    tournaments:[]

  };


  localStorage.setItem(
    "esportoPlayer",
    JSON.stringify(player)
  );


  localStorage.setItem(
    "esportoLoggedIn",
    "true"
  );


  alert(
    "Account created successfully! Welcome to EsportO 🔥"
  );


  closeAuth();

  updateAuthArea();

  updateWalletUI();

}


// ========================================
// LOGIN
// ========================================

function loginPlayer(event){

  event.preventDefault();


  const mobile =
    document.getElementById("loginMobile").value.trim();

  const password =
    document.getElementById("loginPassword").value;


  if(!validMobile(mobile)){

    alert(
      "Please enter a valid 10 digit mobile number."
    );

    return;

  }


  const savedPlayer =
    getPlayer();


  if(!savedPlayer){

    alert(
      "No player account found. Please create an account first."
    );

    showSignup();

    return;

  }


  if(
    savedPlayer.mobile === mobile &&
    savedPlayer.password === password
  ){

    localStorage.setItem(
      "esportoLoggedIn",
      "true"
    );


    alert(
      "Login successful! Welcome back " +
      savedPlayer.name +
      " 🔥"
    );


    closeAuth();

    updateAuthArea();

    updateWalletUI();


  }else{

    alert(
      "Incorrect mobile number or password."
    );

  }

}


// ========================================
// LOGOUT
// ========================================

function logoutPlayer(){

  localStorage.removeItem(
    "esportoLoggedIn"
  );


  updateAuthArea();

  updateWalletUI();


  alert(
    "You have been logged out."
  );

}


// ========================================
// UPDATE HEADER LOGIN AREA
// ========================================

function updateAuthArea(){

  const authArea =
    document.getElementById("authArea");

  if(!authArea) return;


  const player =
    getPlayer();


  if(
    isLoggedIn() &&
    player
  ){

    authArea.innerHTML = `

      <div class="player-badge">

        <span class="player-name">
          👤 ${escapeHTML(player.name)}
        </span>

        <button
          class="logout-btn"
          onclick="logoutPlayer()"
        >
          Logout
        </button>

      </div>

    `;

  }else{

    authArea.innerHTML = `

      <button
        class="btn small"
        onclick="openAuth('login')"
      >
        Login
      </button>

    `;

  }

}


// ========================================
// WALLET
// ========================================

function openWallet(){

  if(!isLoggedIn()){

    alert(
      "Please login to access your EsportO Wallet."
    );

    openAuth("login");

    return;

  }


  updateWalletUI();


  const modal =
    document.getElementById("walletModal");

  if(modal){

    modal.classList.add("active");

  }

}


function closeWallet(){

  const modal =
    document.getElementById("walletModal");

  if(modal){

    modal.classList.remove("active");

  }

}


// ========================================
// UPDATE WALLET UI
// ========================================

function updateWalletUI(){

  const player =
    getPlayer();


  let balance = 0;


  if(player){

    balance =
      Number(player.wallet) || 0;

  }


  const walletBalance =
    document.getElementById("walletBalance");

  const headerBalance =
    document.getElementById("headerBalance");


  if(walletBalance){

    walletBalance.textContent =
      formatMoney(balance);

  }


  if(headerBalance){

    headerBalance.textContent =
      formatMoney(balance);

  }


  renderTransactions();

}


// ========================================
// MONEY FORMAT
// ========================================

function formatMoney(amount){

  return "₹" +
    Number(amount || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits:2,
        maximumFractionDigits:2
      }
    );

}


// ========================================
// ADD MONEY WINDOW
// ========================================

function openAddMoney(){

  if(!isLoggedIn()){

    closeWallet();

    openAuth("login");

    return;

  }


  const modal =
    document.getElementById("addMoneyModal");


  if(modal){

    modal.classList.add("active");

  }

}


function closeAddMoney(){

  const modal =
    document.getElementById("addMoneyModal");


  if(modal){

    modal.classList.remove("active");

  }

}


// ========================================
// DEMO ADD MONEY
// ========================================

function addDemoMoney(event){

  event.preventDefault();


  const input =
    document.getElementById("demoAmount");


  const amount =
    Number(input.value);


  if(
    !Number.isFinite(amount) ||
    amount <= 0
  ){

    alert(
      "Please enter a valid amount."
    );

    return;

  }


  if(amount > 10000){

    alert(
      "Demo wallet limit is ₹10,000 per top-up."
    );

    return;

  }


  const player =
    getPlayer();


  if(!player){

    alert(
      "Please create an account first."
    );

    closeAddMoney();

    openAuth("login");

    return;

  }


  player.wallet =
    Number(player.wallet || 0) + amount;


  if(!Array.isArray(player.transactions)){

    player.transactions = [];

  }


  player.transactions.unshift({

    type:"credit",

    title:"Demo Wallet Top-up",

    amount:amount,

    date:
      new Date().toLocaleString()

  });


  localStorage.setItem(
    "esportoPlayer",
    JSON.stringify(player)
  );


  input.value = "";


  closeAddMoney();

  updateWalletUI();


  alert(
    formatMoney(amount) +
    " demo balance added to your wallet."
  );

}


// ========================================
// TRANSACTION HISTORY
// ========================================

function renderTransactions(){

  const list =
    document.getElementById("transactionList");


  if(!list) return;


  const player =
    getPlayer();


  if(
    !player ||
    !Array.isArray(player.transactions) ||
    player.transactions.length === 0
  ){

    list.innerHTML = `

      <p class="empty-wallet">
        No transactions yet.
      </p>

    `;

    return;

  }


  list.innerHTML =
    player.transactions
      .slice(0,20)
      .map(function(transaction){

        const credit =
          transaction.type === "credit";


        return `

          <div class="transaction-item">

            <div class="transaction-info">

              <strong>
                ${escapeHTML(transaction.title)}
              </strong>

              <small>
                ${escapeHTML(transaction.date)}
              </small>

            </div>


            <div
              class="transaction-amount ${
                credit ? "credit" : "debit"
              }"
            >

              ${credit ? "+" : "-"}
              ${formatMoney(transaction.amount)}

            </div>

          </div>

        `;

      })
      .join("");

}


// ========================================
// TOURNAMENT JOIN
// ========================================

let selectedTournament = null;

let selectedEntryFee = 0;


function joinTournament(
  tournamentName,
  entryFee
){

  if(!isLoggedIn()){

    alert(
      "Please login before joining a tournament."
    );

    openAuth("login");

    return;

  }


  const player =
    getPlayer();


  if(!player){

    openAuth("login");

    return;

  }


  selectedTournament =
    tournamentName;


  selectedEntryFee =
    Number(entryFee);


  document.getElementById(
    "joinTournamentName"
  ).textContent =
    tournamentName;


  document.getElementById(
    "joinEntryFee"
  ).textContent =
    formatMoney(entryFee);


  document.getElementById(
    "joinWalletBalance"
  ).textContent =
    formatMoney(player.wallet);


  const modal =
    document.getElementById("joinModal");


  if(modal){

    modal.classList.add("active");

  }

}


// ========================================
// CONFIRM TOURNAMENT JOIN
// ========================================

function confirmTournamentJoin(){

  const player =
    getPlayer();


  if(!player){

    closeJoinModal();

    openAuth("login");

    return;

  }


  const balance =
    Number(player.wallet || 0);


  if(balance < selectedEntryFee){

    alert(
      "Insufficient wallet balance. Please add demo balance first."
    );

    return;

  }


  player.wallet =
    balance - selectedEntryFee;


  if(!Array.isArray(player.transactions)){

    player.transactions = [];

  }


  if(!Array.isArray(player.tournaments)){

    player.tournaments = [];

  }


  player.transactions.unshift({

    type:"debit",

    title:
      "Tournament Entry — " +
      selectedTournament,

    amount:selectedEntryFee,

    date:
      new Date().toLocaleString()

  });


  player.tournaments.push({

    name:selectedTournament,

    entryFee:selectedEntryFee,

    joined:
      new Date().toLocaleString(),

    status:"Registered"

  });


  localStorage.setItem(
    "esportoPlayer",
    JSON.stringify(player)
  );


  closeJoinModal();

  updateWalletUI();


  alert(
    "Tournament joined successfully! 🎮🔥\n\n" +
    "Tournament: " +
    selectedTournament +
    "\nEntry: " +
    formatMoney(selectedEntryFee) +
    "\nRemaining Wallet: " +
    formatMoney(player.wallet)
  );

}


// ========================================
// CLOSE JOIN MODAL
// ========================================

function closeJoinModal(){

  const modal =
    document.getElementById("joinModal");


  if(modal){

    modal.classList.remove("active");

  }


  selectedTournament = null;

  selectedEntryFee = 0;

}


// ========================================
// TOURNAMENT REGISTRATION FORM
// ========================================

function submitForm(event){

  event.preventDefault();


  if(!isLoggedIn()){

    alert(
      "Please login to register for a tournament."
    );

    openAuth("login");

    return;

  }


  const name =
    document.getElementById("name").value.trim();


  const game =
    document.getElementById("game").value.trim();


  const contact =
    document.getElementById("contact").value.trim();


  const tournament =
    document.getElementById("tournament").value;


  alert(

`Registration information saved for demo.

Player/Team: ${name}
Game: ${game}
Contact: ${contact}
Tournament: ${tournament}

The real tournament registration system will be connected to the backend later.`

  );

}


// ========================================
// SECURITY HELPER FOR DISPLAY TEXT
// ========================================

function escapeHTML(text){

  return String(text)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}


// ========================================
// CLOSE MODALS WHEN CLICKING BACKGROUND
// ========================================

document.addEventListener(
  "click",
  function(event){

    const authModal =
      document.getElementById("authModal");

    const walletModal =
      document.getElementById("walletModal");

    const addMoneyModal =
      document.getElementById("addMoneyModal");

    const joinModal =
      document.getElementById("joinModal");


    if(
      authModal &&
      event.target === authModal
    ){

      closeAuth();

    }


    if(
      walletModal &&
      event.target === walletModal
    ){

      closeWallet();

    }


    if(
      addMoneyModal &&
      event.target === addMoneyModal
    ){

      closeAddMoney();

    }


    if(
      joinModal &&
      event.target === joinModal
    ){

      closeJoinModal();

    }

  }
);


// ========================================
// INITIALIZE WEBSITE
// ========================================

document.addEventListener(
  "DOMContentLoaded",
  function(){

    updateAuthArea();

    updateWalletUI();

  }
);
