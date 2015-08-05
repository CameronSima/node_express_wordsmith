function select_letter(e) {
    build_word(e)
}

function removeLetter(e) {
    var t = e.parentNode;
    t.removeChild(e)
}

function addElement(e, t, n, r, o) {
    var a = document.getElementById(e),
        l = document.createElement(t);
    l.className = n, l.id = o, l.innerHTML = r, a.appendChild(l)
}

function sortedWords() {
    var e = [];
    for (var t in Words) e.push([t, Words[t]]);
    return e.sort(function(e, t) {
        return e[1] - t[1]
    }), e
}

function buildWordContainer() {
    var e = sortedWords().reverse(),
        t = e.slice(0, 8);
    if (e.length <= 8) {
        var n = e.length - 1;
        addElement("words_list", "li", "list-group-item", "", "word-score_container" + n), addElement("word-score_container" + n, "div", "wordOrName", "", "word" + n), addElement("word-score_container" + n, "div", "number", "", "points" + n)
    }
    for (var n = 0; n < t.length; n++) word_text = t[n][0], points = t[n][1], document.getElementById("word" + n).innerHTML = word_text, document.getElementById("points" + n).innerHTML = points
}

function build_word(e) {
    var t, n = e.getAttribute("id").charAt(e.getAttribute("id").length - 1),
        r = "";
    for (prop in letterset) n == prop && (t = letterset[n]);
    addElement("word_container", "div", "word_letters", t, "word_" + n), e.style.color = "red", e.onclick = "";
    for (var o = word_container.childNodes, a = o.length - 1; a >= 0; a--) r += o[a].innerHTML || ""
}

function clearBoard(e, t) {
    for (var n = t.length - 1; n >= 0; n--) t[n].style.color = "blue", t[n].onclick = function() {
        select_letter(this)
    };
    for (var n = e.length - 1; n >= 0; n--) removeLetter(e[n])
}

function bback() {
    for (var e = document.getElementById("word_container").childNodes, t = e[e.length - 1], n = document.getElementsByClassName("letters"), r = n.length - 1; r >= 0; r--) n[r].id[7] == t.id[5] && (n[r].style.color = "blue", n[r].onclick = function() {
        select_letter(this)
    }, removeLetter(t))
}

function shuffle() {
    var e = document.getElementsByClassName("letters");
    allElems = function() {
        for (var t = [], n = e.length; n--;) t[t.length] = e[n];
        return t
    }();
    for (var t = function() {
        for (var e = allElems.length, t = []; e--;) {
            var n = Math.floor(Math.random() * allElems.length),
                r = allElems[n].cloneNode(!0);
            allElems.splice(n, 1), t[t.length] = r
        }
        return t
    }(), n = e.length; n--;) e[n].parentNode.insertBefore(t[n], e[n].nextSibling), e[n].parentNode.removeChild(e[n]);
    makeLettsClickable()
}

function timer() {
	var seconds = 120;
	var interval = setInterval(function() {
		if (window.ended == true) {
			return;
		}
		document.getElementById('timer').innerHTML = --seconds;

		if (seconds <= 0) {
			document.getElementById('timer').innerHTML = 'Game Over!';
			end_game();
			clearInterval(interval);
		}

	}, 1000);
}

function submit_word() {
    var e = [];
    for (prop in letterset) e.push(letterset[prop]);
    var t = "",
        n = document.getElementById("word_container").childNodes;
    for (var r in n) {
        var o = n[r].innerHTML;
        e.indexOf(o) > -1 && (t += o)
    }
    if (eng_dictionary[t]) {
        var a = score(t),
            l = Object.len(Words);
        Words[t] = a;
        var s = Object.len(Words);
        if (s > l) {
            {
                var i = $("#word_container").offset();
                i.left
            }
            $("#word_container").animate({
                left: "-100%"
            }, "fast"), buildWordContainer(), document.getElementById("current_score").innerHTML = get_current_score().toLocaleString()
        } else $("#word_container").effect("shake", "fast")
    } else $("#word_container").effect("shake", "fast");
    animationsTest(function() {
        clearBoard(document.getElementById("word_container").childNodes, document.getElementsByClassName("letters")), $("#word_container").css({
            left: "50%"
        })
    })
}

function animationsTest(e) {
    var t = setInterval(function() {
        $.timers.length || (clearInterval(t), e())
    }, 25)
}

function score(e) {
    for (var t = 0, n = 0; n < e.length; n++) t += values[e[n].toLowerCase()];
    var r = formulas[e.length][0],
        o = formulas[e.length][1];
    return r * t + o
}

function get_current_score() {
    var e = 0;
    sorted_words = sortedWords().reverse().slice(0, 8);
    for (var t in sorted_words) e += sorted_words[t][1];
    return e
}

