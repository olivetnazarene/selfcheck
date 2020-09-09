/* CONSTANTS */
const protocol = window.location.protocol + "//";
const hostname = window.location.hostname;
const port = window.location.port;
const baseURL = port ? (protocol + hostname + ":"+ port) : (protocol + hostname);	
let TOUCH = false
const configure_for_touch = () => {
	$("#idinstruction").text("Please scan your ID:")
	$("#submit").remove()
	$("#logoutinstruction").text("Scan your ID again to logout")
	$("#iteminstruction").text("Please scan your next item:")
}

async function initiate() {
	getModalBox();
	
	$("#barcode").bind("keypress", function(e) {
		let code = e.keyCode || e.which;
		if(code == 13) {
			loan();
		 }
	});
	
	$("#userid").bind("keypress", function(e) {
		let code = e.keyCode || e.which;
		if(code == 13) {
			login();
		 }
	});

	const istouch = await fetch("//is-touch")
	if ("touch" in istouch) {
		TOUCH = istouch.touch
		configure_for_touch()
	}
	else {
		console.error("Failed to query `/is-touch` endpoint")
	}
}

var modal;
var span;
var user;
var sessiontimer;
var defaultTimeout = 60

function getModalBox() {
	
	// Get the modal
	modal = document.getElementById('myModal');
	$("#myModal").hide();
	
	// Get the <span> element that closes the modal
	span = document.getElementsByClassName("close")[0];

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		$("#myModal").hide();
	}

	// When the user clicks anywhere outside of the modal, close it
	/*
	window.onclick = function(event) {
	    if (event.target == modal) {
	    	$("#myModal").hide();
	    }
	}
	*/
}

function returnToBarcode() {
	$("#barcode").prop("disabled", false);
	$("#myModal").hide();
	
	$("#barcode").val("");
	$("#barcode").focus();
}


/* LOGIN */

function login() {
    let loginid = $("#userid").val();
    if ((loginid != null) && (loginid != "")) {
    	
    	$("#userid").prop("disabled", true);
    	$("#loginerror").addClass("hide");
    	
    	$("#modalheader").text("Loading data, please wait...");
        $("#myModal").show();
        $(".close").hide();
				
				// console.log(baseURL+"/users/"+loginid)
        $.ajax({
    		type: "GET",
    		url: baseURL+"/users/"+$("#userid").val(),
			contentType: "text/plain",
			dataType : "json",
			crossDomain: false
		}).done(function(data) {
			user = data;
			// console.log(JSON.stringify(user));
			// prepare scan box
			$("#scanboxtitle").text("Welcome " + data.first_name + " " + data.last_name);
			$("#userloans").text(data.loans.value);
			$("#userrequests").text(data.requests.value);
			$("#userfees").text("$" + data.fees.value);
			let timeoutspan = document.querySelector("#usertimeout");
			// console.log(timeoutspan)
			sessionTimeout(defaultTimeout, timeoutspan);
			//$("#usernotes").text(data.user_note.length);
			
		  $("#loanstable").find("tr:gt(0)").remove();
			
			$("#loginbox").addClass("hide");
			$("#scanbox").toggleClass("hide");
			
			$("#barcode").focus();

			
		}).fail(function(jqxhr, textStatus, error) {
				$("#loginerror").toggleClass("hide");
				$("#userid").val(""); //Clear userid for touchless retry
		    console.log(jqxhr.responseText);
		    
		}).always(function() {
			$("#userid").prop("disabled", false);
			$("#myModal").hide();
			focusLogin();
		});
    }
}

function loaduser(data) {
	alert(data);
}

function loan() {
	
	let barcode = $("#barcode").val();

    if ((barcode != null) && (barcode != "")) {
			if (barcode == user.user_identifier[0].value || barcode == user.primary_id){
				console.log("Re-scanned userid, logging out")
				logout();
				return 
			}
    	console.log($("#barcode").val());
    	$("#modalheader").text("Processing request, please wait...");
      $("#myModal").show();
      $(".close").hide();
			$("#barcode").prop("disabled", true);

    	$.ajax({
    		type: "POST",
				url: baseURL + "/users/" + user.primary_id + "/loans?item_barcode=" + $("#barcode").val(),
				contentType: "application/json",
				dataType: "JSON",
				data:``
    	}).done(function(data){
    		let dueDate = new Date(data.due_date);
    		let dueDateText = (parseInt(dueDate.getMonth()) + 1) + "/" + dueDate.getDate() + "/" + dueDate.getFullYear();
    		$("#loanstable").append("<tr><td>" + data.title + "</td><td>" + dueDateText + "</td></tr>");
    		
    		returnToBarcode();
    		
    	}).fail(function(jqxhr, textStatus, error) {
    		console.log(jqxhr.responseText);
    		
    		$("#modalheader").text("");
    		$("#modalheader").append("Item not available for loan.<br/><br/>Please see the circulation desk for more information.<br/><br/><input class='modalclose' type='button' value='close [6]' id='barcodeerrorbutton' onclick='javascript:returnToBarcode();'/>");
    		$("#barcodeerrorbutton").focus();
    		
    		$(".close").show();
				
    		$("#barcode").val("");
				modalTimeout();
    	}).always(function() {
    		extendTimeout();
    	});
    	
    }
} 

function modalTimeout(){
	let timer = 5
	let timeout = setInterval(function(){
		let seconds = parseInt(timer % 60, 10)
		$("#barcodeerrorbutton").val(`close [${timer}]`)

		if(--timer < 0){
			// $(".close").hide()
			$("#myModal").hide();
			returnToBarcode();
			clearInterval(timeout);
		}
	}, 1000)
}

function sessionTimeout(duration, display){
	sessiontimer = duration;
	let timeout = setInterval(function(){
		let minutes = parseInt(sessiontimer / 60, 10)
		let seconds = parseInt(sessiontimer % 60, 10)

		minutes = minutes < 10 ? "0" + minutes : minutes 
		seconds = seconds < 10 ? "0" + seconds : seconds 
		
		if(sessiontimer == null){
			clearInterval(timeout)
		}

		if (sessiontimer != null && --sessiontimer < 0){
			// sessiontimer = duration;
			console.log("sessiontimer is below zero, calling logout and clearInterval");
			logout();
			clearInterval(timeout);
		}
		
		if (sessiontimer >= 0){
			// console.log(sessiontimer)
			display.textContent = minutes + ":" + seconds;
		}
		
	}, 1000)
}
function extendTimeout(){
	sessiontimer = defaultTimeout
}

function logout() {
	sessiontimer = null;
	user = {};
	$("#scanboxtitle").text("");
	$("#userloans").text("");
	$("#userrequests").text("");
	$("#userfees").text("");
	$("#userid").val("");
	$("#loginbox").toggleClass("hide");
	$("#scanbox").toggleClass("hide");
	$("#userid").focus();
	$("#barcode").val("");
}

$( document ).ready(function() {
	  focusLogin();
	});

function focusLogin(){
	$(document).ready(function(){
	$( "#userid" ).focus();
	})
}
