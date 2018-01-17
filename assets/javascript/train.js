// Initialize Firebase
var config = {
  apiKey: "AIzaSyASvcCknD7zH5QOYmg4P50fjuGFo6yaFVU",
  authDomain: "train-time-c9124.firebaseapp.com",
  databaseURL: "https://train-time-c9124.firebaseio.com",
  projectId: "train-time-c9124",
  storageBucket: "train-time-c9124.appspot.com",
  messagingSenderId: "51317780046"
};

firebase.initializeApp(config);

var database = firebase.database();

//Add user input to the table
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainTime = moment($("#time-input").val().trim(), "HH:mm").format("X");
  var trainFrequency = $("#frequency-input").val().trim();

  //Object to hold train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    time: trainTime,
    frequency: trainFrequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Clears text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
});

//Create Firebase event to add train to database and add a row in html
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().time;
  var trainFrequency = childSnapshot.val().frequency;

  // Prettify the train time
  var trainTimePretty = moment.unix(trainTime).format("hh:mm");
  console.log(trainTimePretty);

  // //Calculations
  var trainTimeConverted = moment(trainTimePretty, "hh:mm").subtract(1, "years");
  console.log("converted time:" + trainTimeConverted);

  var currentTime = moment();
  var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
  var tRemainder = diffTime % trainFrequency;

  var minutesAway = trainFrequency - tRemainder;
  var nextArrival = moment().add(minutesAway, "minutes");

  //Prettify the arrival time
  var nextArrivalPretty = moment.unix(nextArrival).format("hh:mm");

// Add each train's data into the table
$("#employee-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination 
  + "</td><td>" + trainFrequency + "</td><td>" + nextArrivalPretty + "</td><td>" + minutesAway + "</td><td>");

});