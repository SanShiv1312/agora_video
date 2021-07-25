// Handle errors.
let handleError = function(err) {
    console.log("Error: ", err);
};

// Query the container to which the remote stream belong.
let remoteContainer = document.getElementById("remote-container");

// Add video streams to the container.
function addVideoStream(elementId) {
    // Creates a new div for every stream
    let streamDiv = document.createElement("div");
    // Assigns the elementId to the div.
    streamDiv.id = elementId;
    // Takes care of the lateral inversion
    streamDiv.style.transform = "rotateY(180deg)";
    // Adds the div to the container.
    remoteContainer.appendChild(streamDiv);
};

// Remove the video stream from the container.
function removeVideoStream(elementId) {
    let remoteDiv = document.getElementById(elementId);
    if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
};

let client = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8",
});

client.init("b78dfadc51914daeb2cbebe9e4ae3818", function() {
    console.log("client initialized");
}, function(err) {
    console.log("client init failed ", err);
});

// Join a channel
client.join("2MqdX72IjMDygklvphso7bSqyzda5xoi40Ho", "myChannel", null, (uid) => {
    // Create a local stream
    client.join();
}, handleError);
let localStream = AgoraRTC.createStream({
    audio: true,
    video: true,
});
// Initialize the local stream
localStream.init(() => {
    // Play the local stream
    localStream.play("me");
    // Publish the local stream
    client.publish(localStream, handleError);
}, handleError);

// Subscribe to the remote stream when it is published
client.on("stream-added", function(evt) {
    client.subscribe(evt.stream, handleError);
});
// Play the remote stream when it is subsribed
client.on("stream-subscribed", function(evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    addVideoStream(streamId);
    stream.play(streamId);
});
// Remove the corresponding view when a remote user unpublishes.
client.on("stream-removed", function(evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});
// Remove the corresponding view when a remote user leaves the channel.
client.on("peer-leave", function(evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});
//client.enableVideo();
//https://console.agora.io/invite?sign=5d00add662706fee5c9f47765d2ce6e0%3Aefd0609b9a7e83e4b3cb24268c4bd2eae32cb8c99e878b62ff2e21836130106d