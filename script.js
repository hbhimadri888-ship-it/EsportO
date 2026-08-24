function submitForm(e){
  e.preventDefault();

  const name = document.getElementById("name").value;
  const game = document.getElementById("game").value;
  const contact = document.getElementById("contact").value;
  const tournament = document.getElementById("tournament").value;

  const subject = encodeURIComponent("EsportO Tournament Registration");
  const body = encodeURIComponent(
    `Player/Team: ${name}
Game: ${game}
Contact: ${contact}
Tournament: ${tournament}`
  );

  window.location.href =
    `mailto:your-email@example.com?subject=${subject}&body=${body}`;
}