function end_game() {
	var e = get_current_score();
    window.ended = true;
    $.ajax({
        type: "POST",
        url: "http://localhost:3700/",
        dataType: "json",
        async: !1,
        contentType: "application/json",
        // success: function(items){alert(items)},
        data: JSON.stringify({
            score: e,
            bonus: bonusTime(),
            time: document.getElementById("timer").innerHTML,
            name: sessionStorage.getItem("username") || "Unnamed player",
            words: sortedWords().reverse().slice(0, 8)
        })
    });
    for (var t = document.getElementsByClassName("letters"), n = t.length - 1; n >= 0; n--) t[n].onclick = "";
    bootbox.alert("<p>Congratulations!</p><p>Time bonus: " + bonusTime().toLocaleString() + "</p> You scored " + (Number(e) + bonusTime()).toLocaleString() + " points. Play again?</p>", function() {
        window.location.reload()

    })
}

function counter(e) {
    return game_score += e
}

function makeLettsClickable() {
    for (var e = document.getElementsByClassName("letters"), t = e.length - 1; t >= 0; t--) e[t].onclick = function() {
        select_letter(this)
    }
}

function start() {
    makeLettsClickable(), timer(), populate(), keyboard()
}

function populate() {
    for (var e = document.getElementsByClassName("letters"), t = e.length - 1; t >= 0; t--) e[t].innerHTML = letterset[t]
}

function keyboard() {
    $(document).keydown(function(e) {
        return 8 === e.which ? (e.preventDefault(), bback(), False) : void 0
    }), document.addEventListener("keyup", function(e) {
        var t = String.fromCharCode(e.keyCode),
            n = document.getElementsByClassName("letters");
        13 === e.keyCode && submit_word(), 190 === e.keyCode && shuffle(), 188 === e.keyCode && bback();
        for (var r = n.length - 1; r >= 0; r--)
            if ("red" != n[r].style.color && n[r].innerHTML == t) {
                window.last = n[r], build_word(n[r]);
                break
            }
    })
}

function bonusTime() {
    var e = document.getElementById("timer").innerHTML;
    return "Game Over!" == e ? 0 : e >= 100 ? 100 * e : e >= 50 ? 200 * e : e >= 25 ? 300 * e : 400 * e
}
Object.len = function(e) {
    var t, n = 0;
    for (t in e) e.hasOwnProperty(t) && n++;
    return n
};
var values = {
    a: 3,
    b: 10,
    c: 7,
    d: 9,
    e: 1,
    f: 10,
    g: 9,
    h: 9,
    i: 4,
    j: 12,
    k: 6,
    l: 2,
    m: 9,
    n: 5,
    o: 5,
    p: 9,
    q: 12,
    r: 4,
    s: 6,
    t: 5,
    u: 8,
    v: 11,
    w: 11,
    x: 12,
    y: 10,
    z: 12
}, formulas = {
        1: [1, 0],
        2: [20, 2e3],
        3: [70, 7e3],
        4: [80, 8e3],
        5: [100, 1e4],
        6: [120, 12e3],
        7: [140, 15e3],
        8: [180, 2e4],
        9: [220, 25e3],
        10: [260, 3e4],
        11: [350, 4e4],
        12: [440, 5e4]
    }, word_list_count = 0,
    Words = {};
    var ended = false;


var initialModal = function () { bootbox.dialog({
                title: "Wordsmith.es",
                message: '<div class="row">  ' +
                    '<div class="col-md-12"> ' +
                    '<form class="form-horizontal"> ' +
                    '<div class="form-group"> ' +
                    '<label class="col-md-4 control-label" for="name">Just Play</label> ' +
                    '<div class="col-md-4"> ' +
                    '<input id="name" name="name" type="text" placeholder="Your name" class="form-control input-md"> ' +
                    '<span class="help-block">Or, <a href="http://localhost:3700/signup">signup</a>' +
                    ' or <a href="http://localhost:3700/login">login</a> to track your multiplayer scores!</span> </div> ' +
                    '</div> ' +


                    '</div> </div>' +
                    '</form> </div>  </div>',
                buttons: {
                    success: {
                        label: "1 Player",
                        className: "btn-success",
                        callback: function () {
                            var username = $('#name').val();
                            sessionStorage.setItem('username', username) || 'Unnamed Player';
                            start();
                        }
                    },
                    multiplayer: {
                        label: "Multiplayer"

                    }
                }
            }
        );
}

var loggedInModal =  function () { bootbox.dialog({
                title: "Wordsmith.es",
                message: 
                     
                    '<span class="help-block">Play against the clock or other users online! ' +
                    '</span> </div></div> ' +
                    '</div> </div>' +
                    '</form> </div>  </div>',
                buttons: {
                    success: {
                        label: "1 Player",
                        className: "btn-success",
                        callback: function () {
                            var username = $('#name').val();
                            sessionStorage.setItem('username', loggedInUser);
                            start();
                        }
                    },
                    multiplayer: {
                        label: "Multiplayer"

                    }
                }
            }
        );
}

// sessionStorage.getItem("username") ? start() : bootbox.prompt("Name:", function(e) {
//     e.length > 15 && (e = e.slice(0, 15)), sessionStorage.setItem("username", e || "Unnamed Player"), start()
// });

// if user has already played and the browser
// remembers his username, either logged in or as 'guest'
if (sessionStorage.getItem("username")) {
    start();
} else if (typeof loggedInUser !== 'undefined') {

// let logged in user choose single or multiplayer
    loggedInModal();
} else {
    initialModal();
}