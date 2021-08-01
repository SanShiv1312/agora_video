
let handleError = function(err) {
    console.log("Error: ", err);
};

let remoteContainer = document.getElementById("remote-container");

function addVideoStream(elementId) {

    let streamDiv = document.createElement("div");
    st div.reamDiv.id = elementId;
    
    streamDiv.style.transform = "rotateY(180deg)";
  
    remoteContainer.appendChild(streamDiv);
};

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


client.join("006b78dfadc51914daeb2cbebe9e4ae3818IACfJNirGSm1rFMzZ6o1K2C+awNmtQEnIbxOU6avCEsE7MKSUqwAAAAAEAD7XOPUQ6H+YAEAAQDeoP5g", "me", null, (uid) => {
    
    client.join();
}, handleError);
let localStream = AgoraRTC.createStream({
    audio: true,
    video: true,
});

client.on("stream-added", function(evt) {
    client.subscribe(evt.stream, handleError);
});

client.on("stream-subscribed", function(evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    addVideoStream(streamId);
    stream.play(streamId);
});

client.on("stream-removed", function(evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});

client.on("peer-leave", function(evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});

localStream.init(() => {

    localStream.play("me");

    client.publish(localStream, handleError);
}, handleError);


