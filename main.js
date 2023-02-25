// Variables
const leftDoor = document.querySelector('.left-door');
const rightDoor = document.querySelector('.right-door');
var floors = [], rawFloors = [], start = true, opened = false, closeTimeout, elevatorTime, running;
function equal(a, b){return a.join() == b.join()}
function openElevator() {
	clearTimeout(closeTimeout);
	if (!running){
		opened = true;
		leftDoor.style.transform = 'translateX(-14px)';
		rightDoor.style.transform = 'translateX(14px)';
		closeTimeout = setTimeout(closeElevator, 3500);
	};
	updateData();
}
function closeElevator(){
	clearTimeout(closeTimeout);
	leftDoor.style.transform = 'translateX(0)';
	rightDoor.style.transform = 'translateX(0)';
	setTimeout(()=>{
		opened=false;
		elevatorMove((+document.getElementById("floor").textContent > floors[0]) ? -1:1);
	}, 1000);
	updateData();
}
function floorUpdate(){
	let floor = +this.innerHTML;
	let dir = (+document.getElementById("floor").textContent > floors[0]) ? -1:1
	if (floors.includes(floor)){
		rawFloors.splice(rawFloors.indexOf(floor), 1);
		floors.splice(floors.indexOf(floor), 1);
		this.classList.remove('active');
	}else{
		rawFloors.push(floor);
		floors.push(floor);
		this.classList.add('active');
	}
	floors = floors.sort((a, b) => (dir==1) ? a-b : b-a);
	updateData();
	easterEggs();
	if (!running) elevatorMove(dir);
}
function updateData(){
	if (window.screen.width <= 600){
		document.getElementById('nextFloorMobile').textContent = (floors.length > 0) ? floors[0]:'-';
		document.getElementById('routeMobile').textContent = (floors.length > 0) ? floors.join(', '):'-';
	}else{
		document.getElementById('nextFloor').textContent = (floors.length > 0) ? floors[0]:'-';
		document.getElementById('route').textContent = (floors.length > 0) ? floors.join(', '):'-';
	}
}
function elevatorMove(incr=1){
	if (floors[0] == +document.getElementById("floor").textContent){
		openElevator();
		document.getElementById(+document.getElementById("floor").textContent).classList.remove('active');
		floors.splice(floors.indexOf(floor), 1);
		running = true;
	}else if (floors.length > 0 && start && !opened){
		running = false;
		updateData();
		var floor = document.getElementById("floor");
		floor.animate([{transform: `translateY(${(incr == 1) ? '':'-'}3.8px)`}], {duration:1000, fill:'forwards'}).addEventListener("finish", () => {
			floor.textContent = parseInt(floor.textContent)+incr;
			floor.setAttribute('x', (+floor.textContent >= 10) ? '30':'31');
			floor.animate([{transform: `translateY(${(incr == 1) ? '-':''}3.8px)`},{transform: 'translateY(0)'}], {duration:1000, fill:'forwards'});
			nextFloor();
		})
		running = true;
	}
}
function nextFloor(){
	var cur = parseInt(document.getElementById("floor").textContent);
	if (!start || cur == floors[0]){
		if (start){
			floors.splice(0, 1);
			setTimeout(()=>{
				opened = true;
				running = false;
				openElevator();
				updateData();
				document.getElementById(cur).classList.remove('active');
			}, 1500);
		}
	}
	else{
		running = false;
		clearTimeout(elevatorTime);
		elevatorMove((cur > floors[0]) ? -1:1);
	}
}
function toggleLift(s){
	if (s.textContent == 'Start'){
		start = true;
		elevatorMove((parseInt(document.getElementById("floor").textContent) > floors[0]) ? -1:1);
		s.textContent = 'Stop';
		s.classList.add('stop');
		// nextFloor();
	}
	else{
		start = false;
		s.textContent = 'Start';
		s.classList.remove('stop');
	}
}
function easterEggs(){
	if (equal(rawFloors, [0])){
		// stuck at the start
	}else if (equal(rawFloors, [12]) && document.getElementById("floor").textContent == '0'){
		// aim for the stars
	}else if (equal(rawFloors, [6,9])){
		// sus
	}else if (equal(rawFloors, [4,2,0])){
		// drugist
	}else if (equal(rawFloors, [1,5])){
		// dev's favorite
	}else if (equal(rawFloors, [2,7,1,8])){
		// Euler's Number
	}else if (equal(rawFloors, [3,1,4])){
		// pi
	}
}
function tempDisable(elm){
  if (elm.classList.contains('floor')){
    var tempAttr = elm.getAttribute("onclick");
    elm.setAttribute("onclick","");
    setTimeout(() => {elm.setAttribute("onclick", tempAttr)}, 500);
  }else{
    elm.disabled = true
    setTimeout(() => {elm.disabled = false}, 5000);
  }
}
document.querySelectorAll('.floor:not([liftToggler])').forEach(floor => floor.addEventListener("click", floorUpdate))
document.querySelectorAll('.floor').forEach(btn => btn.addEventListener('click', ()=>{tempDisable(btn)}))
// Check for switches in lift
// Lift should not open when running