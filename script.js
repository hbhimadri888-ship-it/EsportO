// ================================
// ESPORTO PLAYER ACCOUNT SYSTEM
// ================================

function openAuth(type){
  const modal = document.getElementById("authModal");

  if(!modal) return;

  modal.classList.add("active");

  if(type === "signup"){
    showSignup();
  }else{
    showLogin();
  }
}

function closeAuth(){
  const modal = document.getElementById("authModal");

  if(modal){
    modal.classList.remove("active");
  }
}

function showSignup(){
  const loginBox = document.getElementById("loginBox");
  const signupBox = document.getElementById("signupBox");

  if(loginBox) loginBox.style.display = "none";
  if(signupBox) signupBox.style.display = "block";
}

function showLogin(){
  const loginBox = document.getElementById("loginBox");
  const signupBox = document.getElementById("signupBox");

  if(signupBox) signupBox.style.display = "none";
  if(loginBox) loginBox.style.display = "block";
}


// ================================
// CREATE PLAYER ACCOUNT
// ================================

function signupPlayer(e){
  e.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const password = document.getElementById("signupPassword").value;

  const existingPlayer = localStorage.getItem("esportoPlayer");

  if(existingPlayer){
    alert("An account already exists on this browser. Please login.");
    showLogin();
    return;
  }

  const player = {
    name: name,
    email: email,
    password: password,
    joined: new Date().toLocaleDateString()
  };

  localStorage.setItem(
    "esportoPlayer",
    JSON.stringify(player)
  );

  localStorage.setItem(
    "esportoLoggedIn",
    "true"
  );

  alert("Account created successfully! Welcome to EsportO!");

  closeAuth();
  updateAuthArea();
}


// ================================
// PLAYER LOGIN
// ================================

function loginPlayer(e){
  e.preventDefault();

  const email =
    document.getElementById("loginEmail").value
    .trim()
    .toLowerCase();

  const password =
    document.getElementById("loginPassword").value;

  const savedPlayer =
    localStorage.getItem("esportoPlayer");

  if(!savedPlayer){
    alert("No account found. Please create an account first.");
    showSignup();
    return;
  }

  const player = JSON.parse(savedPlayer);

  if(
    player.email === email &&
    player.password === password
  ){

    localStorage.setItem(
      "esportoLoggedIn",
      "true"
    );

    alert(
      "Login successful! Welcome back " +
      player.name + "!"
    );

    closeAuth();
    updateAuthArea();

  }else{

    alert("Incorrect email or password.");

  }
}


// ================================
// LOGOUT
// ================================

function logoutPlayer(){

  localStorage.removeItem(
    "esportoLoggedIn"
  );

  updateAuthArea();

  alert("You have been logged out.");
}


// ================================
// UPDATE LOGIN BUTTON
// ================================

function updateAuthArea(){

  const authArea =
    document.getElementById("authArea");

  if(!authArea) return;

  const loggedIn =
    localStorage.getItem("esportoLoggedIn");

  const savedPlayer =
    localStorage.getItem("esportoPlayer");

  if(
    loggedIn === "true" &&
    savedPlayer
  ){

    const player =
      JSON.parse(savedPlayer);

    authArea.innerHTML = `
      <div class="player-badge">
        <span class="player-name">
          👤 ${player.name}
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


// ================================
// TOURNAMENT REGISTRATION
// ================================

function submitForm(e){

  e.preventDefault();

  const name =
    document.getElementById("name").value;

  const game =
    document.getElementById("game").value;

  const contact =
    document.getElementById("contact").value;

  const tournament =
    document.getElementById("tournament").value;

  const subject =
    encodeURIComponent(
      "EsportO Tournament Registration"
    );

  const body =
    encodeURIComponent(
`Player/Team: ${name}
Game: ${game}
Contact: ${contact}
Tournament: ${tournament}`
    );

  window.location.href =
    `mailto:your-email@example.com?subject=${subject}&body=${body}`;
}


// ================================
// CLOSE POPUP OUTSIDE
// ================================

document.addEventListener(
  "click",
  function(e){

    const modal =
      document.getElementById("authModal");

    if(
      modal &&
      e.target === modal
    ){

      closeAuth();

    }

  }
);


// ================================
// START WEBSITE
// ================================

document.addEventListener(
  "DOMContentLoaded",
  function(){

    updateAuthArea();

  }
);
