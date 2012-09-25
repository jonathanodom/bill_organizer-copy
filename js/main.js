//Jonathan Odom
//Gold app 1.0
//js file  

window.addEventListener("DOMContentLoaded", function() {
	var el = function(x) {
		var element = document.getElementById(x);
		return element;
	};
	
	//get thumbnail image for the category
	var getImage = function(mkSubList,catName) {
		var imageLi = document.createElement('div');
		mkSubList.appendChild(imageLi);
		var newImage = document.createElement('img');
		var setSrc = newImage.setAttribute("src", "images/"+ catName +".png");
		imageLi.appendChild(newImage);
	};

	//function to make the selections in the drop down menu	
	var makeCats = function() {
		var formTag = document.getElementsByTagName("form"),
			selectLi = el('select'),
			mkSelect = document.createElement('select');
			mkSelect.setAttribute("id", "billTypes");
			mkSelect.setAttribute("data-mini", "true");
		for(var i=0; i < billCat.length; i++){
			var mkOption = document.createElement('option');
			var optText = billCat[i];
			mkOption.setAttribute("value", optText);
			mkOption.innerHTML = optText;
			mkSelect.appendChild(mkOption);
		};
		selectLi.appendChild(mkSelect);
	};

	//get the radio button values
	var getRadio = function() {
		var radios = document.forms[2].priority;
		for(var i=0; i<radios.length; i++){
			if(radios[i].checked){
			priorityValue = radios[i].value;
			};
		};
	};

	/*	//function to turn on and off links that shouldn't show
		var toggleControls = function(n) {
		switch(n){
			case "on":
				el("billForm").style.display = "none";
				el("clearData").style.display = "inline";
				el("displayLink").style.display = "none";
				el("addNew").style.display = "inline";
				break;
			case "off":
				el("billForm").style.display = "Block";
				el("clearData").style.display = "inline";
				el("displayLink").style.display = "inline";
				el("addNew").style.display = "none";
				el("items").style.display = "none";
				break;
			default:
				return false;
		};
	};*/

	//function to save the data
	var storeData = function(key) {
		if(!key){
			var id 				= "bill_organizer#" + Math.floor(Math.random()*1000001);

		}else{
			id = key;
		};	
		getRadio();
		var item 			= {};
			item.billName	= ["Bill Name:", el('bname').value];
			item.billType	= ["Bill Type:", el('billTypes').value];
			item.duedate	= ["Due Date:", el('datepicker').value];
			item.reminder	= ["Reminder:", el('reminder').value];
			item.priority	= ["Priority:", priorityValue ];
			item.amount		= ["Amount: $", el('amount').value];
			item.paid		= ["Paid:"	, el('flip-2').value];
			item.notes		= ["Notes:", el('notes').value];

		localStorage.setItem(id, JSON.stringify(item));
		alert("Bill Saved!");
		window.location.reload("home");
	};

	//function to display saved data in form view
	var getData = function() {
		// toggleControls("on");
		if(localStorage.length === 0) {
			alert("Nothing Saved to Storage, Test Data was submited!");
			autoFill();
			createListForm("viewIn");
		} else{
			for(var i = 0, length = localStorage.length; i<length; i++){
				var re = /^bill_organizer#/g;
				if(re.test(localStorage.key(i))){
					// alert("alert test! saved data already exists");
					if(el('items1')){
						// alert("Something went wrong!");
						break
					}else{
						alert("loading list");
						createListForm("viewIn");
						break
					};
				}else {
					// alert("alert test! loading test data")
					alert("Nothing Saved to Storage, Test Data was submited!");
					autoFill();
					createListForm("viewIn");
					break
				};
			};
		};
		
	};
	var createListForm = function(data){
		var mkList = document.createElement('div');
		// mkList.setAttribute('class','itemlist');
		mkList.setAttribute('id','items1');
		document.getElementById(data).appendChild(mkList);
		for(var i = 0, len = localStorage.length; i<len; i++) {
			var re = /^bill_organizer#/g;
			if (re.test(localStorage.key(i))){
				var mkLi = document.createElement('li');
				var linksLi = document.createElement('div');
				mkList.appendChild(mkLi); 
				var keys = localStorage.key(i);
				var value = localStorage.getItem(keys);
				var object = JSON.parse(value);
				var mkSubList = document.createElement('div');
				mkLi.appendChild(mkSubList);
				getImage(mkSubList,object.billType[1]);
				for(var n in object){
					var mkSubLi = document.createElement('div');
					mkSubList.appendChild(mkSubLi);
					var optSubText = object[n][0] + " " + object[n][1];
					mkSubLi.innerHTML = optSubText;
					mkSubList.appendChild(linksLi);
				};
				mkItemLinks(keys, linksLi);
			};
			
		};
	};

	//make Item Links
	var mkItemLinks = function(key, linksLi) {
		var editLink = document.createElement('a');
		editLink.href = "#additemPage";
		editLink.key = key;
		var editText = "Edit Bill";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML = editText;
		linksLi.appendChild(editLink);
		
		// var breakTag = document.createElement('br');
		// linksLi.appendChild(breakTag);


		var deleteLink = document.createElement('a');
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText = "Delete Bill";
		deleteLink.addEventListener("click", deleteItem);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink);
	};
	//edit each item link
	var editItem = function() {
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);

		// toggleControls("off");

		el('bname').value = item.billName[1];
		el('billTypes').value = item.billType[1];
		el('datepicker').value = item.duedate[1];
		el('reminder').value = item.reminder[1];

		var radios = document.forms[2].priority
		for(var i = 0; i < radios.length; i++) {
			if(radios[i].value =='High' && item.priority[1] =='High'){
				radios[i].setAttribute("checked", "checked");
			}else if(radios[i].value == "Medium" && item.priority[1] =='Medium') {
				radios[i].setAttribute("checked","checked");
			}else if(radios[i].value == "Low" && item.priority[1] =='Low'){
				radios[i].setAttribute("checked","checked");
			};
		};

		el('amount').value = item.amount[1];
		el('flip-2').value = item.paid[1];
		el('notes').value = item.notes[1];

		//remove the initial listener from the input save bill button
		saveData.removeEventListener("click", storeData);

		el('submit').value = "CHANGE!";
		var editSubmit = el('submit');
		editSubmit.addEventListener("click", validate);
		editSubmit.key = this.key;
	};
	//delete each item link
	var deleteItem = function() {
		var ask = confirm("Are you sure you want this bill deleted forever?");
		if(ask){
			localStorage.removeItem(this.key);
			alert("Bill Is Now Lost Forever!");
			window.location.reload();
		} else{
			alert("Bill was not deleted!");
		};
	};

	//validate required fields and submit form
	var validate = function(e) {
		
		//define the elements we need to check
		var getName = el('bname'),
			getTypes = el('billTypes'),
			getDate = el('datepicker')
		;

		errMsg.innerHTML = "";
		getName.style.border = "1px solid black";
		getName.style.border = "1px solid black";


		var errors = [];

		if(getName.value === ""){
			var bnameError = "Please Enter The Name Of The Bill!";
			getName.style.border = "1px solid red";
			errors.push(bnameError);
		};

		if(getTypes.value === "--Choose a Bill Type--"){
			var TypesError = "Please choose a Bill Type!";
			errors.push(TypesError);
		};

		if(getDate.value === ""){
			var dateError = "Please Enter a Due Date!";
			getDate.style.border = "1px solid red";
			errors.push(dateError);
		}
		//if there are errors display on screen
		if(errors.length >= 1) {
			for(var i = 0; i< errors.length; i++){
				var txt = document.createElement('li');
				txt.innerHTML = errors[i];
				errMsg.appendChild(txt);
			};
			e.preventDefault();
			return false;
		}else{
			storeData(this.key);
		};	
	};

	//populate test data
	var autoFill = function() {
		for(var n in json){
			var id = "bill_organizer#" + Math.floor(Math.random()*1000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	};


	//function to clear local storage
	var clearStored = function() {
		if(localStorage.length === 0){
			alert("Nothing Saved in Storage");
		}else{
			localStorage.clear();
			alert("All Bills Cleared!");
			window.location.reload();
			return false;
		};
	};
	//function to display saved data in acordion view
	var getData2 = function() {
		// toggleControls("on");
		if(localStorage.length === 0) {
			alert("Nothing Saved to Storage, Test Data was submited!");
			autoFill();
			createList2("view","Nope");
			// viewBills.removeEventListener('click', getData2);
		} else{
			for(var i = 0, length = localStorage.length; i<length; i++){
				var re = /^bill_organizer#/g;
				var	paid = el('flip-2').value;
				if(re.test(localStorage.key(i)) && paid === "Nope"){
					// alert("alert test! saved data already exists");
					// window.location.reload();
					viewBills.removeEventListener('click', getData2);
					if(el('items2')){
						// alert("Something went wrong!");
						viewBills.removeEventListener('click', getData2);
						break
					}else{
						alert("loading list");
						createList2("view","Nope");
						break
					};
				}else {
					// alert("alert test! loading test data")
					alert("Nothing Saved to Storage, Test Data was submited!");
					autoFill();
					createList2("view","Nope");
					break
				};
			};
		};
	};
	//function to display saved data in acordion history view
	var getData3 = function() {
		// toggleControls("on");
		if(localStorage.length === 0) {
			alert("Nothing Saved to Storage, Test Data was submited!");
			autoFill();
			createList("viewPaid","Yep");
			// viewPaid.removeEventListener('click', getData3);
		} else{
			for(var i = 0, length = localStorage.length; i<length; i++){
				var re = /^bill_organizer#/g;
				if(re.test(localStorage.key(i))){
					// alert("alert test! saved data already exists");
					// window.location.reload();
					viewPaid.removeEventListener('click', getData3);
					if(el('itemsHistory')){
						// alert("Something went wrong!");
						// createList("viewPaid","Yep");
						viewPaid.removeEventListener('click', getData3);
						break
					}else{
						alert("loading list");
						createList("viewPaid","Yep");
						viewPaid.removeEventListener('click', getData3);
						break
					};
				}else {
					// alert("alert test! loading test data")
					alert("Nothing Saved to Storage, Test Data was submited!");
					autoFill();
					createList("viewPaid","Yep");
					break
				};
			};
		};
	};
	//function to create list in history
	var createList = function(data,pay){
		var mkList = document.createElement('div');
		mkList.setAttribute('class','itemlist');
		mkList.setAttribute('id','itemsHistory');
		document.getElementById(data).appendChild(mkList);
		for(var i = 0, len = localStorage.length; i<len; i++) {
			var re = /^bill_organizer#/g;
			if (re.test(localStorage.key(i))){
				var mkLi = document.createElement('li');
				var linksLi = document.createElement('div');
				mkList.appendChild(mkLi); 
				var keys = localStorage.key(i);
				var value = localStorage.getItem(keys);
				var object = JSON.parse(value);
				var mkSubList = document.createElement('div');
				mkLi.appendChild(mkSubList);
				// getImage(mkSubList,object.billType[1]);
				// isPaid(object);
				if(object.paid[1]===pay){
					getImage(mkSubList,object.billType[1]);
					for(var n in object){
						var mkSubLi = document.createElement('div');
						mkSubList.appendChild(mkSubLi);
						var optSubText = object[n][0] + " " + object[n][1];
						mkSubLi.innerHTML = optSubText;
						mkSubList.appendChild(linksLi);
					};
					mkItemLinks(keys, linksLi);
				};
			};
			
		};
	};

	//function to create list items in accordion
	var createList2 = function(data,pay){
		var mkList = document.createElement('div');
		mkList.setAttribute('class','itemlist');
		mkList.setAttribute('id','items2');
		document.getElementById(data).appendChild(mkList);
		for(var i = 0, len = localStorage.length; i<len; i++) {
			var re = /^bill_organizer#/g;
			if (re.test(localStorage.key(i))){
				var mkLi = document.createElement('li');
				var linksLi = document.createElement('div');
				mkList.appendChild(mkLi); 
				var keys = localStorage.key(i);
				var value = localStorage.getItem(keys);
				var object = JSON.parse(value);
				var mkSubList = document.createElement('div');
				mkLi.appendChild(mkSubList);
				// getImage(mkSubList,object.billType[1]);
				// isPaid(object);
				if(object.paid[1]===pay){
					getImage(mkSubList,object.billType[1]);
					for(var n in object){
						var mkSubLi = document.createElement('div');
						mkSubList.appendChild(mkSubLi);
						var optSubText = object[n][0] + " " + object[n][1];
						mkSubLi.innerHTML = optSubText;
						mkSubList.appendChild(linksLi);
					};
					mkItemLinks(keys, linksLi);
				};
			};
			
		};
	};




	//variables
	var priorityValue,
		billCat = ["--Choose a Bill Type--","Auto","Credit Cards","Entertainment","Home","Loans", "Misc","Phone","Uncategorized","Utilities"],
		errMsg = el('errors')
	;
	makeCats();

	//click events
	var displayLink = el('displayLinkForm');
	displayLink.addEventListener('click', getData);
	var clearData = el('clearData');
	clearData.addEventListener('click', clearStored);
	var saveData = el("submit");
	saveData.addEventListener('click', validate);
	var viewBills = el('displayLinkPaid');
	viewBills.addEventListener('click', getData2);
	var clearData2 = el('clearData2');
	clearData2.addEventListener('click', clearStored);
	var viewpaid = el('displayLinkHistory');
	viewpaid.addEventListener('click', getData3);

	//jqeury events

	$(function() {
		$( "#accordion" ).accordion({
			active: false,
			autoHeight: false,
			navigation: true,
			collapsible: true
		});
	});
	$(function() {
		$( "#datepicker" ).datepicker({
			autoSize: true,
			showOtherMonths: true,
			selectOtherMonths: true,
			showOn: "focus",
			buttonImage: "../Gold/images/calendar.png",
			buttonImageOnly: true,
			defaultDate: +7,
			appendText: "(mm-dd-yyyy)"
		});
	});
	$(function() {
		$( "#radio" ).buttonset();
	});

	//filter search credit http://www.designchemical.com/blog/index.php/jquery/live-text-search-function-using-jquery/
	$("#filter").keyup(function(){
 
        // Retrieve the input field text and reset the count to zero
        var filter = $(this).val(), count = 0;
 
        // Loop through the comment list
        $(".itemlist li").each(function(){
 
            // If the list item does not contain the text phrase fade it out
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).fadeOut();
 
            // Show the list item if the phrase matches and increase the count by 1
            } else {
                $(this).show();
                count++;
            }
             /*// Update the count
        	var numberItems = count;
      		$("#filter-count").text("Number of bills = "+count);*/
        });
    });

  /*  $("#filter2").keyup(function(){
 
        // Retrieve the input field text and reset the count to zero
        var filter = $(this).val(), count = 0;
 
        // Loop through the comment list
        $(".items2 li").each(function(){
 
            // If the list item does not contain the text phrase fade it out
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).fadeOut();
 
            // Show the list item if the phrase matches and increase the count by 1
            } else {
                $(this).show();
                count++;
            }
             // Update the count
        	var numberItems = count;
      		$("#filter-count2").text("Number of bills = "+count);
        });
    });*/

    // $('#myPopupDiv').popup();

	
});
//function to display upcoming bill in CTA for newstream
	var getImage = function(mkSubList,catName) {
		var imageLi = document.createElement('div');
		mkSubList.appendChild(imageLi);
		var newImage = document.createElement('img');
		var setSrc = newImage.setAttribute("src", "images/"+ catName +".png");
		imageLi.appendChild(newImage);
	};


	var upcoming = function(){
		var m = new Date();
		var mkP = document.createElement('ul');
		document.getElementById('upcoming').appendChild(mkP);
		for(var i = 0, len=localStorage.length; i<len; i++){
			var re= /^bill_organizer#/g;
			if(re.test(localStorage.key(i))){
				var keys = localStorage.key(i);
				var value = localStorage.getItem(keys);
				var object = JSON.parse(value);
				var due = new Date(object.duedate[1]);	
				if(due < m && object.paid[1]==="Nope"){
					var mkLi = document.createElement('li');
					mkP.appendChild(mkLi);
					getImage(mkLi,object.billType[1])
					for(var n in object){	
						var mkSubLi = document.createElement('div');
						mkLi.appendChild(mkSubLi);
						var optSubText = object[n][0] + " " + object[n][1];
						mkSubLi.innerHTML = optSubText;
					};
			};
		};
	};
};
	//populate test data
	var autoFill = function() {
		json.sort();
		for(var n in json){
			var id = "bill_organizer#" + n;
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	};
if(localStorage.length === 0){
	autoFill();
	upcoming();
}else{
	for(var i = 0, length = localStorage.length; i<length; i++){
		var re = /^bill_organizer#/g;
		if(re.test(localStorage.key(i))){
			upcoming();
			break
		}else{
			autoFill();
			upcoming();
			break
		};
	};
};

