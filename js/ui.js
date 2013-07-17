// BaseObject
// It is the base object derived by other objects below it
BaseObject = function() {
  this.element = $("");
}

BaseObject.prototype = {
  // Onclick handler
  click: function(cb) {
    // Just call the click method from jQuery
    this.element.click(cb);
  }
}

// Launcher menu object
// it is the launcher menu on the left of the screen
// invoked by the "launcher" button
LauncherMenu = function() {
  this.element = $("#menu");
}

LauncherMenu.prototype = new BaseObject();

// Hides the menu
LauncherMenu.prototype.hideMenu = function() {
  // Hiding means applying the menu-invisible class to the menu element
  this.element.addClass("menu-invisible");
}
// Shows the menu
LauncherMenu.prototype.showMenu = function() {
  //  Showing means removing the menu-invisible class from the element
  this.element.removeClass("menu-invisible");
}
// Checks whether the menu is currently open or not
LauncherMenu.prototype.isOpen = function() {
  // The menu is open when it does not have the menu-invisible class
  return !this.element.hasClass("menu-invisible");
}
// Tries to hide the menu if it is open
LauncherMenu.prototype.tryHide = function() {
  if (this.isOpen()) {
    // Only close the menu when it is open
    this.hideMenu();
  }
}

// DesktopArea object
// It is the big desktop area filling up the screen
DesktopArea = function() {
  this.element = $("#desktop");
}

DesktopArea.prototype = new BaseObject();

// LauncherButton object
// It is the small button on the top left of the screen
LauncherButton = function() {
  this.element = $("#launcher");
}

LauncherButton.prototype = new BaseObject();

// LaunchedApps object
// It is the long bar on the top left most of the screen,
// It contains the icons of the currently running applications
LaunchedApps = function () {
  this.element = $("#launched-apps");
}

LaunchedApps.prototype = new BaseObject();

// TrayArea object
// It is the long bar on the top right most of the screen
// It contains placeholder for applications tray icons
TrayArea = function() {
  this.element = $("#tray");
}

TrayArea.prototype = new BaseObject();

// DesktopMenuButton object
// It is the button on the top rigt of the screen
// It is for displaying the desktop menu
DesktopMenuButton = function() {
  this.element = $("#desktop-button");
}

DesktopMenuButton.prototype = new BaseObject();

// DesktopMenu object
// It is the menu on the right of the screen
// It contains favorites and workspace selector
// invoked by the "desktop-button" button
DesktopMenu = function() {
  this.element = $("#desktop-menu");
}

DesktopMenu.prototype = new BaseObject();

// Hides the menu
DesktopMenu.prototype.hideMenu = function() {
  // Hiding means applying the menu-invisible class to the menu element
  this.element.addClass("desktop-menu-invisible");
}
// Shows the menu
DesktopMenu.prototype.showMenu = function() {
  //  Showing means removing the menu-invisible class from the element
  this.element.removeClass("desktop-menu-invisible");
}
// Checks whether the menu is currently open or not
DesktopMenu.prototype.isOpen = function() {
  // The menu is open when it does not have the menu-invisible class
  return !this.element.hasClass("desktop-menu-invisible");
}
// Tries to hide the menu if it is open
DesktopMenu.prototype.tryHide = function() {
  if (this.isOpen()) {
    // Only close the menu when it is open
    this.hideMenu();
  }
}

// Dimmer object
// It is the big object covering everything but underneath the menus
Dimmer = function() {
  this.element = $("#dimmer");
}

Dimmer.prototype = new BaseObject();

// Hides the menu
Dimmer.prototype.hide = function() {
  var self = this;
  // Hiding means applying the dimmer-out and eventually removing the dimmer-fade from the menu element
  self.element.off("webkitTransitionEnd");
  // Do the removal after the animation ends
  self.element.on("webkitTransitionEnd", function(event) {
    self.element.removeClass("dimmer-fade");
    // Hide the element
    self.element.css("display", "none");
    // Detach the event handler
    self.element.off("webkitTransitionEnd");
  });
  // Start the animation
  self.element.addClass("dimmer-out");
}
// Shows the menu
Dimmer.prototype.show = function() {
  var self = this;
  // show the element first
  self.element.css("display", "inherit");
  //  Showing means removing the dimmer-out and  adding dimmer-fade class from the element
  setTimeout(function() {
    self.element.removeClass("dimmer-out");
    self.element.addClass("dimmer-fade");
  }, 0); // invoke with setTimeout to get the element shown first
}
// Checks whether the dimmer is currently open or not
Dimmer.prototype.isOpen = function() {
  // The dimmer is open when it does not have the dimmer-out class
  return !this.element.hasClass("dimmer-out");
}
// Tries to hide the menu if it is open
Dimmer.prototype.tryHide = function() {
  if (this.isOpen()) {
    // Only close the menu when it is open
    this.hide();
  }
}

// Clock object
// This is the clock object on the right bottom of the screen
Clock = function() {
  this.element = $("#clock");
  this.update();
}

Clock.prototype = new BaseObject();

Clock.prototype.update = function() {
  var self = this;
  var now = new Date();

  // TODO: i18n
  $("#clock-time").text(moment(now).format("HH:mm"));
  $("#clock-date").text(moment(now).format("dddd, DD MMMM YYYY"));
  setTimeout(function() {
    self.update();
  }, 1000);
}

// The actual instances
var launcherMenu, 
    desktopArea, 
    launcherButton, 
    launchedApps,
    trayArea,
    desktopMenu,
    dimmer,
    clock;

// Setup events
var setupEvents = function() {
  // Shows menu when the launcherButton is clicked
  launcherButton.click(function() {
    launcherMenu.showMenu();
    dimmer.show();
    // try to hide the desktop menu
    desktopMenu.tryHide()
  });

  dimmer.click(function() {
    launcherMenu.tryHide()
    desktopMenu.tryHide()
    dimmer.tryHide();
  });

  // Shows menu when the launcherButton is clicked
  desktopMenuButton.click(function() {
    desktopMenu.showMenu();
    // try to hide the launcher menu
    launcherMenu.tryHide()
    dimmer.show();
  });
}

$(document).ready(function() {
  launcherMenu = new LauncherMenu();
  desktopArea = new DesktopArea();
  launcherButton = new LauncherButton();
  launchedApps = new LaunchedApps();
  desktopMenu = new DesktopMenu();
  trayArea = new TrayArea();
  desktopMenuButton = new DesktopMenuButton();
  dimmer = new Dimmer();
  clock = new Clock();

  setupEvents();
});
