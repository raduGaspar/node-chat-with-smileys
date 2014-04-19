(function() {
    var serverHost = "http://localhost:3000", // change this to match your server
        socket = io.connect(serverHost),
        messageInput = $(".message").focus(),
        sendButton = $(".send"),
        smilie = $(".smilie"),
        history = $(".chat"),
        historyScroll = $('.panel-body'),
        templates = {
            own : $("#own-message-template").html(),
            users: $("#users-message-template").html()
        },
        name = prompt("Enter your name"),
        smiliesMap = {
            ":)" : "1",
            ":(" : "2",
            ";)" : "3",
            ":d" : "4",
            ";;)": "5",
            ":/" : "7",
            ":x" : "8",
            ":p" : "10",
            ":*" : "11",
            ":o" : "13",
            ":>" : "15",
            ":s" : "17",
            ":((": "20",
            ":))": "21",
            ":|": "22",
            ":b": "26",
            ":&": "31",
            ":$": "32",
            ":?" : "39",
            "#o": "40",
            ":ss": "42",
            "@)": "43",
            ":w": "45",
            ":c": "101",
            ":h": "103",
            ":t": "104",
            ":q": "112"
        },
        smileyReg = /[:;#@]{1,2}[\)\/\(\&\$\>\|xXbBcCdDpPoOhHsStTqQwW*?]{1,2}/g;

    function renderSmilies() {
        var $smileyGrid = $(".smiley-grid");

        // render smilies if required
        if($smileyGrid.children().length == 0) {
            var smileisPerRow = 6,
                $smileySet = $(),
                $smileyRow = $();

            for(var i in smiliesMap) {
                var kids = $smileyRow.children().length;
                if(kids%smileisPerRow == 0) {
                    $smileyRow = $("<div>").addClass("row gap-bottom text-center");
                    $smileySet = $smileySet.add($smileyRow);
                }

                var smileyCol = $("<div>").addClass("col-md-2"),
                    smileyImg = $("<img>").attr({
                        "src": "img/"+smiliesMap[i]+".gif",
                        "title": i.toString(),
                        "data-toggle": "tooltip",
                        "data-placement": "top"
                    }).addClass("smiley-hint");
                smileyCol.append(smileyImg);
                $smileyRow.append(smileyCol);
            }

            $smileyGrid.append($smileySet);
            $(".smiley-hint").on("click", function() {
                var inputText = messageInput.val();
                messageInput.val(inputText.concat($(this).attr('data-original-title')));

            }).tooltip();
        }

        // toggle smiley container hide
        $(".supported-smilies").toggleClass("hide");
    }

    if (name) {
        socket.on("message", function(data) {
            if(data.message) {
                var messageSmilies = data.message.match(smileyReg) || [];
                for(var i=0; i<messageSmilies.length; i++) {
                    var messageSmiley = messageSmilies[i],
                        messageSmileyLower = messageSmiley.toLowerCase();
                    if(smiliesMap[messageSmileyLower]) {
                        data.message = data.message.replace(messageSmiley, "<img src='img/"+smiliesMap[messageSmileyLower]+".gif' alt='smiley' />");
                    }
                }

                data.username = data.username || "Server";
                data.time = data.time || moment(new Date()).format('DD MMM YYYY, HH:mm');

                var template = $.tmpl((data.username == name ? templates.own : templates.users), data);
                history.append(template);
                historyScroll.scrollTop(historyScroll[0].scrollHeight);
            } else {
                console.log("There is a problem:", data);
            }
        });
     
        sendButton.on("click", function() {
            var text = messageInput.val();
            socket.emit("send", { message: text, username: name });
            messageInput.val("");

            return false;
        });

        smilie.on("click", function() {
            renderSmilies();
        }).tooltip();
    } else {
        messageInput.attr("disabled", "disabled");
        sendButton.attr("disabled", "disabled");
        smilie.attr("disabled", "disabled");

        alert("You can't chat without a name!");
    }
}());