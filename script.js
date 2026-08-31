/* ========================================================= ESPORTO — COMPLETE FRONTEND DEMO ========================================================= */
/* ========================================================= STORAGE ========================================================= */
const STORAGE_KEYS = { player: "esporto_player", tournaments: "esporto_tournaments", registrations: "esporto_registrations", transactions: "esporto_transactions", results: "esporto_results", admin: "esporto_admin_logged" };
/* ========================================================= STORAGE HELPERS ========================================================= */
function getData(key, fallback){
try{
const data = localStorage.getItem(key); return data ? JSON.parse(data) : fallback; 
}catch(error){
return fallback; 
}
}
function saveData(key,data){
localStorage.setItem( key, JSON.stringify(data) );
}
/* ========================================================= GLOBAL DATA ========================================================= */
let player = getData( STORAGE_KEYS.player, null );
let tournaments = getData( STORAGE_KEYS.tournaments, [] );
let registrations = getData( STORAGE_KEYS.registrations, [] );
let transactions = getData( STORAGE_KEYS.transactions, [] );
let results = getData( STORAGE_KEYS.results, [] );
let selectedTournament = null;
/* ========================================================= INITIALIZE ========================================================= */
document.addEventListener( "DOMContentLoaded", function(){
renderPlayer(); renderWallet(); renderDashboardTransactions(); renderMyTournaments(); renderHomeTournaments(); renderHomeStats(); renderHomeLeaderboard(); renderAdminData(); 
} );
/* ========================================================= AUTH ========================================================= */
function openAuth(type){
const modal = document.getElementById( "authModal" );
if(!modal) return;
modal.classList.add("active");
if(type === "signup"){
showSignup(); 
}else{
showLogin(); 
}
}
function closeAuth(){
const modal = document.getElementById( "authModal" );
if(modal){
modal.classList.remove( "active" ); 
}
}
function showLogin(){
const login = document.getElementById( "loginBox" );
const signup = document.getElementById( "signupBox" );
if(login) login.style.display = "block";
if(signup) signup.style.display = "none";
}
function showSignup(){
const login = document.getElementById( "loginBox" );
const signup = document.getElementById( "signupBox" );
if(login) login.style.display = "none";
if(signup) signup.style.display = "block";
}
/* ========================================================= SIGNUP ========================================================= */
function signupPlayer(event){
event.preventDefault();
const name = document.getElementById( "signupName" ).value.trim();
const mobile = document.getElementById( "signupMobile" ).value.trim();
const password = document.getElementById( "signupPassword" ).value;
if(!/^\d{10}$/.test(mobile)){
alert( "Please enter a valid 10 digit mobile number." ); return; 
}
if(password.length < 6){
alert( "Password must contain at least 6 characters." ); return; 
}
const existingPlayer = getData( STORAGE_KEYS.player, null );
if( existingPlayer && existingPlayer.mobile === mobile ){
alert( "An account with this mobile number already exists." ); return; 
}
player = {
id: "PLAYER-" + Date.now(), name:name, mobile:mobile, password:password, wallet:0, wins:0, tournaments:0, points:0, createdAt: new Date().toISOString() 
};
saveData( STORAGE_KEYS.player, player );
closeAuth();
renderPlayer();
renderWallet();
renderMyTournaments();
alert( "Player account created successfully!" );
}
/* ========================================================= LOGIN ========================================================= */
function loginPlayer(event){
event.preventDefault();
const mobile = document.getElementById( "loginMobile" ).value.trim();
const password = document.getElementById( "loginPassword" ).value;
const savedPlayer = getData( STORAGE_KEYS.player, null );
if(!savedPlayer){
alert( "No player account found. Please create an account first." ); return; 
}
if( savedPlayer.mobile !== mobile || savedPlayer.password !== password ){
alert( "Incorrect mobile number or password." ); return; 
}
player = savedPlayer;
closeAuth();
renderPlayer();
renderWallet();
renderMyTournaments();
renderDashboardTransactions();
alert( "Welcome back, " + player.name + "!" );
}
/* ========================================================= LOGOUT ========================================================= */
function logoutPlayer(){
player = null;
localStorage.removeItem( STORAGE_KEYS.player );
renderPlayer();
renderWallet();
renderMyTournaments();
renderDashboardTransactions();
alert( "You have been logged out." );
}
/* ========================================================= PLAYER UI ========================================================= */
function renderPlayer(){
const nameElement = document.getElementById( "dashboardPlayerName" );
const mobileElement = document.getElementById( "dashboardPlayerMobile" );
const walletElement = document.getElementById( "dashboardWallet" );
const winsElement = document.getElementById( "dashboardWins" );
const tournamentElement = document.getElementById( "dashboardTournaments" );
const pointsElement = document.getElementById( "dashboardPoints" );
const headerBalance = document.getElementById( "headerBalance" );
if(!player){
if(nameElement) nameElement.textContent = "Player"; if(mobileElement) mobileElement.textContent = "Login to view your account"; if(walletElement) walletElement.textContent = "₹0.00"; if(winsElement) winsElement.textContent = "0"; if(tournamentElement) tournamentElement.textContent = "0"; if(pointsElement) pointsElement.textContent = "0"; if(headerBalance) headerBalance.textContent = "₹0.00"; return; 
}
if(nameElement) nameElement.textContent = player.name;
if(mobileElement) mobileElement.textContent = "Mobile: " + player.mobile;
if(walletElement) walletElement.textContent = "₹" + Number( player.wallet || 0 ).toFixed(2);
if(winsElement) winsElement.textContent = player.wins || 0;
if(tournamentElement) tournamentElement.textContent = player.tournaments || 0;
if(pointsElement) pointsElement.textContent = player.points || 0;
if(headerBalance) headerBalance.textContent = "₹" + Number( player.wallet || 0 ).toFixed(2);
}
/* ========================================================= WALLET ========================================================= */
function openWallet(){
const modal = document.getElementById( "walletModal" );
if(!modal) return;
if(!player){
alert( "Please login or create a player account first." ); openAuth("login"); return; 
}
renderWallet();
modal.classList.add( "active" );
}
function closeWallet(){
const modal = document.getElementById( "walletModal" );
if(modal) modal.classList.remove( "active" );
}
/* ========================================================= ADD DEMO MONEY ========================================================= */
function openAddMoney(){
if(!player){
closeWallet(); openAuth("login"); return; 
}
const modal = document.getElementById( "addMoneyModal" );
if(modal) modal.classList.add( "active" );
}
function closeAddMoney(){
const modal = document.getElementById( "addMoneyModal" );
if(modal) modal.classList.remove( "active" );
}
function addDemoMoney(event){
event.preventDefault();
if(!player){
alert( "Please login first." ); return; 
}
const amount = Number( document.getElementById( "demoAmount" ).value );
if( !amount || amount <= 0 || amount > 10000 ){
alert( "Enter an amount between ₹1 and ₹10,000." ); return; 
}
player.wallet = Number( player.wallet || 0 ) + amount;
saveData( STORAGE_KEYS.player, player );
transactions.push({
id: "TX-" + Date.now(), playerId: player.id, type: "credit", amount: amount, description: "Demo wallet balance", date: new Date().toISOString() 
});
saveData( STORAGE_KEYS.transactions, transactions );
document.getElementById( "demoAmount" ).value = "";
closeAddMoney();
renderPlayer();
renderWallet();
renderDashboardTransactions();
alert( "Demo balance added: ₹" + amount );
}
/* ========================================================= WALLET RENDER ========================================================= */
function renderWallet(){
const balanceElement = document.getElementById( "walletBalance" );
if(!player){
if(balanceElement) balanceElement.textContent = "₹0.00"; return; 
}
if(balanceElement) balanceElement.textContent = "₹" + Number( player.wallet || 0 ).toFixed(2);
const list = document.getElementById( "transactionList" );
if(!list) return;
const playerTransactions = transactions .filter( tx => tx.playerId === player.id ) .slice() .reverse();
if( playerTransactions.length === 0 ){
list.innerHTML = ` <p class="empty-wallet"> No transactions yet. </p> `; return; 
}
list.innerHTML = playerTransactions .map(tx => {
const sign = tx.type === "credit" ? "+" : "-"; const cls = tx.type === "credit" ? "credit" : "debit"; return ` <div class="transaction-item"> <div class="transaction-info"> <strong> ${escapeHTML( tx.description )} </strong> <small> ${formatDate( tx.date )} </small> </div> <div class="transaction-amount ${cls}"> ${sign}₹${Number( tx.amount ).toFixed(2)} </div> </div> `; }) .join(""); 
}
/* ========================================================= DASHBOARD TRANSACTIONS ========================================================= */
function renderDashboardTransactions(){
const container = document.getElementById( "dashboardTransactions" );
if(!container) return;
if(!player){
container.innerHTML = ` <div class="dashboard-empty"> <div>🔐</div> <p> Login to view transactions. </p> </div> `; return; 
}
const playerTransactions = transactions .filter( tx => tx.playerId === player.id ) .slice() .reverse() .slice(0,4);
if( playerTransactions.length === 0 ){
container.innerHTML = ` <div class="dashboard-empty"> <div>💳</div> <p> No wallet transactions yet. </p> </div> `; return; 
}
container.innerHTML = ` 

${ playerTransactions .map(tx => { const sign = tx.type === "credit" ? "+" : "-"; const cls = tx.type === "credit" ? "credit" : "debit"; return ` <div class="dashboard-transaction"> <div class="dashboard-transaction-info"> <strong> ${escapeHTML( tx.description )} </strong> <small> ${formatDate( tx.date )} </small> </div> <div class="dashboard-transaction-amount ${cls}"> ${sign}₹${Number( tx.amount ).toFixed(2)} </div> </div> `; }) .join("") } </div> `; 
}
/* ========================================================= TOURNAMENT JOIN ========================================================= */
function joinTournament( tournamentId ){
if(!player){
alert( "Please login or create a player account first." ); openAuth("login"); return; 
}
const tournament = tournaments.find( item => item.id === tournamentId );
if(!tournament){
alert( "Tournament not found." ); return; 
}
if(tournament.status !== "Open"){
alert( "This tournament is closed." ); return; 
}
const registered = registrations.filter( registration => registration.tournamentId === tournament.id ).length;
if( registered >= Number(tournament.slots) ){
alert( "This tournament is full." ); return; 
}
selectedTournament = tournament;
const nameElement = document.getElementById( "joinTournamentName" );
if(nameElement) nameElement.textContent = tournament.name;
const feeElement = document.getElementById( "joinEntryFee" );
if(feeElement) feeElement.textContent = "₹" + Number( tournament.entryFee ).toFixed(2);
const balanceElement = document.getElementById( "joinWalletBalance" );
if(balanceElement) balanceElement.textContent = "₹" + Number( player.wallet || 0 ).toFixed(2);
const modal = document.getElementById( "joinModal" );
if(modal){
modal.classList.add( "active" ); 
}else{
confirmTournamentJoin(); 
}
}
/* ========================================================= CONFIRM JOIN ========================================================= */
function confirmTournamentJoin(){
if(!player){
closeJoinModal(); openAuth("login"); return; 
}
if(!selectedTournament){
alert( "Tournament information not found." ); return; 
}
const tournament = selectedTournament;
const fee = Number( tournament.entryFee );
const registered = registrations.filter( registration => registration.tournamentId === tournament.id ).length;
if( registered >= Number(tournament.slots) ){
alert( "Tournament is already full." ); closeJoinModal(); return; 
}
if( Number(player.wallet || 0) < fee ){
alert( "Insufficient demo wallet balance." ); return; 
}
const alreadyJoined = registrations.some( registration => registration.playerId === player.id && registration.tournamentId === tournament.id );
if(alreadyJoined){
alert( "You have already joined this tournament." ); closeJoinModal(); return; 
}
player.wallet = Number( player.wallet || 0 ) - fee;
player.tournaments = Number( player.tournaments || 0 ) + 1;
saveData( STORAGE_KEYS.player, player );
registrations.push({
id: "REG-" + Date.now(), playerId: player.id, playerName: player.name, mobile: player.mobile, tournamentId: tournament.id, tournament: tournament.name, game: tournament.game, entryFee: fee, status: "Registered", date: new Date().toISOString() 
});
saveData( STORAGE_KEYS.registrations, registrations );
transactions.push({
id: "TX-" + Date.now(), playerId: player.id, type: "debit", amount: fee, description: "Tournament entry — " + tournament.name, date: new Date().toISOString() 
});
saveData( STORAGE_KEYS.transactions, transactions );
closeJoinModal();
renderPlayer();
renderWallet();
renderDashboardTransactions();
renderMyTournaments();
renderHomeTournaments();
renderHomeStats();
renderAdminData();
alert( "Tournament joined successfully!" );
}
/* ========================================================= JOIN MODAL ========================================================= */
function closeJoinModal(){
const modal = document.getElementById( "joinModal" );
if(modal) modal.classList.remove( "active" );
}
/* ========================================================= HOME TOURNAMENTS ========================================================= */
function renderHomeTournaments(){
const container = document.getElementById( "homeTournamentGrid" );
if(!container) return;
if( tournaments.length === 0 ){
container.innerHTML = ` <div class="dashboard-empty"> <div>🏆</div> <p> No tournaments available yet. </p> <a href="admin.html" class="btn small" > Create Tournament </a> </div> `; renderHeroTournament(); return; 
}
const openTournaments = tournaments.filter( tournament => tournament.status === "Open" );
if( openTournaments.length === 0 ){
container.innerHTML = ` <div class="dashboard-empty"> <div>🔒</div> <p> No open tournaments right now. </p> </div> `; renderHeroTournament(); return; 
}
container.innerHTML = openTournaments .map(tournament => {
const registered = registrations.filter( registration => registration.tournamentId === tournament.id ).length; const remaining = Math.max( 0, Number(tournament.slots) - registered ); return ` <div class="card"> <span class="tag"> ${escapeHTML( tournament.game )} </span> <h3> ${escapeHTML( tournament.name )} </h3> <p> Tournament Date: ${formatDate( tournament.date )} </p> <div class="row"> <div> <b> ₹${Number( tournament.prizePool ).toFixed(0)} </b> <span> Prize </span> </div> <div> <b> ${remaining} </b> <span> Slots left </span> </div> </div> <button class="btn full" onclick="joinTournament( '${tournament.id}' )" > Join Tournament </button> </div> `; }) .join(""); 
renderHeroTournament();
}
/* ========================================================= HERO TOURNAMENT ========================================================= */
function renderHeroTournament(){
const name = document.getElementById( "heroTournamentName" );
const game = document.getElementById( "heroTournamentGame" );
const prize = document.getElementById( "heroPrize" );
const slots = document.getElementById( "heroSlots" );
if( tournaments.length === 0 ){
if(name) name.textContent = "No tournament yet"; if(game) game.textContent = "Create a tournament from Admin Dashboard."; if(prize) prize.textContent = "₹0"; if(slots) slots.textContent = "0"; return; 
}
const open = tournaments.find( tournament => tournament.status === "Open" );
if(!open){
if(name) name.textContent = "No open tournament"; if(game) game.textContent = "Check back soon."; if(prize) prize.textContent = "₹0"; if(slots) slots.textContent = "0"; return; 
}
const registered = registrations.filter( registration => registration.tournamentId === open.id ).length;
const remaining = Math.max( 0, Number(open.slots) - registered );
if(name) name.textContent = open.name;
if(game) game.textContent = open.game;
if(prize) prize.textContent = "₹" + Number( open.prizePool ).toFixed(0);
if(slots) slots.textContent = remaining;
}
/* ========================================================= HOME STATS ========================================================= */
function renderHomeStats(){
const active = document.getElementById( "activeTournamentCount" );
const registration = document.getElementById( "totalRegistrationCount" );
const games = document.getElementById( "gameCount" );
if(active){
active.textContent = tournaments.filter( tournament => tournament.status === "Open" ).length; 
}
if(registration){
registration.textContent = registrations.length; 
}
if(games){
games.textContent = "3"; 
}
}
/* ========================================================= HOME LEADERBOARD ========================================================= */
function renderHomeLeaderboard(){
const container = document.getElementById( "homeLeaderboard" );
if(!container) return;
const allPlayers = [];
const playerIds = new Set();
registrations.forEach( registration => {
if( !playerIds.has( registration.playerId ) ){ playerIds.add( registration.playerId ); allPlayers.push({ name: registration.playerName, wins:0, points:0 }); } } 
);
allPlayers.sort( (a,b) => b.points - a.points );
const top = allPlayers.slice( 0, 10 );
if(top.length === 0){
container.innerHTML = ` <div class="leaderboard-row heading"> <div>Rank</div> <div>Player / Team</div> <div>Wins</div> <div>Points</div> </div> <div class="leaderboard-row"> <div class="rank">1</div> <div>Coming Soon</div> <div>—</div> <div>—</div> </div> <div class="leaderboard-row"> <div class="rank">2</div> <div>Coming Soon</div> <div>—</div> <div>—</div> </div> <div class="leaderboard-row"> <div class="rank">3</div> <div>Coming Soon</div> <div>—</div> <div>—</div> </div> `; return; 
}
container.innerHTML = ` 

Rank

Player / Team

Wins

Points

${ top.map( (item,index) => { return ` <div class="leaderboard-row"> <div class="rank"> ${index + 1} </div> <div> ${escapeHTML( item.name )} </div> <div> ${item.wins} </div> <div> ${item.points} </div> </div> `; } ).join("") } `; 
}
/* ========================================================= ADMIN LOGIN ========================================================= */
function adminLogin(event){
event.preventDefault();
const username = document.getElementById( "adminUsername" ).value.trim();
const password = document.getElementById( "adminPassword" ).value;
if( username === "admin" && password === "esporto123" ){
localStorage.setItem( STORAGE_KEYS.admin, "true" ); const loginPanel = document.getElementById( "adminLoginPanel" ); if(loginPanel) loginPanel.style.display = "none"; renderAdminData(); alert( "Admin login successful." ); 
}else{
alert( "Invalid admin username or password." ); 
}
}
/* ========================================================= ADMIN LOGOUT ========================================================= */
function adminLogout(){
localStorage.removeItem( STORAGE_KEYS.admin );
const panel = document.getElementById( "adminPanel" );
if(panel) panel.style.display = "none";
const login = document.getElementById( "adminLoginPanel" );
if(login) login.style.display = "block";
alert( "Admin logged out." );
}
/* ========================================================= ADMIN DATA ========================================================= */
function renderAdminData(){
const panel = document.getElementById( "adminPanel" );
if(!panel) return;
const isAdmin = localStorage.getItem( STORAGE_KEYS.admin ) === "true";
if(!isAdmin){
panel.style.display = "none"; return; 
}
panel.style.display = "block";
const login = document.getElementById( "adminLoginPanel" );
if(login) login.style.display = "none";
renderAdminStats(); renderAdminTournaments(); renderAdminPlayers(); renderAdminResults(); renderAdminRegistrations();
}
/* ========================================================= CREATE TOURNAMENT ========================================================= */
function createTournament(event){
event.preventDefault();
const name = document.getElementById( "adminTournamentName" ).value.trim();
const game = document.getElementById( "adminTournamentGame" ).value.trim();
const entry = Number( document.getElementById( "adminTournamentEntry" ).value );
const prize = Number( document.getElementById( "adminTournamentPrize" ).value );
const slots = Number( document.getElementById( "adminTournamentSlots" ).value );
const date = document.getElementById( "adminTournamentDate" ).value;
if( !name || !game || entry < 0 || prize < 0 || slots < 1 || !date ){
alert( "Please fill all tournament details correctly." ); return; 
}
tournaments.push({
id: "TOUR-" + Date.now(), name:name, game:game, entryFee:entry, prizePool:prize, slots:slots, date:date, status:"Open", createdAt: new Date().toISOString() 
});
saveData( STORAGE_KEYS.tournaments, tournaments );
event.target.reset();
renderAdminData(); renderHomeTournaments(); renderHomeStats();
alert( "Tournament created successfully!" );
}
/* ========================================================= ADMIN STATS ========================================================= */
function renderAdminStats(){
const uniquePlayerIds = new Set( registrations.map( registration => registration.playerId ) );
const active = tournaments.filter( tournament => tournament.status === "Open" );
const pending = results.filter( result => result.status === "Pending Review" );
const playersElement = document.getElementById( "adminPlayers" );
const tournamentElement = document.getElementById( "adminTournaments" );
const pendingElement = document.getElementById( "adminPendingResults" );
const activeElement = document.getElementById( "adminActiveTournaments" );
if(playersElement) playersElement.textContent = uniquePlayerIds.size;
if(tournamentElement) tournamentElement.textContent = tournaments.length;
if(pendingElement) pendingElement.textContent = pending.length;
if(activeElement) activeElement.textContent = active.length;
}
/* ========================================================= ADMIN TOURNAMENTS ========================================================= */
function renderAdminTournaments(){
const container = document.getElementById( "adminTournamentList" );
if(!container) return;
if( tournaments.length === 0 ){
container.innerHTML = ` <div class="dashboard-empty"> <div>🏆</div> <p> No tournaments created yet. </p> </div> `; return; 
}
container.innerHTML = tournaments .slice() .reverse() .map(tournament => {
const registered = registrations.filter( registration => registration.tournamentId === tournament.id ).length; return ` <div class="admin-list-item"> <strong> ${escapeHTML( tournament.name )} </strong> <small> ${escapeHTML( tournament.game )} <br> Entry: ₹${Number( tournament.entryFee ).toFixed(2)} • Prize: ₹${Number( tournament.prizePool ).toFixed(2)} <br> Slots: ${registered}/${tournament.slots} <br> Date: ${formatDate( tournament.date )} </small> <span class="admin-status"> ${escapeHTML( tournament.status )} </span> <div class="admin-list-actions"> <button class="admin-action-btn" onclick="toggleTournamentStatus( '${tournament.id}' )" > ${ tournament.status === "Open" ? "Close" : "Open" } </button> <button class="admin-action-btn danger" onclick="deleteTournament( '${tournament.id}' )" > Delete </button> </div> </div> `; }) .join(""); 
}
/* ========================================================= TOURNAMENT STATUS ========================================================= */
function toggleTournamentStatus( tournamentId ){
const tournament = tournaments.find( item => item.id === tournamentId );
if(!tournament) return;
tournament.status = tournament.status === "Open" ? "Closed" : "Open";
saveData( STORAGE_KEYS.tournaments, tournaments );
renderAdminData(); renderHomeTournaments(); renderHomeStats();
}
/* ========================================================= DELETE TOURNAMENT ========================================================= */
function deleteTournament( tournamentId ){
const tournament = tournaments.find( item => item.id === tournamentId );
if(!tournament) return;
const confirmed = confirm( "Delete this tournament?" );
if(!confirmed) return;
tournaments = tournaments.filter( item => item.id !== tournamentId );
saveData( STORAGE_KEYS.tournaments, tournaments );
renderAdminData(); renderHomeTournaments(); renderHomeStats();
}
/* ========================================================= ADMIN PLAYERS ========================================================= */
function renderAdminPlayers(){
const container = document.getElementById( "adminPlayerList" );
if(!container) return;
const uniquePlayers = [];
registrations.forEach( registration => {
const exists = uniquePlayers.some( item => item.playerId === registration.playerId ); if(!exists) uniquePlayers.push( registration ); } 
);
if( uniquePlayers.length === 0 ){
container.innerHTML = ` <div class="dashboard-empty"> <div>👥</div> <p> No players registered yet. </p> </div> `; return; 
}
container.innerHTML = uniquePlayers .map(item => {
const count = registrations.filter( registration => registration.playerId === item.playerId ).length; return ` <div class="admin-list-item"> <strong> ${escapeHTML( item.playerName )} </strong> <small> Mobile: ${escapeHTML( item.mobile || "—" )} <br> Tournaments: ${count} </small> <span class="admin-status"> REGISTERED </span> </div> `; }) .join(""); 
}
/* ========================================================= ADMIN REGISTRATIONS ========================================================= */
function renderAdminRegistrations(){
const container = document.getElementById( "adminRegistrationList" );
if(!container) return;
if( registrations.length === 0 ){
container.innerHTML = ` <div class="dashboard-empty"> <div>📝</div> <p> No registrations yet. </p> </div> `; return; 
}
container.innerHTML = registrations .slice() .reverse() .map(registration => {
return ` <div class="admin-list-item"> <strong> ${escapeHTML( registration.playerName )} </strong> <small> Tournament: ${escapeHTML( registration.tournament )} <br> Game: ${escapeHTML( registration.game || "—" )} <br> Entry: ₹${Number( registration.entryFee || 0 ).toFixed(2)} <br> Date: ${formatDate( registration.date )} </small> <span class="admin-status"> ${escapeHTML( registration.status )} </span> </div> `; }) .join(""); 
}
/* ========================================================= ADMIN RESULTS ========================================================= */
function renderAdminResults(){
const container = document.getElementById( "adminResultList" );
if(!container) return;
const pending = results.filter( result => result.status === "Pending Review" );
if( pending.length === 0 ){
container.innerHTML = ` <div class="dashboard-empty"> <div>📸</div> <p> No pending results. </p> </div> `; return; 
}
container.innerHTML = pending .map(result => {
return ` <div class="admin-list-item"> <strong> ${escapeHTML( result.playerName )} </strong> <small> Tournament: ${escapeHTML( result.tournament )} <br> Submitted: ${formatDate( result.date )} </small> <span class="admin-status"> PENDING REVIEW </span> <div class="admin-list-actions"> <button class="admin-action-btn" onclick="approveResult( '${result.id}' )" > Approve </button> <button class="admin-action-btn danger" onclick="rejectResult( '${result.id}' )" > Reject </button> </div> </div> `; }) .join(""); 
}
/* ========================================================= RESULT APPROVE ========================================================= */
function approveResult(resultId){
const result = results.find( item => item.id === resultId );
if(!result) return;
result.status = "Approved";
saveData( STORAGE_KEYS.results, results );
renderAdminData();
alert( "Result approved." );
}
/* ========================================================= RESULT REJECT ========================================================= */
function rejectResult(resultId){
const result = results.find( item => item.id === resultId );
if(!result) return;
result.status = "Rejected";
saveData( STORAGE_KEYS.results, results );
renderAdminData();
alert( "Result rejected." );
}
/* ========================================================= DATE ========================================================= */
function formatDate(date){
if(!date) return "—";
const parsed = new Date(date);
if( Number.isNaN( parsed.getTime() ) ){
return "—"; 
}
return parsed.toLocaleString( "en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" } );
}
/* ========================================================= ESCAPE HTML ========================================================= */
function escapeHTML(value){
if( value === null || value === undefined ){
return ""; 
}
return String(value)
.replace( /&/g, "&amp;" ) .replace( /</g, "&lt;" ) .replace( />/g, "&gt;" ) .replace( /"/g, "&quot;" ) .replace( /'/g, "&#039;" ); 
}
/* ========================================================= BACKDROP CLICK ========================================================= */
document.addEventListener( "click", function(event){
if( event.target.classList.contains( "auth-modal" ) ){ closeAuth(); } if( event.target.classList.contains( "wallet-modal" ) ){ event.target.classList.remove( "active" ); } 
} );
/* ========================================================= ESC KEY ========================================================= */
document.addEventListener( "keydown", function(event){
if(event.key !== "Escape") return; closeAuth(); closeWallet(); closeAddMoney(); closeJoinModal(); 
} );
