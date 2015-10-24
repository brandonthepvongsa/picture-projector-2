/*
 * name: main.js
 * Authors: Tanner Garrett, Brandon Thepvongsa
 * Discription: JavaScript used to create the functionality of FolderDocs
*/

$(document).ready(function() {
	$("#dboxButton").on("click", connectDropbox);
	$(".association").click(function(){
	 //  // Holds the product ID of the clicked element
	 //  var productId = $(this).attr('class').replace('addproduct ', '');
		// addToCart(productId);
		alert('sup bro');
	});
	if(getClient()) {
		$(".jumbotron").hide();
	}
});

var
	im,
	associations,
	dropboxClientCredentials,
	dropboxClient;

dropboxClientCredentials = {
	key: config.key,
	secret: config.secret
};

dropboxClient = new Dropbox.Client(dropboxClientCredentials);

dropboxClient.authDriver(new Dropbox.AuthDriver.Redirect({
	rememberUser: true
}));

var authenticatedClient = null;

function getClient() {
	return authenticatedClient;
}

// Constructs the root ItemMirror object from the root of the Dropbox.
function constructIMObject() {
	dropboxXooMLUtility = {
		fragmentURI: '/XooML2.xml',
		driverURI: 'DropboxXooMLUtility',
		dropboxClient: dropboxClient
	};
	dropboxItemUtility = {
		driverURI: 'DropboxItemUtility',
		dropboxClient: dropboxClient
	};
	mirrorSyncUtility = {
		utilityURI: 'MirrorSyncUtility'
	};
	var options = {
		groupingItemURI: "/",
		xooMLDriver: dropboxXooMLUtility,
		itemDriver: dropboxItemUtility,
		syncDriver: mirrorSyncUtility
	};
	im = new ItemMirror(options, function(error, newMirror) {
		if(error) {
			console.log(error);
		} else {
			im = newMirror
			console.log(im);
			refreshIMDisplay();
		}
	});
}

// Directs the client to Dropbox's authentication page to sign in.
function connectDropbox() {
	if(authenticatedClient) {
		console.log('Dropbox authenticated');
	} else {
		console.log('Dropbox authenticating...');
		dropboxClient.authenticate(function (error, client) {
			if(error) {
				console.log('Dropbox failed to authenticate');
			} else {
				authenticatedClient = client;
				console.log('Dropbox authenticated');
				constructIMObject();
			}
		});
	}
}

// Signs current client out of Dropbox
function disconnectDropbox() {
	dropboxClient.signOut();
}

// Deletes all elements in the display, then populates the list with paragraphs for each
// association (WiP).
function refreshIMDisplay() {
	var entryDisplayName;
	$("#display").empty();

	associations = im.listAssociations();
	var length = associations.length;

	for(var i = 0; i < length; i++) {
		$("#display").append(associationMarkup(associations[i]));
	}

	// Create the click event handlers
	$(".association").click(function(){
		var guid = $(this).attr('data-guid');
	 //  // Holds the product ID of the clicked element
	 //  var productId = $(this).attr('class').replace('addproduct ', '');
		// addToCart(productId);
		navigateMirror(guid);
	});
}

// Attempts to navigate and display a new itemMirror association
function navigateMirror(guid) {
	im.createItemMirrorForAssociatedGroupingItem(guid, function(error, newMirror) {
		console.log(error);

		if(!error) {
			im = newMirror;
			refreshIMDisplay();
		}
	});
	
}

function navigatePrevious() {
	var parent = im.getCreator();

	if(parent) {
		im = parent;
		refreshIMDisplay();
	}
}


function shout() {
	alert('syo');
}

function associationMarkup(guid) {
	var displayText = im.getAssociationDisplayText(guid);
	var functionCall = "navigateMirror(" + guid + ")";
	return "<div class='row'>" +
	"<div class='col-md-11'><p>" + displayText + "</p></div>" + 
	"<div class='col-md-1'><span data-guid='" + guid + "' class='association glyphicon glyphicon-folder-open'></span></div>";
}