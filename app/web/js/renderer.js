var dark = false,
    menu = false;

function theme() {
    const body = document.querySelector('body'),
        loader = document.querySelector('.loader-i'),
        chart = document.querySelector('.chart'),
        button = document.querySelector('#theme'),
        menu = document.querySelector('#menu'),
        sensors = document.querySelector('#extra');
    dark = !dark;
    if (dark) {
        body.style.backgroundColor = 'var(--DC)';
        body.style.color = 'var(--LC)';
        extra.style.backgroundColor = 'var(--DC)';
        extra.style.color = 'var(--LC)';
        loader.style.borderColor = '#00000000 var(--DC) var(--DC) #00000000';
        menu.style.backgroundColor = 'var(--LC)';
        menu.style.color = 'var(--DC)';
        chart.style.borderColor = '#00000000 var(--DC) var(--DC) #00000000';
    }
    else {
        body.style.backgroundColor = 'var(--LC)';
        body.style.color = 'var(--DC)';
        extra.style.backgroundColor = 'var(--LC)';
        extra.style.color = 'var(--DC)';
        loader.style.borderColor = '#00000000 var(--LC) var(--LC) #00000000';
        menu.style.backgroundColor = 'var(--DC)';
        menu.style.color = 'var(--LC)';
        chart.style.borderColor = '#00000000 var(--LC) var(--LC) #00000000';
    }
}

function loadmenu() {
    const sensors = document.querySelector('#extra');
    menu = !menu;
    menu ? sensors.style.display = 'flex' : sensors.style.display = 'none';
}


onload = () => {
    const webview = document.querySelector('webview')
    webview.addEventListener('did-start-loading', loadstart)
	sensors.style.display = 'none';
}

onerror = () => {
    const webview = document.querySelector('webview')
    webview.addEventListener('did-fail-load', loadstart)
	sensors.style.display = 'none';
}

const calculateLayoutSize = () => {
    const webview = document.querySelector("webview");
    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;
    const webviewHeight = windowHeight - 50;

    webview.style.width = windowWidth + "px";
    webview.style.height = webviewHeight + "px";
}

window.addEventListener("DOMContentLoaded", () => {
    window.onresize = calculateLayoutSize;
    const webview = document.querySelector("webview");
    if (document.querySelector("#home")) {
        document.querySelector("#home").onclick = () => {
            const home = document.getElementById("webview").getAttribute("data-home");
            document.querySelector("webview").src = home;
        };
    }
    if (document.querySelector("#back")) {
        document.querySelector("#back").onclick = () => {
            webview.goBack();
        };
    }
    if (document.querySelector("#forward")) {
        document.querySelector("#forward").onclick = () => {
            webview.goForward();
        };
    }
});

loadstart = () => {
    setInterval(function () {
        var xobj = new XMLHttpRequest(),
			data = undefined,
			k = undefined,
			max = undefined,
			total = undefined,
			op = [10, 30, 50, 70, 140],
			hk = document.getElementById("k"),
			clock = document.getElementById("data-1"),
			chart = document.getElementById("donut"),
			date = new Date(),
			hours = date.getHours(),
			minutes = date.getMinutes();

        xobj.overrideMimeType("text/json")
        xobj.open("get", "http://192.168.4.1/update", false)
        xobj.send(null)
        json = JSON.parse(xobj.responseText)
        data = json.data
        k = json.k + 1
        hk.innerHTML = k
        data.forEach(function (item, index) {
            var h = document.getElementById("data-" + index)
            if (item.toString().includes(".")) {
                item = item.toFixed(2)
            }
            h.innerHTML = item
        });

        clock.innerHTML = hours + ":" + minutes
		for (var i = 0; i < op.length; i++) {
			if (data[0] < op[i]) {
				max = op[i];
				break;
			}
		}
		total = (data[0] / 165 * max) + 5;

		chart.style.transform = "rotate(" + total + "deg)";
    }, 250);
}
